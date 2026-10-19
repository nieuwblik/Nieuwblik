import { SITE_URL } from "@/config/site";
import { Link } from "@/lib/router-compat";
import { MapPin, Search, TrendingUp, Star, CheckCircle2, Gauge } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import SeoPortfolio from "@/components/SeoPortfolio";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";

export type SeoStadData = {
  slug: string;
  stad: string;
  regio: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
  intro: string;
  waaromH2: string;
  waaromTekst: string;
  voorbeelden: string;
  faq: { q: string; a: string }[];
  stadspagina: { label: string; to: string };
  buren: { label: string; to: string }[];
};

const SeoStad = ({ data }: { data: SeoStadData }) => {
  const url = `${SITE_URL}/${data.slug}`;
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, name: data.title, description: data.description, url, inLanguage: "nl-NL" },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `SEO ${data.stad}`,
        serviceType: "Zoekmachine optimalisatie",
        areaServed: [
          { "@type": "City", name: data.stad },
          { "@type": "AdministrativeArea", name: data.regio },
        ],
        provider: { "@type": "Organization", name: companyInfo.name, url: companyInfo.url },
        offers: { "@type": "Offer", price: "750", priceCurrency: "EUR", availability: "https://schema.org/InStock", url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: `SEO ${data.stad}`, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: data.faq.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
      },
    ],
  };

  const blokken = [
    { icon: <Search className="w-5 h-5" />, title: "Zoekwoorden uit " + data.stad, text: `We zoeken uit waar klanten in ${data.stad} echt op zoeken. Geen aannames, alleen data.` },
    { icon: <MapPin className="w-5 h-5" />, title: "Google Bedrijfsprofiel", text: "Juiste categorieën, foto's en vaste posts, zodat je opvalt in de kaart met drie bedrijven." },
    { icon: <Star className="w-5 h-5" />, title: "Meer 5 sterren reviews", text: `Een simpel plan om structureel reviews te krijgen van klanten uit ${data.stad} en omgeving.` },
    { icon: <TrendingUp className="w-5 h-5" />, title: "Lokale content", text: "Pagina's per dienst en per plaats die je klant echt helpen, en die Google begrijpt." },
    { icon: <Gauge className="w-5 h-5" />, title: "Snelle, schone techniek", text: "Laadsnelheid, mobiel en gestructureerde data. De basis waarop alles rust." },
    { icon: <CheckCircle2 className="w-5 h-5" />, title: "Maandelijks inzicht", text: "Een helder overzicht van posities, bezoekers en aanvragen. Je ziet wat het oplevert." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={data.title} description={data.description} keywords={data.keywords} canonicalUrl={url} structuredData={graphJsonLd} includeLocalBusinessSchema={true} />
      <main>
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">{data.h1}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">{data.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <AnimatedButton to="/gratis-website-analyse" size="lg">Gratis SEO-scan aanvragen</AnimatedButton>
              <AnimatedButton to="/contact" size="lg" variant="outline">Direct contact</AnimatedButton>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">{data.waaromH2}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4 max-w-3xl mx-auto text-center">{data.waaromTekst}</p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-3xl mx-auto text-center">{data.voorbeelden}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blokken.map((item) => (
                <div key={item.title} className="bg-background rounded-2xl p-6 border border-border">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Wat kost SEO in {data.stad}?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Een eenmalige lokale SEO-aanpak voor je site en Google Bedrijfsprofiel start vanaf <strong className="text-foreground">750 euro</strong>. Wil je blijven groeien, dan werken we met maandpakketten vanaf <strong className="text-foreground">350 euro per maand</strong>. Vaste prijs vooraf, geen verborgen kosten en maandelijks opzegbaar.
            </p>
            <AnimatedButton to="/contact" size="lg">Vraag een offerte op maat</AnimatedButton>
          </div>
        </section>

        <SeoPortfolio stad={data.stad} />

        <LandingFaq h2={`Veelgestelde vragen over SEO in ${data.stad}`} items={data.faq} />

        <ContactBlock
          h2={`Klaar om bovenaan Google te staan in ${data.stad}?`}
          body={`Vraag een gratis SEO-scan aan. We laten zien waar de snelle winst zit en hoe je zichtbaarder wordt voor klanten in ${data.stad} en ${data.regio}.`}
        />

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <p className="text-muted-foreground leading-relaxed">
              Nog geen goede website? Bekijk{" "}
              <Link to={data.stadspagina.to} className="text-accent hover:underline font-semibold">{data.stadspagina.label}</Link>
              . Ook actief in:{" "}
              {data.buren.map((b, i) => (
                <span key={b.to}>
                  <Link to={b.to} className="text-accent hover:underline font-semibold">{b.label}</Link>
                  {i < data.buren.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SeoStad;
