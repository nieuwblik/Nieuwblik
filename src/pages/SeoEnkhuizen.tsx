import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Search, TrendingUp, Star, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import { Button } from "@/components/ui/button";
import { companyInfo } from "@/config/company";

const url = "https://www.nieuwblik.com/seo-enkhuizen";

const faqItems = [
  {
    q: "Wat kost SEO in Enkhuizen bij Nieuwblik?",
    a: "Een lokale SEO aanpak voor ondernemers in Enkhuizen begint bij ons vanaf 750 euro per project. Voor doorlopende optimalisatie werken we met heldere maandpakketten vanaf 350 euro per maand. We stellen vooraf een transparante offerte op zodat je precies weet wat je krijgt.",
  },
  {
    q: "Hoe lang duurt het voordat ik resultaat zie van SEO in Enkhuizen?",
    a: "De eerste verbeteringen in Google zien we vaak al binnen 4 tot 8 weken, zeker bij lokale zoektermen zoals 'kapper Enkhuizen' of 'restaurant Enkhuizen'. Stevige posities op concurrerende termen vragen 3 tot 6 maanden consistent werken aan content, techniek en lokale autoriteit.",
  },
  {
    q: "Werken jullie alleen met ondernemers uit Enkhuizen?",
    a: "Nee, we werken voor ondernemers in heel West-Friesland en Noord-Holland. Maar omdat we zelf in Enkhuizen gevestigd zijn, kennen we de lokale markt, de doelgroep en de zoektermen die hier echt werken extra goed.",
  },
  {
    q: "Wat is het verschil tussen lokale SEO en gewone SEO?",
    a: "Lokale SEO richt zich op zoekopdrachten met een plaatsnaam of 'in de buurt'. We optimaliseren Google Business, lokale citations, recensies en zorgen dat jouw site direct laat zien dat je in Enkhuizen actief bent. Dat geeft een veel snellere voorsprong dan landelijke SEO.",
  },
  {
    q: "Kunnen jullie ook mijn Google Business profiel optimaliseren?",
    a: "Ja, dat is een vast onderdeel van onze lokale SEO aanpak. We optimaliseren je profiel met de juiste categorieën, foto's, openingstijden en posts, en helpen je met een strategie om meer 5 sterren recensies te krijgen van klanten in Enkhuizen.",
  },
];

const graphJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "SEO Enkhuizen | Lokale SEO specialist - Nieuwblik",
      description: "SEO Enkhuizen voor lokale ondernemers. Beter vindbaar in Google met onze lokale aanpak, Google Business en sterke content. Vanaf 750 euro.",
      url,
      inLanguage: "nl-NL",
    },
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: "SEO Enkhuizen",
      serviceType: "Zoekmachine optimalisatie",
      areaServed: [
        { "@type": "City", name: "Enkhuizen" },
        { "@type": "AdministrativeArea", name: "West-Friesland" },
      ],
      provider: {
        "@type": "Organization",
        name: companyInfo.name,
        url: companyInfo.url,
      },
      offers: {
        "@type": "Offer",
        price: "750",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqItems.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    },
  ],
};

const SeoEnkhuizen = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="SEO Enkhuizen | Lokale SEO specialist - Nieuwblik"
        description="SEO Enkhuizen voor lokale ondernemers. Beter vindbaar in Google met onze lokale aanpak, Google Business en sterke content. Vanaf 750 euro."
        canonicalUrl={url}
        structuredData={graphJsonLd}
        includeLocalBusinessSchema={true}
      />
      <Navigation />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Lokale SEO specialist in Enkhuizen
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              SEO Enkhuizen, beter vindbaar in Google voor lokale ondernemers
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Nieuwblik is jouw lokale SEO partner in Enkhuizen. Wij zorgen dat klanten uit Enkhuizen, Bovenkarspel en de rest van West-Friesland jouw bedrijf vinden via Google, in plaats van de concurrent een straat verderop.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">
                  Gratis SEO scan aanvragen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/werkgebied/west-friesland">
                  Werkgebied West-Friesland
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Probleem / oplossing */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">
              Waarom lokale SEO in Enkhuizen het verschil maakt
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-3xl mx-auto text-center">
              Zoekt iemand in Enkhuizen naar "kapper", "restaurant" of "loodgieter", dan toont Google een lokale kaart met drie bedrijven. Sta jij daar niet bij, dan ben je bijna onzichtbaar. Met onze lokale SEO aanpak zorgen we dat jouw bedrijf bovenaan staat voor de zoektermen die jouw klanten echt gebruiken.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Search className="w-5 h-5" />,
                  title: "Lokaal zoekwoordenonderzoek",
                  text: "We zoeken precies uit waar jouw doelgroep in Enkhuizen op Google. Geen aannames, alleen data.",
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  title: "Google Business optimalisatie",
                  text: "Compleet profiel, juiste categorieën, foto's en wekelijkse posts zodat je opvalt in de lokale kaart.",
                },
                {
                  icon: <Star className="w-5 h-5" />,
                  title: "Recensie strategie",
                  text: "Een plan om structureel meer 5 sterren reviews te krijgen van klanten uit Enkhuizen en omgeving.",
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  title: "Sterke lokale content",
                  text: "Pagina's per dienst en per kern in West-Friesland die echt iets vertellen, voor Google én voor je klant.",
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  title: "Technische SEO",
                  text: "Snelheid, mobiel, structured data en schone code. De basis waarop alle andere SEO inspanningen rusten.",
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  title: "Lokale backlinks",
                  text: "We bouwen samenwerkingen met WEEFF, lokale media en West-Friese ondernemersnetwerken om jouw autoriteit te vergroten.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-background rounded-2xl p-6 border border-border">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prijzen */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              SEO Enkhuizen prijzen
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Onze lokale SEO aanpak begint bij <strong className="text-foreground">750 euro</strong> voor een eenmalige optimalisatie van je site en Google Business profiel. Voor doorlopende groei werken we met maandpakketten vanaf <strong className="text-foreground">350 euro per maand</strong>. Altijd transparant, geen verborgen kosten en opzegbaar per maand.
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">
                Vraag een offerte op maat
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <LandingFaq h2="Veelgestelde vragen over SEO in Enkhuizen" items={faqItems} />

        {/* Contact */}
        <ContactBlock
          h2="Klaar om bovenaan Google te staan in Enkhuizen?"
          body="Vraag een gratis SEO scan aan van jouw huidige site. We laten zien waar de quick wins liggen en hoe we jouw bedrijf zichtbaarder maken voor klanten in Enkhuizen en West-Friesland."
        />

        {/* Interne links */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <p className="text-muted-foreground leading-relaxed">
              Lees meer over ons{" "}
              <Link to="/werkgebied/enkhuizen" className="text-accent hover:underline font-semibold">werkgebied Enkhuizen</Link>
              , ontdek onze regio hub voor{" "}
              <Link to="/werkgebied/west-friesland" className="text-accent hover:underline font-semibold">West-Friesland</Link>
              , bekijk de{" "}
              <Link to="/diensten" className="text-accent hover:underline font-semibold">diensten</Link>
              {" "}of vraag direct een{" "}
              <Link to="/website-laten-maken-kapper" className="text-accent hover:underline font-semibold">kapperswebsite</Link>
              {" "}of{" "}
              <Link to="/website-laten-maken-restaurant" className="text-accent hover:underline font-semibold">restaurantwebsite</Link>
              {" "}aan.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SeoEnkhuizen;
