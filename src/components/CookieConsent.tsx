import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Cookie } from "lucide-react";
import { OPEN_COOKIEKEUZE, accepteerCookies, leesCookiekeuze, weigerCookies } from "@/lib/consent";

/** Zo lang duurt het wegschuiven; daarna verdwijnt de melding uit de DOM. */
const WEG_MS = 300;

/**
 * De cookiemelding als balk onderin. Binnenkomen en weggaan met CSS
 * (@starting-style en een transitie, zie .cookie-balk in styles.css) in plaats
 * van framer-motion: die bibliotheek hoeft zo niet mee op elke pagina.
 */
const CookieConsent = () => {
  const [zichtbaar, setZichtbaar] = useState(false);
  const [weg, setWeg] = useState(false);

  useEffect(() => {
    // Vanaf de cookiepagina gaat de melding weer open om de keuze te wijzigen.
    const open = () => {
      setWeg(false);
      setZichtbaar(true);
    };
    window.addEventListener(OPEN_COOKIEKEUZE, open);
    // Even wachten, zodat de melding niet tegelijk met de pagina binnenkomt.
    const timer = leesCookiekeuze() ? undefined : window.setTimeout(open, 1500);
    return () => {
      window.removeEventListener(OPEN_COOKIEKEUZE, open);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!weg) return;
    const t = window.setTimeout(() => setZichtbaar(false), WEG_MS);
    return () => window.clearTimeout(t);
  }, [weg]);

  const kies = (keuze: () => void) => {
    keuze();
    setWeg(true);
  };

  if (!zichtbaar) return null;

  return (
    <section
      aria-label="Cookiemelding"
      className="cookie-balk fixed bottom-0 left-0 right-0 z-[70] px-4 py-3 md:py-4 bg-background/95 backdrop-blur-xs border-t border-border shadow-lg"
      data-weg={weg ? "" : undefined}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 md:gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="cookie-icoon w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0 mt-0.5 md:mt-1" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-0.5 md:mb-1">We gebruiken cookies</h3>
              <p className="text-xs leading-snug md:text-sm text-muted-foreground">
                We gebruiken cookies om je ervaring te verbeteren en onze website te optimaliseren. Door op "Accepteren" te klikken, stem je in met ons gebruik van cookies.
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => kies(weigerCookies)}
              className="flex-1 md:flex-none h-9 md:h-10 transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
            >
              Weigeren
            </Button>
            <Button
              onClick={() => kies(accepteerCookies)}
              className="flex-1 md:flex-none h-9 md:h-10 bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none"
            >
              Accepteren
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookieConsent;
