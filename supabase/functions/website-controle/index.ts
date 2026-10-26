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
 * - gepland (pg_cron, elk uur) met alleen de publieke anon-sleutel,
 *   dus zonder gebruiker erachter: controleert alles en geeft niets terug. Zijn
 *   alle sites in de laatste 20 minuten al gecontroleerd, dan gebeurt er niets;
 *   zo levert aanroepen met die openbare sleutel niets op. De JWT-controle van
 *   de gateway blijft aan: zonder geldig project-token komt niemand binnen.
 * - door een admin met { test: true }: een testmelding naar de eigen apparaten.
 *
 * Het certificaat en de domeinnaam veranderen zelden; die worden bij de
 * geplande controle één keer per dag opgevraagd (om 7:05 UTC), de andere uren
 * gaan de vorige waarden mee.
 *
 * Een site die faalt krijgt na 10 seconden een tweede kans, zodat één korte
 * hapering (een herstart, een time-out) geen valse melding geeft. Gaat een
 * site van bereikbaar naar onbereikbaar, dan komt er één mail en een
 * pushmelding; komt hij weer terug, dan een pushmelding dat hij weer online is.
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
/** Zijn alle sites in deze tijd al gecontroleerd, dan doet een geplande aanroep niets. */
const RUST_MS = 20 * 60 * 1000;
/** Het uur (UTC) waarin de geplande controle ook certificaat en domein opvraagt. */
const OPZOEK_UUR = 7;

/**
 * De openbare VAPID-sleutel (ook in src/admin/push.ts); de geheime staat als
 * VAPID_PRIVATE_KEY in de secrets. Zonder geheime sleutel geen pushmeldingen.
 */
const VAPID_PUBLIC_KEY = "BEITG1hUJxxt5V-f7eWnaUuDSX0ncPBs9_9x9HmMj0mF_g5XyxF9ElNLb9q62cBANitj4XkkPyr_4doQvZpRugE";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");
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

interface Vorige {
  online: boolean;
  ssl: string | null;
  domein: string | null;
}

async function controleer(project: Project, opzoeken: boolean, vorige: Vorige | undefined) {
  const url = project.live_url.startsWith("http") ? project.live_url : `https://${project.live_url}`;
  const host = hostVan(url);

  // Faalt de site, dan na 10 seconden nog een keer; pas twee keer mis is offline.
  let poging = await probeer(url);
  if (!poging.online) {
    await new Promise((klaar) => setTimeout(klaar, HERKANSING_MS));
    poging = await probeer(url);
  }

  const [ssl, domein] =
    host && (opzoeken || !vorige)
      ? await Promise.all([sslGeldigTot(host), domeinGeldigTot(domeinVan(host))])
      : [vorige?.ssl ?? null, vorige?.domein ?? null];

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

// ------------------------------------------------------------------ push

/**
 * Web Push zonder extra pakket: de inhoud versleuteld volgens RFC 8291
 * (aes128gcm) en de afzender bewezen met een VAPID-token (RFC 8292), allebei
 * met WebCrypto. Zo werkt het bij Apple, Google en Mozilla.
 */
const tekst = new TextEncoder();

const b64url = {
  naar: (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  van: (s: string) => {
    const t = s.replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(t + "===".slice((t.length + 3) % 4)), (c) => c.charCodeAt(0));
  },
};

/**
 * Bytes zoals WebCrypto en fetch ze willen. Nieuwere TypeScript maakt van
 * Uint8Array een generiek type dat niet altijd als BufferSource telt; dit
 * werkt op oude en nieuwe versies.
 */
const bron = (b: Uint8Array) => b as unknown as BufferSource;

function plak(...delen: Uint8Array[]): Uint8Array {
  const uit = new Uint8Array(delen.reduce((n, d) => n + d.length, 0));
  let plek = 0;
  for (const d of delen) {
    uit.set(d, plek);
    plek += d.length;
  }
  return uit;
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, lengte: number): Promise<Uint8Array> {
  const sleutel = await crypto.subtle.importKey("raw", bron(ikm), "HKDF", false, ["deriveBits"]);
  return new Uint8Array(
    await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: bron(salt), info: bron(info) }, sleutel, lengte * 8),
  );
}

let vapidSleutel: Promise<CryptoKey> | null = null;
function vapidOndertekenaar(): Promise<CryptoKey> {
  if (!vapidSleutel) {
    const publiek = b64url.van(VAPID_PUBLIC_KEY);
    vapidSleutel = crypto.subtle.importKey(
      "jwk",
      {
        kty: "EC",
        crv: "P-256",
        d: VAPID_PRIVATE_KEY!,
        x: b64url.naar(publiek.slice(1, 33)),
        y: b64url.naar(publiek.slice(33, 65)),
        ext: true,
      },
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"],
    );
  }
  return vapidSleutel;
}

/** De Authorization-kop: een kort geldig token voor deze pushdienst, ondertekend met de VAPID-sleutel. */
async function vapidKop(endpoint: string): Promise<string> {
  const deel = (o: unknown) => b64url.naar(tekst.encode(JSON.stringify(o)));
  const ongetekend = `${deel({ typ: "JWT", alg: "ES256" })}.${deel({
    aud: new URL(endpoint).origin,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: `mailto:${MELDING_AAN}`,
  })}`;
  const handtekening = new Uint8Array(
    await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, await vapidOndertekenaar(), bron(tekst.encode(ongetekend))),
  );
  return `vapid t=${ongetekend}.${b64url.naar(handtekening)}, k=${VAPID_PUBLIC_KEY}`;
}

/** De melding versleuteld voor één browser (RFC 8291, één record). */
async function versleutel(inhoud: Uint8Array, p256dh: string, authGeheim: string): Promise<Uint8Array> {
  const browserPubliek = b64url.van(p256dh);
  const auth = b64url.van(authGeheim);
  const eenmalig = (await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
    "deriveBits",
  ])) as CryptoKeyPair;
  const onzePubliek = new Uint8Array(await crypto.subtle.exportKey("raw", eenmalig.publicKey));
  const browserSleutel = await crypto.subtle.importKey("raw", bron(browserPubliek), { name: "ECDH", namedCurve: "P-256" }, false, []);
  const gedeeld = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: browserSleutel }, eenmalig.privateKey, 256),
  );
  const ikm = await hkdf(auth, gedeeld, plak(tekst.encode("WebPush: info\0"), browserPubliek, onzePubliek), 32);
  const zout = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(zout, ikm, tekst.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(zout, ikm, tekst.encode("Content-Encoding: nonce\0"), 12);
  const aes = await crypto.subtle.importKey("raw", bron(cek), "AES-GCM", false, ["encrypt"]);
  // Na de inhoud het scheidingsteken 2: dit is het laatste (en enige) record.
  const versleuteld = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: bron(nonce) }, aes, bron(plak(inhoud, Uint8Array.of(2)))),
  );
  const kop = new Uint8Array(16 + 4 + 1 + onzePubliek.length);
  kop.set(zout, 0);
  new DataView(kop.buffer).setUint32(16, 4096);
  kop[20] = onzePubliek.length;
  kop.set(onzePubliek, 21);
  return plak(kop, versleuteld);
}

interface Abonnement {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface PushBericht {
  titel: string;
  tekst: string;
  /** Waar een klik op de melding heen gaat. */
  url: string;
  /** Meldingen met dezelfde tag vervangen elkaar op het apparaat. */
  tag?: string;
}

/**
 * Een melding naar de apparaten van iedereen (of één gebruiker). Een abonnement
 * dat de pushdienst niet meer kent (404/410), gaat weg. Geeft het aantal
 * geslaagde verzendingen terug.
 */
async function stuurPush(bericht: PushBericht, alleenVoor?: string): Promise<number> {
  if (!VAPID_PRIVATE_KEY) {
    console.error("pushmelding overgeslagen: VAPID_PRIVATE_KEY ontbreekt");
    return 0;
  }
  let vraag = admin.from("push_abonnementen").select("id, user_id, endpoint, p256dh, auth");
  if (alleenVoor) vraag = vraag.eq("user_id", alleenVoor);
  const { data, error } = await vraag;
  if (error) {
    console.error("pushabonnementen lezen mislukt:", error.message);
    return 0;
  }
  const inhoud = tekst.encode(JSON.stringify(bericht));
  let gelukt = 0;
  await Promise.all(
    ((data ?? []) as Abonnement[]).map(async (a) => {
      try {
        const res = await haal(a.endpoint, 15000, {
          method: "POST",
          headers: {
            Authorization: await vapidKop(a.endpoint),
            "Content-Encoding": "aes128gcm",
            "Content-Type": "application/octet-stream",
            TTL: "86400",
            Urgency: "high",
          },
          body: bron(await versleutel(inhoud, a.p256dh, a.auth)),
        });
        if (res.status === 404 || res.status === 410) {
          await admin.from("push_abonnementen").delete().eq("id", a.id);
        } else if (res.ok) {
          gelukt += 1;
        } else {
          console.error("pushmelding geweigerd:", res.status, (await res.text().catch(() => "")).slice(0, 200));
        }
      } catch (e) {
        console.error("pushmelding mislukt:", e instanceof Error ? e.message : e);
      }
    }),
  );
  return gelukt;
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
    const body = ((await req.json().catch(() => ({}))) ?? {}) as { projectId?: unknown; test?: unknown };
    if (!gepland) {
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: gebruiker!.user!.id, _role: "admin" });
      if (!isAdmin) return antwoord({ error: "Geen toegang" }, 403);
      // Een testmelding naar de eigen apparaten.
      if (body.test === true) {
        if (!VAPID_PRIVATE_KEY) return antwoord({ error: "VAPID_PRIVATE_KEY ontbreekt in de secrets." }, 500);
        const verstuurd = await stuurPush(
          { titel: "Testmelding", tekst: "Pushmeldingen van de websitebewaking werken.", url: "/admin/websites", tag: "test" },
          gebruiker!.user!.id,
        );
        return antwoord({ ok: true, verstuurd });
      }
    }

    let vraag = admin
      .from("projects")
      .select("id, name, live_url, client:clients(name)")
      .not("live_url", "is", null)
      .neq("live_url", "");
    if (!gepland && typeof body.projectId === "string") vraag = vraag.eq("id", body.projectId);
    const { data: projecten, error } = await vraag;
    if (error) throw new Error(error.message);
    const lijst = (projecten ?? []) as unknown as Project[];

    // Gepland: niets doen als alle sites net al gecontroleerd zijn (een losse
    // handmatige controle van één site houdt de ronde dus niet tegen).
    if (gepland) {
      const { count } = await admin
        .from("website_controles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - RUST_MS).toISOString());
      if ((count ?? 0) >= lijst.length) return antwoord({ ok: true, overgeslagen: true });
    }

    // Hoe het er de vorige keer voor stond, om alleen bij een nieuwe storing te mailen.
    const { data: vorige } = await admin
      .from("website_controles")
      .select("project_id, online, ssl_geldig_tot, domein_geldig_tot")
      .in("project_id", lijst.map((p) => p.id))
      .order("created_at", { ascending: false })
      .limit(1000);
    const vorigeStand = new Map<string, Vorige>();
    for (const c of (vorige ?? []) as {
      project_id: string;
      online: boolean;
      ssl_geldig_tot: string | null;
      domein_geldig_tot: string | null;
    }[]) {
      if (!vorigeStand.has(c.project_id)) {
        vorigeStand.set(c.project_id, { online: c.online, ssl: c.ssl_geldig_tot, domein: c.domein_geldig_tot });
      }
    }
    // Certificaat en domein: met de hand altijd, gepland één keer per dag.
    const opzoeken = !gepland || new Date().getUTCHours() === OPZOEK_UUR;

    // Een paar tegelijk: snel genoeg, zonder crt.sh te overvragen.
    const resultaten: Awaited<ReturnType<typeof controleer>>[] = [];
    for (let i = 0; i < lijst.length; i += 4) {
      resultaten.push(
        ...(await Promise.all(lijst.slice(i, i + 4).map((p) => controleer(p, opzoeken, vorigeStand.get(p.id))))),
      );
    }

    const naamVan = (projectId: string, url: string) => {
      const p = lijst.find((x) => x.id === projectId);
      return p?.client?.name ?? p?.name ?? url;
    };
    const netOffline = resultaten
      .filter((r) => !r.online && vorigeStand.get(r.project_id)?.online !== false)
      .map((r) => ({ naam: naamVan(r.project_id, r.url), url: r.url, fout: r.fout, projectId: r.project_id }));
    const weerOnline = resultaten
      .filter((r) => r.online && vorigeStand.get(r.project_id)?.online === false)
      .map((r) => ({ naam: naamVan(r.project_id, r.url), projectId: r.project_id, laadtijd: r.laadtijd_ms }));

    await Promise.all([
      meldOffline(netOffline),
      ...netOffline.map((s) =>
        stuurPush({
          titel: `${s.naam} is offline`,
          tekst: s.fout ?? "De site is onbereikbaar.",
          url: "/admin/websites",
          tag: `site-${s.projectId}`,
        }),
      ),
      ...weerOnline.map((s) =>
        stuurPush({
          titel: `${s.naam} is weer online`,
          tekst: s.laadtijd ? `Bereikbaar, laadtijd ${(s.laadtijd / 1000).toFixed(1).replace(".", ",")} s.` : "Weer bereikbaar.",
          url: "/admin/websites",
          tag: `site-${s.projectId}`,
        }),
      ),
    ]);

    return gepland
      ? antwoord({ ok: true, gecontroleerd: resultaten.length })
      : antwoord({ ok: true, gecontroleerd: resultaten.length, resultaten });
  } catch (fout) {
    console.error("website-controle:", fout);
    return antwoord({ error: fout instanceof Error ? fout.message : "Er ging iets mis" }, 500);
  }
});
