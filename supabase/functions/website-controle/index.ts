import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Websitebewaking voor het portaal: per klantsite (de live-URL van een
 * project) of hij bereikbaar is en hoe snel, tot wanneer het SSL-certificaat
 * geldig is en, waar het register dat prijsgeeft, tot wanneer de domeinnaam
 * loopt. Elke controle wordt bewaard in website_controles.
 *
 * Alleen voor admins. Zonder projectId worden alle projecten met een
 * live-URL gecontroleerd; met projectId alleen dat ene.
 *
 * Bronnen: de site zelf (een gewone GET), Cert Spotter en crt.sh voor certificaten (openbare
 * certificatenregisters) en RDAP voor domeinen. .nl-domeinen geven via RDAP
 * geen verloopdatum; die blijft dan leeg.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

/** fetch met een tijdslimiet: een hangende site mag de controle niet ophouden. */
async function haal(url: string, ms: number, init: RequestInit = {}): Promise<Response> {
  const stop = new AbortController();
  const klok = setTimeout(() => stop.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: stop.signal });
  } finally {
    clearTimeout(klok);
  }
}

/** "https://www.voorbeeld.nl/pagina" wordt "www.voorbeeld.nl". */
function hostVan(url: string): string | null {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** Het registreerbare domein: "www.shop.voorbeeld.nl" wordt "voorbeeld.nl" (genoeg voor .nl, .com en dergelijke). */
const domeinVan = (host: string) => host.split(".").slice(-2).join(".");

/** Past een certificaatnaam (ook een wildcard) bij deze host? */
const naamPast = (naam: string, host: string) => naam === host || (naam.startsWith("*.") && host.endsWith(naam.slice(1)));

/**
 * Tot wanneer het nieuwste certificaat voor deze host geldig is. Eerst Cert
 * Spotter (snel), dan crt.sh als reserve: crt.sh is vanaf servers soms traag.
 */
async function sslGeldigTot(host: string): Promise<string | null> {
  return (await sslViaCertSpotter(host)) ?? (await sslViaCrtSh(host));
}

async function sslViaCertSpotter(host: string): Promise<string | null> {
  try {
    const res = await haal(`https://api.certspotter.com/v1/issuances?domain=${encodeURIComponent(host)}&expand=dns_names`, 10000);
    if (!res.ok) return null;
    const lijst = (await res.json()) as { dns_names?: string[]; not_after?: string; revoked?: boolean }[];
    const laatste = lijst
      .filter((c) => !c.revoked && (c.dns_names ?? []).some((n) => naamPast(n, host)))
      .map((c) => c.not_after)
      .filter((d): d is string => Boolean(d))
      .sort()
      .at(-1);
    return laatste ? new Date(laatste).toISOString() : null;
  } catch {
    return null;
  }
}

async function sslViaCrtSh(host: string): Promise<string | null> {
  try {
    const res = await haal(`https://crt.sh/?q=${encodeURIComponent(host)}&output=json&exclude=expired&deduplicate=Y`, 25000);
    if (!res.ok) return null;
    const lijst = (await res.json()) as { not_after?: string; name_value?: string }[];
    const passend = lijst.filter((c) =>
      (c.name_value ?? "").split("\n").some((n) => n === host || (n.startsWith("*.") && host.endsWith(n.slice(1)))),
    );
    const laatste = passend.map((c) => c.not_after).filter(Boolean).sort().at(-1);
    return laatste ? new Date(`${laatste}Z`).toISOString() : null;
  } catch {
    return null;
  }
}

/** Tot wanneer de domeinnaam loopt, via RDAP (niet elk register geeft dit). */
async function domeinGeldigTot(domein: string): Promise<string | null> {
  try {
    const res = await haal(`https://rdap.org/domain/${encodeURIComponent(domein)}`, 8000, {
      headers: { Accept: "application/rdap+json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { events?: { eventAction?: string; eventDate?: string }[] };
    const datum = json.events?.find((e) => e.eventAction === "expiration")?.eventDate;
    return datum ? new Date(datum).toISOString() : null;
  } catch {
    return null;
  }
}

async function controleer(project: { id: string; live_url: string }) {
  const url = project.live_url.startsWith("http") ? project.live_url : `https://${project.live_url}`;
  const host = hostVan(url);
  const begin = performance.now();
  let online = false;
  let statusCode: number | null = null;
  let laadtijd: number | null = null;
  let fout: string | null = null;
  try {
    const res = await haal(url, 15000, { redirect: "follow", headers: { "User-Agent": "Nieuwblik-websitebewaking/1.0" } });
    statusCode = res.status;
    await res.arrayBuffer();
    laadtijd = Math.round(performance.now() - begin);
    online = res.status < 400;
    if (!online) fout = `De site gaf status ${res.status}`;
  } catch (e) {
    fout = e instanceof DOMException && e.name === "AbortError" ? "Geen antwoord binnen 15 seconden" : `Niet bereikbaar: ${String(e).slice(0, 160)}`;
  }

  const [ssl, domein] = host
    ? await Promise.all([sslGeldigTot(host), domeinGeldigTot(domeinVan(host))])
    : [null, null];

  const regel = {
    project_id: project.id,
    url,
    online,
    status_code: statusCode,
    laadtijd_ms: laadtijd,
    ssl_geldig_tot: ssl,
    domein_geldig_tot: domein,
    fout,
  };
  const { error } = await admin.from("website_controles").insert(regel);
  if (error) throw new Error(error.message);
  return regel;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return antwoord({ error: "Alleen POST" }, 405);

  try {
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: gebruiker, error: authFout } = await admin.auth.getUser(jwt);
    if (authFout || !gebruiker?.user) return antwoord({ error: "Niet ingelogd" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: gebruiker.user.id, _role: "admin" });
    if (!isAdmin) return antwoord({ error: "Geen toegang" }, 403);

    const body = ((await req.json().catch(() => ({}))) ?? {}) as { projectId?: unknown };
    let vraag = admin.from("projects").select("id, live_url").not("live_url", "is", null).neq("live_url", "");
    if (typeof body.projectId === "string") vraag = vraag.eq("id", body.projectId);
    const { data: projecten, error } = await vraag;
    if (error) throw new Error(error.message);

    // Een paar tegelijk: snel genoeg, zonder crt.sh te overvragen.
    const lijst = (projecten ?? []) as { id: string; live_url: string }[];
    const resultaten: unknown[] = [];
    for (let i = 0; i < lijst.length; i += 4) {
      resultaten.push(...(await Promise.all(lijst.slice(i, i + 4).map(controleer))));
    }
    return antwoord({ ok: true, gecontroleerd: resultaten.length, resultaten });
  } catch (fout) {
    console.error("website-controle:", fout);
    return antwoord({ error: fout instanceof Error ? fout.message : "Er ging iets mis" }, 500);
  }
});
