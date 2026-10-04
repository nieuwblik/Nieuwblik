import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronsLeftRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/lib/reduced-motion";
import oud1200 from "@/assets/voorna/display-oud-1200.webp";
import oud2000 from "@/assets/voorna/display-oud-2000.webp";
import nieuw1200 from "@/assets/voorna/display-nieuw-1200.webp";
import nieuw2000 from "@/assets/voorna/display-nieuw-2000.webp";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Voor en na: hetzelfde Studio Display twee keer, met links de verouderde en
 * rechts de nieuwe website van een (fictieve) yogastudio. De twee beelden zijn
 * op het scherm na pixel voor pixel gelijk (één Higgsfield-mockup in 4K met
 * beide schermbeelden er los in gezet), dus alleen het scherm verandert.
 *
 * Animatie (GSAP ScrollTrigger, gekoppeld aan de scroll, ook terug):
 *  1. De sectie zet zich vast; je begint ingezoomd op de oude site, die het
 *     beeld vult.
 *  2. De camera zoomt uit tot je het hele beeldscherm ziet; kop en tekst
 *     komen erboven in beeld.
 *  3. De nieuwe site schuift over de oude heen.
 *  4. De sectie laat los; daarna kun je zelf slepen (muis, touch) of de
 *     pijltjestoetsen gebruiken.
 * De schuifstand staat in de CSS-variabele --pos (procenten van het beeld),
 * zodat scrollen en slepen geen React-renders per beeldje kosten.
 * Met prefers-reduced-motion: geen vastzetten of zoom, schuif in het midden.
 */

// Het scherm in de uitsnede, in procenten van het beeld (2900×2100 bron).
const SCHERM = { links: 6.83, rechts: 93.14, boven: 7.05, onder: 73.71 };
const MIDDEN_X = (SCHERM.links + SCHERM.rechts) / 2;
const MIDDEN_Y = (SCHERM.boven + SCHERM.onder) / 2;
const ACHTERGROND = "#f5f5f5";
const SRC_SET = (klein: string, groot: string) =>
  `${klein} 1200w, ${groot} 2000w`;
const SIZES = "(min-width: 1280px) 1100px, 92vw";
// Breedte van het scherm: past altijd met kop en bijschrift in één schermhoogte.
const BREEDTE = "min(1100px, 92vw, calc((100svh - 300px) * 1.381))";

const klem = (v: number) => Math.min(SCHERM.rechts, Math.max(SCHERM.links, v));
const naarBereik = (v: number) =>
  Math.round(((v - SCHERM.links) / (SCHERM.rechts - SCHERM.links)) * 100);

const VoorNaSectie = () => {
  const reduced = useReducedMotion();
  const sectieRef = useRef<HTMLElement>(null);
  const podiumRef = useRef<HTMLDivElement>(null);
  const kopRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const vlakRef = useRef<HTMLDivElement>(null);
  const greepRef = useRef<HTMLDivElement>(null);
  const bijschriftRef = useRef<HTMLParagraphElement>(null);
  const bereikRef = useRef<HTMLInputElement>(null);
  const slepen = useRef(false);
  const [focus, setFocus] = useState(false);

  const zetPos = (v: number) => {
    const p = klem(v);
    vlakRef.current?.style.setProperty("--pos", String(p));
    if (bereikRef.current) bereikRef.current.value = String(naarBereik(p));
  };

  // Beginstand: helemaal oud (met animatie) of het midden (zonder).
  useEffect(() => {
    zetPos(reduced ? MIDDEN_X : SCHERM.rechts);
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return;
      const podium = podiumRef.current;
      const camera = cameraRef.current;
      const vlak = vlakRef.current;
      if (!podium || !camera || !vlak) return;

      // Zo ver inzoomen dat het scherm van het beeldscherm het beeld vult.
      // offsetWidth/-Height negeren transforms, dus dit klopt ook als de
      // tijdlijn al halverwege staat.
      const startSchaal = () => {
        const sw = (vlak.offsetWidth * (SCHERM.rechts - SCHERM.links)) / 100;
        const sh = (vlak.offsetHeight * (SCHERM.onder - SCHERM.boven)) / 100;
        return Math.max(
          1,
          Math.min(window.innerWidth / sw, window.innerHeight / sh),
        );
      };
      // Het midden van het scherm naar het midden van het beeld schuiven.
      const startY = () =>
        window.innerHeight / 2 -
        (camera.offsetTop + (vlak.offsetHeight * MIDDEN_Y) / 100);

      const stand = { p: SCHERM.rechts };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: podium,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        camera,
        { scale: startSchaal, y: startY },
        { scale: 1, y: 0, ease: "power2.inOut", duration: 1 },
        0,
      )
        .fromTo(
          kopRef.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.35 },
          0.65,
        )
        .fromTo(
          bijschriftRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25 },
          0.85,
        )
        .fromTo(
          greepRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.2 },
          0.95,
        )
        .fromTo(
          stand,
          { p: SCHERM.rechts },
          {
            p: SCHERM.links,
            duration: 1.2,
            ease: "power1.inOut",
            onUpdate: () => zetPos(stand.p),
          },
          1.1,
        )
        .to({}, { duration: 0.25 });

      // De sectie laadt lazy en de secties erboven ook: als de pagina daarna
      // langer wordt, moeten de scrollposities opnieuw worden gemeten.
      let wacht = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(wacht);
        wacht = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      });
      ro.observe(document.body);
      return () => {
        ro.disconnect();
        window.clearTimeout(wacht);
      };
    },
    { scope: sectieRef, dependencies: [reduced] },
  );

  const naarPunt = (clientX: number) => {
    const r = vlakRef.current?.getBoundingClientRect();
    if (!r) return;
    zetPos(((clientX - r.left) / r.width) * 100);
  };
  const omlaag = (e: ReactPointerEvent<HTMLDivElement>) => {
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

  return (
    <section ref={sectieRef} style={{ background: ACHTERGROND }}>
      <div
        ref={podiumRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-14 sm:px-6"
      >
        <div ref={kopRef} className="relative z-0 mb-8 text-center md:mb-10">
          <h2
            className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sw-ink md:text-5xl lg:text-6xl"
            style={{ lineHeight: 1.02 }}
          >
            Van verouderd naar{" "}
            <span style={{ color: "hsl(var(--sw-green))" }}>vindbaar</span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed md:text-xl"
            style={{ color: "hsl(var(--sw-ink) / 0.65)" }}
          >
            Sleep over het scherm en zie het verschil. Hetzelfde bedrijf, maar
            een website die vertrouwen wekt en bezoekers omzet in aanvragen.
          </p>
        </div>

        <div
          ref={cameraRef}
          className="relative z-10 will-change-transform"
          style={{
            width: BREEDTE,
            transformOrigin: `${MIDDEN_X}% ${MIDDEN_Y}%`,
          }}
        >
          <div
            ref={vlakRef}
            className="relative cursor-ew-resize touch-pan-y select-none"
            // Beginwaarde voor --pos al in de HTML; daarna zet zetPos() hem.
            style={
              {
                aspectRatio: "2000 / 1448",
                "--pos": SCHERM.rechts,
              } as CSSProperties
            }
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
              alt="Hetzelfde beeldscherm met de nieuwe, moderne website van de yogastudio"
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
              alt="Beeldscherm met de verouderde website van een yogastudio"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full"
              style={{ clipPath: "inset(0 calc(100% - var(--pos) * 1%) 0 0)" }}
            />

            {/* Labels in de onderhoeken van het scherm; ze verdwijnen als hun kant bijna dicht is */}
            <span
              className="pointer-events-none absolute rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white md:text-xs"
              style={{
                left: `calc(${SCHERM.links}% + 10px)`,
                bottom: `calc(${100 - SCHERM.onder}% + 10px)`,
                opacity: `clamp(0, calc((var(--pos) - ${SCHERM.links + 8}) / 6), 1)`,
              }}
            >
              Oud
            </span>
            <span
              className="pointer-events-none absolute rounded-full px-3 py-1 text-[11px] font-medium text-white md:text-xs"
              style={{
                right: `calc(${100 - SCHERM.rechts}% + 10px)`,
                bottom: `calc(${100 - SCHERM.onder}% + 10px)`,
                background: "hsl(var(--sw-green))",
                opacity: `clamp(0, calc((${SCHERM.rechts - 8} - var(--pos)) / 6), 1)`,
              }}
            >
              Nieuw
            </span>

            {/* De schuif: een lijn over het scherm met een greep in het midden */}
            <div
              ref={greepRef}
              aria-hidden="true"
              className="pointer-events-none absolute w-0.5 -translate-x-1/2 bg-white"
              style={{
                left: "calc(var(--pos) * 1%)",
                top: `${SCHERM.boven}%`,
                height: `${SCHERM.onder - SCHERM.boven}%`,
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.08), 0 0 18px rgba(0,0,0,0.25)",
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
              ref={bereikRef}
              type="range"
              min={0}
              max={100}
              defaultValue={reduced ? 50 : 100}
              onInput={(e) => {
                const v = Number(e.currentTarget.value);
                zetPos(
                  SCHERM.links + (v / 100) * (SCHERM.rechts - SCHERM.links),
                );
              }}
              aria-label="Vergelijk de oude en de nieuwe website"
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        <p
          ref={bijschriftRef}
          className="relative z-0 mt-5 text-center text-sm"
          style={{ color: "hsl(var(--sw-ink) / 0.5)" }}
        >
          Voorbeeld met een fictieve yogastudio
        </p>
      </div>
    </section>
  );
};

export default VoorNaSectie;
