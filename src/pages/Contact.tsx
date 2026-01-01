import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, slideInLeft, slideInRight, easings } from "@/lib/motion";

const Contact = () => {
  const shouldReduceMotion = useReducedMotion();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact - Nieuwblik",
    "description": "Neem contact op met Nieuwblik voor jouw digitale project. Wij staan klaar om je te helpen!",
    "url": "https://www.nieuwblik.com/contact"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Contact | Webdesign Bureau Enkhuizen - Nieuwblik"
        description="Neem contact op met Nieuwblik in Enkhuizen. Website of webshop laten maken? Bel, WhatsApp of vul het formulier in. Reactie binnen 24 uur gegarandeerd."
        keywords="contact webdesign Enkhuizen, offerte website, website laten maken West-Friesland, webdesign bureau contact"
        canonicalUrl="https://nieuwblik.com/contact"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Contact", url: "https://nieuwblik.com/contact" }
        ]}
      />
      <Navigation />
      
      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
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
            className="text-accent mb-6"
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
            
            {/* Direct Contact Box */}
            <motion.div 
              className="lg:col-span-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <motion.div 
                className="bg-accent text-accent-foreground p-8 rounded-lg sticky top-32"
                whileHover={shouldReduceMotion ? {} : { 
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              >
                <motion.h2 
                  className="text-2xl font-semibold mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.1, duration: 0.4, ease: easings.easeOutExpo }}
                >
                  Liever direct contact?
                </motion.h2>
                <motion.p 
                  className="mb-6 opacity-90"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.15, duration: 0.4, ease: easings.easeOutExpo }}
                >
                  Geen zin in een formulier? Bel of app ons direct voor een persoonlijk gesprek.
                </motion.p>
                
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.2, duration: 0.4, ease: easings.easeOutExpo }}
                >
                  <motion.a
                    href="tel:+31646253607"
                    className="w-full block"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                  >
                    <Button 
                      className="w-full bg-background text-foreground hover:bg-background/90"
                      size="lg"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Bel: +31 6 46 25 36 07
                    </Button>
                  </motion.a>
                  
                  <motion.a
                    href="https://wa.me/31646253607"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                  >
                    <Button 
                      className="w-full bg-[#25D366] text-white hover:bg-[#20BA5A]"
                      size="lg"
                    >
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </Button>
                  </motion.a>
                </motion.div>

                <motion.div 
                  className="mt-8 pt-8 border-t border-background/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.3, duration: 0.4, ease: easings.easeOutExpo }}
                >
                  <p className="text-sm opacity-75">
                    Beschikbaar ma-vr van 9:00 - 18:00 uur
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Project Briefing Form */}
            <motion.div 
              className="lg:col-span-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <motion.div 
                className="bg-secondary p-8 md:p-12 rounded-lg"
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

      <Footer />
    </div>
  );
};

export default Contact;
