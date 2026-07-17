import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Globe, Palette, ShoppingBag, Pen } from "lucide-react";
import SocialContentSection from "@/components/SocialContentSection";
import ToolsSlider from "@/components/ToolsSlider";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, scaleUp, easings } from "@/lib/motion";
import { useDarkNavSection } from "@/components/UnderlayNav";

const ServiceCard = ({
  service,
  index
}: {
  service: {
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    link?: string;
    linkText?: string;
  };
  index: number;
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        delay: shouldReduceMotion ? 0 : index * 0.15, 
        duration: 0.5, 
        ease: easings.easeOutExpo 
      }}
    >
      <motion.div
        whileHover={shouldReduceMotion ? {} : { 
          y: -8, 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
        }}
        transition={{ duration: 0.3, ease: easings.easeOutExpo }}
      >
        <Card
          className="h-full group rounded-2xl bg-card overflow-hidden transition-colors"
          style={{ borderColor: "hsl(var(--sw-rule) / 0.14)" }}
        >
          <CardHeader>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4"
              whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 6 }}
              transition={{ duration: 0.3, ease: easings.easeOutExpo }}
            >
              <service.icon className="w-8 h-8 text-accent" />
            </motion.div>
            <CardTitle className="text-2xl md:text-3xl mb-3 group-hover:text-accent transition-colors duration-300">
              {service.title}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground font-light leading-relaxed">
              {service.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div
              className="p-6 rounded-xl border"
              style={{ background: "hsl(150, 14%, 97.5%)", borderColor: "hsl(var(--sw-rule) / 0.1)" }}
            >
              <h4 className="sw-mono mb-4" style={{ color: "hsl(var(--sw-green))" }}>Wat je krijgt</h4>
              <ul className="space-y-3">
                {service.features.map((feature: string, idx: number) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-3 group/item"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : 0.1 + idx * 0.05,
                      duration: 0.3,
                      ease: easings.easeOutExpo
                    }}
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter>
            <AnimatedButton to={service.link || "/start-je-project"} className="w-full">
              {service.linkText || "Start je project"}
            </AnimatedButton>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const Services = () => {
  // Dark CTA band: invert the fixed header while it's under it.
  const darkNavRef = useDarkNavSection<HTMLElement>();
  const shouldReduceMotion = useReducedMotion();

  const services = [
    {
      icon: Globe,
      title: "Website design & development",
      description: "Op maat gemaakte, responsive websites die prachtig design combineren met krachtige functionaliteit. Van corporate sites tot complexe webapplicaties - wij creëren digitale ervaringen die bezoekers omzetten in klanten.",
      features: ["Responsive & mobile-first design", "SEO optimalisatie", "Prestatie & snelheidsoptimalisatie", "CMS integratie", "E-commerce oplossingen"],
      link: "/diensten/website-op-maat",
      linkText: "Bekijk website dienst"
    },
    {
      icon: Palette,
      title: "Merkidentiteit & brand kits",
      description: "Complete merkidentiteitssystemen die jouw unieke visuele taal vastleggen. Wij creëren samenhangende brand kits die consistentie garanderen op alle contactpunten met je klanten.",
      features: ["Logo design & variaties", "Kleurenpalet ontwikkeling", "Typografie systeem", "Brand richtlijnen", "Marketing materialen"]
    },
    {
      icon: ShoppingBag,
      title: "E-commerce oplossingen",
      description: "Full-service e-commerce design inclusief productlijsten, banners en complete shop designs die verkoop stimuleren en gebruikerservaring verbeteren.",
      features: ["Productlijst design", "Custom banners & graphics", "Shop pagina layouts", "Conversie optimalisatie", "Mobiele shopping ervaring"]
    },
    {
      icon: Pen,
      title: "Custom design services",
      description: "Van e-books tot autobelettering - wij leveren hoogwaardige custom designs op maat, perfect afgestemd op jouw specifieke wensen en merkidentiteit.",
      features: ["E-book design & layout", "Voertuigbelettering graphics", "Drukwerk materialen", "Social media graphics", "Custom illustraties"]
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Digitale Diensten - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://www.nieuwblik.com"
    },
    "serviceType": "Webdesign & Digitale Marketing",
    "areaServed": "Nederland",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digitale Diensten",
      "itemListElement": services.map((service) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.description
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Diensten | Webdesign, Webshops & SEO Enkhuizen - Nieuwblik" 
        description="Ontdek onze diensten: website op maat, webshops, branding en SEO. Webdesign bureau Enkhuizen voor MKB in West-Friesland. Vraag een offerte aan." 
        keywords="webdesign Enkhuizen, webshop laten maken, SEO West-Friesland, branding, e-commerce, website ontwikkeling, online zichtbaarheid" 
        canonicalUrl="https://nieuwblik.com/diensten" 
        structuredData={structuredData} 
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Diensten", url: "https://nieuwblik.com/diensten" }
        ]} 
      />
      
      {/* Breadcrumb */}
      <section className="pt-32 pb-8 md:pb-12">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Diensten", path: "/diensten" }]} />
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
            ONZE DIENSTEN
          </motion.p>
          <motion.h1 
            className="text-display mb-6"
            variants={fadeUp}
          >
            Complete digitale oplossingen die groeien met jouw ambities
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
            variants={fadeUp}
          >
            Wij specialiseren ons in het creëren van premium digitale ervaringen die jouw merk naar een hoger niveau tillen en meetbare resultaten opleveren.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Content Section */}
      <SocialContentSection />

      {/* CTA Section */}
      <motion.section
        ref={darkNavRef}
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
            Klaar om jouw merk te laten schitteren?
          </motion.h2>
          <motion.p 
            className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light"
            variants={fadeUp}
          >
            Laten we bespreken hoe onze diensten jou kunnen helpen je bedrijfsdoelen te bereiken.
          </motion.p>
          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: easings.easeOutQuart }}
          >
            <Button asChild size="lg" variant="secondary">
              <Link to="/start-je-project">Start vandaag</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Services;
