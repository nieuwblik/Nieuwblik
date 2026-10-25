import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Meldingen van Resend over verstuurde mailingen (webhook). Resend roept deze
 * functie aan bij elke gebeurtenis; zonder geldige handtekening doet hij niets.
 *
 * Per ontvanger van een mailing (gevonden op het Resend-id) wordt de stand
 * bijgewerkt: verstuurd, afgeleverd, vertraagd, onbestelbaar, spamklacht of
 * mislukt. En voor de klant:
 * - onbestelbaar (een harde bounce, of een adres dat Resend al blokkeert):
 *   het adres krijgt een markering en geen mailingen meer tot het is
 *   aangepast;
 * - spamklacht: de klant staat daarna als afgemeld, net als met de
 *   afmeldlink.
 * Mails die niet bij een mailing horen (zoals het contactformulier) worden
 * genegeerd.
 *
 * Instellen in Resend: Webhooks, eindpunt
 * {SUPABASE_URL}/functions/v1/resend-webhook, met in elk geval de
 * gebeurtenissen email.sent, email.delivered, email.delivery_delayed,
 * email.bounced, email.complained, email.failed en email.suppressed. Het
 * geheim (whsec_…) hoort als secret RESEND_WEBHOOK_SECRET.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEHEIM = Deno.env.get("RESEND_WEBHOOK_SECRET");

/** Zo oud mag een melding hooguit zijn (tegen het opnieuw afspelen van oude meldingen). */
const TOLERANTIE_SECONDEN = 5 * 60;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const antwoord = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/**
 * De handtekening zoals Svix (waar Resend mee werkt) hem zet: HMAC-SHA256 over
 * "{id}.{tijdstip}.{body}" met het base64-geheim na "whsec_", als base64. De
 * kop kan meerdere handtekeningen bevatten ("v1,abc v1,def").
 */
async function isEcht(id: string, tijdstip: string, body: string, kop: string): Promise<boolean> {
  if (!GEHEIM) return false;
  const sleutel = Uint8Array.from(atob(GEHEIM.replace(/^whsec_/, "")), (c) => c.charCodeAt(0));
  const crypto = await globalThis.crypto.subtle.importKey("raw", sleutel, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const handtekening = await globalThis.crypto.subtle.sign("HMAC", crypto, new TextEncoder().encode(`${id}.${tijdstip}.${body}`));
  const verwacht = btoa(String.fromCharCode(...new Uint8Array(handtekening)));
  return kop.split(" ").some((deel) => {
    const [versie, waarde] = deel.split(",");
    if (versie !== "v1" || !waarde || waarde.length !== verwacht.length) return false;
    // Vergelijken zonder vroeg te stoppen, zodat de duur niets verraadt.
    let verschil = 0;
    for (let i = 0; i < waarde.length; i += 1) verschil |= waarde.charCodeAt(i) ^ verwacht.charCodeAt(i);
    return verschil === 0;
  });
}

/** Hoe ver een mail is; een melding zet de stand nooit terug (ze komen niet altijd op volgorde). */
const RANG: Record<string, number> = {
  ingepland: 0,
  verstuurd: 1,
  vertraagd: 2,
  afgeleverd: 3,
  gebounced: 4,
  klacht: 4,
  mislukt: 4,
  geannuleerd: 4,
};

const NIEUWE_STAND: Record<string, string> = {
  "email.sent": "verstuurd",
  "email.delivered": "afgeleverd",
  "email.delivery_delayed": "vertraagd",
  "email.bounced": "gebounced",
  "email.suppressed": "gebounced",
  "email.complained": "klacht",
  "email.failed": "mislukt",
};

interface Melding {
  type?: string;
  data?: {
    email_id?: string;
    bounce?: { type?: string; subType?: string; message?: string };
    failed?: { reason?: string };
  };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return antwoord({ error: "Alleen POST" }, 405);
  if (!GEHEIM) {
    console.error("resend-webhook: RESEND_WEBHOOK_SECRET ontbreekt");
    return antwoord({ error: "Niet ingesteld" }, 500);
  }

  const body = await req.text();
  const id = req.headers.get("svix-id") ?? req.headers.get("webhook-id") ?? "";
  const tijdstip = req.headers.get("svix-timestamp") ?? req.headers.get("webhook-timestamp") ?? "";
  const kop = req.headers.get("svix-signature") ?? req.headers.get("webhook-signature") ?? "";
  if (!id || !/^\d+$/.test(tijdstip) || !kop) return antwoord({ error: "Handtekening ontbreekt" }, 400);
  if (Math.abs(Date.now() / 1000 - Number(tijdstip)) > TOLERANTIE_SECONDEN) return antwoord({ error: "Te oud" }, 400);
  if (!(await isEcht(id, tijdstip, body, kop))) return antwoord({ error: "Ongeldige handtekening" }, 401);

  let melding: Melding;
  try {
    melding = JSON.parse(body) as Melding;
  } catch {
    return antwoord({ error: "Geen JSON" }, 400);
  }
  const stand = melding.type ? NIEUWE_STAND[melding.type] : undefined;
  const emailId = melding.data?.email_id;
  // Andere gebeurtenissen, of een mail die niet bij een mailing hoort: bevestigen en klaar.
  if (!stand || !emailId) return antwoord({ ok: true, genegeerd: true });

  const { data: regel } = await admin
    .from("mailing_ontvangers")
    .select("id, mailing_id, client_id, status")
    .eq("resend_id", emailId)
    .maybeSingle();
  if (!regel) return antwoord({ ok: true, genegeerd: true });

  const nu = new Date().toISOString();
  const bounce = melding.data?.bounce;
  const fout =
    stand === "gebounced"
      ? (bounce?.message ?? (melding.type === "email.suppressed" ? "Adres staat bij Resend op de blokkeerlijst" : null))
      : stand === "mislukt"
        ? (melding.data?.failed?.reason ?? null)
        : null;

  if ((RANG[stand] ?? 0) >= (RANG[regel.status] ?? 0)) {
    await admin
      .from("mailing_ontvangers")
      .update({ status: stand, bijgewerkt_op: nu, ...(fout ? { fout } : {}) })
      .eq("id", regel.id);
  }

  // Gevolgen voor de klant.
  if (regel.client_id) {
    const onbestelbaar = melding.type === "email.suppressed" || (stand === "gebounced" && bounce?.type === "Permanent");
    if (onbestelbaar) {
      await admin.from("clients").update({ email_onbestelbaar_op: nu }).eq("id", regel.client_id).is("email_onbestelbaar_op", null);
    }
    if (stand === "klacht") {
      await admin.from("clients").update({ mail_afgemeld_op: nu }).eq("id", regel.client_id).is("mail_afgemeld_op", null);
    }
  }

  // Een ingeplande mailing is klaar als er niets meer in de wachtrij staat.
  if (stand === "verstuurd" || stand === "afgeleverd") {
    const { count } = await admin
      .from("mailing_ontvangers")
      .select("id", { count: "exact", head: true })
      .eq("mailing_id", regel.mailing_id)
      .eq("status", "ingepland");
    if ((count ?? 0) === 0) {
      await admin.from("mailings").update({ status: "verstuurd", updated_at: nu }).eq("id", regel.mailing_id).eq("status", "ingepland");
    }
  }

  return antwoord({ ok: true });
});
