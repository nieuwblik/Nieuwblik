import { useState, useRef, useId, useLayoutEffect, useEffect, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";
import { useReducedMotion } from "@/lib/reduced-motion";
import { useCollapse } from "@/lib/collapse";
import { ALGEMENE_FAQ } from "@/data/algemeneFaq";

const ANTWOORD_MS = 400;
const ANTWOORD_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Ruimte tussen vraag en antwoord als het open is (px). */
const ANTWOORD_MARGE = 10;

const faqs = ALGEMENE_FAQ;

// Op de server bestaat useLayoutEffect niet; daar is meten ook niet nodig.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const FAQCard = ({ item, isOpen, onClick }: { item: typeof faqs[0], isOpen: boolean, onClick: () => void }) => {
  const shouldReduceMotion = useReducedMotion();
  const id = useId();
  const triggerId = `${id}-vraag`;
  const panelId = `${id}-antwoord`;
  const paneelRef = useRef<HTMLDivElement>(null);
  // Antwoord blijft altijd in de DOM (ook dicht), zodat het in de server-HTML
  // staat voor crawlers die geen JavaScript uitvoeren.
  const { hidden, expanded } = useCollapse(isOpen, shouldReduceMotion ? 0 : ANTWOORD_MS);

  // Dicht staat het antwoord op hidden="until-found": niet zichtbaar, maar wel te
  // vinden met zoeken in de pagina. Vindt de browser er iets, dan haalt hij hidden
  // eraf en meldt dat met beforematch; dan zetten we de vraag ook echt open.
  // Safari kent until-found nog niet en behandelt het als gewoon hidden.
  // React kent de waarde until-found niet en schrijft er hidden="" van; daarom
  // zetten we hem zelf, na elke render waarin het paneel dicht is. React raakt
  // het attribuut pas weer aan als het paneel opengaat.
  useEffect(() => {
    const paneel = paneelRef.current;
    if (paneel && hidden) paneel.setAttribute("hidden", "until-found");
  }, [hidden]);

  useEffect(() => {
    const paneel = paneelRef.current;
    if (!paneel) return;
    const gevonden = () => {
      if (!isOpen) onClick();
    };
    paneel.addEventListener("beforematch", gevonden);
    return () => paneel.removeEventListener("beforematch", gevonden);
  }, [isOpen, onClick]);

  return (
    <div>
      <div
        data-faq-kaart=""
        onClick={onClick}
        className={`group relative overflow-hidden rounded-xl cursor-pointer transition-[border-color,box-shadow] duration-300 border ${isOpen
          ? "border-transparent shadow-md"
          : "bg-white border-border/50 hover:border-accent/30 hover:shadow-sm"
          }`}
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, hsl(160 84% 14%) 0%, hsl(160 84% 10%) 50%, hsl(160 70% 8%) 100%)'
            : 'rgb(255, 255, 255)'
        }}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-black/20 transition-opacity duration-400 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />

        <div data-faq-binnen="" className="relative z-10 px-5 py-4 md:px-6 md:py-5">
          {/* De vraag is een echte knop in de kop: bedienbaar met toetsenbord en
              met aria-expanded/aria-controls voor schermlezers. De hele kaart
              blijft daarnaast klikbaar; stopPropagation voorkomt dubbel togglen. */}
          <h3
            className={`text-[0.9375rem] md:text-base font-semibold leading-snug transition-colors duration-300 ${isOpen ? "text-white" : "text-foreground"
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

              <span
                aria-hidden="true"
                className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full border transition-[color,background-color,border-color,rotate] duration-300 motion-reduce:transition-colors ${isOpen
                  ? "rotate-180 bg-white/10 border-white/20 text-white"
                  : "bg-secondary border-transparent text-foreground group-hover:bg-accent group-hover:text-white"
                  }`}
              >
                {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </span>
            </button>
          </h3>

          <div
            ref={paneelRef}
            id={panelId}
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
              <p className="text-[0.9375rem] text-white/80 font-light leading-relaxed pr-6">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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

/** Zonder props de algemene vragen van de homepage. */
const FAQSection = ({
  vragen = faqs,
  intro = "Duidelijke, eerlijke antwoorden zodat je precies weet waar je aan toe bent. Geen verrassingen, alleen resultaat.",
  actie,
  zonderAnimatie = false,
  kop = "Veelgestelde vragen",
}: {
  vragen?: typeof faqs;
  /** Kop van de sectie; stads- en branchepagina's houden hun eigen kop. */
  kop?: string;
  intro?: string;
  /** Onder de intro, bijvoorbeeld een knop. */
  actie?: ReactNode;
  /** Kop en tekst staan er meteen, zonder binnenkomst. */
  zonderAnimatie?: boolean;
}) => {
  // Geen inloop bij het scrollen meer; de prop blijft voor bestaande aanroepen.
  void zonderAnimatie;
  const reveal = "";
  // Hooguit één vraag tegelijk open; de eerste staat open bij binnenkomst.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const blokRef = useRef<HTMLDivElement>(null);
  const minHoogte = useVasteHoogte(blokRef);

  const handleToggle = (index: number) => {
    setOpenIndex((huidig) => (huidig === index ? null : index));
  };

  // Twee kolommen op desktop: eerste helft links, tweede helft rechts.
  const helft = Math.ceil(vragen.length / 2);
  const kolommen = [vragen.slice(0, helft), vragen.slice(helft)];

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-secondary/50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Links: kop en tekst */}
          <div className="lg:col-span-4">
            <h2 className={`${reveal} text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-tight mb-5 leading-[1.05]`} style={{ color: "hsl(var(--sw-ink))" }}>
              {kop}
            </h2>
            <p className={`${reveal} text-base md:text-lg font-light leading-relaxed max-w-sm`} style={{ color: "hsl(var(--sw-ink) / 0.65)" }}>
              {intro}
            </p>
            {actie && <div className={`${reveal} mt-7`}>{actie}</div>}
          </div>

          {/* Rechts: de vragen, op brede schermen in twee kolommen */}
          <div
            ref={blokRef}
            className="lg:col-span-8 grid gap-3 md:grid-cols-2 md:gap-x-4 items-start"
            style={{ minHeight: minHoogte }}
          >
            {kolommen.map((kolom, k) => (
              <div key={k} className="flex flex-col gap-3">
                {kolom.map((faq, i) => {
                  const index = k * helft + i;
                  return (
                    <FAQCard
                      key={index}
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
