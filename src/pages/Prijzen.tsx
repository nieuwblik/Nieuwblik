import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Pricing } from "@/components/ui/pricing";

const Prijzen = () => {
  const pricingPlans = [
    {
      name: "Basis",
      price: "€499",
      yearlyPrice: "€4.990",
      period: "/maand",
      description: "Perfect voor kleine bedrijven die online willen starten",
      features: [
        "Tot 5 pagina's",
        "Responsive design",
        "Basis SEO optimalisatie",
        "Contactformulier",
        "Google Analytics",
        "1 maand gratis onderhoud"
      ],
      buttonText: "Start Nu",
      href: "/contact",
      isPopular: false
    },
    {
      name: "Professioneel",
      price: "€999",
      yearlyPrice: "€9.990",
      period: "/maand",
      description: "Voor groeiende bedrijven met uitgebreide wensen",
      features: [
        "Tot 15 pagina's",
        "Advanced responsive design",
        "Uitgebreide SEO optimalisatie",
        "Meerdere contactformulieren",
        "Google Analytics & Search Console",
        "Blog functionaliteit",
        "3 maanden gratis onderhoud",
        "Prioriteitsondersteuning"
      ],
      buttonText: "Kies Professioneel",
      href: "/contact",
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "€1.999",
      yearlyPrice: "€19.990",
      period: "/maand",
      description: "Voor grotere projecten met custom oplossingen",
      features: [
        "Onbeperkt aantal pagina's",
        "Custom design & functionaliteit",
        "Geavanceerde SEO strategie",
        "E-commerce mogelijkheden",
        "API integraties",
        "Database & CMS",
        "6 maanden gratis onderhoud",
        "24/7 ondersteuning",
        "Dedicated projectmanager"
      ],
      buttonText: "Contact voor Enterprise",
      href: "/contact",
      isPopular: false
    }
  ];

  return (
    <>
      <SEOHead 
        title="Prijzen - Transparante Webdesign Tarieven | Nieuwblik"
        description="Bekijk onze prijzen voor webdesign en webontwikkeling. Transparante tarieven zonder verborgen kosten. Van basis websites tot enterprise oplossingen."
        canonicalUrl="https://nieuwblik.nl/prijzen"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <Pricing 
            plans={pricingPlans}
            title="Transparante Prijzen"
            description="Kies het pakket dat bij jouw bedrijf past. Alle pakketten inclusief hosting en onderhoud."
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Prijzen;
