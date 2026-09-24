import { Link } from "@/lib/router-compat";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { easings } from "@/lib/motion";
import heroTeamImage from "@/assets/justin-job-compressed.webp";

interface LandingHeroProps {
  h1: string;
  subtitle: string;
}

const HeroImage = ({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) => (
  <div className="relative w-full flex items-end justify-center lg:justify-end">
    <motion.div
      className="relative z-10 w-full max-w-[480px] lg:max-w-none lg:w-[115%] lg:-mr-[15%]"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <img
        src={heroTeamImage}
        alt="Justin & Job van Nieuwblik"
        className="w-full h-auto object-contain z-10"
        style={{ filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.1))" }}
      />
      {!shouldReduceMotion && (
        <motion.div
          className="absolute bottom-[38%] left-[2%] bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-border/50 z-20 hidden md:flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold">Strategie-Gedreven</span>
        </motion.div>
      )}
      <motion.div
        className="absolute bottom-10 right-0 lg:-right-4 z-30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link to="/contact" className="group">
          <div className="bg-white rounded-full pl-6 pr-2 py-2 shadow-2xl flex items-center gap-4 border border-border/50 hover:border-accent/50 transition-colors">
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">Start je project</span>
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  </div>
);

const LandingHero = ({ h1, subtitle }: LandingHeroProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] lg:min-h-[90vh] overflow-hidden bg-background pt-header flex flex-col">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.4]">
        <div className="container mx-auto h-full flex justify-between px-4 sm:px-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-border" />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-12 lg:grid-rows-1">
          <div className="lg:col-span-7 relative z-10 text-center lg:text-left flex flex-col justify-center pt-12 pb-8 lg:py-20">
            <div className="mb-6 md:mb-8">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easings.easeOutExpo }}
              >
                {h1}
              </motion.h1>
            </div>

            <motion.p
              className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-md mb-8 mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: easings.easeOutExpo }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              className="flex flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: easings.easeOutExpo }}
            >
              <AnimatedButton to="/contact" size="lg">
                Start nu
              </AnimatedButton>
              <AnimatedButton to="/portfolio" size="lg" variant="outline">
                Ontdek portfolio
              </AnimatedButton>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative flex items-end">
            <HeroImage shouldReduceMotion={shouldReduceMotion} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
