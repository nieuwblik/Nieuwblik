import { useEffect, useRef, useState } from "react";
import liggend from "@/assets/mockup/monitor-liggend.webp";
import liggendSet from "@/assets/mockup/monitor-liggend.webp?w=1280;1920;2880;3840&format=webp&as=srcset";
import staandSet from "@/assets/mockup/monitor-staand.webp?w=720;1080;1440;1932&format=webp&as=srcset";

/*
 * Mockupfoto's (Higgsfield, zwart-wit studio): een monitor met een leeg,
 * recht scherm. De site staat er niet in de foto, maar wordt in code in het
 * scherm gezet, zodat hij haarscherp is en kan scrollen.
 *
 * Het beeldvlak is opgemeten in de originele bestanden (de zwarte rand min
 * een dunne bezel van 12 px):
 * - liggend 3840×2160: x 1083, y 494, 1675×919
 * - staand  1932×4391: x 129, y 1517, 1675×918 (verhouding 0,44: past ook
 *   op smalle telefoons zonder dat de monitor buiten beeld valt)
 * Beide hebben een verhouding van 1,822; de screenshots van de sites worden
 * daarom gemaakt met een venster van 1440×790.
 */
const LIGGEND = { ar: 3840 / 2160, l: 1083 / 3840, t: 494 / 2160, w: 1675 / 3840, h: 919 / 2160 };
const STAAND = { ar: 1932 / 4391, l: 129 / 1932, t: 1517 / 4391, w: 1675 / 1932, h: 918 / 4391 };
const pct = (v: number) => `${(v * 100).toFixed(4)}%`;

export interface MockupScherm {
  src: string;
  srcSet: string;
  /** Afmetingen van de volledige screenshot, voor de scrollduur. */
  breedte: number;
  hoogte: number;
}

/**
 * Hero van een case: schermvullend (100vw × 100svh), met de site in het
 * scherm van de monitor. Ongeveer een seconde na het openen schuift de
 * volledige pagina rustig naar beneden en blijft onderaan staan. Bij
 * "animaties beperken" blijft hij bovenaan staan.
 *
 * De foto staat op "cover"; een kader met dezelfde verhouding als de foto
 * rekent mee met hoe die wordt bijgesneden, zodat het scherm op elke
 * schermmaat exact op dezelfde plek in de monitor staat. Liggende schermen
 * krijgen de liggende foto, staande de staande.
 */
const CaseMockup = ({ scherm, alt }: { scherm: MockupScherm; alt: string }) => {
  const [klaar, setKlaar] = useState(false);
  const start = useRef(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    start.current = performance.now();
    // Al geladen voordat React de onLoad kon koppelen (server-HTML).
    if (imgRef.current?.complete) setKlaar(true);
  }, []);

  // Ongeveer 1,7 s per schermhoogte, tussen 12 en 30 seconden.
  const schermen = scherm.hoogte / (scherm.breedte / 1.822);
  const duur = Math.min(30, Math.max(12, schermen * 1.7));
  // Start één seconde na het openen, of meteen als de screenshot later binnenkomt.
  const vertraging = klaar ? Math.max(0, 1000 - (performance.now() - start.current)) : 0;

  return (
    <section
      aria-label={alt}
      className="relative h-[100svh] w-full overflow-hidden bg-[#c9c9c9]"
      style={
        {
          "--ar": LIGGEND.ar,
          "--l": pct(LIGGEND.l),
          "--t": pct(LIGGEND.t),
          "--w": pct(LIGGEND.w),
          "--h": pct(LIGGEND.h),
        } as React.CSSProperties
      }
    >
      <style>{`
        @media (orientation: portrait) {
          [data-case-mockup] { --ar: ${STAAND.ar}; --l: ${pct(STAAND.l)}; --t: ${pct(STAAND.t)}; --w: ${pct(STAAND.w)}; --h: ${pct(STAAND.h)}; }
        }
        @keyframes case-scherm-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(calc(-100% + 100cqh)); }
        }
      `}</style>
      <div
        data-case-mockup=""
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "max(100vw, calc(100svh * var(--ar)))",
          height: "max(100svh, calc(100vw / var(--ar)))",
        }}
      >
        <picture>
          <source media="(orientation: portrait)" srcSet={staandSet} sizes="100vw" />
          <img
            src={liggend}
            srcSet={liggendSet}
            sizes="max(100vw, 177.78svh)"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full select-none"
            draggable={false}
          />
        </picture>

        <div
          className="absolute overflow-hidden rounded-[0.2%] bg-black"
          style={{ left: "var(--l)", top: "var(--t)", width: "var(--w)", height: "var(--h)", containerType: "size" }}
        >
          <img
            ref={imgRef}
            src={scherm.src}
            srcSet={scherm.srcSet}
            sizes="(orientation: portrait) 88vw, 46vw"
            width={scherm.breedte}
            height={scherm.hoogte}
            alt={alt}
            onLoad={() => setKlaar(true)}
            className="block h-auto w-full motion-reduce:!animate-none"
            style={
              klaar
                ? {
                    animation: `case-scherm-scroll ${duur}s cubic-bezier(0.4, 0, 0.2, 1) ${vertraging}ms forwards`,
                    willChange: "transform",
                  }
                : undefined
            }
          />
        </div>
      </div>
    </section>
  );
};

export default CaseMockup;
