import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import CookieConsent from "./components/CookieConsent";

// Eager load critical pages
import Index from "./pages/Index";
import Services from "./pages/Services";

// Lazy load non-critical pages
const Portfolio = lazy(() => import("./pages/Portfolio"));
const PortfolioDetail = lazy(() => import("./pages/PortfolioDetail"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Terms = lazy(() => import("./pages/Terms"));
const Reviews = lazy(() => import("./pages/Reviews"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Service pages
const WebsiteOpMaat = lazy(() => import("./pages/services/WebsiteOpMaat"));
const Webshops = lazy(() => import("./pages/services/Webshops"));
const Ecommerce = lazy(() => import("./pages/services/Ecommerce"));

// Werkgebied pages
const Werkgebied = lazy(() => import("./pages/Werkgebied"));
const WerkgebiedDetail = lazy(() => import("./pages/WerkgebiedDetail"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ScrollToTopButton />
        <CookieConsent />
        <Suspense fallback={null}>
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
            <Route path="/bedankt" element={<ThankYou />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/algemene-voorwaarden" element={<Terms />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/werkgebied" element={<Werkgebied />} />
            <Route path="/werkgebied/:slug" element={<WerkgebiedDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
