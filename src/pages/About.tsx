import { lazy, Suspense, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Linkedin } from "lucide-react";
import heroTeamImage from "@/assets/justin-job-compressed.webp";
import justinImage from "@/assets/justin-slok.webp";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { easings } from "@/lib/motion";
import { companyInfo } from "@/config/company";
import { cn } from "@/lib/utils";

const TestimonialsCarousel = lazy(() => import("@/components/TestimonialsCarousel"));

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedText = ({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "span";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[Component];
  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0 : delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionComponent>
  );
};

const stats = [
  { value: "30+", label: "Projecten opgeleverd" },
  { value: "4.9", label: "Gemiddelde beoordeling" },
  { value: "2023", label: "Opgericht" },
  { value: "100%", label: "Maatwerk" },
];

const steps = [
  {
    number: "01",
    title: "Kennismaken",
    description: "We starten met een vrijblijvend gesprek. We leren jouw bedrijf, doelen en publiek kennen. Geen standaard formuliertje — gewoon een echt gesprek.",
  },
  {
    number: "02",
    title: "Strategie & concept",
    description: "Op basis van jouw verhaal werken we een strategie en visueel concept uit. Design dat niet alleen mooi is, maar ook een doel dient.",
  },
  {
    number: "03",
    title: "Design & development",
    description: "Jouw website wordt pixel-perfect gebouwd. Snel, toegankelijk en geoptimaliseerd voor zoekmachines. Jij houdt controle via regelmatige updates.",
  },
  {
    number: "04",
    title: "Lanceren & doorgroeien",
    description: "Na de lancering staan we achter je. We monitoren, optimaliseren en helpen je verder groeien. Het werk stopt niet bij oplevering.",
  },
];

const values = [
  {
    title: "Eerlijk & transparant",
    description: "Geen verrassingen op de rekening, geen vage beloftes. Je weet altijd waar je aan toe bent — van offerte tot oplevering.",
  },
  {
    title: "Resultaatgericht",
    description: "Mooi design is een middel, niet het doel. Elk keuze die we maken is gericht op meer bezoekers, meer leads en meer omzet voor jou.",
  },
  {
    title: "Lokaal & persoonlijk",
    description: "We zijn een klein bureau uit Enkhuizen. Geen accountmanager die je doorverbindt — je praat altijd direct met de mensen die je website bouwen.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Over Ons - Nieuwblik",
  description: "Leer meer over Nieuwblik, jouw webdesign bureau in Enkhuizen. Ontmoet Justin en Job, het duo achter de websites die opvallen én converteren.",
  url: "https://www.nieuwblik.com/over-ons",
  mainEntity: {
    "@type": "Organization",
    name: "Nieuwblik",
    founder: { "@type": "Person", name: "Justin Slok" },
  },
};

const About = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Over Ons | Webdesign Bureau Enkhuizen - Nieuwblik"
        description="Maak kennis met Nieuwblik, jouw webdesign bureau uit Enkhuizen. Passie voor websites, webshops en SEO in West-Friesland. Persoonlijke aanpak, meetbaar resultaat."
        keywords="over ons, webdesign bureau Enkhuizen, digitale agency West-Friesland, nieuwblik team, website laten maken Enkhuizen"
        canonicalUrl="https://nieuwblik.com/over-ons"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Over ons", url: "https://nieuwblik.com/over-ons" },
        ]}
      />
      <Navigation />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-header overflow-hidden bg-background">
        {/* Vertical lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.4]">
          <div className="container mx-auto h-full flex justify-between px-4 sm:px-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-border" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 min-h-[85vh] items-center">

            {/* Left: text */}
            <div className="lg:col-span-6 flex flex-col justify-center py-16 lg:py-24 text-center lg:text-left">
              <motion.div
                className="flex items-center gap-2 mb-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-medium tracking-tight text-muted-foreground">
                  Enkhuizen, Noord-Holland
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easings.easeOutExpo }}
              >
                Het bureau<br />
                <span className="text-accent">achter jouw</span><br />
                digitale groei.
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-md mb-8 mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: easings.easeOutExpo }}
              >
                Wij zijn Justin en Job — twee gedreven ontwerpers en developers uit Enkhuizen die geloven dat een goede website het verschil maakt tussen opgemerkt worden of onzichtbaar blijven.
              </motion.p>

              <motion.div
                className="flex flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: easings.easeOutExpo }}
              >
                <AnimatedButton to="/start-je-project" size="lg">
                  Samenwerken
                </AnimatedButton>
                <Button asChild size="lg" variant="ghost" className="hover:bg-transparent hover:text-accent p-0 font-semibold group flex items-center gap-2">
                  <Link to="/portfolio">
                    Ons werk
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right: team photo */}
            <div className="lg:col-span-6 flex items-end justify-center lg:justify-end">
              <motion.div
                className="relative w-full max-w-[480px] lg:max-w-none lg:w-[110%] lg:-mr-[10%]"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <img
                  src={heroTeamImage}
                  alt="Justin & Job — Nieuwblik team"
                  className="w-full h-auto object-contain"
                  style={{ filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.08))" }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="bg-secondary border-y border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.08} className="py-10 px-6 text-center">
                <div className="text-3xl sm:text-4xl font-black text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-light">{stat.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Justin photo */}
            <AnimatedSection className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden bg-secondary aspect-[4/5] max-w-sm mx-auto lg:mx-0">
                <img
                  src={justinImage}
                  alt="Justin Slok — oprichter Nieuwblik"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                  <a
                    href={companyInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white text-sm font-medium hover:text-accent transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </AnimatedSection>

            {/* Text */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <AnimatedText as="p" className="text-accent text-xs font-semibold tracking-widest uppercase mb-4">
                Het team
              </AnimatedText>
              <AnimatedText as="h2" className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6" delay={0.05}>
                Justin & Job
              </AnimatedText>
              <AnimatedText as="p" className="text-lg text-muted-foreground font-light leading-relaxed mb-5" delay={0.1}>
                Nieuwblik is geboren uit een simpele maar krachtige overtuiging: elk bedrijf verdient een digitale aanwezigheid die hun unieke verhaal vertelt en klanten inspireert tot actie.
              </AnimatedText>
              <AnimatedText as="p" className="text-base text-muted-foreground font-light leading-relaxed mb-5" delay={0.15}>
                Wat begon als een passie voor design, groeide uit tot een missie om bedrijven te helpen succesvol te zijn online. We zagen te vaak dat mooie websites en sterke merken het verschil maken tussen groeien en stilstaan.
              </AnimatedText>
              <AnimatedText as="p" className="text-base text-muted-foreground font-light leading-relaxed mb-8" delay={0.2}>
                Vandaag de dag zijn we trots op de relaties die we hebben opgebouwd en de successen die we hebben gerealiseerd. Elke tevreden klant, elk goed lopend project — dat is waar we het voor doen.
              </AnimatedText>
              <AnimatedSection delay={0.25}>
                <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                  <AnimatedButton to="/start-je-project" size="lg">
                    Kennismaken
                  </AnimatedButton>
                  <Button asChild size="lg" variant="ghost" className="hover:bg-transparent hover:text-accent p-0 font-semibold group flex items-center gap-2">
                    <Link to="/contact">
                      Contact
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── WERKWIJZE ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <AnimatedText as="p" className="text-accent text-xs font-semibold tracking-widest uppercase mb-4">
              Hoe we werken
            </AnimatedText>
            <AnimatedText as="h2" className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4" delay={0.05}>
              Van eerste gesprek<br />tot live website
            </AnimatedText>
            <AnimatedText as="p" className="text-base sm:text-lg text-muted-foreground font-light max-w-xl mx-auto" delay={0.1}>
              Een duidelijk proces zonder verrassingen. Jij weet altijd wat er wanneer gebeurt.
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border rounded-2xl overflow-hidden">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.1}>
                <div className={cn(
                  "p-8 h-full border-border",
                  i < steps.length - 1 && "border-b sm:border-b-0 sm:border-r lg:border-r",
                  i === 1 && "sm:border-b lg:border-b-0",
                  i === 2 && "sm:border-b-0 sm:border-r-0 lg:border-r",
                )}>
                  <div className="text-4xl font-black text-accent/20 mb-4">{step.number}</div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAARDEN ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* Sticky header left */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <AnimatedText as="p" className="text-accent text-xs font-semibold tracking-widest uppercase mb-4">
                Onze kernwaarden
              </AnimatedText>
              <AnimatedText as="h2" className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight" delay={0.05}>
                Waar we<br />voor staan.
              </AnimatedText>
            </div>

            {/* Values list right */}
            <div className="lg:col-span-8 flex flex-col divide-y divide-border">
              {values.map((value, i) => (
                <AnimatedSection key={value.title} delay={i * 0.1} className="py-8 first:pt-0 last:pb-0">
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-base text-muted-foreground font-light leading-relaxed">{value.description}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: "hsl(160 84% 12%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30 blur-[120px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(160 84% 45%) 0%, transparent 70%)" }} />

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <AnimatedText as="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white" delay={0.1}>
              Wat klanten zeggen
            </AnimatedText>
            <AnimatedText as="p" className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed" delay={0.2}>
              Niet wij, maar onze klanten vertellen het beste wie we zijn.
            </AnimatedText>
          </div>

          <AnimatedSection delay={0.2}>
            <Suspense fallback={null}>
              <TestimonialsCarousel />
            </Suspense>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent bg-[length:200%_200%] animate-gradient-shift">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedText as="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary-foreground">
            Klaar om samen iets<br />moois te bouwen?
          </AnimatedText>
          <AnimatedText as="p" className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto font-light" delay={0.1}>
            We horen graag jouw verhaal. Een eerste gesprek is altijd gratis en vrijblijvend.
          </AnimatedText>
          <AnimatedSection delay={0.2}>
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" variant="secondary">
                <Link to="/start-je-project">
                  Start je project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
