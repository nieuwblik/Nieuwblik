import type gsap from "gsap";

/**
 * GSAP pas ophalen bij het eerste gebruik, voor effecten die alleen op hover
 * spelen. Zo laadt een telefoon de bibliotheek niet voor niets.
 */
export const metGsap = (doe: (g: typeof gsap) => void) => {
  void import("gsap").then((m) => doe(m.default));
};
