import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { easings } from "@/lib/motion";

interface ReviewBarProps {
  isScrolled?: boolean;
}

const ReviewBar = ({ isScrolled = false }: ReviewBarProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  
  const messages = [
    { text: "10+ 5 sterren reviews", showStars: true },
    { text: "Website deze week live!", showStars: false },
    { text: "Vrijblijvend kennismaken!", showStars: false }
  ];

  useEffect(() => {
    // Mark initial load as complete after first render
    const initialTimer = setTimeout(() => setIsInitialLoad(false), 100);
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  // Smooth bar animation
  const barVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.4,
        ease: easings.easeOutExpo,
      },
    },
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.25,
        ease: easings.easeInOutQuart,
      },
    },
  };

  // Content animation - smoother transition
  const contentVariants = {
    enter: {
      opacity: 0,
      y: 8,
      filter: "blur(4px)",
    },
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.5,
        ease: easings.easeOutExpo,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      filter: "blur(4px)",
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.3,
        ease: easings.easeInOutQuart,
      },
    },
  };

  // Star animation with proper stagger
  const starContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const starVariants = {
    hidden: { 
      scale: 0, 
      rotate: -30,
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {!isScrolled && (
        <motion.div 
          className="bg-accent text-accent-foreground py-2.5 px-4 border-b border-accent-foreground/10 fixed top-0 left-0 right-0 z-50 overflow-hidden"
          variants={barVariants}
          initial={isInitialLoad ? "hidden" : false}
          animate="visible"
          exit="hidden"
        >
          <div className="container mx-auto flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                className="flex items-center gap-2"
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Stars - only show for first message */}
                {messages[currentIndex].showStars && (
                  <motion.div 
                    className="flex items-center gap-0.5"
                    variants={starContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        variants={starVariants}
                      >
                        <Star 
                          className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" 
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                {/* Text */}
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                  {messages[currentIndex].text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewBar;
