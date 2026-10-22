import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

/**
 * Mailing vanuit het dashboard (pagina "Mailen"): één mail per klant, via
 * Resend. Alleen voor admins. Met test: true gaat er één mail naar de admin
 * zelf en wordt niets opgeslagen.
 *
 * {naam} in onderwerp of tekst wordt per klant vervangen door de
 * contactpersoon (of de bedrijfsnaam als die ontbreekt). Elke mail heeft een
 * afmeldlink; afgemelde klanten worden overgeslagen.
 */

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SITE_URL = "https://nieuwblik.com";
const AFZENDER = "Nieuwblik <contact@nieuwblik.com>";
// Resend accepteert maximaal 100 mails per batchverzoek.
const BATCH = 100;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const verzoekSchema = z.object({
  onderwerp: z.string().trim().min(1, "Onderwerp ontbreekt").max(200, "Onderwerp te lang"),
  tekst: z.string().trim().min(1, "Tekst ontbreekt").max(20000, "Tekst te lang"),
  statussen: z.array(z.enum(["prospect", "actief", "inactief"])).default(["actief"]),
  test: z.boolean().default(false),
});

const antwoord = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

function escapeHtml(tekst: string): string {
  return tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const vulIn = (tekst: string, naam: string) => tekst.replace(/\{naam\}/g, naam);

/** Platte tekst naar eenvoudige HTML: alinea's, regeleinden en klikbare links. */
function naarHtml(tekst: string): string {
  return tekst
    .split(/\n{2,}/)
    .map((alinea) => {
      const veilig = escapeHtml(alinea)
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#0f4c3a">$1</a>')
        .replace(/\n/g, "<br>");
      return `<p style="margin:0 0 16px">${veilig}</p>`;
    })
    .join("");
}

function htmlMail(onderwerp: string, tekst: string, afmeldUrl: string): string {
  return `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(onderwerp)}</title></head>
<body style="margin:0;background:#f5f7f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#121a17">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7f6;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:32px">
        <tr><td style="font-size:20px;font-weight:700;letter-spacing:-0.02em;padding-bottom:24px;color:#0f4c3a">Nieuwblik</td></tr>
        <tr><td style="font-size:16px;line-height:1.6">${naarHtml(tekst)}</td></tr>
      </table>
      <p style="max-width:560px;font-size:12px;line-height:1.5;color:#6b7470;margin:16px auto 0">
        Je ontvangt deze mail omdat je klant bent van Nieuwblik.
        <a href="${afmeldUrl}" style="color:#6b7470">Afmelden</a>
      </p>
    </td></tr>
  </table>
</body></html>`;
}

const tekstMail = (tekst: string, afmeldUrl: string) =>
  `${tekst}\n\n--\nJe ontvangt deze mail omdat je klant bent van Nieuwblik.\nAfmelden: ${afmeldUrl}\n`;

interface Ontvanger {
  client_id: string | null;
  email: string;
  naam: string;
  token: string | null;
}

function mailVoor(o: Ontvanger, onderwerp: string, tekst: string, replyTo: string | undefined, test: boolean) {
  const afmeldUrl = o.token ? `${SITE_URL}/afmelden?t=${o.token}` : `${SITE_URL}/afmelden`;
  const ow = vulIn(onderwerp, o.naam);
  const tk = vulIn(tekst, o.naam);
  return {
    from: AFZENDER,
    to: [o.email],
    reply_to: replyTo,
    subject: test ? `[Test] ${ow}` : ow,
    html: htmlMail(ow, tk, afmeldUrl),
    text: tekstMail(tk, afmeldUrl),
    headers: {
      "List-Unsubscribe": `<${afmeldUrl}>, <mailto:contact@nieuwblik.com?subject=Afmelden>`,
    },
  };
}

async function verstuurBatch(mails: ReturnType<typeof mailVoor>[]) {
  const res = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify(mails),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Resend gaf status ${res.status}`);
  return (data?.data ?? []) as { id: string }[];
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return antwoord({ error: "Alleen POST" }, 405);

  try {
    if (!RESEND_API_KEY) return antwoord({ error: "RESEND_API_KEY ontbreekt" }, 500);

    // Alleen ingelogde admins.
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: gebruiker, error: authFout } = await admin.auth.getUser(jwt);
    if (authFout || !gebruiker?.user) return antwoord({ error: "Niet ingelogd" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: gebruiker.user.id, _role: "admin" });
    if (!isAdmin) return antwoord({ error: "Geen toegang" }, 403);

    const parsed = verzoekSchema.safeParse(await req.json());
    if (!parsed.success) return antwoord({ error: parsed.error.errors[0]?.message ?? "Ongeldig verzoek" }, 400);
    const { onderwerp, tekst, statussen, test } = parsed.data;
    const replyTo = gebruiker.user.email ?? undefined;

    // Testmail: alleen naar de admin zelf, niets opslaan.
    if (test) {
      if (!gebruiker.user.email) return antwoord({ error: "Je account heeft geen e-mailadres" }, 400);
      await verstuurBatch([
        mailVoor({ client_id: null, email: gebruiker.user.email, naam: "Test", token: null }, onderwerp, tekst, replyTo, true),
      ]);
      return antwoord({ verstuurd: 1, mislukt: 0, test: true });
    }

    if (statussen.length === 0) return antwoord({ error: "Kies minstens één groep klanten" }, 400);

    const { data: klanten, error: klantFout } = await admin
      .from("clients")
      .select("id, name, contact_name, email, mail_afmeld_token")
      .in("status", statussen)
      .is("mail_afgemeld_op", null)
      .not("email", "is", null);
    if (klantFout) throw new Error(klantFout.message);

    // Eén mail per adres, ook als twee klanten hetzelfde adres hebben.
    const gezien = new Set<string>();
    const ontvangers: Ontvanger[] = [];
    for (const k of klanten ?? []) {
      const email = (k.email ?? "").trim();
      if (!email || !email.includes("@")) continue;
      const sleutel = email.toLowerCase();
      if (gezien.has(sleutel)) continue;
      gezien.add(sleutel);
      ontvangers.push({
        client_id: k.id,
        email,
        naam: (k.contact_name ?? "").trim() || k.name,
        token: k.mail_afmeld_token,
      });
    }
    if (ontvangers.length === 0) return antwoord({ error: "Geen klanten met een e-mailadres in deze groep" }, 400);

    const { data: mailing, error: mailingFout } = await admin
      .from("mailings")
      .insert({ onderwerp, tekst, statussen, verstuurd_door: gebruiker.user.id })
      .select("id")
      .single();
    if (mailingFout || !mailing) throw new Error(mailingFout?.message ?? "Mailing opslaan mislukt");

    const regels: Record<string, unknown>[] = [];
    let mislukt = 0;
    for (let i = 0; i < ontvangers.length; i += BATCH) {
      const deel = ontvangers.slice(i, i + BATCH);
      try {
        const ids = await verstuurBatch(deel.map((o) => mailVoor(o, onderwerp, tekst, replyTo, false)));
        deel.forEach((o, j) =>
          regels.push({ mailing_id: mailing.id, client_id: o.client_id, email: o.email, naam: o.naam, status: "verstuurd", resend_id: ids[j]?.id ?? null }),
        );
      } catch (fout) {
        mislukt += deel.length;
        const bericht = fout instanceof Error ? fout.message : String(fout);
        deel.forEach((o) =>
          regels.push({ mailing_id: mailing.id, client_id: o.client_id, email: o.email, naam: o.naam, status: "mislukt", fout: bericht }),
        );
      }
    }

    await admin.from("mailing_ontvangers").insert(regels);
    await admin
      .from("mailings")
      .update({ aantal_ontvangers: ontvangers.length - mislukt, aantal_mislukt: mislukt })
      .eq("id", mailing.id);

    return antwoord({ verstuurd: ontvangers.length - mislukt, mislukt });
  } catch (fout) {
    console.error("send-mailing:", fout);
    return antwoord({ error: fout instanceof Error ? fout.message : "Er ging iets mis" }, 500);
  }
});
