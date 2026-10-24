import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Financieel overzicht voor het portaal (pagina "Financiën"), uit Moneybird.
 *
 * Alleen voor admins. De Moneybird-sleutel staat als secret op de server
 * (MONEYBIRD_API_TOKEN) en komt nooit in de browser; het portaal vraagt deze
 * functie om de cijfers en krijgt alleen het resultaat terug.
 *
 * Zonder "actie" haalt één verzoek alles op wat de pagina toont, parallel:
 * - winst en verlies per maand over de laatste 12 maanden;
 * - banksaldo per rekening;
 * - openstaande verkoopfacturen (open, herinnerd, te laat);
 * - wat er aan leveranciers nog betaald moet worden (crediteuren);
 * - de btw van het lopende kwartaal, en van het vorige zolang die aangifte loopt.
 *
 * Elk onderdeel mag los mislukken (bijvoorbeeld als de sleutel een recht mist);
 * dan krijgt alleen dat onderdeel een foutmelding en de rest werkt gewoon.
 *
 * Met een "actie" doet de functie één ding met openstaande facturen:
 * - "herinnering": herinneringen per e-mail naar de klant (ids);
 * - "betaling": een betaling registreren (id, bedrag, datum);
 * - "afboeken": een kleine rest afboeken als betalingsverschil (id);
 * - "pdf": een downloadlink voor de pdf (id), 30 seconden geldig;
 * - "klant": de facturen en betaalcijfers van een klant uit het portaal (clientId);
 * - "uren-factureren": uren van een project als conceptfactuur (projectId,
 *   urenIds, uurtarief, eventueel contactId); de uren worden daarna als
 *   gefactureerd gemarkeerd. Er wordt niets naar de klant verstuurd;
 * - "uren-vrijgeven": uren weer vrijgeven als hun concept in Moneybird is
 *   weggegooid (factuurId).
 * De pagina vraagt altijd eerst om bevestiging; hier wordt alles nog eens
 * gecontroleerd tegen de facturen zoals Moneybird ze nu kent.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MONEYBIRD_TOKEN = Deno.env.get("MONEYBIRD_API_TOKEN");
const ADMINISTRATIE = (Deno.env.get("MONEYBIRD_ADMINISTRATIE_ID") ?? "").trim();

/** Tot dit bedrag mag een rest worden afgeboekt; hetzelfde getal staat in het portaal. */
const AFBOEK_GRENS = 5;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const antwoord = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

/** Moneybird geeft bedragen als tekst ("100.0"); het portaal rekent met getallen. */
const getal = (waarde: unknown) => {
  const n = Number.parseFloat(String(waarde ?? "0"));
  return Number.isFinite(n) ? n : 0;
};

/** Een fout die de gebruiker te zien krijgt, met een passende status. */
class Melding extends Error {
  constructor(bericht: string, readonly status = 400) {
    super(bericht);
  }
}

async function moneybird(pad: string, init: { method?: string; body?: unknown } = {}): Promise<unknown> {
  const res = await fetch(`https://moneybird.com/api/v2/${ADMINISTRATIE}/${pad}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${MONEYBIRD_TOKEN}`,
      Accept: "application/json",
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
  });
  if (!res.ok) {
    const tekst = await res.text().catch(() => "");
    if (res.status === 401) throw new Error("Moneybird weigert de sleutel (401). Klopt MONEYBIRD_API_TOKEN nog?");
    if (res.status === 403) throw new Error("De Moneybird-sleutel mist een recht voor dit onderdeel (403).");
    if (res.status === 404) throw new Error("Moneybird kent deze administratie of factuur niet (404).");
    if (res.status === 429) throw new Error("Te veel verzoeken aan Moneybird; probeer het over een paar minuten opnieuw.");
    if (res.status === 422) {
      // Moneybird legt bij 422 uit wat er niet klopt; die uitleg doorgeven.
      let uitleg = tekst;
      try {
        const json = JSON.parse(tekst) as { error?: unknown };
        uitleg = typeof json.error === "string" ? json.error : JSON.stringify(json.error ?? json);
      } catch {
        // geen JSON: de tekst zelf gebruiken
      }
      throw new Melding(`Moneybird weigert dit: ${uitleg.slice(0, 300)}`);
    }
    throw new Error(`Moneybird gaf status ${res.status}${tekst ? `: ${tekst.slice(0, 200)}` : ""}`);
  }
  const tekst = await res.text();
  return tekst ? JSON.parse(tekst) : null;
}

/** Een onderdeel ophalen; een fout wordt een melding in plaats van een afgebroken pagina. */
async function onderdeel<T>(fn: () => Promise<T>): Promise<{ data: T } | { fout: string }> {
  try {
    return { data: await fn() };
  } catch (fout) {
    return { fout: fout instanceof Error ? fout.message : String(fout) };
  }
}

/** "202410": jaar en maand zonder streepje, zoals Moneybird periodes schrijft. */
const maandCode = (d: Date) => `${d.getUTCFullYear()}${`${d.getUTCMonth() + 1}`.padStart(2, "0")}`;

interface MoneybirdFactuur {
  id: string;
  invoice_id: string | null;
  state: string;
  invoice_date: string | null;
  due_date: string | null;
  total_price_incl_tax: unknown;
  total_unpaid: unknown;
  contact_id: string;
  workflow_id: string | null;
  document_style_id: string | null;
  identity_id: string | null;
  original_sales_invoice_id: string | null;
  contact?: {
    company_name?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    send_invoices_to_email?: string;
  } | null;
}

/** De openstaande facturen zoals Moneybird ze nu kent. Eén pagina van 100 is ruim genoeg voor een klein bureau. */
async function openFacturen(): Promise<MoneybirdFactuur[]> {
  const filter = encodeURIComponent("state:open|late|reminded|pending_payment");
  return (await moneybird(`sales_invoices.json?per_page=100&filter=${filter}`)) as MoneybirdFactuur[];
}

const klantNaam = (f: MoneybirdFactuur) =>
  f.contact?.company_name ||
  [f.contact?.firstname, f.contact?.lastname].filter(Boolean).join(" ") ||
  "Onbekende klant";

const isId = (waarde: unknown): waarde is string => typeof waarde === "string" && /^\d{1,30}$/.test(waarde);

/** Vandaag in Nederland, als YYYY-MM-DD. */
const vandaag = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(new Date());

/** Bedragen als tekst met twee decimalen, zoals Moneybird ze verwacht. */
const bedragTekst = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

interface MoneybirdContact {
  id: string;
  company_name?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  send_invoices_to_email?: string | null;
}

const contactNaam = (c: MoneybirdContact) =>
  c.company_name || [c.firstname, c.lastname].filter(Boolean).join(" ") || "Naamloos contact";

/** "Toptas Consultancy B.V." en "toptas consultancy" zijn dezelfde klant. */
const naamSleutel = (naam: string) =>
  naam
    .toLowerCase()
    .replace(/\b(b\.?v\.?|v\.?o\.?f\.?|n\.?v\.?|holding)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

interface PortaalKlant {
  id: string;
  name: string;
  email: string | null;
  moneybird_contact_id?: string | null;
  uurtarief_cents?: number | null;
}

/**
 * Het Moneybird-contact bij een klant uit het portaal: het opgeslagen contact,
 * anders een unieke treffer op e-mailadres of naam. Zijn er meerdere of geen
 * treffers, dan komen de kandidaten terug en kiest de gebruiker.
 */
async function zoekContact(
  klant: PortaalKlant,
  gekozen?: unknown,
): Promise<{ contact: MoneybirdContact } | { kandidaten: MoneybirdContact[] }> {
  const vast = isId(gekozen) ? gekozen : klant.moneybird_contact_id;
  if (isId(vast)) {
    try {
      return { contact: (await moneybird(`contacts/${vast}.json`)) as MoneybirdContact };
    } catch (fout) {
      // Contact verwijderd in Moneybird: opnieuw zoeken. Andere fouten gewoon doorgeven.
      if (!(fout instanceof Error && fout.message.includes("(404)"))) throw fout;
    }
  }
  const zoek = async (q: string) =>
    (await moneybird(`contacts.json?per_page=20&query=${encodeURIComponent(q)}`)) as MoneybirdContact[];

  const email = klant.email?.trim().toLowerCase();
  if (email) {
    const opMail = (await zoek(email)).filter(
      (c) => c.email?.toLowerCase() === email || c.send_invoices_to_email?.toLowerCase() === email,
    );
    if (opMail.length === 1) return { contact: opMail[0]! };
  }
  const opNaam = await zoek(klant.name);
  const exact = opNaam.filter((c) => naamSleutel(contactNaam(c)) === naamSleutel(klant.name));
  if (exact.length === 1) return { contact: exact[0]! };
  return { kandidaten: (exact.length > 1 ? exact : opNaam).slice(0, 8) };
}

const contactUit = (c: MoneybirdContact) => ({
  id: c.id,
  naam: contactNaam(c),
  email: c.send_invoices_to_email || c.email || null,
  url: `https://moneybird.com/${ADMINISTRATIE}/contacts/${c.id}`,
});

async function portaalKlant(id: unknown): Promise<PortaalKlant> {
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) throw new Melding("Onbekende klant.");
  const { data, error } = await admin.from("clients").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Melding("Deze klant bestaat niet (meer).");
  return data as PortaalKlant;
}

/** Een urenregel zoals de serverfunctie hem leest. */
interface Urenregel {
  id: string;
  project_id: string | null;
  started_at: string;
  ended_at: string | null;
  billable: boolean;
  description: string | null;
  gefactureerd_op: string | null;
  task: { title: string } | null;
}

/**
 * Factuurregels uit uren: één regel per taak (of per omschrijving), met de
 * uren in twee decimalen. Het portaal toont vooraf precies dezelfde indeling.
 */
function factuurRegels(regels: Urenregel[]) {
  const groepen = new Map<string, { omschrijving: string; minuten: number; van: string; tot: string }>();
  for (const r of regels) {
    const omschrijving = r.task?.title?.trim() || r.description?.trim() || "Werkzaamheden";
    // Hele minuten per regel, net als de duur die het portaal toont.
    const minuten = Math.max(0, Math.round((new Date(r.ended_at!).getTime() - new Date(r.started_at).getTime()) / 60000));
    const dag = r.started_at.slice(0, 10);
    const groep = groepen.get(omschrijving) ?? { omschrijving, minuten: 0, van: dag, tot: dag };
    groep.minuten += minuten;
    if (dag < groep.van) groep.van = dag;
    if (dag > groep.tot) groep.tot = dag;
    groepen.set(omschrijving, groep);
  }
  return [...groepen.values()];
}

async function voerUit(actie: string, body: Record<string, unknown>): Promise<unknown> {
  if (actie === "klant") {
    const klant = await portaalKlant(body.clientId);
    const gevonden = await zoekContact(klant);
    if (!("contact" in gevonden)) return { ok: true, contact: null };
    const contact = gevonden.contact;

    // Het laatste jaar aan facturen van deze klant, zonder concepten.
    const nu = new Date();
    const jaarGeleden = new Date(Date.UTC(nu.getUTCFullYear() - 1, nu.getUTCMonth(), nu.getUTCDate()));
    const dag = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
    const filter = encodeURIComponent(
      `contact_id:${contact.id},period:${dag(jaarGeleden)}..${dag(nu)},state:open|late|reminded|pending_payment|paid|uncollectible`,
    );
    const facturen = (await moneybird(`sales_invoices.json?per_page=100&filter=${filter}`)) as (MoneybirdFactuur & {
      total_price_excl_tax: unknown;
      paid_at: string | null;
    })[];

    const ditJaar = String(nu.getUTCFullYear());
    const open = facturen.filter((f) => f.state !== "paid" && f.state !== "uncollectible");
    const betaald = facturen.filter((f) => f.state === "paid" && f.paid_at && f.invoice_date);
    const betaaldagen = betaald.map((f) =>
      Math.max(0, Math.round((new Date(f.paid_at!).getTime() - new Date(f.invoice_date!).getTime()) / 86400000)),
    );

    // Als het contact nog niet vastlag, nu wel: dan hoeft er niet meer gezocht te worden.
    if (klant.moneybird_contact_id !== contact.id) {
      await admin.from("clients").update({ moneybird_contact_id: contact.id }).eq("id", klant.id);
    }

    return {
      ok: true,
      contact: contactUit(contact),
      omzetDitJaar: facturen
        .filter((f) => (f.invoice_date ?? "").startsWith(ditJaar))
        .reduce((som, f) => som + getal(f.total_price_excl_tax), 0),
      open: open.reduce((som, f) => som + getal(f.total_unpaid), 0),
      openAantal: open.filter((f) => getal(f.total_unpaid) > 0).length,
      teLaat: open.filter((f) => getal(f.total_unpaid) > 0 && (f.state === "late" || f.state === "reminded")).length,
      betaaldagen: betaaldagen.length > 0 ? Math.round(betaaldagen.reduce((a, b) => a + b, 0) / betaaldagen.length) : null,
      facturen: [...facturen]
        .sort((a, b) => (b.invoice_date ?? "").localeCompare(a.invoice_date ?? ""))
        .slice(0, 5)
        .map((f) => ({
          id: f.id,
          nummer: f.invoice_id,
          status: f.state,
          datum: f.invoice_date,
          totaal: getal(f.total_price_incl_tax),
          open: getal(f.total_unpaid),
          url: `https://moneybird.com/${ADMINISTRATIE}/sales_invoices/${f.id}`,
        })),
    };
  }

  if (actie === "uren-factureren") {
    const projectId = body.projectId;
    if (typeof projectId !== "string" || !/^[0-9a-f-]{36}$/i.test(projectId)) throw new Melding("Onbekend project.");
    const ids = Array.isArray(body.urenIds) ? body.urenIds.filter((x): x is string => typeof x === "string") : [];
    if (ids.length === 0) throw new Melding("Geen uren gekozen.");
    const tarief = typeof body.uurtarief === "number" ? Math.round(body.uurtarief * 100) / 100 : NaN;
    if (!Number.isFinite(tarief) || tarief <= 0) throw new Melding("Vul een uurtarief in.");

    const { data: project, error: projectFout } = await admin
      .from("projects")
      .select("id, name, client_id")
      .eq("id", projectId)
      .maybeSingle();
    if (projectFout) throw new Error(projectFout.message);
    if (!project?.client_id) throw new Melding("Dit project hoort niet bij een klant.");
    const klant = await portaalKlant(project.client_id);

    // Eerst de uren controleren, pas daarna iets in Moneybird aanmaken.
    const { data: regels, error: urenFout } = await admin
      .from("time_entries")
      .select("id, project_id, started_at, ended_at, billable, description, gefactureerd_op, task:tasks(title)")
      .in("id", ids);
    if (urenFout) {
      if (/gefactureerd_op|column/i.test(urenFout.message)) {
        throw new Melding("De database mist nog de kolommen voor facturatie. Voer eerst de migratie uit in Lovable.");
      }
      throw new Error(urenFout.message);
    }
    const lijst = (regels ?? []) as unknown as Urenregel[];
    if (lijst.length !== ids.length) throw new Melding("Een deel van deze uren bestaat niet meer. Vernieuw de pagina.");
    for (const r of lijst) {
      if (r.project_id !== projectId) throw new Melding("Er zitten uren van een ander project tussen.");
      if (!r.billable) throw new Melding("Er zitten interne uren tussen; die worden niet gefactureerd.");
      if (!r.ended_at) throw new Melding("Er loopt nog een timer op deze uren. Stop die eerst.");
      if (r.gefactureerd_op) throw new Melding("Een deel van deze uren is al gefactureerd. Vernieuw de pagina.");
    }

    const gevonden = await zoekContact(klant, body.contactId);
    if (!("contact" in gevonden)) {
      return { ok: false, kiesContact: gevonden.kandidaten.map(contactUit) };
    }
    const contact = gevonden.contact;

    const regelsOpFactuur = factuurRegels(lijst);
    const periode = (van: string, tot: string) => `${van.replaceAll("-", "")}..${tot.replaceAll("-", "")}`;
    const factuur = (await moneybird("sales_invoices.json", {
      method: "POST",
      body: {
        sales_invoice: {
          contact_id: contact.id,
          reference: `Uren ${project.name}`.slice(0, 100),
          prices_are_incl_tax: false,
          details_attributes: regelsOpFactuur.map((g, i) => ({
            description: g.omschrijving,
            amount: (Math.round((g.minuten / 60) * 100) / 100).toFixed(2),
            price: tarief.toFixed(2),
            period: periode(g.van, g.tot),
            row_order: i,
          })),
        },
      },
    })) as { id: string };

    // De uren vastzetten op deze factuur; alleen regels die nog vrij waren.
    const { error: markeerFout } = await admin
      .from("time_entries")
      .update({ gefactureerd_op: new Date().toISOString(), moneybird_factuur_id: factuur.id })
      .in("id", ids)
      .is("gefactureerd_op", null);
    if (markeerFout) console.error("uren markeren mislukt:", markeerFout.message);

    await admin
      .from("clients")
      .update({ moneybird_contact_id: contact.id, uurtarief_cents: Math.round(tarief * 100) })
      .eq("id", klant.id);

    return {
      ok: true,
      factuurUrl: `https://moneybird.com/${ADMINISTRATIE}/sales_invoices/${factuur.id}`,
      ...(markeerFout ? { waarschuwing: "De factuur staat in Moneybird, maar de uren konden niet als gefactureerd worden gemarkeerd." } : {}),
    };
  }

  if (actie === "uren-vrijgeven") {
    // Als een conceptfactuur in Moneybird is weggegooid: de uren weer vrijgeven.
    const factuurId = body.factuurId;
    if (!isId(factuurId)) throw new Melding("Onbekende factuur.");
    let bestaat = true;
    try {
      await moneybird(`sales_invoices/${factuurId}.json`);
    } catch (fout) {
      if (fout instanceof Error && fout.message.includes("(404)")) bestaat = false;
      else throw fout;
    }
    if (bestaat) throw new Melding("Deze factuur bestaat nog in Moneybird. Verwijder hem daar eerst als de uren opnieuw gefactureerd moeten worden.");
    const { error } = await admin
      .from("time_entries")
      .update({ gefactureerd_op: null, moneybird_factuur_id: null })
      .eq("moneybird_factuur_id", factuurId);
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  if (actie === "pdf") {
    if (!isId(body.id)) throw new Melding("Onbekende factuur.");
    // Moneybird stuurt door naar een tijdelijke link; die link is wat het portaal opent.
    const res = await fetch(`https://moneybird.com/api/v2/${ADMINISTRATIE}/sales_invoices/${body.id}/download_pdf.json`, {
      headers: { Authorization: `Bearer ${MONEYBIRD_TOKEN}` },
      redirect: "manual",
    });
    const url = res.headers.get("Location");
    await res.body?.cancel();
    if (!url) throw new Error(`Moneybird gaf geen pdf-link (status ${res.status}).`);
    return { url };
  }

  const facturen = await openFacturen();
  const vind = (id: unknown) => {
    const f = isId(id) ? facturen.find((x) => x.id === id) : undefined;
    if (!f) throw new Melding("Deze factuur staat niet (meer) open in Moneybird. Vernieuw de pagina.");
    return f;
  };

  if (actie === "herinnering") {
    const ids = Array.isArray(body.ids) ? body.ids : [];
    if (ids.length === 0) throw new Melding("Geen facturen gekozen.");
    const gekozen = ids.map(vind);
    for (const f of gekozen) {
      if (getal(f.total_unpaid) <= 0) throw new Melding(`${f.invoice_id ?? "Deze factuur"} is een creditfactuur; daar gaat geen herinnering voor.`);
      if (f.state === "pending_payment") throw new Melding(`Voor ${f.invoice_id} is de betaling al onderweg.`);
      if (!f.workflow_id || !f.document_style_id || !f.identity_id) {
        throw new Melding(`${f.invoice_id} mist een workflow of huisstijl in Moneybird; stuur deze herinnering vanuit Moneybird.`);
      }
    }
    // Moneybird verstuurt herinneringen per klant; facturen van dezelfde klant
    // (met dezelfde workflow en huisstijl) gaan samen in één mail.
    const groepen = new Map<string, MoneybirdFactuur[]>();
    for (const f of gekozen) {
      const sleutel = [f.contact_id, f.workflow_id, f.document_style_id, f.identity_id].join("|");
      groepen.set(sleutel, [...(groepen.get(sleutel) ?? []), f]);
    }
    await moneybird("sales_invoices/send_reminders.json", {
      method: "POST",
      body: {
        sales_invoice_reminders: [...groepen.values()].map((groep) => ({
          contact_id: groep[0]!.contact_id,
          workflow_id: groep[0]!.workflow_id,
          document_style_id: groep[0]!.document_style_id,
          identity_id: groep[0]!.identity_id,
          sales_invoice_ids: groep.map((f) => f.id),
          delivery_method: "Email",
        })),
      },
    });
    return { ok: true, verstuurd: groepen.size, facturen: gekozen.length };
  }

  if (actie === "betaling") {
    const f = vind(body.id);
    const open = getal(f.total_unpaid);
    const bedrag = typeof body.bedrag === "number" ? Math.round(body.bedrag * 100) / 100 : NaN;
    const datum = typeof body.datum === "string" ? body.datum : "";
    if (open <= 0) throw new Melding("Dit is een creditfactuur; verwerk die in Moneybird.");
    if (!Number.isFinite(bedrag) || bedrag <= 0) throw new Melding("Vul een bedrag in.");
    if (bedrag > open + 0.005) throw new Melding(`Het bedrag is hoger dan wat er openstaat (${bedragTekst(open)}).`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum) || datum > vandaag()) throw new Melding("Kies een betaaldatum, vandaag of eerder.");
    await moneybird(`sales_invoices/${f.id}/payments.json`, {
      method: "POST",
      body: { payment: { payment_date: datum, price: bedragTekst(bedrag) } },
    });
    return { ok: true };
  }

  if (actie === "afboeken") {
    const f = vind(body.id);
    const open = getal(f.total_unpaid);
    if (open <= 0) throw new Melding("Er staat niets open om af te boeken.");
    if (open > AFBOEK_GRENS) throw new Melding(`Alleen resten tot € ${AFBOEK_GRENS} kunnen hier worden afgeboekt.`);
    // Als betalingsverschil, zoals "Afboeken" in Moneybird zelf: de factuur
    // is daarna betaald en het verschil gaat naar de grootboekrekening voor
    // betalingsverschillen.
    await moneybird(`sales_invoices/${f.id}/payments.json`, {
      method: "POST",
      body: { payment: { payment_date: vandaag(), price: bedragTekst(open), manual_payment_action: "rounding_error" } },
    });
    return { ok: true };
  }

  throw new Melding("Onbekende actie.");
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return antwoord({ error: "Alleen POST" }, 405);

  try {
    // Alleen ingelogde admins.
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: gebruiker, error: authFout } = await admin.auth.getUser(jwt);
    if (authFout || !gebruiker?.user) return antwoord({ error: "Niet ingelogd" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: gebruiker.user.id, _role: "admin" });
    if (!isAdmin) return antwoord({ error: "Geen toegang" }, 403);

    // Nog niet ingesteld: geen fout, maar een duidelijke stand voor de pagina.
    if (!MONEYBIRD_TOKEN || !/^\d+$/.test(ADMINISTRATIE)) {
      return antwoord({ ingesteld: false });
    }

    const body = ((await req.json().catch(() => ({}))) ?? {}) as Record<string, unknown>;
    if (typeof body.actie === "string") {
      try {
        return antwoord(await voerUit(body.actie, body));
      } catch (fout) {
        if (fout instanceof Melding) return antwoord({ error: fout.message }, fout.status);
        throw fout;
      }
    }

    const nu = new Date();
    const eerste = new Date(Date.UTC(nu.getUTCFullYear(), nu.getUTCMonth() - 11, 1));
    const periode = `${maandCode(eerste)}..${maandCode(nu)}`;

    // Btw: het lopende kwartaal en, tot de aangifte ervan uiterlijk binnen
    // moet zijn (de laatste dag van de maand na het kwartaal), het vorige.
    const kwartaalStart = (jaar: number, k: number) => new Date(Date.UTC(jaar, k * 3, 1));
    const kwartalen = (() => {
      const k = Math.floor(nu.getUTCMonth() / 3);
      const lijst = [{ jaar: nu.getUTCFullYear(), k }];
      // In de eerste maand van een kwartaal loopt de aangifte van het vorige nog.
      if (nu.getUTCMonth() % 3 === 0) lijst.unshift(k === 0 ? { jaar: nu.getUTCFullYear() - 1, k: 3 } : { jaar: nu.getUTCFullYear(), k: k - 1 });
      return lijst.map(({ jaar, k: q }) => {
        const van = kwartaalStart(jaar, q);
        const tot = new Date(Date.UTC(jaar, q * 3 + 2, 1));
        // Laatste dag van de maand na het kwartaal.
        const deadline = new Date(Date.UTC(jaar, q * 3 + 4, 0));
        return {
          label: `Q${q + 1} ${jaar}`,
          periode: `${maandCode(van)}..${maandCode(tot)}`,
          lopend: nu < new Date(Date.UTC(jaar, q * 3 + 3, 1)),
          deadline: deadline.toISOString().slice(0, 10),
        };
      });
    })();

    const [winstVerlies, bank, facturen, crediteuren, btw] = await Promise.all([
      onderdeel(async () => {
        const r = (await moneybird(`reports/profit_loss.json?period=${periode}&granularity=month`)) as {
          periods?: Record<string, unknown>[];
        };
        return (r.periods ?? []).map((p) => ({
          // "202410..202410" wordt "2024-10".
          maand: String(p.period ?? "").slice(0, 6).replace(/^(\d{4})(\d{2})$/, "$1-$2"),
          omzet: getal(p.total_revenue),
          kosten: getal(p.total_expenses),
          winst: getal(p.net_profit),
        }));
      }),
      onderdeel(async () => {
        const r = (await moneybird("reports/bank_balance.json")) as {
          total?: unknown;
          financial_accounts?: { name?: string; type?: string; balance?: unknown }[];
        };
        return {
          totaal: getal(r.total),
          rekeningen: (r.financial_accounts ?? []).map((a) => ({
            naam: a.name?.trim() || "",
            soort: a.type ?? "",
            saldo: getal(a.balance),
          })),
        };
      }),
      onderdeel(async () =>
        (await openFacturen()).map((f) => ({
          id: f.id,
          nummer: f.invoice_id,
          status: f.state,
          datum: f.invoice_date,
          vervaldatum: f.due_date,
          totaal: getal(f.total_price_incl_tax),
          open: getal(f.total_unpaid),
          klant: klantNaam(f),
          // Waar Moneybird facturen en herinneringen heen mailt.
          email: f.contact?.send_invoices_to_email?.trim() || f.contact?.email?.trim() || null,
          credit: Boolean(f.original_sales_invoice_id) || getal(f.total_unpaid) < 0,
          kanHerinneren: Boolean(f.workflow_id && f.document_style_id && f.identity_id),
          url: `https://moneybird.com/${ADMINISTRATIE}/sales_invoices/${f.id}`,
        })),
      ),
      onderdeel(async () => {
        const r = (await moneybird("reports/creditors.json?per_page=100")) as {
          creditors?: { amount?: unknown }[];
        };
        return { totaal: (r.creditors ?? []).reduce((som, c) => som + getal(c.amount), 0) };
      }),
      onderdeel(async () =>
        Promise.all(
          kwartalen.map(async (q) => {
            const r = (await moneybird(`reports/tax.json?period=${q.periode}`)) as {
              tax_rates?: { report_reference?: string; type?: string; tax?: unknown }[];
            };
            // Rubriek 5b is voorbelasting (wat je terugkrijgt); de rest is wat je verschuldigd bent.
            let verschuldigd = 0;
            let voorbelasting = 0;
            for (const t of r.tax_rates ?? []) {
              const terug = t.report_reference ? /^NL\/5/i.test(t.report_reference) : t.type !== "sales_invoice";
              if (terug) voorbelasting += getal(t.tax);
              else verschuldigd += getal(t.tax);
            }
            return {
              label: q.label,
              lopend: q.lopend,
              deadline: q.deadline,
              verschuldigd,
              voorbelasting,
              afdragen: verschuldigd - voorbelasting,
            };
          }),
        ),
      ),
    ]);

    return antwoord({
      ingesteld: true,
      bijgewerkt: nu.toISOString(),
      moneybirdUrl: `https://moneybird.com/${ADMINISTRATIE}`,
      winstVerlies,
      bank,
      facturen,
      crediteuren,
      btw,
    });
  } catch (fout) {
    console.error("moneybird-financien:", fout);
    return antwoord({ error: fout instanceof Error ? fout.message : "Er ging iets mis" }, 500);
  }
});
