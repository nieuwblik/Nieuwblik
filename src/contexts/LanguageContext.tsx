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
    "nav.about": "About",
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
    
    // Testimonials
    "testimonials.label": "CLIENT REVIEWS",
    "testimonials.title": "What Our Clients Say",
    "testimonials.description": "Don't just take our word for it – hear from the businesses we've helped transform.",
    "testimonials.cta": "Explore All Reviews",
    
    // Portfolio
    "portfolio.label": "OUR WORK",
    "portfolio.title": "Selected Projects",
    "portfolio.description": "A showcase of our recent work, demonstrating our commitment to excellence in design and functionality.",
    "portfolio.viewWebsite": "Visit Website",
    "portfolio.cta.title": "Let's Create Something Remarkable",
    "portfolio.cta.description": "Your project could be our next success story.",
    "portfolio.cta.button": "Start Your Project",

    // About
    "about.label": "ABOUT ME",
    "about.hero.title": "Hey, I'm Justin Slok!",
    "about.hero.subtitle": "Designer, Developer & Brand Enthusiast from Enkhuizen, Netherlands",
    "about.hero.description": "With boundless enthusiasm and a genuine love for creativity, I transform ideas into stunning digital experiences. Every project is an opportunity to build something amazing together!",
    "about.hero.cta": "Let's Create Together",
    "about.story.title": "My Story",
    "about.story.paragraph1": "Based in the beautiful town of Enkhuizen in the Netherlands, I've turned my passion for design and technology into a career that brings me pure joy every single day. There's nothing quite like the energy of collaborating with clients who are as excited about their vision as I am!",
    "about.story.paragraph2": "What drives me? The thrill of designing fresh brands, crafting beautiful websites, and watching businesses flourish online. But more than the pixels and code, it's the relationships I build along the way. I don't just create projects—I create partnerships that last.",
    "about.story.paragraph3": "Whether you're launching a new brand, refreshing your online presence, or dreaming up something entirely unique, I'm here to bring that same enthusiasm and dedication to your project. Let's make something incredible together!",
    "about.values.label": "MY VALUES",
    "about.values.title": "What I Bring to the Table",
    "about.values.description": "The principles that guide every collaboration and project",
    "about.values.passion.title": "Infectious Enthusiasm",
    "about.values.passion.description": "I pour my heart into every project, bringing energy and excitement that makes the creative process genuinely fun.",
    "about.values.collaboration.title": "True Partnership",
    "about.values.collaboration.description": "Working with people is what I love most. Your success is my success, and I'm committed to being there for the long haul.",
    "about.values.creativity.title": "Fresh Perspectives",
    "about.values.creativity.description": "Every brand has a unique story. I bring innovative ideas and creative solutions that make yours stand out.",
    "about.values.growth.title": "Continuous Evolution",
    "about.values.growth.description": "I'm constantly learning and growing, ensuring your project benefits from the latest trends and technologies.",
    "about.cta.title": "Ready to Start Something Amazing?",
    "about.cta.description": "Let's connect and create something that makes you proud. I can't wait to hear about your vision!",
    "about.cta.button": "Get in Touch",

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
    "nav.about": "Over mij",
    "nav.contact": "Contact",
    "nav.cta": "Start uw project",
    
    // Hero
    "hero.subtitle": "PREMIUM WEBDESIGN",
    "hero.title": "Digitale excellentie creëren",
    "hero.description": "Wij ontwerpen en bouwen luxueuze websites en merkidentiteiten die uw bedrijf naar een hoger niveau tillen en uw doelgroep boeien.",
    "hero.cta": "Start uw project",
    "hero.secondary": "Bekijk ons werk",
    
    // Services Section
    "services.label": "WAT WE DOEN",
    "services.title": "Onze kerndiensten",
    "services.description": "Uitgebreide digitale oplossingen ontworpen om uw merk te verheffen en resultaten te behalen.",
    "services.cta": "Alle diensten bekijken",
    
    "service.web.title": "Website design & ontwikkeling",
    "service.web.desc": "Op maat gemaakte, responsieve websites die verbluffende esthetiek combineren met krachtige functionaliteit.",
    "service.brand.title": "Merkidentiteit & kits",
    "service.brand.desc": "Uitgebreide merksystemen die uw unieke visuele taal en marktpositie vaststellen.",
    "service.ecommerce.title": "E-commerce oplossingen",
    "service.ecommerce.desc": "Full-service e-commerce design inclusief productlijsten, banners en complete winkelervaring.",
    "service.custom.title": "Custom design services",
    "service.custom.desc": "Van e-books tot voertuigbelettering, wij leveren op maat gemaakte ontwerpoplossingen voor elke behoefte.",
    
    // Projects
    "projects.label": "RECENT WERK",
    "projects.title": "Uitgelichte projecten",
    "projects.description": "Een blik op ons recente werk, wat onze toewijding aan excellentie toont.",
    "projects.cta": "Volledig portfolio bekijken",
    
    // CTA Section
    "cta.title": "Klaar om uw digitale aanwezigheid te transformeren?",
    "cta.description": "Laten we samenwerken om iets buitengewoons te creëren dat u onderscheidt van de concurrentie.",
    "cta.button": "Vraag een offerte aan",
    
    // Testimonials
    "testimonials.label": "KLANTBEOORDELINGEN",
    "testimonials.title": "Wat onze klanten zeggen",
    "testimonials.description": "Geloof ons niet zomaar – hoor van de bedrijven die we hebben helpen transformeren.",
    "testimonials.cta": "Bekijk alle reviews",
    
    // Portfolio
    "portfolio.label": "ONS WERK",
    "portfolio.title": "Geselecteerde projecten",
    "portfolio.description": "Een showcase van ons recente werk, wat onze toewijding aan excellentie in design en functionaliteit toont.",
    "portfolio.viewWebsite": "Bezoek website",
    "portfolio.cta.title": "Laten we iets opmerkelijks creëren",
    "portfolio.cta.description": "Uw project zou ons volgende succesverhaal kunnen zijn.",
    "portfolio.cta.button": "Start uw project",

    // About
    "about.label": "OVER MIJ",
    "about.hero.title": "Hey, ik ben Justin Slok!",
    "about.hero.subtitle": "Designer, developer & merk enthousiast uit Enkhuizen, Nederland",
    "about.hero.description": "Met grenzeloze enthousiasme en een oprechte liefde voor creativiteit transformeer ik ideeën in prachtige digitale ervaringen. Elk project is een kans om samen iets geweldigs te bouwen!",
    "about.hero.cta": "Laten we samen creëren",
    "about.story.title": "Mijn verhaal",
    "about.story.paragraph1": "Gevestigd in het prachtige Enkhuizen in Nederland, heb ik mijn passie voor design en technologie omgezet in een carrière die me elke dag pure vreugde brengt. Er gaat niets boven de energie van het samenwerken met klanten die net zo enthousiast zijn over hun visie als ik!",
    "about.story.paragraph2": "Wat drijft mij? De kick van het ontwerpen van frisse merken, het creëren van mooie websites en het zien floreren van bedrijven online. Maar meer dan de pixels en code, zijn het de relaties die ik onderweg opbouw. Ik creëer geen projecten—ik creëer partnerschappen die blijven.",
    "about.story.paragraph3": "Of je nu een nieuw merk lanceert, je online aanwezigheid vernieuwt, of iets totaal unieks bedenkt, ik ben er om datzelfde enthousiasme en toewijding aan jouw project te brengen. Laten we samen iets ongelooflijks maken!",
    "about.values.label": "MIJN WAARDEN",
    "about.values.title": "Wat ik inbreng",
    "about.values.description": "De principes die elke samenwerking en project leiden",
    "about.values.passion.title": "Aanstekelijk enthousiasme",
    "about.values.passion.description": "Ik steek mijn hart in elk project en breng energie en opwinding die het creatieve proces echt leuk maakt.",
    "about.values.collaboration.title": "Echt partnerschap",
    "about.values.collaboration.description": "Samenwerken met mensen is wat ik het liefst doe. Jouw succes is mijn succes, en ik ben toegewijd om er voor de lange termijn te zijn.",
    "about.values.creativity.title": "Frisse perspectieven",
    "about.values.creativity.description": "Elk merk heeft een uniek verhaal. Ik breng innovatieve ideeën en creatieve oplossingen die jou laten opvallen.",
    "about.values.growth.title": "Continue evolutie",
    "about.values.growth.description": "Ik leer en groei constant, zodat jouw project profiteert van de nieuwste trends en technologieën.",
    "about.cta.title": "Klaar om iets geweldigs te starten?",
    "about.cta.description": "Laten we contact maken en iets creëren waar je trots op bent. Ik kan niet wachten om over jouw visie te horen!",
    "about.cta.button": "Neem contact op",

    // Footer
    "footer.description": "Premium webdesign en digitale oplossingen voor ambitieuze bedrijven.",
    "footer.links": "Snelle links",
    "footer.ready": "Klaar om te beginnen?",
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