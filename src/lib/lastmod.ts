import { LASTMOD } from "@/data/lastmod";

/**
 * Laatste inhoudelijke wijziging van een pagina, uit dezelfde bron als de
 * lastmod in de sitemap (git, met de gecommitte sitemap als vangnet; zie
 * scripts/generate-sitemap.ts). Nooit eerder dan `minimaal`, de
 * publicatiedatum: een wijziging kan niet vóór de publicatie liggen.
 */
export function laatstGewijzigd(pad: string, minimaal: string): string {
  const datum = LASTMOD[pad];
  return datum && datum > minimaal ? datum : minimaal;
}
