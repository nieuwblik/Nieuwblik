import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "nl";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",
    "nav.cta": "Start Your Project",
    
    // Hero
    "hero.subtitle": "PREMIUM WEB DESIGN",
    "hero.title": "Crafting Digital Excellence",
    "hero.description": "We design and build luxurious websites and brand identities that elevate your business and captivate your audience.",
    "hero.cta": "Start Your Project",
    "hero.secondary": "View Our Work",
    
    // Services Section
    "services.label": "WHAT WE DO",
    "services.title": "Our Core Services",
    "services.description": "Comprehensive digital solutions designed to elevate your brand and drive results.",
    "services.cta": "Explore All Services",
    
    "service.web.title": "Website Design & Development",
    "service.web.desc": "Custom-built, responsive websites that combine stunning aesthetics with powerful functionality.",
    "service.brand.title": "Brand Identity & Kits",
    "service.brand.desc": "Comprehensive brand systems that establish your unique visual language and market presence.",
    "service.ecommerce.title": "E-commerce Solutions",
    "service.ecommerce.desc": "Full-service e-commerce design including product listings, banners, and complete shop experiences.",
    "service.custom.title": "Custom Design Services",
    "service.custom.desc": "From e-books to vehicle wrapping, we deliver tailored design solutions for every need.",
    
    // Projects
    "projects.label": "RECENT WORK",
    "projects.title": "Featured Projects",
    "projects.description": "A glimpse into our recent work, showcasing our commitment to excellence.",
    "projects.cta": "View Full Portfolio",
    
    // CTA Section
    "cta.title": "Ready to Transform Your Digital Presence?",
    "cta.description": "Let's collaborate to create something extraordinary that sets you apart from the competition.",
    "cta.button": "Request a Quote",
    
    // Footer
    "footer.description": "Premium web design and digital solutions for ambitious businesses.",
    "footer.links": "Quick Links",
    "footer.ready": "Ready to Start?",
    "footer.ready.desc": "Let's discuss your project and bring your vision to life.",
    "footer.copyright": "All rights reserved.",
  },
  nl: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Diensten",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",
    "nav.cta": "Start Uw Project",
    
    // Hero
    "hero.subtitle": "PREMIUM WEBDESIGN",
    "hero.title": "Digitale Excellentie Creëren",
    "hero.description": "Wij ontwerpen en bouwen luxueuze websites en merkidentiteiten die uw bedrijf naar een hoger niveau tillen en uw doelgroep boeien.",
    "hero.cta": "Start Uw Project",
    "hero.secondary": "Bekijk Ons Werk",
    
    // Services Section
    "services.label": "WAT WE DOEN",
    "services.title": "Onze Kerndiensten",
    "services.description": "Uitgebreide digitale oplossingen ontworpen om uw merk te verheffen en resultaten te behalen.",
    "services.cta": "Alle Diensten Bekijken",
    
    "service.web.title": "Website Design & Ontwikkeling",
    "service.web.desc": "Op maat gemaakte, responsieve websites die verbluffende esthetiek combineren met krachtige functionaliteit.",
    "service.brand.title": "Merkidentiteit & Kits",
    "service.brand.desc": "Uitgebreide merksystemen die uw unieke visuele taal en marktpositie vaststellen.",
    "service.ecommerce.title": "E-commerce Oplossingen",
    "service.ecommerce.desc": "Full-service e-commerce design inclusief productlijsten, banners en complete winkelervaring.",
    "service.custom.title": "Custom Design Services",
    "service.custom.desc": "Van e-books tot voertuigbelettering, wij leveren op maat gemaakte ontwerpoplossingen voor elke behoefte.",
    
    // Projects
    "projects.label": "RECENT WERK",
    "projects.title": "Uitgelichte Projecten",
    "projects.description": "Een blik op ons recente werk, wat onze toewijding aan excellentie toont.",
    "projects.cta": "Volledig Portfolio Bekijken",
    
    // CTA Section
    "cta.title": "Klaar om Uw Digitale Aanwezigheid te Transformeren?",
    "cta.description": "Laten we samenwerken om iets buitengewoons te creëren dat u onderscheidt van de concurrentie.",
    "cta.button": "Vraag een Offerte Aan",
    
    // Footer
    "footer.description": "Premium webdesign en digitale oplossingen voor ambitieuze bedrijven.",
    "footer.links": "Snelle Links",
    "footer.ready": "Klaar om te Beginnen?",
    "footer.ready.desc": "Laten we uw project bespreken en uw visie tot leven brengen.",
    "footer.copyright": "Alle rechten voorbehouden.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};