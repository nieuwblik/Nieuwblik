import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ToolsSlider from "@/components/ToolsSlider";
import FeaturedBlogPosts from "@/components/FeaturedBlogPosts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Palette, ShoppingBag, Pen, ExternalLink } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import SocialContentSection from "@/components/SocialContentSection";

// Import featured project images
import bushidoshopImg from "@/assets/projects/bushidoshop.nl.png";
import interieurstudiolaan from "@/assets/projects/interieurstudiolaan.nl.png";
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
      title: "Interieur Studio Laan",
      category: "Interieur Design",
      description: "Elegante interieur design showcase met portfolio galerij en consultatieaanvraag.",
      image: interieurstudiolaan,
      url: "https://interieurstudiolaan.nl"
    },
    {
      title: "Casper Nieskens PT",
      category: "Personal Training",
      description: "Professioneel fitness coaching platform met gepersonaliseerde trainingsprogramma's.",
      image: caspernieskensptImg,
      url: "https://caspernieskenspt.nl"
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
                  <Link to="/contact">
                    Start je transformatie
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/portfolio">Bekijk onze successen</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img src={heroImage} alt="Premium web design showcase" className="w-full h-full object-cover" />
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
            <Button asChild variant="outline" size="lg">
              <Link to="/services">Ontdek alle mogelijkheden</Link>
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
            <Button asChild variant="outline" size="lg">
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
            <Link to="/contact">
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
