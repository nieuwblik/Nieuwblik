import { faqPage } from "@/lib/structured-data";
import { algemeneFaqParen } from "@/data/algemeneFaq";
import { lazy, Suspense } from "react";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import GolfHero from "@/components/GolfHero";

// Below-the-fold sections - lazy loaded for faster initial paint
const FeaturedBlogPosts = lazy(() => import("@/components/FeaturedBlogPosts"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const AppjeSectie = lazy(() => import("@/components/AppjeSectie"));
const VoorNaSectie = lazy(() => import("@/components/VoorNaSectie"));
const ScrollPortfolio = lazy(() => import("@/components/ScrollPortfolio"));
const VindbaarSectie = lazy(() => import("@/components/VindbaarSectie"));

import { useRef } from "react";
const TestimonialsCarousel = lazy(() => import("@/components/TestimonialsCarousel"));

import { gpuAcceleration } from "@/lib/optimized-motion";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";

import SEOHead from "@/components/SEOHead";
import { companyInfo } from "@/config/company";
import { useReveal } from "@/lib/reveal";
import { useDarkNavSection } from "@/components/TabNav";

// Scroll-reveal voor secties. Zelfde beweging als eerst, nu met CSS in plaats
// van framer-motion; die stond hiervoor alleen hierom in de hoofdbundel.
const AnimatedSection = ({
  children,
  className = "",
  delay = 0
}: { children: React.ReactNode; className?: string; delay?: number; }) => (
  <Reveal className={className} delay={delay} afstand={30} style={gpuAcceleration}>
    {children}
  </Reveal>
);

// Swiss section header: hairline rule + mono spec label + oversized heading.
// Used to thread the grid language through the page's sections.
const SwissHead = ({
  label,
  title,
  intro,
  dark = false,
  centered = false,
}: { label: string; title: string; intro?: string; dark?: boolean; centered?: boolean; }) => {
  const ink   = dark ? "rgba(255,255,255,1)" : "hsl(var(--sw-ink))";
  const accentC = dark ? "hsl(160, 70%, 58%)" : "hsl(var(--sw-green))";
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref} className={`mb-12 md:mb-16${centered ? " text-center" : ""}`}>
      <div className="mb-6">
        <span className="sw-reveal sw-mono inline-block" style={{ color: accentC }}>{label}</span>
      </div>
      <h2 className={`sw-reveal text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl${centered ? " mx-auto" : ""}`} style={{ color: ink, lineHeight: 1.02 }}>
        {title}
      </h2>
      {intro && (
        <p className={`sw-reveal mt-6 text-lg md:text-xl font-light leading-relaxed max-w-2xl${centered ? " mx-auto" : ""}`} style={{ color: dark ? "rgba(255,255,255,0.7)" : "hsl(var(--sw-ink) / 0.65)" }}>
          {intro}
        </p>
      )}
    </div>
  );
};

const Index = () => {
  // Dark testimonials band: invert the fixed header while it's under it.
  const darkNavRef = useDarkNavSection<HTMLElement>();

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

    {/* Testimonials Section - Brand Green Aesthetic */}
    <section ref={darkNavRef} className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'hsl(160 84% 12%)' }}>
      {/* Subtle dot texture — inline so no external CDN dependency */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(160 84% 60%) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30 blur-[120px] rounded-full"
        style={{ background: 'radial-gradient(circle, hsl(160 84% 45%) 0%, transparent 70%)' }} />

      <div className="container relative z-10 mx-auto px-6">
        <SwissHead
          dark
          label="Referenties"
          title="Wat onze klanten zeggen"
          intro="Ontdek wat onze tevreden klanten te vertellen hebben over hun ervaring met Nieuwblik."
          centered
        />

        <AnimatedSection delay={0.2}>
          <Suspense fallback={<div className="min-h-[280px]" />}>
            <TestimonialsCarousel />
          </Suspense>
        </AnimatedSection>
      </div>
    </section>

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