import { useEffect, useRef, type RefObject } from "react";
import { MoveVertical } from "lucide-react";

/** Automatisch scrollen: schermhoogtes per seconde, altijd dezelfde snelheid. */
const SNELHEID = 0.25;

interface Opties {
  /** Het scherm: vangt muis en wiel, en bepaalt de zichtbare hoogte. */
  vlakRef: RefObject<HTMLElement | null>;
  /** De volledige screenshot die in het scherm schuift. */
  siteRef: RefObject<HTMLImageElement | null>;
  blobRef: RefObject<HTMLDivElement | null>;
  blobBinnenRef: RefObject<HTMLDivElement | null>;
  /** Wachttijd na het openen voordat het toestel aangaat. */
  startNaMs: number;
  /** Duur van de aan-animatie; daarna begint het scrollen. */
  aanDuurMs: number;
  /** Eén keer, op het moment dat het toestel aangaat. */
  opAan: () => void;
  /** Elk frame, met de huidige scrollpositie in px (bijv. voor een lichtweerspiegeling). */
  naTik?: (positie: number) => void;
}

/**
 * Gedrag van de site in het scherm van een case-mockup (monitor, tablet):
 * - Kort na het openen gaat het toestel aan (`opAan`); na de aan-animatie schuift
 *   de volledige pagina met één constante, rustige snelheid naar beneden en blijft
 *   onderaan staan.
 * - Met de muis boven het scherm pauzeert dat, en scrollt het muiswiel de site in
 *   het scherm in plaats van de pagina. Bovenaan of onderaan de site gaat het wiel
 *   weer naar de pagina, zodat je nergens vast komt te zitten.
 * - De cursor wordt boven het scherm een groene blob (zie ScrollBlob), alleen bij
 *   een muis; op touchschermen blijft het bij automatisch scrollen.
 * - Bij "animaties beperken": geen automatisch scrollen en geen naloop.
 */
export function useSchermScroll({ vlakRef, siteRef, blobRef, blobBinnenRef, startNaMs, aanDuurMs, opAan, naTik }: Opties) {
  // Callbacks via een ref, zodat het effect maar één keer hoeft te draaien.
  const terugroep = useRef({ opAan, naTik });
  terugroep.current = { opAan, naTik };

  useEffect(() => {
    const vlak = vlakRef.current;
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
    let aanSinds: number | null = null; // moment waarop het toestel aangaat
    let muisX = 0, muisY = 0, blobX = 0, blobY = 0;
    let frame = 0;

    const max = () => Math.max(0, site.offsetHeight - vlak.clientHeight);

    const tik = (nu: number) => {
      const dt = Math.min(0.05, (nu - laatste) / 1000);
      laatste = nu;
      // Aan zodra de screenshot er is (en de pagina even staat).
      if (aanSinds === null && site.complete && nu - geopend >= startNaMs) {
        aanSinds = nu;
        terugroep.current.opAan();
      }
      // Na het aangaan één constante snelheid; pauze zolang de muis boven het scherm is.
      if (!reduced && !hover && aanSinds !== null && nu - aanSinds >= aanDuurMs) {
        doel = Math.min(max(), doel + vlak.clientHeight * SNELHEID * dt);
      }
      // Automatisch scrollen loopt vrijwel exact mee; het muiswiel krijgt een zachte naloop.
      const naloop = reduced ? 1 : 1 - Math.pow(0.002, dt);
      positie += (doel - positie) * naloop;
      if (Math.abs(doel - positie) < 0.1) positie = doel;
      site.style.transform = `translate3d(0, ${-positie}px, 0)`;
      terugroep.current.naTik?.(positie);

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
  }, [vlakRef, siteRef, blobRef, blobBinnenRef, startNaMs, aanDuurMs]);
}

/** Cursor boven het scherm: groene blob met "Scroll" die de muis volgt. */
export const ScrollBlob = ({ blobRef, binnenRef }: { blobRef: RefObject<HTMLDivElement | null>; binnenRef: RefObject<HTMLDivElement | null> }) => (
  <div ref={blobRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60]">
    <style>{`
      [data-scroll-blob] { opacity: 0; transform: translate(-50%, -50%) scale(0.2); transition: opacity .25s ease, transform .45s cubic-bezier(0.22, 1, 0.36, 1); }
      [data-scroll-blob][data-zichtbaar="ja"] { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      @media (prefers-reduced-motion: reduce) { [data-scroll-blob] { transition: opacity .15s linear; } }
    `}</style>
    <div
      ref={binnenRef}
      data-scroll-blob=""
      data-zichtbaar="nee"
      className="flex h-[84px] w-[84px] flex-col items-center justify-center gap-0.5 rounded-full text-white shadow-[0_12px_30px_-10px_hsl(var(--sw-green)/0.6)]"
      style={{ background: "hsl(var(--sw-green))" }}
    >
      <MoveVertical className="h-5 w-5" aria-hidden="true" />
      <span className="text-[0.75rem] font-medium leading-none">Scroll</span>
    </div>
  </div>
);
