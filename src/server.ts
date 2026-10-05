import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { findRedirect } from "./config/redirects";
import { SITE_URL } from "./config/site";

// Uniek per build (vite.config.ts). Ontbreekt hij, dan cachen we niets.
declare const __BUILD_ID__: string | undefined;
const BUILD_ID = typeof __BUILD_ID__ === "string" ? __BUILD_ID__ : undefined;

/*
 * Edge-cache voor de SSR-HTML. De pagina's zijn voor iedere bezoeker gelijk,
 * maar werden bij elk verzoek opnieuw gerenderd (±0,5-0,9 s wachttijd, ook voor
 * Googlebot). Nu bewaart Cloudflare de HTML maximaal een uur per datacenter.
 * De sleutel bevat de build-id: na elke publicatie start de cache leeg, dus
 * nooit oude HTML die naar verdwenen JS-bestanden verwijst.
 * Alleen GET, status 200, text/html, zonder autorisatie, en nooit voor /admin
 * of serverfuncties.
 */
const EDGE_TTL = 3600;
type EdgeCache = {
  match: (key: Request) => Promise<Response | undefined>;
  put: (key: Request, response: Response) => Promise<void>;
};
const edgeCache = (): EdgeCache | undefined =>
  (globalThis as { caches?: { default?: EdgeCache } }).caches?.default;

function cachebaar(request: Request, url: URL): boolean {
  if (!BUILD_ID || request.method !== "GET") return false;
  // Cookies tellen niet: de SSR leest ze nergens (inloggen gaat via de
  // authorization-header en localStorage), en anders sloeg iedereen met een
  // analytics- of toestemmingscookie de cache over.
  if (request.headers.has("authorization")) return false;
  return !/^\/(admin|api|_server|_serverFn)(\/|$)/.test(url.pathname);
}

const cacheSleutel = (url: URL) =>
  new Request(`https://edge-cache.nieuwblik/${BUILD_ID}${url.pathname}${url.search}`);

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // Permanente redirects vóór de router: zo krijgt een oud of opgeheven pad
    // een echte 301 in plaats van een gerenderde pagina.
    if (request.method === "GET" || request.method === "HEAD") {
      const url = new URL(request.url);
      const doel = findRedirect(url.pathname);
      if (doel) {
        return new Response(null, {
          status: 301,
          headers: { location: `${SITE_URL}${doel}${url.search}` },
        });
      }
      // Trailing slash: zelf een 301 naar het pad zonder, anders doet de
      // router het met een tijdelijke 307.
      if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
        const zonder = url.pathname.replace(/\/+$/, "");
        return new Response(null, {
          status: 301,
          headers: { location: `${SITE_URL}${zonder}${url.search}` },
        });
      }
    }

    const url = new URL(request.url);
    const cache = cachebaar(request, url) ? edgeCache() : undefined;
    if (cache) {
      try {
        const bewaard = await cache.match(cacheSleutel(url));
        if (bewaard) {
          const antwoord = new Response(bewaard.body, bewaard);
          antwoord.headers.set("cache-control", "no-cache, must-revalidate, max-age=0");
          antwoord.headers.set("x-edge-cache", "HIT");
          return antwoord;
        }
      } catch {
        // Cache niet beschikbaar: gewoon renderen.
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await normalizeCatastrophicSsrResponse(
        await handler.fetch(request, env, ctx),
      );
      if (
        cache &&
        response.status === 200 &&
        (response.headers.get("content-type") ?? "").includes("text/html") &&
        !response.headers.has("set-cookie")
      ) {
        // De HTML eerst helemaal ophalen en opslaan, dan pas antwoorden: Nitro
        // geeft geen ctx (dus geen waitUntil) door, en zonder wachten breekt de
        // worker het opslaan af. Alleen de eerste aanvraag per uur wacht dus
        // op de volledige render; daarna komt alles uit de cache.
        const html = await response.text();
        const opTeSlaan = new Response(html, response);
        opTeSlaan.headers.set("cache-control", `public, max-age=${EDGE_TTL}`);
        try {
          await cache.put(cacheSleutel(url), opTeSlaan);
        } catch {
          // Niet opgeslagen: volgende keer opnieuw renderen.
        }
        const uit = new Response(html, response);
        uit.headers.set("x-edge-cache", "MISS");
        return uit;
      }
      return response;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
