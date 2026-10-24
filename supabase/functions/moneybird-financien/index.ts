import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Financieel overzicht voor het portaal (pagina "Financiën"), uit Moneybird.
 *
 * Alleen lezen en alleen voor admins. De Moneybird-sleutel staat als secret
 * op de server (MONEYBIRD_API_TOKEN) en komt nooit in de browser; het portaal
 * vraagt deze functie om de cijfers en krijgt alleen het resultaat terug.
 *
 * Eén verzoek haalt alles op wat de pagina toont, parallel:
 * - winst en verlies per maand over de laatste 12 maanden;
 * - banksaldo per rekening;
 * - openstaande verkoopfacturen (open, herinnerd, te laat);
 * - wat er aan leveranciers nog betaald moet worden (crediteuren).
 *
 * Elk onderdeel mag los mislukken (bijvoorbeeld als de sleutel een recht mist);
 * dan krijgt alleen dat onderdeel een foutmelding en de rest werkt gewoon.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MONEYBIRD_TOKEN = Deno.env.get("MONEYBIRD_API_TOKEN");
const ADMINISTRATIE = (Deno.env.get("MONEYBIRD_ADMINISTRATIE_ID") ?? "").trim();

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

async function moneybird(pad: string): Promise<unknown> {
  const res = await fetch(`https://moneybird.com/api/v2/${ADMINISTRATIE}/${pad}`, {
    headers: { Authorization: `Bearer ${MONEYBIRD_TOKEN}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const tekst = await res.text().catch(() => "");
    if (res.status === 401) throw new Error("Moneybird weigert de sleutel (401). Klopt MONEYBIRD_API_TOKEN nog?");
    if (res.status === 403) throw new Error("De Moneybird-sleutel mist een recht voor dit onderdeel (403).");
    if (res.status === 404) throw new Error("Moneybird kent deze administratie niet (404). Klopt MONEYBIRD_ADMINISTRATIE_ID?");
    if (res.status === 429) throw new Error("Te veel verzoeken aan Moneybird; probeer het over een paar minuten opnieuw.");
    throw new Error(`Moneybird gaf status ${res.status}${tekst ? `: ${tekst.slice(0, 200)}` : ""}`);
  }
  return res.json();
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
            naam: a.name ?? "Rekening",
            soort: a.type ?? "",
            saldo: getal(a.balance),
          })),
        };
      }),
      onderdeel(async () => {
        // Eén pagina van 100 is ruim genoeg voor openstaande facturen bij een klein bureau.
        const filter = encodeURIComponent("state:open|late|reminded|pending_payment");
        const r = (await moneybird(`sales_invoices.json?per_page=100&filter=${filter}`)) as {
          id: string;
          invoice_id: string | null;
          state: string;
          invoice_date: string | null;
          due_date: string | null;
          total_price_incl_tax: unknown;
          total_unpaid: unknown;
          contact?: { company_name?: string; firstname?: string; lastname?: string } | null;
        }[];
        return r.map((f) => ({
          id: f.id,
          nummer: f.invoice_id,
          status: f.state,
          datum: f.invoice_date,
          vervaldatum: f.due_date,
          totaal: getal(f.total_price_incl_tax),
          open: getal(f.total_unpaid),
          klant:
            f.contact?.company_name ||
            [f.contact?.firstname, f.contact?.lastname].filter(Boolean).join(" ") ||
            "Onbekende klant",
          url: `https://moneybird.com/${ADMINISTRATIE}/sales_invoices/${f.id}`,
        }));
      }),
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
