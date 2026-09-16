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
];

const BY_PATH = new Map(REDIRECTS.map((r) => [r.from, r.to]));

/** Bestemming voor een pad, of undefined. Een trailing slash telt niet mee. */
export function findRedirect(pathname: string): string | undefined {
  const pad = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return BY_PATH.get(pad);
}
