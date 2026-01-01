import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import justinImage from "@/assets/justin-slok.png";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, scaleUp, easings } from "@/lib/motion";

const ThankYou = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Bedankt voor je Aanvraag | Nieuwblik Enkhuizen"
        description="Bedankt voor je projectaanvraag! We nemen binnen 48 uur contact met je op. Nieuwblik webdesign bureau Enkhuizen."
        keywords="bedankt, aanvraag verstuurd, Nieuwblik Enkhuizen, website project"
        canonicalUrl="https://nieuwblik.com/bedankt"
      />
      <Navigation />
      
      <motion.section 
        className="pt-32 pb-20 md:pt-40 md:pb-32"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: easings.easeOutExpo }}
            >
              <motion.img 
                src={justinImage} 
                alt="Justin Slok" 
                width="192"
                height="192"
                loading="eager"
                className="w-48 h-48 mx-auto rounded-full object-cover mb-8 shadow-lg"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3, ease: easings.easeOutQuart }}
              />
            </motion.div>
            
            <motion.h1 
              className="text-display mb-6"
              variants={fadeUp}
            >
              Bedankt! We gaan er zo snel mogelijk naar kijken!
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto"
              variants={fadeUp}
            >
              We hebben je project briefing ontvangen en nemen binnen 48 uur contact met je op.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeUp}
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.2, ease: easings.easeOutQuart }}
              >
                <Link to="/portfolio">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Bekijk Portfolio
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.2, ease: easings.easeOutQuart }}
              >
                <Link to="/">
                  <Button size="lg" variant="outline">
                    Terug naar Home
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default ThankYou;
