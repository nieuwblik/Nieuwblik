import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ToolsSlider from "@/components/ToolsSlider";
import FeaturedBlogPosts from "@/components/FeaturedBlogPosts";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Palette, ShoppingBag, Pen, ExternalLink, Linkedin } from "lucide-react";
import justinImage from "@/assets/justin-slok.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import SocialContentSection from "@/components/SocialContentSection";
// Import featured project images
import bushidoshopImg from "@/assets/projects/bushidoshop.nl.png";
import karateschoolcorslokImg from "@/assets/projects/karateschoolcorslok.nl.png";
import caspernieskensptImg from "@/assets/projects/caspernieskenspt.nl.png";
import lashlutionImg from "@/assets/projects/lashlution.nl.png";

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
      image: bushidoshopImg,
      url: "https://bushidoshop.nl"
    },
    {
      title: "Karateschool Cor Slok",
      category: "Vechtsport & Training",
      description: "Professionele karateschool website met lesrooster, inschrijvingen en informatie over trainingen.",
      image: karateschoolcorslokImg,
      url: "https://karateschoolcorslok.nl"
    },
    {
      title: "Casper Nieskens PT",
      category: "Personal Training",
      description: "Professioneel fitness coaching platform met gepersonaliseerde trainingsprogramma's.",
      image: caspernieskensptImg,
      url: "https://caspernieskenspt.com"
    },
    {
      title: "Lashlution",
      category: "Beauty & Wellness",
      description: "Premium lash extensions en beauty services boekingsplatform.",
      image: lashlutionImg,
      url: "https://lashlution.nl"
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
              <div className="absolute -inset-4 bg-gradient-to-r from-accent via-primary to-accent opacity-75 blur-2xl animate-pulse pointer-events-none"></div>
              <div className="absolute -inset-2 bg-gradient-to-br from-accent/40 to-primary/40 rounded-lg transform rotate-3 animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 w-full lg:flex-1">
                <img 
                  src={justinImage} 
                  alt="Justin Slok - Nieuwblik"
                  loading="eager"
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
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer block"
              >
                <div className="aspect-[4/3] bg-secondary rounded-lg mb-6 overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium bg-background px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                      Bekijk website
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <p className="text-sm text-accent font-light mb-2">{project.category}</p>
                <h3 className="text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground font-light">{project.description}</p>
              </a>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center mt-16">
            {/* Google */}
            <div className={`flex items-center justify-center w-full h-20 transition-all duration-500 delay-100 ${
              seoAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            } hover:scale-110`}>
              <svg className="w-24 h-24" viewBox="0 0 272 92" fill="none">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="white"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="white"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="white"/>
                <path d="M225 3v65h-9.5V3h9.5z" fill="white"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="white"/>
                <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="white"/>
              </svg>
            </div>
            
            {/* OpenAI */}
            <div className={`flex items-center justify-center w-full h-20 transition-all duration-500 delay-200 ${
              seoAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            } hover:scale-110`}>
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
              </svg>
            </div>
            
            {/* Perplexity */}
            <div className={`flex items-center justify-center w-full h-20 transition-all duration-500 delay-300 ${
              seoAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            } hover:scale-110`}>
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            
            {/* Grok (X AI) */}
            <div className={`flex items-center justify-center w-full h-20 transition-all duration-500 delay-400 ${
              seoAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            } hover:scale-110`}>
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            
            {/* Claude (Anthropic) */}
            <div className={`flex items-center justify-center w-full h-20 transition-all duration-500 delay-500 ${
              seoAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            } hover:scale-110`}>
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
                <path d="M14.5 2.5L9.5 21.5M19 6.5L5 6.5M18 17.5L6 17.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            
            {/* Copilot (Microsoft) */}
            <div className={`flex items-center justify-center w-full h-20 transition-all duration-500 delay-600 ${
              seoAnimation.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            } hover:scale-110`}>
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white">
                <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
              </svg>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-lg md:text-xl text-accent-foreground/80 max-w-3xl mx-auto font-light italic mb-8">
              "Zichtbaarheid is geen toeval, het is strategie. Wij zorgen dat jouw website de juiste vindbaarheid krijgt - vandaag, morgen, en in de toekomst."
            </p>
            
            <Button asChild size="lg" variant="secondary" className={`transition-all duration-700 delay-700 ${
              seoAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}>
              <Link to="/start-je-project">
                Boost mijn vindbaarheid
                <ArrowRight className="ml-2 h-5 w-5" />
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
