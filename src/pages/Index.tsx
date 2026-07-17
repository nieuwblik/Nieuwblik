import { lazy, Suspense } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);
import Footer from "@/components/Footer";

// Below-the-fold sections - lazy loaded for faster initial paint
const FeaturedBlogPosts = lazy(() => import("@/components/FeaturedBlogPosts"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const PricingPackages = lazy(() => import("@/components/PricingPackages"));
const ScrollPortfolio = lazy(() => import("@/components/ScrollPortfolio"));
const SearchVisibility = lazy(() => import("@/components/SearchVisibility"));

import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
const TestimonialsCarousel = lazy(() => import("@/components/TestimonialsCarousel"));

import { gpuAcceleration } from "@/lib/optimized-motion";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";

import SEOHead from "@/components/SEOHead";
import { companyInfo } from "@/config/company";
import { useReveal } from "@/lib/reveal";
import { useDarkNavSection } from "@/components/UnderlayNav";

// Optimized animation component for scroll-triggered reveals
const AnimatedSection = ({
  children,
  className = "",
  delay = 0
}: { children: React.ReactNode; className?: string; delay?: number; }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-20px"
  });
  const shouldReduceMotion = useReducedMotion();
  return <motion.div
    ref={ref}
    layout="position"
    className={className}
    style={gpuAcceleration}
    initial={{
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30
    }}
    animate={isInView ? {
      opacity: 1,
      y: 0
    } : {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30
    }}
    transition={{
      duration: shouldReduceMotion ? 0.2 : 0.6,
      delay: shouldReduceMotion ? 0 : delay,
      ease: [0.25, 0.1, 0.25, 1]  // Smooth cubic bezier
    }}>
    {children}
  </motion.div>;
};

// Swiss section header: hairline rule + mono spec label + oversized heading.
// Used to thread the grid language through the page's sections.
const SwissHead = ({
  label,
  title,
  intro,
  dark = false,
}: { label: string; title: string; intro?: string; dark?: boolean; }) => {
  const ink   = dark ? "rgba(255,255,255,0.96)" : "hsl(var(--sw-ink))";
  const ruleC = dark ? "rgba(255,255,255,0.20)" : "hsl(var(--sw-rule) / 0.16)";
  const accentC = dark ? "rgba(255,255,255,0.9)" : "hsl(var(--sw-green))";
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref} className="mb-12 md:mb-16">
      <div className="h-px w-full mb-5" style={{ background: ruleC }} />
      <div className="mb-6">
        <span className="sw-reveal sw-mono inline-block" style={{ color: accentC }}>{label}</span>
      </div>
      <h2 className="sw-reveal text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl" style={{ color: ink, lineHeight: 1.02 }}>
        {title}
      </h2>
      {intro && (
        <p className="sw-reveal mt-6 text-lg md:text-xl font-light leading-relaxed max-w-2xl" style={{ color: dark ? "rgba(255,255,255,0.7)" : "hsl(var(--sw-ink) / 0.65)" }}>
          {intro}
        </p>
      )}
    </div>
  );
};

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  // Dark testimonials band: invert the fixed header while it's under it.
  const darkNavRef = useDarkNavSection<HTMLElement>();

  // Hero entrance — headline masks up, then the eyebrow/subtext/slider fade up
  // and the CTAs settle in. Skipped for reduced motion.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(".sw-line-inner", { yPercent: 118, duration: 0.95, stagger: 0.1, ease: "power4.out" }, 0.15)
        .from(".sw-lead", { y: 20, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }, 0.2)
        .from(".sw-cta", { y: 16, opacity: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }, 0.5);
    });
  }, { scope: heroRef });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { q: "Wat kost het om een website te laten maken?", a: "Onze pakketten starten vanaf 990 euro voor een complete starterswebsite. Het Professional pakket start vanaf 1990 euro, met meer pagina's, CMS en SEO basis. Voor maatwerk of webshops maken we een offerte op basis van jouw wensen. Tijdens een vrijblijvend gesprek bespreken we wat het beste past." },
      { q: "Hoe lang duurt het voordat mijn website live staat?", a: "Voor de meeste projecten geldt een doorlooptijd van 2-6 weken, afhankelijk van de omvang en complexiteit. Eenvoudige websites kunnen binnen 1-2 weken gerealiseerd worden. We werken graag met vaste deadlines en houden je tijdens het proces op de hoogte van de voortgang." },
      { q: "Kan ik zelf aanpassingen doen aan mijn website?", a: "Ja! We bouwen websites met gebruiksvriendelijke content management systemen (CMS) waarmee je eenvoudig zelf teksten, afbeeldingen en andere content kunt aanpassen. We geven uitleg en instructies hoe je dit doet. Voor complexere wijzigingen staan we natuurlijk altijd klaar om te helpen." },
      { q: "Bieden jullie ook onderhoud en support na oplevering?", a: "Absoluut! We bieden verschillende onderhoudspakketten aan, van basis support tot volledig beheer inclusief updates, backups en security monitoring. Ook kun je altijd bij ons terecht voor eenmalige aanpassingen of uitbreidingen van je website." },
      { q: "Wordt mijn website ook goed gevonden in Google?", a: "Ja, alle websites die wij bouwen zijn standaard SEO-geoptimaliseerd. Dit betekent snelle laadtijden, mobiel responsive design, schone code en juiste meta tags. Voor bedrijven die hoog willen scoren in Google bieden we ook uitgebreide SEO diensten aan zoals keyword research, content optimalisatie en linkbuilding." },
      { q: "Wat is er nodig om te starten met mijn project?", a: "Om te starten hebben we allereerst een goed gesprek nodig om jouw wensen en doelen te begrijpen. Daarna maken we een offerte en projectplan. Bij akkoord vragen we om content (teksten, afbeeldingen, logo's) en eventueel een aanbetaling. Vervolgens kunnen we direct aan de slag!" },
      { q: "Leveren jullie ook logo's en huisstijl?", a: "Ja, we bieden complete branding diensten aan. Van logo ontwerp tot complete merkidentiteit inclusief kleurenpalet, typografie, visitekaartjes en andere marketing materialen. Een sterke visuele identiteit is de basis voor online en offline succes." },
      { q: "Zijn de websites ook geschikt voor mobiele telefoons?", a: "Absoluut! Alle websites die wij maken zijn volledig responsive. Dit betekent dat ze perfect werken en er prachtig uitzien op alle apparaten: desktop, tablet én smartphone. Meer dan 60% van het internetverkeer komt tegenwoordig van mobiele apparaten, dus dit is essentieel." },
    ].map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return <div className="min-h-screen bg-background">
    <SEOHead
      title="Webdesign Bureau Enkhuizen | Websites & Webshops - Nieuwblik"
      description={companyInfo.description}
      canonicalUrl={companyInfo.url}
      includeOrganizationSchema={true}
      includeLocalBusinessSchema={true}
      structuredData={faqJsonLd} />


    {/* Hero Section — plain white; centred intro (eyebrow, headline, subtext,
        CTAs, star rating).
        Top padding clears the fixed header and nothing more. It deliberately
        does NOT use .pt-header: that adds up to 6rem on top of the header
        height for regular pages, which here stacked into ~280px of dead space
        and pushed the overlapping Projects cards below the fold on a laptop.
        The bottom padding must clear the Projects section, which is pulled up
        over this one. In the 1-col range that overlap grows with the viewport
        (25vw + 30px), so a fixed padding gets swallowed and the cards collide
        with the star row — hence the matching calc, which holds a constant
        ~56px gap. From md up the grid is 2-col and the overlap grows far more
        slowly, so a flat value clears it. */}
    <section
      ref={heroRef}
      className="sw-ink sw-hero-fill relative flex flex-col justify-center pt-[calc(var(--header-height)_+_2.5rem)] sm:pt-[calc(var(--header-height)_+_3rem)] pb-[calc(25vw_+_86px)] md:pb-[16.1rem] lg:pb-[min(calc(27vw_-_9.3rem),14.5rem)]"
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Centred intro */}
        {/* No extra top padding here — the section's pt already clears the
            header; stacking a second one is what buried the Projects cards. */}
        {/* lg+: matches the cards container's width (same `container` class,
            no extra cap) instead of stopping at max-w-4xl, so the two
            sections read as one grid. Unchanged below lg per spec. */}
        <div className="max-w-4xl lg:max-w-none mx-auto text-center">
          <p className="sw-lead sw-mono mb-6 text-balance" style={{ color: "hsl(var(--sw-ink) / 0.55)" }}>
            Vertrouwd door MKB ondernemers door heel Nederland
          </p>

          <h1 className="sw-hero-textcol sw-display m-0 mx-auto text-center" style={{ color: "hsl(var(--sw-ink))" }}>
            <span className="sw-mask"><span className="sw-line-inner">Webdesign bureau</span></span>
            <span className="sw-mask"><span className="sw-line-inner">in <span style={{ color: "hsl(var(--sw-green))" }}>Enkhuizen.</span></span></span>
          </h1>

          <p className="sw-lead mx-auto mt-6 max-w-xl lg:max-w-2xl text-base md:text-lg leading-relaxed" style={{ color: "hsl(var(--sw-ink) / 0.65)" }}>
            Nieuwblik ontwerpt en bouwt websites en webshops die opvallen, razendsnel laden en goed vindbaar zijn — van eerste schets tot livegang.
          </p>

          {/* Both CTAs share height/padding/gap/icon size via .sw-hero-btn
              (scoped override, see index.css — .animated-btn itself is shared
              by 6+ other pages so it can't change globally). Only fill/border
              differ, as requested. */}
          <div className="sw-cta mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <AnimatedButton to="/start-je-project" size="lg" className="sw-hero-btn h-14 px-8 w-full sm:w-auto">
              Start je project
            </AnimatedButton>
            <Link
              to="/portfolio"
              className="sw-hero-btn group inline-flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-md border px-8 text-base font-epilogue font-normal transition-colors hover:bg-black/5"
              style={{ borderColor: "hsl(var(--sw-rule) / 0.3)", color: "hsl(var(--sw-ink))", background: "#fff" }}
            >
              Ontdek portfolio
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="sw-cta mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4" style={{ fill: "hsl(var(--sw-green))", color: "hsl(var(--sw-green))" }} />
              ))}
            </div>
            <span className="text-sm" style={{ color: "hsl(var(--sw-ink) / 0.8)" }}>
              5,0 op Google,{" "}
              <span style={{ color: "hsl(var(--sw-ink) / 0.5)" }}>op basis van 15+ reviews</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Projects — second section; pulled up so the top row of cards
        overlaps the hero (see the negative margin in ScrollPortfolio). */}
    <Suspense fallback={<div className="min-h-[600px]" />}>
      <ScrollPortfolio />
    </Suspense>

    {/* SEO / AI search-engine visibility — instrument-panel redesign */}
    <Suspense fallback={<div className="min-h-[600px]" />}>
      <SearchVisibility />
    </Suspense>
    <Suspense fallback={<div className="min-h-[480px]" />}>
      <PricingPackages />
    </Suspense>

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
          title="Wat onze klanten zeggen."
          intro="Ontdek wat onze tevreden klanten te vertellen hebben over hun ervaring met Nieuwblik."
        />

        <AnimatedSection delay={0.2}>
          <Suspense fallback={<div className="min-h-[280px]" />}>
            <TestimonialsCarousel />
          </Suspense>
        </AnimatedSection>
      </div>
    </section>

    {/* Problem vs Solution Section */}
    <ProblemSolutionSection />

    {/* Featured Blog Posts */}
    <Suspense fallback={<div className="min-h-[420px]" />}>
      <FeaturedBlogPosts />
    </Suspense>

    {/* FAQ Section */}
    <Suspense fallback={<div className="min-h-[420px]" />}>
      <FAQSection />
    </Suspense>

    <Footer />
  </div>;
};
export default Index;