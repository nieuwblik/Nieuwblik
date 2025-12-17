import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Palette, Zap, Bot, Check, Plus, ArrowRight, MessageCircle, Star, Phone } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Project images for cases
import esveldImg from "@/assets/projects/esveldinstallatie.nl.png";
import feitsmaImg from "@/assets/projects/feitsmadakwerken.nl.png";

// Tool logos
import lovableLogo from "@/assets/tools/lovable-logo.png";
import figmaLogo from "@/assets/tools/figma-logo.png";
import geminiLogo from "@/assets/tools/gemini-logo.png";
import hadoseoLogo from "@/assets/tools/hadoseo-logo.png";
import wordpressLogo from "@/assets/tools/wordpress.svg";
import elementorLogo from "@/assets/tools/elementor.svg";
import woocommerceLogo from "@/assets/tools/woocommerce.svg";

const WebsiteOpMaat = () => {
  const [heroRef, heroVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const [uspRef, uspVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const [stepsRef, stepsVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const [includedRef, includedVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const [casesRef, casesVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const usps = [{
    icon: Palette,
    title: "Design excellence",
    subtitle: "Luxe en branding",
    description: "Elk ontwerp begint in Figma waar we jouw unieke merkidentiteit tot leven brengen met oog voor detail en luxe uitstraling."
  }, {
    icon: Zap,
    title: "Technische fundering",
    subtitle: "Snelheid en schone code",
    description: "Gebouwd met Lovable en moderne technologie voor bliksemsnelle laadtijden en perfecte Google scores."
  }, {
    icon: Bot,
    title: "AI & automatisering",
    subtitle: "Efficiëntie en funneling",
    description: "Slimme integraties via HadoSEO zorgen voor optimale vindbaarheid en automatische lead-generatie."
  }];
  const steps = [{
    number: "01",
    title: "Concept & strategie",
    description: "We starten met jouw project briefing om doelen, doelgroep en merkidentiteit in kaart te brengen."
  }, {
    number: "02",
    title: "Luxe design & UX",
    description: "In Figma creëren we wireframes en het visuele ontwerp dat jouw merk perfect representeert."
  }, {
    number: "03",
    title: "Technische development",
    description: "Met Lovable en Gemini AI bouwen we een ultra-snelle, SEO-geoptimaliseerde website."
  }, {
    number: "04",
    title: "Livegang & optimalisatie",
    description: "Na de lancering optimaliseren we continu voor prestaties en koppelen we Google Business voor reviews."
  }];
  const includedStandard = ["Responsive & mobile-first design", "SEO-fundament met HadoSEO koppeling", "Google Analytics 4 integratie", "Google Business koppeling voor reviews", "SSL-certificaat & beveiliging", "Laadtijd onder 2 seconden", "Contactformulieren met automatisering", "3 revisierondes inbegrepen"];
  const optionalModules = ["Custom AI chatbot integratie", "E-commerce functionaliteit", "Meertalige website opties", "Premium CMS licenties", "Geavanceerde animaties", "Lead generation funnels"];
  const cases = [{
    title: "Esveld Installatie",
    category: "Installatiebedrijf",
    image: esveldImg,
    url: "https://esveldinstallatie.nl"
  }, {
    title: "Feitsma Dakwerken",
    category: "Dakdekkers & Aannemers",
    image: feitsmaImg,
    url: "https://feitsmadakwerken.nl"
  }];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Website op Maat - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://www.nieuwblik.com"
    },
    "serviceType": "Custom Website Development",
    "description": "Luxe websites en digitale architectuur op maat. Ultra-snelle, SEO-geoptimaliseerde websites met HadoSEO koppeling.",
    "areaServed": "Nederland",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  };
  return <div className="min-h-screen bg-background">
      <SEOHead title="Website op Maat | Luxe Webdesign & Development - Nieuwblik" description="Laat een luxe website op maat bouwen. Ultra-snelle laadtijden, SEO-geoptimaliseerd via HadoSEO, Google Business reviews. Binnen een week live!" keywords="website op maat, webdesign bureau, website laten maken, luxe website, custom website, SEO website, snelle website" canonicalUrl="https://nieuwblik.com/diensten/website-op-maat" structuredData={structuredData} breadcrumbs={[
        { name: "Home", url: "https://nieuwblik.com" },
        { name: "Diensten", url: "https://nieuwblik.com/diensten" },
        { name: "Website op maat", url: "https://nieuwblik.com/diensten/website-op-maat" }
      ]} />
      <Navigation />
      
      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{
          label: "Diensten",
          path: "/diensten"
        }, {
          label: "Website op Maat",
          path: "/diensten/website-op-maat"
        }]} />
        </div>
      </section>

      {/* Hero Section */}
      <section ref={heroRef as React.RefObject<HTMLElement>} className={`py-16 md:py-24 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="container mx-auto px-6">
          <p className="text-accent mb-6 uppercase tracking-wide font-medium">Website op maat</p>
          <h1 className="text-display mb-6">
            Luxe websites & digitale architectuur op maat
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light mb-10">
            Wij bouwen ultra-snelle websites met AI-automatisering en meetbare groei. 
            Jouw website binnen een week live, perfect vindbaar in alle zoekmachines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Start je website project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <a href="https://wa.me/31681762670" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp direct
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Nieuwblik - 3 USPs */}
      <section ref={uspRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Waarom Nieuwblik?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Drie pilaren die jouw website onderscheiden van de rest
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {usps.map((usp, index) => <Card key={index} className={`text-center p-8 border-border/50 hover:border-accent/50 hover:shadow-xl transition-all duration-500 ${uspVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{
            transitionDelay: `${index * 150}ms`
          }}>
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                    <usp.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{usp.title}</h3>
                  <p className="text-accent font-medium text-sm mb-4">{usp.subtitle}</p>
                  <p className="text-muted-foreground">{usp.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Project Steps Timeline */}
      <section ref={stepsRef as React.RefObject<HTMLElement>} className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Het website project stappenplan
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Transparant en efficiënt: zo bouwen wij jouw website
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => <div key={index} className={`relative transition-all duration-700 ${stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{
            transitionDelay: `${index * 150}ms`
          }}>
                <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                  <span className="text-5xl font-extrabold text-accent/20 absolute top-4 right-4">
                    {step.number}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-3 pr-12">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-accent/30" />}
              </div>)}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section ref={includedRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Wat is inbegrepen?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Heldere scope en verwachtingen voor jouw project
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Included */}
            <div className={`bg-card border border-border rounded-xl p-8 transition-all duration-700 ${includedVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold">Inbegrepen standaard</h3>
              </div>
              <ul className="space-y-4">
                {includedStandard.map((item, index) => <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>)}
              </ul>
            </div>

            {/* Optional Modules */}
            <div className={`bg-card border border-border rounded-xl p-8 transition-all duration-700 ${includedVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{
            transitionDelay: "150ms"
          }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Optionele modules</h3>
              </div>
              <ul className="space-y-4">
                {optionalModules.map((item, index) => <li key={index} className="flex items-start gap-3">
                    <Plus className="w-5 h-5 text-accent/60 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Middle CTA - Pricing Transparency */}
      <section className="py-16 md:py-24 bg-accent text-accent-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Elk project is uniek
          </h2>
          <p className="text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto">Laten we samen de scope bepalen en een offerte op maat maken. Websites vanaf €497 - binnen een week live.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Ontvang een offerte
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Relevant Cases */}
      <section ref={casesRef as React.RefObject<HTMLElement>} className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Recente website projecten
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Bekijk enkele van onze meest recente succesvolle website projecten
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cases.map((project, index) => <a key={index} href={project.url} target="_blank" rel="noopener noreferrer" className={`group block transition-all duration-700 ${casesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{
            transitionDelay: `${index * 150}ms`
          }}>
                <div className="relative overflow-hidden rounded-xl border border-border hover:border-accent/50 transition-all duration-300">
                  <img src={project.image} alt={project.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <p className="text-accent text-sm font-medium mb-1">{project.category}</p>
                      <h3 className="text-primary-foreground text-xl font-bold">{project.title}</h3>
                    </div>
                  </div>
                </div>
              </a>)}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/portfolio" className="flex items-center gap-2">
                Bekijk alle projecten
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-accent text-accent" />)}
            </div>
            <blockquote className="text-xl md:text-2xl text-muted-foreground italic mb-6">
              "Nieuwblik heeft onze website binnen een week live gezet. De snelheid en professionaliteit zijn ongekend. 
              We krijgen nu dagelijks nieuwe aanvragen via de site!"
            </blockquote>
            <p className="font-bold">— Niels van Esveld, Esveld Installatie</p>
          </div>
        </div>
      </section>

      {/* Tools & Technology */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Gebouwd met de beste tools
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We gebruiken moderne technologie voor maximale snelheid en vindbaarheid
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3">
                <img src={lovableLogo} alt="Lovable" className="w-12 h-12 object-contain" />
              </div>
              <p className="text-sm font-medium">Lovable</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3">
                <img src={figmaLogo} alt="Figma" className="w-12 h-12 object-contain" />
              </div>
              <p className="text-sm font-medium">Figma</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3">
                <img src={geminiLogo} alt="Gemini AI" className="w-12 h-12 object-contain" />
              </div>
              <p className="text-sm font-medium">Gemini AI</p>
            </div>
            <div className="text-center group">
              <a href="https://www.hadoseo.com" target="_blank" rel="noopener noreferrer">
                <div className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3">
                  <img src={hadoseoLogo} alt="HadoSEO" className="w-12 h-12 object-contain" />
                </div>
                <p className="text-sm font-medium text-accent">HadoSEO</p>
              </a>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3">
                <img src={wordpressLogo} alt="WordPress" className="w-12 h-12 object-contain" />
              </div>
              <p className="text-sm font-medium">WordPress</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3">
                <img src={elementorLogo} alt="Elementor Pro" className="w-12 h-12 object-contain" />
              </div>
              <p className="text-sm font-medium">Elementor Pro</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 transition-colors p-3">
                <img src={woocommerceLogo} alt="WooCommerce" className="w-12 h-12 object-contain" />
              </div>
              <p className="text-sm font-medium">WooCommerce</p>
            </div>
          </div>

          {/* WordPress Note */}
          <div className="mt-12 max-w-3xl mx-auto text-center p-6 bg-secondary/50 rounded-xl border border-border">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Ook mogelijk:</span> Websites bouwen met WordPress en Elementor Pro, 
              of complete webshops met WordPress, Elementor Pro en WooCommerce. 
              Wij kiezen de beste oplossing voor jouw specifieke situatie.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Klaar om jouw website te laten bouwen?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Neem vandaag nog contact op en ontvang binnen 24 uur een vrijblijvende offerte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Start Je Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/80">
            <a href="tel:+31681762670" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Phone className="w-5 h-5" />
              +31 6 81762670
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="https://wa.me/31681762670" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <MessageCircle className="w-5 h-5" />
              WhatsApp Direct
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default WebsiteOpMaat;