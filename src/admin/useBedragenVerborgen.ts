import { useCallback, useSyncExternalStore } from "react";

import { formatBedrag } from "@/admin/financien";

const SLEUTEL = "nieuwblik:portaal:bedragen-verborgen";
const EVENT = "portaal:bedragen-verborgen";

/** Zo staat een verborgen bedrag in beeld. */
export const VERBORGEN = "€ ••••";

/** Ook zonder opslag (privévenster, geblokkeerd) werkt het oog, alleen zonder onthouden. */
let geheugen = false;

function lees(): boolean {
  try {
    const waarde = window.localStorage.getItem(SLEUTEL);
    if (waarde !== null) return waarde === "1";
  } catch {
    // geen toegang tot opslag
  }
  return geheugen;
}

function abonneer(melding: () => void) {
  // Eigen event voor de andere plekken op dezelfde pagina, storage voor andere tabbladen.
  window.addEventListener(EVENT, melding);
  window.addEventListener("storage", melding);
  return () => {
    window.removeEventListener(EVENT, melding);
    window.removeEventListener("storage", melding);
  };
}

/**
 * Alle financiële bedragen verbergen, bijvoorbeeld als iemand meekijkt. De
 * keuze wordt per browser onthouden en geldt overal tegelijk: Financiën, het
 * dashboard en de facturen op de klantpagina. Aantallen (zoals "3 te laat")
 * blijven staan; bedragen en percentages niet.
 */
export function useBedragenVerborgen() {
  const verborgen = useSyncExternalStore(abonneer, lees, () => false);
  const wissel = useCallback(() => {
    geheugen = !lees();
    try {
      window.localStorage.setItem(SLEUTEL, geheugen ? "1" : "0");
    } catch {
      // Opslag geblokkeerd: dan alleen niets onthouden.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  /** formatBedrag, of de puntjes als de bedragen verborgen zijn. */
  const bedrag = useCallback(
    (waarde: number, decimalen: "auto" | 0 = "auto") => (verborgen ? VERBORGEN : formatBedrag(waarde, decimalen)),
    [verborgen],
  );
  return { verborgen, wissel, bedrag };
}
