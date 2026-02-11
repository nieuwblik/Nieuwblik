import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
    
    // Organization JSON-LD (always include on main pages)
    if (includeOrganizationSchema) {
      let orgScript = document.getElementById('organization-data');
      if (!orgScript) {
        orgScript = document.createElement('script');
        orgScript.setAttribute('type', 'application/ld+json');
        orgScript.setAttribute('id', 'organization-data');
        document.head.appendChild(orgScript);
      }
      // Combine Organization and WebSite schemas
      const combinedSchema = {
        "@context": "https://schema.org",
        "@graph": [
          organizationJsonLd,
          websiteJsonLd,
        ]
      };
      orgScript.textContent = JSON.stringify(combinedSchema);
    }
    
    // LocalBusiness JSON-LD (for local SEO pages)
    if (includeLocalBusinessSchema) {
      let localScript = document.getElementById('localbusiness-data');
      if (!localScript) {
        localScript = document.createElement('script');
        localScript.setAttribute('type', 'application/ld+json');
        localScript.setAttribute('id', 'localbusiness-data');
        document.head.appendChild(localScript);
      }
      localScript.textContent = JSON.stringify(localBusinessJsonLd);
    }
    
    // Page-specific Structured Data
    if (structuredData) {
      let script = document.getElementById('structured-data');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('id', 'structured-data');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
    
    // Breadcrumb JSON-LD
    if (breadcrumbs && breadcrumbs.length > 0) {
      let breadcrumbScript = document.getElementById('breadcrumb-data');
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.setAttribute('type', 'application/ld+json');
        breadcrumbScript.setAttribute('id', 'breadcrumb-data');
        document.head.appendChild(breadcrumbScript);
      }
      
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      };
      
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
    }
    
    // Cleanup function
    return () => {
      const breadcrumbScript = document.getElementById('breadcrumb-data');
      if (breadcrumbScript) {
        breadcrumbScript.remove();
      }
      const structuredScript = document.getElementById('structured-data');
      if (structuredScript) {
        structuredScript.remove();
      }
      const localScript = document.getElementById('localbusiness-data');
      if (localScript) {
        localScript.remove();
      }
    };
  }, [
    title, 
    description, 
    keywords, 
    resolvedCanonicalUrl, 
    ogImage, 
    ogType, 
    structuredData, 
    breadcrumbs, 
    articlePublishedTime, 
    articleModifiedTime, 
    articleAuthor,
    noIndex,
    includeOrganizationSchema,
    includeLocalBusinessSchema,
  ]);
  
  return null;
};

export default SEOHead;
