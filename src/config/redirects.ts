/**
 * Permanente redirects (301), server-side afgehandeld in src/server.ts voordat
 * de router draait. Dezelfde tabel is de bron voor redirects.csv, de import
 * voor HadoSEO: die serveert de live site en moet dezelfde regels kennen.
 *
 * Uitgangspunt: altijd naar de dichtstbijzijnde inhoudelijke opvolger. Een 301
 * naar een overzichtspagina leest Google vaak als soft 404, en dan gaat de
 * opgebouwde waarde alsnog verloren.
 *
 * Bewust zonder imports, zodat de Node-scripts (CSV, verificatie) hem kunnen lezen.
 */
export interface Redirect {
  /** Pad zonder trailing slash, exact zoals het in Google of in oude links staat. */
  from: string;
  /** Pad op deze site. De absolute URL wordt gebouwd met SITE_URL. */
  to: string;
  /** Waarom juist deze bestemming. */
  reden: string;
}

// Defect 2: /website-laten-maken-{stad} is de landelijke pagina per stad. De
// /werkgebied/{stad}-varianten mikten op hetzelfde zoekwoord en zijn opgeheven;
// /werkgebied blijft alleen voor de West-Friese plaatsen.
const OPGEHEVEN_WERKGEBIED_STEDEN = [
  "amsterdam",
  "rotterdam",
  "den-haag",
  "utrecht",
  "eindhoven",
  "groningen",
  "tilburg",
  "almere",
  "breda",
  "nijmegen",
  "alkmaar",
] as const;

export const REDIRECTS: Redirect[] = [
  ...OPGEHEVEN_WERKGEBIED_STEDEN.map((stad) => ({
    from: `/werkgebied/${stad}`,
    to: `/website-laten-maken-${stad}`,
    reden: "Kannibalisatie: zelfde zoekwoord als de landelijke stadspagina",
  })),

  // Defect 3: routes van vóór de migratie. De git-historie begint pas bij
  // Lovable (nov 2025); deze paden komen uit het Wayback Machine-archief.

  // Oude Webflow-site
  { from: "/webdesign", to: "/diensten", reden: "Oude dienstenpagina, opvolger is het dienstenoverzicht" },
  { from: "/seo", to: "/seo-enkhuizen", reden: "Oude SEO-dienstpagina" },
  { from: "/prijzen", to: "/website-laten-maken", reden: "Prijzen en pakketten staan op de verkooppagina" },
  { from: "/ecommerce", to: "/diensten/e-commerce", reden: "Zelfde dienst, nieuw pad" },
  { from: "/diensten/ecommerce", to: "/diensten/e-commerce", reden: "Zelfde dienst, pad zonder streepje" },
  { from: "/listings", to: "/diensten/e-commerce", reden: "Product listings vallen onder de e-commercedienst" },
  { from: "/social-media", to: "/diensten", reden: "Socialblok staat op het dienstenoverzicht" },
  { from: "/grafische-vormgeving", to: "/diensten", reden: "Brandingblok staat op het dienstenoverzicht" },
  { from: "/cookiebeleid", to: "/cookies", reden: "Zelfde pagina, nieuw pad" },
  { from: "/privacybeleid", to: "/privacy", reden: "Zelfde pagina, nieuw pad" },

  // Oude cases
  { from: "/project-esveld", to: "/portfolio/esveld-installatie", reden: "Zelfde case" },
  { from: "/project-kyodai", to: "/portfolio/kyodai-originals", reden: "Zelfde case" },
  { from: "/project-rrs", to: "/portfolio/rrs-royal", reden: "Zelfde case" },
  { from: "/project-lashlution", to: "/portfolio/puur-in-harmonie", reden: "Case bestaat niet meer; Puur in Harmonie is de case in dezelfde branche (beauty & wellness)" },
  { from: "/portfolio/lashlution", to: "/portfolio/puur-in-harmonie", reden: "Case bestaat niet meer; Puur in Harmonie is de case in dezelfde branche (beauty & wellness)" },
  { from: "/portfolio/vdv-tuinen", to: "/portfolio/green-profit", reden: "Case bestaat niet meer; Green Profit is de dichtstbijzijnde case (groen, buitenruimte)" },

  // Verwijderde blogs, elk naar de inhoudelijk dichtstbijzijnde opvolger
  { from: "/blog/seo-fundamentals-gevonden-worden", to: "/blog/vindbaar-in-chatgpt-geo-west-friesland", reden: "Gevonden worden: GEO bouwt voort op dezelfde SEO-basis" },
  { from: "/blog/lovable-websites-bouwen", to: "/blog/figma-hadoseo-lovable-perfecte-website", reden: "Websites bouwen met Lovable" },
  { from: "/blog/lovable-websites-bouwen-met-ai", to: "/blog/figma-hadoseo-lovable-perfecte-website", reden: "Websites bouwen met Lovable (variant van dezelfde slug)" },
  { from: "/blog/bolt-new-ai-website-builder", to: "/blog/replit-online-code-editor-ai", reden: "AI-bouwer in de browser; Replit is ook browsergebaseerd, Cursor is een desktopeditor" },
  { from: "/blog/waarom-snelle-websites-meer-verkopen", to: "/blog/case-study-benoted-snelheid-zichtbaarheid", reden: "Laadtijd en resultaat; de BeNoted-case gaat over snelheid" },
  { from: "/blog/van-bezoeker-naar-klant-conversie-optimalisatie", to: "/gratis-website-analyse", reden: "Geen blog over conversie meer; de website-analyse behandelt conversie en snelheid het uitgebreidst" },
  { from: "/blog/wordpress-vs-maatwerk-website", to: "/diensten/website-op-maat", reden: "Keuze voor maatwerk, verwijderd 14-09-2026" },
  { from: "/blog/wat-kost-website-laten-maken-2026", to: "/website-laten-maken", reden: "Prijzen staan op de verkooppagina, verwijderd 14-09-2026" },
];

const BY_PATH = new Map(REDIRECTS.map((r) => [r.from, r.to]));

/** Bestemming voor een pad, of undefined. Een trailing slash telt niet mee. */
export function findRedirect(pathname: string): string | undefined {
  const pad = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return BY_PATH.get(pad);
}
