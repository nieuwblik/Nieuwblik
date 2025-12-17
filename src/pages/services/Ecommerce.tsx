import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Globe, TrendingUp, Layers, Target, Repeat, Users, Check, Plus, ArrowRight, MessageCircle, Star, ShoppingBag, Megaphone, Image, Package, BookOpen } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Import e-commerce listing images
import kattenbakListingImg from "@/assets/projects/kattenbak-listing.png";
import hamburgerPressListingImg from "@/assets/projects/hamburger-press-listing.png";
import schoenenWolListingImg from "@/assets/projects/schoenen-wol-listing.png";
import pastamachineListingImg from "@/assets/projects/pastamachine-listing.png";
import compressorListingImg from "@/assets/projects/compressor-listing.png";
const Ecommerce = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  const [faqRef, faqVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  const [portfolioRef, portfolioVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const ecommerceListings = [
    {
      title: "Kattenbak - Movendo",
      description: "Professionele Amazon product listing met complete USP's en feature highlights.",
      image: kattenbakListingImg,
    },
    {
      title: "Q-mate - Drogerballen",
      description: "Aantrekkelijke listing voor duurzame drogerballen met focus op kwaliteit.",
      image: hamburgerPressListingImg,
    },
    {
      title: "Hamburgerpers - Kitchenz",
      description: "Visueel sterke Amazon listing met duidelijke voordelen en gebruiksgemak.",
      image: schoenenWolListingImg,
    },
    {
      title: "Pastamachine - Kitchenz",
      description: "Complete product story voor premium pastamachines met gedetailleerde features.",
      image: pastamachineListingImg,
    },
    {
      title: "Compressor - Grobbie",
      description: "Technische product listing met focus op specificaties en toepassingen.",
      image: compressorListingImg,
    }
  ];
  const usps = [{
    icon: Image,
    title: "Professionele listings",
    subtitle: "Visueel verkopen",
    description: "Wij maken overtuigende product listings voor Amazon, Bol.com en andere marketplaces die je conversie verhogen."
  }, {
    icon: Package,
    title: "Productverpakkingen",
    subtitle: "Premium uitstraling",
    description: "Van concept tot print-ready ontwerp: verpakkingen die opvallen in het schap én bij de klant thuis."
  }, {
    icon: BookOpen,
    title: "Extra waarde producten",
    subtitle: "E-books & meer",
    description: "Creëer aanvullende producten zoals e-books, handleidingen en digital downloads die je marge verhogen."
  }];
  const steps = [{
    number: "01",
    title: "Briefing & research",
    description: "We analyseren je product, doelgroep en concurrentie voor de beste aanpak."
  }, {
    number: "02",
    title: "Concept & design",
    description: "Eerste concepten voor listings, verpakkingen of e-books ter beoordeling."
  }, {
    number: "03",
    title: "Revisierondes",
    description: "Feedback verwerken tot je 100% tevreden bent met het eindresultaat."
  }, {
    number: "04",
    title: "Oplevering",
    description: "Alle bestanden in de juiste formaten, klaar voor upload of productie."
  }];
  const includedStandard = ["Professionele product listings", "Marketplace-ready afbeeldingen", "Conversiegerichte productbeschrijvingen", "A+ content / Enhanced Brand Content", "Productverpakking design", "E-books en digital downloads", "Print-ready bestanden", "Revisierondes inbegrepen"];
  const optionalModules = ["3D product visualisaties", "Video productpresentaties", "Lifestyle fotografie", "Meertalige listings", "Brandbook & richtlijnen", "Maandelijkse optimalisatie"];
  const faqs = [{
    question: "Wat maken jullie precies voor e-commerce?",
    answer: "Wij maken professionele product listings (tekst + afbeeldingen), productverpakkingen en extra waarde producten zoals e-books. De webshop, verkoop en logistiek regel je zelf."
  }, {
    question: "Kunnen jullie ook mijn hele webshop bouwen?",
    answer: "Voor complete webshops verwijzen we je naar onze Webshops dienst. Hier focussen we puur op de content die je producten laat verkopen."
  }, {
    question: "Hoe lang duurt het om een listing te maken?",
    answer: "Een complete product listing is meestal binnen 1-2 weken klaar, inclusief revisierondes. Bij grotere aantallen maken we een passende planning."
  }, {
    question: "Leveren jullie print-ready bestanden?",
    answer: "Ja! Verpakkingsdesigns leveren we altijd print-ready aan, inclusief de juiste snijmarges en kleurprofielen voor jouw drukker."
  }];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "E-commerce oplossingen - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://www.nieuwblik.com"
    },
    "serviceType": "E-commerce Strategy & Development",
    "description": "Complete e-commerce oplossingen: multichannel verkoop, marketplace integraties, marketing automation en conversie-optimalisatie.",
    "areaServed": "Nederland"
  };
  return <div className="min-h-screen bg-background">
      <SEOHead title="E-commerce oplossingen | Multichannel verkoop - Nieuwblik" description="Groei je online verkoop met complete e-commerce oplossingen. Multichannel strategie, marketplace integraties en marketing automation." keywords="e-commerce, online verkoop, multichannel, Bol.com verkopen, Amazon seller, marketing automation, conversie optimalisatie" canonicalUrl="https://nieuwblik.com/diensten/ecommerce" structuredData={structuredData} breadcrumbs={[
        { name: "Home", url: "https://nieuwblik.com" },
        { name: "Diensten", url: "https://nieuwblik.com/diensten" },
        { name: "E-commerce", url: "https://nieuwblik.com/diensten/ecommerce" }
      ]} />
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{
          label: "Diensten",
          path: "/diensten"
        }, {
          label: "E-commerce",
          path: "/diensten/e-commerce"
        }]} />
        </div>
      </section>

      {/* Hero Section */}
      <section ref={heroRef as React.RefObject<HTMLElement>} className={`py-16 md:py-24 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="container mx-auto px-6">
          <p className="text-accent mb-6 uppercase tracking-wide font-medium">E-commerce</p>
          <h1 className="text-display mb-6">
            E-commerce die echt groeit
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light mb-6">
            Wij maken professionele product listings, verpakkingsdesigns en extra waarde producten zoals e-books. 
            De verkoop, logistiek en klantenservice? Dat is voor jou – wij focussen op wat je verkoopt.
          </p>
          <div className="bg-secondary/80 border border-border rounded-lg p-4 mb-10 max-w-2xl">
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Onze focus:</strong> Wij creëren de visuele en tekstuele content die jouw producten laat verkopen. 
              De webshop, marketplace accounts, fulfillment en klantcontact regel jij zelf of via een andere partner.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Bespreek je groeikansen
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

      {/* USPs */}
      <section ref={uspRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Waarom onze e-commerce aanpak werkt
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Geen losse projecten, maar een strategie voor duurzame groei
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

      {/* Portfolio Section */}
      <section ref={portfolioRef as React.RefObject<HTMLElement>} className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Onze e-commerce projecten
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Professionele listings die daadwerkelijk verkopen
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecommerceListings.map((listing, index) => (
              <div 
                key={index}
                className={`group cursor-pointer transition-all duration-700 ${portfolioVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setSelectedImage(listing.image)}
              >
                <div className="aspect-[4/3] bg-secondary rounded-lg mb-4 overflow-hidden relative">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-sm font-medium bg-background px-4 py-2 rounded-full shadow-lg">
                      Bekijk groter
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">{listing.title}</h3>
                <p className="text-muted-foreground text-sm">{listing.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="E-commerce listing"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Steps */}
      <section ref={stepsRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Onze e-commerce aanpak
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Gestructureerd naar meetbare resultaten
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
      <section ref={includedRef as React.RefObject<HTMLElement>} className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Wat we voor je regelen
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Complete e-commerce oplossingen op maat
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className={`bg-card border border-border rounded-xl p-8 transition-all duration-700 ${includedVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold">Kernonderdelen</h3>
              </div>
              <ul className="space-y-4">
                {includedStandard.map((item, index) => <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>)}
              </ul>
            </div>

            <div className={`bg-card border border-border rounded-xl p-8 transition-all duration-700 ${includedVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{
            transitionDelay: "150ms"
          }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Uitbreidingen</h3>
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

      {/* CTA */}
      <section className="py-16 md:py-24 bg-accent text-accent-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar om je omzet te verdubbelen?
          </h2>
          <p className="text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
            Plan een vrijblijvend strategiegesprek en ontdek de groeikansen voor jouw business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Plan een strategiegesprek
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef as React.RefObject<HTMLElement>} className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Veelgestelde vragen
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Antwoorden op de meest voorkomende e-commerce vragen
          </p>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => <div key={index} className={`bg-card border border-border rounded-lg p-6 transition-all duration-700 ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{
            transitionDelay: `${index * 100}ms`
          }}>
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>)}
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
            <blockquote className="text-xl md:text-2xl text-muted-foreground italic mb-6">"Door de multichannel aanpak van Nieuwblik zijn we nu ook succesvol op Bol.com en Amazon. Onze omzet is in 6 maanden met 140% gestegen!"</blockquote>
            <p className="font-bold">— Maarten, Kitchenz</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Laten we jouw e-commerce naar het volgende niveau tillen
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Neem contact op voor een vrijblijvend gesprek over jouw groeimogelijkheden
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Neem contact op
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Ecommerce;