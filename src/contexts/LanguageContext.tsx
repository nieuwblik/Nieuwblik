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
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.cta": "Start your project",
    
    // Blog
    "blog.label": "INSIGHTS & EXPERTISE",
    "blog.title": "Our Blog",
    "blog.subtitle": "Discover the latest trends in web design, branding and digital strategy.",
    "blog.readMore": "Read more",
    "blog.readingTime": "min read",
    "blog.backToBlog": "Back to blog",
    "blog.author": "Justin Slok | Owner Nieuwblik.com",
    "blog.contact.title": "Inspired?",
    "blog.contact.description": "Start your digital transformation today.",
    "blog.contact.cta": "Start your project",
    
    // Hero
    "hero.subtitle": "PREMIUM WEB DESIGN",
    "hero.title": "Crafting digital excellence",
    "hero.description": "We design and build luxurious websites and brand identities that elevate your business and captivate your audience.",
    "hero.cta": "Start your project",
    "hero.secondary": "View our work",
    
    // Services Section
    "services.label": "WHAT WE DO",
    "services.title": "Our core services",
    "services.description": "Comprehensive digital solutions designed to elevate your brand and drive results.",
    "services.cta": "Explore all services",
    
    "service.web.title": "Website design & development",
    "service.web.desc": "Custom-built, responsive websites that combine stunning aesthetics with powerful functionality.",
    "service.brand.title": "Brand identity & kits",
    "service.brand.desc": "Comprehensive brand systems that establish your unique visual language and market presence.",
    "service.ecommerce.title": "E-commerce solutions",
    "service.ecommerce.desc": "Full-service e-commerce design including product listings, banners, and complete shop experiences.",
    "service.custom.title": "Custom design services",
    "service.custom.desc": "From e-books to vehicle wrapping, we deliver tailored design solutions for every need.",
    
    // Projects
    "projects.label": "RECENT WORK",
    "projects.title": "Featured projects",
    "projects.description": "A glimpse into our recent work, showcasing our commitment to excellence.",
    "projects.cta": "View full portfolio",
    
    // CTA Section
    "cta.title": "Ready to transform your digital presence?",
    "cta.description": "Let's collaborate to create something extraordinary that sets you apart from the competition.",
    "cta.button": "Request a quote",
    
    // Testimonials
    "testimonials.label": "CLIENT REVIEWS",
    "testimonials.title": "What our clients say",
    "testimonials.description": "Don't just take our word for it – hear from the businesses we've helped transform.",
    "testimonials.cta": "Explore all reviews",
    
    // Portfolio
    "portfolio.label": "OUR WORK",
    "portfolio.title": "Selected projects",
    "portfolio.description": "A showcase of our recent work, demonstrating our commitment to excellence in design and functionality.",
    "portfolio.viewWebsite": "Visit website",
    "portfolio.filter.all": "All projects",
    "portfolio.filter.websites": "Websites",
    "portfolio.filter.ecommerce": "E-commerce",
    "portfolio.filter.brands": "Brands",
    "portfolio.filter.custom": "Custom designs",
    "portfolio.cta.title": "Let's create something remarkable",
    "portfolio.cta.description": "Your project could be our next success story.",
    "portfolio.cta.button": "Start your project",

    // About
    "about.label": "ABOUT ME",
    "about.hero.title": "Hey, I'm Justin Slok!",
    "about.hero.subtitle": "Designer, developer & brand enthusiast from Enkhuizen, Netherlands",
    "about.hero.description": "With boundless enthusiasm and a genuine love for creativity, I transform ideas into stunning digital experiences. Every project is an opportunity to build something amazing together!",
    "about.hero.cta": "Let's create together",
    "about.story.title": "My story",
    "about.story.paragraph1": "Based in the beautiful town of Enkhuizen in the Netherlands, I've turned my passion for design and technology into a career that brings me pure joy every single day. There's nothing quite like the energy of collaborating with clients who are as excited about their vision as I am!",
    "about.story.paragraph2": "What drives me? The thrill of designing fresh brands, crafting beautiful websites, and watching businesses flourish online. But more than the pixels and code, it's the relationships I build along the way. I don't just create projects—I create partnerships that last.",
    "about.story.paragraph3": "Whether you're launching a new brand, refreshing your online presence, or dreaming up something entirely unique, I'm here to bring that same enthusiasm and dedication to your project. Let's make something incredible together!",
    "about.values.label": "MY VALUES",
    "about.values.title": "What I bring to the table",
    "about.values.description": "The principles that guide every collaboration and project",
    "about.values.passion.title": "Infectious enthusiasm",
    "about.values.passion.description": "I pour my heart into every project, bringing energy and excitement that makes the creative process genuinely fun.",
    "about.values.collaboration.title": "True partnership",
    "about.values.collaboration.description": "Working with people is what I love most. Your success is my success, and I'm committed to being there for the long haul.",
    "about.values.creativity.title": "Fresh perspectives",
    "about.values.creativity.description": "Every brand has a unique story. I bring innovative ideas and creative solutions that make yours stand out.",
    "about.values.growth.title": "Continuous evolution",
    "about.values.growth.description": "I'm constantly learning and growing, ensuring your project benefits from the latest trends and technologies.",
    "about.cta.title": "Ready to start something amazing?",
    "about.cta.description": "Let's connect and create something that makes you proud. I can't wait to hear about your vision!",
    "about.cta.button": "Get in touch",

    // Tools
    "tools.title": "Trusted tools we work with",

    // Footer
    "footer.description": "Premium web design and digital solutions for ambitious businesses.",
    "footer.links": "Quick links",
    "footer.company": "Company",
    "footer.kvk": "KvK",
    "footer.btw": "VAT",
    "footer.whatsapp": "WhatsApp",
    "footer.newsletter": "Newsletter",
    "footer.newsletter.desc": "Stay updated with our latest projects and design insights.",
    "footer.newsletter.placeholder": "Your email address",
    "footer.newsletter.button": "Subscribe",
    "footer.social": "Follow us",
    "footer.ready": "Ready to start?",
    "footer.ready.desc": "Let's discuss your project and bring your vision to life.",
    "footer.copyright": "All rights reserved.",
  },
  nl: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Diensten",
    "nav.portfolio": "Portfolio",
    "nav.about": "Over mij",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.cta": "Start uw project",
    
    // Blog
    "blog.label": "INZICHTEN & EXPERTISE",
    "blog.title": "Onze Blog",
    "blog.subtitle": "Ontdek de laatste trends in webdesign, branding en digitale strategie.",
    "blog.readMore": "Lees verder",
    "blog.readingTime": "min leestijd",
    "blog.backToBlog": "Terug naar blog",
    "blog.author": "Justin Slok | Eigenaar Nieuwblik.com",
    "blog.contact.title": "Geïnspireerd?",
    "blog.contact.description": "Start vandaag nog met jouw digitale transformatie.",
    "blog.contact.cta": "Start uw project",
    
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
    "portfolio.filter.all": "Alle projecten",
    "portfolio.filter.websites": "Websites",
    "portfolio.filter.ecommerce": "E-commerce",
    "portfolio.filter.brands": "Brands",
    "portfolio.filter.custom": "Custom designs",
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

    // Tools
    "tools.title": "Vertrouwde tools waarmee we werken",

    // Footer
    "footer.description": "Premium webdesign en digitale oplossingen voor ambitieuze bedrijven.",
    "footer.links": "Snelle links",
    "footer.company": "Bedrijf",
    "footer.kvk": "KvK",
    "footer.btw": "BTW",
    "footer.whatsapp": "WhatsApp",
    "footer.newsletter": "Nieuwsbrief",
    "footer.newsletter.desc": "Blijf op de hoogte van onze nieuwste projecten en design inzichten.",
    "footer.newsletter.placeholder": "Uw e-mailadres",
    "footer.newsletter.button": "Inschrijven",
    "footer.social": "Volg ons",
    "footer.ready": "Klaar om te beginnen?",
    "footer.ready.desc": "Laten we uw project bespreken en uw visie tot leven brengen.",
    "footer.copyright": "Alle rechten voorbehouden.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setIsChanging(true);
    setTimeout(() => {
      setLanguage(lang);
      setTimeout(() => setIsChanging(false), 50);
    }, 150);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      <div className={`transition-opacity duration-150 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
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