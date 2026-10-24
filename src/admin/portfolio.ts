import { projects as portfolio } from "@/data/projects";

/**
 * Hetzelfde beeld als op de publieke portfoliopagina, opgezocht via de slug
 * die al op het project staat. Zo blijft er één bron: vervang je de foto op de
 * site, dan verandert hij hier mee.
 */
const beeldPerSlug = new Map(portfolio.map((p) => [p.slug, p.image]));

export function portfolioBeeld(slug: string | null | undefined): string | undefined {
  return slug ? beeldPerSlug.get(slug) : undefined;
}
