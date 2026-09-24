import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface BenefitItem {
  h3: string;
  text: string;
}

interface BenefitListProps {
  h2: string;
  /** Optionele zin onder de kop, in de linkerkolom. */
  intro?: string;
  items: BenefitItem[];
  /** Achtergrond van de sectie; de pagina bepaalt het ritme. */
  className?: string;
  /** Extra blok onder de lijst, in dezelfde rechterkolom. */
  children?: React.ReactNode;
}

/**
 * "Waarom Nieuwblik"-sectie van de regionale pagina's.
 *
 * Stond hier eerst als drie identieke witte kaartjes op een grijs vlak, met
 * alles gecentreerd. Dat is het meest voorspelbare blok dat er bestaat en het
 * viel op geen enkele pagina op. Nu: de kop links (blijft staan bij het
 * scrollen), de punten rechts als genummerde regels met haarlijnen ertussen.
 * Geen doosjes, geen iconen, wel contrast tussen het zwart van de koppen en
 * het groen van de nummers.
 *
 * Werkt met drie punten (stadspagina's) net zo goed als met zes (branches).
 */
const BenefitList = ({
  h2,
  intro,
  items,
  className,
  children,
}: BenefitListProps) => (
  <section className={cn("py-20 md:py-28", className)}>
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-foreground text-balance">
              {h2}
            </h2>
            {intro && (
              <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
                {intro}
              </p>
            )}
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <ol className="border-t border-border">
            {items.map((item, idx) => (
              <Reveal
                as="li"
                key={item.h3}
                delay={idx * 0.08}
                afstand={16}
                className="grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-8 border-b border-border py-7 md:py-9"
              >
                <span
                  aria-hidden="true"
                  className="text-2xl md:text-[2rem] font-black leading-none text-accent tabular-nums"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold leading-snug text-foreground">
                    {item.h3}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed max-w-[62ch]">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
          {children}
        </div>
      </div>
    </div>
  </section>
);

export default BenefitList;
