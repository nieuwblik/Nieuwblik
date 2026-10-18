import { PRIJZEN } from "@/config/business";

/** Prijsindicatie voor de kosten calculator op /wat-kost-een-website. */
export type SiteType = "starter" | "professional" | "webshop";
export type Extra = "teksten" | "meertalig" | "cms" | "logo" | "koppeling";

export const SITE_TYPES: Record<SiteType, { label: string; uitleg: string; basis: number }> = {
  starter: { label: "Kleine website", uitleg: "One-pager of tot 5 pagina's", basis: PRIJZEN.starter },
  professional: { label: "Complete website", uitleg: "Tot 10 pagina's met blog en SEO", basis: PRIJZEN.professional },
  webshop: { label: "Webshop", uitleg: "Producten verkopen met Stripe", basis: PRIJZEN.webshopVanaf },
};

export const EXTRAS: Record<Extra, { label: string; prijs: number }> = {
  teksten: { label: "Wij schrijven alle teksten", prijs: 250 },
  meertalig: { label: "Tweede taal", prijs: 400 },
  cms: { label: "Zelf teksten aanpassen (CMS)", prijs: 350 },
  logo: { label: "Nieuw logo", prijs: 300 },
  koppeling: { label: "Koppeling (agenda, kassa of CRM)", prijs: 450 },
};

export function berekenIndicatie(type: SiteType, extras: Extra[]): { van: number; tot: number } {
  const uniek = Array.from(new Set(extras));
  const van = SITE_TYPES[type].basis + uniek.reduce((som, e) => som + EXTRAS[e].prijs, 0);
  // Bovenkant: ruimte voor maatwerk, afgerond op tientallen.
  const tot = Math.round((van * 1.25) / 10) * 10;
  return { van, tot };
}
