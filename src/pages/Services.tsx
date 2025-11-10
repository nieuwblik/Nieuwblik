import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Palette, ShoppingBag, Pen } from "lucide-react";
import SocialContentSection from "@/components/SocialContentSection";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "Website Design & Development",
      description: "Op maat gemaakte, responsive websites die prachtig design combineren met krachtige functionaliteit. Van corporate sites tot complexe webapplicaties - wij creëren digitale ervaringen die bezoekers omzetten in klanten.",
      features: [
        "Responsive & Mobile-First Design",
        "SEO Optimalisatie",
        "Prestatie & Snelheidsoptimalisatie",
        "CMS Integratie",
        "E-commerce Oplossingen"
      ]
    },
    {
      icon: Palette,
      title: "Merkidentiteit & Brand Kits",
      description: "Complete merkidentiteitssystemen die jouw unieke visuele taal vastleggen. Wij creëren samenhangende brand kits die consistentie garanderen op alle contactpunten met je klanten.",
      features: [
        "Logo Design & Variaties",
        "Kleurenpalet Ontwikkeling",
        "Typografie Systeem",
        "Brand Richtlijnen",
        "Marketing Materialen"
      ]
    },
    {
      icon: ShoppingBag,
      title: "E-commerce Oplossingen",
      description: "Full-service e-commerce design inclusief productlijsten, banners en complete shop designs die verkoop stimuleren en gebruikerservaring verbeteren.",
      features: [
        "Productlijst Design",
        "Custom Banners & Graphics",
        "Shop Pagina Layouts",
        "Conversie Optimalisatie",
        "Mobiele Shopping Ervaring"
      ]
    },
    {
      icon: Pen,
      title: "Custom Design Services",
      description: "Van e-books tot autobelettering - wij leveren hoogwaardige custom designs op maat, perfect afgestemd op jouw specifieke wensen en merkidentiteit.",
      features: [
        "E-book Design & Layout",
        "Voertuigbelettering Graphics",
        "Drukwerk Materialen",
        "Social Media Graphics",
        "Custom Illustraties"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
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
          <div className="space-y-24">
            {services.map((service, index) => (
              <div 
                key={index}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
              >
                <div className={`flex flex-col ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex-grow">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h2>
                    <p className="text-muted-foreground text-lg mb-8 font-light">
                      {service.description}
                    </p>
                  </div>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 mt-auto">
                    <Link to="/start-je-project">Start je project</Link>
                  </Button>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="bg-secondary p-8 rounded-lg h-full">
                    <h3 className="font-semibold mb-4">Wat je krijgt:</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default Services;
