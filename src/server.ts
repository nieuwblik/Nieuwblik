import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { findRedirect } from "./config/redirects";
import { SITE_URL } from "./config/site";

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

/**
 * Het portaal mag niet in een frame van een andere site staan: anders kan een
 * vreemde pagina het onzichtbaar laden en een ingelogde admin op "Versturen"
 * of "Verwijderen" laten klikken (clickjacking). Alleen de eigen site en de
 * Lovable-editor (die de preview in een frame toont) mogen het insluiten.
 * Geen X-Frame-Options: die kent geen lijst, en frame-ancestors gaat voor.
 */
const PORTAAL_FRAMES = "frame-ancestors 'self' https://lovable.dev https://*.lovable.dev";

function beschermPortaal(request: Request, response: Response): Response {
  const pad = new URL(request.url).pathname;
  if (!/^\/admin(\/|$)/.test(pad)) return response;
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", PORTAAL_FRAMES);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
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

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return beschermPortaal(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
