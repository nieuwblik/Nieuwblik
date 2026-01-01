import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReviewsDisplay from "@/components/ReviewsDisplay";
import ReviewForm from "@/components/ReviewForm";
import SEOHead from "@/components/SEOHead";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, scaleUp, easings } from "@/lib/motion";

const Reviews = () => {
  const shouldReduceMotion = useReducedMotion();

  const getVariants = (variants: any) => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } }
      };
    }
    return variants;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Reviews | Klantervaringen Webdesign Bureau - Nieuwblik Enkhuizen"
        description="Lees ervaringen van onze klanten over websites en webshops. Webdesign bureau Enkhuizen met tevreden klanten in heel West-Friesland. Bekijk onze reviews."
        keywords="reviews webdesign, klantervaringen website, webdesign bureau Enkhuizen, tevreden klanten West-Friesland"
        canonicalUrl="https://nieuwblik.com/reviews"
        breadcrumbs={[
          { name: "Home", url: "https://nieuwblik.com" },
          { name: "Reviews", url: "https://nieuwblik.com/reviews" }
        ]}
      />
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-20 md:pt-40 md:pb-28"
        initial="hidden"
        animate="visible"
        variants={getVariants(staggerContainer)}
      >
        <div className="container mx-auto px-6">
          <motion.p 
            className="text-accent mb-6"
            variants={getVariants(fadeUp)}
          >
            KLANTBEOORDELINGEN
          </motion.p>
          <motion.h1 
            className="text-display mb-6"
            variants={getVariants(fadeUp)}
          >
            Wat onze klanten zeggen
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
            variants={getVariants(fadeUp)}
          >
            Ontdek de ervaringen van bedrijven die hun online succes hebben gerealiseerd met Nieuwblik.
          </motion.p>
        </div>
      </motion.section>

      {/* Reviews Display */}
      <motion.section 
        className="pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={getVariants(fadeUp)}
      >
        <div className="container mx-auto px-6">
          <ReviewsDisplay />
        </div>
      </motion.section>

      {/* Review Form Section */}
      <motion.section 
        className="py-20 md:py-32 bg-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={getVariants(staggerContainer)}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            variants={getVariants(fadeUp)}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={getVariants(fadeUp)}
            >
              Deel jouw ervaring
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto font-light"
              variants={getVariants(fadeUp)}
            >
              Heb je met ons samengewerkt? We horen graag over je ervaring!
            </motion.p>
          </motion.div>
          
          <motion.div variants={getVariants(scaleUp)}>
            <ReviewForm />
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Reviews;
