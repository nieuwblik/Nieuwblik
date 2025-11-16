import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ToolsSlider from "@/components/ToolsSlider";
import FeaturedBlogPosts from "@/components/FeaturedBlogPosts";
import FAQSection from "@/components/FAQSection";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Palette, ShoppingBag, Pen, Linkedin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import justinImage from "@/assets/justin-slok.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import SocialContentSection from "@/components/SocialContentSection";
// Import AI logos
import claudeLogo from "@/assets/ai/claude-logo.png";
import copilotLogo from "@/assets/ai/copilot-logo.png";
import grokLogo from "@/assets/ai/grok-logo.png";
import perplexityLogo from "@/assets/ai/perplexity-logo.png";
// Import featured project images
import bushidoshopImg from "@/assets/projects/bushidoshop.nl.png";
import karateschoolcorslokImg from "@/assets/projects/karateschoolcorslok.nl.png";
import esveldinstallatieImg from "@/assets/projects/esveldinstallatie.nl.png";
import feitsmadakwerkenImg from "@/assets/projects/feitsmadakwerken.nl.png";

const Index = () => {
  const heroAnimation = useScrollAnimation();
  const servicesAnimation = useScrollAnimation();
  const projectsAnimation = useScrollAnimation();
  const seoAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();

  const services = [
    {
      icon: Globe,
      title: "Websites die verkopen",
      description: "Jouw website is meer dan een digitale visitekaartje. Het is de drijvende kracht achter je groei. Wij bouwen websites die niet alleen prachtig zijn, maar ook klanten aantrekken en conversies verhogen."
    },
    {
      icon: Palette,
      title: "Merkidentiteit die raakt",
      description: "Een sterk merk begint met een verhaal dat emotie oproept. Wij creëren merkidentiteiten die jouw unieke waarden uitdragen en een blijvende indruk achterlaten bij je doelgroep."
    },
    {
      icon: ShoppingBag,
      title: "Webshops die groeien",
      description: "Van het eerste bezoek tot de checkout - wij bouwen e-commerce oplossingen die je klanten verleiden en je omzet laten stijgen. Elke klik is een stap naar meer succes."
    },
    {
      icon: Pen,
      title: "Design dat onderscheidt",
      description: "Of het nu gaat om een stunning landingspagina, eye-catching social media content, of een complete visuele identiteit - wij zorgen dat je opvalt in een overvolle markt."
    }
  ];

  const featuredProjects = [
    {
      title: "Bushido Shop",
      category: "E-commerce",
      description: "E-commerce platform voor Japanse vechtsportartikelen en authentieke culturele items.",
      tags: ["E-commerce", "Web Design", "Branding"],
      image: bushidoshopImg,
      url: "https://bushidoshop.nl"
    },
    {
      title: "Karateschool Cor Slok",
      category: "Vechtsport & Training",
      description: "Professionele karateschool website met lesrooster, inschrijvingen en informatie over trainingen.",
      tags: ["Web Design", "Sport", "Community"],
      image: karateschoolcorslokImg,
      url: "https://karateschoolcorslok.nl"
    },
    {
      title: "Esveld Installatie",
      category: "Installatiebedrijf",
      description: "Professionele installatie website met projectportfolio en direct contact voor offertes.",
      tags: ["Web Design", "Dienstverlening", "Contact Formulieren"],
      image: esveldinstallatieImg,
      url: "https://esveldinstallatie.nl"
    },
    {
      title: "Feitsma Dakwerken",
      category: "Dakdekkers & Aannemers",
      description: "Professioneel dakdekkersbedrijf platform met showcases van dakwerkzaamheden en aannemingsprojecten.",
      tags: ["Web Design", "Bouw", "Dienstverlening"],
      image: feitsmadakwerkenImg,
      url: "https://feitsmadakwerken.nl"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section
        ref={heroAnimation.ref}
        className={`relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden transition-all duration-1000 ${
          heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent mb-6 tracking-widest">DIGITALE GROEI BEGINT HIER</p>
              <h1 className="text-display mb-8">
                Van visie naar viraal succes
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-light leading-relaxed">
                Jouw merk verdient meer dan standaardoplossingen. Wij creëren websites en designs die emotie wekken, conversies stimuleren en je bedrijf naar nieuwe hoogtes tillen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/start-je-project">
                    Start je transformatie
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/portfolio">Bekijk onze successen</Link>
                </Button>
              </div>
            </div>
            <div className="relative flex flex-col lg:flex-row items-center gap-6">
              <div className="absolute -inset-2 bg-gradient-to-br from-accent/30 to-primary/30 rounded-lg transform rotate-3 pointer-events-none"></div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 w-full lg:flex-1">
                <img 
                  src={justinImage} 
                  alt="Justin Slok - Nieuwblik"
                  width="800"
                  height="600"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 flex flex-row lg:flex-col gap-4 justify-center lg:justify-start">
                <a
                  href="https://x.com/justin_slok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background hover:bg-accent hover:text-accent-foreground p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/justin-slok-b8a3011b2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background hover:bg-accent hover:text-accent-foreground p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://wa.me/31646253607"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:opacity-80"
                  style={{ backgroundColor: '#25D366' }}
                  aria-label="WhatsApp"
                >
                  <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section
        ref={servicesAnimation.ref}
        className={`py-20 md:py-32 bg-secondary transition-all duration-1000 delay-200 ${
          servicesAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent mb-4">WAT WIJ DOEN</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Jouw succes, onze passie</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Elk project krijgt onze volledige toewijding. Van strategie tot uitvoering - wij zorgen dat jouw digitale aanwezigheid niet alleen gezien wordt, maar ook gewaardeerd.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-background p-8 rounded-lg transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary mb-6">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground font-light">{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/diensten">Ontdek alle mogelijkheden</Link>
                </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section
        ref={projectsAnimation.ref}
        className={`py-20 md:py-32 transition-all duration-1000 delay-300 ${
          projectsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent mb-4">ONS WERK</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Projecten waar we trots op zijn</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Van startups tot gevestigde namen - wij helpen bedrijven hun digitale dromen waar te maken met designs die indruk maken en resultaten leveren.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                category={project.category}
                description={project.description}
                image={project.image}
                url={project.url}
                tags={project.tags}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/portfolio">Alle projecten bekijken</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Content Section */}
      <SocialContentSection />

      {/* SEO Search Engines Section */}
      <section
        ref={seoAnimation.ref}
        className={`py-20 md:py-32 bg-accent transition-all duration-1000 delay-300 ${
          seoAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-accent-foreground">
              Jouw website vindbaar in alle zoekmachines
            </h2>
            <p className="text-xl md:text-2xl text-accent-foreground/90 max-w-4xl mx-auto font-light leading-relaxed">
              Of je klanten nu zoeken via Google, vragen stellen aan ChatGPT, of advies vragen aan Claude - jouw website wordt gevonden. Wij zorgen dat je zichtbaar bent waar jouw klanten zoeken. Geen gemiste kansen, alleen groei.
            </p>
          </div>
          
          {/* Search Engine Logos */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
            {/* Google */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2 group animate-fade-in hover:scale-110 transition-all duration-300" style={{ animationDelay: '0ms' }}>
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center animate-float" style={{ animationDelay: '0ms' }}>
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Google</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* OpenAI */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2 group animate-fade-in hover:scale-110 transition-all duration-300" style={{ animationDelay: '100ms' }}>
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center animate-float" style={{ animationDelay: '200ms' }}>
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#10A37F"/>
                      </svg>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>OpenAI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Perplexity */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2 group animate-fade-in hover:scale-110 transition-all duration-300" style={{ animationDelay: '200ms' }}>
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center animate-float" style={{ animationDelay: '400ms' }}>
                      <img 
                        src={perplexityLogo} 
                        alt="Perplexity AI" 
                        width="80" 
                        height="80"
                        loading="lazy"
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Perplexity AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Grok */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2 group animate-fade-in hover:scale-110 transition-all duration-300" style={{ animationDelay: '300ms' }}>
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center animate-float" style={{ animationDelay: '600ms' }}>
                      <img 
                        src={grokLogo} 
                        alt="Grok (X AI)" 
                        width="80" 
                        height="80"
                        loading="lazy"
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grok (X AI)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Claude */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2 group animate-fade-in hover:scale-110 transition-all duration-300" style={{ animationDelay: '400ms' }}>
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center animate-float" style={{ animationDelay: '800ms' }}>
                      <img 
                        src={claudeLogo} 
                        alt="Claude AI" 
                        width="80" 
                        height="80"
                        loading="lazy"
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Claude AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Copilot */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2 group animate-fade-in hover:scale-110 transition-all duration-300" style={{ animationDelay: '500ms' }}>
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center animate-float" style={{ animationDelay: '1000ms' }}>
                      <img 
                        src={copilotLogo} 
                        alt="Microsoft Copilot" 
                        width="80" 
                        height="80"
                        loading="lazy"
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Microsoft Copilot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="text-center mt-12 md:mt-16">
            <p className="text-base md:text-lg lg:text-xl text-accent-foreground/80 max-w-3xl mx-auto font-light italic mb-6 md:mb-8 px-4">
              "Zichtbaarheid is geen toeval, het is strategie. Wij zorgen dat jouw website de juiste vindbaarheid krijgt - vandaag, morgen, en in de toekomst."
            </p>
            
            <Button asChild size="lg" variant="secondary" className={`transition-all duration-700 delay-700 group ${
              seoAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}>
              <Link to="/contact" className="flex items-center gap-2">
                Boost mijn vindbaarheid
                <span className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">🚀</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsAnimation.ref}
        className={`py-20 md:py-32 bg-secondary transition-all duration-1000 delay-500 ${
          testimonialsAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent mb-4">KLANTEN AAN HET WOORD</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Jouw succes is ons visitekaartje</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Niets zegt meer dan de ervaring van tevreden klanten die hun online doelen hebben bereikt en hun verwachtingen overtroffen zagen.
            </p>
          </div>
          
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Featured Blog Posts */}
      <FeaturedBlogPosts />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section
        ref={ctaAnimation.ref}
        className={`py-20 md:py-32 bg-gradient-to-br from-primary to-accent bg-[length:200%_200%] animate-gradient-shift transition-all duration-1000 delay-400 ${
          ctaAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">
            Klaar om je concurrentie voorbij te streven?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light text-primary-foreground/90">
            Laat je verhaal horen. Samen bouwen we een digitale aanwezigheid die niet alleen opvalt, maar ook converteert. De eerste stap? Een vrijblijvend gesprek.
          </p>
          <Button asChild size="lg" variant="secondary" className="animate-glow-pulse">
            <Link to="/start-je-project">
              Start vandaag je groeiverhaal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
