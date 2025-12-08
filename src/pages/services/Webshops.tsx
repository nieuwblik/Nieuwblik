import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShoppingCart, CreditCard, Package, Truck, BarChart3, Shield, Check, Plus, ArrowRight, MessageCircle, Star, Zap, Bot } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Webshops = () => {
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

  const usps = [
    {
      icon: ShoppingCart,
      title: "Gebruiksvriendelijk",
      subtitle: "Makkelijk bestellen",
      description: "Intuïtieve checkout flow die bezoekers moeiteloos door het aankoopproces leidt met minimale klikken."
    },
    {
      icon: CreditCard,
      title: "Veilige betalingen",
      subtitle: "iDEAL, Klarna & meer",
      description: "Alle populaire betaalmethoden geïntegreerd met bankniveau beveiliging voor zorgeloos winkelen."
    },
    {
      icon: BarChart3,
      title: "Groei & inzichten",
      subtitle: "Data-gedreven verkoop",
      description: "Realtime dashboards tonen conversies, bestsellers en klantgedrag voor slimme beslissingen."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Strategie & producten",
      description: "We analyseren jouw markt, doelgroep en producten om de perfecte webshop strategie te bepalen."
    },
    {
      number: "02",
      title: "Design & branding",
      description: "Een luxe, conversiegerichte webshop die jouw merk versterkt en vertrouwen wekt bij klanten."
    },
    {
      number: "03",
      title: "Technische setup",
      description: "Complete configuratie van betalingen, verzending, voorraad en automatiseringen."
    },
    {
      number: "04",
      title: "Lancering & groei",
      description: "Live gaan met SEO-optimalisatie en continue ondersteuning voor maximale verkoop."
    }
  ];

  const includedStandard = [
    "Volledig responsive webshop design",
    "Productcatalogus met varianten",
    "Veilige checkout met iDEAL & Klarna",
    "Voorraadbeheer systeem",
    "Automatische orderbevestigingen",
    "SEO-geoptimaliseerde productpagina's",
    "Google Analytics e-commerce tracking",
    "SSL-certificaat & beveiliging"
  ];

  const optionalModules = [
    "Koppeling met boekhoudpakket",
    "Dropshipping integratie",
    "Loyalty programma",
    "Abandoned cart e-mails",
    "Product reviews systeem",
    "Meertalige webshop"
  ];

  const faqs = [
    {
      question: "Hoe lang duurt het om een webshop te bouwen?",
      answer: "Een standaard webshop is binnen 2-3 weken live. Complexere shops met veel producten of custom functionaliteit kunnen 4-6 weken duren."
    },
    {
      question: "Welke betaalmethoden worden ondersteund?",
      answer: "Alle populaire methoden: iDEAL, creditcard, Bancontact, Klarna, PayPal en meer. We configureren alles voor jou."
    },
    {
      question: "Kan ik zelf producten toevoegen en beheren?",
      answer: "Absoluut! Je krijgt een gebruiksvriendelijk dashboard waar je zelfstandig producten, prijzen en voorraad kunt beheren."
    },
    {
      question: "Wat kost een professionele webshop?",
      answer: "Webshops starten vanaf €997. De exacte prijs hangt af van het aantal producten, functionaliteiten en integraties die je nodig hebt."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professionele webshops - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://www.nieuwblik.com"
    },
    "serviceType": "Webshop Development",
    "description": "Professionele webshops die verkopen. Veilige betalingen, voorraadbeheer en conversiegerichte designs.",
    "areaServed": "Nederland",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "EUR",
      "price": "997"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Webshop laten maken | Professionele webshops - Nieuwblik"
        description="Laat een professionele webshop bouwen die verkoopt. Veilige betalingen, voorraadbeheer, SEO-geoptimaliseerd. Webshops vanaf €997."
        keywords="webshop laten maken, professionele webshop, online winkel, e-commerce website, webshop bouwen, WooCommerce, Shopify"
        canonicalUrl="https://www.nieuwblik.com/diensten/webshops"
        structuredData={structuredData}
      />
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb
            items={[
              { label: "Diensten", path: "/diensten" },
              { label: "Webshops", path: "/diensten/webshops" }
            ]}
          />
        </div>
      </section>

      {/* Hero Section */}
      <section
        ref={heroRef as React.RefObject<HTMLElement>}
        className={`py-16 md:py-24 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="container mx-auto px-6">
          <p className="text-accent mb-6 uppercase tracking-wide font-medium">Webshops</p>
          <h1 className="text-display mb-6">
            Webshops die verkopen terwijl jij slaapt
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light mb-10">
            Van eerste bezoeker tot terugkerende klant. Wij bouwen webshops die converteren 
            met veilige betalingen, slim voorraadbeheer en een koopervaring die klanten niet vergeten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Start jouw webshop
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
            Waarom kiezen voor onze webshops?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Alles wat je nodig hebt om succesvol online te verkopen
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {usps.map((usp, index) => (
              <Card
                key={index}
                className={`text-center p-8 border-border/50 hover:border-accent/50 hover:shadow-xl transition-all duration-500 ${uspVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                    <usp.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{usp.title}</h3>
                  <p className="text-accent font-medium text-sm mb-4">{usp.subtitle}</p>
                  <p className="text-muted-foreground">{usp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section ref={stepsRef as React.RefObject<HTMLElement>} className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Zo bouwen wij jouw webshop
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Van idee tot verkopende webshop in vier stappen
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 ${stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                  <span className="text-5xl font-extrabold text-accent/20 absolute top-4 right-4">
                    {step.number}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-3 pr-12">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-accent/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section ref={includedRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Wat zit er in jouw webshop?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Complete webshop oplossing zonder verborgen kosten
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className={`bg-card border border-border rounded-xl p-8 transition-all duration-700 ${includedVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold">Standaard inbegrepen</h3>
              </div>
              <ul className="space-y-4">
                {includedStandard.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`bg-card border border-border rounded-xl p-8 transition-all duration-700 ${includedVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
              style={{ transitionDelay: "150ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Optionele uitbreidingen</h3>
              </div>
              <ul className="space-y-4">
                {optionalModules.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Plus className="w-5 h-5 text-accent/60 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-accent text-accent-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar om online te verkopen?
          </h2>
          <p className="text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
            Laten we bespreken hoe jouw webshop eruit moet zien. Webshops vanaf €997.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Vraag een offerte aan
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
            Alles wat je wilt weten over onze webshops
          </p>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-card border border-border rounded-lg p-6 transition-all duration-700 ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-muted-foreground italic mb-6">
              "Onze webshop draait nu volledig automatisch. Orders komen binnen, betalingen worden verwerkt 
              en klanten krijgen automatisch hun verzendinfo. Echt ontzorgd!"
            </blockquote>
            <p className="font-bold">— Tevreden webshop klant</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start vandaag met verkopen
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Neem contact op voor een vrijblijvend gesprek over jouw webshop wensen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
              <Link to="/contact" className="flex items-center gap-2">
                Neem contact op
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <a href="tel:+31681762670" className="flex items-center gap-2">
                Bel direct: 06 81 76 26 70
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Webshops;
