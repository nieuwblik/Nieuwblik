import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Afmelden met één klik vanuit Gmail, Outlook en Apple Mail (RFC 8058).
 *
 * Elke mailing heeft de koppen List-Unsubscribe (met deze URL) en
 * List-Unsubscribe-Post. Een mailprogramma dat dat ziet, toont bovenin de mail
 * een knop "Afmelden" en stuurt bij een klik zelf een POST naar deze URL,
 * zonder dat de lezer een pagina opent. Grote providers gebruiken die koppen
 * ook bij de beoordeling of een mail in de inbox hoort.
 *
 * - POST ?t=<token>: meld meteen af en antwoord 200.
 * - GET ?t=<token>: iemand opende de link in een browser; stuur door naar de
 *   afmeldpagina op de site, die eerst om bevestiging vraagt.
 *
 * Openbaar (verify_jwt = false in supabase/config.toml): een mailprogramma
 * stuurt geen inlog mee. Het token is het enige wat telt, en de functie
 * mail_afmelden zet alleen de afmelddatum voor dat ene token.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://nieuwblik.com";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

serve(async (req: Request): Promise<Response> => {
  const token = new URL(req.url).searchParams.get("t") ?? "";

  if (req.method === "GET") {
    const doel = UUID.test(token) ? `${SITE_URL}/afmelden?t=${token}` : `${SITE_URL}/afmelden`;
    return Response.redirect(doel, 302);
  }

  if (req.method !== "POST") return new Response("Alleen GET of POST", { status: 405 });
  if (!UUID.test(token)) return new Response("Ongeldige afmeldlink", { status: 400 });

  const { error } = await admin.rpc("mail_afmelden", { _token: token });
  if (error) {
    console.error("mail-afmelden:", error.message);
    return new Response("Afmelden mislukt", { status: 500 });
  }

  // Ook een onbekend token krijgt 200: een mailprogramma heeft niets aan een
  // fout, en zo valt niet af te leiden welke tokens bestaan.
  return new Response("Je bent afgemeld voor mailingen van Nieuwblik.", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
});
