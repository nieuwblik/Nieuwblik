import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Globe, TrendingUp, Layers, Target, Repeat, Users, Check, Plus, ArrowRight, MessageCircle, Star, ShoppingBag, Megaphone } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
const Ecommerce = () => {
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
  const usps = [{
    icon: Globe,
    title: "Multichannel verkoop",
    subtitle: "Overal aanwezig",
    description: "Verkoop naadloos op je eigen webshop, Amazon, Bol.com en social media vanuit één centraal systeem."
  }, {
    icon: TrendingUp,
    title: "Conversie optimalisatie",
    subtitle: "Meer verkopen",
    description: "Data-gedreven aanpak die bezoekers omzet in kopers met A/B testing en slimme upsells."
  }, {
    icon: Repeat,
    title: "Automatisering",
    subtitle: "Schaalbaar groeien",
    description: "Van voorraadbeheer tot marketing automation: bespaar tijd en verhoog je omzet automatisch."
  }];
  const steps = [{
    number: "01",
    title: "E-commerce audit",
    description: "Diepgaande analyse van je huidige situatie, markt en groeimogelijkheden."
  }, {
    number: "02",
    title: "Strategie & roadmap",
    description: "Concrete actieplannen voor omzetgroei, inclusief kanaalstrategie en marketing."
  }, {
    number: "03",
    title: "Implementatie",
    description: "Technische opzet van alle systemen, koppelingen en automatiseringen."
  }, {
    number: "04",
    title: "Groei & optimalisatie",
    description: "Continue verbetering op basis van data, nieuwe kanalen en conversie-optimalisatie."
  }];
  const includedStandard = ["Complete e-commerce strategie", "Multichannel verkoop setup", "Marketplace integraties (Bol, Amazon)", "Marketing automation", "Voorraad & orderbeheer", "Conversie tracking & analytics", "Email marketing flows", "Performance dashboards"];
  const optionalModules = ["Social commerce (Instagram, TikTok)", "Internationaal uitbreiden", "ERP & boekhoud koppelingen", "Geavanceerde personalisatie", "Subscription & recurring billing", "Custom productconfigurator"];
  const faqs = [{
    question: "Wat is het verschil tussen een webshop en e-commerce?",
    answer: "Een webshop is je online winkel. E-commerce omvat de complete strategie: multichannel verkoop, marketing, automatisering en groei over alle kanalen."
  }, {
    question: "Kunnen jullie helpen met verkopen op Bol.com of Amazon?",
    answer: "Absoluut! We helpen bij de complete setup: van accountopening tot productoptimalisatie, voorraadbeheer en advertenties op marketplaces."
  }, {
    question: "Hoe snel kan ik resultaten verwachten?",
    answer: "De technische setup duurt 4-8 weken. Eerste resultaten zie je vaak binnen 3 maanden, met continue groei daarna door optimalisatie."
  }, {
    question: "Is dit geschikt voor mijn bedrijfsgrootte?",
    answer: "Of je nu net start of al miljoenen omzet draait, e-commerce oplossingen schalen mee. We adviseren altijd passend bij jouw situatie."
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
      <SEOHead title="E-commerce oplossingen | Multichannel verkoop - Nieuwblik" description="Groei je online verkoop met complete e-commerce oplossingen. Multichannel strategie, marketplace integraties en marketing automation." keywords="e-commerce, online verkoop, multichannel, Bol.com verkopen, Amazon seller, marketing automation, conversie optimalisatie" canonicalUrl="https://www.nieuwblik.com/diensten/e-commerce" structuredData={structuredData} />
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
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light mb-10">
            Niet zomaar een webshop, maar een complete groeistrategie. 
            Van je eigen website tot Amazon en Bol.com – overal verkopen, centraal beheren.
          </p>
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

      {/* E-commerce ecosystem visual */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Jouw complete e-commerce ecosysteem
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Alle kanalen verbonden, alle data gecentraliseerd
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[{
            icon: ShoppingBag,
            label: "Eigen webshop"
          }, {
            icon: Globe,
            label: "Bol.com"
          }, {
            icon: Layers,
            label: "Amazon"
          }, {
            icon: Users,
            label: "Social selling"
          }, {
            icon: Megaphone,
            label: "Marketing"
          }, {
            icon: Target,
            label: "Retargeting"
          }, {
            icon: TrendingUp,
            label: "Analytics"
          }, {
            icon: Repeat,
            label: "Automatisering"
          }].map((item, index) => <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto rounded-xl bg-card border border-border flex items-center justify-center mb-3 group-hover:border-accent/50 group-hover:shadow-lg transition-all duration-300">
                  <item.icon className="w-10 h-10 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </div>)}
          </div>
        </div>
      </section>

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