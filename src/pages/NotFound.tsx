import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, easings } from "@/lib/motion";

const NotFound = () => {
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

  const popularPages = [
    { name: "Diensten", path: "/diensten" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Over Ons", path: "/over-ons" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center bg-background px-6 py-24">
        <motion.div 
          className="max-w-2xl w-full text-center space-y-8"
          initial="hidden"
          animate="visible"
          variants={getVariants(staggerContainer)}
        >
          <motion.div 
            className="space-y-4"
            variants={getVariants(fadeUp)}
          >
            <motion.h1 
              className="text-9xl font-bold text-primary"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: easings.easeOutExpo }}
            >
              404
            </motion.h1>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-foreground"
              variants={getVariants(fadeUp)}
            >
              Pagina niet gevonden
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-md mx-auto"
              variants={getVariants(fadeUp)}
            >
              Oeps! De pagina die je zoekt bestaat niet of is verplaatst. Geen zorgen, we helpen je graag op weg.
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={getVariants(fadeUp)}
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Terug naar Home
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: easings.easeOutQuart }}
            >
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Neem Contact Op
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="pt-8 border-t border-border"
            variants={getVariants(fadeUp)}
          >
            <motion.h3 
              className="text-lg font-semibold mb-4"
              variants={getVariants(fadeUp)}
            >
              Bekijk onze populaire pagina's:
            </motion.h3>
            <motion.div 
              className="flex flex-wrap gap-3 justify-center"
              variants={getVariants(staggerContainer)}
            >
              {popularPages.map((page, index) => (
                <motion.div
                  key={page.path}
                  variants={getVariants(staggerItem)}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.2, ease: easings.easeOutQuart }}
                >
                  <Button asChild variant="secondary">
                    <Link to={page.path}>{page.name}</Link>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
