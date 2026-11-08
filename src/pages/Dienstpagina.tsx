import { lazy, Suspense } from "react";
import { SITE_URL } from "@/config/site";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import CaseGrid from "@/components/CaseGrid";
import GoogleReviewMuur from "@/components/GoogleReviewMuur";
import DienstGolfHero from "@/components/dienst/DienstGolfHero";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Check } from "lucide-react";
import { INKT_65, Linkjes, Pakketten, Sectie, SectieKop, type Pakket } from "@/components/dienst/DienstBlokken";
import { caseLaptops, caseTelefoons, type TelefoonFoto } from "@/data/caseMockups";
import { companyInfo } from "@/config/company";
import { projects } from "@/data/projects";

const FAQSection = lazy(() => import("@/components/FAQSection"));

/** Cases onder "Recent werk" als een pagina zelf geen keuze maakt. */
const STANDAARD_CASES = ["feigro-dakwerken", "taxi-drechterland"];
/** Telefoonmockups naast de tekstblokken, op volgorde; een pagina kan er zelf een kiezen. */
const STANDAARD_BEELDEN = ["feigro-dakwerken", "taxi-drechterland", "vv-madjoe", "een-bundel-geluk", "esveld-installatie"];

type Sectiedata = DienstpaginaData["secties"][number];

/**
 * Tekstblok in de stijl van de homepage en de analysepagina: een statementkop met de
 * tekst ernaast en een casefoto (telefoon in de hand) die tot de rand van het scherm
 * doorloopt, om en om links en rechts. De foto loopt boven en onder iets over de rand
 * van de sectie heen, de eerste ook over de hero.
 */
const BeeldSectie = ({
  sectie,
  foto,
  alt,
  links,
  papier,
  eerste,
}: {
  sectie: Sectiedata;
  foto: TelefoonFoto;
  alt: string;
  links: boolean;
  papier: boolean;
  eerste: boolean;
}) => (
  <section className={`relative ${papier ? "sw-paper" : "bg-background"}`}>
    <div
      className={`grid grid-cols-1 lg:items-center ${links ? "lg:grid-cols-[minmax(0,44vw)_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,44vw)]"}`}
    >
      <div
        className={`relative z-10 aspect-[4/5] overflow-hidden ${links ? "lg:rounded-r-3xl" : "lg:order-2 lg:rounded-l-3xl"} ${eerste ? "" : "lg:-my-12"}`}
      >
        <img
          src={foto.src}
          srcSet={foto.srcSet}
          sizes="(min-width: 1024px) 44vw, 100vw"
          width={foto.breedte}
          height={foto.hoogte}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `50% ${Math.round(foto.midden * 100)}%` }}
        />
      </div>
      <div className={`px-4 py-14 sm:px-6 lg:py-28 ${links ? "lg:px-16 xl:px-24" : "lg:order-1 lg:px-16 xl:px-24"}`}>
        <div className="max-w-[640px]">
          <h2 className="pf-inleiding">{sectie.titel}</h2>
          {sectie.intro && (
            <p className="mt-6 text-lg font-light leading-relaxed md:text-xl" style={{ color: INKT_65 }}>
              {sectie.intro}
            </p>
          )}
          {sectie.alineas && (
            <div className="mt-6 space-y-5 text-lg font-light leading-relaxed" style={{ color: INKT_65 }}>
              {sectie.alineas.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
          )}
          {sectie.vinkjes && (
            <ul className="mt-8 space-y-3.5">
              {sectie.vinkjes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0" style={{ color: "hsl(var(--sw-green))" }} strokeWidth={2.6} aria-hidden="true" />
                  <span className="text-[0.9375rem] leading-relaxed md:text-base" style={{ color: INKT_65 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </section>
);

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
  /** Slugs uit src/data/projects.ts voor "Recent werk"; zonder deze lijst de standaardcases. */
  cases?: string[];
  /**
   * Cases naast de tekstblokken, op volgorde: een slug voor de telefoonmockup
   * (caseTelefoons) of "laptop:<slug>" voor de laptopfoto (caseLaptops).
   */
  beelden?: string[];
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
        <DienstGolfHero
          kruimels={[{ label: data.dienst, path: `/${data.slug}` }]}
          titel={data.accent ? `${data.titel} ${data.accent}` : data.titel}
          intro={data.intro}
          knop={{ label: "Gratis website-analyse", to: "/gratis-website-analyse" }}
          tweedeKnop={{ label: "Bereken je prijs", to: "/wat-kost-een-website" }}
        />

        {data.secties.map((s, i) => {
          const gekozen = (data.beelden ?? []).map((b) => b.replace(/^laptop:/, ""));
          const slugs = [...(data.beelden ?? []), ...STANDAARD_BEELDEN.filter((b) => !gekozen.includes(b))];
          const keuze = slugs[i % slugs.length]!;
          const laptop = keuze.startsWith("laptop:");
          const slug = laptop ? keuze.slice("laptop:".length) : keuze;
          const foto = laptop ? caseLaptops[slug] : caseTelefoons[slug];
          const naam = projects.find((p) => p.slug === slug)?.title ?? "een klant";
          return foto ? (
            <BeeldSectie
              key={s.titel}
              sectie={s}
              foto={foto}
              alt={laptop ? `Website van ${naam} op een laptop` : `Mobiele website van ${naam} op een iPhone`}
              links={i % 2 === 0}
              papier={i % 2 === 0}
              eerste={i === 0}
            />
          ) : null;
        })}

        {data.pakketten && (
          <Sectie papier={data.secties.length % 2 === 0}>
            <SectieKop titel={data.pakketten.titel} {...(data.pakketten.intro ? { intro: data.pakketten.intro } : {})} />
            <Pakketten items={data.pakketten.items} />
          </Sectie>
        )}

        {/* Recent werk, de reviewmuur en de FAQ zoals op de rest van de site */}
        <Sectie papier={(data.secties.length + (data.pakketten ? 1 : 0)) % 2 === 0}>
          <div className="mb-12 md:mb-16">
            <h2 className="pf-inleiding">
              Recent werk voor ondernemers in heel Nederland. Van dakdekker tot taxibedrijf: elke site op maat ontworpen,
              snel en goed vindbaar.
            </h2>
          </div>
          <CaseGrid
            projects={(data.cases ?? STANDAARD_CASES).flatMap((slug) => projects.filter((p) => p.slug === slug))}
            zonderOmschrijving
          />
        </Sectie>

        <GoogleReviewMuur />

        <Suspense fallback={<div className="min-h-[420px]" />}>
          <FAQSection
            zonderAnimatie
            vragen={data.faq.map((f) => ({ question: f.q, answer: f.a }))}
            actie={
              <AnimatedButton to="/gratis-website-analyse" size="lg">
                Gratis website-analyse
              </AnimatedButton>
            }
          />
        </Suspense>

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
