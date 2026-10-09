import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { TelefoonFoto } from "@/data/caseMockups";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Totale verschuiving van de parallax, als deel van de kaderhoogte. */
const BEWEGING = 0.16;

/**
 * Linkerkolom van de case: de telefoonfoto. Mobiel volle breedte, op desktop
 * halve breedte en 110vh hoog (sticky).
 *
 * De foto is altijd precies zo breed als de kolom, in zijn eigen verhouding:
 * nooit ingezoomd, gerekt of geknepen, ook niet bij een smal en hoog venster.
 * De foto is staand (9:16), zodat hij op halve breedte hoog genoeg is voor
 * 110vh; is het venster daarvoor te smal, dan wordt het kader lager in plaats
 * van dat de foto inzoomt. Binnen de speling staat de telefoon in het midden en
 * schuift de foto met GSAP ScrollTrigger langzaam mee (parallax). Zonder
 * animatie (reduced motion) staat hij stil op die middenpositie.
 */
const CaseTelefoon = ({ foto, alt }: { foto: TelefoonFoto; alt: string }) => {
  const kolomRef = useRef<HTMLDivElement>(null);
  const kaderRef = useRef<HTMLDivElement>(null);
  const fotoRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const kader = kaderRef.current, beeld = fotoRef.current;
        if (!kader || !beeld) return;
        // Ruimte om omhoog en omlaag te schuiven zonder dat er een rand in beeld komt.
        const omhoog = () => Math.min((kader.clientHeight * BEWEGING) / 2, beeld.offsetHeight + beeld.offsetTop - kader.clientHeight);
        const omlaag = () => Math.min((kader.clientHeight * BEWEGING) / 2, -beeld.offsetTop);
        gsap.fromTo(
          beeld,
          { y: () => -Math.max(0, omhoog()) },
          {
            y: () => Math.max(0, omlaag()),
            ease: "none",
            scrollTrigger: { trigger: kolomRef.current, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: kolomRef },
  );

  // Fotohoogte en telefoonmidden in cqw (procent van de kolombreedte).
  const hoogte = (foto.hoogte / foto.breedte) * 100;
  const stijl = { "--foto-h": `${hoogte}cqw`, "--telefoon-y": `${hoogte * foto.midden}cqw` } as CSSProperties;

  return (
    <div ref={kolomRef} className="case-telefoon relative w-full lg:w-1/2 shrink-0" style={stijl}>
      <div ref={kaderRef} className="case-telefoon-kader relative overflow-hidden lg:sticky lg:top-0">
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
        /* Mobiel 4:5; desktop 110vh, maar nooit hoger dan 88% van de foto (speling voor de parallax). */
        .case-telefoon-kader { height: 125cqw; }
        @media (min-width: 1024px) { .case-telefoon-kader { height: min(110vh, calc(var(--foto-h) * 0.88)); } }
        /* Telefoon in het midden van het kader, terwijl de foto het kader altijd blijft bedekken. */
        .case-telefoon-foto { top: clamp(calc(100% - var(--foto-h)), calc(50% - var(--telefoon-y)), 0px); }
      `}</style>
    </div>
  );
};

export default CaseTelefoon;
