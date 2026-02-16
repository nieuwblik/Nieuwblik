import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { Link } from "react-router-dom";
import { ShoppingCart, CreditCard, BarChart3, Check, Plus, ArrowRight, MessageCircle, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerContainerSlow, staggerItem, slideInLeft, slideInRight, scaleUp, easings } from "@/lib/motion";
import {
  optimizedStaggerContainer,
  optimizedStaggerItem,
  gpuAcceleration,
  optimizedViewport
} from "@/lib/optimized-motion";

const Webshops = () => {
  const shouldReduceMotion = useReducedMotion();

  const usps = [
    {
      icon: ShoppingCart,
      title: "Gebruiksvriendelijk",
      subtitle: "Makkelijk bestellen",
      description: "Intuïtieve checkout flow die bezoekers moeiteloos door het aankoopproces leidt met minimale klikken."
    },
    {
      icon: CreditCard,
      title: "Veilige betalingen",
      subtitle: "iDEAL, Klarna & meer",
      description: "Alle populaire betaalmethoden geïntegreerd met bankniveau beveiliging voor zorgeloos winkelen."
    },
    {
      icon: BarChart3,
      title: "Groei & inzichten",
      subtitle: "Data-gedreven verkoop",
      description: "Realtime dashboards tonen conversies, bestsellers en klantgedrag voor slimme beslissingen."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Strategie & producten",
      description: "We analyseren jouw markt, doelgroep en producten om de perfecte webshop strategie te bepalen."
    },
    {
      number: "02",
      title: "Design & branding",
      description: "Een luxe, conversiegerichte webshop die jouw merk versterkt en vertrouwen wekt bij klanten."
    },
    {
      number: "03",
      title: "Technische setup",
      description: "Complete configuratie van betalingen, verzending, voorraad en automatiseringen."
    },
    {
      number: "04",
      title: "Lancering & groei",
      description: "Live gaan met SEO-optimalisatie en continue ondersteuning voor maximale verkoop."
    }
  ];

  const includedStandard = [
    "Volledig responsive webshop design",
    "Productcatalogus met varianten",
    "Veilige checkout met iDEAL & Klarna",
    "Voorraadbeheer systeem",
    "Automatische orderbevestigingen",
    "SEO-geoptimaliseerde productpagina's",
    "Google Analytics e-commerce tracking",
    "SSL-certificaat & beveiliging"
  ];

  const optionalModules = [
    "Koppeling met boekhoudpakket",
    "Dropshipping integratie",
    "Loyalty programma",
    "Abandoned cart e-mails",
    "Product reviews systeem",
    "Meertalige webshop"
  ];

  const faqs = [
    {
      question: "Hoe lang duurt het om een webshop te bouwen?",
      answer: "Een standaard webshop is binnen 2-3 weken live. Complexere shops met veel producten of custom functionaliteit kunnen 4-6 weken duren."
    },
    {
      question: "Welke betaalmethoden worden ondersteund?",
      answer: "Alle populaire methoden: iDEAL, creditcard, Bancontact, Klarna, PayPal en meer. We configureren alles voor jou."
    },
    {
      question: "Kan ik zelf producten toevoegen en beheren?",
      answer: "Absoluut! Je krijgt een gebruiksvriendelijk dashboard waar je zelfstandig producten, prijzen en voorraad kunt beheren."
    },
    {
      question: "Wat kost een professionele webshop?",
      answer: "Webshops starten vanaf €997. De exacte prijs hangt af van het aantal producten, functionaliteiten en integraties die je nodig hebt."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professionele webshops - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://www.nieuwblik.com"
    },
    "serviceType": "Webshop Development",
    "description": "Professionele webshops die verkopen. Veilige betalingen, voorraadbeheer en conversiegerichte designs.",
    "areaServed": "Nederland",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "EUR",
      "price": "997"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Webshop Laten Maken Enkhuizen | E-commerce West-Friesland"
        description="Webshop laten maken in Enkhuizen? Professionele webshops met iDEAL, Klarna en voorraadbeheer. Webshop bureau West-Friesland. Vanaf €997."
        keywords="webshop laten maken Enkhuizen, e-commerce West-Friesland, online winkel, webshop bouwen, WooCommerce, Shopify, webshop Enkhuizen"
        canonicalUrl="https://nieuwblik.com/diensten/webshops"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Diensten", url: "https://nieuwblik.com/diensten" },
          { name: "Webshops", url: "https://nieuwblik.com/diensten/webshops" }
        ]}
      />
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb
            items={[
              { label: "Diensten", path: "/diensten" },
              { label: "Webshops", path: "/diensten/webshops" }
            ]}
          />
        </div>
      </section>

      {/* Hero Section */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
      >
        <div className="container mx-auto px-6">
          <motion.p
            className="text-accent mb-6 uppercase tracking-wide font-medium"
            variants={fadeUp}
          >
            Webshops
          </motion.p>
          <motion.h1
            className="text-display mb-6"
            variants={fadeUp}
          >
            Webshops die verkopen terwijl jij slaapt
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light mb-10"
            variants={fadeUp}
          >
            Van eerste bezoeker tot terugkerende klant. Wij bouwen webshops die converteren
            met veilige betalingen, slim voorraadbeheer en een koopervaring die klanten niet vergeten.
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
                  Start jouw webshop
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

      {/* USPs */}
      <motion.section
        className="py-16 md:py-24 bg-secondary/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Waarom kiezen voor onze webshops?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Alles wat je nodig hebt om succesvol online te verkopen
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

      {/* Steps */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Zo bouwen wij jouw webshop
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Van idee tot verkopende webshop in vier stappen
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
        variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Wat zit er in jouw webshop?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Complete webshop oplossing zonder verborgen kosten
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                <h3 className="text-xl font-bold">Standaard inbegrepen</h3>
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
                <h3 className="text-xl font-bold">Optionele uitbreidingen</h3>
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

      {/* CTA */}
      <motion.section
        className="py-16 md:py-24 bg-accent text-accent-foreground"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeUp}
          >
            Klaar om online te verkopen?
          </motion.h2>
          <motion.p
            className="text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Laten we bespreken hoe jouw webshop eruit moet zien. Webshops vanaf €997.
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
                  Vraag een offerte aan
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Veelgestelde vragen
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Alles wat je wilt weten over onze webshops
          </motion.p>

          <motion.div
            className="max-w-3xl mx-auto space-y-6"
            variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-card border border-border rounded-lg p-6"
                variants={optimizedStaggerItem(shouldReduceMotion)} style={gpuAcceleration}
                whileHover={shouldReduceMotion ? {} : {
                  y: -2,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              >
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonial */}
      <motion.section
        className="py-16 md:py-24 bg-secondary/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
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
              "Onze webshop draait nu volledig automatisch. Orders komen binnen, betalingen worden verwerkt
              en klanten krijgen automatisch hun verzendinfo. Echt ontzorgd!"
            </motion.blockquote>
            <motion.p
              className="font-bold"
              variants={fadeUp}
            >
              — Tevreden webshop klant
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeUp}
          >
            Start vandaag met verkopen
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Neem contact op voor een vrijblijvend gesprek over jouw webshop wensen
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeUp}
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                <Link to="/contact" className="flex items-center gap-2">
                  Neem contact op
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
                <a href="tel:+31681762670" className="flex items-center gap-2">
                  Bel direct: 06 81 76 26 70
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Webshops;
