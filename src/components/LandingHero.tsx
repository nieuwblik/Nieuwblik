import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plus, Linkedin } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { easings } from "@/lib/motion";
import { gpuAcceleration } from "@/lib/optimized-motion";
import heroTeamImage from "@/assets/justin-job-compressed.webp";
import { companyInfo } from "@/config/company";
import { cn } from "@/lib/utils";

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
          className="absolute bottom-[38%] left-[2%] bg-white/90 backdrop-blur shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-border/50 z-20 hidden md:flex"
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
              className="flex flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start mb-10"
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

            <div className="flex gap-2 sm:gap-3 justify-center lg:justify-start">
              <motion.a
                href={companyInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all bg-background border border-border shadow hover:bg-accent hover:text-accent-foreground"
                )}
                aria-label="LinkedIn"
                style={gpuAcceleration}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
              <motion.a
                href={companyInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-[#25D366] text-white"
                aria-label="WhatsApp"
                style={gpuAcceleration}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.85 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
              </motion.a>
            </div>
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
