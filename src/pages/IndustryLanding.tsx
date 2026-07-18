import { Link, Navigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingHero from "@/components/LandingHero";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import ProjectCard from "@/components/ProjectCard";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { AnimatedButton } from "@/components/ui/animated-button";
import { projects } from "@/data/projects";
import { getIndustryBySlug } from "@/data/industries";
import { getIndustryExtra, getRelatedIndustrySlugs } from "@/data/industryExtras";
import { companyInfo } from "@/config/company";
import { useDarkNavSection } from "@/components/UnderlayNav";
import { buildLandingTitle, buildIndustryDescription } from "@/lib/programmaticSeo";

const featuredTitles = ["Quantum Rehab Europe", "Pride Mobility Europe", "Puur in Harmonie", "BeNoted", "Erica van Dijk", "Danique Kwakman"];
const fallbackProjects = featuredTitles
  .map((t) => projects.find((p) => p.title === t))
  .filter((p): p is typeof projects[number] => Boolean(p));

const IndustryLanding = ({ slug }: { slug: string }) => {
  // Dark CTA band: invert the fixed header while it's under it.
  const darkNavRef = useDarkNavSection<HTMLElement>();
  const industry = getIndustryBySlug(slug);
  if (!industry) return <Navigate to="/404" replace />;

  const url = `${companyInfo.url}/website-laten-maken-${industry.slug}`;
  const seoTitle = buildLandingTitle(industry.name);
  const seoDescription = buildIndustryDescription(industry.slug, industry.name);
  const extra = getIndustryExtra(industry.slug);
  const relevantProjects = (extra?.relevantCaseSlugs ?? [])
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is typeof projects[number] => Boolean(p));
  const branchProjects = relevantProjects.length > 0 ? relevantProjects : fallbackProjects;
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
          price: "1500",
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "1500",
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
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <p className="text-muted-foreground text-lg leading-relaxed text-center">
            {industry.intro}
          </p>
        </div>
      </section>


      {/* Sectie 1: Wat heeft deze branche nodig */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
            {industry.section1.h2}
          </h2>
          {/* section1.body is dropped here — it's word-for-word identical to
              industry.intro (rendered once, above, right after the hero) in
              the auto-generated data. Repeating it verbatim under this
              heading was the duplicated-paragraph bug; the heading + need
              cards stand fine without it. */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industry.section1.needs.map((n, idx) => (
              <div key={idx} className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-2 text-foreground">{n.h3}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectie 1b: Uitdagingen & functies specifiek voor deze branche */}
      {extra && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Uitdagingen voor een {industry.name.toLowerCase()} online
              </h2>
              <ul className="space-y-4">
                {extra.painpoints.map((p, idx) => (
                  <li key={idx} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="text-accent font-bold">–</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Functies die voor een {industry.name.toLowerCase()} website het verschil maken
              </h2>
              <ul className="space-y-4">
                {extra.features.map((f, idx) => (
                  <li key={idx} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="text-accent font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Sectie 2: Vergelijking */}
      <ProblemSolutionSection />

      {/* Sectie 3: Reviews */}
      <section ref={darkNavRef} className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'hsl(160 84% 12%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30 blur-[120px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(160 84% 45%) 0%, transparent 70%)' }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center text-white">
            {industry.section3H2}
          </h2>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Sectie 4: Portfolio */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{industry.section4.h2}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{industry.section4.intro}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            {branchProjects.map((p) => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>
          <div className="text-center mt-12">
            <AnimatedButton to="/portfolio" size="lg" variant="outline">
              Alle projecten bekijken
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Sectie 5: FAQ */}
      <LandingFaq h2={industry.faq.h2} items={industry.faq.items} />

      {/* Sectie 6: Contactblok */}
      <ContactBlock h2={industry.contactBlock.h2} body={industry.contactBlock.body} />

      {/* Interne linksectie */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
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
              <div className="flex flex-wrap justify-center gap-3">
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
