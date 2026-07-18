import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { AnimatedButton } from "@/components/ui/animated-button";
import justinImage from "@/assets/justin-slok.webp";
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
        noIndex={true}
        includeOrganizationSchema={false}
      />
      
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
              <AnimatedButton to="/portfolio" size="lg">
                Bekijk Portfolio
              </AnimatedButton>
              <AnimatedButton to="/" size="lg" variant="outline">
                Terug naar Home
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default ThankYou;
