import { useEffect, type RefObject } from "react";
import type { GolfInstellingen } from "@/components/golf/golfMotor";

/** Waar de golf staat. Het afstelpaneel slaat per plek apart op. */
export type GolfPlek = "home" | "analyse";

/**
 * Start de zijden golf (WebGL) in een hero met de klasse golf-hero.
 *
 * - Per keer een nieuw canvas in vlakRef; hero krijgt golf-klaar zodra het eerste
 *   beeld er is, tot die tijd staat het terugvalbeeld er.
 * - De engine wordt pas na de eerste paint geladen, zodat hij niet in de
 *   hoofdbundel zit en de tekst (LCP) niet ophoudt.
 * - Afstelpaneel (toets p): in de ontwikkelomgeving altijd, elders met ?afstellen.
 */
export function useGolf(
  heroRef: RefObject<HTMLElement | null>,
  vlakRef: RefObject<HTMLDivElement | null>,
  instellingen: GolfInstellingen,
  plek: GolfPlek,
) {
  useEffect(() => {
    const hero = heroRef.current,
      vlak = vlakRef.current;
    if (!hero || !vlak) return;
    // Een canvas waarvan de context bij het opruimen is vrijgegeven, kan niet
    // opnieuw worden gebruikt.
    const canvas = document.createElement("canvas");
    canvas.className = "golf-hero__canvas";
    canvas.setAttribute("aria-hidden", "true");
    vlak.appendChild(canvas);
    const opruimen: (() => void)[] = [];
    let weg = false;
    const zoek = new URLSearchParams(location.search);
    import("@/components/golf/golfMotor")
      .then(({ startGolf }) => {
        if (weg) return;
        const motor = startGolf(canvas, instellingen, {
          opEersteBeeld: () => hero.classList.add("golf-klaar"),
          opVerloren: () => hero.classList.remove("golf-klaar"),
        });
        if (!motor) return;
        opruimen.push(motor.stop);

        if (zoek.has("golfvoorbeeld")) {
          // Mobiel voorbeeld in het afstelpaneel (iframe): instellingen komen van het paneel.
          const opBericht = (e: MessageEvent) => {
            if (
              e.origin !== location.origin ||
              e.data?.type !== "golf-instellingen"
            )
              return;
            motor.zet(e.data.instellingen);
            hero.classList.toggle(
              "golf-hero--gespiegeld",
              !!e.data.instellingen.opstelling?.spiegel,
            );
          };
          addEventListener("message", opBericht);
          opruimen.push(() => removeEventListener("message", opBericht));
          parent.postMessage({ type: "golf-voorbeeld-klaar" }, location.origin);
        } else if (import.meta.env.DEV || zoek.has("afstellen")) {
          import("@/components/golf/golfPaneel")
            .then(({ startPaneel }) => {
              if (!weg)
                opruimen.push(
                  startPaneel({ motor, hero, site: instellingen, plek }),
                );
            })
            .catch(() => {
              /* zonder paneel */
            });
        }
      })
      .catch(() => {
        /* terugvalbeeld blijft staan */
      });
    return () => {
      weg = true;
      opruimen.forEach((f) => f());
      canvas.remove();
      hero.classList.remove("golf-klaar");
      hero.classList.toggle(
        "golf-hero--gespiegeld",
        instellingen.opstelling.spiegel,
      );
    };
  }, [heroRef, vlakRef, instellingen, plek]);
}
