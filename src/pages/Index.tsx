import { faqPage } from "@/lib/structured-data";
import { algemeneFaqParen } from "@/data/algemeneFaq";
import { lazy, Suspense } from "react";
import Footer from "@/components/Footer";
import GolfHero from "@/components/GolfHero";

// Below-the-fold sections - lazy loaded for faster initial paint
const FeaturedBlogPosts = lazy(() => import("@/components/FeaturedBlogPosts"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const AppjeSectie = lazy(() => import("@/components/AppjeSectie"));
const VoorNaSectie = lazy(() => import("@/components/VoorNaSectie"));
const ScrollPortfolio = lazy(() => import("@/components/ScrollPortfolio"));
const VindbaarSectie = lazy(() => import("@/components/VindbaarSectie"));

const GoogleReviewMuur = lazy(() => import("@/components/GoogleReviewMuur"));

import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";

import SEOHead from "@/components/SEOHead";
import { companyInfo } from "@/config/company";

const Index = () => {

  // Hero-entree: CSS in styles.css (.sw-hero-anim). De server levert de
  // eindstaat; de animatie is alleen een korte beweging vanaf de eerste paint,
  // zodat er na het laden van JavaScript niets meer verdwijnt en opnieuw inkomt.

  // Zelfde vragen als de zichtbare FAQ (src/data/algemeneFaq.ts).
  const faqJsonLd = faqPage(algemeneFaqParen());

  return <div className="min-h-screen bg-background">
    <SEOHead
      title="Webdesign Bureau Enkhuizen | Websites & Webshops - Nieuwblik"
      description={companyInfo.description}
      canonicalUrl={`${companyInfo.url}/`}
      includeOrganizationSchema={true}
      includeLocalBusinessSchema={true}
      structuredData={faqJsonLd} />


    {/* Hero met de zijden golf: tekst rechts, golf links (src/components/GolfHero.tsx). */}
    <GolfHero />

    {/* Featured Projects — tweede sectie, onder de hero. */}
    <Suspense fallback={<div className="min-h-[600px]" />}>
      <ScrollPortfolio />
    </Suspense>

    {/* Vindbaarheid: sticky kop met zwevende beelden (src/components/VindbaarSectie.tsx) */}
    <Suspense fallback={<div className="min-h-[600px]" />}>
      <VindbaarSectie />
    </Suspense>
    {/* Voor en na: oude en nieuwe website op hetzelfde beeldscherm (prijzen staan op /prijzen) */}
    <Suspense fallback={<div className="min-h-[600px]" style={{ background: "#f5f5f5" }} />}>
      <VoorNaSectie />
    </Suspense>

    {/* Problem vs Solution Section */}
    <ProblemSolutionSection />

    {/* Reviews: dezelfde lopende muur als op de analysepagina. */}
    <Suspense fallback={<div className="min-h-[100svh]" />}>
      <GoogleReviewMuur intro="Ontdek wat onze tevreden klanten te vertellen hebben over hun ervaring met Nieuwblik." />
    </Suspense>

    {/* Featured Blog Posts */}
    <Suspense fallback={<div className="min-h-[420px]" />}>
      <FeaturedBlogPosts />
    </Suspense>

    {/* FAQ Section */}
    <Suspense fallback={<div className="min-h-[420px]" />}>
      <FAQSection />
    </Suspense>

    {/* Contact via WhatsApp: schermvullend, gesprek speelt af bij het scrollen */}
    <Suspense fallback={<div className="min-h-[100svh]" style={{ background: "hsl(160 84% 12%)" }} />}>
      <AppjeSectie />
    </Suspense>

    <Footer cta={false} />
  </div>;
};
export default Index;