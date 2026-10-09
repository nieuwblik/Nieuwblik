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
const pct = (v: number) => `${(v * 100).toFixed(4)}%`;

/** Wachttijd na het openen voordat het automatische scrollen begint. */
const START_NA_MS = 1000;

/**
 * CSS-achtige cubic-bezier als functie van t (0..1). Gebruikt voor de
 * automatische vlagen: zacht op gang, daarna lang en rustig uitglijden.
 */
const bezier = (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
  let s = t;
  for (let i = 0; i < 8; i++) {
    const x = 3 * (1 - s) ** 2 * s * x1 + 3 * (1 - s) * s * s * x2 + s ** 3 - t;
    const dx = 3 * (1 - s) ** 2 * x1 + 6 * (1 - s) * s * (x2 - x1) + 3 * s * s * (1 - x2);
    if (Math.abs(x) < 1e-5 || Math.abs(dx) < 1e-6) break;
    s = Math.min(1, Math.max(0, s - x / dx));
  }
  return 3 * (1 - s) ** 2 * s * y1 + 3 * (1 - s) * s * s * y2 + s ** 3;
};
const GLIJDEN = bezier(0.3, 0.05, 0.15, 1);

/**
 * Vaste reeks "willekeurige" getallen (mulberry32): het scrollen varieert
 * zoals bij een mens, maar ziet er bij elk bezoek hetzelfde uit.
 */
const reeks = (zaad: number) => () => {
  zaad = (zaad + 0x6d2b79f5) | 0;
  let t = Math.imul(zaad ^ (zaad >>> 15), 1 | zaad);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

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
 * - Ongeveer een seconde na het openen scrollt de pagina vanzelf naar beneden
 *   zoals iemand die scrollt: een vloeiende vlaag die zacht op gang komt en
 *   lang uitglijdt, even lezen, en weer verder; af en toe een stukje terug. Onderaan
 *   blijft hij staan.
 * - Met de muis boven het scherm pauzeert dat, en scrollt het muiswiel de
 *   site in het scherm in plaats van de pagina. Bovenaan of onderaan de site
 *   gaat het wiel weer naar de pagina, zodat je nergens vast komt te zitten.
 * - De cursor wordt boven het scherm een groene blob met "Scroll" (alleen bij
 *   een muis; op touchschermen blijft het bij automatisch scrollen).
 * - Bij "animaties beperken": geen automatisch scrollen en geen naloop.
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

  useEffect(() => {
    const vlak = schermRef.current;
    const site = siteRef.current;
    const blob = blobRef.current;
    const blobBinnen = blobBinnenRef.current;
    if (!vlak || !site || !blob || !blobBinnen) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const muis = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const geopend = performance.now();

    let doel = 0; // waar de site naartoe moet (px)
    let positie = 0; // waar hij nu staat (px), volgt doel met een korte naloop
    let hover = false;
    let laatste = geopend;
    let wachtTot = geopend + START_NA_MS;
    // De lopende automatische beweging (één vlaag), of null tijdens een pauze.
    let beweging: { van: number; naar: number; start: number; duur: number } | null = null;
    const kans = reeks(20261009);
    let muisX = 0, muisY = 0, blobX = 0, blobY = 0;
    let frame = 0;

    const max = () => Math.max(0, site.offsetHeight - vlak.clientHeight);

    const tik = (nu: number) => {
      const dt = Math.min(0.05, (nu - laatste) / 1000);
      laatste = nu;
      // Automatisch scrollen als een mens; pauze zolang de muis boven het scherm is.
      if (!reduced && !hover && site.complete) {
        if (beweging) {
          // Eén vloeiende vlaag: zacht op gang, lang uitglijden.
          const t = Math.min(1, (nu - beweging.start) / beweging.duur);
          doel = positie = beweging.van + (beweging.naar - beweging.van) * GLIJDEN(t);
          if (t >= 1) {
            beweging = null;
            wachtTot = nu + 800 + kans() * 1200; // even lezen
          }
        } else if (nu >= wachtTot && doel < max()) {
          // Meestal een halve tot ruim driekwart scherm omlaag, soms een klein stukje terug.
          const h = vlak.clientHeight;
          const terug = doel > h && kans() < 0.12;
          const afstand = terug ? -h * (0.12 + kans() * 0.1) : h * (0.45 + kans() * 0.4);
          const naar = Math.min(max(), Math.max(0, doel + afstand));
          beweging = { van: doel, naar, start: nu, duur: terug ? 700 : 900 + kans() * 500 };
        }
      }
      // Zelf scrollen met het wiel: zachte naloop naar het doel.
      if (!beweging) {
        const naloop = reduced ? 1 : 1 - Math.pow(0.01, dt);
        positie += (doel - positie) * naloop;
        if (Math.abs(doel - positie) < 0.1) positie = doel;
      }
      site.style.transform = `translate3d(0, ${-positie}px, 0)`;

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
      // Een lopende vlaag stopt waar hij is; vanaf hier neemt de muis het over.
      beweging = null;
      doel = positie;
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
      // Na het verlaten van het scherm even wachten en dan verder als voorheen.
      wachtTot = performance.now() + 700;
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
        } as React.CSSProperties
      }
    >
      <style>{`
        @media (orientation: portrait) {
          [data-case-mockup] { --ar: ${STAAND.ar}; --l: ${pct(STAAND.l)}; --t: ${pct(STAAND.t)}; --w: ${pct(STAAND.w)}; --h: ${pct(STAAND.h)}; }
        }
        [data-scroll-blob] { opacity: 0; transform: translate(-50%, -50%) scale(0.2); transition: opacity .25s ease, transform .45s cubic-bezier(0.22, 1, 0.36, 1); }
        [data-scroll-blob][data-zichtbaar="ja"] { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        @media (prefers-reduced-motion: reduce) { [data-scroll-blob] { transition: opacity .15s linear; } }
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

        {/* data-lenis-prevent: het muiswiel hoort hier bij het scherm, niet bij de smooth scroll van de pagina. */}
        <div
          ref={schermRef}
          data-lenis-prevent=""
          className="absolute overflow-hidden rounded-[0.2%] bg-black [@media(hover:hover)_and_(pointer:fine)]:cursor-none"
          style={{ left: "var(--l)", top: "var(--t)", width: "var(--w)", height: "var(--h)" }}
        >
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
