import { companyInfo } from "@/config/company";

/**
 * Server-side kop-metadata per route.
 *
 * Spiegelt exact wat SEOHead client-side zet (titel, description, robots,
 * Open Graph, Twitter, canonical, hreflang) zodat crawlers dezelfde waarden
 * in de HTML zien. SEOHead blijft daarnaast client-side draaien voor de
 * JSON-LD-blokken per pagina, precies zoals voor de migratie.
 */
export interface HeadSeo {
  title: string;
  description: string;
  keywords?: string | undefined;
  /** Volledige canonical-URL. Verplicht voor indexeerbare pagina's. */
  canonical?: string | undefined;
  ogImage?: string | undefined;
  ogType?: string | undefined;
  noIndex?: boolean | undefined;
}

type MetaEntry =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

type LinkEntry = { rel: string; href: string; hrefLang?: string };

export function buildHead(seo: HeadSeo): { meta: MetaEntry[]; links: LinkEntry[] } {
  const ogImage = seo.ogImage ?? `${companyInfo.url}/og-image.webp`;
  const canonical = seo.canonical;

  const meta: MetaEntry[] = [
    { title: seo.title },
    { name: "description", content: seo.description },
    {
      name: "robots",
      content: seo.noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: seo.title },
    { property: "og:type", content: seo.ogType ?? "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: seo.title },
  ];

  if (seo.keywords) {
    meta.push({ name: "keywords", content: seo.keywords });
  }
  if (canonical) {
    meta.push({ property: "og:url", content: canonical });
    meta.push({ name: "twitter:url", content: canonical });
  }

  const links: LinkEntry[] = [];
  if (canonical) {
    links.push({ rel: "canonical", href: canonical });
    links.push({ rel: "alternate", hrefLang: "nl", href: canonical });
    links.push({ rel: "alternate", hrefLang: "x-default", href: canonical });
  }

  return { meta, links };
}
