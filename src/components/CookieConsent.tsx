import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Link } from "@/lib/router-compat";
import { OPEN_COOKIEKEUZE, accepteerCookies, leesCookiekeuze, weigerCookies } from "@/lib/consent";

/**
 * De cookiemelding als smalle balk onderin, zodat hij op een telefoon niet
 * het eerste scherm opeet. Beide knoppen zijn even groot: weigeren moet net zo
 * makkelijk zijn als accepteren, en doet ook echt iets (zie lib/consent.ts).
 * Vanaf de cookiepagina gaat de melding weer open om de keuze te wijzigen.
 */
const CookieConsent = () => {
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    const open = () => setZichtbaar(true);
    window.addEventListener(OPEN_COOKIEKEUZE, open);
    const timer = leesCookiekeuze() ? undefined : window.setTimeout(open, 1500);
    return () => {
      window.removeEventListener(OPEN_COOKIEKEUZE, open);
      window.clearTimeout(timer);
    };
  }, []);

  if (!zichtbaar) return null;

  return (
    <div
      role="region"
      aria-label="Cookievoorkeuren"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-background px-4 py-3"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[13px] leading-snug text-muted-foreground">
          Mogen we cookies gebruiken om te meten hoe de site wordt gebruikt en of onze advertenties werken?{" "}
          <Link to="/cookies" className="underline underline-offset-2 hover:text-foreground">
            Meer informatie
          </Link>
        </p>
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              weigerCookies();
              setZichtbaar(false);
            }}
          >
            Weigeren
          </Button>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => {
              accepteerCookies();
              setZichtbaar(false);
            }}
          >
            Accepteren
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
