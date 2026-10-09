import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { TelefoonFoto } from "@/data/caseMockups";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Eindstand van de scroll-animatie: ingezoomd en een stuk naar rechts. */
const ZOOM = 1.18;
/** Verschuiving naar rechts in procenten van de fotobreedte; blijft binnen de zoomspeling ((ZOOM - 1) / 2 = 9%). */
const NAAR_RECHTS = 6;

/**
 * Linkerkolom van de case: de telefoonfoto. Mobiel volle breedte, op desktop
 * halve breedte en 110vh hoog (sticky).
 *
 * De foto is altijd precies zo breed als de kolom, in zijn eigen verhouding:
 * nooit gerekt of geknepen, en ook niet ingezoomd om een smal, hoog kader te
 * vullen. De foto is staand (9:16), zodat hij op halve breedte hoog genoeg is
 * voor 110vh; is het venster daarvoor te smal, dan wordt het kader lager. De
 * telefoon staat in het midden van het kader.
 *
 * Animatie (GSAP ScrollTrigger, meelopend met het scrollen langs de kolom): de
 * foto zoomt gelijkmatig iets in vanuit het midden van de telefoon en schuift
 * subtiel naar rechts. Inzoomen vanaf 100% houdt het kader altijd bedekt, en de
 * verschuiving blijft binnen de extra breedte die het zoomen oplevert. Zonder
 * animatie (reduced motion) staat hij stil.
 */
const CaseTelefoon = ({ foto, alt }: { foto: TelefoonFoto; alt: string }) => {
  const kolomRef = useRef<HTMLDivElement>(null);
  const fotoRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          fotoRef.current,
          { scale: 1, xPercent: 0 },
          {
            scale: ZOOM,
            xPercent: NAAR_RECHTS,
            ease: "none",
            // Klaar zodra de kolom onderaan het venster uitkomt: op desktop is dat het
            // einde van het vastplakken, dus de hele beweging is te zien.
            scrollTrigger: { trigger: kolomRef.current, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: kolomRef },
  );

  // Fotohoogte en telefoonmidden in cqw (procent van de kolombreedte).
  const hoogte = (foto.hoogte / foto.breedte) * 100;
  const stijl = {
    "--foto-h": `${hoogte}cqw`,
    "--telefoon-y": `${hoogte * foto.midden}cqw`,
    "--telefoon-oorsprong": `${foto.midden * 100}%`,
  } as CSSProperties;

  return (
    <div ref={kolomRef} className="case-telefoon relative w-full lg:w-1/2 shrink-0" style={stijl}>
      <div className="case-telefoon-kader relative overflow-hidden lg:sticky lg:top-0">
        <img
          ref={fotoRef}
          src={foto.src}
          srcSet={foto.srcSet}
          sizes="(min-width: 1024px) 50vw, 100vw"
          width={foto.breedte}
          height={foto.hoogte}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="case-telefoon-foto absolute left-0 w-full h-auto max-w-none will-change-transform"
        />
      </div>
      <style>{`
        .case-telefoon { container-type: inline-size; }
        /* Mobiel 4:5; desktop 110vh, maar nooit hoger dan de foto zelf. */
        .case-telefoon-kader { height: 125cqw; }
        @media (min-width: 1024px) { .case-telefoon-kader { height: min(110vh, var(--foto-h)); } }
        /* Telefoon in het midden van het kader, terwijl de foto het kader altijd blijft bedekken. */
        .case-telefoon-foto {
          top: clamp(calc(100% - var(--foto-h)), calc(50% - var(--telefoon-y)), 0px);
          transform-origin: 50% var(--telefoon-oorsprong);
        }
      `}</style>
    </div>
  );
};

export default CaseTelefoon;
