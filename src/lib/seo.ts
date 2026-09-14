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
  /** Echte afmetingen van ogImage. Zonder deze worden ze bij een eigen beeld weggelaten. */
  ogImageWidth?: number | undefined;
  ogImageHeight?: number | undefined;
  ogType?: string | undefined;
  /** Voor artikelen: ISO-datum, ook in de server-HTML in plaats van alleen client-side. */
  articlePublishedTime?: string | undefined;
  articleModifiedTime?: string | undefined;
  articleAuthor?: string | undefined;
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
    { property: "og:image:alt", content: seo.title },
    { property: "og:type", content: seo.ogType ?? "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: seo.title },
  ];

  // Gemeten afmetingen van public/og-image.webp (1200×739; hier stond eerder
  // 1200×630, wat niet klopte). Een eigen beeld met verkeerde afmetingen wordt
  // door sommige platforms scheef bijgesneden, dus dan liever geen afmetingen
  // dan foute.
  const imgWidth = seo.ogImage ? seo.ogImageWidth : 1200;
  const imgHeight = seo.ogImage ? seo.ogImageHeight : 739;
  if (imgWidth && imgHeight) {
    meta.push({ property: "og:image:width", content: String(imgWidth) });
    meta.push({ property: "og:image:height", content: String(imgHeight) });
  }

  if (seo.articlePublishedTime) {
    meta.push({ property: "article:published_time", content: seo.articlePublishedTime });
    meta.push({ property: "article:modified_time", content: seo.articleModifiedTime ?? seo.articlePublishedTime });
    meta.push({ property: "article:publisher", content: companyInfo.url });
    if (seo.articleAuthor) meta.push({ property: "article:author", content: seo.articleAuthor });
  }

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
