import { useEffect, useState } from "react";

/**
 * Of de bezoeker minder beweging wil.
 *
 * Doet hetzelfde als useReducedMotion van framer-motion, maar zonder die
 * bibliotheek binnen te halen. Componenten die verder niets animeren hoefden
 * daarvoor 400 KB mee te slepen, en die stonden allemaal in het kritieke pad
 * van de homepage.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
