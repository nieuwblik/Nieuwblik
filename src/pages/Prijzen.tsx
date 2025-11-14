import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumb from "@/components/Breadcrumb";
import { Pricing } from "@/components/ui/pricing";
import SocialContentSection from "@/components/SocialContentSection";

const Prijzen = () => {
  const seoPaketten = [
    {
      name: "BASIS SEO",
      price: "299",
      yearlyPrice: "239",
      period: "per maand",
      features: [
        "Keyword research & analyse",
        "On-page SEO optimalisatie",
        "Google My Business optimalisatie",
        "Maandelijkse ranking rapportage",
        "Technische SEO audit",
        "Tot 10 pagina's optimaliseren",
        "Basis linkbuilding strategie",
        "Email support",
      ],
      description: "Perfect voor startups en kleine bedrijven die online zichtbaarheid willen opbouwen",
      buttonText: "Start vandaag",
      href: "/contact",
      isPopular: false,
    },
    {
      name: "PROFESSIONAL SEO",
      price: "599",
      yearlyPrice: "479",
      period: "per maand",
      features: [
        "Alles uit Basis SEO",
        "Uitgebreide concurrentieanalyse",
        "Content marketing strategie",
        "Maandelijks 4 SEO-blogs",
        "Geavanceerde linkbuilding",
        "Lokale SEO optimalisatie",
        "Tot 25 pagina's optimaliseren",
        "Conversie optimalisatie",
        "Social media integratie",
        "Bi-weekly performance calls",
        "Priority support",
      ],
      description: "Ideaal voor groeiende bedrijven die hun online aanwezigheid willen versterken",
      buttonText: "Aan de slag",
      href: "/contact",
      isPopular: true,
    },
    {
      name: "ENTERPRISE SEO",
      price: "1299",
      yearlyPrice: "1039",
      period: "per maand",
      features: [
        "Alles uit Professional SEO",
        "Onbeperkt aantal pagina's",
        "Dedicated SEO specialist",
        "Maandelijks 8 SEO-blogs",
        "Internationale SEO strategie",
        "E-commerce SEO optimalisatie",
        "Advanced schema markup",
        "Voice search optimalisatie",
        "Custom dashboard & analytics",
        "Weekly strategy sessies",
        "24/7 priority support",
        "Kwartaal strategieplan",
      ],
      description: "Voor grote organisaties met specifieke SEO doelen en complexe websites",
      buttonText: "Neem contact op",
      href: "/contact",
      isPopular: false,
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "SEO Diensten",
    "description": "Professionele SEO pakketten voor bedrijven van elke grootte. Verhoog uw online zichtbaarheid en ranking in Google.",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": "https://nieuwblik.nl"
    },
    "offers": seoPaketten.map(pakket => ({
      "@type": "Offer",
      "name": pakket.name,
      "price": pakket.yearlyPrice,
      "priceCurrency": "EUR",
      "description": pakket.description,
      "url": "https://nieuwblik.nl/prijzen"
    }))
  };

  return (
    <>
      <SEOHead
        title="SEO Prijzen - Transparante Pakketten | Nieuwblik"
        description="Ontdek onze SEO pakketten vanaf €239/maand. Basis SEO, Professional SEO en Enterprise SEO met duidelijke prijzen. Bespaar 20% met jaarlijkse facturering."
        keywords="seo prijzen, seo pakket, seo kosten, google ranking, zoekmachine optimalisatie prijs, seo diensten, website optimalisatie kosten"
        canonicalUrl="https://nieuwblik.nl/prijzen"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-32">
          <div className="container mx-auto px-6">
            <Breadcrumb 
              items={[
                { label: "Home", path: "/" },
                { label: "Prijzen", path: "/prijzen" }
              ]}
            />
          </div>

          {/* Hero Section */}
          <section className="container mx-auto px-6 py-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              SEO Pakketten voor Elk Budget
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Kies het SEO pakket dat perfect bij jouw bedrijf past. Alle pakketten zijn maandelijks opzegbaar 
              en je bespaart 20% bij jaarlijkse facturering.
            </p>
          </section>

          {/* Pricing Component */}
          <Pricing 
            plans={seoPaketten}
            title="Eenvoudige, Transparante SEO Prijzen"
            description="Alle pakketten bevatten uitgebreide SEO analyse, maandelijkse rapportages en persoonlijke begeleiding.
Geen verborgen kosten, geen verrassingen."
          />

          {/* Extra Features Section */}
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Wat je krijgt bij elk pakket
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    Transparante Rapportage
                  </h3>
                  <p className="text-muted-foreground">
                    Ontvang maandelijks gedetailleerde rapportages met je ranking ontwikkeling, 
                    traffic groei en belangrijkste KPI's in een overzichtelijk dashboard.
                  </p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    Geen Verplichtingen
                  </h3>
                  <p className="text-muted-foreground">
                    Alle pakketten zijn maandelijks opzegbaar. We werken niet met langdurige contracten 
                    omdat we geloven in resultaten, niet in verplichtingen.
                  </p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    Persoonlijke Begeleiding
                  </h3>
                  <p className="text-muted-foreground">
                    Je krijgt een dedicated SEO specialist die je website kent en met je meedenkt 
                    over de beste strategie voor jouw branche.
                  </p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    White-hat Technieken
                  </h3>
                  <p className="text-muted-foreground">
                    We gebruiken alleen white-hat SEO technieken die voldoen aan de richtlijnen van Google. 
                    Duurzame resultaten zonder risico's.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="container mx-auto px-6 py-20 bg-secondary/20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Veelgestelde Vragen
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-border bg-background">
                  <h3 className="text-lg font-semibold mb-2">
                    Hoe snel zie ik resultaten?
                  </h3>
                  <p className="text-muted-foreground">
                    SEO is een lange termijn investering. De eerste resultaten zie je meestal na 3-6 maanden, 
                    maar significante ranking verbeteringen kunnen 6-12 maanden duren afhankelijk van concurrentie en branche.
                  </p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-background">
                  <h3 className="text-lg font-semibold mb-2">
                    Kan ik later upgraden naar een hoger pakket?
                  </h3>
                  <p className="text-muted-foreground">
                    Ja, je kunt op elk moment upgraden naar een hoger pakket. We zorgen voor een soepele 
                    overgang en je betaalt alleen het verschil pro-rata voor de resterende periode.
                  </p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-background">
                  <h3 className="text-lg font-semibold mb-2">
                    Wat gebeurt er als ik stop met het pakket?
                  </h3>
                  <p className="text-muted-foreground">
                    De optimalisaties die we hebben doorgevoerd blijven behouden op je website. 
                    Je krijgt alle content en rapportages die we hebben gemaakt. Wel zullen rankings 
                    op termijn kunnen dalen zonder doorlopende optimalisatie.
                  </p>
                </div>
                <div className="p-6 rounded-lg border border-border bg-background">
                  <h3 className="text-lg font-semibold mb-2">
                    Zijn er extra kosten?
                  </h3>
                  <p className="text-muted-foreground">
                    Nee, alle genoemde diensten zijn inbegrepen in het maandelijkse tarief. 
                    Eventuele aanvullende werkzaamheden zoals een volledige website redesign 
                    worden altijd vooraf besproken en geoffreerd.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <SocialContentSection />

          {/* CTA Section */}
          <section className="container mx-auto px-6 py-20">
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Klaar om je Online Zichtbaarheid te Vergroten?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start vandaag nog met professionele SEO en zie je website stijgen in de zoekresultaten. 
                Neem vrijblijvend contact op voor een persoonlijk adviesgesprek.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
                >
                  Start je Project
                </a>
                <a 
                  href="/portfolio" 
                  className="inline-flex items-center justify-center px-8 py-3 bg-background text-foreground border border-border rounded-md font-semibold hover:bg-secondary transition-colors"
                >
                  Bekijk Portfolio
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Prijzen;
