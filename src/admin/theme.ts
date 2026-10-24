import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export type PortalTheme = "light" | "dark";

const KEY = "nieuwblik:portaal:thema";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

/** Opgeslagen keuze, anders wat het besturingssysteem aangeeft. */
function initialTheme(): PortalTheme {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Geblokkeerde opslag: dan volgen we gewoon het systeem.
  }
  return systemPrefersDark() ? "dark" : "light";
}

/**
 * Zet het opgeslagen thema op <html> nog voordat het portaal geladen is. Het
 * portaal is een losse chunk; zonder dit staat er tijdens het laden een wit
 * scherm, ook als je donker hebt gekozen. Het portaal zelf neemt het daarna
 * over en haalt de klassen weer weg als je het verlaat.
 */
export function zetThemaVroeg() {
  const root = document.documentElement;
  root.classList.toggle("dark", initialTheme() === "dark");
  root.classList.add("portaal");
}

/**
 * Thema van het portaal.
 *
 * De klasse gaat op <html> en niet op een wrapper in het portaal, omdat
 * Radix zijn dialogen, selects en het command-palet in document.body rendert.
 * Op een wrapper zouden die overlays licht blijven terwijl de rest donker is.
 *
 * Bij het verlaten van het portaal wordt de klasse weer verwijderd, zodat de
 * publieke site nooit in donkere modus terechtkomt: die heeft er geen ontwerp
 * voor en zou alleen zijn kleuren zien omslaan.
 */
export function usePortalTheme() {
  const [theme, setTheme] = useState<PortalTheme>(initialTheme);

  // Voor de eerste paint, anders flitst de pagina één frame in het verkeerde thema.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    // Merkt de pagina als portaal, zodat opmaak die niet via Tailwind kan —
    // de schuifbalken — alleen hier geldt en de publieke site ongemoeid laat.
    root.classList.add("portaal");
    return () => {
      root.classList.remove("dark");
      root.classList.remove("portaal");
    };
  }, [theme]);

  // Zolang er geen expliciete keuze is opgeslagen, blijft het portaal het
  // systeem volgen wanneer dat halverwege de dag omslaat.
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;

    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(KEY)) return;
      } catch {
        // Niet uit te lezen: dan het systeem volgen.
      }
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: PortalTheme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // Keuze geldt dan alleen deze sessie.
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
