import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronsLeftRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useReducedMotion } from "@/lib/reduced-motion";
import oud1200 from "@/assets/voorna/display-oud-1200.webp";
import oud2000 from "@/assets/voorna/display-oud-2000.webp";
import nieuw1200 from "@/assets/voorna/display-nieuw-1200.webp";
import nieuw2000 from "@/assets/voorna/display-nieuw-2000.webp";

/*
 * Voor en na: hetzelfde Studio Display twee keer, met links de verouderde en rechts de
 * nieuwe website van een (fictief) bouwbedrijf. De twee beelden zijn op het
 * scherm na pixel voor pixel gelijk (één Higgsfield-mockup in 4K, met beide
 * schermbeelden er los in gezet en de achtergrond glad op #f5f5f5), dus alleen het scherm verandert onder de
 * schuif. De schuif loopt alleen over het scherm.
 *
 * Bediening: slepen (muis en touch) of het onzichtbare bereikveld met de
 * pijltjestoetsen. Komt de sectie in beeld, dan schuift hij één keer van
 * helemaal oud naar het midden, zodat je ziet dat er iets te schuiven valt.
 */

// Het scherm in de uitsnede, in procenten van het beeld (2900×2100 bron).
const SCHERM = { links: 6.83, rechts: 93.14, boven: 7.05, onder: 73.71 };
const ACHTERGROND = "#f5f5f5";
const SRC_SET = (klein: string, groot: string) => `${klein} 1200w, ${groot} 2000w`;
const SIZES = "(min-width: 1280px) 1100px, 92vw";

const klem = (v: number) => Math.min(SCHERM.rechts, Math.max(SCHERM.links, v));

const VoorNaSectie = () => {
  const reduced = useReducedMotion();
  const vlakRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(SCHERM.rechts);
  const aangeraakt = useRef(false);
  const slepen = useRef(false);
  const [focus, setFocus] = useState(false);

  // Eén keer van helemaal oud naar het midden zodra de sectie in beeld komt.
  useEffect(() => {
    const vlak = vlakRef.current;
    if (!vlak) return;
    const midden = (SCHERM.links + SCHERM.rechts) / 2;
    if (reduced) {
      setPos(midden);
      return;
    }
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const van = SCHERM.rechts;
        const duur = 1400;
        const stap = (nu: number) => {
          if (aangeraakt.current) return;
          const t = Math.min(1, (nu - start) / duur);
          const e2 = 1 - Math.pow(1 - t, 3);
          setPos(van + (midden - van) * e2);
          if (t < 1) frame = requestAnimationFrame(stap);
        };
        frame = requestAnimationFrame(stap);
      },
      { threshold: 0.5 },
    );
    io.observe(vlak);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const naarPunt = (clientX: number) => {
    const r = vlakRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(klem(((clientX - r.left) / r.width) * 100));
  };

  const omlaag = (e: ReactPointerEvent<HTMLDivElement>) => {
    aangeraakt.current = true;
    slepen.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    naarPunt(e.clientX);
  };
  const beweeg = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (slepen.current) naarPunt(e.clientX);
  };
  const los = () => {
    slepen.current = false;
  };

  // Bereikveld van 0 tot 100 over de schermbreedte.
  const bereik = Math.round(((pos - SCHERM.links) / (SCHERM.rechts - SCHERM.links)) * 100);

  return (
    <section className="py-16 md:py-24" style={{ background: ACHTERGROND }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <Reveal afstand={20}>
            <h2
              className="max-w-4xl text-4xl font-bold tracking-tight sw-ink md:text-5xl lg:text-6xl"
              style={{ lineHeight: 1.02 }}
            >
              Van verouderd naar{" "}
              <span style={{ color: "hsl(var(--sw-green))" }}>vindbaar</span>
            </h2>
          </Reveal>
          <Reveal afstand={20} delay={0.06}>
            <p
              className="mt-6 max-w-2xl text-lg font-light leading-relaxed md:text-xl"
              style={{ color: "hsl(var(--sw-ink) / 0.65)" }}
            >
              Sleep over het scherm en zie het verschil. Hetzelfde bedrijf, maar een website die
              vertrouwen wekt en bezoekers omzet in aanvragen.
            </p>
          </Reveal>
        </div>

        <Reveal afstand={30}>
          <div className="mx-auto max-w-[1100px]">
            <div
              ref={vlakRef}
              className="relative cursor-ew-resize touch-pan-y select-none"
              style={{ aspectRatio: "2000 / 1448" }}
              onPointerDown={omlaag}
              onPointerMove={beweeg}
              onPointerUp={los}
              onPointerCancel={los}
            >
              {/* Nieuw onderop, oud erboven en rechts weggeknipt. */}
              <img
                src={nieuw2000}
                srcSet={SRC_SET(nieuw1200, nieuw2000)}
                sizes={SIZES}
                width={2000}
                height={1448}
                alt="Hetzelfde beeldscherm met de nieuwe, moderne website van het bouwbedrijf"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full"
              />
              <img
                src={oud2000}
                srcSet={SRC_SET(oud1200, oud2000)}
                sizes={SIZES}
                width={2000}
                height={1448}
                alt="Beeldscherm met de verouderde website van een bouwbedrijf"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              />

              {/* Labels in de onderhoeken van het scherm (bovenin zit de navigatie van de sites) */}
              <span
                className="pointer-events-none absolute rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white transition-opacity duration-300 md:text-xs"
                style={{
                  left: `calc(${SCHERM.links}% + 10px)`,
                  bottom: `calc(${100 - SCHERM.onder}% + 10px)`,
                  opacity: pos - SCHERM.links > 14 ? 1 : 0,
                }}
              >
                Oud
              </span>
              <span
                className="pointer-events-none absolute rounded-full px-3 py-1 text-[11px] font-medium text-white transition-opacity duration-300 md:text-xs"
                style={{
                  right: `calc(${100 - SCHERM.rechts}% + 10px)`,
                  bottom: `calc(${100 - SCHERM.onder}% + 10px)`,
                  background: "hsl(var(--sw-green))",
                  opacity: SCHERM.rechts - pos > 14 ? 1 : 0,
                }}
              >
                Nieuw
              </span>

              {/* De schuif: een lijn over het scherm met een greep in het midden */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute w-0.5 -translate-x-1/2 bg-white"
                style={{
                  left: `${pos}%`,
                  top: `${SCHERM.boven}%`,
                  height: `${SCHERM.onder - SCHERM.boven}%`,
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 0 18px rgba(0,0,0,0.25)",
                }}
              >
                <span
                  className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg md:h-12 md:w-12"
                  style={{
                    color: "hsl(var(--sw-green))",
                    outline: focus ? "3px solid hsl(var(--sw-green))" : "none",
                    outlineOffset: 3,
                  }}
                >
                  <ChevronsLeftRight className="h-5 w-5" />
                </span>
              </div>

              {/* Toetsenbord en schermlezers */}
              <input
                type="range"
                min={0}
                max={100}
                value={bereik}
                onChange={(e) => {
                  aangeraakt.current = true;
                  const v = Number(e.target.value);
                  setPos(SCHERM.links + (v / 100) * (SCHERM.rechts - SCHERM.links));
                }}
                aria-label="Vergelijk de oude en de nieuwe website"
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                style={{ pointerEvents: "none" }}
              />
            </div>
            <p className="mt-4 text-center text-sm" style={{ color: "hsl(var(--sw-ink) / 0.5)" }}>
              Voorbeeld met een fictief bouwbedrijf
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default VoorNaSectie;
