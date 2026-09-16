import { useEffect, useState } from "react";

/**
 * Open- en dichtklappen zonder de inhoud te unmounten.
 *
 * FAQ-antwoorden moeten altijd in de HTML staan: crawlers en AI-modellen voeren
 * geen JavaScript uit, dus een antwoord dat pas bij openen mount bestaat voor
 * hen niet. Dicht is het paneel `hidden` (niet zichtbaar, niet in de
 * toegankelijkheidsboom), maar de tekst staat in de bron.
 *
 * Twee standen, zodat de animatie werkt: bij openen eerst `hidden` eraf en een
 * frame later uitklappen; bij dichtklappen eerst inklappen en na de duur pas
 * `hidden` erop. Op de server en bij de eerste render kloppen beide al met
 * `open`, dus geen hydration-verschil.
 */
export function useCollapse(open: boolean, durationMs: number) {
  const [hidden, setHidden] = useState(!open);
  const [expanded, setExpanded] = useState(open);

  useEffect(() => {
    if (open) {
      setHidden(false);
      let tweede = 0;
      const eerste = requestAnimationFrame(() => {
        tweede = requestAnimationFrame(() => setExpanded(true));
      });
      return () => {
        cancelAnimationFrame(eerste);
        cancelAnimationFrame(tweede);
      };
    }
    setExpanded(false);
    const timer = window.setTimeout(() => setHidden(true), durationMs);
    return () => window.clearTimeout(timer);
  }, [open, durationMs]);

  return { hidden, expanded };
}
