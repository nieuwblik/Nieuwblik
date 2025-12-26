import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Cookie } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { easings, toastVariants } from "@/lib/motion";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  const bannerVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: easings.easeOutExpo,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.98,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.3,
        ease: easings.easeInOutQuart,
      },
    },
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <motion.div 
                className="flex items-start gap-3 flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: easings.easeOutExpo }}
              >
                <motion.div
                  animate={shouldReduceMotion ? {} : { 
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{ 
                    delay: 0.5, 
                    duration: 0.5, 
                    ease: "easeInOut" 
                  }}
                >
                  <Cookie className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">We gebruiken cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    We gebruiken cookies om je ervaring te verbeteren en onze website te optimaliseren. Door op "Accepteren" te klikken, stem je in met ons gebruik van cookies.
                  </p>
                </div>
              </motion.div>
              <motion.div 
                className="flex gap-2 w-full md:w-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: easings.easeOutExpo }}
              >
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="flex-1 md:flex-none"
                >
                  <Button
                    variant="outline"
                    onClick={declineCookies}
                    className="w-full"
                  >
                    Weigeren
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="flex-1 md:flex-none"
                >
                  <Button
                    onClick={acceptCookies}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Accepteren
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
