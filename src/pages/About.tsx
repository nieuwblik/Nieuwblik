import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Users, Sparkles, Rocket } from "lucide-react";
import justinImg from "@/assets/justin-slok.webp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const heroAnimation = useScrollAnimation(0.1);
  const valuesAnimation = useScrollAnimation(0.1);
  const ctaAnimation = useScrollAnimation(0.1);

  const values = [
    {
      icon: Heart,
      title: "Passie voor perfectie",
      description: "Elk project krijgt onze volledige toewijding. We stoppen pas als het resultaat niet alleen goed is, maar fenomenaal."
    },
    {
      icon: Users,
      title: "Samen sterker",
      description: "Jouw succes is ons succes. We werken niet voor je, maar met je. Echte partnership levert de beste resultaten."
    },
    {
      icon: Sparkles,
      title: "Creativiteit zonder grenzen",
      description: "We durven te innoveren en denken buiten de gebaande paden. Jouw merk verdient iets unieks, iets dat écht opvalt."
    },
    {
      icon: Rocket,
      title: "Gericht op groei",
      description: "Design is mooi, maar resultaat is koning. Al onze beslissingen zijn gericht op meetbare groei voor jouw bedrijf."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Over Ons - Nieuwblik",
    "description": "Leer meer over Nieuwblik, jouw partner in digitale groei. Onze missie, waarden en passie voor het creëren van digitale oplossingen die echt impact maken.",
    "url": "https://www.nieuwblik.com/over-ons",
    "mainEntity": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "founder": {
        "@type": "Person",
        "name": "Justin Slok"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Over Ons | Passie voor Digitaal Design - Nieuwblik"
        description="Gedreven door passie, geleid door resultaat. Ontdek het verhaal achter Nieuwblik en waarom we doen wat we doen. Jouw digitale succes is onze missie!"
        keywords="over ons, webdesign bureau, digitale agency, nieuwblik team, webdesign enkhuizen"
        canonicalUrl="https://www.nieuwblik.com/over-ons"
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Breadcrumb */}
      <section className="pt-32 pb-0">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Over Ons", path: "/over-ons" }]} />
        </div>
      </section>
      
      {/* Hero Section with Image */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              ref={heroAnimation.ref}
              className={`transition-all duration-1000 ${
                heroAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
              }`}
            >
              <p className="text-accent mb-6">OVER ONS</p>
              <h1 className="text-display mb-6">
                Gedreven door passie, geleid door resultaat
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-light">
                We geloven dat design meer is dan mooi plaatjes - het is een krachtige tool die emotie wekt en actie inspireert.
              </p>
              <p className="text-lg text-muted-foreground mb-8 font-light leading-relaxed">
                Bij Nieuwblik combineren we creatieve visie met strategisch denken. We luisteren naar jouw verhaal, begrijpen je doelen en vertalen dat naar digitale oplossingen die niet alleen opvallen, maar ook converteren. Elk project is een nieuwe kans om iets bijzonders te creëren.
              </p>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/start-je-project">Laten we kennismaken</Link>
              </Button>
            </div>
            <div
              className={`transition-all duration-1000 delay-200 ${
                heroAnimation.isVisible 
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent/10 rounded-lg transform rotate-3"></div>
                <img
                  src={justinImg} 
                  alt="Justin Slok - Oprichter van Nieuwblik"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="800"
                  className="relative rounded-lg shadow-2xl w-full object-cover transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ons verhaal: van droom tot werkelijkheid
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
              <p>
                Nieuwblik is geboren uit een simpele maar krachtige overtuiging: elk bedrijf verdient een digitale aanwezigheid die hun unieke verhaal vertelt en klanten inspireert tot actie.
              </p>
              <p>
                Wat begon als een passie voor design, groeide uit tot een missie om bedrijven te helpen succesvol te zijn online. We zagen te vaak dat mooie websites en sterke merken het verschil maken tussen groeien en stilstaan.
              </p>
              <p>
                Vandaag de dag zijn we trots op de relaties die we hebben opgebouwd en de successen die we hebben gerealiseerd. Elke tevreden klant, elk goed lopend project - dat is waar we het voor doen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent mb-4">ONZE KERNWAARDEN</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Wat ons drijft en definieert
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Deze waarden vormen de basis van alles wat we doen, van het eerste gesprek tot de eindoplevering.
            </p>
          </div>
          
          <div
            ref={valuesAnimation.ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-secondary p-8 rounded-lg transition-all duration-700 hover:shadow-lg hover:transform hover:-translate-y-2 ${
                  valuesAnimation.isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                <p className="text-muted-foreground font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaAnimation.ref}
        className={`py-20 md:py-32 bg-gradient-to-br from-primary to-accent bg-[length:200%_200%] animate-gradient-shift transition-all duration-1000 ${
          ctaAnimation.isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Klaar om samen iets moois te creëren?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-light">
            We horen graag jouw verhaal en helpen je graag om je digitale dromen waar te maken.
          </p>
          <Button asChild size="lg" variant="secondary" className="animate-glow-pulse">
            <Link to="/start-je-project">Neem contact op</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
