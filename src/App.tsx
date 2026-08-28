import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/SmoothScroll";
import UnderlayNav, { type UnderlayNavItem } from "./components/UnderlayNav";
import { companyInfo } from "./config/company";

import CookieConsent from "./components/CookieConsent";
import WhatsAppButton from "./components/WhatsAppButton";
import FreeAnalysisPopup from "./components/FreeAnalysisPopup";


// De homepage blijft in de hoofdbundel: dat is de pagina waar bezoekers
// binnenkomen, en een aparte chunk zou daar een tweede netwerkronde vóór de
// eerste tekst leggen.
import Index from "./pages/Index";

/*
 * Alle andere pagina's zijn losse chunks.
 *
 * Ze stonden hier eerst als gewone import, voor navigeren zonder witte flits.
 * Dat werkte, maar iedere eerste bezoeker downloadde daardoor drieëntwintig
 * pagina's voordat de homepage iets liet zien: 1,4 MB javascript op het
 * kritieke pad. Nu laden ze apart, en halen we ze alsnog binnen zodra de
 * pagina klaar is met laden — zie voorlaadPaginas hieronder. Daarmee blijft
 * doorklikken direct, zonder dat de eerste indruk ervoor betaalt.
 */
/**
 * Paden die we alvast kunnen ophalen zodra iemand aanstalten maakt om erheen
 * te gaan.
 */
const VOORLAAD = new Map<string, () => Promise<unknown>>();

const pagina = <T extends { default: ComponentType<never> }>(
  laad: () => Promise<T>,
  pad?: string,
) => {
  if (pad) VOORLAAD.set(pad, laad);
  return lazy(laad);
};

/**
 * Een chunk ophalen zodra de muis boven een link hangt of een vinger hem
 * raakt, niet eerder.
 *
 * Eerst haalden we ze allemaal op zodra de pagina klaar was met laden. Dat
 * kostte een seconde blokkeertijd: import() haalt een module niet alleen op,
 * hij voert hem ook uit, en zeven pagina's met hun hele afhankelijkheidsboom
 * uitvoeren legt de hoofddraad plat. Op intent wachten kost niets tot iemand
 * daadwerkelijk die kant op wil, en tussen aanwijzen en klikken zit ruim
 * genoeg tijd.
 */
function useVoorladenOpIntentie() {
  useEffect(() => {
    const gehaald = new Set<string>();

    const pak = (event: Event) => {
      const link = (event.target as Element | null)?.closest?.("a[href^='/']");
      if (!(link instanceof HTMLAnchorElement)) return;

      const pad = new URL(link.href, location.origin).pathname;
      const laad = VOORLAAD.get(pad);
      if (!laad || gehaald.has(pad)) return;

      gehaald.add(pad);
      void laad();
    };

    document.addEventListener("pointerover", pak, { passive: true });
    document.addEventListener("touchstart", pak, { passive: true });
    document.addEventListener("focusin", pak, { passive: true });

    return () => {
      document.removeEventListener("pointerover", pak);
      document.removeEventListener("touchstart", pak);
      document.removeEventListener("focusin", pak);
    };
  }, []);
}


const Services = pagina(() => import("./pages/Services"), "/diensten");
const Portfolio = pagina(() => import("./pages/Portfolio"), "/portfolio");
const PortfolioDetail = pagina(() => import("./pages/PortfolioDetail"));
const About = pagina(() => import("./pages/About"), "/over-ons");
const Blog = pagina(() => import("./pages/Blog"), "/blog");
const BlogPost = pagina(() => import("./pages/BlogPost"));
const Contact = pagina(() => import("./pages/Contact"), "/contact");
const ThankYou = pagina(() => import("./pages/ThankYou"));
const Privacy = pagina(() => import("./pages/Privacy"), "/privacy");
const Cookies = pagina(() => import("./pages/Cookies"), "/cookies");
const Terms = pagina(() => import("./pages/Terms"), "/algemene-voorwaarden");
const Reviews = pagina(() => import("./pages/Reviews"), "/reviews");
const NotFound = pagina(() => import("./pages/NotFound"));
const WebsiteOpMaat = pagina(() => import("./pages/services/WebsiteOpMaat"), "/diensten/website-op-maat");
const Webshops = pagina(() => import("./pages/services/Webshops"), "/diensten/webshops");
const Ecommerce = pagina(() => import("./pages/services/Ecommerce"), "/diensten/e-commerce");
const Werkgebied = pagina(() => import("./pages/Werkgebied"), "/werkgebied");
const WerkgebiedDetail = pagina(() => import("./pages/WerkgebiedDetail"));
const LandingRouter = pagina(() => import("./pages/LandingRouter"));
const SeoEnkhuizen = pagina(() => import("./pages/SeoEnkhuizen"));
const TaxiWebsite = pagina(() => import("./pages/TaxiWebsite"));
const GratisWebsiteAnalyse = pagina(() => import("./pages/GratisWebsiteAnalyse"), "/gratis-website-analyse");
const WebsiteLatenMaken = pagina(() => import("./pages/WebsiteLatenMaken"));
const WebdesignBureau = pagina(() => import("./pages/WebdesignBureau"));
const RegionalHub = pagina(() => import("./pages/RegionalHub"));


// Het portaal is één lazy chunk: publieke bezoekers laden er niets van.
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

const queryClient = new QueryClient();

const NAV_LINKS: UnderlayNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/diensten" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Over Ons", href: "/over-ons" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Only LinkedIn is a real Nieuwblik account (see config/company.ts) — the
// reference's Instagram/X entries would be dead links, so they're not here.
const NAV_SOCIALS: UnderlayNavItem[] = [
  { label: "LinkedIn ↗", href: companyInfo.social.linkedin },
];

const NAV_QUICK_LINKS: UnderlayNavItem[] = [
  { label: "Privacybeleid", href: "/privacy" },
  { label: "Algemene voorwaarden", href: "/algemene-voorwaarden" },
  { label: "Cookies", href: "/cookies" },
];

/**
 * De publieke site: nav, smooth scroll en de bezoekerswidgets horen hier.
 * Het portaal valt hier bewust buiten — een dashboard met tabellen wil geen
 * meebewegende marketingheader of Lenis-scroll.
 */
const PublicSite = () => {
  useVoorladenOpIntentie();

  return (
  <>
    <SmoothScroll />
    <CookieConsent />
    <WhatsAppButton />
    <FreeAnalysisPopup />

    <UnderlayNav links={NAV_LINKS} socials={NAV_SOCIALS} quickLinks={NAV_QUICK_LINKS}>
        {/* De terugval is een dekkend vlak van schermhoogte, geen null. Het
            menu ligt achter de pagina; met een lege terugval kijk je daar
            doorheen en flitst de menuachtergrond voorbij. */}
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diensten" element={<Services />} />
          <Route path="/diensten/website-op-maat" element={<WebsiteOpMaat />} />
          <Route path="/diensten/webshops" element={<Webshops />} />
          <Route path="/diensten/e-commerce" element={<Ecommerce />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="/over-ons" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/start-je-project" element={<Contact />} />
          <Route path="/gratis-website-analyse" element={<GratisWebsiteAnalyse />} />
          <Route path="/bedankt" element={<ThankYou />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/algemene-voorwaarden" element={<Terms />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/werkgebied" element={<Werkgebied />} />
          <Route path="/werkgebied/:slug" element={<WerkgebiedDetail />} />
          <Route path="/seo-enkhuizen" element={<SeoEnkhuizen />} />
          <Route path="/taxi-website-laten-maken" element={<TaxiWebsite />} />
          <Route path="/website-laten-maken" element={<WebsiteLatenMaken />} />
          <Route path="/webdesign-bureau" element={<WebdesignBureau />} />
          <Route path="/regio/:slug" element={<RegionalHub />} />

          <Route path="/:landingPath" element={<LandingRouter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
    </UnderlayNav>
  </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* startTransition laat React de huidige pagina in beeld houden terwijl
          de chunk van de volgende binnenkomt. Zonder dit valt de inhoud even
          weg naar de lege Suspense, en knippert de navigatiebalk mee omdat
          die zich richt naar de sectie eronder. */}
      <BrowserRouter future={{ v7_startTransition: true }}>
        <ScrollToTop />

        <Routes>
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={null}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={null}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="*" element={<PublicSite />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
