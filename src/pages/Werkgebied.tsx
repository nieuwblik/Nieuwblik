import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Phone, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocalRegions, getMajorRegions } from "@/data/regions";
import { easings } from "@/lib/motion";
import SEOHead from "@/components/SEOHead";
import { companyInfo } from "@/config/company";

const Werkgebied = () => {
  const shouldReduceMotion = useReducedMotion();
  const localRegions = getLocalRegions();
  const majorRegions = getMajorRegions();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.3,
        ease: easings.easeOutExpo
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Ons Werkgebied | Webdesign door heel Nederland - Nieuwblik"
        description="Nieuwblik is actief in heel Nederland. Van Enkhuizen tot Amsterdam, van kleine dorpen tot grote steden. Bekijk waar wij jouw website kunnen realiseren."
        keywords="webdesign Nederland, website laten maken, werkgebied, lokale webdesigner, West-Friesland"
      />

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easings.easeOutExpo }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: easings.easeOutBack }}
                className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full mb-6"
              >
                <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
                Landelijke dekking,
                <span className="text-accent block mt-1 sm:mt-2">lokale service</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
                Of je nu in het hart van West-Friesland zit of in een van de grote steden:
                Nieuwblik staat voor je klaar met professionele webdesign diensten.
              </p>

              <p className="text-sm sm:text-base font-medium text-foreground mb-8">
                Lokaal gevestigd in Enkhuizen, actief door heel Nederland.
              </p>

              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="inline-block"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12"
                >
                  <Link to="/contact">
                    Start je project
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Lokale Regio's Section */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="max-w-2xl mx-auto mb-8 sm:mb-10 text-center">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
                    Onze directe omgeving
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                    In West-Friesland en omgeving kennen we de lokale markt als geen ander.
                    Snelle service, persoonlijk contact en altijd dichtbij.
                  </p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                >
                  {localRegions.map((region) => (
                    <motion.div key={region.id} variants={itemVariants}>
                      <Link to={`/werkgebied/${region.slug}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-accent/50 h-full">
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex flex-col items-start gap-2">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent group-hover:scale-110 transition-transform" />
                              <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors leading-tight">
                                {region.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {region.province}
                              </p>
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Grote Steden Section */}
        <section className="py-12 sm:py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="max-w-2xl mx-auto mb-8 sm:mb-10 text-center">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
                    Ook actief in grote steden
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                    Landelijke service zonder landelijke prijzen. We werken met plezier voor
                    bedrijven in heel Nederland.
                  </p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                >
                  {majorRegions.map((region) => (
                    <motion.div key={region.id} variants={itemVariants}>
                      <Link to={`/werkgebied/${region.slug}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-accent/50 h-full bg-background">
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex flex-col items-start gap-2">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent group-hover:scale-110 transition-transform" />
                              <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors leading-tight">
                                {region.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {region.province}
                              </p>
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-secondary/30 border-accent/20">
                  <CardContent className="p-6 sm:p-8 lg:p-10">
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">
                        Staat jouw plaats er niet bij?
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Geen probleem! We werken voor bedrijven door heel Nederland.
                        Neem vrijblijvend contact op en ontdek wat we voor jou kunnen betekenen.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <div className="flex items-start gap-3 sm:gap-4 p-4 bg-background rounded-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                            Bel ons direct
                          </p>
                          <a
                            href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
                            className="text-sm sm:text-base font-semibold text-foreground hover:text-accent transition-colors break-all"
                          >
                            {companyInfo.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 sm:gap-4 p-4 bg-background rounded-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                            Stuur een mail
                          </p>
                          <a
                            href={`mailto:${companyInfo.email}`}
                            className="text-sm sm:text-base font-semibold text-foreground hover:text-accent transition-colors break-all"
                          >
                            {companyInfo.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="inline-block"
                      >
                        <Button
                          asChild
                          size="lg"
                          className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base"
                        >
                          <Link to="/contact">
                            Neem contact op
                            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: easings.easeOutExpo }}
                className="text-center"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
                  Klaar om je digitale aanwezigheid te versterken?
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed">
                  Waar je ook gevestigd bent in Nederland, we staan voor je klaar met
                  expertise, persoonlijke service en resultaatgerichte websites.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto text-sm sm:text-base"
                    >
                      <Link to="/contact">Neem contact op</Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-sm sm:text-base"
                    >
                      <Link to="/diensten">Bekijk onze diensten</Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Werkgebied;
