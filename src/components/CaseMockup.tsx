import { useEffect, useRef } from "react";
import { MoveVertical } from "lucide-react";
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

/** Automatisch scrollen: schermhoogtes per seconde, altijd dezelfde snelheid. */
const SNELHEID = 0.25;

export interface MockupScherm {
  src: string;
  srcSet: string;
  /** Afmetingen van de volledige screenshot. */
  breedte: number;
  hoogte: number;
}

/**
 * Hero van een case: schermvullend (100vw × 100svh), met de site in het
 * scherm van de monitor.
 *
 * - Kort na het openen gaat de monitor aan als een oude beeldbuis: een punt,
 *   een felle lijn, opengeklapt tot een overbelicht beeld met scanlines dat
 *   flikkert en tot rust komt (1,5 s). Daarna schuift de volledige pagina met
 *   één constante, rustige snelheid naar beneden en blijft onderaan staan.
 * - Het scherm geeft licht op de vloer: een vervaagd kopietje van wat er in
 *   beeld staat, dat meebeweegt (lichte delen en kleuren zie je terug).
 * - Met de muis boven het scherm pauzeert dat, en scrollt het muiswiel de
 *   site in het scherm in plaats van de pagina. Bovenaan of onderaan de site
 *   gaat het wiel weer naar de pagina, zodat je nergens vast komt te zitten.
 * - De cursor wordt boven het scherm een groene blob met "Scroll" (alleen bij
 *   een muis; op touchschermen blijft het bij automatisch scrollen).
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

  useEffect(() => {
    const vlak = schermRef.current;
    const site = siteRef.current;
    const blob = blobRef.current;
    const blobBinnen = blobBinnenRef.current;
    const crt = crtRef.current;
    const gloedVak = gloedVakRef.current;
    const gloed = gloedRef.current;
    if (!vlak || !site || !blob || !blobBinnen || !crt || !gloedVak || !gloed) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const muis = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const geopend = performance.now();

    let doel = 0; // waar de site naartoe moet (px)
    let positie = 0; // waar hij nu staat (px), volgt doel met een korte naloop
    let hover = false;
    let laatste = geopend;
    let aanSinds: number | null = null; // moment waarop de monitor aangaat
    let muisX = 0, muisY = 0, blobX = 0, blobY = 0;
    let frame = 0;

    const max = () => Math.max(0, site.offsetHeight - vlak.clientHeight);

    const tik = (nu: number) => {
      const dt = Math.min(0.05, (nu - laatste) / 1000);
      laatste = nu;
      // Monitor aan zodra de screenshot er is (en de pagina even staat).
      if (aanSinds === null && site.complete && nu - geopend >= START_NA_MS) {
        aanSinds = nu;
        crt.dataset["aan"] = "ja";
        gloedVak.dataset["aan"] = "ja";
      }
      // Na het aangaan één constante snelheid; pauze zolang de muis boven het scherm is.
      if (!reduced && !hover && aanSinds !== null && nu - aanSinds >= AAN_DUUR_MS) {
        doel = Math.min(max(), doel + vlak.clientHeight * SNELHEID * dt);
      }
      // Automatisch scrollen loopt vrijwel exact mee; het muiswiel krijgt een zachte naloop.
      const naloop = reduced ? 1 : 1 - Math.pow(0.002, dt);
      positie += (doel - positie) * naloop;
      if (Math.abs(doel - positie) < 0.1) positie = doel;
      site.style.transform = `translate3d(0, ${-positie}px, 0)`;
      // De gloed op de vloer toont hetzelfde stuk van de site (kleiner kopietje).
      if (site.offsetWidth) gloed.style.transform = `translate3d(0, ${(-positie * gloed.offsetWidth) / site.offsetWidth}px, 0)`;

      if (muis) {
        const volg = reduced ? 1 : 1 - Math.pow(0.000005, dt);
        blobX += (muisX - blobX) * volg;
        blobY += (muisY - blobY) * volg;
        blob.style.transform = `translate3d(${blobX}px, ${blobY}px, 0)`;
      }
      frame = requestAnimationFrame(tik);
    };
    frame = requestAnimationFrame(tik);

    const opWiel = (e: WheelEvent) => {
      const stap = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * vlak.clientHeight : e.deltaY;
      const m = max();
      // Aan het begin of eind van de site: laat het wiel de pagina scrollen.
      if ((stap > 0 && doel >= m - 0.5) || (stap < 0 && doel <= 0.5)) return;
      e.preventDefault();
      doel = Math.min(m, Math.max(0, doel + stap));
    };
    const opBinnen = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hover = true;
      muisX = blobX = e.clientX;
      muisY = blobY = e.clientY;
      blob.style.transform = `translate3d(${blobX}px, ${blobY}px, 0)`;
      blobBinnen.dataset["zichtbaar"] = "ja";
    };
    const opBeweeg = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      muisX = e.clientX;
      muisY = e.clientY;
    };
    const opBuiten = () => {
      hover = false;
      blobBinnen.dataset["zichtbaar"] = "nee";
    };

    vlak.addEventListener("wheel", opWiel, { passive: false });
    if (muis) {
      vlak.addEventListener("pointerenter", opBinnen);
      vlak.addEventListener("pointermove", opBeweeg);
      vlak.addEventListener("pointerleave", opBuiten);
    }
    return () => {
      cancelAnimationFrame(frame);
      vlak.removeEventListener("wheel", opWiel);
      vlak.removeEventListener("pointerenter", opBinnen);
      vlak.removeEventListener("pointermove", opBeweeg);
      vlak.removeEventListener("pointerleave", opBuiten);
    };
  }, []);

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
        [data-scroll-blob] { opacity: 0; transform: translate(-50%, -50%) scale(0.2); transition: opacity .25s ease, transform .45s cubic-bezier(0.22, 1, 0.36, 1); }
        [data-scroll-blob][data-zichtbaar="ja"] { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        @media (prefers-reduced-motion: reduce) { [data-scroll-blob] { transition: opacity .15s linear; } }

        /* Retro aan-animatie, zoals een oude beeldbuis: een punt wordt een felle lijn,
           klapt open tot beeld, overbelicht met scanlines, flikkert en komt tot rust. */
        [data-crt] { opacity: 0; transform-origin: 50% 50%; }
        [data-crt][data-aan="ja"] { animation: crt-aan ${AAN_DUUR_MS}ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
        @keyframes crt-aan {
          0%   { opacity: 1; transform: scale(0.015, 0.004); filter: brightness(9) saturate(0); }
          16%  { opacity: 1; transform: scale(1, 0.006);    filter: brightness(9) saturate(0); }
          34%  { opacity: 1; transform: scale(1, 1);        filter: brightness(2.6) saturate(0.2) contrast(1.3); }
          44%  { filter: brightness(1.7) saturate(0.7) contrast(1.15); }
          52%  { filter: brightness(0.75) saturate(0.9); }
          58%  { filter: brightness(1.35) saturate(1); }
          66%  { filter: brightness(0.92); }
          100% { opacity: 1; transform: scale(1, 1);        filter: brightness(1) saturate(1); }
        }
        [data-crt-flits] { opacity: 0; background: radial-gradient(ellipse 60% 18% at 50% 50%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%); }
        [data-crt][data-aan="ja"] ~ [data-crt-flits] { animation: crt-flits ${AAN_DUUR_MS}ms ease-out forwards; }
        @keyframes crt-flits { 0% { opacity: 0; } 10% { opacity: 1; } 30% { opacity: 0.5; } 45%, 100% { opacity: 0; } }
        [data-crt-lijnen] {
          opacity: 0;
          background: repeating-linear-gradient(to bottom, rgba(0,0,0,0.45) 0 1px, rgba(0,0,0,0) 1px 3px);
          box-shadow: inset 0 0 60px rgba(160,255,210,0.18);
        }
        [data-crt][data-aan="ja"] ~ [data-crt-lijnen] { animation: crt-lijnen ${AAN_DUUR_MS + 600}ms ease-out forwards; }
        @keyframes crt-lijnen { 0%, 20% { opacity: 0; } 32% { opacity: 1; } 60% { opacity: 0.6; } 100% { opacity: 0; } }

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
          <div ref={crtRef} data-crt="" data-aan="nee" className="absolute inset-0">
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

      {/* Cursor boven het scherm: groene blob die de muis volgt. */}
      <div ref={blobRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60]">
        <div
          ref={blobBinnenRef}
          data-scroll-blob=""
          data-zichtbaar="nee"
          className="flex h-[84px] w-[84px] flex-col items-center justify-center gap-0.5 rounded-full text-white shadow-[0_12px_30px_-10px_hsl(var(--sw-green)/0.6)]"
          style={{ background: "hsl(var(--sw-green))" }}
        >
          <MoveVertical className="h-5 w-5" aria-hidden="true" />
          <span className="text-[0.75rem] font-medium leading-none">Scroll</span>
        </div>
      </div>
    </section>
  );
};

export default CaseMockup;
