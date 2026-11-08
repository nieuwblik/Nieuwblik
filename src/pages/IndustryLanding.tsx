import { kiesCases } from "@/lib/cases";
import { PRIJZEN } from "@/config/business";
import { getLandingMeta } from "@/data/landingMeta";
import { Link } from "@/lib/router-compat";
import NotFound from "./NotFound";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingHero from "@/components/LandingHero";
import LandingFaq from "@/components/LandingFaq";
import CaseGrid from "@/components/CaseGrid";
import BenefitList from "@/components/BenefitList";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";
import GoogleReviewMuur from "@/components/GoogleReviewMuur";
import { BeeldBlok, BlokKop, BlokVinkjes, fotoVoor } from "@/components/dienst/BeeldBlok";
import { AnimatedButton } from "@/components/ui/animated-button";
import { getIndustryBySlug } from "@/data/industries";
import { getIndustryExtra, getRelatedIndustrySlugs } from "@/data/industryExtras";
import { companyInfo } from "@/config/company";


const IndustryLanding = ({ slug }: { slug: string }) => {
  // Dark CTA band: invert the fixed header while it's under it.
  const industry = getIndustryBySlug(slug);
  if (!industry) return <NotFound />;

  const url = `${companyInfo.url}/website-laten-maken-${industry.slug}`;
  // Hand-authored per branche in industries.ts — unique per record, unlike the
  // old rotating 3-template generator (which caused ~14/30 industry pages to
  // share a near-identical meta description).
  const meta = getLandingMeta(industry.slug);
  const seoTitle = meta?.title ?? industry.title;
  const seoDescription = meta?.metaDescription ?? industry.metaDescription;
  const extra = getIndustryExtra(industry.slug);
  // De cases die bij deze branche horen eerst, aangevuld tot zes.
  const branchProjects = kiesCases(extra?.relevantCaseSlugs ?? []);
  const relatedIndustries = getRelatedIndustrySlugs(industry.slug, 3)
    .map((s) => getIndustryBySlug(s))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));
  const graphJsonLd = {
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
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Website laten maken voor ${industry.name.toLowerCase()}`,
        serviceType: "Webdesign",
        areaServed: { "@type": "Country", name: "Nederland" },
        provider: { "@type": "Organization", name: "Nieuwblik", url: companyInfo.url },
        offers: {
          "@type": "Offer",
          price: String(PRIJZEN.starter),
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: String(PRIJZEN.starter),
            priceCurrency: "EUR",
            valueAddedTaxIncluded: false,
          },
          availability: "https://schema.org/InStock",
          url,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: industry.faq.items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={url}
        structuredData={graphJsonLd}
        includeLocalBusinessSchema={true}
      />

      <LandingHero h1={industry.h1} subtitle={industry.heroSubtitle} />

      {/* Intro paragraaf voor extra keyword context */}
      <section className="bg-background pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="max-w-3xl text-xl font-light leading-relaxed md:text-2xl" style={{ color: "hsl(var(--sw-ink) / 0.75)" }}>
            {industry.intro}
          </p>
        </div>
      </section>


      {/* Sectie 1: Wat heeft deze branche nodig.
          section1.body wordt hier bewust niet gerenderd — die is woord voor
          woord gelijk aan industry.intro, die hierboven al één keer staat. */}
      <BenefitList h2={industry.section1.h2} items={industry.section1.needs} />

      {/* Sectie 1b: Uitdagingen & functies specifiek voor deze branche */}
      {extra && (() => {
        const foto = fotoVoor(1, industry.section1.h2);
        if (!foto) return null;
        return (
          <BeeldBlok foto={foto.foto} alt={foto.alt} links={false}>
            <BlokKop>Uitdagingen voor een {industry.name.toLowerCase()} online</BlokKop>
            <ul className="mt-8 border-t border-border">
              {extra.painpoints.map((punt, idx) => (
                <li key={idx} className="border-b border-border py-5 leading-relaxed text-muted-foreground">
                  {punt}
                </li>
              ))}
            </ul>
            <h2 className="mt-14 text-2xl font-semibold leading-snug tracking-tight sw-ink md:text-3xl">
              Functies die voor een {industry.name.toLowerCase()} website het verschil maken
            </h2>
            <BlokVinkjes items={extra.features} />
          </BeeldBlok>
        );
      })()}

      {/* Sectie 2: Vergelijking */}
      <ProblemSolutionSection wit />

      {/* Sectie 3: Reviews */}
      <GoogleReviewMuur kop={industry.section3H2} />

      {/* Sectie 4: Portfolio */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 max-w-4xl md:mb-16">
            <h2 className="pf-inleiding">{industry.section4.h2}</h2>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">{industry.section4.intro}</p>
          </div>
          <CaseGrid projects={branchProjects} />
          <div className="mt-12">
            <AnimatedButton to="/portfolio" size="lg" variant="outline">
              Alle projecten bekijken
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Sectie 5: FAQ */}
      <LandingFaq h2={industry.faq.h2} items={industry.faq.items} />


      {/* Interne linksectie */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-muted-foreground leading-relaxed">
            {industry.internalLinks.split(/(diensten|portfolio|over ons pagina)/).map((part, i) => {
              if (part === "diensten") return <Link key={i} to="/diensten" className="text-accent hover:underline font-semibold">diensten</Link>;
              if (part === "portfolio") return <Link key={i} to="/portfolio" className="text-accent hover:underline font-semibold">portfolio</Link>;
              if (part === "over ons pagina") return <Link key={i} to="/over-ons" className="text-accent hover:underline font-semibold">over ons pagina</Link>;
              return part;
            })}
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
            Lokaal actief? Bekijk onze pagina voor{" "}
            <Link to="/seo-enkhuizen" className="text-accent hover:underline font-semibold">SEO Enkhuizen</Link>
            {" "}of het{" "}
            <Link to="/werkgebied/west-friesland" className="text-accent hover:underline font-semibold">werkgebied West-Friesland</Link>.
          </p>

          {relatedIndustries.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Ook interessant:</p>
              <div className="flex flex-wrap gap-3">
                {relatedIndustries.map((i) => (
                  <Link
                    key={i.slug}
                    to={`/website-laten-maken-${i.slug}`}
                    className="text-sm text-accent hover:underline font-semibold"
                  >
                    Website voor {i.name.toLowerCase()}
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

export default IndustryLanding;
