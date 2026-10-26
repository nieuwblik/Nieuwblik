import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Websitebewaking voor het portaal: per klantsite (de live-URL van een
 * project) of hij bereikbaar is en hoe snel, tot wanneer het SSL-certificaat
 * geldig is en, waar het register dat prijsgeeft, tot wanneer de domeinnaam
 * loopt. Elke controle wordt bewaard in website_controles.
 *
 * Twee manieren van aanroepen:
 * - door een admin (vanuit het portaal): zonder projectId alle projecten met
 *   een live-URL, met projectId alleen dat ene; het antwoord bevat de uitkomst;
 * - gepland (pg_cron, twee keer per dag) met alleen de publieke anon-sleutel,
 *   dus zonder gebruiker erachter: controleert alles en geeft niets terug. Is
 *   de laatste controle minder dan 30 minuten oud, dan gebeurt er niets; zo
 *   levert aanroepen met die openbare sleutel niets op. De JWT-controle van
 *   de gateway blijft aan: zonder geldig project-token komt niemand binnen.
 *
 * Een site die faalt krijgt na 10 seconden een tweede kans, zodat één korte
 * hapering (een herstart, een time-out) geen valse melding geeft. Gaat een
 * site van bereikbaar naar onbereikbaar, dan komt er één mail.
 *
 * Bronnen: de site zelf (een gewone GET), Cert Spotter en crt.sh voor certificaten (openbare
 * certificatenregisters) en RDAP voor domeinen. .nl-domeinen geven via RDAP
 * geen verloopdatum; die blijft dan leeg.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
/** Waar de melding heen gaat als een site plat gaat; hetzelfde adres als het contactformulier. */
const MELDING_AAN = "justin@nieuwblik.com";
/** Zo lang na een controle doet een geplande aanroep niets. */
const RUST_MS = 30 * 60 * 1000;
/** Wachttijd voor de tweede poging bij een site die faalt. */
const HERKANSING_MS = 10_000;

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

interface Project {
  id: string;
  name: string;
  live_url: string;
  client: { name: string } | null;
}

/** Eén keer de site opvragen: bereikbaar, statuscode, laadtijd of de fout. */
async function probeer(url: string) {
  const begin = performance.now();
  try {
    const res = await haal(url, 15000, { redirect: "follow", headers: { "User-Agent": "Nieuwblik-websitebewaking/1.0" } });
    await res.arrayBuffer();
    const online = res.status < 400;
    return {
      online,
      statusCode: res.status as number | null,
      laadtijd: Math.round(performance.now() - begin) as number | null,
      fout: online ? null : `De site gaf status ${res.status}`,
    };
  } catch (e) {
    return {
      online: false,
      statusCode: null,
      laadtijd: null,
      fout:
        e instanceof DOMException && e.name === "AbortError"
          ? "Geen antwoord binnen 15 seconden"
          : `Niet bereikbaar: ${String(e).slice(0, 160)}`,
    };
  }
}

async function controleer(project: Project) {
  const url = project.live_url.startsWith("http") ? project.live_url : `https://${project.live_url}`;
  const host = hostVan(url);

  // Faalt de site, dan na 10 seconden nog een keer; pas twee keer mis is offline.
  let poging = await probeer(url);
  if (!poging.online) {
    await new Promise((klaar) => setTimeout(klaar, HERKANSING_MS));
    poging = await probeer(url);
  }

  const [ssl, domein] = host
    ? await Promise.all([sslGeldigTot(host), domeinGeldigTot(domeinVan(host))])
    : [null, null];

  const regel = {
    project_id: project.id,
    url,
    online: poging.online,
    status_code: poging.statusCode,
    laadtijd_ms: poging.laadtijd,
    ssl_geldig_tot: ssl,
    domein_geldig_tot: domein,
    fout: poging.fout,
  };
  const { error } = await admin.from("website_controles").insert(regel);
  if (error) throw new Error(error.message);
  return regel;
}

const html = (tekst: string) =>
  tekst.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Eén mail met de sites die net onbereikbaar zijn geworden. Mislukt die, dan alleen in het log. */
async function meldOffline(sites: { naam: string; url: string; fout: string | null }[]) {
  if (sites.length === 0 || !RESEND_API_KEY) return;
  const onderwerp =
    sites.length === 1 ? `Website offline: ${sites[0]!.naam}` : `${sites.length} websites offline`;
  const regels = sites
    .map(
      (s) =>
        `<li style="margin-bottom:8px"><strong>${html(s.naam)}</strong><br><a href="${html(s.url)}">${html(s.url)}</a><br><span style="color:#666">${html(s.fout ?? "Onbereikbaar")}</span></li>`,
    )
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: "Nieuwblik Websitebewaking <contact@nieuwblik.com>",
      to: [MELDING_AAN],
      subject: onderwerp,
      html: `<p>Bij de controle van zojuist ${sites.length === 1 ? "was deze site" : "waren deze sites"} twee keer achter elkaar onbereikbaar:</p><ul style="padding-left:18px">${regels}</ul><p style="color:#666">Zodra een site weer bereikbaar is, zie je dat in het portaal. Je krijgt pas weer een mail als hij opnieuw plat gaat.</p>`,
    }),
  });
  if (!res.ok) console.error("melding versturen mislukt:", res.status, (await res.text().catch(() => "")).slice(0, 200));
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return antwoord({ error: "Alleen POST" }, 405);

  try {
    // Een ingelogde gebruiker (vanuit het portaal) moet admin zijn. Zonder
    // gebruiker achter het token (de anon-sleutel van de planning) is het de
    // geplande controle.
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: gebruiker } = jwt ? await admin.auth.getUser(jwt) : { data: null };
    const gepland = !gebruiker?.user;
    if (!gepland) {
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: gebruiker!.user!.id, _role: "admin" });
      if (!isAdmin) return antwoord({ error: "Geen toegang" }, 403);
    } else {
      const { data: laatste } = await admin
        .from("website_controles")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (laatste && Date.now() - new Date(laatste.created_at).getTime() < RUST_MS) {
        return antwoord({ ok: true, overgeslagen: true });
      }
    }

    const body = ((await req.json().catch(() => ({}))) ?? {}) as { projectId?: unknown };
    let vraag = admin
      .from("projects")
      .select("id, name, live_url, client:clients(name)")
      .not("live_url", "is", null)
      .neq("live_url", "");
    if (!gepland && typeof body.projectId === "string") vraag = vraag.eq("id", body.projectId);
    const { data: projecten, error } = await vraag;
    if (error) throw new Error(error.message);
    const lijst = (projecten ?? []) as unknown as Project[];

    // Hoe het er de vorige keer voor stond, om alleen bij een nieuwe storing te mailen.
    const { data: vorige } = await admin
      .from("website_controles")
      .select("project_id, online")
      .in("project_id", lijst.map((p) => p.id))
      .order("created_at", { ascending: false })
      .limit(1000);
    const wasOnline = new Map<string, boolean>();
    for (const c of (vorige ?? []) as { project_id: string; online: boolean }[]) {
      if (!wasOnline.has(c.project_id)) wasOnline.set(c.project_id, c.online);
    }

    // Een paar tegelijk: snel genoeg, zonder crt.sh te overvragen.
    const resultaten: Awaited<ReturnType<typeof controleer>>[] = [];
    for (let i = 0; i < lijst.length; i += 4) {
      resultaten.push(...(await Promise.all(lijst.slice(i, i + 4).map(controleer))));
    }

    const netOffline = resultaten
      .filter((r) => !r.online && wasOnline.get(r.project_id) !== false)
      .map((r) => {
        const p = lijst.find((x) => x.id === r.project_id);
        return { naam: p?.client?.name ?? p?.name ?? r.url, url: r.url, fout: r.fout };
      });
    await meldOffline(netOffline);

    return gepland
      ? antwoord({ ok: true, gecontroleerd: resultaten.length })
      : antwoord({ ok: true, gecontroleerd: resultaten.length, resultaten });
  } catch (fout) {
    console.error("website-controle:", fout);
    return antwoord({ error: fout instanceof Error ? fout.message : "Er ging iets mis" }, 500);
  }
});
