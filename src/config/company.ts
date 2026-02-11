// Centralized company information for Nieuwblik
// Used across Footer, legal pages, and structured data

export const companyInfo = {
  name: "Nieuwblik",
  legalName: "Nieuwblik",
  url: "https://nieuwblik.com",
  
  // Address
  address: {
    street: "De Trompet 18H",
    postalCode: "1601 MK",
    city: "Enkhuizen",
    country: "NL",
    countryName: "Nederland",
    full: "De Trompet 18H, 1601 MK Enkhuizen",
    googleMapsUrl: "https://www.google.com/maps/dir//De+Trompet+18H,+1601+MK+Enkhuizen/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x47c8a3932165dee3:0xecaa07e808a362fc?sa=X&ved=1t:707&ictx=111"
  },
  
  // Legal identifiers
  kvk: "99229781",
  btw: "NL005377205B80",
  
  // Contact
  email: "info@nieuwblik.com",
  phone: "+31 6 46253607",
  whatsapp: "https://wa.me/31646253607",
  
  // Social
  social: {
    linkedin: "https://www.linkedin.com/in/justin-slok-b8a3011b2/",
  },
  
  // Founders
  founders: ["Justin Slok", "Job"],
  foundingDate: "2023",
  
  // Description
  description: "Professioneel webdesign bureau in Enkhuizen. Wij creëren websites en designs die emotie wekken, conversies stimuleren en je bedrijf naar nieuwe hoogtes tillen.",
  slogan: "Digitale groei begint hier",
};

// Organization JSON-LD structured data
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${companyInfo.url}/#organization`,
  name: companyInfo.name,
  legalName: companyInfo.legalName,
  url: companyInfo.url,
  logo: `${companyInfo.url}/logo.png`,
  image: `${companyInfo.url}/og-image.webp`,
  description: companyInfo.description,
  slogan: companyInfo.slogan,
  foundingDate: companyInfo.foundingDate,
  address: {
    "@type": "PostalAddress",
    streetAddress: companyInfo.address.street,
    postalCode: companyInfo.address.postalCode,
    addressLocality: companyInfo.address.city,
    addressCountry: companyInfo.address.country,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: companyInfo.phone,
    email: companyInfo.email,
    contactType: "customer service",
    availableLanguage: ["Dutch", "English"],
  },
  sameAs: [
    companyInfo.social.linkedin,
  ],
  // Dutch business identifiers
  taxID: companyInfo.btw,
  // KVK number in identifier
  identifier: {
    "@type": "PropertyValue",
    name: "KVK",
    value: companyInfo.kvk,
  },
};

// WebSite JSON-LD for sitelinks search box
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${companyInfo.url}/#website`,
  url: companyInfo.url,
  name: companyInfo.name,
  description: companyInfo.description,
  publisher: {
    "@id": `${companyInfo.url}/#organization`,
  },
  inLanguage: "nl-NL",
};

// LocalBusiness JSON-LD for local SEO
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${companyInfo.url}/#localbusiness`,
  name: companyInfo.name,
  url: companyInfo.url,
  image: `${companyInfo.url}/og-image.webp`,
  description: companyInfo.description,
  telephone: companyInfo.phone,
  email: companyInfo.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: companyInfo.address.street,
    postalCode: companyInfo.address.postalCode,
    addressLocality: companyInfo.address.city,
    addressCountry: companyInfo.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 52.7039,
    longitude: 5.2931,
  },
  areaServed: {
    "@type": "Country",
    name: "Nederland",
  },
  priceRange: "€€",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  sameAs: [
    companyInfo.social.linkedin,
  ],
};
