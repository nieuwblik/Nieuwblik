import { lazy, Suspense } from "react";
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


// Eager load all public-facing pages for instant navigation (no white flash)
import Index from "./pages/Index";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Terms from "./pages/Terms";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";
import WebsiteOpMaat from "./pages/services/WebsiteOpMaat";
import Webshops from "./pages/services/Webshops";
import Ecommerce from "./pages/services/Ecommerce";
import Werkgebied from "./pages/Werkgebied";
import WerkgebiedDetail from "./pages/WerkgebiedDetail";
import LandingRouter from "./pages/LandingRouter";
import SeoEnkhuizen from "./pages/SeoEnkhuizen";
import TaxiWebsite from "./pages/TaxiWebsite";
import GratisWebsiteAnalyse from "./pages/GratisWebsiteAnalyse";


// Lazy load admin pages only (rarely used by public visitors)
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SmoothScroll />

        <CookieConsent />
        <WhatsAppButton />
        <FreeAnalysisPopup />

        <UnderlayNav links={NAV_LINKS} socials={NAV_SOCIALS} quickLinks={NAV_QUICK_LINKS}>
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

          <Route path="/:landingPath" element={<LandingRouter />} />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={null}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <Suspense fallback={null}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </UnderlayNav>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
