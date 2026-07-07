import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Shared instance so route changes can jump to top instantly.
let lenisInstance: Lenis | null = null;

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

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Jump to top instantly on route change (matches the old window.scrollTo).
  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
};

export default SmoothScroll;
