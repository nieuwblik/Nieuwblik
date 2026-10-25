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
 * - de btw van het lopende kwartaal, en van het vorige zolang die aangifte loopt;
 * - uitgaven van het laatste jaar per leverancier en categorie, en de recentste;
 * - betalingen van klanten in de laatste twee weken (voor meldingen);
 * - offertes die uitstaan of geaccepteerd zijn (vraagt het recht "estimates").
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
 * - "uren-factureren": uren als conceptfactuur, van één project (projectId)
 *   of van een klant met en zonder project (clientId), met urenIds,
 *   uurtarief en eventueel contactId; de uren worden daarna als
 *   gefactureerd gemarkeerd. Er wordt niets naar de klant verstuurd;
 * - "uren-vrijgeven": uren weer vrijgeven als hun concept in Moneybird is
 *   weggegooid (factuurId);
 * - "btw-overzicht": btw per kwartaal met de rubrieken, dit jaar en vorig jaar;
 * - "omzet-historie": omzet, kosten en winst per kwartaal, vier jaar terug;
 * - "bank-zonder-bon": afschrijvingen van één kwartaal, verdeeld in met bon,
 *   zonder bon, niet verwerkt en geen kosten (jaar, kwartaal);
 * - "klanten-aanvullen": voorstellen om ontbrekende klantgegevens (e-mail,
 *   telefoon, plaats, contactpersoon) uit Moneybird-contacten te vullen;
 * - "hosting-uit-moneybird": actieve terugkerende facturen als voorstel voor
 *   hostingcontracten in het portaal;
 * - "document-gegevens": producten en btw-tarieven voor het opstellen;
 * - "document-maken": een offerte of factuur aanmaken (als concept, of na
 *   bevestiging in het portaal ook versturen), voor een gekozen contact, een
 *   klant uit het portaal of een nieuw contact;
 * - "offerte-actie": versturen, pdf, accepteren, afwijzen, archiveren of
 *   omzetten naar factuur;
 * - "hosting-factureren": hostingtermijnen als conceptfactuur (items met
 *   clientId en periodDate, eventueel contactId); de termijn wordt daarna in
 *   het portaal als gefactureerd afgevinkt;
 * - "terugkerend-maken": een hostingcontract als terugkerende factuur in
 *   Moneybird (clientId, eersteFactuur, automatischVersturen, eventueel
 *   contactId); het contract staat daarna in het portaal als "via Moneybird";
 * - "machtiging-link": een link voor een incassomachtiging via Moneybird
 *   Payments (clientId, eventueel contactId);
 * - "contact-bijwerken": e-mail, telefoon, plaats en contactpersoon van een
 *   klant naar het gekoppelde Moneybird-contact (clientId);
 * - "contact-aanmaken": een klant uit het portaal in Moneybird zetten; koppelt aan
 *   een bestaand contact als dat er is (clientId, eventueel contactId of nieuw);
 * - "contact-archiveren": een contact in Moneybird archiveren (contactId).
 *
 * Als formulier (multipart) met actie "bon-uploaden": foto's of pdf's van bonnen
 * en inkoopfacturen naar de inbox van Moneybird (bestand, eventueel omschrijving).
 * De pagina vraagt altijd eerst om bevestiging; hier wordt alles nog eens
 * gecontroleerd tegen de facturen zoals Moneybird ze nu kent.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MONEYBIRD_TOKEN = Deno.env.get("MONEYBIRD_API_TOKEN");
const ADMINISTRATIE = (Deno.env.get("MONEYBIRD_ADMINISTRATIE_ID") ?? "").trim();

/** Tot dit bedrag mag een rest worden afgeboekt; hetzelfde getal staat in het portaal. */
const AFBOEK_GRENS = 5;

/** Begin van de contractnotitie voor hosting via Moneybird; dezelfde tekst staat in het portaal. */
const MONEYBIRD_NOTITIE = "Moneybird: terugkerende factuur";

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
  phone?: string | null;
  city?: string | null;
  contact_people?: { firstname?: string | null; lastname?: string | null }[] | null;
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
  /** De klant van een regel zonder project (migratie uren_klant). */
  client_id: string | null;
  project: { client_id: string | null } | null;
  started_at: string;
  ended_at: string | null;
  billable: boolean;
  description: string | null;
  gefactureerd_op: string | null;
  task: { title: string } | null;
}

/**
 * Factuurregels uit uren: één regel per taak (of per omschrijving), met elke
 * registratie per begonnen kwartier geteld. Het portaal toont vooraf precies
 * dezelfde indeling en bedragen.
 */
function factuurRegels(regels: Urenregel[]) {
  const groepen = new Map<string, { omschrijving: string; minuten: number; van: string; tot: string }>();
  for (const r of regels) {
    const omschrijving = r.task?.title?.trim() || r.description?.trim() || "Werkzaamheden";
    // Elke registratie telt per begonnen kwartier (1 minuut wordt 15), net als
    // de duur die het portaal toont; ook een paar seconden is begonnen werk.
    const ms = Math.max(0, new Date(r.ended_at!).getTime() - new Date(r.started_at).getTime());
    const echt = ms > 0 ? Math.max(1, Math.round(ms / 60000)) : 0;
    const minuten = Math.ceil(echt / 15) * 15;
    const dag = r.started_at.slice(0, 10);
    const groep = groepen.get(omschrijving) ?? { omschrijving, minuten: 0, van: dag, tot: dag };
    groep.minuten += minuten;
    if (dag < groep.van) groep.van = dag;
    if (dag > groep.tot) groep.tot = dag;
    groepen.set(omschrijving, groep);
  }
  return [...groepen.values()];
}

/** Alle pagina's van een lijst ophalen, tot een redelijk maximum. */
async function allePaginas<T>(pad: string, maxPaginas = 5): Promise<T[]> {
  const lijst: T[] = [];
  for (let pagina = 1; pagina <= maxPaginas; pagina++) {
    const deel = (await moneybird(`${pad}${pad.includes("?") ? "&" : "?"}per_page=100&page=${pagina}`)) as T[];
    lijst.push(...deel);
    if (deel.length < 100) break;
  }
  return lijst;
}

const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

/** De omschrijving en periode van een hostingtermijn op de factuur. */
function hostingRegel(periodDate: string, cyclus: string) {
  const [jaar, maand, dag] = periodDate.split("-").map(Number) as [number, number, number];
  const van = new Date(Date.UTC(jaar, maand - 1, dag));
  const tot = cyclus === "jaarlijks"
    ? new Date(Date.UTC(jaar + 1, maand - 1, dag - 1))
    : new Date(Date.UTC(jaar, maand, dag - 1));
  const kort = (d: Date) => `${MAANDEN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  const code = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
  return {
    omschrijving: cyclus === "jaarlijks" ? `Hosting ${kort(van)} t/m ${kort(tot)}` : `Hosting ${kort(van)}`,
    periode: `${code(van)}..${code(tot)}`,
  };
}

/** "202507..202509" wordt { label: "Q3 2025", jaar, kwartaal }. */
function kwartaalUit(periode: string) {
  const jaar = Number(periode.slice(0, 4));
  const kwartaal = Math.floor((Number(periode.slice(4, 6)) - 1) / 3);
  return { jaar, kwartaal, label: `Q${kwartaal + 1} ${jaar}` };
}

/** Een jaar als Moneybird-periode, voor het lopende jaar tot en met deze maand. */
function jaarPeriode(jaar: number, nu: Date) {
  const tot = jaar === nu.getUTCFullYear() ? nu.getUTCMonth() + 1 : 12;
  return `${jaar}01..${jaar}${`${tot}`.padStart(2, "0")}`;
}

/** Rubriek 5b is voorbelasting (wat je terugkrijgt); de rest is wat je verschuldigd bent. */
const isVoorbelasting = (t: { report_reference?: string; type?: string }) =>
  t.report_reference ? /^NL\/5/i.test(t.report_reference) : t.type !== "sales_invoice";

/** Boekingen die geen kosten zijn: privé, belastingen, overboekingen tussen eigen rekeningen. */
const GEEN_KOSTEN = /priv|btw|belasting|loonheffing|kruispost|overboek|onderling|vennoot|lening|rekening.courant|aflossing/i;

type Mutatie = {
  id: string;
  amount: unknown;
  date: string;
  message: string | null;
  contra_account_name: string | null;
  state: string;
  payments?: unknown[] | null;
  ledger_account_bookings?: { ledger_account_id?: string | null; price?: unknown; price_base?: unknown }[] | null;
};

/**
 * Banktransacties van één periode. Moneybird geeft er hooguit 100 per
 * verzoek en kent geen pagina's; bij een volle lijst wordt de periode
 * gehalveerd tot alles binnen is.
 */
async function mutaties(van: Date, tot: Date): Promise<Mutatie[]> {
  const code = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
  const filter = encodeURIComponent(`period:${code(van)}..${code(tot)}`);
  const lijst = (await moneybird(`financial_mutations.json?filter=${filter}`)) as Mutatie[];
  const dagen = Math.round((tot.getTime() - van.getTime()) / 86400000);
  if (lijst.length < 100 || dagen < 1) return lijst;
  const midden = new Date(van.getTime() + Math.floor(dagen / 2) * 86400000);
  const [a, b] = await Promise.all([mutaties(van, midden), mutaties(new Date(midden.getTime() + 86400000), tot)]);
  return [...a, ...b];
}

/** Moneybird-frequenties die het portaal als hostingcyclus kent. */
const CYCLUS: Record<string, string> = { month: "maandelijks", year: "jaarlijks" };

async function voerUit(actie: string, body: Record<string, unknown>, userId: string): Promise<unknown> {
  if (actie === "klanten-aanvullen") {
    // Klanten waar iets ontbreekt: e-mail, telefoon, plaats of contactpersoon.
    const { data: klanten, error } = await admin
      .from("clients")
      .select("id, name, email, phone, city, contact_name, moneybird_contact_id")
      .order("name");
    if (error) throw new Error(error.message);
    type Klant = PortaalKlant & { phone: string | null; city: string | null; contact_name: string | null };
    const leeg = (v: string | null | undefined) => !v || !v.trim();
    const onvolledig = ((klanten ?? []) as Klant[]).filter(
      (k) => leeg(k.email) || leeg(k.phone) || leeg(k.city) || leeg(k.contact_name),
    );

    const voorstellen: unknown[] = [];
    const zonderContact: { clientId: string; naam: string }[] = [];
    const twijfel: { clientId: string; naam: string }[] = [];
    for (const k of onvolledig) {
      const gevonden = await zoekContact(k);
      if (!("contact" in gevonden)) {
        (gevonden.kandidaten.length > 0 ? twijfel : zonderContact).push({ clientId: k.id, naam: k.name });
        continue;
      }
      const c = gevonden.contact;
      const persoon =
        c.company_name && (c.firstname || c.lastname)
          ? [c.firstname, c.lastname].filter(Boolean).join(" ")
          : c.contact_people?.[0]
            ? [c.contact_people[0].firstname, c.contact_people[0].lastname].filter(Boolean).join(" ")
            : "";
      const velden: Record<string, string> = {};
      const email = (c.send_invoices_to_email || c.email || "").trim();
      if (leeg(k.email) && email) velden.email = email;
      if (leeg(k.phone) && c.phone?.trim()) velden.phone = c.phone.trim();
      if (leeg(k.city) && c.city?.trim()) velden.city = c.city.trim();
      if (leeg(k.contact_name) && persoon.trim()) velden.contact_name = persoon.trim();
      if (Object.keys(velden).length === 0) continue;
      voorstellen.push({ clientId: k.id, klant: k.name, contact: contactUit(c), velden });
    }
    return { ok: true, voorstellen, zonderContact, twijfel };
  }

  if (actie === "document-gegevens") {
    // Wat het venster "Offerte of factuur opstellen" nodig heeft: producten
    // (vaste diensten met prijs) en de btw-tarieven voor verkoop.
    const [producten, tarieven] = await Promise.all([
      allePaginas<{ id: string; title?: string | null; description?: string | null; price?: unknown; tax_rate_id?: string | null }>(
        "products.json",
      ).catch(() => []),
      moneybird(`tax_rates.json?filter=${encodeURIComponent("tax_rate_type:sales_invoice,active:true")}`) as Promise<
        { id: string; name: string; percentage: unknown }[]
      >,
    ]);
    return {
      ok: true,
      producten: producten.map((p) => ({
        id: p.id,
        naam: p.title?.trim() || p.description?.trim() || "Product",
        omschrijving: p.description?.trim() || p.title?.trim() || "",
        prijs: getal(p.price),
        btwId: p.tax_rate_id ?? null,
      })),
      btwTarieven: tarieven.map((t) => ({ id: t.id, naam: t.name, percentage: getal(t.percentage) })),
    };
  }

  if (actie === "document-maken") {
    const soort = body.soort === "factuur" ? "factuur" : body.soort === "offerte" ? "offerte" : null;
    if (!soort) throw new Melding("Kies offerte of factuur.");
    type Regel = { omschrijving?: unknown; aantal?: unknown; prijs?: unknown; btwId?: unknown; productId?: unknown };
    const regels = (Array.isArray(body.regels) ? body.regels : []) as Regel[];
    if (regels.length === 0) throw new Melding("Voeg minstens één regel toe.");
    for (const r of regels) {
      if (typeof r.omschrijving !== "string" || !r.omschrijving.trim()) throw new Melding("Elke regel heeft een omschrijving nodig.");
      if (typeof r.prijs !== "number" || !Number.isFinite(r.prijs)) throw new Melding("Elke regel heeft een prijs nodig.");
      if (typeof r.aantal !== "number" || !(r.aantal > 0)) throw new Melding("Elke regel heeft een aantal nodig.");
    }

    // Het contact: gekozen in Moneybird, via een klant in het portaal, of nieuw
    // (bijvoorbeeld vanuit een aanvraag).
    let contactId: string | null = isId(body.contactId) ? body.contactId : null;
    let klantId: string | null = null;
    if (!contactId && typeof body.clientId === "string") {
      const klant = await portaalKlant(body.clientId);
      klantId = klant.id;
      const gevonden = await zoekContact(klant);
      if (!("contact" in gevonden)) return { ok: false, kiesContact: gevonden.kandidaten.map(contactUit) };
      contactId = gevonden.contact.id;
    }
    if (!contactId && body.nieuwContact && typeof body.nieuwContact === "object") {
      const n = body.nieuwContact as { bedrijf?: unknown; naam?: unknown; email?: unknown; telefoon?: unknown };
      const naam = typeof n.naam === "string" ? n.naam.trim() : "";
      const bedrijf = typeof n.bedrijf === "string" ? n.bedrijf.trim() : "";
      if (!naam && !bedrijf) throw new Melding("Het nieuwe contact heeft een naam nodig.");
      const [voornaam, ...rest] = naam.split(/\s+/);
      const email = typeof n.email === "string" ? n.email.trim() : "";
      const nieuw = (await moneybird("contacts.json", {
        method: "POST",
        body: {
          contact: {
            ...(bedrijf ? { company_name: bedrijf } : {}),
            ...(naam ? { firstname: voornaam, lastname: rest.join(" ") || undefined } : {}),
            ...(email ? { email, send_invoices_to_email: email, send_estimates_to_email: email } : {}),
            ...(typeof n.telefoon === "string" && n.telefoon.trim() ? { phone: n.telefoon.trim() } : {}),
          },
        },
      })) as { id: string };
      contactId = nieuw.id;
    }
    if (!contactId) throw new Melding("Kies voor wie het is.");

    const details = regels.map((r, i) => ({
      description: (r.omschrijving as string).trim(),
      amount: String(r.aantal),
      price: (Math.round((r.prijs as number) * 100) / 100).toFixed(2),
      ...(isId(r.btwId) ? { tax_rate_id: r.btwId } : {}),
      ...(isId(r.productId) ? { product_id: r.productId } : {}),
      row_order: i,
    }));
    const referentie = typeof body.referentie === "string" && body.referentie.trim() ? body.referentie.trim().slice(0, 100) : undefined;
    const toelichting = typeof body.toelichting === "string" && body.toelichting.trim() ? body.toelichting.trim() : undefined;

    const document = (await moneybird(soort === "offerte" ? "estimates.json" : "sales_invoices.json", {
      method: "POST",
      body:
        soort === "offerte"
          ? {
              estimate: {
                contact_id: contactId,
                reference: referentie,
                pre_text: toelichting,
                prices_are_incl_tax: false,
                details_attributes: details,
              },
            }
          : {
              sales_invoice: {
                contact_id: contactId,
                reference: referentie,
                prices_are_incl_tax: false,
                details_attributes: details,
              },
            },
    })) as { id: string };

    // Versturen gebeurt pas na een bevestiging in het portaal.
    if (body.versturen === true) {
      await moneybird(
        soort === "offerte" ? `estimates/${document.id}/send_estimate.json` : `sales_invoices/${document.id}/send_invoice.json`,
        {
          method: "PATCH",
          body:
            soort === "offerte"
              ? { estimate_sending: { delivery_method: "Email" } }
              : { sales_invoice_sending: { delivery_method: "Email" } },
        },
      );
    }

    // Een nieuw gekoppeld contact bij de klant onthouden.
    if (klantId) await admin.from("clients").update({ moneybird_contact_id: contactId }).eq("id", klantId);

    return {
      ok: true,
      verstuurd: body.versturen === true,
      url: `https://moneybird.com/${ADMINISTRATIE}/${soort === "offerte" ? "estimates" : "sales_invoices"}/${document.id}`,
    };
  }

  if (actie === "offerte-actie") {
    if (!isId(body.id)) throw new Melding("Onbekende offerte.");
    const wat = body.wat;
    if (wat === "pdf") {
      const res = await fetch(`https://moneybird.com/api/v2/${ADMINISTRATIE}/estimates/${body.id}/download_pdf.json`, {
        headers: { Authorization: `Bearer ${MONEYBIRD_TOKEN}` },
        redirect: "manual",
      });
      const url = res.headers.get("Location");
      await res.body?.cancel();
      if (!url) throw new Error(`Moneybird gaf geen pdf-link (status ${res.status}).`);
      return { url };
    }
    if (wat === "versturen") {
      await moneybird(`estimates/${body.id}/send_estimate.json`, {
        method: "PATCH",
        body: { estimate_sending: { delivery_method: "Email" } },
      });
      return { ok: true };
    }
    if (wat === "accepteren" || wat === "afwijzen" || wat === "archiveren") {
      const state = wat === "accepteren" ? "accepted" : wat === "afwijzen" ? "rejected" : "archived";
      await moneybird(`estimates/${body.id}/change_state.json`, { method: "PATCH", body: { state } });
      return { ok: true };
    }
    if (wat === "factureren") {
      // Moneybird zet de offerte om in een conceptfactuur met dezelfde regels.
      const factuur = (await moneybird(`estimates/${body.id}/bill_estimate.json`, { method: "PATCH", body: {} })) as { id?: string };
      return {
        ok: true,
        url: factuur?.id ? `https://moneybird.com/${ADMINISTRATIE}/sales_invoices/${factuur.id}` : undefined,
      };
    }
    throw new Melding("Onbekende actie op de offerte.");
  }

  if (actie === "moneybird-contacten") {
    // Alle contacten, om een klant zelf aan het juiste contact te koppelen.
    const contacten = await allePaginas<MoneybirdContact>("contacts.json");
    return {
      ok: true,
      contacten: contacten
        .map((c) => ({
          ...contactUit(c),
          telefoon: c.phone?.trim() || null,
          plaats: c.city?.trim() || null,
          persoon:
            c.company_name && (c.firstname || c.lastname)
              ? [c.firstname, c.lastname].filter(Boolean).join(" ")
              : c.contact_people?.[0]
                ? [c.contact_people[0].firstname, c.contact_people[0].lastname].filter(Boolean).join(" ")
                : null,
        }))
        .sort((a, b) => a.naam.localeCompare(b.naam, "nl")),
    };
  }

  if (actie === "hosting-uit-moneybird") {
    // Terugkerende facturen in Moneybird die als hostingcontract in het portaal kunnen.
    const terugkerend = await allePaginas<{
      id: string;
      contact_id: string;
      contact?: MoneybirdContact | null;
      start_date: string | null;
      invoice_date: string | null;
      frequency_type: string;
      frequency: number | null;
      total_price_excl_tax: unknown;
      total_price_excl_tax_base?: unknown;
      reference?: string | null;
      details?: { description?: string | null }[];
    }>(`recurring_sales_invoices.json?filter=${encodeURIComponent("state:active")}`);

    const { data: klanten, error } = await admin
      .from("clients")
      .select("id, name, email, moneybird_contact_id, billing_cycle, billing_amount_cents, billing_start, billing_note");
    if (error) throw new Error(error.message);
    type Klant = PortaalKlant & {
      billing_cycle: string | null;
      billing_amount_cents: number | null;
      billing_start: string | null;
      billing_note: string | null;
    };
    const lijst = (klanten ?? []) as Klant[];

    return {
      ok: true,
      voorstellen: terugkerend.map((r) => {
        const naam = r.contact ? contactNaam(r.contact) : "Onbekend contact";
        const email = r.contact?.send_invoices_to_email || r.contact?.email || null;
        const klant =
          lijst.find((k) => k.moneybird_contact_id === r.contact_id) ??
          lijst.find((k) => email && k.email?.toLowerCase() === email.toLowerCase()) ??
          lijst.find((k) => naamSleutel(k.name) === naamSleutel(naam)) ??
          null;
        const cyclus = (r.frequency ?? 1) === 1 ? (CYCLUS[r.frequency_type] ?? null) : null;
        return {
          id: r.id,
          contact: { id: r.contact_id, naam },
          clientId: klant?.id ?? null,
          klantNaam: klant?.name ?? null,
          alIngesteld: Boolean(klant?.billing_cycle && klant.billing_start),
          cyclus,
          frequentie: `${r.frequency ?? 1} ${r.frequency_type}`,
          bedragCenten: Math.round(getal(r.total_price_excl_tax_base ?? r.total_price_excl_tax) * 100),
          start: r.start_date ?? r.invoice_date,
          volgende: r.invoice_date,
          omschrijving:
            (r.details ?? []).map((d) => d.description?.trim()).filter(Boolean).join(", ") || r.reference || null,
          url: `https://moneybird.com/${ADMINISTRATIE}/recurring_sales_invoices/${r.id}`,
        };
      }),
    };
  }

  if (actie === "bank-zonder-bon") {
    const jaar = Number(body.jaar);
    const kwartaal = Number(body.kwartaal);
    if (!Number.isInteger(jaar) || jaar < 2000 || ![1, 2, 3, 4].includes(kwartaal)) throw new Melding("Onbekend kwartaal.");
    // Per maand ophalen: zo blijft elke vraag ruim onder de 100 transacties.
    const maanden = [0, 1, 2].map((i) => {
      const m = (kwartaal - 1) * 3 + i;
      return [new Date(Date.UTC(jaar, m, 1)), new Date(Date.UTC(jaar, m + 1, 0))] as const;
    });
    const [perMaand, grootboek] = await Promise.all([
      Promise.all(maanden.map(([van, tot]) => mutaties(van, tot))),
      moneybird("ledger_accounts.json") as Promise<{ id: string; name: string }[]>,
    ]);
    const categorie = new Map(grootboek.map((g) => [g.id, g.name]));

    type Soort = "met-bon" | "zonder-bon" | "niet-verwerkt" | "geen-kosten";
    // Alleen afschrijvingen: geld dat van de rekening af ging.
    const regels = perMaand.flat().filter((m) => getal(m.amount) < 0).map((m) => {
      const bedrag = Math.abs(getal(m.amount));
      const boekingen = m.ledger_account_bookings ?? [];
      const naam = boekingen.map((b) => (b.ledger_account_id && categorie.get(b.ledger_account_id)) || "").find(Boolean) ?? null;
      let soort: Soort;
      if ((m.payments ?? []).length > 0) soort = "met-bon";
      else if (m.state === "unprocessed" || boekingen.length === 0) soort = "niet-verwerkt";
      else if (naam && GEEN_KOSTEN.test(naam)) soort = "geen-kosten";
      else soort = "zonder-bon";
      return {
        id: m.id,
        datum: m.date,
        bedrag,
        tegenpartij: m.contra_account_name?.trim() || "Onbekende tegenpartij",
        omschrijving: m.message?.trim() || null,
        categorie: naam,
        soort,
      };
    });

    const som = (s: Soort) => regels.filter((r) => r.soort === s);
    const totaal = (lijst: typeof regels) => lijst.reduce((t, r) => t + r.bedrag, 0);

    // Wat aandacht nodig heeft, per tegenpartij: één regel per leverancier
    // met de losse afschrijvingen eronder.
    const groepen = new Map<string, { naam: string; bedrag: number; aantal: number; soorten: Soort[]; transacties: typeof regels }>();
    for (const r of regels.filter((r) => r.soort === "zonder-bon" || r.soort === "niet-verwerkt" || r.soort === "geen-kosten")) {
      const sleutel = `${r.soort === "geen-kosten" ? "geen|" : ""}${r.tegenpartij.toLowerCase()}`;
      const g = groepen.get(sleutel) ?? { naam: r.tegenpartij, bedrag: 0, aantal: 0, soorten: [], transacties: [] };
      g.bedrag += r.bedrag;
      g.aantal += 1;
      if (!g.soorten.includes(r.soort)) g.soorten.push(r.soort);
      g.transacties.push(r);
      groepen.set(sleutel, g);
    }
    const lijst = [...groepen.values()]
      .map((g) => ({ ...g, transacties: g.transacties.sort((a, b) => a.datum.localeCompare(b.datum)) }))
      .sort((a, b) => b.bedrag - a.bedrag);

    return {
      ok: true,
      afgeschreven: { bedrag: totaal(regels), aantal: regels.length },
      metBon: { bedrag: totaal(som("met-bon")), aantal: som("met-bon").length },
      zonderBon: { bedrag: totaal(som("zonder-bon")), aantal: som("zonder-bon").length },
      nietVerwerkt: { bedrag: totaal(som("niet-verwerkt")), aantal: som("niet-verwerkt").length },
      geenKosten: { bedrag: totaal(som("geen-kosten")), aantal: som("geen-kosten").length },
      teControleren: lijst.filter((g) => !g.soorten.every((s) => s === "geen-kosten")),
      geenKostenLijst: lijst.filter((g) => g.soorten.every((s) => s === "geen-kosten")),
    };
  }

  if (actie === "btw-overzicht") {
    // Dit jaar en vorig jaar, per kwartaal, met de rubrieken van de aangifte.
    const nu = new Date();
    const jaren = [nu.getUTCFullYear(), nu.getUTCFullYear() - 1];
    type Regel = { report_reference?: string; name?: string; type?: string; percentage?: unknown; amount?: unknown; tax?: unknown };
    const perJaar = await Promise.all(
      jaren.map(async (jaar) => {
        try {
          const r = (await moneybird(`reports/tax.json?period=${jaarPeriode(jaar, nu)}&granularity=quarter`)) as {
            periods?: { period: string; tax_rates?: Regel[] }[];
          };
          return r.periods ?? [];
        } catch (fout) {
          // Een jaar van voor de start van de administratie geeft een fout; dat jaar overslaan.
          if (jaar !== nu.getUTCFullYear()) return [];
          throw fout;
        }
      }),
    );
    const kwartalen = perJaar
      .flat()
      .map((p) => {
        const { jaar, kwartaal, label } = kwartaalUit(p.period);
        const rubrieken = new Map<string, { rubriek: string; naam: string; grondslag: number; btw: number; voorbelasting: boolean }>();
        for (const t of p.tax_rates ?? []) {
          const rubriek = (t.report_reference ?? "").replace(/NL\//gi, "") || "?";
          const sleutel = `${rubriek}|${t.name ?? ""}`;
          const r = rubrieken.get(sleutel) ?? {
            rubriek,
            naam: t.name ?? "",
            grondslag: 0,
            btw: 0,
            voorbelasting: isVoorbelasting(t),
          };
          r.grondslag += getal(t.amount);
          r.btw += getal(t.tax);
          rubrieken.set(sleutel, r);
        }
        const lijst = [...rubrieken.values()].sort((a, b) => a.rubriek.localeCompare(b.rubriek, "nl", { numeric: true }));
        const verschuldigd = lijst.filter((r) => !r.voorbelasting).reduce((som, r) => som + r.btw, 0);
        const voorbelasting = lijst.filter((r) => r.voorbelasting).reduce((som, r) => som + r.btw, 0);
        return {
          label,
          jaar,
          kwartaal: kwartaal + 1,
          lopend: nu < new Date(Date.UTC(jaar, kwartaal * 3 + 3, 1)),
          deadline: new Date(Date.UTC(jaar, kwartaal * 3 + 4, 0)).toISOString().slice(0, 10),
          verschuldigd,
          voorbelasting,
          afdragen: verschuldigd - voorbelasting,
          rubrieken: lijst,
        };
      })
      // Alleen kwartalen die al begonnen zijn, nieuwste eerst.
      .filter((q) => new Date(Date.UTC(q.jaar, (q.kwartaal - 1) * 3, 1)) <= nu)
      .sort((a, b) => b.jaar - a.jaar || b.kwartaal - a.kwartaal);

    // Documenten die nog in de inbox van Moneybird staan: hun btw telt nog
    // niet mee als voorbelasting. Per kwartaal (op documentdatum) hoeveel het
    // er zijn en hoeveel btw erop staat, voor zover Moneybird ze al heeft
    // uitgelezen.
    type Inbox = {
      id: string;
      date: string | null;
      currency?: string | null;
      reference?: string | null;
      contact?: MoneybirdContact | null;
      total_price_excl_tax?: unknown;
      total_price_excl_tax_base?: unknown;
      total_price_incl_tax?: unknown;
      total_price_incl_tax_base?: unknown;
    };
    type Teller = {
      aantal: number;
      btw: number;
      zonderBedrag: number;
      buitenland: number;
      documenten: { id: string; leverancier: string; datum: string; bedrag: number; btw: number; valuta: string | null; url: string }[];
    };
    const filter = encodeURIComponent(`period:${jaren[1]}0101..${jaren[0]}1231,state:new`);
    const inbox = (
      await Promise.all([
        allePaginas<Inbox>(`documents/purchase_invoices.json?filter=${filter}`),
        allePaginas<Inbox>(`documents/receipts.json?filter=${filter}`),
      ]).catch(() => [[], []] as Inbox[][])
    ).flat();
    const leeg = (): Teller => ({ aantal: 0, btw: 0, zonderBedrag: 0, buitenland: 0, documenten: [] });
    const nietVerwerkt = new Map<string, Teller>();
    for (const d of inbox) {
      if (!d.date) continue;
      const label = kwartaalUit(`${d.date.slice(0, 4)}${d.date.slice(5, 7)}`).label;
      const n = nietVerwerkt.get(label) ?? leeg();
      // Een bon in een andere valuta is nog niet omgerekend zolang hij niet
      // verwerkt is, en buitenlandse btw vraag je niet terug via de Nederlandse
      // aangifte. Die tellen niet mee in de schatting, wel in het aantal.
      const valuta = d.currency && d.currency !== "EUR" ? d.currency : null;
      const incl = getal(d.total_price_incl_tax_base ?? d.total_price_incl_tax);
      const excl = getal(d.total_price_excl_tax_base ?? d.total_price_excl_tax);
      const btw = valuta ? 0 : Math.max(0, incl - excl);
      n.aantal += 1;
      if (valuta) n.buitenland += 1;
      else if (incl === 0) n.zonderBedrag += 1;
      else n.btw += btw;
      n.documenten.push({
        id: d.id,
        leverancier: d.contact ? contactNaam(d.contact) : d.reference || "Nog niet uitgelezen",
        datum: d.date,
        bedrag: getal(d.total_price_incl_tax),
        btw,
        valuta,
        url: `https://moneybird.com/${ADMINISTRATIE}/documents/${d.id}`,
      });
      nietVerwerkt.set(label, n);
    }
    // Per kwartaal de documenten met de meeste btw eerst, hooguit twintig.
    for (const n of nietVerwerkt.values()) {
      n.documenten = n.documenten.sort((a, b) => b.btw - a.btw || b.bedrag - a.bedrag).slice(0, 20);
    }

    return {
      ok: true,
      kwartalen: kwartalen.map((q) => ({ ...q, nietVerwerkt: nietVerwerkt.get(q.label) ?? leeg() })),
      // Inboxdocumenten zonder datum vallen in geen enkel kwartaal.
      nietVerwerktZonderDatum: inbox.filter((d) => !d.date).length,
    };
  }

  if (actie === "omzet-historie") {
    // Omzet, kosten en winst per kwartaal, voor dit jaar en de drie jaren ervoor.
    const nu = new Date();
    const jaren = [0, 1, 2, 3].map((i) => nu.getUTCFullYear() - i);
    const resultaat = await Promise.all(
      jaren.map(async (jaar) => {
        try {
          const r = (await moneybird(`reports/profit_loss.json?period=${jaarPeriode(jaar, nu)}&granularity=quarter`)) as {
            periods?: Record<string, unknown>[];
          };
          const kwartalen = (r.periods ?? []).map((p) => ({
            kwartaal: kwartaalUit(String(p.period ?? "")).kwartaal + 1,
            omzet: getal(p.total_revenue),
            kosten: getal(p.total_expenses),
            winst: getal(p.net_profit),
          }));
          return {
            jaar,
            lopend: jaar === nu.getUTCFullYear(),
            omzet: kwartalen.reduce((som, k) => som + k.omzet, 0),
            kosten: kwartalen.reduce((som, k) => som + k.kosten, 0),
            winst: kwartalen.reduce((som, k) => som + k.winst, 0),
            kwartalen,
          };
        } catch (fout) {
          if (jaar !== nu.getUTCFullYear()) return null;
          throw fout;
        }
      }),
    );
    // Jaren zonder enige boeking (van voor de administratie) weglaten.
    return {
      ok: true,
      jaren: resultaat.filter((j) => j && (j.omzet !== 0 || j.kosten !== 0 || j.lopend)),
    };
  }

  if (actie === "hosting-factureren") {
    const items = (Array.isArray(body.items) ? body.items : []) as { clientId?: unknown; periodDate?: unknown }[];
    if (items.length === 0) throw new Melding("Geen termijnen gekozen.");
    if (items.length > 30) throw new Melding("Hooguit 30 termijnen tegelijk.");

    const { data: alGedaan, error: periodeFout } = await admin
      .from("invoiced_periods")
      .select("client_id, period_date")
      .in("client_id", items.map((i) => String(i.clientId)));
    if (periodeFout) throw new Error(periodeFout.message);
    const gedaan = new Set(((alGedaan ?? []) as { client_id: string; period_date: string }[]).map((r) => `${r.client_id}|${r.period_date}`));

    const gemaakt: { naam: string; url: string }[] = [];
    const overgeslagen: { naam: string; reden: string }[] = [];
    for (const item of items) {
      const periodDate = typeof item.periodDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.periodDate) ? item.periodDate : null;
      if (!periodDate) throw new Melding("Onbekende termijn.");
      const klant = (await portaalKlant(item.clientId)) as PortaalKlant & {
        billing_cycle: string | null;
        billing_amount_cents: number | null;
      };
      if (gedaan.has(`${klant.id}|${periodDate}`)) {
        overgeslagen.push({ naam: klant.name, reden: "staat al op gefactureerd" });
        continue;
      }
      if (!klant.billing_cycle || !klant.billing_amount_cents) {
        overgeslagen.push({ naam: klant.name, reden: "geen bedrag ingevuld" });
        continue;
      }
      const gevonden = await zoekContact(klant, items.length === 1 ? body.contactId : undefined);
      if (!("contact" in gevonden)) {
        // Eén termijn: laat de gebruiker kiezen. Meerdere: overslaan en melden.
        if (items.length === 1) return { ok: false, kiesContact: gevonden.kandidaten.map(contactUit) };
        overgeslagen.push({ naam: klant.name, reden: "geen eenduidig Moneybird-contact" });
        continue;
      }
      const regel = hostingRegel(periodDate, klant.billing_cycle);
      const factuur = (await moneybird("sales_invoices.json", {
        method: "POST",
        body: {
          sales_invoice: {
            contact_id: gevonden.contact.id,
            reference: regel.omschrijving,
            // De hostingbedragen in het portaal zijn exclusief btw.
            prices_are_incl_tax: false,
            details_attributes: [
              {
                description: regel.omschrijving,
                amount: "1",
                price: (klant.billing_amount_cents / 100).toFixed(2),
                period: regel.periode,
              },
            ],
          },
        },
      })) as { id: string };
      const url = `https://moneybird.com/${ADMINISTRATIE}/sales_invoices/${factuur.id}`;
      const { error } = await admin.from("invoiced_periods").upsert(
        { client_id: klant.id, period_date: periodDate, invoiced_by: userId, note: `Moneybird-concept ${factuur.id}` },
        { onConflict: "client_id,period_date" },
      );
      if (error) console.error("termijn afvinken mislukt:", error.message);
      if (klant.moneybird_contact_id !== gevonden.contact.id) {
        await admin.from("clients").update({ moneybird_contact_id: gevonden.contact.id }).eq("id", klant.id);
      }
      gemaakt.push({ naam: klant.name, url });
    }
    return { ok: true, gemaakt, overgeslagen };
  }

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
    // Per klant (alle uren, met en zonder project) of per project.
    const perKlant = body.clientId !== undefined;
    const projectId = body.projectId;
    if (!perKlant && (typeof projectId !== "string" || !/^[0-9a-f-]{36}$/i.test(projectId))) {
      throw new Melding("Onbekend project.");
    }
    const ids = Array.isArray(body.urenIds) ? body.urenIds.filter((x): x is string => typeof x === "string") : [];
    if (ids.length === 0) throw new Melding("Geen uren gekozen.");
    const tarief = typeof body.uurtarief === "number" ? Math.round(body.uurtarief * 100) / 100 : NaN;
    if (!Number.isFinite(tarief) || tarief <= 0) throw new Melding("Vul een uurtarief in.");

    let klant: PortaalKlant;
    let referentie: string;
    if (perKlant) {
      klant = await portaalKlant(body.clientId);
      referentie = `Uren ${klant.name}`;
    } else {
      const { data: project, error: projectFout } = await admin
        .from("projects")
        .select("id, name, client_id")
        .eq("id", projectId as string)
        .maybeSingle();
      if (projectFout) throw new Error(projectFout.message);
      if (!project?.client_id) throw new Melding("Dit project hoort niet bij een klant.");
      klant = await portaalKlant(project.client_id);
      referentie = `Uren ${project.name}`;
    }

    // Eerst de uren controleren, pas daarna iets in Moneybird aanmaken.
    const { data: regels, error: urenFout } = await admin
      .from("time_entries")
      .select(
        "id, project_id, client_id, started_at, ended_at, billable, description, gefactureerd_op, task:tasks(title), project:projects(client_id)",
      )
      .in("id", ids);
    if (urenFout) {
      if (/gefactureerd_op|client_id|column/i.test(urenFout.message)) {
        throw new Melding("De database mist nog de kolommen voor facturatie. Voer eerst de migratie uit in Lovable.");
      }
      throw new Error(urenFout.message);
    }
    const lijst = (regels ?? []) as unknown as Urenregel[];
    if (lijst.length !== ids.length) throw new Melding("Een deel van deze uren bestaat niet meer. Vernieuw de pagina.");
    for (const r of lijst) {
      if (perKlant) {
        if ((r.project?.client_id ?? r.client_id) !== klant.id) throw new Melding("Er zitten uren van een andere klant tussen.");
      } else if (r.project_id !== projectId) {
        throw new Melding("Er zitten uren van een ander project tussen.");
      }
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
          reference: referentie.slice(0, 100),
          prices_are_incl_tax: false,
          details_attributes: regelsOpFactuur.map((g, i) => ({
            description: g.omschrijving,
            // Altijd hele kwartieren: de minuten zijn per registratie al afgerond.
            amount: (g.minuten / 60).toFixed(2),
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

  if (actie === "terugkerend-maken") {
    // Een hostingcontract uit het portaal als terugkerende factuur in Moneybird.
    const klant = (await portaalKlant(body.clientId)) as PortaalKlant & {
      billing_cycle: string | null;
      billing_amount_cents: number | null;
      billing_note: string | null;
    };
    if (!klant.billing_cycle || !klant.billing_amount_cents) throw new Melding("Vul eerst het hostingbedrag en de termijn in.");
    if (klant.billing_note?.startsWith(MONEYBIRD_NOTITIE)) throw new Melding("Dit contract loopt al via een terugkerende factuur in Moneybird.");
    const eersteDatum = typeof body.eersteFactuur === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.eersteFactuur) ? body.eersteFactuur : null;
    if (!eersteDatum || eersteDatum <= vandaag()) throw new Melding("De eerste factuurdatum moet na vandaag liggen.");

    const gevonden = await zoekContact(klant, body.contactId);
    if (!("contact" in gevonden)) return { ok: false, kiesContact: gevonden.kandidaten.map(contactUit) };

    const jaarlijks = klant.billing_cycle === "jaarlijks";
    const terugkerend = (await moneybird("recurring_sales_invoices.json", {
      method: "POST",
      body: {
        recurring_sales_invoice: {
          contact_id: gevonden.contact.id,
          reference: "Hosting",
          invoice_date: eersteDatum,
          frequency_type: jaarlijks ? "year" : "month",
          frequency: "1",
          // De hostingbedragen in het portaal zijn exclusief btw.
          prices_are_incl_tax: false,
          auto_send: body.automatischVersturen === true,
          details_attributes: [
            {
              description: jaarlijks ? "Hosting website, per jaar" : "Hosting website, per maand",
              amount: "1",
              price: (klant.billing_amount_cents / 100).toFixed(2),
            },
          ],
        },
      },
    })) as { id: string };

    // In het portaal markeren als "via Moneybird", zodat het daar geen
    // termijnen meer aanbiedt om te factureren. Een eigen notitie blijft staan.
    const notitie = `${MONEYBIRD_NOTITIE} ${terugkerend.id}${klant.billing_note?.trim() ? ` · ${klant.billing_note.trim()}` : ""}`;
    const { error } = await admin
      .from("clients")
      .update({ billing_note: notitie.slice(0, 2000), moneybird_contact_id: gevonden.contact.id })
      .eq("id", klant.id);
    if (error) console.error("contract markeren mislukt:", error.message);
    return { ok: true, url: `https://moneybird.com/${ADMINISTRATIE}/recurring_sales_invoices/${terugkerend.id}` };
  }

  if (actie === "machtiging-link") {
    // Een link waarmee de klant een incassomachtiging afgeeft (Moneybird
    // Payments). De klant betaalt daarbij 15 cent; de link is 14 dagen geldig.
    const klant = await portaalKlant(body.clientId);
    const gevonden = await zoekContact(klant, body.contactId);
    if (!("contact" in gevonden)) return { ok: false, kiesContact: gevonden.kandidaten.map(contactUit) };
    try {
      const r = (await moneybird(`contacts/${gevonden.contact.id}/moneybird_payments_mandate/url.json`, {
        method: "POST",
        body: {},
      })) as { url?: string };
      if (!r.url) throw new Error("Moneybird gaf geen link terug.");
      return { ok: true, url: r.url };
    } catch (fout) {
      if (fout instanceof Error && fout.message.includes("(403)")) {
        throw new Melding(
          "Moneybird geeft geen machtigingslink. Daarvoor moet Moneybird Payments aan staan en heeft de sleutel de rechten sales_invoices en settings nodig.",
          403,
        );
      }
      throw fout;
    }
  }

  if (actie === "contact-bijwerken") {
    // Wat in het portaal is aangepast ook in Moneybird zetten: e-mail,
    // telefoon, plaats en contactpersoon. De naam niet: die verschilt vaak
    // bewust (BeNoted in het portaal, BeNoted Media in Moneybird). Een leeg
    // veld in het portaal maakt Moneybird nooit leeg.
    const klant = (await portaalKlant(body.clientId)) as PortaalKlant & {
      phone: string | null;
      city: string | null;
      contact_name: string | null;
    };
    if (!isId(klant.moneybird_contact_id)) return { ok: true, velden: [] };
    const contact = (await moneybird(`contacts/${klant.moneybird_contact_id}.json`)) as MoneybirdContact & {
      phone?: string | null;
      city?: string | null;
      send_estimates_to_email?: string | null;
    };
    const wijziging: Record<string, string> = {};
    const velden: string[] = [];
    const zelfde = (a: string | null | undefined, b: string | null | undefined) =>
      (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();

    const email = klant.email?.trim();
    if (email && !zelfde(email, contact.send_invoices_to_email || contact.email)) {
      wijziging.send_invoices_to_email = email;
      wijziging.send_estimates_to_email = email;
      velden.push("e-mail");
    }
    const telefoon = klant.phone?.trim();
    if (telefoon && !zelfde(telefoon, contact.phone)) {
      wijziging.phone = telefoon;
      velden.push("telefoon");
    }
    const plaats = klant.city?.trim();
    if (plaats && !zelfde(plaats, contact.city)) {
      wijziging.city = plaats;
      velden.push("plaats");
    }
    // Alleen bij een bedrijf: bij een persoon zijn voor- en achternaam de naam zelf.
    const persoon = klant.contact_name?.trim();
    const huidigePersoon = [contact.firstname, contact.lastname].filter(Boolean).join(" ");
    if (persoon && contact.company_name && !zelfde(persoon, huidigePersoon)) {
      const [voornaam, ...rest] = persoon.split(/\s+/);
      wijziging.firstname = voornaam ?? "";
      wijziging.lastname = rest.join(" ");
      velden.push("contactpersoon");
    }

    if (velden.length === 0) return { ok: true, velden };
    await moneybird(`contacts/${contact.id}.json`, { method: "PATCH", body: { contact: wijziging } });
    return { ok: true, velden };
  }

  if (actie === "contact-aanmaken") {
    // Een klant uit het portaal in Moneybird zetten, zonder dubbel contact:
    // eerst zoeken (e-mail, dan naam). Eén duidelijke treffer wordt gekoppeld,
    // bij twijfel kiest de gebruiker, en alleen als er niets is (of de
    // gebruiker "nieuw" kiest) komt er een nieuw contact.
    const klant = (await portaalKlant(body.clientId)) as PortaalKlant & {
      phone: string | null;
      city: string | null;
      contact_name: string | null;
    };
    const koppel = async (contact: MoneybirdContact, soort: "gekoppeld" | "aangemaakt") => {
      const { error } = await admin.from("clients").update({ moneybird_contact_id: contact.id }).eq("id", klant.id);
      if (error) throw new Error(error.message);
      return { ok: true, soort, contact: contactUit(contact) };
    };

    if (isId(body.contactId)) {
      return await koppel((await moneybird(`contacts/${body.contactId}.json`)) as MoneybirdContact, "gekoppeld");
    }
    if (isId(klant.moneybird_contact_id)) {
      const huidig = (await moneybird(`contacts/${klant.moneybird_contact_id}.json`)) as MoneybirdContact;
      return { ok: true, soort: "al-gekoppeld", contact: contactUit(huidig) };
    }
    if (body.nieuw !== true) {
      const gevonden = await zoekContact(klant);
      if ("contact" in gevonden) return await koppel(gevonden.contact, "gekoppeld");
      if (gevonden.kandidaten.length > 0) return { ok: false, kiesContact: gevonden.kandidaten.map(contactUit) };
    }

    const email = klant.email?.trim();
    const [voornaam, ...rest] = (klant.contact_name?.trim() ?? "").split(/\s+/).filter(Boolean);
    const nieuw = (await moneybird("contacts.json", {
      method: "POST",
      body: {
        contact: {
          company_name: klant.name,
          ...(voornaam ? { firstname: voornaam, ...(rest.length ? { lastname: rest.join(" ") } : {}) } : {}),
          ...(email ? { email, send_invoices_to_email: email, send_estimates_to_email: email } : {}),
          ...(klant.phone?.trim() ? { phone: klant.phone.trim() } : {}),
          ...(klant.city?.trim() ? { city: klant.city.trim() } : {}),
        },
      },
    })) as MoneybirdContact;
    return await koppel(nieuw, "aangemaakt");
  }

  if (actie === "contact-archiveren") {
    // Een contact in Moneybird archiveren (bijvoorbeeld een dubbel). Gearchiveerd
    // is niet weg: facturen blijven staan en het contact is terug te zetten.
    if (!isId(body.contactId)) throw new Melding("Onbekend contact.");
    const { data: inGebruik } = await admin.from("clients").select("name").eq("moneybird_contact_id", body.contactId).limit(1);
    if (inGebruik && inGebruik.length > 0) {
      throw new Melding(`Dit contact is gekoppeld aan ${(inGebruik[0] as { name: string }).name} in het portaal en wordt niet gearchiveerd.`);
    }
    await moneybird(`contacts/${body.contactId}/archive.json`, { method: "PATCH" });
    return { ok: true };
  }

  throw new Melding("Onbekende actie.");
}

/** Hoeveel bestanden en hoe groot per keer; foto's verkleint het portaal al. */
const BON_MAX_BESTANDEN = 10;
const BON_MAX_GROOTTE = 10 * 1024 * 1024;
const BON_TYPES = /^(image\/(jpeg|png|webp|heic|heif|gif)|application\/pdf)$/i;

/**
 * Bonnen en inkoopfacturen naar de inbox van Moneybird, net alsof je ze daar
 * naartoe mailt: per bestand een document zonder soort, met het bestand
 * eraan. In Moneybird verwerk je ze daarna tot bon of inkoopfactuur.
 */
async function bonnenUploaden(form: FormData) {
  const bestanden = form.getAll("bestand").filter((b): b is File => b instanceof File && b.size > 0);
  if (bestanden.length === 0) throw new Melding("Kies een foto of pdf.");
  if (bestanden.length > BON_MAX_BESTANDEN) throw new Melding(`Hooguit ${BON_MAX_BESTANDEN} bestanden tegelijk.`);
  for (const b of bestanden) {
    if (!BON_TYPES.test(b.type)) throw new Melding(`${b.name} is geen foto of pdf.`);
    if (b.size > BON_MAX_GROOTTE) throw new Melding(`${b.name} is groter dan 10 MB.`);
  }
  const omschrijving = String(form.get("omschrijving") ?? "").trim().slice(0, 100);

  const gelukt: { naam: string; url: string }[] = [];
  const mislukt: { naam: string; reden: string }[] = [];
  for (const bestand of bestanden) {
    let documentId: string | null = null;
    try {
      const document = (await moneybird("documents/typeless_documents.json", {
        method: "POST",
        body: { typeless_document: omschrijving ? { reference: omschrijving } : {} },
      })) as { id: string };
      documentId = document.id;

      const bijlage = new FormData();
      bijlage.append("file", bestand, bestand.name);
      const res = await fetch(
        `https://moneybird.com/api/v2/${ADMINISTRATIE}/documents/typeless_documents/${document.id}/attachments.json`,
        { method: "POST", headers: { Authorization: `Bearer ${MONEYBIRD_TOKEN}`, Accept: "application/json" }, body: bijlage },
      );
      if (!res.ok) throw new Error(`bijlage niet aangenomen (status ${res.status})`);
      gelukt.push({ naam: bestand.name, url: `https://moneybird.com/${ADMINISTRATIE}/documents/${document.id}` });
    } catch (fout) {
      // Geen leeg document achterlaten in de inbox.
      if (documentId) await moneybird(`documents/typeless_documents/${documentId}.json`, { method: "DELETE" }).catch(() => null);
      mislukt.push({ naam: bestand.name, reden: fout instanceof Error ? fout.message : "onbekende fout" });
    }
  }
  return { ok: true, gelukt, mislukt };
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

    // Bestanden komen als formulier binnen, al het andere als JSON.
    if ((req.headers.get("Content-Type") ?? "").includes("multipart/form-data")) {
      const form = await req.formData();
      if (form.get("actie") !== "bon-uploaden") return antwoord({ error: "Onbekende actie." }, 400);
      try {
        return antwoord(await bonnenUploaden(form));
      } catch (fout) {
        if (fout instanceof Melding) return antwoord({ error: fout.message }, fout.status);
        throw fout;
      }
    }

    const body = ((await req.json().catch(() => ({}))) ?? {}) as Record<string, unknown>;
    if (typeof body.actie === "string") {
      try {
        return antwoord(await voerUit(body.actie, body, gebruiker.user.id));
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

    const dagCode = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
    const jaarTerug = new Date(Date.UTC(nu.getUTCFullYear() - 1, nu.getUTCMonth(), nu.getUTCDate() + 1));
    const veertienDagenTerug = new Date(nu.getTime() - 14 * 86400000);

    const [winstVerlies, bank, facturen, crediteuren, btw, uitgaven, betalingen, offertes] = await Promise.all([
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
            let verschuldigd = 0;
            let voorbelasting = 0;
            for (const t of r.tax_rates ?? []) {
              if (isVoorbelasting(t)) voorbelasting += getal(t.tax);
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
      // Uitgaven van het laatste jaar: inkoopfacturen en bonnetjes, per
      // leverancier en per categorie, plus de meest recente.
      onderdeel(async () => {
        type Document = {
          id: string;
          contact?: MoneybirdContact | null;
          date: string | null;
          created_at?: string | null;
          state: string;
          reference?: string | null;
          currency?: string;
          total_price_excl_tax: unknown;
          total_price_excl_tax_base?: unknown;
          total_price_incl_tax: unknown;
          total_price_incl_tax_base?: unknown;
          details?: {
            ledger_account_id?: string | null;
            total_price_excl_tax_with_discount?: unknown;
            total_price_excl_tax_with_discount_base?: unknown;
          }[];
        };
        // Bonnetjes in een andere valuta (lira, dollars) staan ook omgerekend
        // naar euro in de *_base-velden; die tellen we op, niet het bedrag op de bon.
        const euro = (basis: unknown, gewoon: unknown) => getal(basis ?? gewoon);
        const filter = encodeURIComponent(`period:${dagCode(jaarTerug)}..${dagCode(nu)}`);
        const [inkoop, bonnetjes, grootboek] = await Promise.all([
          allePaginas<Document>(`documents/purchase_invoices.json?filter=${filter}`),
          allePaginas<Document>(`documents/receipts.json?filter=${filter}`),
          moneybird("ledger_accounts.json") as Promise<{ id: string; name: string }[]>,
        ]);
        const categorieNaam = new Map(grootboek.map((g) => [g.id, g.name]));
        // In de totalen alleen wat echt geboekt is; nieuwe, nog niet verwerkte
        // documenten tellen daar niet mee (hun bedrag en categorie kunnen nog
        // wijzigen). Bij "recent" staan ze wél, zodat de lijst bijblijft ook als
        // het verwerken in Moneybird achterloopt.
        const alle = [
          ...inkoop.map((d) => ({ ...d, soort: "Inkoopfactuur" })),
          ...bonnetjes.map((d) => ({ ...d, soort: "Bonnetje" })),
        ];
        const docs = alle.filter((d) => d.state !== "new");
        const nieuw = alle.filter((d) => d.state === "new");

        const perLeverancier = new Map<string, { naam: string; bedrag: number; aantal: number }>();
        const perCategorie = new Map<string, { naam: string; bedrag: number }>();
        for (const d of docs) {
          const naam = d.contact ? contactNaam(d.contact) : "Zonder leverancier";
          const l = perLeverancier.get(naam) ?? { naam, bedrag: 0, aantal: 0 };
          l.bedrag += euro(d.total_price_excl_tax_base, d.total_price_excl_tax);
          l.aantal += 1;
          perLeverancier.set(naam, l);
          for (const r of d.details ?? []) {
            const cat = (r.ledger_account_id && categorieNaam.get(r.ledger_account_id)) || "Zonder categorie";
            const c = perCategorie.get(cat) ?? { naam: cat, bedrag: 0 };
            c.bedrag += euro(r.total_price_excl_tax_with_discount_base, r.total_price_excl_tax_with_discount);
            perCategorie.set(cat, c);
          }
        }
        const groot = <T extends { bedrag: number }>(m: Map<string, T>) => [...m.values()].sort((a, b) => b.bedrag - a.bedrag);
        return {
          totaal: docs.reduce((som, d) => som + euro(d.total_price_excl_tax_base, d.total_price_excl_tax), 0),
          nogTeVerwerken: nieuw.length,
          nogTeVerwerkenBedrag: nieuw.reduce((som, d) => som + euro(d.total_price_excl_tax_base, d.total_price_excl_tax), 0),
          perLeverancier: groot(perLeverancier).slice(0, 8),
          perCategorie: groot(perCategorie).slice(0, 8),
          // Op datum van het document; zonder datum (nog niet herkend) op wanneer hij binnenkwam.
          recent: [...alle]
            .sort((a, b) => (b.date ?? b.created_at ?? "").localeCompare(a.date ?? a.created_at ?? ""))
            .slice(0, 8)
            .map((d) => ({
              id: d.id,
              soort: d.soort,
              leverancier: d.contact ? contactNaam(d.contact) : "Zonder leverancier",
              omschrijving: d.reference || null,
              datum: d.date ?? d.created_at?.slice(0, 10) ?? null,
              bedrag: euro(d.total_price_incl_tax_base, d.total_price_incl_tax),
              valuta: d.currency && d.currency !== "EUR" ? d.currency : null,
              status: d.state,
              url: `https://moneybird.com/${ADMINISTRATIE}/documents/${d.id}`,
            })),
        };
      }),
      // Betalingen van de laatste twee weken, voor de meldingen in het portaal.
      onderdeel(async () => {
        const filter = encodeURIComponent(`state:paid,updated_after:${veertienDagenTerug.toISOString()}`);
        const r = (await moneybird(`sales_invoices.json?per_page=100&filter=${filter}`)) as (MoneybirdFactuur & {
          paid_at: string | null;
        })[];
        return r
          .filter((f) => f.paid_at && new Date(f.paid_at) >= veertienDagenTerug && getal(f.total_price_incl_tax) > 0)
          .sort((a, b) => (b.paid_at ?? "").localeCompare(a.paid_at ?? ""))
          .map((f) => ({
            id: f.id,
            nummer: f.invoice_id,
            klant: klantNaam(f),
            bedrag: getal(f.total_price_incl_tax),
            betaaldOp: f.paid_at,
            url: `https://moneybird.com/${ADMINISTRATIE}/sales_invoices/${f.id}`,
          }));
      }),
      // Offertes die uitstaan of geaccepteerd zijn en nog gefactureerd moeten worden.
      onderdeel(async () => {
        const filter = encodeURIComponent(`state:draft|open|late|accepted,period:${dagCode(jaarTerug)}..${dagCode(nu)}`);
        const r = (await moneybird(`estimates.json?per_page=100&filter=${filter}`)) as {
          id: string;
          estimate_id: string | null;
          state: string;
          estimate_date: string | null;
          due_date: string | null;
          sent_at: string | null;
          accepted_at: string | null;
          total_price_excl_tax: unknown;
          contact?: MoneybirdContact | null;
        }[];
        return r
          .map((o) => ({
            id: o.id,
            nummer: o.estimate_id,
            klant: o.contact ? contactNaam(o.contact) : "Onbekende klant",
            status: o.state,
            datum: o.estimate_date,
            vervaldatum: o.due_date,
            verstuurd: o.sent_at,
            geaccepteerd: o.accepted_at,
            bedrag: getal(o.total_price_excl_tax),
            url: `https://moneybird.com/${ADMINISTRATIE}/estimates/${o.id}`,
          }))
          .sort((a, b) => (a.datum ?? "").localeCompare(b.datum ?? ""));
      }),
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
      uitgaven,
      betalingen,
      offertes,
    });
  } catch (fout) {
    console.error("moneybird-financien:", fout);
    return antwoord({ error: fout instanceof Error ? fout.message : "Er ging iets mis" }, 500);
  }
});
