import { projects, type Project } from "@/data/projects";

/**
 * De cases voor een landingspagina: eerst de slugs die bij die pagina horen,
 * aangevuld met de nieuwste tot er zes staan. Zo toont elke pagina evenveel
 * werk, ook als er maar één of twee relevante cases zijn, en zonder dubbele.
 *
 * De volgorde van src/data/projects.ts is nieuwste eerst.
 */
export function kiesCases(voorkeurSlugs: string[] = [], aantal = 6): Project[] {
  const gekozen: Project[] = [];
  const voegToe = (project: Project | undefined) => {
    if (project && gekozen.length < aantal && !gekozen.some((p) => p.slug === project.slug)) gekozen.push(project);
  };

  for (const slug of voorkeurSlugs) voegToe(projects.find((p) => p.slug === slug));
  for (const project of projects) voegToe(project);
  return gekozen;
}
