import { useEffect, type RefObject } from "react";

/**
 * Consistent, professional scroll reveal for section headings + subheadings.
 * Tag elements with the `sw-reveal` class and pass the section's ref as scope.
 * Elements rise + fade in, staggered, once, with expo-out easing. Respects
 * prefers-reduced-motion (no animation, content simply visible).
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>(".sw-reveal");
    if (!items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let weg = false;
    let ruimOp: (() => void) | undefined;
    // GSAP pas ophalen als er iets te onthullen valt; een sectie zonder animatie
    // laadt hem zo niet voor niets.
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (weg) return;
      // Al in beeld toen GSAP binnenkwam: laten staan, anders verdwijnt de tekst
      // eerst weer om daarna opnieuw binnen te komen.
      if (root.getBoundingClientRect().top < window.innerHeight * 0.8) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from(items, {
          y: 26,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });
      });
      ruimOp = () => ctx.revert();
    });
    return () => {
      weg = true;
      ruimOp?.();
    };
  }, [scope]);
}
