import { lazy, Suspense } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);
import Navigation from "@/components/Navigation";
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
import heroTeamImage from "@/assets/justin-job-compressed.webp";
import heroBg from "@/assets/nieuwblik hero achtergrond 1.webp";
const TestimonialsCarousel = lazy(() => import("@/components/TestimonialsCarousel"));

import { gpuAcceleration } from "@/lib/optimized-motion";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";

import SEOHead from "@/components/SEOHead";
import { companyInfo } from "@/config/company";
import { useReveal } from "@/lib/reveal";

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

  // Hero entrance — background settles, headline masks up, the people photo
  // rises in, then the bottom-bar copy fades up. Skipped for reduced motion.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(".sw-hero-bg", { scale: 1.06, duration: 1.6, ease: "power3.out" }, 0)
        .from(".sw-line-inner", { yPercent: 118, duration: 0.95, stagger: 0.1, ease: "power4.out" }, 0.2)
        .from(".sw-hero-photo", { y: 48, opacity: 0, duration: 1.0, ease: "power3.out" }, 0.35)
        .from(".sw-lead", { y: 18, opacity: 0, duration: 0.6, ease: "power3.out" }, 0.55)
        .from(".sw-cta", { y: 18, opacity: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }, 0.65);
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
      title="Nieuwblik | Webdesign Bureau Enkhuizen - Websites & Webshops"
      description={companyInfo.description}
      keywords="webdesign, website laten maken, webshop, enkhuizen, noord-holland, webdevelopment, e-commerce, online marketing"
      canonicalUrl={companyInfo.url}
      includeOrganizationSchema={true}
      includeLocalBusinessSchema={true}
      structuredData={faqJsonLd} />

    <Navigation />

    {/* Hero Section — cream wireframe background; headline sits left, the people
        photo sits right (own grid column, so they can never overlap); a
        contained bottom bar with copy + CTAs closes the section. */}
    <section ref={heroRef} className="sw-ink relative lg:min-h-screen pt-header overflow-hidden flex flex-col">
      {/* Layer 1 — cream background with subtle wireframe pattern (unchanged) */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="sw-hero-bg absolute inset-0 w-full h-full object-cover z-0 will-change-transform"
      />

      {/* This outer wrapper stays full-width (flex layout only, no max-width) so
          the bottom bar's background can span edge-to-edge below. Only the
          headline+photo row and the mobile photo get their own `container
          mx-auto px-4 sm:px-6` — that's what matches their content width to
          the rest of the site, without also capping the bar. */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Headline + photo row — grows to fill the space above the bar, so the
            headline can be vertically centred within it (balanced top/bottom). */}
        <div className="grid grid-cols-1 lg:flex-1 lg:grid-cols-[3fr_2fr] container mx-auto px-4 sm:px-6">
          {/* Left — headline: left-aligned, vertically centred, generous whitespace.
              sw-hero-textcol makes this the query container the h1's cqw-based
              font-size measures against (see .sw-display in index.css). */}
          <div className="sw-hero-textcol flex flex-col items-start justify-center lg:pr-4 xl:pr-6 py-10 lg:py-0 lg:-translate-y-10">
            <h1 className="sw-display m-0 text-left w-full" style={{ color: "#000" }}>
              <span className="sw-mask"><span className="sw-line-inner">Webdesign bureau</span></span>
              <span className="sw-mask"><span className="sw-line-inner">in <span style={{ color: "hsl(var(--sw-green))" }}>Enkhuizen.</span></span></span>
            </h1>
            <div className="sw-cta mt-8 md:mt-10 flex flex-wrap items-center gap-6">
              <AnimatedButton to="/start-je-project" size="lg">
                Start je project
              </AnimatedButton>
              <Link to="/portfolio" className="sw-mono group inline-flex items-center gap-2 transition-colors" style={{ color: "hsl(var(--sw-ink))" }}>
                Onze portfolio
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right — people photo, anchored to the bottom of the row (desktop
              only). Sized as a percentage >100% of its own (now narrower,
              40%-share) column — nothing clips it since only the hero
              <section> itself has overflow-hidden, not this column, so
              it's safe for the centred photo to bleed symmetrically past its
              column's edges into the unused gap either side. Two size tiers:
              a smaller one covers every common MacBook logical resolution
              (1280–1728px all fall under lg/xl, and even the 16" MBP's 1728
              is still below 1800px), the larger one only kicks in past that
              — genuinely spacious/external displays — where it's capped so
              it never outgrows the source image's native resolution
              (1000x882) and starts looking soft. */}
          <div className="relative hidden lg:block">
            <img
              src={heroTeamImage}
              alt="Justin &amp; Job, oprichters van Nieuwblik"
              className="sw-hero-photo absolute bottom-0 left-1/2 -translate-x-1/2 w-[125%] max-w-[760px] min-[1800px]:w-[155%] min-[1800px]:max-w-[1000px] h-auto select-none pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Mobile — photo stacks below the headline, resting just above the bar */}
        <div className="lg:hidden flex justify-center container mx-auto px-4 sm:px-6 pb-6">
          <img
            src={heroTeamImage}
            alt="Justin &amp; Job, oprichters van Nieuwblik"
            className="sw-hero-photo w-[340px] sm:w-[420px] h-auto select-none"
            draggable={false}
          />
        </div>

        {/* Bottom bar — one contained element: thin top border + a slightly
            different tint than the hero background, instead of floating pieces. */}
        <div
          className="sw-bar relative z-20 border-t"
          style={{ background: "hsl(150 14% 95%)", borderColor: "hsl(var(--sw-rule) / 0.15)" }}
        >
          <div className="container mx-auto px-4 sm:px-6 py-5 md:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Social proof — same content/iconography as <TrustBar>, laid out
                  horizontally and vertically centred with the buttons. */}
              <div className="sw-lead flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5" style={{ fill: "hsl(var(--sw-green))", color: "hsl(var(--sw-green))" }} />
                    ))}
                  </div>
                  <p className="text-sm md:text-base font-medium" style={{ color: "#000" }}>
                    5,0 op Google,{" "}
                    <span className="font-normal" style={{ color: "hsl(var(--sw-ink) / 0.55)" }}>
                      op basis van 15+ reviews
                    </span>
                  </p>
                </div>

                <div className="hidden sm:block h-5 w-px" style={{ background: "hsl(var(--sw-rule) / 0.25)" }} />

                <p className="text-sm" style={{ color: "hsl(var(--sw-ink) / 0.55)" }}>
                  Vertrouwd door MKB ondernemers door heel Nederland
                </p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:items-center lg:justify-end">
                <Link to="/portfolio" className="sw-cta sw-mono group inline-flex items-center gap-2 transition-colors" style={{ color: "hsl(var(--sw-ink))" }}>
                  Ontdek portfolio
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* SEO / AI search-engine visibility — instrument-panel redesign */}
    <Suspense fallback={<div className="min-h-[600px]" />}>
      <SearchVisibility />
    </Suspense>
    <Suspense fallback={<div className="min-h-[480px]" />}>
      <PricingPackages />
    </Suspense>

    {/* Featured Projects — scroll-driven portfolio */}
    <Suspense fallback={<div className="min-h-[600px]" />}>
      <ScrollPortfolio />
    </Suspense>

    {/* Testimonials Section - Brand Green Aesthetic */}
    <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'hsl(160 84% 12%)' }}>
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