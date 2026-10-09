import { useRef } from "react";
import { ScrollBlob, useSchermScroll } from "@/components/SchermScroll";
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
// Vloer vóór de monitor: de voetplaat loopt tot y 1730, met daaronder een
// donkere rand en schaduw tot 1751. De gloed begint op 1756 (staand 1022 + 1756),
// zodat er geen licht op de voet of de schaduwlijn valt.
const GLOED_LIGGEND = { t: 1756 / 2160, h: 400 / 2160 };
const GLOED_STAAND = { t: 2778 / 4391, h: 520 / 4391 };
const pct = (v: number) => `${(v * 100).toFixed(4)}%`;

/** Wachttijd na het openen voordat de monitor aangaat. */
const START_NA_MS = 400;
/** Duur van de retro aan-animatie; daarna begint het scrollen. */
const AAN_DUUR_MS = 1500;

export interface MockupScherm {
  src: string;
  srcSet: string;
  /** Afmetingen van de volledige screenshot. */
  breedte: number;
  hoogte: number;
  /** In welk toestel de hero de site toont; standaard de monitor. */
  toestel?: "monitor" | "tablet";
}

/**
 * Hero van een case: schermvullend (100vw × 100svh), met de site in het
 * scherm van de monitor.
 *
 * - Kort na het openen gaat de monitor aan als een oude beeldbuis: een punt,
 *   een felle lijn, opengeklapt tot een overbelicht beeld met scanlines dat
 *   flikkert en tot rust komt (1,5 s). Scrollen, wiel en blob: zie useSchermScroll.
 * - Het scherm geeft licht op de vloer: een vervaagd kopietje van wat er in
 *   beeld staat, dat meebeweegt (lichte delen en kleuren zie je terug).
 * - Bij "animaties beperken": monitor meteen aan, geen automatisch scrollen en
 *   geen naloop.
 *
 * De foto staat op "cover"; een kader met dezelfde verhouding als de foto
 * rekent mee met hoe die wordt bijgesneden, zodat het scherm op elke
 * schermmaat exact op dezelfde plek in de monitor staat. Liggende schermen
 * krijgen de liggende foto, staande de staande.
 */
const CaseMockup = ({ scherm, alt }: { scherm: MockupScherm; alt: string }) => {
  const schermRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLImageElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const blobBinnenRef = useRef<HTMLDivElement>(null);
  const crtRef = useRef<HTMLDivElement>(null);
  const gloedVakRef = useRef<HTMLDivElement>(null);
  const gloedRef = useRef<HTMLImageElement>(null);

  useSchermScroll({
    vlakRef: schermRef,
    siteRef,
    blobRef,
    blobBinnenRef,
    startNaMs: START_NA_MS,
    aanDuurMs: AAN_DUUR_MS,
    opAan: () => {
      if (crtRef.current) crtRef.current.dataset["aan"] = "ja";
      if (gloedVakRef.current) gloedVakRef.current.dataset["aan"] = "ja";
    },
    // De gloed op de vloer toont hetzelfde stuk van de site (kleiner kopietje).
    naTik: (positie) => {
      const gloed = gloedRef.current, site = siteRef.current;
      if (gloed && site?.offsetWidth) gloed.style.transform = `translate3d(0, ${(-positie * gloed.offsetWidth) / site.offsetWidth}px, 0)`;
    },
  });

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
          "--gt": pct(GLOED_LIGGEND.t),
          "--gh": pct(GLOED_LIGGEND.h),
        } as React.CSSProperties
      }
    >
      <style>{`
        @media (orientation: portrait) {
          [data-case-mockup] { --ar: ${STAAND.ar}; --l: ${pct(STAAND.l)}; --t: ${pct(STAAND.t)}; --w: ${pct(STAAND.w)}; --h: ${pct(STAAND.h)}; --gt: ${pct(GLOED_STAAND.t)}; --gh: ${pct(GLOED_STAAND.h)}; }
        }

        /* Retro aan-animatie, zoals een oude beeldbuis maar zacht: een dunne, gloeiende
           lijn met de echte kleuren klapt vloeiend open tot beeld, licht overbelicht en
           onscherp, met scanlines; één subtiele flikkering en dan tot rust. */
        [data-crt] { opacity: 0; transform-origin: 50% 50%; }
        [data-crt][data-aan="ja"] { animation: crt-aan ${AAN_DUUR_MS}ms linear forwards; }
        @keyframes crt-aan {
          0%   { opacity: 0; transform: scale(0.35, 0.012); filter: brightness(2) saturate(0.4) blur(1.5px); animation-timing-function: cubic-bezier(0.33, 0, 0.2, 1); }
          14%  { opacity: 1; transform: scale(1, 0.012);    filter: brightness(2) saturate(0.4) blur(1.5px); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
          48%  { opacity: 1; transform: scale(1, 1);        filter: brightness(1.45) saturate(0.7) blur(0.4px); animation-timing-function: ease-in-out; }
          64%  { filter: brightness(0.93) saturate(0.95) blur(0); animation-timing-function: ease-in-out; }
          76%  { filter: brightness(1.06) saturate(1); animation-timing-function: ease-out; }
          100% { opacity: 1; transform: scale(1, 1);        filter: brightness(1) saturate(1) blur(0); }
        }
        /* Zachte gloed rond de lijn (geen witte balk): klapt mee open en dooft uit. */
        [data-crt-flits] {
          opacity: 0;
          background: radial-gradient(ellipse 52% 50% at 50% 50%, rgba(214,255,236,0.55), rgba(214,255,236,0) 70%);
          transform: scaleY(0.05);
          filter: blur(6px);
        }
        [data-crt][data-aan="ja"] ~ [data-crt-flits] { animation: crt-flits ${AAN_DUUR_MS}ms forwards; }
        @keyframes crt-flits {
          0%   { opacity: 0; transform: scaleY(0.05); animation-timing-function: ease-out; }
          12%  { opacity: 0.9; transform: scaleY(0.05); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
          46%  { opacity: 0.35; transform: scaleY(1); animation-timing-function: ease-out; }
          70%, 100% { opacity: 0; transform: scaleY(1); }
        }
        [data-crt-lijnen] {
          opacity: 0;
          background: repeating-linear-gradient(to bottom, rgba(0,0,0,0.35) 0 1px, rgba(0,0,0,0) 1px 3px);
          box-shadow: inset 0 0 70px rgba(160,255,210,0.14);
        }
        [data-crt][data-aan="ja"] ~ [data-crt-lijnen] { animation: crt-lijnen ${AAN_DUUR_MS + 900}ms ease-out forwards; }
        @keyframes crt-lijnen { 0%, 22% { opacity: 0; } 38% { opacity: 0.85; } 100% { opacity: 0; } }

        /* Gloed op de vloer: gaat mee aan met de monitor. Het masker loopt binnen het vlak
           helemaal naar nul, zodat er onder en opzij geen rand zichtbaar is. */
        [data-gloed] {
          opacity: 0;
          mix-blend-mode: screen;
          /* Ellips voor het wegvloeien naar onder en opzij, gesneden met een zachte
             inloop bovenaan zodat het licht pas na de rand van de voet begint. */
          -webkit-mask-image: radial-gradient(ellipse 44% 88% at 50% 0%, #000 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.35) 62%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 14%);
          -webkit-mask-composite: source-in;
          mask-image: radial-gradient(ellipse 44% 88% at 50% 0%, #000 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.35) 62%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 14%);
          mask-composite: intersect;
          transition: opacity 1.4s ease 0.5s;
        }
        [data-gloed][data-aan="ja"] { opacity: 0.95; }

        @media (prefers-reduced-motion: reduce) {
          [data-crt][data-aan="ja"] { animation: none; opacity: 1; }
          [data-crt][data-aan="ja"] ~ [data-crt-flits], [data-crt][data-aan="ja"] ~ [data-crt-lijnen] { animation: none; }
          [data-gloed] { transition: none; }
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

        {/* Lichtweerspiegeling op de vloer: een klein kopietje van het scherm, vervaagd
            en over de vloer uitgerekt (perspectief), opgeteld bij de foto (screen). */}
        <div
          ref={gloedVakRef}
          data-gloed=""
          data-aan="nee"
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: "calc(var(--l) - var(--w) * 0.3)", top: "var(--gt)", width: "calc(var(--w) * 1.6)", height: "var(--gh)" }}
        >
          <div
            className="absolute left-1/2 top-0 overflow-hidden"
            style={{
              width: "12.5%",
              aspectRatio: "1.822",
              transform: "translateX(-50%) scale(6.5, 3.2)",
              transformOrigin: "top center",
              filter: "blur(6px) saturate(2.2) brightness(1.5)",
            }}
          >
            <img
              ref={gloedRef}
              src={scherm.src}
              srcSet={scherm.srcSet}
              sizes="10vw"
              alt=""
              draggable={false}
              className="block h-auto w-full"
            />
          </div>
        </div>

        {/* data-lenis-prevent: het muiswiel hoort hier bij het scherm, niet bij de smooth scroll van de pagina. */}
        <div
          ref={schermRef}
          data-lenis-prevent=""
          className="absolute overflow-hidden rounded-[0.2%] bg-black [@media(hover:hover)_and_(pointer:fine)]:cursor-none"
          style={{ left: "var(--l)", top: "var(--t)", width: "var(--w)", height: "var(--h)" }}
        >
          {/* Het beeld van de monitor; gaat retro aan (zie data-crt in de styles). */}
          {/* overflow-hidden: alleen wat in beeld is klapt open, niet de hele pagina eronder. */}
          <div ref={crtRef} data-crt="" data-aan="nee" className="absolute inset-0 overflow-hidden">
            <img
              ref={siteRef}
              src={scherm.src}
              srcSet={scherm.srcSet}
              sizes="(orientation: portrait) 88vw, 46vw"
              width={scherm.breedte}
              height={scherm.hoogte}
              alt={alt}
              draggable={false}
              className="block h-auto w-full select-none will-change-transform"
            />
          </div>
          <div data-crt-flits="" aria-hidden="true" className="pointer-events-none absolute inset-0" />
          <div data-crt-lijnen="" aria-hidden="true" className="pointer-events-none absolute inset-0" />
        </div>
      </div>

      <ScrollBlob blobRef={blobRef} binnenRef={blobBinnenRef} />
    </section>
  );
};

export default CaseMockup;
