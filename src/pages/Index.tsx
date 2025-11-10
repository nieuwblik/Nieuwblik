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
