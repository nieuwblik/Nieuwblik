import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Palette, ShoppingBag, Pen } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const Index = () => {
  const { t } = useLanguage();
  const heroAnimation = useScrollAnimation();
  const servicesAnimation = useScrollAnimation();
  const projectsAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();

  const services = [
    {
      icon: Globe,
      title: t("service.web.title"),
      description: t("service.web.desc")
    },
    {
      icon: Palette,
      title: t("service.brand.title"),
      description: t("service.brand.desc")
    },
    {
      icon: ShoppingBag,
      title: t("service.ecommerce.title"),
      description: t("service.ecommerce.desc")
    },
    {
      icon: Pen,
      title: t("service.custom.title"),
      description: t("service.custom.desc")
    }
  ];

  const featuredProjects = [
    {
      title: "Luxury Fashion Boutique",
      category: "E-commerce & Branding",
      description: "Complete brand identity and e-commerce platform"
    },
    {
      title: "Tech Startup Platform",
      category: "Web Application",
      description: "Sophisticated web app with custom dashboard"
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
              <p className="text-accent-light text-accent mb-6 tracking-widest">{t("hero.subtitle")}</p>
              <h1 className="text-display mb-8">
                {t("hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-light leading-relaxed">
                {t("hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">
                    {t("hero.cta")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/portfolio">{t("hero.secondary")}</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={heroImage} 
                  alt="Premium web design showcase" 
                  className="w-full h-full object-cover"
                />
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
            <p className="text-accent-light text-accent mb-4">{t("services.label")}</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("services.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              {t("services.description")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-background p-8 rounded-lg transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
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
              <Link to="/services">{t("services.cta")}</Link>
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
            <p className="text-accent-light text-accent mb-4">{t("projects.label")}</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("projects.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              {t("projects.description")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {featuredProjects.map((project, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-secondary rounded-lg mb-6 overflow-hidden relative transition-transform duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-sm text-accent font-light mb-2">{project.category}</p>
                <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground font-light">{project.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/portfolio">{t("projects.cta")}</Link>
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
            <p className="text-accent-light text-accent mb-4">{t("testimonials.label")}</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("testimonials.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              {t("testimonials.description")}
            </p>
          </div>
          
          <TestimonialsCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaAnimation.ref}
        className={`py-20 md:py-32 bg-primary text-primary-foreground transition-all duration-1000 delay-400 ${
          ctaAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light opacity-90">
            {t("cta.description")}
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/contact">
              {t("cta.button")}
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