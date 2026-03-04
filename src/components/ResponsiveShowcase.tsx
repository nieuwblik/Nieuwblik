import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { easings } from "@/lib/motion";

// ─── Asset imports ───────────────────────────────────────────────────────────
import bgImg from "@/assets/recente-projecten/puurinharmonie-background-project.webp";
import laptopImg from "@/assets/recente-projecten/puurinharmonie-laptop.webp";
import avatarImg from "@/assets/recente-projecten/puurinharmonie-avatar.png";
import { Star, ExternalLink } from "lucide-react";

// ─── Reveal helper ────────────────────────────────────────────────────────────
const Reveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: shouldReduceMotion ? 0 : 40 }
      }
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.85,
        delay: shouldReduceMotion ? 0 : delay,
        ease: easings.easeOutExpo,
      }}
    >
      {children}
    </motion.div>
  );
};

// ─── Google Review Component ──────────────────────────────────────────────────
const GoogleReview = () => (
  <Reveal delay={0.4} className="lg:absolute lg:bottom-12 lg:right-12 mt-12 lg:mt-0 lg:mb-0 mb-12 self-start lg:self-auto">
    <a
      href="https://www.google.com/search?q=Puur+in+Harmonie+reviews"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 p-5 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20 lg:shadow-none shadow-sm hover:scale-[1.02] transition-all duration-300"
    >
      <div className="shrink-0 relative">
        <img
          src={avatarImg}
          alt="Heleen - Puur in Harmonie"
          width={48} height={48}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-black">Heleen</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
          </div>
        </div>
        <p className="text-[13px] text-black/80 leading-snug font-light italic">
          "De samenwerking met Nieuwblik was fantastisch. Mijn website straalt nu precies de rust en harmonie uit die ik zocht."
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-black/40 font-bold group-hover:text-black transition-colors">
          Bekijk op Google <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </a>
  </Reveal>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const ResponsiveShowcase = () => {
  return (
    <section
      aria-label="Responsive design showcase — Puur in Harmonie"
      className="relative w-full lg:h-screen overflow-hidden bg-white"
    >
      {/* ── Desktop Background ────────────────────────────────────────────── */}
      <div className="hidden lg:block absolute inset-0">
        <img
          src={bgImg}
          alt="Puurinharmonie.nl op desktop en mobiel"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ── Content Wrapper ────────────────────────────────────────────────── */}
      <div className="relative flex flex-col lg:h-full pt-16 sm:pt-20 lg:pt-14 px-8 sm:px-16 lg:px-24 xl:px-32">
        <div className="max-w-3xl mb-12 lg:mb-0">
          {/* Label */}
          <Reveal delay={0}>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-5 text-black">
              Uitgelicht project
            </p>
          </Reveal>

          {/* Headline */}
          <Reveal delay={0.12}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-8 uppercase">
              Puur in Harmonie
            </h2>
          </Reveal>

          {/* Body copy */}
          <Reveal delay={0.24}>
            <p className="text-lg sm:text-xl leading-relaxed text-black font-light max-w-2xl">
              Voor de salon van Heleen, Puur in Harmonie, creëerden we een digitale vertaling van haar serene werkwijze. Naast een minimalistisch design realiseerden we een naadloze webshop-integratie via Stripe, waardoor klanten haar producten nu eenvoudig online kunnen bestellen op elk apparaat.
            </p>
          </Reveal>
        </div>

        {/* ── Google Review ────────────────────────────────────────────────── */}
        <GoogleReview />

        {/* ── Mobile Image ──────────────────────────────────────────────────── */}
        <div className="lg:hidden -mx-8 sm:-mx-16 mt-auto">
          <img
            src={laptopImg}
            alt="Puurinharmonie.nl laptop weergave"
            width={1400}
            height={1000}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};
