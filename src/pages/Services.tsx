import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Globe, Palette, ShoppingBag, Pen, ArrowRight } from "lucide-react";
import SocialContentSection from "@/components/SocialContentSection";
import ToolsSlider from "@/components/ToolsSlider";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
const ServiceCard = ({
  service,
  index
}: {
  service: any;
  index: number;
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  return <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{
    transitionDelay: `${index * 150}ms`
  }}>
      <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-accent/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            <service.icon className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
          </div>
          <CardTitle className="text-2xl md:text-3xl mb-3 group-hover:text-accent transition-colors duration-300">
            {service.title}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground font-light leading-relaxed">
            {service.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-secondary/50 p-6 rounded-lg backdrop-blur-sm border border-border/30">
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-accent">Wat je krijgt:</h4>
            <ul className="space-y-3">
              {service.features.map((feature: string, idx: number) => <li key={idx} className="flex items-start gap-3 group/item">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-300" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>)}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group-hover:shadow-lg transition-all duration-300">
            <Link to={service.link || "/start-je-project"} className="flex items-center justify-center gap-2">
              {service.linkText || "Start je project"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>;
};
const Services = () => {
  const services = [{
    icon: Globe,
    title: "Website design & development",
    description: "Op maat gemaakte, responsive websites die prachtig design combineren met krachtige functionaliteit. Van corporate sites tot complexe webapplicaties - wij creëren digitale ervaringen die bezoekers omzetten in klanten.",
    features: ["Responsive & mobile-first design", "SEO optimalisatie", "Prestatie & snelheidsoptimalisatie", "CMS integratie", "E-commerce oplossingen"],
    link: "/diensten/website-op-maat",
    linkText: "Bekijk website dienst"
  }, {
    icon: Palette,
    title: "Merkidentiteit & brand kits",
    description: "Complete merkidentiteitssystemen die jouw unieke visuele taal vastleggen. Wij creëren samenhangende brand kits die consistentie garanderen op alle contactpunten met je klanten.",
    features: ["Logo design & variaties", "Kleurenpalet ontwikkeling", "Typografie systeem", "Brand richtlijnen", "Marketing materialen"]
  }, {
    icon: ShoppingBag,
    title: "E-commerce oplossingen",
    description: "Full-service e-commerce design inclusief productlijsten, banners en complete shop designs die verkoop stimuleren en gebruikerservaring verbeteren.",
    features: ["Productlijst design", "Custom banners & graphics", "Shop pagina layouts", "Conversie optimalisatie", "Mobiele shopping ervaring"]
  }, {
    icon: Pen,
    title: "Custom design services",
    description: "Van e-books tot autobelettering - wij leveren hoogwaardige custom designs op maat, perfect afgestemd op jouw specifieke wensen en merkidentiteit.",
    features: ["E-book design & layout", "Voertuigbelettering graphics", "Drukwerk materialen", "Social media graphics", "Custom illustraties"]
  }];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Digitale Diensten - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://www.nieuwblik.com"
    },
    "serviceType": "Webdesign & Digitale Marketing",
    "areaServed": "Nederland",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digitale Diensten",
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.description
        }
      }))
    }
  };
  return <div className="min-h-screen bg-background">
      <SEOHead title="Digitale Diensten die Groeien | Webdesign & Branding - Nieuwblik" description="Ontdek onze premium digitale diensten: webdesign, merkidentiteit, e-commerce en custom design. Wij creëren oplossingen die jouw bedrijf laten groeien. Start vandaag!" keywords="webdesign diensten, merkidentiteit, branding, e-commerce oplossingen, custom design, digitale diensten, website ontwikkeling" canonicalUrl="https://www.nieuwblik.com/diensten" structuredData={structuredData} />
      <Navigation />
      
      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{
          label: "Diensten",
          path: "/diensten"
        }]} />
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <p className="text-accent mb-6">ONZE DIENSTEN</p>
          <h1 className="text-display mb-6">
            Complete digitale oplossingen die groeien met jouw ambities
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            Wij specialiseren ons in het creëren van premium digitale ervaringen die jouw merk naar een hoger niveau tillen en meetbare resultaten opleveren.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => <ServiceCard key={index} service={service} index={index} />)}
          </div>
        </div>
      </section>

      {/* Tools Slider */}
      

      {/* Social Content Section */}
      <SocialContentSection />

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent bg-[length:200%_200%] animate-gradient-shift">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Klaar om jouw merk te laten schitteren?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light">
            Laten we bespreken hoe onze diensten jou kunnen helpen je bedrijfsdoelen te bereiken.
          </p>
          <Button asChild size="lg" variant="secondary" className="animate-glow-pulse">
            <Link to="/start-je-project">Start vandaag</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Services;