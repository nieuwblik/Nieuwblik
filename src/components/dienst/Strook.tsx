import { useEffect, useState, type ReactNode } from "react";

const RAND = "hsl(var(--sw-rule) / 0.14)";
const ACCENTLIJN = "linear-gradient(90deg, transparent, hsl(var(--sw-green)), transparent)";

export interface StrookItem {
  titel: string;
  /** Korte regel in het groen onder de titel (optioneel). */
  sub?: ReactNode | undefined;
  tekst: ReactNode;
}

/**
 * Een rij punten tussen twee haarlijnen, zoals de kerncijfers op de analysepagina.
 * Op desktop licht er om de beurt één op en schuift een groen stukje lijn mee;
 * aanwijzen houdt dat punt vast. Op mobiel en bij "minder beweging" staat alles
 * gewoon vol in beeld.
 */
export function Strook({ items }: { items: StrookItem[] }) {
  const [actief, setActief] = useState(0);
  const [vast, setVast] = useState(false);
  const [wisselt, setWisselt] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    setWisselt(true);
    if (vast) return;
    const id = window.setInterval(() => setActief((i) => (i + 1) % items.length), 2800);
    return () => window.clearInterval(id);
  }, [vast, items.length]);

  const kolommen = items.length >= 4 ? "lg:grid-cols-4" : items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  const breedte = `${100 / Math.min(items.length, 4)}%`;

  return (
    <div className="relative border-y" style={{ borderColor: RAND }}>
      {wisselt &&
        items.length <= 4 &&
        ["-top-px", "-bottom-px"].map((plek) => (
          <span
            key={plek}
            aria-hidden="true"
            className={`absolute left-0 h-px transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${plek}`}
            style={{ width: breedte, background: ACCENTLIJN, transform: `translateX(${actief * 100}%)` }}
          />
        ))}
      <div className={`grid cursor-default grid-cols-1 sm:grid-cols-2 ${kolommen}`} onMouseLeave={() => setVast(false)}>
        {items.map(({ titel, sub, tekst }, i) => (
          <div key={titel} className="flex flex-col items-center px-4 py-10 text-center lg:py-14">
            <div
              onMouseEnter={() => {
                setVast(true);
                setActief(i);
              }}
              className="max-w-[30ch] transition-opacity duration-500"
              style={{ opacity: wisselt && i !== actief ? 0.45 : 1 }}
            >
              <h3
                className="text-2xl !font-normal leading-tight sw-ink md:text-[1.75rem]"
                style={{ letterSpacing: "-0.03em" }}
              >
                {titel}
              </h3>
              {sub && (
                <p className="mt-2 text-sm font-semibold" style={{ color: "hsl(var(--sw-green))" }}>
                  {sub}
                </p>
              )}
              <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: "hsl(var(--sw-ink) / 0.75)" }}>
                {tekst}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
