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
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis/dist/lenis.css"),
      ]);
      if (opgeruimd) return;
      gsap.registerPlugin(ScrollTrigger);

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

      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      stop = () => {
        gsap.ticker.remove(tick);
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
