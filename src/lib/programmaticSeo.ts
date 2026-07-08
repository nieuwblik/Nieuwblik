// Deterministic title/description generation for the programmatic
// "/website-laten-maken-{slug}" landing pages (cities + branches).
//
// Titles and descriptions are computed at render time from the item's own
// `name`/`slug` rather than read from a hand-authored field in cities.ts /
// industries.ts — that guarantees every slug resolves to its own value
// (nothing to leave blank or typo), and guarantees the exact same result on
// every render (same slug -> same output), which matters for prerender
// consistency.

// Small stable string hash (djb2-style) — same slug always produces the same
// number, so the rotating description template is deterministic per page
// rather than random per render.
function hashSlug(slug: string): number {
  let hash = 5381;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 33) ^ slug.charCodeAt(i);
  }
  return hash >>> 0;
}

function pickTemplate<T>(slug: string, templates: T[]): T {
  return templates[hashSlug(slug) % templates.length];
}

// Title, max 60 chars: `Website Laten Maken {Name} | Webdesign - Nieuwblik`,
// shortened step by step (drop brand, then drop category) if the name is
// long enough to push it over the limit.
export function buildLandingTitle(name: string): string {
  const withBrand = `Website Laten Maken ${name} | Webdesign - Nieuwblik`;
  if (withBrand.length <= 60) return withBrand;

  const withoutBrand = `Website Laten Maken ${name} | Webdesign`;
  if (withoutBrand.length <= 60) return withoutBrand;

  const short = `Website Laten Maken ${name}`;
  if (short.length <= 60) return short;

  return short.slice(0, 60).trim();
}

// Name is inserted exactly once per template (never twice) — city/branche
// names in this dataset range from 3 to 20 characters, and the fixed
// surrounding text is calibrated so that full range still lands at or near
// 140-160 chars: too much fixed text and short names (e.g. "Ede", "Kapper")
// fall short; too little and long names (e.g. "Verzekeringsadviseur") blow
// past 160.
const CITY_DESCRIPTION_TEMPLATES: Array<(name: string) => string> = [
  (name) =>
    `Website laten maken in ${name}? Nieuwblik bouwt snelle, vindbare websites en webshops op maat voor ondernemers in de regio. Binnen 1 week live.`,
  (name) =>
    `Nieuwblik helpt ondernemers in ${name} aan een snelle, professionele website of webshop die goed scoort in Google. Vraag een voorstel op maat aan.`,
  (name) =>
    `Op zoek naar een nieuwe website of webshop voor jouw bedrijf in ${name}? Nieuwblik bouwt snelle, SEO-vriendelijke sites voor lokale ondernemers.`,
];

const INDUSTRY_DESCRIPTION_TEMPLATES: Array<(name: string) => string> = [
  (name) =>
    `Als ${name} een sterke, professionele website nodig? Nieuwblik bouwt snelle, SEO-vriendelijke sites die nieuwe klanten opleveren voor je bedrijf.`,
  (name) =>
    `Werk je zelf als ${name} en wil je meer klanten via internet vinden? Nieuwblik bouwt snelle websites die perfect zijn afgestemd op jouw branche.`,
  (name) =>
    `Nieuwblik ontwikkelt professionele en moderne websites voor de ${name}-branche: snel, betaalbaar en gericht op meer nieuwe klanten en omzet.`,
];

// name: proper-cased city name (e.g. "Enkhuizen", "Den Haag")
export function buildCityDescription(slug: string, name: string): string {
  return pickTemplate(slug, CITY_DESCRIPTION_TEMPLATES)(name);
}

// name: proper-cased branche name (e.g. "Architect") — lowercased here since
// every template reads it mid-sentence ("als architect", "de architect-branche").
export function buildIndustryDescription(slug: string, name: string): string {
  return pickTemplate(slug, INDUSTRY_DESCRIPTION_TEMPLATES)(name.toLowerCase());
}
