import { useCallback, useSyncExternalStore } from "react";

const SLEUTEL = "nieuwblik:portaal:banksaldo-verborgen";
const EVENT = "portaal:banksaldo-verborgen";

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
 * Het banksaldo verbergen, bijvoorbeeld als iemand meekijkt. De keuze wordt
 * per browser onthouden en geldt op het dashboard en op Financiën tegelijk.
 */
export function useSaldoVerborgen() {
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
  return { verborgen, wissel };
}
