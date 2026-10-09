import { LEVERTIJD } from "@/config/business";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster as Sonner } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import appCss from "../styles.css?url";
import cabinLatin from "../assets/fonts/cabin-latin.woff2?url";
import cabinLatinExt from "../assets/fonts/cabin-latin-ext.woff2?url";
import epilogueLatin from "../assets/fonts/epilogue-latin.woff2?url";
import epilogueLatinExt from "../assets/fonts/epilogue-latin-ext.woff2?url";

// Webfonts (Cabin, Epilogue) pas na de eerste paint toevoegen via de
// FontFace-API, zodat ze niet concurreren met de bestanden voor de eerste
// weergave. Tot ze binnen zijn tonen we de metriek-gelijke fallback uit
// styles.css. Unicode-ranges zijn die van Google Fonts (latin, latin-ext).
const FONTS: [string, string, string][] = [
  ["Cabin", cabinLatin, "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"],
  ["Cabin", cabinLatinExt, "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF"],
  ["Epilogue", epilogueLatin, "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"],
  ["Epilogue", epilogueLatinExt, "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF"],
];
const FONT_SCRIPT = `
(function () {
  if (!("fonts" in document) || typeof FontFace === "undefined") return;
  var fonts = ${JSON.stringify(FONTS)};
  var laad = function () {
    fonts.forEach(function (f) {
      var face = new FontFace(f[0], "url(" + f[1] + ") format('woff2')", { weight: "400 700", style: "normal", display: "swap", unicodeRange: f[2] });
      document.fonts.add(face);
    });
  };
  // Na het load-event, dus ruim na de eerste paint.
  if (document.readyState === "complete") laad();
  else window.addEventListener("load", laad, { once: true });
})();
`;

// Google Analytics, uitgesteld tot de browser niets te doen heeft — verbatim
// overgenomen uit de oude index.html zodat metingen identiek blijven.
const GA_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
function loadGA() {
  if (window.gaLoaded) return;
  window.gaLoaded = true;
  gtag('js', new Date());
  gtag('config', 'G-8DLGZ42KPP', { send_page_view: true });
  var script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-8DLGZ42KPP';
  script.async = true;
  document.head.appendChild(script);
}
function whenIdle() {
  if ('requestIdleCallback' in window) requestIdleCallback(loadGA, { timeout: 5000 });
  else setTimeout(loadGA, 2000);
}
if (document.readyState === 'complete') whenIdle();
else window.addEventListener('load', whenIdle, { once: true });
`;



export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, minimum-scale=1.0" },
      { name: "theme-color", content: "#0f4c3a" },
      { title: "Webdesign Bureau Enkhuizen | Websites & Webshops - Nieuwblik" },
      {
        name: "description",
        content:
          `Webdesign bureau in Enkhuizen, West-Friesland. Snelle websites en webshops op maat met SEO. Verbeter je online zichtbaarheid. Live in ${LEVERTIJD.standaard}!`,
      },
      { name: "author", content: "Nieuwblik" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "googlebot", content: "index, follow" },
      { name: "google-site-verification", content: "rEXgT_nkNkrPYHa_iXNnG8zHse4wBfAq2BgJJ81JKMM" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Nieuwblik" },
      { property: "og:locale", content: "nl_NL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@justin_slok" },
      { name: "twitter:creator", content: "@justin_slok" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon.png" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://i.ytimg.com" },
    ],
    scripts: [
      { children: FONT_SCRIPT },
      { children: GA_SCRIPT },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // ported from main.tsx — web-vitals-logging alleen in development
    if (import.meta.env.DEV) {
      void import("@/utils/performanceMonitor").then((m) => m.logWebVitals());
    }
    // ported from main.tsx — eigen (hand-geschreven) service worker, alleen
    // in productie. public/sw.js is bewust ongewijzigd gelaten.
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      const register = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // no-op: SW is een extraatje; de site werkt ook zonder
        });
      };
      if (document.readyState === "complete") register();
      else window.addEventListener("load", register, { once: true });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Sonner />
      <ScrollToTop />
      <Outlet />
    </QueryClientProvider>
  );
}

function NotFoundComponent() {
  return <NotFound />;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Deze pagina kon niet laden
        </h1>
        <p className="text-muted-foreground mb-8">
          Er ging iets mis bij het laden van deze pagina. Probeer het opnieuw of
          ga terug naar de homepage.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              void router.invalidate();
              reset();
            }}
            className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Probeer opnieuw
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Naar home
          </a>
        </div>
      </div>
    </div>
  );
}
