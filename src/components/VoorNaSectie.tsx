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
 * Animatie (GSAP ScrollTrigger, gekoppeld aan de scroll, ook terug):
 *  1. De sectie staat kort vast; de nieuwe site valt in tien verticale
 *     lamellen van links naar rechts over de oude heen, als een jaloezie.
 *  2. Daarna kun je zelf slepen (muis, touch) of de pijltjestoetsen gebruiken.
 * De schuifstand staat in de CSS-variabele --pos (procenten van het scherm),
 * zodat scrollen en slepen geen React-renders per beeldje kosten.
 * Met prefers-reduced-motion: geen vastzetten of lamellen, schuif in het midden.
 */

// Het scherm in het displaybeeld, in procenten (2900×2100 bron).
const SCHERM = { links: 6.83, rechts: 93.14, boven: 7.05, onder: 73.71 };
const ACHTERGROND = "#f5f5f5";
const DISPLAY_SIZES = "(min-width: 1280px) 1100px, 92vw";
const SCHERM_SIZES = "(min-width: 1280px) 950px, 80vw";
// Breedte van het display: past altijd met kop en bijschrift in één schermhoogte.
const BREEDTE = "min(1100px, 92vw, calc((100svh - 300px) * 1.381))";

// Aantal lamellen.
const LAMELLEN = Array.from({ length: 10 }, (_, i) => i);

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
  const lamellenRef = useRef<HTMLDivElement>(null);
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

  // De lamellen tonen dezelfde afbeelding die de browser via srcset voor de
  // nieuwe site koos (uit de cache), pas als die geladen is.
  const vulLamellen = () => {
    const bron = nieuwRef.current?.currentSrc;
    if (!bron || !lamellenRef.current) return;
    lamellenRef.current
      .querySelectorAll<HTMLElement>("[data-binnen]")
      .forEach((el) => (el.style.backgroundImage = `url("${bron}")`));
  };

  // Beginstand: helemaal oud (met animatie) of het midden (zonder).
  useEffect(() => {
    zetPos(reduced ? 50 : 100);
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return;
      const podium = podiumRef.current;
      const laag = lamellenRef.current;
      if (!podium || !laag) return;
      const lamellen = gsap.utils.toArray<HTMLElement>("[data-lamel]", laag);
      const binnen = gsap.utils.toArray<HTMLElement>("[data-binnen]", laag);
      if (nieuwRef.current?.complete) vulLamellen();

      // Als alle lamellen hangen, springt de schuif eronder naar 'nieuw' en
      // verdwijnen de lamellen: er verspringt niets. Een tween in plaats van
      // een call, zodat terugscrollen hem ook terugzet.
      const stand = { p: 100 };
      gsap
        .timeline({
          scrollTrigger: {
            trigger: podium,
            start: "top top",
            end: "+=80%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Vangnet: de load van de afbeelding kan al vóór de hydratatie vallen.
            onToggle: vulLamellen,
          },
        })
        .fromTo(greepRef.current, { autoAlpha: 0 }, { autoAlpha: 0 }, 0)
        .fromTo(laag, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0)
        // Alleen transforms (geen clip-path): de lamel zakt, het beeld erin
        // gaat even ver omhoog en staat dus stil. Dat rekent de GPU, zonder
        // dat de site per frame opnieuw getekend wordt.
        .fromTo(
          lamellen,
          { yPercent: -100 },
          { yPercent: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.06 },
          0.02,
        )
        .fromTo(
          binnen,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.06 },
          0.02,
        )
        .fromTo(
          stand,
          { p: 100 },
          { p: 0, duration: 0.01, onUpdate: () => zetPos(stand.p) },
        )
        .to(laag, { autoAlpha: 0, duration: 0.01 })
        .to(greepRef.current, { autoAlpha: 1, duration: 0.12 })
        .to({}, { duration: 0.1 });

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
              ref={nieuwRef}
              {...BRON.nieuw}
              sizes={SCHERM_SIZES}
              width={2400}
              height={1342}
              alt="De nieuwe, moderne website van de yogastudio"
              loading="lazy"
              decoding="async"
              draggable={false}
              onLoad={vulLamellen}
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

            {/* De lamellen: alleen zichtbaar tijdens de overgang. Elke lamel is
                een verticale strook van de nieuwe site. */}
            {!reduced && (
              <div
                ref={lamellenRef}
                aria-hidden="true"
                className="invisible absolute inset-0 z-10"
              >
                {LAMELLEN.map((i) => (
                  <div
                    key={i}
                    data-lamel=""
                    className="absolute inset-y-0 overflow-hidden will-change-transform"
                    style={{
                      left: `${(i * 100) / LAMELLEN.length}%`,
                      width: `calc(${100 / LAMELLEN.length}% + 0.5px)`,
                    }}
                  >
                    {/* Achtergrond in plaats van een img van 1000% breed:
                        zo blijft elke laag zo groot als zijn strook. */}
                    <div
                      data-binnen=""
                      className="absolute inset-0 bg-no-repeat will-change-transform"
                      style={{
                        backgroundSize: `${LAMELLEN.length * 100}% 100%`,
                        backgroundPosition: `${(i / (LAMELLEN.length - 1)) * 100}% 0%`,
                      }}
                    />
                  </div>
                ))}
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
