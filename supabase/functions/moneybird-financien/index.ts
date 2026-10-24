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
 * - wat er aan leveranciers nog betaald moet worden (crediteuren).
 *
 * Elk onderdeel mag los mislukken (bijvoorbeeld als de sleutel een recht mist);
 * dan krijgt alleen dat onderdeel een foutmelding en de rest werkt gewoon.
 *
 * Met een "actie" doet de functie één ding met openstaande facturen:
 * - "herinnering": herinneringen per e-mail naar de klant (ids);
 * - "betaling": een betaling registreren (id, bedrag, datum);
 * - "afboeken": een kleine rest afboeken als betalingsverschil (id);
 * - "pdf": een downloadlink voor de pdf (id), 30 seconden geldig.
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

async function voerUit(actie: string, body: Record<string, unknown>): Promise<unknown> {
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

    const [winstVerlies, bank, facturen, crediteuren] = await Promise.all([
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
    ]);

    return antwoord({
      ingesteld: true,
      bijgewerkt: nu.toISOString(),
      moneybirdUrl: `https://moneybird.com/${ADMINISTRATIE}`,
      winstVerlies,
      bank,
      facturen,
      crediteuren,
    });
  } catch (fout) {
    console.error("moneybird-financien:", fout);
    return antwoord({ error: fout instanceof Error ? fout.message : "Er ging iets mis" }, 500);
  }
});
