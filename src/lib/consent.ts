/**
 * De cookiekeuze van de bezoeker. Google Analytics en Google Ads laden alleen
 * na "Accepteren": zonder keuze of na "Weigeren" gaat er niets naar Google.
 * Het script zelf staat in routes/__root.tsx (GA_SCRIPT) en leest dezelfde
 * sleutel, zodat een eerdere keuze ook bij het eerste laden geldt.
 */
const SLEUTEL = "cookieConsent";
const GA_ID = "G-8DLGZ42KPP";

/** Vraagt de cookiemelding om weer open te gaan, vanaf de cookiepagina. */
export const OPEN_COOKIEKEUZE = "nieuwblik:cookiekeuze";

type GoogleVenster = Window & {
  laadGoogle?: () => void;
  gtag?: (...args: unknown[]) => void;
} & Record<string, unknown>;

const venster = () => window as unknown as GoogleVenster;

export function leesCookiekeuze(): string | null {
  try {
    return window.localStorage.getItem(SLEUTEL);
  } catch {
    return null;
  }
}

function bewaar(keuze: "accepted" | "declined") {
  try {
    window.localStorage.setItem(SLEUTEL, keuze);
  } catch {
    // Opslag geblokkeerd: de keuze geldt dan alleen voor dit bezoek.
  }
}

export function accepteerCookies() {
  bewaar("accepted");
  venster()[`ga-disable-${GA_ID}`] = false;
  venster().laadGoogle?.();
}

/**
 * Ook voor wie eerder accepteerde: het script stopt met meten en de
 * Analytics-cookies gaan weg, op het hoofddomein waar ze zijn gezet.
 */
export function weigerCookies() {
  bewaar("declined");
  venster()[`ga-disable-${GA_ID}`] = true;
  venster().gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  const domein = window.location.hostname.replace(/^www\./, "");
  for (const cookie of document.cookie.split(";")) {
    const naam = cookie.split("=")[0]?.trim();
    if (!naam || !/^(_ga|_gid|_gat|_gcl)/.test(naam)) continue;
    document.cookie = `${naam}=; Max-Age=0; path=/`;
    document.cookie = `${naam}=; Max-Age=0; path=/; domain=.${domein}`;
  }
}

/** Een aanvraag als conversie, alleen voor wie toestemming gaf. */
export function meetAanvraag(formulier: string) {
  if (leesCookiekeuze() !== "accepted") return;
  // Wie snel is, was er eerder dan het uitgestelde script: eerst laden, dan
  // staat de toestemming in de wachtrij vóór deze meting.
  venster().laadGoogle?.();
  venster().gtag?.("event", "generate_lead", { formulier });
}
