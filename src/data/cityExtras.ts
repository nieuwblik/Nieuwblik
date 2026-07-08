// Supplemental, city-specific content for the programmatic city landing pages
// (/website-laten-maken-{slug}). Kept separate from cities.ts (auto-generated
// — see its own header) so this hand-authored content never gets overwritten.
//
// FLAG FOR HUMAN REVIEW: `region` and `nearby` were drafted from general
// knowledge of Dutch geography, not verified against an authoritative source.
// Please double-check both before this ships — a wrong province or a
// "nearby" town that isn't actually close is a factual claim on a public
// page. `nearby` only ever references slugs that already exist in cities.ts.
export interface CityExtra {
  slug: string;
  region: string;
  nearby: string[];
}

export const cityExtras: CityExtra[] = [
  { slug: "amsterdam", region: "Noord-Holland", nearby: ["haarlem", "zaanstad", "almere"] },
  { slug: "rotterdam", region: "Zuid-Holland", nearby: ["den-haag", "dordrecht", "delft", "zoetermeer"] },
  { slug: "den-haag", region: "Zuid-Holland", nearby: ["delft", "zoetermeer", "rotterdam", "leiden"] },
  { slug: "utrecht", region: "Utrecht", nearby: ["amersfoort", "ede"] },
  { slug: "eindhoven", region: "Noord-Brabant", nearby: ["tilburg", "den-bosch"] },
  { slug: "groningen", region: "Groningen", nearby: ["leeuwarden", "emmen"] },
  { slug: "tilburg", region: "Noord-Brabant", nearby: ["breda", "eindhoven", "den-bosch"] },
  { slug: "almere", region: "Flevoland", nearby: ["amsterdam"] },
  { slug: "breda", region: "Noord-Brabant", nearby: ["tilburg", "den-bosch"] },
  { slug: "nijmegen", region: "Gelderland", nearby: ["arnhem", "ede"] },
  { slug: "arnhem", region: "Gelderland", nearby: ["nijmegen", "apeldoorn", "ede"] },
  { slug: "apeldoorn", region: "Gelderland", nearby: ["arnhem", "zwolle", "deventer"] },
  { slug: "haarlem", region: "Noord-Holland", nearby: ["amsterdam", "zaanstad", "alkmaar"] },
  { slug: "amersfoort", region: "Utrecht", nearby: ["utrecht", "ede", "apeldoorn"] },
  { slug: "zaanstad", region: "Noord-Holland", nearby: ["amsterdam", "alkmaar", "haarlem"] },
  { slug: "enschede", region: "Overijssel", nearby: ["deventer", "zwolle"] },
  { slug: "den-bosch", region: "Noord-Brabant", nearby: ["tilburg", "eindhoven", "breda"] },
  { slug: "zwolle", region: "Overijssel", nearby: ["deventer", "apeldoorn", "enschede"] },
  { slug: "zoetermeer", region: "Zuid-Holland", nearby: ["den-haag", "rotterdam", "delft"] },
  { slug: "leiden", region: "Zuid-Holland", nearby: ["den-haag", "delft", "zoetermeer"] },
  { slug: "maastricht", region: "Limburg", nearby: ["venlo"] },
  { slug: "dordrecht", region: "Zuid-Holland", nearby: ["rotterdam", "westland"] },
  { slug: "ede", region: "Gelderland", nearby: ["arnhem", "nijmegen", "amersfoort"] },
  { slug: "delft", region: "Zuid-Holland", nearby: ["den-haag", "rotterdam", "zoetermeer"] },
  { slug: "venlo", region: "Limburg", nearby: ["maastricht"] },
  { slug: "deventer", region: "Overijssel", nearby: ["zwolle", "apeldoorn", "enschede"] },
  { slug: "westland", region: "Zuid-Holland", nearby: ["den-haag", "delft", "rotterdam"] },
  { slug: "alkmaar", region: "Noord-Holland", nearby: ["haarlem", "zaanstad", "amsterdam"] },
  { slug: "emmen", region: "Drenthe", nearby: ["groningen"] },
  { slug: "leeuwarden", region: "Friesland", nearby: ["groningen", "emmen"] },
];

export const getCityExtra = (slug: string): CityExtra | undefined =>
  cityExtras.find((e) => e.slug === slug);
