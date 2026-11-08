import { kiesCases } from "@/lib/cases";
import { Link } from "@/lib/router-compat";
import NotFound from "./NotFound";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingHero from "@/components/LandingHero";
import CaseGrid from "@/components/CaseGrid";
import BenefitList from "@/components/BenefitList";
import LandingFaq from "@/components/LandingFaq";
import Alinea from "@/components/Alinea";
import { TekstBlok } from "@/components/dienst/BeeldBlok";
import { dienstInPlaats, faqPage } from "@/lib/structured-data";
import { LokaleSecties, TodoBlok } from "@/components/LokaleSecties";
import { getCityLokaal } from "@/data/cityLokaal";
import { getLandingMeta } from "@/data/landingMeta";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";
import GoogleReviewMuur from "@/components/GoogleReviewMuur";
import { AnimatedButton } from "@/components/ui/animated-button";
import { getCityBySlug } from "@/data/cities";
import { getCityExtra } from "@/data/cityExtras";
import { companyInfo } from "@/config/company";

// Zes cases, nieuwste eerst, in het raster van de portfoliopagina.
const standaardCases = kiesCases();

const CityLanding = ({ slug }: { slug: string }) => {
  // Dark CTA band: invert the fixed header while it's under it.
  const city = getCityBySlug(slug);
  if (!city) return <NotFound />;

  const url = `${companyInfo.url}/website-laten-maken-${city.slug}`;
  // Handgeschreven tekst per stad (src/data/cityLokaal.ts) gaat voor op de
  // gegenereerde data in cities.ts. Staat een stad daar nog niet in, dan blijft
  // alles precies zoals het was.
  const lokaal = getCityLokaal(city.slug);
  const eigenOpbouw = Boolean(lokaal?.eigenOpbouw);
  const featuredProjects = lokaal?.cases ? kiesCases(lokaal.cases) : standaardCases;
  const meta = getLandingMeta(city.slug);
  const seoTitle = lokaal?.title ?? meta?.title ?? city.title;
  const seoDescription = lokaal?.metaDescription ?? meta?.metaDescription ?? city.metaDescription;
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
      ...(eigenOpbouw ? [dienstInPlaats({ plaats: city.name, url })] : []),
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

      <LandingHero h1={lokaal?.h1 ?? meta?.h1 ?? city.h1} subtitle={lokaal?.intro ?? city.heroSubtitle} />

      {/* Lokaal blok: handgeschreven per stad, anders de gegenereerde intro */}
      {lokaal ? (
        <TekstBlok kop={lokaal.lokaal.h2}>
          {lokaal.lokaal.alineas.map((alinea, idx) => (
            <Alinea key={idx} tekst={alinea} />
          ))}
        </TekstBlok>
      ) : (
        <section className="bg-background pb-16 pt-8 md:pb-24 md:pt-12">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="max-w-3xl text-xl font-light leading-relaxed md:text-2xl" style={{ color: "hsl(var(--sw-ink) / 0.75)" }}>
              {city.intro}
            </p>
          </div>
        </section>
      )}

      {/* Sectie 1: Waarom een professionele website.
          section1.body wordt hier bewust niet gerenderd — die is woord voor
          woord gelijk aan city.intro, die hierboven al één keer staat. */}
      {/* Eigen secties en plaatshouders (handgeschreven steden) */}
      {lokaal?.secties && <LokaleSecties secties={lokaal.secties} seed={city.slug} cases={lokaal.cases} />}
      <TodoBlok items={lokaal?.todo} />

      {/* Sjabloonblokken: alleen zonder eigen opbouw */}
      {!eigenOpbouw && (
        <>
          <BenefitList h2={lokaal?.headings?.benefits ?? meta?.headings?.benefits ?? city.section1.h2} items={city.section1.benefits} />

          {/* Sectie 2: Vergelijking */}
          <ProblemSolutionSection wit />
        </>
      )}

      {/* Sectie 3: Reviews */}
      <GoogleReviewMuur kop={lokaal?.headings?.reviews ?? city.section3H2} />

      {/* Sectie 4: Portfolio */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 max-w-4xl md:mb-16">
            <h2 className="pf-inleiding">{lokaal?.headings?.portfolio ?? city.section4.h2}</h2>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">{city.section4.intro}</p>
          </div>
          <CaseGrid projects={featuredProjects} />
          <div className="mt-12">
            <AnimatedButton to="/portfolio" size="lg" variant="outline">
              Alle projecten bekijken
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Sectie 5: FAQ — alleen bij steden met eigen, plaatsgebonden vragen */}
      {lokaal && <LandingFaq h2={`Veelgestelde vragen over een website in ${city.name}`} items={lokaal.faq} />}


      {/* Interne linksectie */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {!eigenOpbouw && (<>
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
          </>)}

          {nearbyCities.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Ook actief in de buurt:</p>
              <div className="flex flex-wrap gap-3">
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
