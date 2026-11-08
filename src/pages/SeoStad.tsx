import { SITE_URL } from "@/config/site";
import { Link } from "@/lib/router-compat";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import SeoPortfolio from "@/components/SeoPortfolio";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";
import LandingHero from "@/components/LandingHero";
import { BeeldBlok, BlokKop, BlokLijst, BlokTekst, TekstBlok, fotoVoor } from "@/components/dienst/BeeldBlok";

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
    { h3: "Zoekwoorden uit " + data.stad, text: `We zoeken uit waar klanten in ${data.stad} echt op zoeken. Geen aannames, alleen data.` },
    { h3: "Google Bedrijfsprofiel", text: "Juiste categorieën, foto's en vaste posts, zodat je opvalt in de kaart met drie bedrijven." },
    { h3: "Meer 5 sterren reviews", text: `Een simpel plan om structureel reviews te krijgen van klanten uit ${data.stad} en omgeving.` },
    { h3: "Lokale content", text: "Pagina's per dienst en per plaats die je klant echt helpen, en die Google begrijpt." },
    { h3: "Snelle, schone techniek", text: "Laadsnelheid, mobiel en gestructureerde data. De basis waarop alles rust." },
    { h3: "Maandelijks inzicht", text: "Een helder overzicht van posities, bezoekers en aanvragen. Je ziet wat het oplevert." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={data.title} description={data.description} keywords={data.keywords} canonicalUrl={url} structuredData={graphJsonLd} includeLocalBusinessSchema={true} />
      <main>
        <LandingHero
          h1={data.h1}
          subtitle={data.intro}
          knoppen={
            <>
              <AnimatedButton to="/gratis-website-analyse" className="h-12 w-full sm:w-auto">
                Gratis SEO-scan aanvragen
              </AnimatedButton>
              <AnimatedButton to="/contact" variant="outline" className="h-12 w-full sm:w-auto">
                Direct contact
              </AnimatedButton>
            </>
          }
        />

        {(() => {
          const foto = fotoVoor(0, data.slug);
          const inhoud = (
            <>
              <BlokKop>{data.waaromH2}</BlokKop>
              <BlokTekst>
                <p>{data.waaromTekst}</p>
                <p>{data.voorbeelden}</p>
              </BlokTekst>
              <BlokLijst items={blokken} />
            </>
          );
          return foto ? (
            <BeeldBlok foto={foto.foto} alt={foto.alt} slug={foto.slug} naam={foto.naam} links>
              {inhoud}
            </BeeldBlok>
          ) : (
            <section className="bg-background py-20 md:py-28">
              <div className="container mx-auto max-w-4xl px-4 sm:px-6">{inhoud}</div>
            </section>
          );
        })()}

        <TekstBlok kop={`Wat kost SEO in ${data.stad}?`}>
          <p>
            Een eenmalige lokale SEO-aanpak voor je site en Google Bedrijfsprofiel start vanaf <strong className="font-semibold text-foreground">750 euro</strong>. Wil je blijven groeien, dan werken we met maandpakketten vanaf <strong className="font-semibold text-foreground">350 euro per maand</strong>. Vaste prijs vooraf, geen verborgen kosten en maandelijks opzegbaar.
          </p>
          <div className="pt-3">
            <AnimatedButton to="/contact" size="lg">Vraag een offerte op maat</AnimatedButton>
          </div>
        </TekstBlok>

        <SeoPortfolio stad={data.stad} />

        <LandingFaq h2={`Veelgestelde vragen over SEO in ${data.stad}`} items={data.faq} />


        <section className="bg-background py-16 md:py-20">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
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
