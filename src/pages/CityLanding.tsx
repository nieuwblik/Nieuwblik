import { kiesCases } from "@/lib/cases";
import { Link } from "@/lib/router-compat";
import NotFound from "./NotFound";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingHero from "@/components/LandingHero";
import ContactBlock from "@/components/ContactBlock";
import CaseGrid from "@/components/CaseGrid";
import BenefitList from "@/components/BenefitList";
import LandingFaq from "@/components/LandingFaq";
import { faqPage } from "@/lib/structured-data";
import { getCityLokaal } from "@/data/cityLokaal";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { AnimatedButton } from "@/components/ui/animated-button";
import { getCityBySlug } from "@/data/cities";
import { getCityExtra } from "@/data/cityExtras";
import { companyInfo } from "@/config/company";
import { useDarkNavSection } from "@/components/UnderlayNav";

// Zes cases, nieuwste eerst, in het raster van de portfoliopagina.
const featuredProjects = kiesCases();

/** Alinea met [tekst](/pad) als interne link. */
const Alinea = ({ tekst }: { tekst: string }) => (
  <p className="text-muted-foreground leading-relaxed">
    {tekst.split(/\[([^\]]+)\]\((\/[^)]+)\)/).map((deel, i, delen) => {
      // De split levert om en om: tekst, linktekst, pad, tekst, ...
      if (i % 3 === 1) {
        return (
          <Link key={i} to={delen[i + 1]!} className="text-accent hover:underline font-semibold">
            {deel}
          </Link>
        );
      }
      return i % 3 === 2 ? null : <span key={i}>{deel}</span>;
    })}
  </p>
);

const CityLanding = ({ slug }: { slug: string }) => {
  // Dark CTA band: invert the fixed header while it's under it.
  const darkNavRef = useDarkNavSection<HTMLElement>();
  const city = getCityBySlug(slug);
  if (!city) return <NotFound />;

  const url = `${companyInfo.url}/website-laten-maken-${city.slug}`;
  // Handgeschreven tekst per stad (src/data/cityLokaal.ts) gaat voor op de
  // gegenereerde data in cities.ts. Staat een stad daar nog niet in, dan blijft
  // alles precies zoals het was.
  const lokaal = getCityLokaal(city.slug);
  const seoTitle = lokaal?.title ?? city.title;
  const seoDescription = lokaal?.metaDescription ?? city.metaDescription;
  const extra = getCityExtra(city.slug);
  const nearbyCities = (extra?.nearby ?? [])
    .map((s) => getCityBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: seoTitle,
        description: seoDescription,
        url,
        inLanguage: "nl-NL",
      },
      // Alleen een FAQPage als de vragen echt over deze plaats gaan.
      ...(lokaal ? [{ ...faqPage(lokaal.faq), "@id": `${url}#faq` }] : []),
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={url}
        structuredData={webPageJsonLd}
        includeLocalBusinessSchema={true}
      />

      <LandingHero h1={lokaal?.h1 ?? city.h1} subtitle={city.heroSubtitle} />

      {/* Lokaal blok: handgeschreven per stad, anders de gegenereerde intro */}
      <section className="py-12 md:py-16 bg-background">
        <div
          className={`container mx-auto px-4 sm:px-6 max-w-3xl ${lokaal ? "" : "text-center"}`}
        >
          {extra && (
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
              Regio {extra.region}
            </p>
          )}
          {lokaal ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                {lokaal.lokaal.h2}
              </h2>
              <div className="space-y-4">
                {lokaal.lokaal.alineas.map((alinea, idx) => (
                  <Alinea key={idx} tekst={alinea} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-lg leading-relaxed">
              {city.intro}
            </p>
          )}
        </div>
      </section>

      {/* Sectie 1: Waarom een professionele website.
          section1.body wordt hier bewust niet gerenderd — die is woord voor
          woord gelijk aan city.intro, die hierboven al één keer staat. */}
      <BenefitList h2={city.section1.h2} items={city.section1.benefits} className="bg-secondary" />

      {/* Sectie 2: Vergelijking */}
      <ProblemSolutionSection />

      {/* Sectie 3: Reviews */}
      <section ref={darkNavRef} className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'hsl(160 84% 12%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30 blur-[120px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(160 84% 45%) 0%, transparent 70%)' }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center text-white">
            {city.section3H2}
          </h2>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Sectie 4: Portfolio */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{city.section4.h2}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{city.section4.intro}</p>
          </div>
          <CaseGrid projects={featuredProjects} />
          <div className="text-center mt-12">
            <AnimatedButton to="/portfolio" size="lg" variant="outline">
              Alle projecten bekijken
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Sectie 5: FAQ — alleen bij steden met eigen, plaatsgebonden vragen */}
      {lokaal && <LandingFaq h2={`Veelgestelde vragen over een website in ${city.name}`} items={lokaal.faq} />}

      {/* Sectie 6: Contactblok */}
      <ContactBlock h2={city.contactBlock.h2} body={city.contactBlock.body} />

      {/* Interne linksectie */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <p className="text-muted-foreground leading-relaxed">
            {city.internalLinks.split(/(diensten|portfolio|contactpagina)/).map((part, i) => {
              if (part === "diensten") return <Link key={i} to="/diensten" className="text-accent hover:underline font-semibold">diensten</Link>;
              if (part === "portfolio") return <Link key={i} to="/portfolio" className="text-accent hover:underline font-semibold">portfolio</Link>;
              if (part === "contactpagina") return <Link key={i} to="/contact" className="text-accent hover:underline font-semibold">contactpagina</Link>;
              return part;
            })}
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
            Lokaal actief? Bekijk onze pagina voor{" "}
            <Link to="/seo-enkhuizen" className="text-accent hover:underline font-semibold">SEO Enkhuizen</Link>
            {" "}of het{" "}
            <Link to="/werkgebied/west-friesland" className="text-accent hover:underline font-semibold">werkgebied West-Friesland</Link>.
          </p>

          {nearbyCities.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Ook actief in de buurt:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {nearbyCities.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/website-laten-maken-${c.slug}`}
                    className="text-sm text-accent hover:underline font-semibold"
                  >
                    Website laten maken {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CityLanding;
