import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { ResponsiveShowcase } from "@/components/ResponsiveShowcase";
import SEOHead from "@/components/SEOHead";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { Link } from "react-router-dom";
import { Palette, Zap, Bot, Check, Plus, ArrowRight, MessageCircle, Star, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerContainerSlow, staggerItem, slideInLeft, slideInRight, scaleUp, easings } from "@/lib/motion";
import {
  optimizedStaggerContainer,
  optimizedStaggerItem,
  gpuAcceleration,
  optimizedViewport
} from "@/lib/optimized-motion";

// Project images for cases
import esveldImg from "@/assets/projects/esveldinstallatie.nl.png";
import feitsmaImg from "@/assets/projects/feitsmadakwerken.nl.png";

// Tool logos
import lovableLogo from "@/assets/tools/lovable-logo.png";
import figmaLogo from "@/assets/tools/figma-logo.png";
import geminiLogo from "@/assets/tools/gemini-logo.png";
import hadoseoLogo from "@/assets/tools/hadoseo-logo.png";
import wordpressLogo from "@/assets/tools/wordpress.svg";
import elementorLogo from "@/assets/tools/elementor.svg";
import woocommerceLogo from "@/assets/tools/woocommerce.svg";

const WebsiteOpMaat = () => {
  const shouldReduceMotion = useReducedMotion();

  const usps = [{
    icon: Palette,
    title: "Design excellence",
    subtitle: "Luxe en branding",
    description: "Elk ontwerp begint in Figma waar we jouw unieke merkidentiteit tot leven brengen met oog voor detail en luxe uitstraling."
  }, {
    icon: Zap,
    title: "Technische fundering",
    subtitle: "Snelheid en schone code",
    description: "Gebouwd met Lovable en moderne technologie voor bliksemsnelle laadtijden en perfecte Google scores."
  }, {
    icon: Bot,
    title: "AI & automatisering",
    subtitle: "Efficiëntie en funneling",
    description: "Slimme integraties via HadoSEO zorgen voor optimale vindbaarheid en automatische lead-generatie."
  }];

  const steps = [{
    number: "01",
    title: "Concept & strategie",
    description: "We starten met jouw project briefing om doelen, doelgroep en merkidentiteit in kaart te brengen."
  }, {
    number: "02",
    title: "Luxe design & UX",
    description: "In Figma creëren we wireframes en het visuele ontwerp dat jouw merk perfect representeert."
  }, {
    number: "03",
    title: "Technische development",
    description: "Met Lovable en Gemini AI bouwen we een ultra-snelle, SEO-geoptimaliseerde website."
  }, {
    number: "04",
    title: "Livegang & optimalisatie",
    description: "Na de lancering optimaliseren we continu voor prestaties en koppelen we Google Business voor reviews."
  }];

  const includedStandard = ["Responsive & mobile-first design", "SEO-fundament met HadoSEO koppeling", "Google Analytics 4 integratie", "Google Business koppeling voor reviews", "SSL-certificaat & beveiliging", "Laadtijd onder 2 seconden", "Contactformulieren met automatisering", "3 revisierondes inbegrepen"];
  const optionalModules = ["Custom AI chatbot integratie", "E-commerce functionaliteit", "Meertalige website opties", "Premium CMS licenties", "Geavanceerde animaties", "Lead generation funnels"];

  const cases = [{
    title: "Esveld Installatie",
    category: "Installatiebedrijf",
    description: "Professionele installatie website met projectportfolio en direct contact voor offertes. Moderne uitstraling met focus op conversie.",
    image: esveldImg,
    url: "https://esveldinstallatie.nl",
    tags: ["Web Design", "Dienstverlening", "Contact Formulieren"]
  }, {
    title: "Feitsma Dakwerken",
    category: "Dakdekkers & Aannemers",
    description: "Professioneel dakdekkersbedrijf platform met showcases van dakwerkzaamheden en aannemingsprojecten. SEO geoptimaliseerd voor lokale vindbaarheid.",
    image: feitsmaImg,
    url: "https://feitsmadakwerken.nl",
    tags: ["Web Design", "Bouw", "Dienstverlening"]
  }];

  const tools = [
    { name: "Lovable", logo: lovableLogo },
    { name: "Figma", logo: figmaLogo },
    { name: "Gemini AI", logo: geminiLogo },
    { name: "HadoSEO", logo: hadoseoLogo, link: "https://www.hadoseo.com" },
    { name: "WordPress", logo: wordpressLogo },
    { name: "Elementor Pro", logo: elementorLogo },
    { name: "WooCommerce", logo: woocommerceLogo },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Website op Maat - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://www.nieuwblik.com"
    },
    "serviceType": "Custom Website Development",
    "description": "Luxe websites en digitale architectuur op maat. Ultra-snelle, SEO-geoptimaliseerde websites met HadoSEO koppeling.",
    "areaServed": "Nederland",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Website op Maat Enkhuizen | Webdesign West-Friesland - Nieuwblik"
        description="Website laten maken in Enkhuizen? Wij bouwen snelle, SEO-geoptimaliseerde websites op maat. Webdesign bureau West-Friesland. Binnen 1 week live!"
        keywords="website op maat Enkhuizen, webdesign West-Friesland, website laten maken, SEO website, snelle website, webdesign bureau Enkhuizen"
        canonicalUrl="https://nieuwblik.com/diensten/website-op-maat"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Diensten", url: "https://nieuwblik.com/diensten" },
          { name: "Website op maat", url: "https://nieuwblik.com/diensten/website-op-maat" }
        ]}
      />
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{
            label: "Diensten",
            path: "/diensten"
          }, {
            label: "Website op Maat",
            path: "/diensten/website-op-maat"
          }]} />
        </div>
      </section>

      {/* Hero Section */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6">
          <motion.p
            className="text-accent mb-6 uppercase tracking-wide font-medium"
            variants={fadeUp}
          >
            Website op maat
          </motion.p>
          <motion.h1
            className="text-display mb-6"
            variants={fadeUp}
          >
            Luxe websites & digitale architectuur op maat
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light mb-10"
            variants={fadeUp}
          >
            Wij bouwen ultra-snelle websites met AI-automatisering en meetbare groei.
            Jouw website binnen een week live, perfect vindbaar in alle zoekmachines.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={fadeUp}
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <Link to="/contact" className="flex items-center gap-2">
                  Start je website project
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <a href="https://wa.me/31681762670" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp direct
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Responsive Showcase */}
      <ResponsiveShowcase />

      {/* Why Nieuwblik - 3 USPs */}
      <motion.section
        className="py-16 md:py-24 bg-secondary/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Waarom Nieuwblik?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Drie pilaren die jouw website onderscheiden van de rest
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
          >
            {usps.map((usp, index) => (
              <motion.div
                key={index}
                variants={optimizedStaggerItem(shouldReduceMotion)} style={gpuAcceleration}
              >
                <motion.div
                  whileHover={shouldReduceMotion ? {} : {
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                  }}
                  transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                >
                  <MagicCard
                    className="text-center flex flex-col items-center justify-center h-full p-6 md:p-8 shadow-none hover:shadow-none"
                    maskClassName="bg-card"
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                      >
                        <usp.icon className="w-8 h-8 text-accent" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">{usp.title}</h3>
                      <p className="text-accent font-medium text-sm mb-4">{usp.subtitle}</p>
                      <p className="text-muted-foreground">{usp.description}</p>
                    </div>
                  </MagicCard>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Project Steps Timeline */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Het website project stappenplan
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Transparant en efficiënt: zo bouwen wij jouw website
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={optimizedStaggerItem(shouldReduceMotion)} style={gpuAcceleration}
              >
                <motion.div
                  className="bg-card border border-border rounded-lg p-6 h-full hover:border-accent/50 transition-colors"
                  whileHover={shouldReduceMotion ? {} : {
                    y: -4,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                >
                  <span className="text-5xl font-extrabold text-accent/20 absolute top-4 right-4">
                    {step.number}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-3 pr-12">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-accent/30" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* What's Included */}
      <motion.section
        className="py-16 md:py-24 bg-secondary/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Wat is inbegrepen?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Heldere scope en verwachtingen voor jouw project
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Included */}
            <motion.div
              className="bg-card border border-border rounded-xl p-8"
              variants={slideInLeft}
              whileHover={shouldReduceMotion ? {} : {
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3, ease: easings.easeOutExpo }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold">Inbegrepen standaard</h3>
              </div>
              <ul className="space-y-4">
                {includedStandard.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : index * 0.05,
                      duration: 0.3,
                      ease: easings.easeOutExpo
                    }}
                  >
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Optional Modules */}
            <motion.div
              className="bg-card border border-border rounded-xl p-8"
              variants={slideInRight}
              whileHover={shouldReduceMotion ? {} : {
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3, ease: easings.easeOutExpo }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Optionele modules</h3>
              </div>
              <ul className="space-y-4">
                {optionalModules.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : index * 0.05,
                      duration: 0.3,
                      ease: easings.easeOutExpo
                    }}
                  >
                    <Plus className="w-5 h-5 text-accent/60 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Middle CTA - Pricing Transparency */}
      <motion.section
        className="py-16 md:py-24 bg-accent text-accent-foreground"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeUp}
          >
            Elk project is uniek
          </motion.h2>
          <motion.p
            className="text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Laten we samen de scope bepalen en een offerte op maat maken. Websites vanaf €497 - binnen een week live.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeUp}
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/contact" className="flex items-center gap-2">
                  Ontvang een offerte
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Relevant Cases - Using ProjectCard like Portfolio */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Recente website projecten
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Bekijk enkele van onze meest recente succesvolle website projecten
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto"
            variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
          >
            {cases.map((project, index) => (
              <motion.div
                key={index}
                variants={optimizedStaggerItem(shouldReduceMotion)} style={gpuAcceleration}
              >
                <ProjectCard
                  title={project.title}
                  category={project.category}
                  description={project.description}
                  image={project.image}
                  url={project.url}
                  tags={project.tags}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            variants={fadeUp}
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild variant="outline" size="lg">
                <Link to="/portfolio" className="flex items-center gap-2">
                  Bekijk alle projecten
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonial */}
      <motion.section
        className="py-16 md:py-24 bg-secondary/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={scaleUp}
          >
            <motion.div
              className="flex justify-center gap-1 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: easings.easeOutExpo }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={shouldReduceMotion ? {} : { scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : i * 0.05,
                    duration: 0.3,
                    ease: easings.softBounce
                  }}
                >
                  <Star className="w-6 h-6 fill-accent text-accent" />
                </motion.div>
              ))}
            </motion.div>
            <motion.blockquote
              className="text-xl md:text-2xl text-muted-foreground italic mb-6"
              variants={fadeUp}
            >
              "Nieuwblik heeft onze website binnen een week live gezet. De snelheid en professionaliteit zijn ongekend.
              We krijgen nu dagelijks nieuwe aanvragen via de site!"
            </motion.blockquote>
            <motion.p
              className="font-bold"
              variants={fadeUp}
            >
              — Niels van Esveld, Esveld Installatie
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Tools & Technology */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Gebouwd met de beste tools
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            We gebruiken moderne technologie voor maximale snelheid en vindbaarheid
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 max-w-5xl mx-auto"
            variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
          >
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={optimizedStaggerItem(shouldReduceMotion)} style={gpuAcceleration}
              >
                {tool.link ? (
                  <a href={tool.link} target="_blank" rel="noopener noreferrer">
                    <motion.div
                      className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -4 }}
                      transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                    >
                      <img src={tool.logo} alt={tool.name} className="w-12 h-12 object-contain" loading="lazy" width="48" height="48" />
                    </motion.div>
                    <p className="text-sm font-medium text-accent">{tool.name}</p>
                  </a>
                ) : (
                  <>
                    <motion.div
                      className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -4 }}
                      transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                    >
                      <img src={tool.logo} alt={tool.name} className="w-12 h-12 object-contain" loading="lazy" width="48" height="48" />
                    </motion.div>
                    <p className="text-sm font-medium">{tool.name}</p>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* WordPress Note */}
          <motion.div
            className="mt-12 max-w-3xl mx-auto text-center p-6 bg-secondary/50 rounded-xl border border-border"
            variants={fadeUp}
          >
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Ook mogelijk:</span> Websites bouwen met WordPress en Elementor Pro,
              of complete webshops met WordPress, Elementor Pro en WooCommerce.
              Wij kiezen de beste oplossing voor jouw specifieke situatie.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section
        className="py-16 md:py-24 bg-gradient-to-br from-primary to-accent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground"
            variants={fadeUp}
          >
            Klaar om jouw website te laten bouwen?
          </motion.h2>
          <motion.p
            className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Neem vandaag nog contact op en ontvang binnen 24 uur een vrijblijvende offerte.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            variants={fadeUp}
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/contact" className="flex items-center gap-2">
                  Start Je Project
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/80"
            variants={fadeUp}
          >
            <motion.a
              href="tel:+31681762670"
              className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Phone className="w-5 h-5" />
              +31 6 81762670
            </motion.a>
            <span className="hidden sm:inline">|</span>
            <motion.a
              href="https://wa.me/31681762670"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Direct
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default WebsiteOpMaat;
