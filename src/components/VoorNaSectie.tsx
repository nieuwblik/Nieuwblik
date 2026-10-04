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
import Reveal from "@/components/Reveal";
import { useReducedMotion } from "@/lib/reduced-motion";
import display1200 from "@/assets/voorna/display-leeg-1200.webp";
import display2000 from "@/assets/voorna/display-leeg-2000.webp";
import oud1200 from "@/assets/voorna/scherm-oud-1200.webp";
import oud2400 from "@/assets/voorna/scherm-oud-2400.webp";
import nieuw1200 from "@/assets/voorna/scherm-nieuw-1200.webp";
import nieuw2400 from "@/assets/voorna/scherm-nieuw-2400.webp";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Voor en na: een Studio Display (Higgsfield-mockup in 4K) met in het scherm
 * de verouderde en de nieuwe website van een (fictieve) yogastudio. Display en
 * sites zijn losse lagen, zodat alleen het scherm verandert.
 *
 * Animatie (GSAP ScrollTrigger, gekoppeld aan de scroll, ook terug), naar het
 * puzzeleffect uit "Animated Product Grid Preview" (Codrops):
 *  1. De sectie staat kort vast; de oude site valt uiteen in 3×2 kaarten met
 *     zwarte voegen ertussen.
 *  2. De kaarten van de nieuwe site schuiven als puzzelstukjes naar binnen en
 *     sluiten naadloos aan.
 *  3. Daarna kun je zelf slepen (muis, touch) of de pijltjestoetsen gebruiken.
 * De schuifstand staat in de CSS-variabele --pos (procenten van het scherm),
 * zodat scrollen en slepen geen React-renders per beeldje kosten.
 * Met prefers-reduced-motion: geen vastzetten of puzzel, schuif in het midden.
 */

// Het scherm in het displaybeeld, in procenten (2900×2100 bron).
const SCHERM = { links: 6.83, rechts: 93.14, boven: 7.05, onder: 73.71 };
const ACHTERGROND = "#f5f5f5";
const DISPLAY_SIZES = "(min-width: 1280px) 1100px, 92vw";
const SCHERM_SIZES = "(min-width: 1280px) 950px, 80vw";
// Breedte van het display: past altijd met kop en bijschrift in één schermhoogte.
const BREEDTE = "min(1100px, 92vw, calc((100svh - 300px) * 1.381))";

// De puzzel: kolommen × rijen, en hoe klein de kaarten worden als ze los liggen.
const KOLOMMEN = 3;
const RIJEN = 2;
const LOS = 0.88;
const KAARTEN = Array.from({ length: KOLOMMEN * RIJEN }, (_, i) => ({
  x: i % KOLOMMEN,
  y: Math.floor(i / KOLOMMEN),
}));
// Hoe ver een nieuwe kaart naar buiten ligt voor hij aansluit (procent van
// zijn eigen maat), weg van het midden van het scherm.
const uitX = (x: number) => ((x + 0.5) / KOLOMMEN - 0.5) * 2 * 10;
const uitY = (y: number) => ((y + 0.5) / RIJEN - 0.5) * 2 * 10;

const BRON = {
  oud: { src: oud2400, srcSet: `${oud1200} 1200w, ${oud2400} 2400w` },
  nieuw: { src: nieuw2400, srcSet: `${nieuw1200} 1200w, ${nieuw2400} 2400w` },
};

const klem = (v: number) => Math.min(100, Math.max(0, v));

const VoorNaSectie = () => {
  const reduced = useReducedMotion();
  const sectieRef = useRef<HTMLElement>(null);
  const podiumRef = useRef<HTMLDivElement>(null);
  const schermRef = useRef<HTMLDivElement>(null);
  const puzzelRef = useRef<HTMLDivElement>(null);
  const greepRef = useRef<HTMLDivElement>(null);
  const bereikRef = useRef<HTMLInputElement>(null);
  const slepen = useRef(false);
  const [focus, setFocus] = useState(false);

  const zetPos = (v: number) => {
    const p = klem(v);
    schermRef.current?.style.setProperty("--pos", String(p));
    if (bereikRef.current) bereikRef.current.value = String(Math.round(p));
  };

  // Beginstand: helemaal oud (met animatie) of het midden (zonder).
  useEffect(() => {
    zetPos(reduced ? 50 : 100);
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return;
      const podium = podiumRef.current;
      const puzzel = puzzelRef.current;
      if (!podium || !puzzel) return;
      const oud = gsap.utils.toArray<HTMLElement>("[data-kaart='oud']", puzzel);
      const nieuw = gsap.utils.toArray<HTMLElement>(
        "[data-kaart='nieuw']",
        puzzel,
      );
      const volgorde = {
        each: 0.05,
        from: "center" as const,
        grid: [RIJEN, KOLOMMEN] as [number, number],
      };

      // Onder de puzzel springt de schuif alvast naar 'nieuw', zodat er na
      // afloop niets verspringt. Een tween in plaats van een call, zodat
      // terugscrollen hem ook terugzet.
      const stand = { p: 100 };
      gsap
        .timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: podium,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(greepRef.current, { autoAlpha: 0 }, { autoAlpha: 0 }, 0)
        .fromTo(puzzel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0)
        // 1. Oud valt uiteen in kaarten.
        .fromTo(
          oud,
          { scale: 1, borderRadius: 0, autoAlpha: 1 },
          { scale: LOS, borderRadius: 10, duration: 0.4, stagger: volgorde },
          0.02,
        )
        .to(oud, { autoAlpha: 0, duration: 0.2, stagger: volgorde }, 0.38)
        .fromTo(
          stand,
          { p: 100 },
          { p: 0, duration: 0.01, onUpdate: () => zetPos(stand.p) },
          0.5,
        )
        // 2. Nieuw schuift als puzzelstukjes naar binnen.
        .fromTo(
          nieuw,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.2, stagger: volgorde },
          0.38,
        )
        .fromTo(
          nieuw,
          {
            scale: LOS,
            borderRadius: 10,
            xPercent: (i: number) => uitX(KAARTEN[i]?.x ?? 1),
            yPercent: (i: number) => uitY(KAARTEN[i]?.y ?? 0),
          },
          {
            scale: 1,
            borderRadius: 0,
            xPercent: 0,
            yPercent: 0,
            duration: 0.55,
            ease: "power3.inOut",
            stagger: volgorde,
          },
          0.38,
        )
        // 3. Naadloos: puzzel weg, schuif erbij.
        .to(puzzel, { autoAlpha: 0, duration: 0.01 })
        .to(greepRef.current, { autoAlpha: 1, duration: 0.12 })
        .to({}, { duration: 0.12 });

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
    const r = schermRef.current?.getBoundingClientRect();
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
        <Reveal afstand={20} className="mb-8 text-center md:mb-10">
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
        </Reveal>

        <div
          className="relative cursor-ew-resize touch-pan-y select-none"
          style={{ width: BREEDTE, aspectRatio: "2000 / 1448" }}
          onPointerDown={omlaag}
          onPointerMove={beweeg}
          onPointerUp={los}
          onPointerCancel={los}
        >
          <img
            src={display2000}
            srcSet={`${display1200} 1200w, ${display2000} 2000w`}
            sizes={DISPLAY_SIZES}
            width={2000}
            height={1448}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full"
          />

          {/* Het scherm met de sites */}
          <div
            ref={schermRef}
            className="absolute overflow-hidden bg-black"
            // Beginwaarde voor --pos al in de HTML; daarna zet zetPos() hem.
            style={
              {
                left: `${SCHERM.links}%`,
                right: `${100 - SCHERM.rechts}%`,
                top: `${SCHERM.boven}%`,
                bottom: `${100 - SCHERM.onder}%`,
                "--pos": 100,
              } as CSSProperties
            }
          >
            {/* Nieuw onderop, oud erboven en rechts weggeknipt. */}
            <img
              {...BRON.nieuw}
              sizes={SCHERM_SIZES}
              width={2400}
              height={1342}
              alt="De nieuwe, moderne website van de yogastudio"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full"
            />
            <img
              {...BRON.oud}
              sizes={SCHERM_SIZES}
              width={2400}
              height={1342}
              alt="De verouderde website van dezelfde yogastudio"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full"
              style={{ clipPath: "inset(0 calc(100% - var(--pos) * 1%) 0 0)" }}
            />

            {/* De puzzel: alleen zichtbaar tijdens de overgang. Elke kaart is
                een uitsnede van de hele site (img op 300% × 200%). */}
            {!reduced && (
              <div
                ref={puzzelRef}
                aria-hidden="true"
                className="invisible absolute inset-0 z-10 bg-black"
              >
                {(["oud", "nieuw"] as const).map((soort) =>
                  KAARTEN.map(({ x, y }) => (
                    <div
                      key={`${soort}-${x}-${y}`}
                      data-kaart={soort}
                      className="absolute overflow-hidden will-change-transform"
                      style={{
                        left: `${(x * 100) / KOLOMMEN}%`,
                        top: `${(y * 100) / RIJEN}%`,
                        width: `calc(${100 / KOLOMMEN}% + 0.5px)`,
                        height: `calc(${100 / RIJEN}% + 0.5px)`,
                        visibility: soort === "nieuw" ? "hidden" : undefined,
                      }}
                    >
                      <img
                        {...BRON[soort]}
                        sizes={SCHERM_SIZES}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute max-w-none"
                        style={{
                          width: `${KOLOMMEN * 100}%`,
                          height: `${RIJEN * 100}%`,
                          left: `${-x * 100}%`,
                          top: `${-y * 100}%`,
                        }}
                      />
                    </div>
                  )),
                )}
              </div>
            )}

            {/* Labels in de onderhoeken; ze verdwijnen als hun kant bijna dicht is */}
            <span
              className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white md:text-xs"
              style={{ opacity: "clamp(0, calc((var(--pos) - 10) / 7), 1)" }}
            >
              Oud
            </span>
            <span
              className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-full px-3 py-1 text-[11px] font-medium text-white md:text-xs"
              style={{
                background: "hsl(var(--sw-green))",
                opacity: "clamp(0, calc((90 - var(--pos)) / 7), 1)",
              }}
            >
              Nieuw
            </span>

            {/* De schuif: een lijn over het scherm met een greep in het midden */}
            <div
              ref={greepRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-white"
              style={{
                left: "calc(var(--pos) * 1%)",
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
              onInput={(e) => zetPos(Number(e.currentTarget.value))}
              aria-label="Vergelijk de oude en de nieuwe website"
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        <p
          className="mt-5 text-center text-sm"
          style={{ color: "hsl(var(--sw-ink) / 0.5)" }}
        >
          Voorbeeld met een fictieve yogastudio
        </p>
      </div>
    </section>
  );
};

export default VoorNaSectie;
