import { useEffect, useRef } from "react";
import liggend from "@/assets/mockup/tablet-liggend.webp";
import liggendSet from "@/assets/mockup/tablet-liggend.webp?w=1280;1920;2880;3840&format=webp&as=srcset";
import staandSet from "@/assets/mockup/tablet-staand.webp?w=720;1080;1440;2160&format=webp&as=srcset";
import maskerLiggend from "@/assets/mockup/tablet-liggend-masker.png";
import maskerStaand from "@/assets/mockup/tablet-staand-masker.png";
import { ScrollBlob, useSchermScroll } from "@/components/SchermScroll";
import type { MockupScherm } from "@/components/CaseMockup";

/*
 * Mockupfoto's (Higgsfield, studio met tegenlicht): twee handen houden een tablet
 * omhoog tegen een egaal lichtgrijze achtergrond. Het scherm was groen en is zwart
 * gemaakt (tablet uit); de site wordt in code in het scherm gezet, met perspectief.
 *
 * Opgemeten met scripts/mockups/telefoon.mjs (schermUit): de hoeken van het scherm
 * als fractie van de foto (linksboven, rechtsboven, rechtsonder, linksonder), de
 * verhouding van het scherm en de hoekafronding als fractie van de schermbreedte.
 *
 * Het masker is het groene vlak uit de originele foto (wit, alfa = groenheid). Het
 * scherm wordt daarmee bijgesneden, zodat het precies de echte schermrand volgt
 * (die is in een gegenereerde foto niet altijd kaarsrecht) en een duim of vinger
 * op de rand altijd vóór de site blijft. Het vlak zelf is daarom iets ruimer
 * (RUIMTE) dan de gefitte hoeken.
 */
const LIGGEND = {
  ar: 3840 / 2160,
  hoeken: [[0.28677, 0.21772], [0.69139, 0.19876], [0.7085, 0.67774], [0.29814, 0.70362]],
  verhouding: 1.5002,
  radius: 0.0216,
};
const STAAND = {
  ar: 2160 / 3840,
  hoeken: [[0.15909, 0.31939], [0.83887, 0.31547], [0.85443, 0.58888], [0.1634, 0.59329]],
  verhouding: 1.4085,
  radius: 0.0196,
};
type Opzet = typeof LIGGEND;

/** Hoeveel ruimer het schermvlak is dan de gefitte hoeken; het masker snijdt het bij. */
const RUIMTE = 1.008;
/** Breedte van het scherm in CSS-pixels vóór de perspectieftransformatie. */
const SCHERM_BREEDTE = 1000;
/** Wachttijd na het openen voordat de tablet aangaat. */
const START_NA_MS = 400;
/** Duur van het aangaan (scherm licht op); daarna begint het scrollen. */
const AAN_DUUR_MS = 900;

/** Homografie die de vier hoeken van `bron` op die van `doel` legt, als CSS matrix3d. */
function perspectief(bron: number[][], doel: number[][]): string {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [u, v] = bron[i]!, [x, y] = doel[i]!;
    A.push([u!, v!, 1, 0, 0, 0, -u! * x!, -v! * x!]); b.push(x!);
    A.push([0, 0, 0, u!, v!, 1, -u! * y!, -v! * y!]); b.push(y!);
  }
  for (let c = 0; c < 8; c++) {
    let m = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r]![c]!) > Math.abs(A[m]![c]!)) m = r;
    [A[c], A[m]] = [A[m]!, A[c]!]; [b[c], b[m]] = [b[m]!, b[c]!];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r]![c]! / A[c]![c]!;
      for (let k = c; k < 8; k++) A[r]![k]! -= f * A[c]![k]!;
      b[r]! -= f * b[c]!;
    }
  }
  const [a, bb, cc, d, e, f, g, h] = b.map((v, i) => v / A[i]![i]!) as [number, number, number, number, number, number, number, number];
  // CSS matrix3d is kolom-voor-kolom.
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${h},0,0,1,0,${cc},${f},0,1)`;
}

/**
 * Hero van een case met een tablet: schermvullend (100vw × 100svh), met de site
 * in het scherm. Zelfde gedrag als de monitor (useSchermScroll: automatisch
 * scrollen, wiel, groene blob), maar de tablet staat schuin in de foto. Het
 * scherm is daarom een vlak op schermformaat (met afgeronde hoeken) dat met een
 * perspectiefmatrix precies op de vier opgemeten hoeken wordt gelegd; die matrix
 * wordt bij elke schermmaat opnieuw berekend.
 *
 * Licht: de foto is van achteren belicht (handen als silhouet, egale achtergrond
 * RGB ~204, geen glans op het glas omdat de voorkant in de schaduw staat). Het
 * scherm geeft zelf licht en blijft dus helder, met alleen een lichte sluier van
 * het tegenlicht (iets minder contrast) en ~10% vignettering naar de hoeken, zoals
 * gemeten in de referentiefoto.
 *
 * Aangaan: zoals een tablet die wakker wordt, het beeld komt zacht en iets te
 * helder op en zakt naar normaal.
 */
const CaseTablet = ({ scherm, alt }: { scherm: MockupScherm; alt: string }) => {
  const kaderRef = useRef<HTMLDivElement>(null);
  const schermRef = useRef<HTMLDivElement>(null);
  const beeldRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLImageElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const blobBinnenRef = useRef<HTMLDivElement>(null);

  // Scherm op de juiste plek leggen, per oriëntatie en schermmaat.
  useEffect(() => {
    const kader = kaderRef.current, vlak = schermRef.current;
    if (!kader || !vlak) return;
    const staand = window.matchMedia("(orientation: portrait)");
    const plaats = () => {
      const o: Opzet = staand.matches ? STAAND : LIGGEND;
      const w = SCHERM_BREEDTE, h = SCHERM_BREEDTE / o.verhouding;
      const bw = kader.offsetWidth, bh = kader.offsetHeight;
      vlak.style.width = `${w}px`;
      vlak.style.height = `${h}px`;
      vlak.style.borderRadius = `${o.radius * w}px`;
      const hoeken = o.hoeken.map(([x, y]) => [x! * bw, y! * bh] as [number, number]);
      const mx = hoeken.reduce((t, p) => t + p[0], 0) / 4, my = hoeken.reduce((t, p) => t + p[1], 0) / 4;
      const ruim = hoeken.map(([x, y]) => [mx + (x - mx) * RUIMTE, my + (y - my) * RUIMTE]);
      vlak.style.transform = perspectief([[0, 0], [w, 0], [w, h], [0, h]], ruim);
      vlak.dataset["klaar"] = "ja";
    };
    plaats();
    const waarnemer = new ResizeObserver(plaats);
    waarnemer.observe(kader);
    staand.addEventListener("change", plaats);
    return () => {
      waarnemer.disconnect();
      staand.removeEventListener("change", plaats);
    };
  }, []);

  useSchermScroll({
    vlakRef: schermRef,
    siteRef,
    blobRef,
    blobBinnenRef,
    startNaMs: START_NA_MS,
    aanDuurMs: AAN_DUUR_MS,
    opAan: () => {
      if (beeldRef.current) beeldRef.current.dataset["aan"] = "ja";
    },
  });

  return (
    <section aria-label={alt} className="relative h-[100svh] w-full overflow-hidden bg-[#cccdce]" style={{ "--ar": LIGGEND.ar } as React.CSSProperties}>
      <style>{`
        @media (orientation: portrait) { [data-case-tablet] { --ar: ${STAAND.ar}; } }
        /* Tot de matrix staat, is alleen de foto (tablet uit) te zien. */
        [data-tablet-masker] {
          -webkit-mask-image: url("${maskerLiggend}"); mask-image: url("${maskerLiggend}");
          -webkit-mask-size: 100% 100%; mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
        }
        @media (orientation: portrait) {
          [data-tablet-masker] { -webkit-mask-image: url("${maskerStaand}"); mask-image: url("${maskerStaand}"); }
        }
        [data-tablet-scherm] { visibility: hidden; }
        [data-tablet-scherm][data-klaar="ja"] { visibility: visible; }
        [data-tablet-beeld] { opacity: 0; }
        [data-tablet-beeld][data-aan="ja"] { animation: tablet-aan ${AAN_DUUR_MS}ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes tablet-aan {
          0%   { opacity: 0; filter: brightness(1.35); }
          55%  { opacity: 1; filter: brightness(1.12); }
          100% { opacity: 1; filter: brightness(1); }
        }
        /* Tegenlicht: een lichte grijze sluier (iets minder contrast) en vignettering
           naar de hoeken; geen glans. */
        [data-tablet-licht] {
          background:
            radial-gradient(ellipse 78% 74% at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.11) 100%),
            rgba(204,205,207,0.05);
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.35);
        }
        @media (prefers-reduced-motion: reduce) { [data-tablet-beeld][data-aan="ja"] { animation: none; opacity: 1; } }
      `}</style>
      <div
        ref={kaderRef}
        data-case-tablet=""
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

        {/* Masker in fotocoördinaten: het scherm alleen waar in de foto echt scherm was. */}
        <div data-tablet-masker="" className="pointer-events-none absolute inset-0">
        {/* data-lenis-prevent: het muiswiel hoort hier bij het scherm, niet bij de smooth scroll van de pagina. */}
        <div
          ref={schermRef}
          data-tablet-scherm=""
          data-lenis-prevent=""
          className="pointer-events-auto absolute left-0 top-0 origin-top-left overflow-hidden bg-black [@media(hover:hover)_and_(pointer:fine)]:cursor-none"
        >
          <div ref={beeldRef} data-tablet-beeld="" data-aan="nee" className="absolute inset-0 overflow-hidden">
            <img
              ref={siteRef}
              src={scherm.src}
              srcSet={scherm.srcSet}
              sizes="(orientation: portrait) 70vw, 42vw"
              width={scherm.breedte}
              height={scherm.hoogte}
              alt={alt}
              draggable={false}
              className="block h-auto w-full select-none will-change-transform"
            />
          </div>
          <div data-tablet-licht="" aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" />
        </div>
        </div>
      </div>

      <ScrollBlob blobRef={blobRef} binnenRef={blobBinnenRef} />
    </section>
  );
};

export default CaseTablet;
