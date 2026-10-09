import { SITE_URL } from "@/config/site";
import type { Project } from "@/data/projects";

/** Maximale lengte van een meta description (zie de SEO-regels van het project). */
const MAX = 160;

/**
 * Meta description van een portfoliocase, zonder nieuwe tekst te verzinnen:
 * - hele zinnen uit de eerste alinea van de casetekst, zolang ze samen binnen
 *   160 tekens passen;
 * - is de eerste zin al langer, dan de korte omschrijving van de portfoliokaart;
 * - is ook die te lang, dan afgekapt op een heel woord met een beletselteken.
 * Zo wordt er nooit midden in een woord afgebroken.
 */
export function caseBeschrijving(project: Project): string {
  const alinea = (project.detail?.details?.split("\n\n")[0] ?? "").trim();
  const zinnen = alinea.match(/[^.!?]+[.!?]+(?=\s|$)/g)?.map((z) => z.trim()) ?? [];
  let tekst = "";
  for (const zin of zinnen) {
    const samen = tekst ? `${tekst} ${zin}` : zin;
    if (samen.length > MAX) break;
    tekst = samen;
  }
  if (tekst) return tekst;
  const kort = project.description.trim();
  if (kort.length <= MAX) return kort;
  return `${kort.slice(0, MAX - 1).replace(/\s+\S*$/, "")}…`;
}

/** Absolute URL van de projectafbeelding, voor og:image en twitter:image. */
export function caseAfbeelding(project: Project): string {
  return project.image.startsWith("http") ? project.image : `${SITE_URL}${project.image}`;
}
