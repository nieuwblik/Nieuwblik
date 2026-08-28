import { useEffect } from "react";
import { useLocation } from "@/lib/router-compat";
import { companyInfo, organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from "@/config/company";

interface BreadcrumbItem {
  name: string;
  url: string;
}

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
  includeOrganizationSchema?: boolean;
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
  includeOrganizationSchema = true,
  includeLocalBusinessSchema = false,
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
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', title, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', companyInfo.name, true);
    updateMetaTag('og:locale', 'nl_NL', true);
    updateMetaTag('og:url', resolvedCanonicalUrl, true);
    
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
    updateMetaTag('twitter:url', resolvedCanonicalUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:image:alt', title);
    
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

  // JSON-LD wordt als JSX gerenderd (dus ook server-side in de HTML), niet
  // meer via useEffect in de <head> geïnjecteerd. Zo zien crawlers de
  // structured data direct in de server-response.
  const organizationGraph = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd, websiteJsonLd],
  };

  const breadcrumbData = breadcrumbs && breadcrumbs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url,
        })),
      }
    : null;

  return (
    <>
      {includeOrganizationSchema && (
        <script
          type="application/ld+json"
          id="organization-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationGraph) }}
        />
      )}
      {includeLocalBusinessSchema && (
        <script
          type="application/ld+json"
          id="localbusiness-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      )}
      {structuredData && (
        <script
          type="application/ld+json"
          id="structured-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {breadcrumbData && (
        <script
          type="application/ld+json"
          id="breadcrumb-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
      )}
    </>
  );
};

export default SEOHead;

