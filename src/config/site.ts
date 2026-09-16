/**
 * De ene host waarop nieuwblik.com draait.
 *
 * https://www.nieuwblik.com 301't naar deze host (gemeten 16-09-2026, via
 * HadoSEO). Canonicals, og:url, sitemap, robots.txt en JSON-LD moeten dus
 * allemaal hierop wijzen; een canonical naar de host die zelf redirect is
 * een tegenstrijdig signaal voor Google.
 *
 * Bewust zonder imports, zodat ook de Node-scripts (sitemapgenerator,
 * verificatie) deze waarde kunnen lezen.
 */
export const SITE_URL = "https://nieuwblik.com";

/** Absolute URL voor een pad op de site. `absoluteUrl("/")` geeft de homepage zonder slash. */
export const absoluteUrl = (path: string): string =>
  path === "/" || path === "" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
