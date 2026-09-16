import { useEffect } from "react";
import { useLocation } from "@/lib/router-compat";
import { companyInfo } from "@/config/company";
import { buildGraph, type BreadcrumbItem } from "@/lib/structured-data";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  breadcrumbs?: BreadcrumbItem[];
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  noIndex?: boolean;
  /** @deprecated Geen effect meer: elke indexeerbare pagina krijgt de site-entiteiten één keer in de @graph. */
  includeOrganizationSchema?: boolean;
  /** @deprecated Geen effect meer: ProfessionalService zit altijd in de @graph. */
  includeLocalBusinessSchema?: boolean;
}

const SEOHead = ({ 
  title, 
  description, 
  keywords,
  canonicalUrl,
  ogImage = `${companyInfo.url}/og-image.webp`,
  ogType = "website",
  structuredData,
  breadcrumbs,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  noIndex = false,
}: SEOHeadProps) => {
  const location = useLocation();
  
  // Generate canonical URL if not provided
  const resolvedCanonicalUrl = canonicalUrl || `${companyInfo.url}${location.pathname}`;
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    // Robots meta tag
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:image:alt', title, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', companyInfo.name, true);
    updateMetaTag('og:locale', 'nl_NL', true);
    if (!noIndex) updateMetaTag('og:url', resolvedCanonicalUrl, true);
    
    // Article-specific OG tags
    if (ogType === 'article') {
      if (articlePublishedTime) {
        updateMetaTag('article:published_time', articlePublishedTime, true);
      }
      if (articleModifiedTime) {
        updateMetaTag('article:modified_time', articleModifiedTime, true);
      }
      if (articleAuthor) {
        updateMetaTag('article:author', articleAuthor, true);
      }
      updateMetaTag('article:publisher', companyInfo.url, true);
    }
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    if (!noIndex) updateMetaTag('twitter:url', resolvedCanonicalUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:image:alt', title);
    
    // Een noindex-pagina (zoals de 404) krijgt geen canonical, og:url of
    // hreflang. Weghalen in plaats van overslaan: na client-side navigatie
    // staan die van de vorige pagina nog in de <head>.
    if (noIndex) {
      document
        .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property="og:url"], meta[name="twitter:url"]')
        .forEach((el) => el.remove());
      return;
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', resolvedCanonicalUrl);
    
    // Alternate language (hreflang) - for Dutch site
    let hreflangNl = document.querySelector('link[hreflang="nl"]');
    if (!hreflangNl) {
      hreflangNl = document.createElement('link');
      hreflangNl.setAttribute('rel', 'alternate');
      hreflangNl.setAttribute('hreflang', 'nl');
      document.head.appendChild(hreflangNl);
    }
    hreflangNl.setAttribute('href', resolvedCanonicalUrl);
    
    let hreflangDefault = document.querySelector('link[hreflang="x-default"]');
    if (!hreflangDefault) {
      hreflangDefault = document.createElement('link');
      hreflangDefault.setAttribute('rel', 'alternate');
      hreflangDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(hreflangDefault);
    }
    hreflangDefault.setAttribute('href', resolvedCanonicalUrl);
  }, [
    title, 
    description, 
    keywords, 
    resolvedCanonicalUrl, 
    ogImage, 
    ogType, 
    articlePublishedTime, 
    articleModifiedTime, 
    articleAuthor,
    noIndex,
  ]);

  // Eén JSON-LD-blok per pagina, als JSX gerenderd en dus server-side in de
  // HTML. De site-entiteiten, de broodkruimels en de pagina-data zitten samen
  // in één @graph (zie src/lib/structured-data.ts). Een noindex-pagina krijgt
  // geen structured data.
  if (noIndex) return null;

  const isHome = location.pathname === "/";
  const paginaNaam = title.split(/ \| | - /)[0]?.trim() || title;
  const kruimels: BreadcrumbItem[] =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : isHome
        ? [{ name: "Home", url: `${companyInfo.url}/` }]
        : [
            { name: "Home", url: `${companyInfo.url}/` },
            { name: paginaNaam, url: resolvedCanonicalUrl },
          ];

  const graph = buildGraph({ breadcrumbs: kruimels, pageData: structuredData });

  return (
    <script
      type="application/ld+json"
      id="structured-data"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
};

export default SEOHead;

