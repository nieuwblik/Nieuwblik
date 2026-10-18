import { SITE_URL } from "@/config/site";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContactBlock from "@/components/ContactBlock";
import { DienstHero, Linkjes, Pakketten, Sectie, SectieKop, Tekst, Vinkjes, Vragen, type Pakket } from "@/components/dienst/DienstBlokken";
import { companyInfo } from "@/config/company";

export type DienstpaginaData = {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  dienst: string;
  titel: string;
  accent?: string;
  intro: string;
  secties: { titel: string; intro?: string; alineas?: string[]; vinkjes?: string[] }[];
  pakketten?: { titel: string; intro?: string; items: Pakket[] };
  faq: { q: string; a: string }[];
  links: { label: string; to: string }[];
  contact: { h2: string; body: string };
  prijsVanaf: number;
};

const Dienstpagina = ({ data }: { data: DienstpaginaData }) => {
  const url = `${SITE_URL}/${data.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, name: data.title, description: data.description, url, inLanguage: "nl-NL" },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: data.dienst,
        areaServed: { "@type": "Country", name: "Nederland" },
        provider: { "@type": "Organization", name: companyInfo.name, url: companyInfo.url },
        offers: { "@type": "Offer", price: String(data.prijsVanaf), priceCurrency: "EUR", availability: "https://schema.org/InStock", url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: data.dienst, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={data.title} description={data.description} keywords={data.keywords} canonicalUrl={url} structuredData={jsonLd} includeLocalBusinessSchema={true} />
      <main>
        <DienstHero
          kruimels={[{ label: data.dienst, path: `/${data.slug}` }]}
          titel={data.titel}
          {...(data.accent ? { accent: data.accent } : {})}
          intro={data.intro}
          knop={{ label: "Gratis website-analyse", to: "/gratis-website-analyse" }}
          tweedeKnop={{ label: "Bereken je prijs", to: "/wat-kost-een-website" }}
        />

        {data.secties.map((s, i) => (
          <Sectie key={s.titel} papier={i % 2 === 0}>
            <SectieKop titel={s.titel} {...(s.intro ? { intro: s.intro } : {})} />
            {s.alineas && (
              <Tekst>
                {s.alineas.map((a) => (
                  <p key={a}>{a}</p>
                ))}
              </Tekst>
            )}
            {s.vinkjes && <Vinkjes items={s.vinkjes} />}
          </Sectie>
        ))}

        {data.pakketten && (
          <Sectie papier={data.secties.length % 2 === 0}>
            <SectieKop titel={data.pakketten.titel} {...(data.pakketten.intro ? { intro: data.pakketten.intro } : {})} />
            <Pakketten items={data.pakketten.items} />
          </Sectie>
        )}

        <Sectie papier={(data.secties.length + (data.pakketten ? 1 : 0)) % 2 === 0}>
          <SectieKop titel={`Veelgestelde vragen`} />
          <Vragen items={data.faq.map((f) => ({ question: f.q, answer: f.a }))} />
        </Sectie>

        <ContactBlock h2={data.contact.h2} body={data.contact.body} />

        <Sectie>
          <SectieKop titel="Ook interessant" />
          <Linkjes items={data.links} />
        </Sectie>
      </main>
      <Footer />
    </div>
  );
};

export default Dienstpagina;
