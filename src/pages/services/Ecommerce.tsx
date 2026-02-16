import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Image, Package, BookOpen, Check, Plus, ArrowRight, MessageCircle, Star } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerContainerSlow, staggerItem, slideInLeft, slideInRight, scaleUp, modalVariants, easings } from "@/lib/motion";
import {
  optimizedStaggerContainer,
  optimizedStaggerItem,
  gpuAcceleration,
  optimizedViewport
} from "@/lib/optimized-motion";

// Import e-commerce listing images
import kattenbakListingImg from "@/assets/projects/kattenbak-listing.png";
import hamburgerPressListingImg from "@/assets/projects/hamburger-press-listing.png";
import schoenenWolListingImg from "@/assets/projects/schoenen-wol-listing.png";
import pastamachineListingImg from "@/assets/projects/pastamachine-listing.png";
import compressorListingImg from "@/assets/projects/compressor-listing.png";

const Ecommerce = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const ecommerceListings = [
    {
      title: "Kattenbak - Movendo",
      description: "Professionele Amazon product listing met complete USP's en feature highlights.",
      image: kattenbakListingImg,
    },
    {
      title: "Q-mate - Drogerballen",
      description: "Aantrekkelijke listing voor duurzame drogerballen met focus op kwaliteit.",
      image: hamburgerPressListingImg,
    },
    {
      title: "Hamburgerpers - Kitchenz",
      description: "Visueel sterke Amazon listing met duidelijke voordelen en gebruiksgemak.",
      image: schoenenWolListingImg,
    },
    {
      title: "Pastamachine - Kitchenz",
      description: "Complete product story voor premium pastamachines met gedetailleerde features.",
      image: pastamachineListingImg,
    },
    {
      title: "Compressor - Grobbie",
      description: "Technische product listing met focus op specificaties en toepassingen.",
      image: compressorListingImg,
    }
  ];

  const usps = [{
    icon: Image,
    title: "Professionele listings",
    subtitle: "Visueel verkopen",
    description: "Wij maken overtuigende product listings voor Amazon, Bol.com en andere marketplaces die je conversie verhogen."
  }, {
    icon: Package,
    title: "Productverpakkingen",
    subtitle: "Premium uitstraling",
    description: "Van concept tot print-ready ontwerp: verpakkingen die opvallen in het schap én bij de klant thuis."
  }, {
    icon: BookOpen,
    title: "Extra waarde producten",
    subtitle: "E-books & meer",
    description: "Creëer aanvullende producten zoals e-books, handleidingen en digital downloads die je marge verhogen."
  }];

  const steps = [{
    number: "01",
    title: "Briefing & research",
    description: "We analyseren je product, doelgroep en concurrentie voor de beste aanpak."
  }, {
    number: "02",
    title: "Concept & design",
    description: "Eerste concepten voor listings, verpakkingen of e-books ter beoordeling."
  }, {
    number: "03",
    title: "Revisierondes",
    description: "Feedback verwerken tot je 100% tevreden bent met het eindresultaat."
  }, {
    number: "04",
    title: "Oplevering",
    description: "Alle bestanden in de juiste formaten, klaar voor upload of productie."
  }];

  const includedStandard = ["Professionele product listings", "Marketplace-ready afbeeldingen", "Conversiegerichte productbeschrijvingen", "A+ content / Enhanced Brand Content", "Productverpakking design", "E-books en digital downloads", "Print-ready bestanden", "Revisierondes inbegrepen"];
  const optionalModules = ["3D product visualisaties", "Video productpresentaties", "Lifestyle fotografie", "Meertalige listings", "Brandbook & richtlijnen", "Maandelijkse optimalisatie"];

  const faqs = [{
    question: "Wat maken jullie precies voor e-commerce?",
    answer: "Wij maken professionele product listings (tekst + afbeeldingen), productverpakkingen en extra waarde producten zoals e-books. De webshop, verkoop en logistiek regel je zelf."
  }, {
    question: "Kunnen jullie ook mijn hele webshop bouwen?",
    answer: "Voor complete webshops verwijzen we je naar onze Webshops dienst. Hier focussen we puur op de content die je producten laat verkopen."
  }, {
    question: "Hoe lang duurt het om een listing te maken?",
    answer: "Een complete product listing is meestal binnen 1-2 weken klaar, inclusief revisierondes. Bij grotere aantallen maken we een passende planning."
  }, {
    question: "Leveren jullie print-ready bestanden?",
    answer: "Ja! Verpakkingsdesigns leveren we altijd print-ready aan, inclusief de juiste snijmarges en kleurprofielen voor jouw drukker."
  }];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "E-commerce oplossingen - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://www.nieuwblik.com"
    },
    "serviceType": "E-commerce Strategy & Development",
    "description": "Complete e-commerce oplossingen: multichannel verkoop, marketplace integraties, marketing automation en conversie-optimalisatie.",
    "areaServed": "Nederland"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="E-commerce & Product Listings | Verkoop meer online - Nieuwblik"
        description="Professionele Amazon & Bol.com listings, verpakkingsdesign en e-books. Verhoog je online zichtbaarheid en conversie. E-commerce specialist West-Friesland."
        keywords="e-commerce Enkhuizen, Amazon listings, Bol.com verkopen, product fotografie, verpakkingsdesign, conversie optimalisatie West-Friesland"
        canonicalUrl="https://nieuwblik.com/diensten/ecommerce"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Diensten", url: "https://nieuwblik.com/diensten" },
          { name: "E-commerce", url: "https://nieuwblik.com/diensten/ecommerce" }
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
            label: "E-commerce",
            path: "/diensten/e-commerce"
          }]} />
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
            E-commerce
          </motion.p>
          <motion.h1
            className="text-display mb-6"
            variants={fadeUp}
          >
            E-commerce die echt groeit
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light mb-6"
            variants={fadeUp}
          >
            Wij maken professionele product listings, verpakkingsdesigns en extra waarde producten zoals e-books.
            De verkoop, logistiek en klantenservice? Dat is voor jou – wij focussen op wat je verkoopt.
          </motion.p>
          <motion.div
            className="bg-secondary/80 border border-border rounded-lg p-4 mb-10 max-w-2xl"
            variants={fadeUp}
          >
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Onze focus:</strong> Wij creëren de visuele en tekstuele content die jouw producten laat verkopen.
              De webshop, marketplace accounts, fulfillment en klantcontact regel jij zelf of via een andere partner.
            </p>
          </motion.div>
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
                  Bespreek je groeikansen
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
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeUp}
          >
            Waarom onze e-commerce aanpak werkt
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Geen losse projecten, maar een strategie voor duurzame groei
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
          >
            {usps.map((usp, index) => (
              <motion.div
                key={index}
                variants={optimizedStaggerItem(shouldReduceMotion)} style={gpuAcceleration}
                className="h-full"
              >
                <motion.div
                  whileHover={shouldReduceMotion ? {} : {
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                  }}
                  transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                  className="h-full"
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

      {/* Portfolio Section */}
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
            Onze e-commerce projecten
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Professionele listings die daadwerkelijk verkopen
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}
          >
            {ecommerceListings.map((listing, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                variants={optimizedStaggerItem(shouldReduceMotion)} style={gpuAcceleration}
                onClick={() => setSelectedImage(listing.image)}
              >
                <motion.div
                  className="aspect-[4/3] bg-secondary rounded-lg mb-4 overflow-hidden relative"
                  whileHover={shouldReduceMotion ? {} : {
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                >
                  <motion.img
                    src={listing.image}
                    alt={listing.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    transition={{ duration: 0.5, ease: easings.easeOutExpo }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span
                      className="text-sm font-medium bg-background px-4 py-2 rounded-full shadow-lg"
                      initial={{ y: 10, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      Bekijk groter
                    </motion.span>
                  </motion.div>
                </motion.div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">{listing.title}</h3>
                <p className="text-muted-foreground text-sm">{listing.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden border-0">
          <AnimatePresence>
            {selectedImage && (
              <motion.img
                src={selectedImage}
                alt="E-commerce listing"
                className="w-full h-full object-contain"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Steps */}
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
            Onze e-commerce aanpak
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Gestructureerd naar meetbare resultaten
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
            Wat we voor je regelen
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Complete e-commerce oplossingen op maat
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
                <h3 className="text-xl font-bold">Kernonderdelen</h3>
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
                <h3 className="text-xl font-bold">Uitbreidingen</h3>
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
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeUp}
          >
            Klaar om je omzet te verdubbelen?
          </motion.h2>
          <motion.p
            className="text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Plan een vrijblijvend strategiegesprek en ontdek de groeikansen voor jouw business.
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
                  Plan een strategiegesprek
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
        variants={optimizedStaggerContainer(shouldReduceMotion)}
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
            Antwoorden op de meest voorkomende e-commerce vragen
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
              "Door de multichannel aanpak van Nieuwblik zijn we nu ook succesvol op Bol.com en Amazon. Onze omzet is in 6 maanden met 140% gestegen!"
            </motion.blockquote>
            <motion.p
              className="font-bold"
              variants={fadeUp}
            >
              — Maarten, Kitchenz
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
        variants={optimizedStaggerContainer(shouldReduceMotion)}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeUp}
          >
            Laten we jouw e-commerce naar het volgende niveau tillen
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Neem contact op voor een vrijblijvend gesprek over jouw groeimogelijkheden
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
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Ecommerce;
