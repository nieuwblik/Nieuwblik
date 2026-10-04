import { SITE_URL } from "@/config/site";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Phone, MessageCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import { companyInfo } from "@/config/company";
import { useRef } from "react";
import ContactForm from "@/components/ContactForm";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { fadeUp, staggerContainer, slideInRight, easings } from "@/lib/motion";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { useDarkNavSection } from "@/components/UnderlayNav";

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

const Contact = () => {
  // Dark CTA band: invert the fixed header while it's under it.
  const darkNavRef = useDarkNavSection<HTMLElement>();
  const shouldReduceMotion = useReducedMotion();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact - Nieuwblik",
    "description": "Neem contact op met Nieuwblik voor jouw digitale project. Wij staan klaar om je te helpen!",
    "url": `${SITE_URL}/contact`
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact | Webdesign Bureau Enkhuizen - Nieuwblik"
        description="Neem contact op met Nieuwblik in Enkhuizen. Website of webshop laten maken? Bel, WhatsApp of vul het formulier in. Reactie binnen 24 uur gegarandeerd."
        keywords="contact webdesign Enkhuizen, offerte website, website laten maken West-Friesland, webdesign bureau contact"
        canonicalUrl={`${SITE_URL}/contact`}
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Contact", url: `${SITE_URL}/contact` }
        ]}
      />

      {/* Breadcrumb */}
      <section className="pt-32 pb-8 md:pb-12">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Contact", path: "/contact" }]} />
        </div>
      </section>

      {/* Hero Section */}
      <motion.section
        className="pb-20 md:pb-28"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6">
          <motion.p
            className="sw-mono mb-6"
            style={{ color: "hsl(var(--sw-green))" }}
            variants={fadeUp}
          >
            START JOUW PROJECT
          </motion.p>
          <motion.h1
            className="text-display mb-6"
            variants={fadeUp}
          >
            Laten we jouw visie werkelijkheid maken
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
            variants={fadeUp}
          >
            Vertel ons over jouw project en wat je wilt bereiken. Wij nemen binnen 24 uur contact op voor een persoonlijk gesprek.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">

            {/* Direct contact: donkergroen paneel zoals elders op de site, twee
                gelijke knoppen. */}
            <Reveal className="lg:col-span-1" from="links" afstand={24}>
              <div
                className="relative overflow-hidden rounded-2xl border p-8 text-white lg:sticky lg:top-32"
                style={{
                  borderColor: "hsl(160 70% 58% / 0.14)",
                  background: "linear-gradient(165deg, hsl(160 84% 11%) 0%, hsl(160 84% 8%) 100%)",
                  boxShadow: "0 30px 70px -30px rgba(0,0,0,0.55)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(ellipse 90% 60% at 20% 0%, hsl(160 70% 45% / 0.22) 0%, transparent 62%)" }}
                />
                <div className="relative">
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ lineHeight: 1.1 }}>
                    Liever direct contact?
                  </h2>
                  <p className="mt-4 text-base font-light leading-relaxed text-white/75">
                    Geen zin in een formulier? Bel of app ons direct voor een persoonlijk gesprek.
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    <AnimatedButton href={`tel:${companyInfo.phone.replace(/\s/g, "")}`} size="lg" variant="white" showArrow={false} className="w-full">
                      <Phone className="mr-2 inline h-5 w-5" />
                      Bel {companyInfo.phone}
                    </AnimatedButton>
                    <AnimatedButton href={companyInfo.whatsapp} size="lg" variant="outlineWhite" showArrow={false} className="w-full">
                      <MessageCircle className="mr-2 inline h-5 w-5" />
                      WhatsApp
                    </AnimatedButton>
                  </div>

                  <p className="mt-8 flex items-center gap-2.5 text-sm text-white/65">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: "hsl(160 70% 58%)" }} />
                    Beschikbaar ma-vr van 9:00 - 18:00 uur
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Project Briefing Form */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <motion.div
                className="p-8 md:p-12 rounded-2xl border"
                style={{ background: "hsl(150, 14%, 97.5%)", borderColor: "hsl(var(--sw-rule) / 0.1)" }}
                whileHover={shouldReduceMotion ? {} : {
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}
                transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              >
                <motion.h2
                  className="text-2xl font-semibold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.1, duration: 0.4, ease: easings.easeOutExpo }}
                >
                  Project briefing formulier
                </motion.h2>
                <motion.p
                  className="text-muted-foreground mb-8 font-light"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.15, duration: 0.4, ease: easings.easeOutExpo }}
                >
                  Help ons jouw project te begrijpen door de onderstaande vragen te beantwoorden.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.2, duration: 0.5, ease: easings.easeOutExpo }}
                >
                  <ContactForm />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Brand Green Aesthetic */}
      <section ref={darkNavRef} className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'hsl(160 84% 12%)' }}>
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

      <Footer />
    </div>
  );
};

export default Contact;

