import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Consistent, professional scroll reveal for section headings + subheadings.
 * Tag elements with the `sw-reveal` class and pass the section's ref as scope.
 * Elements rise + fade in, staggered, once, with expo-out easing. Respects
 * prefers-reduced-motion (no animation, content simply visible).
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const items = root.querySelectorAll<HTMLElement>(".sw-reveal");
      if (!items.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(items, {
          y: 26,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });
      });
    },
    { scope }
  );
}
