import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/Reveal";
import { FeitKaarten, maakFeitenTijdlijn } from "@/components/voorna/Feiten";
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
 * Animatie (GSAP, één keer zodra het display goed in beeld is, niet
 * vastgezet en niet gekoppeld aan de scroll):
 *  1. De nieuwe site valt in tien verticale lamellen van links naar rechts
 *     over de oude heen, als een jaloezie.
 *  2. Tijdens die overgang poppen drie feitenkaarten op (zie voorna/Feiten).
 * Met prefers-reduced-motion: geen lamellen, meteen de nieuwe site en de
 * kaarten.
 */

// Het scherm in het displaybeeld, in procenten (2900×2100 bron).
const SCHERM = { links: 6.83, rechts: 93.14, boven: 7.05, onder: 73.71 };
const ACHTERGROND = "#f5f5f5";
const DISPLAY_SIZES = "(min-width: 1280px) 1100px, 92vw";
const SCHERM_SIZES = "(min-width: 1280px) 950px, 80vw";
// Breedte van het display: past altijd met de kop in één schermhoogte.
const BREEDTE = "min(1100px, 92vw, calc((100svh - 300px) * 1.381))";

// Aantal lamellen, en hun beeld: de nieuwe site als achtergrond. image-set
// laat de browser zelf de resolutie kiezen (scherpe schermen krijgen 2400).
const LAMELLEN = Array.from({ length: 10 }, (_, i) => i);
const LAMEL_BEELD = `image-set(url("${nieuw1200}") 1x, url("${nieuw2400}") 2x)`;

const BRON = {
  oud: { src: oud2400, srcSet: `${oud1200} 1200w, ${oud2400} 2400w` },
  nieuw: { src: nieuw2400, srcSet: `${nieuw1200} 1200w, ${nieuw2400} 2400w` },
};

const VoorNaSectie = () => {
  const reduced = useReducedMotion();
  const sectieRef = useRef<HTMLElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const lamellenRef = useRef<HTMLDivElement>(null);
  const oudRef = useRef<HTMLDivElement>(null);
  const nieuwLabelRef = useRef<HTMLSpanElement>(null);
  const kaartenRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      const display = displayRef.current;
      const laag = lamellenRef.current;
      if (!display || !laag) return;
      const lamellen = gsap.utils.toArray<HTMLElement>("[data-lamel]", laag);
      const binnen = gsap.utils.toArray<HTMLElement>("[data-binnen]", laag);

      // Eén keer afspelen, op een vast tempo, zodra het display goed in beeld
      // is (zijn midden op 70% van het venster). Geen vastzetten: het scrollen
      // loopt gewoon door. Wie de pagina al voorbij die plek opent, krijgt de
      // animatie meteen.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: display,
          start: "center 70%",
          toggleActions: "play none none none",
          once: true,
        },
      });
      tl.fromTo(laag, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0)
        .fromTo(nieuwLabelRef.current, { autoAlpha: 0 }, { autoAlpha: 0 }, 0)
        // Alleen transforms (geen clip-path): de lamel zakt, het beeld erin
        // gaat even ver omhoog en staat dus stil. Dat rekent de GPU, zonder
        // dat de site per frame opnieuw getekend wordt.
        .fromTo(
          lamellen,
          { yPercent: -100 },
          { yPercent: 0, duration: 0.7, ease: "power3.inOut", stagger: 0.07 },
          0.05,
        )
        .fromTo(
          binnen,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: "power3.inOut", stagger: 0.07 },
          0.05,
        )
        // Als alle lamellen hangen, verdwijnt de oude site eronder. De lamellen
        // blijven staan (zelfde beeld), dus nooit een leeg scherm.
        .set(oudRef.current, { autoAlpha: 0 })
        .to(nieuwLabelRef.current, { autoAlpha: 1, duration: 0.3 });

      // De kaarten poppen op terwijl de lamellen vallen (ongeveer bij de
      // derde lamel), elk op hun eigen manier.
      if (kaartenRef.current) {
        tl.add(maakFeitenTijdlijn(kaartenRef.current).paused(false), 0.35);
      }

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

  return (
    <section ref={sectieRef} style={{ background: ACHTERGROND }}>
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
        <Reveal afstand={20} className="mb-8 text-center md:mb-10">
          <h2
            className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sw-ink md:text-5xl lg:text-6xl"
            style={{ lineHeight: 1.02 }}
          >
            Van verouderd naar{" "}
            <span style={{ color: "hsl(var(--sw-green))" }}>vindbaar</span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-balance text-lg font-light leading-relaxed md:text-xl"
            style={{ color: "hsl(var(--sw-ink) / 0.65)" }}
          >
            Hetzelfde bedrijf, maar een website die vertrouwen wekt en bezoekers
            omzet in aanvragen.
          </p>
        </Reveal>

        {/* Display met de feitenkaarten eromheen (vanaf lg) of eronder. */}
        <div ref={kaartenRef} className="relative" style={{ width: BREEDTE }}>
          <div
            ref={displayRef}
            className="relative w-full"
            style={{ aspectRatio: "2000 / 1448" }}
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
              className="absolute overflow-hidden bg-black"
              style={{
                left: `${SCHERM.links}%`,
                right: `${100 - SCHERM.rechts}%`,
                top: `${SCHERM.boven}%`,
                bottom: `${100 - SCHERM.onder}%`,
              }}
            >
              {/* Nieuw onderop, oud erboven (met label) tot de lamellen hangen. */}
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
              {!reduced && (
                <div ref={oudRef} className="absolute inset-0">
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
                  />
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white md:text-xs">
                    Oud
                  </span>
                </div>
              )}

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
                          backgroundImage: LAMEL_BEELD,
                          backgroundSize: `${LAMELLEN.length * 100}% 100%`,
                          backgroundPosition: `${(i / (LAMELLEN.length - 1)) * 100}% 0%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <span
                ref={nieuwLabelRef}
                className="pointer-events-none absolute bottom-2.5 right-2.5 z-20 rounded-full px-3 py-1 text-[11px] font-medium text-white md:text-xs"
                style={{ background: "hsl(var(--sw-green))" }}
              >
                Nieuw
              </span>
            </div>
          </div>

          <FeitKaarten />
        </div>
      </div>
    </section>
  );
};

export default VoorNaSectie;
