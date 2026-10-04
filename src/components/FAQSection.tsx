import { useState, useRef, useId, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { easings } from "@/lib/motion";
import { useReveal } from "@/lib/reveal";
import { useCollapse } from "@/lib/collapse";
import { ALGEMENE_FAQ } from "@/data/algemeneFaq";

const ANTWOORD_MS = 400;
const ANTWOORD_EASE = `cubic-bezier(${easings.easeOutExpo.join(",")})`;
/** Ruimte tussen vraag en antwoord als het open is (px). */
const ANTWOORD_MARGE = 8;

const faqs = ALGEMENE_FAQ;

// Op de server bestaat useLayoutEffect niet; daar is meten ook niet nodig.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: easings.easeOutExpo }}
    >
      <div
        data-faq-kaart=""
        onClick={onClick}
        className={`group relative overflow-hidden rounded-lg cursor-pointer transition-[border-color,box-shadow] duration-300 border ${isOpen
          ? "border-transparent shadow-md"
          : "bg-white border-border/50 hover:border-accent/30 hover:shadow-sm"
          }`}
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, hsl(160 84% 14%) 0%, hsl(160 84% 10%) 50%, hsl(160 70% 8%) 100%)'
            : 'rgb(255, 255, 255)'
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-black/20"
            />
          )}
        </AnimatePresence>

        <div data-faq-binnen="" className="relative z-10 px-4 py-3">
          {/* De vraag is een echte knop in de kop: bedienbaar met toetsenbord en
              met aria-expanded/aria-controls voor schermlezers. De hele kaart
              blijft daarnaast klikbaar; stopPropagation voorkomt dubbel togglen. */}
          <h3
            className={`text-sm font-semibold leading-snug transition-colors duration-300 ${isOpen ? "text-white" : "text-foreground"
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
              className="flex w-full justify-between items-center gap-3 text-left cursor-pointer"
            >
              <span>{item.question}</span>

              <motion.span
                aria-hidden="true"
                className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border transition-colors duration-300 ${isOpen
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-secondary border-transparent text-foreground group-hover:bg-accent group-hover:text-white"
                  }`}
                animate={{ rotate: isOpen ? 180 : 0 }}
              >
                {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </motion.span>
            </button>
          </h3>

          <div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            hidden={hidden}
            data-faq-paneel=""
            className="grid"
            style={{
              gridTemplateRows: expanded ? "1fr" : "0fr",
              opacity: expanded ? 1 : 0,
              marginTop: expanded ? ANTWOORD_MARGE : 0,
              transition: shouldReduceMotion
                ? "none"
                : `grid-template-rows ${ANTWOORD_MS}ms ${ANTWOORD_EASE}, opacity ${ANTWOORD_MS}ms ${ANTWOORD_EASE}, margin-top ${ANTWOORD_MS}ms ${ANTWOORD_EASE}`,
            }}
          >
            <div className="min-h-0 overflow-clip">
              <p className="text-[0.8125rem] text-white/80 font-light leading-relaxed pr-5">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Vaste hoogte voor het vragenblok: de hoogte met alles dicht plus het
 * langste antwoord, per kolom. Er staat hooguit één antwoord open, dus het
 * blok wordt nooit hoger dan dit en de sectie eronder verspringt niet als je
 * een vraag open- of dichtklapt.
 *
 * Gemeten in de browser (bij laden en als de breedte verandert): de dichte
 * hoogte per kaart is de kaarthoogte zonder het antwoordpaneel, de hoogte van
 * een antwoord komt uit een onzichtbare kopie op dezelfde breedte (een dicht
 * antwoord staat op `hidden` en heeft zelf geen hoogte).
 */
function useVasteHoogte(blokRef: React.RefObject<HTMLDivElement | null>) {
  const [minHoogte, setMinHoogte] = useState<number | undefined>(undefined);

  useIsoLayoutEffect(() => {
    const blok = blokRef.current;
    if (!blok) return;

    const meet = () => {
      const kolommen = [...blok.children] as HTMLElement[];
      const naastElkaar =
        kolommen.length > 1 && kolommen[0]!.offsetTop === kolommen[1]!.offsetTop;

      const perKolom = kolommen.map((kolom) => {
        const kaarten = [...kolom.querySelectorAll<HTMLElement>("[data-faq-kaart]")];
        let dicht = 0;
        let langste = 0;
        for (const kaart of kaarten) {
          const paneel = kaart.querySelector<HTMLElement>("[data-faq-paneel]");
          const binnen = kaart.querySelector<HTMLElement>("[data-faq-binnen]");
          const tekst = paneel?.querySelector("p");
          const paneelHoogte = paneel && !paneel.hidden
            ? paneel.offsetHeight + parseFloat(getComputedStyle(paneel).marginTop || "0")
            : 0;
          dicht += kaart.offsetHeight - paneelHoogte;

          if (tekst && binnen) {
            const stijl = getComputedStyle(binnen);
            const breedte =
              binnen.clientWidth - parseFloat(stijl.paddingLeft) - parseFloat(stijl.paddingRight);
            const kopie = tekst.cloneNode(true) as HTMLElement;
            Object.assign(kopie.style, {
              position: "absolute",
              visibility: "hidden",
              left: "-9999px",
              top: "0",
              width: `${breedte}px`,
            });
            document.body.appendChild(kopie);
            langste = Math.max(langste, kopie.offsetHeight + ANTWOORD_MARGE);
            kopie.remove();
          }
        }
        const gat = parseFloat(getComputedStyle(kolom).rowGap || "0") * Math.max(0, kaarten.length - 1);
        return { dicht: dicht + gat, langste };
      });

      if (naastElkaar) {
        setMinHoogte(Math.ceil(Math.max(...perKolom.map((k) => k.dicht + k.langste))));
      } else {
        // Onder elkaar (mobiel): alles dicht plus het langste antwoord van allemaal.
        const gatTussen = parseFloat(getComputedStyle(blok).rowGap || "0") * Math.max(0, kolommen.length - 1);
        const dicht = perKolom.reduce((som, k) => som + k.dicht, 0) + gatTussen;
        const langste = Math.max(...perKolom.map((k) => k.langste));
        setMinHoogte(Math.ceil(dicht + langste));
      }
    };

    meet();
    let vorigeBreedte = blok.clientWidth;
    const ro = new ResizeObserver(() => {
      if (blok.clientWidth === vorigeBreedte) return;
      vorigeBreedte = blok.clientWidth;
      meet();
    });
    ro.observe(blok);
    return () => ro.disconnect();
  }, [blokRef]);

  return minHoogte;
}

const FAQSection = () => {
  // Hooguit één vraag tegelijk open; de eerste staat open bij binnenkomst.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const blokRef = useRef<HTMLDivElement>(null);
  useReveal(sectionRef);
  const minHoogte = useVasteHoogte(blokRef);

  const handleToggle = (index: number) => {
    setOpenIndex((huidig) => (huidig === index ? null : index));
  };

  // Twee kolommen op desktop: eerste helft links, tweede helft rechts.
  const helft = Math.ceil(faqs.length / 2);
  const kolommen = [faqs.slice(0, helft), faqs.slice(helft)];

  return (
    <section
      ref={sectionRef}
      className="py-14 md:py-16 bg-secondary/50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Links: kop en tekst */}
          <div className="lg:col-span-4">
            <h2 className="sw-reveal text-3xl md:text-[2.1rem] font-bold tracking-tight mb-3 leading-[1.08]" style={{ color: "hsl(var(--sw-ink))" }}>
              Nog vragen?{" "}
              <span style={{ color: "hsl(var(--sw-green))" }}>Wij hebben antwoorden</span>
            </h2>
            <p className="sw-reveal text-[0.9375rem] font-light leading-relaxed max-w-xs" style={{ color: "hsl(var(--sw-ink) / 0.65)" }}>
              Duidelijke, eerlijke antwoorden zodat je precies weet waar je aan toe bent. Geen verrassingen, alleen resultaat.
            </p>
          </div>

          {/* Rechts: de vragen, op brede schermen in twee kolommen */}
          <div
            ref={blokRef}
            className="lg:col-span-8 grid gap-2 md:grid-cols-2 md:gap-x-3 items-start"
            style={{ minHeight: minHoogte }}
          >
            {kolommen.map((kolom, k) => (
              <div key={k} className="flex flex-col gap-2">
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
      </div>
    </section>
  );
};

export default FAQSection;
