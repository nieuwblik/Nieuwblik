import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { TelefoonFoto } from "@/data/caseMockups";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Hoeveel de foto meeschuift, in procenten van de (hogere) beeldlaag. */
const VERSCHUIVING = 11.5;

/**
 * Linkerkolom van de case: de telefoonfoto, op desktop halve breedte en 110vh
 * (sticky), mobiel 4:5. Parallax met GSAP ScrollTrigger: de beeldlaag is hoger
 * dan het kader en schuift langzaam mee terwijl je langs de kolom scrolt. Het
 * beeld schuift alleen verticaal en wordt nooit geschaald of vervormd. Zonder
 * animatie (reduced motion) staat de foto gewoon stil in het midden.
 */
const CaseTelefoon = ({ foto, alt }: { foto: TelefoonFoto; alt: string }) => {
  const kolomRef = useRef<HTMLDivElement>(null);
  const laagRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          laagRef.current,
          { yPercent: -VERSCHUIVING },
          {
            yPercent: VERSCHUIVING,
            ease: "none",
            scrollTrigger: { trigger: kolomRef.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: kolomRef },
  );

  return (
    <div ref={kolomRef} className="relative w-full lg:w-1/2 shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-0 lg:aspect-auto lg:h-[110vh]">
        {/* Beeldlaag 132% hoog: 16% speling boven en onder, genoeg voor ±11,5% van 132% (15,2%) */}
        <div ref={laagRef} className="absolute inset-x-0 -top-[16%] h-[132%] will-change-transform">
          <img
            src={foto.src}
            srcSet={foto.srcSet}
            sizes="(min-width: 1024px) 50vw, 100vw"
            width={foto.breedte}
            height={foto.hoogte}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[50%_45%]"
          />
        </div>
      </div>
    </div>
  );
};

export default CaseTelefoon;
