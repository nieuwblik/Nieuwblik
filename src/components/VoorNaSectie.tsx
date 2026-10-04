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
 * sites zijn losse lagen, zodat alleen de site beweegt en het display stil
 * blijft staan.
 *
 * Animatie (GSAP ScrollTrigger, gekoppeld aan de scroll, ook terug):
 *  1. Terwijl de sectie in beeld scrolt, zoomt de oude site in het scherm uit.
 *  2. De sectie staat kort vast en de nieuwe site schuift over de oude heen
 *     (en zoomt zelf ook licht uit).
 *  3. Daarna kun je zelf slepen (muis, touch) of de pijltjestoetsen gebruiken.
 * De schuifstand staat in de CSS-variabele --pos (procenten van het scherm),
 * zodat scrollen en slepen geen React-renders per beeldje kosten.
 * Met prefers-reduced-motion: geen vastzetten of zoom, schuif in het midden.
 */

// Het scherm in het displaybeeld, in procenten (2900×2100 bron).
const SCHERM = { links: 6.83, rechts: 93.14, boven: 7.05, onder: 73.71 };
const ACHTERGROND = "#f5f5f5";
const DISPLAY_SIZES = "(min-width: 1280px) 1100px, 92vw";
const SCHERM_SIZES = "(min-width: 1280px) 950px, 80vw";
// Breedte van het display: past altijd met kop en bijschrift in één schermhoogte.
const BREEDTE = "min(1100px, 92vw, calc((100svh - 300px) * 1.381))";
// Hoe ver de sites ingezoomd beginnen.
const ZOOM_OUD = 1.6;
const ZOOM_NIEUW = 1.15;

const klem = (v: number) => Math.min(100, Math.max(0, v));

const VoorNaSectie = () => {
  const reduced = useReducedMotion();
  const sectieRef = useRef<HTMLElement>(null);
  const podiumRef = useRef<HTMLDivElement>(null);
  const vlakRef = useRef<HTMLDivElement>(null);
  const schermRef = useRef<HTMLDivElement>(null);
  const oudRef = useRef<HTMLImageElement>(null);
  const nieuwRef = useRef<HTMLImageElement>(null);
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
      if (!podium || !oudRef.current || !nieuwRef.current) return;

      // 1. Uitzoomen tijdens het in beeld scrollen: kost geen extra scroll.
      // Begint als het display binnenkomt en is klaar als de sectie vastzet.
      gsap.fromTo(
        oudRef.current,
        { scale: ZOOM_OUD },
        {
          scale: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: vlakRef.current,
            start: "top 95%",
            endTrigger: podium,
            end: "top top",
            scrub: 0.6,
          },
        },
      );

      // 2. Vast en de nieuwe site eroverheen.
      const stand = { p: 100 };
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: podium,
            start: "top top",
            end: "+=90%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          greepRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.1 },
          0,
        )
        .fromTo(
          stand,
          { p: 100 },
          {
            p: 0,
            duration: 1,
            ease: "power1.inOut",
            onUpdate: () => zetPos(stand.p),
          },
          0,
        )
        .fromTo(
          nieuwRef.current,
          { scale: ZOOM_NIEUW },
          { scale: 1, duration: 1, ease: "power2.out" },
          0,
        )
        .to({}, { duration: 0.15 });

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
          ref={vlakRef}
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

          {/* Het scherm: de sites zoomen hierbinnen, het display staat stil. */}
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
            {/* Nieuw onderop, oud erboven en rechts weggeknipt. De knip zit op
                een omhulsel, zodat de zoom van de site hem niet meeschaalt. */}
            <img
              ref={nieuwRef}
              src={nieuw2400}
              srcSet={`${nieuw1200} 1200w, ${nieuw2400} 2400w`}
              sizes={SCHERM_SIZES}
              width={2400}
              height={1342}
              alt="De nieuwe, moderne website van de yogastudio"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full will-change-transform"
              style={{ transformOrigin: "50% 30%" }}
            />
            <div
              className="absolute inset-0"
              style={{ clipPath: "inset(0 calc(100% - var(--pos) * 1%) 0 0)" }}
            >
              <img
                ref={oudRef}
                src={oud2400}
                srcSet={`${oud1200} 1200w, ${oud2400} 2400w`}
                sizes={SCHERM_SIZES}
                width={2400}
                height={1342}
                alt="De verouderde website van dezelfde yogastudio"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full will-change-transform"
                style={{ transformOrigin: "50% 30%" }}
              />
            </div>

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
              className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white"
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
