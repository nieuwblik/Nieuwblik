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
      transition={{ delay: index * 0.1, duration: 0.5, ease: easings.easeOutExpo }}
      className="mb-4 last:mb-0"
    >
      <motion.div
        onClick={onClick}
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 border ${isOpen
          ? "border-transparent shadow-2xl"
          : "bg-white border-border/50 hover:border-accent/30 hover:shadow-lg"
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

        <div className="relative z-10 p-6 md:p-8">
          {/* De vraag is een echte knop in de kop: bedienbaar met toetsenbord en
              met aria-expanded/aria-controls voor schermlezers. De hele kaart
              blijft daarnaast klikbaar; stopPropagation voorkomt dubbel togglen. */}
          <motion.h3
            className={`text-lg md:text-xl font-bold leading-tight transition-colors duration-300 ${isOpen ? "text-white" : "text-foreground"
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
              className="flex w-full justify-between items-start gap-4 text-left cursor-pointer"
            >
              <span>{item.question}</span>

              {/* Toggle Icon */}
              <motion.span
                aria-hidden="true"
                className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ${isOpen
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-secondary border-transparent text-foreground group-hover:bg-accent group-hover:text-white"
                  }`}
                animate={{ rotate: isOpen ? 180 : 0 }}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
              marginTop: expanded ? 16 : 0,
              transition: shouldReduceMotion
                ? "none"
                : `grid-template-rows ${ANTWOORD_MS}ms ${ANTWOORD_EASE}, opacity ${ANTWOORD_MS}ms ${ANTWOORD_EASE}, margin-top ${ANTWOORD_MS}ms ${ANTWOORD_EASE}`,
            }}
          >
            <div className="min-h-0 overflow-clip">
              <p className="text-white/80 font-light leading-relaxed pr-8">
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

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-24 bg-secondary/50 relative overflow-hidden"
    >
      {/* Container restricted to max-w-6xl for compactness */}
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left Column - Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="text-left">
              <div className="h-px w-full mb-5" style={{ background: "hsl(var(--sw-rule) / 0.16)" }} />
              <div className="mb-6">
                <span className="sw-reveal sw-mono inline-block" style={{ color: "hsl(var(--sw-green))" }}>Vragen</span>
              </div>

              <h2 className="sw-reveal text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight mb-6 leading-[1.02]" style={{ color: "hsl(var(--sw-ink))" }}>
                Nog vragen? <br />
                <span style={{ color: "hsl(var(--sw-green))" }}>Wij hebben antwoorden</span>
              </h2>

              <p className="sw-reveal text-lg font-light leading-relaxed mb-8 max-w-md" style={{ color: "hsl(var(--sw-ink) / 0.65)" }}>
                Duidelijke, eerlijke antwoorden zodat je precies weet waar je aan toe bent. Geen verrassingen, alleen resultaat.
              </p>
            </div>
          </div>

          {/* Right Column - FAQ Cards */}
          <div className="lg:col-span-7">
            {faqs.map((faq, index) => (
              <FAQCard
                key={index}
                index={index}
                item={faq}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
