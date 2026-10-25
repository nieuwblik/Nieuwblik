import { useCallback } from "react";
import { useNavigate, type NavigateOptions } from "react-router-dom";

type MetOvergang = Document & { startViewTransition?: (bijwerken: () => Promise<void>) => unknown };

/**
 * Wacht tot de nieuwe pagina in de DOM staat. De router werkt in een React-
 * transitie (v7_startTransition), dus de wissel is er niet meteen na
 * navigate(); de eerste verandering in de pagina, plus een frame, is het
 * moment waarop de overgang het nieuwe beeld kan vastleggen.
 */
function naNavigeren(navigeer: () => void): Promise<void> {
  return new Promise((klaar) => {
    let gedaan = false;
    const af = () => {
      if (gedaan) return;
      gedaan = true;
      waarnemer.disconnect();
      requestAnimationFrame(() => klaar());
    };
    const waarnemer = new MutationObserver(af);
    waarnemer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(af, 600);
    navigeer();
  });
}

/**
 * Navigeren met een vloeiende overgang: de oude pagina vervaagt in de nieuwe
 * (de View Transitions-API van de browser, vormgegeven in styles.css). Zonder
 * ondersteuning, of met minder beweging ingesteld, gewoon direct.
 *
 * De router van het portaal is geen data-router, dus de viewTransition-optie
 * van react-router werkt hier niet; daarom deze eigen variant.
 */
export function vloeiendNavigeren(navigeer: () => void) {
  const doc = document as MetOvergang;
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    navigeer();
    return;
  }
  doc.startViewTransition(() => naNavigeren(navigeer));
}

export function useVloeiendNaar() {
  const navigate = useNavigate();
  return useCallback((naar: string, opties?: NavigateOptions) => vloeiendNavigeren(() => navigate(naar, opties)), [navigate]);
}
