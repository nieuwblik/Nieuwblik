import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import appCss from "../styles.css?url";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&family=Epilogue:wght@400;700&display=swap";

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

// Lettertypen niet-blokkerend laden: stylesheet komt binnen als media=print
// en schakelt na laden om (zelfde truc als de oude index.html).
const FONT_SWAP_SCRIPT = `
(function () {
  var l = document.getElementById('nb-fonts');
  if (!l) return;
  var activate = function () { l.media = 'all'; };
  if (l.sheet) activate();
  else l.addEventListener('load', activate, { once: true });
})();
`;

const ORGANIZATION_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nieuwblik",
  url: "https://www.nieuwblik.com",
  logo: "https://www.nieuwblik.com/logo.png",
  description:
    "Professioneel webdesign bureau in Enkhuizen. Wij bouwen snelle, SEO-geoptimaliseerde websites die converteren.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "De Trompet 18H",
    addressLocality: "Enkhuizen",
    postalCode: "1601 MK",
    addressCountry: "NL",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+31646253607",
    contactType: "customer service",
    availableLanguage: ["Dutch", "English"],
  },
  sameAs: [
    "https://www.linkedin.com/in/justin-slok-b8a3011b2/",
    "https://x.com/justin_slok",
  ],
});

const WEBSITE_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nieuwblik",
  url: "https://www.nieuwblik.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.nieuwblik.com/blog?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
});

const PROFESSIONAL_SERVICE_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nieuwblik",
  image: "https://www.nieuwblik.com/logo.png",
  url: "https://www.nieuwblik.com",
  telephone: "+31646253607",
  email: "justin@nieuwblik.com",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "De Trompet 18H",
    addressLocality: "Enkhuizen",
    postalCode: "1601 MK",
    addressCountry: "NL",
  },
  geo: { "@type": "GeoCoordinates", latitude: 52.7034, longitude: 5.2839 },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  areaServed: { "@type": "Country", name: "Netherlands" },
  serviceType: ["Webdesign", "SEO", "E-commerce", "Digitale Marketing"],
});

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
          "Webdesign bureau in Enkhuizen, West-Friesland. Snelle websites en webshops op maat met SEO. Verbeter je online zichtbaarheid. Binnen 1 week live!",
      },
      { name: "author", content: "Nieuwblik" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "googlebot", content: "index, follow" },
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://i.ytimg.com" },
      { rel: "preload", as: "style", href: FONT_HREF },
      { rel: "stylesheet", href: FONT_HREF, media: "print", id: "nb-fonts" },
    ],
    scripts: [
      { children: GA_SCRIPT },
      { children: FONT_SWAP_SCRIPT },
      { type: "application/ld+json", children: ORGANIZATION_JSONLD },
      { type: "application/ld+json", children: WEBSITE_JSONLD },
      { type: "application/ld+json", children: PROFESSIONAL_SERVICE_JSONLD },
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function NotFoundComponent() {
  return <NotFound />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
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
