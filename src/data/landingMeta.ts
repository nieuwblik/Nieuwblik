import { PRIJZEN } from "@/config/business";

/**
 * Handgeschreven titel en meta description voor gegenereerde landingspagina's
 * (src/data/cities.ts en industries.ts komen uit scripts/generate-landing-data.mjs
 * en wisselen titels af met achtervoegsels als "| AI Webdesign").
 *
 * Alleen voor pagina's die (nog) geen volledige handgeschreven tekst hebben:
 * staat een stad in src/data/cityLokaal.ts, dan gaat die voor. Volgorde:
 * cityLokaal → landingMeta → gegenereerd.
 *
 * Gekozen op basis van Search Console (export 05-10-2026): de titel volgt waar
 * mensen echt op zoeken. Titel maximaal 60 tekens, description maximaal 155.
 */
export interface LandingMeta {
  title: string;
  metaDescription: string;
}

const stad = (naam: string): LandingMeta => ({
  title: `Website laten maken ${naam} vanaf €${PRIJZEN.starter} | Nieuwblik`,
  metaDescription: `Meer klanten met een snelle website op maat in ${naam}. Vanaf €${PRIJZEN.starter} en binnen 2 tot 4 weken live. Vraag vrijblijvend een offerte aan.`,
});

export const landingMeta: Record<string, LandingMeta> = {
  // Steden
  utrecht: stad("Utrecht"),
  amersfoort: stad("Amersfoort"),
  delft: stad("Delft"),

  // Branches
  kapper: {
    title: "Website laten maken voor kappers en kapsalons | Nieuwblik",
    metaDescription: `Website laten maken als kapper of kapsalon? Online afspraken, je werk in beeld en goed vindbaar in je regio. Vanaf €${PRIJZEN.starter} en binnen 2 tot 4 weken live.`,
  },
  interieurontwerper: {
    title: "Website laten maken voor interieurontwerpers | Nieuwblik",
    metaDescription: `Website laten maken als interieurontwerper? Je projecten groot in beeld en goed vindbaar in je regio. Vanaf €${PRIJZEN.starter} en binnen 2 tot 4 weken live.`,
  },
  tuinman: {
    title: "Website laten maken voor hoveniers en tuinmannen | Nieuwblik",
    metaDescription: `Website laten maken als hovenier of tuinman? Je tuinen in beeld, eenvoudig een offerte aanvragen en goed vindbaar. Vanaf €${PRIJZEN.starter}, in 2 tot 4 weken live.`,
  },
};

export const getLandingMeta = (slug: string): LandingMeta | undefined =>
  landingMeta[slug];
