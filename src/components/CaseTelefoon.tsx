import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { TelefoonFoto } from "@/data/caseMockups";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Standaard scroll-animatie: eindstand 118% ingezoomd en 6% naar rechts (in
 * procenten van de fotobreedte; blijft binnen de zoomspeling van (zoom - 1) / 2).
 * Per foto aan te passen in caseMockups.ts (`effect`), bijvoorbeeld rustiger
 * voor een foto waarin de telefoon al groot in beeld staat.
 */
const STANDAARD = { zoom: 1.18, naarRechts: 6, zoomMobiel: 1.18, naarRechtsMobiel: 6 };

/**
 * Linkerkolom van de case: de telefoonfoto. Mobiel volle breedte, op desktop
 * halve breedte en 110vh hoog (sticky).
 *
 * De foto staat altijd in zijn eigen verhouding: nooit gerekt of geknepen, en ook
 * niet ingezoomd om een smal, hoog kader te vullen. De foto is staand (9:16),
 * zodat hij op halve breedte hoog genoeg is voor 110vh; is het venster daarvoor
 * te smal, dan wordt het kader lager. De telefoon staat in het midden van het kader.
 *
 * Met `schaal` (desktop) is de foto smaller dan de kolom; de rest van de kolom
 * krijgt de kleur van de egale studio-achtergrond (`achtergrond`) en de foto loopt
 * er aan de zijkanten en bovenkant zacht in over. De onderkant (arm) loopt door.
 *
 * Animatie (GSAP ScrollTrigger, meelopend met het scrollen langs de kolom): de
 * foto zoomt gelijkmatig in vanuit het midden van de telefoon en schuift naar
 * rechts, op mobiel naar keuze rustiger. Past de telefoon bij de volle zoom niet
 * meer in het kader, dan zoomt hij minder. Zonder animatie (reduced motion) staat
 * hij stil.
 */
const CaseTelefoon = ({ foto, alt }: { foto: TelefoonFoto; alt: string }) => {
  const kolomRef = useRef<HTMLDivElement>(null);
  const fotoRef = useRef<HTMLImageElement>(null);
  const effect = { ...STANDAARD, ...foto.effect };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const beeld = fotoRef.current;
        if (!beeld) return;
        const desktop = window.matchMedia("(min-width: 1024px)");
        const max = () => (desktop.matches ? effect.zoom : effect.zoomMobiel);
        const rechts = () => (desktop.matches ? effect.naarRechts : effect.naarRechtsMobiel);
        // Zoom zover als past: de telefoon (met wat lucht) blijft altijd in het kader,
        // ook bij een ultrabreed, laag venster. De verschuiving schaalt mee.
        const zoom = () => {
          const kader = beeld.parentElement;
          const telefoon = beeld.offsetHeight * foto.telefoonHoogte;
          if (!kader || !telefoon) return max();
          return Math.max(1, Math.min(max(), (kader.clientHeight * 0.94) / telefoon));
        };
        gsap.fromTo(
          beeld,
          { scale: 1, xPercent: 0 },
          {
            scale: zoom,
            xPercent: () => (max() > 1 ? (rechts() * (zoom() - 1)) / (max() - 1) : 0),
            ease: "none",
            // Klaar zodra de kolom onderaan het venster uitkomt: op desktop is dat het
            // einde van het vastplakken, dus de hele beweging is te zien.
            scrollTrigger: { trigger: kolomRef.current, start: "top bottom", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: kolomRef },
  );

  // Fotohoogte en telefoonmidden in cqw (procent van de kolombreedte), bij volle breedte.
  const hoogte = (foto.hoogte / foto.breedte) * 100;
  const stijl = {
    "--foto-h": `${hoogte}cqw`,
    "--telefoon-y": `${hoogte * foto.midden}cqw`,
    "--telefoon-oorsprong": `${foto.midden * 100}%`,
    "--schaal-desktop": foto.schaal ?? 1,
    ...(foto.achtergrond ? { background: foto.achtergrond } : {}),
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
          data-kleiner={foto.schaal && foto.schaal < 1 ? "ja" : undefined}
          className="case-telefoon-foto absolute h-auto max-w-none will-change-transform"
        />
      </div>
      <style>{`
        .case-telefoon { container-type: inline-size; --s: 1; }
        @media (min-width: 1024px) { .case-telefoon { --s: var(--schaal-desktop); } }
        /* Mobiel 4:5; desktop 110vh, maar nooit hoger dan de foto op volle breedte. */
        .case-telefoon-kader { height: 125cqw; }
        @media (min-width: 1024px) { .case-telefoon-kader { height: min(110vh, var(--foto-h)); } }
        /* Telefoon in het midden van het kader. De foto bedekt het kader zolang hij
           hoog genoeg is; is hij lager (kleinere schaal), dan staat hij onderaan. */
        .case-telefoon-foto {
          width: calc(var(--s) * 100%);
          left: calc((1 - var(--s)) * 50%);
          top: clamp(calc(100% - var(--s) * var(--foto-h)), calc(50% - var(--s) * var(--telefoon-y)), 0px);
          transform-origin: 50% var(--telefoon-oorsprong);
        }
        @media (min-width: 1024px) {
          .case-telefoon-foto[data-kleiner] {
            -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 8%);
            -webkit-mask-composite: source-in;
            mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 8%);
            mask-composite: intersect;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseTelefoon;
