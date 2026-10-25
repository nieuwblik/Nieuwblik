import { useCallback } from "react";
import { useNavigate, type NavigateOptions } from "react-router-dom";

type MetOvergang = Document & { startViewTransition?: (bijwerken: () => Promise<void>) => unknown };

/** Hooguit zo lang wacht de overgang op de nieuwe pagina; daarna gaat hij toch door. */
const MAX_WACHTEN = 400;

/**
 * Wacht tot de nieuwe pagina echt in de DOM staat. De router werkt in een
 * React-transitie (v7_startTransition), dus de wissel is er niet meteen na
 * navigate(). De schil van het portaal zet het huidige pad op data-pad, in
 * dezelfde commit als de nieuwe pagina; zodra dat klopt, kan de overgang het
 * nieuwe beeld vastleggen. Op een gewone DOM-verandering wachten was niet
 * genoeg: de timer in de bovenbalk tikt ook.
 */
function naNavigeren(navigeer: () => void, pad: string): Promise<void> {
  return new Promise((klaar) => {
    const begin = performance.now();
    navigeer();
    const kijk = () => {
      const huidig = document.querySelector<HTMLElement>("[data-pad]")?.dataset["pad"];
      if (huidig === pad || performance.now() - begin > MAX_WACHTEN) {
        // Nog één tik, zodat de browser de nieuwe opmaak heeft berekend.
        window.setTimeout(klaar, 16);
        return;
      }
      window.setTimeout(kijk, 8);
    };
    kijk();
  });
}

/**
 * Navigeren met een vloeiende overgang: de oude pagina vervaagt kort in de
 * nieuwe (de View Transitions-API van de browser, vormgegeven in styles.css).
 * Zonder ondersteuning, of met minder beweging ingesteld, gewoon direct.
 *
 * De router van het portaal is geen data-router, dus de viewTransition-optie
 * van react-router werkt hier niet; daarom deze eigen variant.
 */
export function vloeiendNavigeren(navigeer: () => void, naar: string) {
  const doc = document as MetOvergang;
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    navigeer();
    return;
  }
  const pad = naar.split(/[?#]/)[0]!.replace(/\/$/, "") || "/";
  doc.startViewTransition(() => naNavigeren(navigeer, pad));
}

export function useVloeiendNaar() {
  const navigate = useNavigate();
  return useCallback(
    (naar: string, opties?: NavigateOptions) => vloeiendNavigeren(() => navigate(naar, opties), naar),
    [navigate],
  );
}
