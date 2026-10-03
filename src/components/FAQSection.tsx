import { useState, useRef, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { easings } from "@/lib/motion";
import { useReveal } from "@/lib/reveal";
import { useCollapse } from "@/lib/collapse";
import { ALGEMENE_FAQ } from "@/data/algemeneFaq";

const ANTWOORD_MS = 400;
const ANTWOORD_EASE = `cubic-bezier(${easings.easeOutExpo.join(",")})`;

const faqs = ALGEMENE_FAQ;

const FAQCard = ({ item, isOpen, onClick, index }: { item: typeof faqs[0], isOpen: boolean, onClick: () => void, index: number }) => {
  const shouldReduceMotion = useReducedMotion();
  const id = useId();
  const triggerId = `${id}-vraag`;
  const panelId = `${id}-antwoord`;
  // Antwoord blijft altijd in de DOM (ook dicht, met `hidden`), zodat het in
  // de server-HTML staat voor crawlers die geen JavaScript uitvoeren.
  const { hidden, expanded } = useCollapse(isOpen, shouldReduceMotion ? 0 : ANTWOORD_MS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: easings.easeOutExpo }}
    >
      <motion.div
        onClick={onClick}
        className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-500 border ${isOpen
          ? "border-transparent shadow-2xl"
          : "bg-white border-border/50 hover:border-accent/30 hover:shadow-md"
          }`}
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, hsl(160 84% 14%) 0%, hsl(160 84% 10%) 50%, hsl(160 70% 8%) 100%)'
            : 'rgb(255, 255, 255)'
        }}
        layout
      >
        {/* Dark Background Texture/Sparkles for Open State */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Radial gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/20 opacity-100" />

              {/* Sparkles */}
              <div className="absolute top-8 right-12 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute top-16 right-24 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-75" />
              <div className="absolute bottom-12 left-8 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-150" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 px-5 py-4 md:px-6 md:py-5">
          {/* De vraag is een echte knop in de kop: bedienbaar met toetsenbord en
              met aria-expanded/aria-controls voor schermlezers. De hele kaart
              blijft daarnaast klikbaar; stopPropagation voorkomt dubbel togglen. */}
          <motion.h3
            className={`text-base md:text-[1.0625rem] font-semibold leading-snug transition-colors duration-300 ${isOpen ? "text-white" : "text-foreground"
              }`}
          >
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              data-faq-vraag=""
              onClick={(event) => {
                event.stopPropagation();
                onClick();
              }}
              className="flex w-full justify-between items-center gap-4 text-left cursor-pointer"
            >
              <span>{item.question}</span>

              {/* Toggle Icon */}
              <motion.span
                aria-hidden="true"
                className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full border transition-colors duration-300 ${isOpen
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-secondary border-transparent text-foreground group-hover:bg-accent group-hover:text-white"
                  }`}
                animate={{ rotate: isOpen ? 180 : 0 }}
              >
                {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </motion.span>
            </button>
          </motion.h3>

          <div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            hidden={hidden}
            className="grid"
            style={{
              gridTemplateRows: expanded ? "1fr" : "0fr",
              opacity: expanded ? 1 : 0,
              marginTop: expanded ? 12 : 0,
              transition: shouldReduceMotion
                ? "none"
                : `grid-template-rows ${ANTWOORD_MS}ms ${ANTWOORD_EASE}, opacity ${ANTWOORD_MS}ms ${ANTWOORD_EASE}, margin-top ${ANTWOORD_MS}ms ${ANTWOORD_EASE}`,
            }}
          >
            <div className="min-h-0 overflow-clip">
              <p className="text-[0.9375rem] text-white/80 font-light leading-relaxed pr-6">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first one
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Twee kolommen op desktop: eerste helft links, tweede helft rechts. Twee
  // losse kolommen (geen grid-rijen), zodat een open antwoord alleen zijn
  // eigen kolom langer maakt en de kaarten ernaast niet verspringen.
  const helft = Math.ceil(faqs.length / 2);
  const kolommen = [faqs.slice(0, helft), faqs.slice(helft)];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-secondary/50 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="h-px w-full mb-5" style={{ background: "hsl(var(--sw-rule) / 0.16)" }} />
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-16 lg:items-end mb-10 md:mb-12">
          <div className="lg:col-span-7">
            <span className="sw-reveal sw-mono inline-block mb-5" style={{ color: "hsl(var(--sw-green))" }}>Vragen</span>
            <h2 className="sw-reveal text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.05]" style={{ color: "hsl(var(--sw-ink))" }}>
              Nog vragen?{" "}
              <span style={{ color: "hsl(var(--sw-green))" }}>Wij hebben antwoorden</span>
            </h2>
          </div>
          <p className="sw-reveal lg:col-span-5 text-base md:text-lg font-light leading-relaxed max-w-md" style={{ color: "hsl(var(--sw-ink) / 0.65)" }}>
            Duidelijke, eerlijke antwoorden zodat je precies weet waar je aan toe bent. Geen verrassingen, alleen resultaat.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 lg:gap-4 lg:items-start">
          {kolommen.map((kolom, k) => (
            <div key={k} className="flex flex-col gap-3 lg:gap-4">
              {kolom.map((faq, i) => {
                const index = k * helft + i;
                return (
                  <FAQCard
                    key={index}
                    index={i}
                    item={faq}
                    isOpen={openIndex === index}
                    onClick={() => handleToggle(index)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
