import { useEffect } from "react";
import { useLocation } from "@/lib/router-compat";

// Shared instance so route changes can jump to top instantly.
let lenisInstance: import("lenis").default | null = null;

/**
 * The live Lenis instance, or null when smooth scroll is disabled (reduced
 * motion, touch, macOS) or not mounted yet. Consumers that lock page scroll
 * must stop/start it — hiding body overflow alone won't stop Lenis.
 */
export const getLenis = (): import("lenis").default | null => lenisInstance;

type Gsap = typeof import("gsap").default;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;

let gsapKoppeling: { gsap: Gsap; ScrollTrigger: ScrollTriggerType } | null = null;
let koppelNu: (() => void) | null = null;

/**
 * Voor componenten met ScrollTrigger (homepage, cases, analyse): zet Lenis op
 * de klok van GSAP en werk ScrollTrigger bij met elke Lenis-stap, zodat
 * scroll-animaties in hetzelfde frame lopen als het scrollen. Zonder deze
 * koppeling draait Lenis op een eigen requestAnimationFrame en hoeven GSAP en
 * ScrollTrigger niet te laden op pagina's die ze niet gebruiken.
 */
export function koppelScrollTrigger(gsap: Gsap, ScrollTrigger: ScrollTriggerType) {
  if (gsapKoppeling) return;
  gsapKoppeling = { gsap, ScrollTrigger };
  koppelNu?.();
}

/**
 * Global smooth-scroll. Lenis is position-based (it sets scrollTop rather than
 * transforming content), so position:fixed elements and ScrollTrigger keep
 * working natively. Disabled when the user prefers reduced motion, on coarse
 * touch input (native momentum scroll feels better there), and on macOS —
 * its native trackpad/wheel momentum already feels smooth, and layering
 * Lenis on top of it reads as janky rather than helpful.
 */
const SmoothScroll = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isMac = /Mac/.test(window.navigator.platform ?? "") || /Macintosh/.test(window.navigator.userAgent);
    if (prefersReduced || isTouch || isMac) return;

    // Lenis wordt hier pas opgehaald, niet bovenaan het bestand. Op een
    // telefoon staat smooth scroll uit, en een statische import zou de code
    // dan alsnog downloaden en uitvoeren voor niets — precies het werk waar
    // een langzaam toestel op vastloopt.
    let opgeruimd = false;
    let stop: (() => void) | null = null;

    void (async () => {
      const [{ default: Lenis }] = await Promise.all([import("lenis"), import("lenis/dist/lenis.css")]);
      if (opgeruimd) return;

      // Een trackpad (Windows-precisietouchpad) geeft zelf al vloeiende stappen met
      // eigen naloop. Lenis speelt die nog eens af over ruim een seconde, en dan
      // loopt de pagina achter je vingers aan. Herkennen we een trackpad, dan laten
      // we het scrollen verder aan de browser; een muiswiel blijft vloeiend.
      // Muiswiel: vaste stappen van ~100 px (of regels, deltaMode 1). Trackpad:
      // kleine of gebroken pixelstappen, vaak ook zijwaarts.
      const isTrackpad = (e: WheelEvent) =>
        e.deltaMode === 0 &&
        (e.deltaX !== 0 || !Number.isInteger(e.deltaY) || (e.deltaY !== 0 && Math.abs(e.deltaY) < 50));

      const lenis: import("lenis").default = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.4,
        virtualScroll: ({ event }) => {
          if (lenis.options.smoothWheel && event instanceof WheelEvent && !event.ctrlKey && isTrackpad(event)) {
            // Voor de rest van het bezoek native; Lenis stopt dan zelf een lopende animatie.
            lenis.options.smoothWheel = false;
          }
          return true;
        },
      });
      lenisInstance = lenis;

      // Eigen klok, tot een pagina met ScrollTrigger om de GSAP-klok vraagt.
      let frame = 0;
      const eigenTick = (tijd: number) => {
        lenis.raf(tijd);
        frame = requestAnimationFrame(eigenTick);
      };
      frame = requestAnimationFrame(eigenTick);

      let gsapTick: ((tijd: number) => void) | null = null;
      koppelNu = () => {
        if (!gsapKoppeling || gsapTick) return;
        const { gsap, ScrollTrigger } = gsapKoppeling;
        cancelAnimationFrame(frame);
        lenis.on("scroll", ScrollTrigger.update);
        gsapTick = (tijd: number) => lenis.raf(tijd * 1000);
        gsap.ticker.add(gsapTick);
        gsap.ticker.lagSmoothing(0);
      };
      koppelNu();

      stop = () => {
        cancelAnimationFrame(frame);
        if (gsapTick && gsapKoppeling) gsapKoppeling.gsap.ticker.remove(gsapTick);
        koppelNu = null;
        lenis.destroy();
        lenisInstance = null;
      };
    })();

    return () => {
      opgeruimd = true;
      stop?.();
    };
  }, []);

  // Jump to top instantly on route change (matches the old window.scrollTo).
  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
};

export default SmoothScroll;
