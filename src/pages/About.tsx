import Navigation from "@/components/Navigation";
import { MagicCard } from "@/components/ui/magic-card";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Users, Sparkles, Rocket } from "lucide-react";
import { useRef } from "react";
import heroTeamImage from "@/assets/justin-job-compressed.webp";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { fadeUp, staggerContainer, staggerContainerSlow, staggerItem, slideInLeft, slideInRight, scaleUp, easings } from "@/lib/motion";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

// Animation component for scroll-triggered reveals
const AnimatedSection = ({
  children,
  className = "",
  delay = 0
}: { children: React.ReactNode; className?: string; delay?: number; }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px"
  });
  const shouldReduceMotion = useReducedMotion();
  return <motion.div ref={ref} className={className} initial={{
    opacity: 0,
    y: shouldReduceMotion ? 0 : 80
  }} animate={isInView ? {
    opacity: 1,
    y: 0
  } : {
    opacity: 0,
    y: shouldReduceMotion ? 0 : 80
  }} transition={{
    duration: shouldReduceMotion ? 0.2 : 0.8,
    delay: shouldReduceMotion ? 0 : delay,
    ease: easings.easeOutExpo
  }}>
    {children}
  </motion.div>;
};

// Animated text component
const AnimatedText = ({
  children,
  className = "",
  delay = 0,
  as: Component = "div"
}: { children: React.ReactNode; className?: string; delay?: number; as?: any; }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-30px"
  });
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = (motion as any)[Component];
  return <MotionComponent ref={ref} className={className} initial={{
    opacity: 0,
    y: shouldReduceMotion ? 0 : 50
  }} animate={isInView ? {
    opacity: 1,
    y: 0
  } : {
    opacity: 0,
    y: shouldReduceMotion ? 0 : 50
  }} transition={{
    duration: shouldReduceMotion ? 0.2 : 0.8,
    delay: shouldReduceMotion ? 0 : delay,
    ease: easings.easeOutExpo
  }}>
    {children}
  </MotionComponent>;
};

const About = () => {
  const shouldReduceMotion = useReducedMotion();

  const values = [
    {
      icon: Heart,
      title: "Passie voor perfectie",
      description: "Elk project krijgt onze volledige toewijding. We stoppen pas als het resultaat niet alleen goed is, maar fenomenaal."
    },
    {
      icon: Users,
      title: "Samen sterker",
      description: "Jouw succes is ons succes. We werken niet voor je, maar met je. Echte partnership levert de beste resultaten."
    },
    {
      icon: Sparkles,
      title: "Creativiteit zonder grenzen",
      description: "We durven te innoveren en denken buiten de gebaande paden. Jouw merk verdient iets unieks, iets dat écht opvalt."
    },
    {
      icon: Rocket,
      title: "Gericht op groei",
      description: "Design is mooi, maar resultaat is koning. Al onze beslissingen zijn gericht op meetbare groei voor jouw bedrijf."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Over Ons - Nieuwblik",
    "description": "Leer meer over Nieuwblik, jouw partner in digitale groei. Onze missie, waarden en passie voor het creëren van digitale oplossingen die echt impact maken.",
    "url": "https://www.nieuwblik.com/over-ons",
    "mainEntity": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "founder": {
        "@type": "Person",
        "name": "Justin Slok"
      }
    }
  };

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
          { name: "Over ons", url: "https://nieuwblik.com/over-ons" }
        ]}
      />
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Over Ons", path: "/over-ons" }]} />
        </div>
      </section>

      {/* Hero Section with Image */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.p
                className="text-accent mb-6"
                variants={fadeUp}
              >
                OVER ONS
              </motion.p>
              <motion.h1
                className="text-display mb-6"
                variants={fadeUp}
              >
                Gedreven door passie, geleid door resultaat
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground mb-6 font-light"
                variants={fadeUp}
              >
                We geloven dat design meer is dan mooi plaatjes - het is een krachtige tool die emotie wekt en actie inspireert.
              </motion.p>
              <motion.p
                className="text-lg text-muted-foreground mb-8 font-light leading-relaxed"
                variants={fadeUp}
              >
                Bij Nieuwblik combineren we creatieve visie met strategisch denken. We luisteren naar jouw verhaal, begrijpen je doelen en vertalen dat naar digitale oplossingen die niet alleen opvallen, maar ook converteren. Elk project is een nieuwe kans om iets bijzonders te creëren.
              </motion.p>
              <motion.div
                variants={fadeUp}
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.2, ease: easings.easeOutQuart }}
              >
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/start-je-project">Laten we kennismaken</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[550px] xl:max-w-[625px] mx-auto lg:mx-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: easings.easeOutExpo }}
            >
              {/* Green Gradient Card Background */}
              <div
                className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, hsl(160 84% 20%) 0%, hsl(160 84% 16%) 50%, hsl(160 70% 12%) 100%)'
                }}
              >
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />

                {/* Photo - Animates from bottom with hover effect */}
                <motion.div
                  className="relative pt-8 sm:pt-10 md:pt-12 lg:pt-16 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: easings.easeOutExpo }}
                >
                  <motion.img
                    src={heroTeamImage}
                    alt="Justin & Job - Nieuwblik Team"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto relative z-10"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    transition={{ duration: 0.5, ease: easings.easeOutExpo }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <motion.section
        className="py-20 md:py-32 bg-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={fadeUp}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-8"
              variants={fadeUp}
            >
              Ons verhaal: van droom tot werkelijkheid
            </motion.h2>
            <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
              <motion.p variants={fadeUp}>
                Nieuwblik is geboren uit een simpele maar krachtige overtuiging: elk bedrijf verdient een digitale aanwezigheid die hun unieke verhaal vertelt en klanten inspireert tot actie.
              </motion.p>
              <motion.p variants={fadeUp}>
                Wat begon als een passie voor design, groeide uit tot een missie om bedrijven te helpen succesvol te zijn online. We zagen te vaak dat mooie websites en sterke merken het verschil maken tussen groeien en stilstaan.
              </motion.p>
              <motion.p variants={fadeUp}>
                Vandaag de dag zijn we trots op de relaties die we hebben opgebouwd en de successen die we hebben gerealiseerd. Elke tevreden klant, elk goed lopend project - dat is waar we het voor doen.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className="py-20 md:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
          >
            <p className="text-accent mb-4">ONZE KERNWAARDEN</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Wat ons drijft en definieert
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Deze waarden vormen de basis van alles wat we doen, van het eerste gesprek tot de eindoplevering.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainerSlow}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="h-full"
                whileHover={shouldReduceMotion ? {} : {
                  y: -8,
                }}
                transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              >
                <MagicCard
                  className="text-center flex flex-col items-center justify-center h-full p-6 md:p-8 shadow-none hover:shadow-none"
                  maskClassName="bg-secondary"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                    >
                      <value.icon className="w-6 h-6 text-accent" />
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                    <p className="text-muted-foreground font-light">{value.description}</p>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      {/* FAQ Section - Integrated */}
      <FAQSection />

      {/* Testimonials Section - Brand Green Aesthetic */}
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'hsl(160 84% 12%)' }}>
        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

        {/* Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30 blur-[120px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(160 84% 45%) 0%, transparent 70%)' }} />

        <div className="container relative z-10 mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <AnimatedText as="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white" delay={0.1}>
              Wat mensen zeggen
            </AnimatedText>
            <AnimatedText as="p" className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed" delay={0.2}>
              Ontdek wat onze tevreden klanten te vertellen hebben over hun ervaring met Nieuwblik.
            </AnimatedText>
          </div>

          <AnimatedSection delay={0.2}>
            <TestimonialsCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent bg-[length:200%_200%] animate-gradient-shift"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground"
            variants={fadeUp}
          >
            Klaar om samen iets moois te creëren?
          </motion.h2>
          <motion.p
            className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light"
            variants={fadeUp}
          >
            We horen graag jouw verhaal en helpen je graag om je digitale dromen waar te maken.
          </motion.p>
          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: easings.easeOutQuart }}
          >
            <Button asChild size="lg" variant="secondary">
              <Link to="/start-je-project">Neem contact op</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default About;
