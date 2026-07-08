import { Link, Navigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingHero from "@/components/LandingHero";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import ProjectCard from "@/components/ProjectCard";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSectionNew";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { getCityBySlug } from "@/data/cities";
import { getCityExtra } from "@/data/cityExtras";
import { companyInfo } from "@/config/company";
import { buildLandingTitle, buildCityDescription } from "@/lib/programmaticSeo";

const featuredTitles = ["Quantum Rehab Europe", "Pride Mobility Europe", "Puur in Harmonie", "BeNoted", "Erica van Dijk", "Danique Kwakman"];
const featuredProjects = featuredTitles
  .map((t) => projects.find((p) => p.title === t))
  .filter((p): p is typeof projects[number] => Boolean(p));

const CityLanding = ({ slug }: { slug: string }) => {
  const city = getCityBySlug(slug);
  if (!city) return <Navigate to="/404" replace />;

  const url = `${companyInfo.url}/website-laten-maken-${city.slug}`;
  const seoTitle = buildLandingTitle(city.name);
  const seoDescription = buildCityDescription(city.slug, city.name);
  const extra = getCityExtra(city.slug);
  const nearbyCities = (extra?.nearby ?? [])
    .map((s) => getCityBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seoTitle,
    description: seoDescription,
    url,
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
      <Navigation />

      <LandingHero h1={city.h1} subtitle={city.heroSubtitle} />

      {/* Intro paragraaf voor extra keyword context — zelfde patroon als IndustryLanding */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          {extra && (
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
              Regio {extra.region}
            </p>
          )}
          <p className="text-muted-foreground text-lg leading-relaxed">
            {city.intro}
          </p>
        </div>
      </section>

      {/* Sectie 1: Waarom een professionele website */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
            {city.section1.h2}
          </h2>
          {/* section1.body is dropped here — it's word-for-word identical to
              city.intro (rendered once, above, right after the hero) in the
              auto-generated data. Repeating it verbatim under this heading
              was the duplicated-paragraph bug; the heading + benefit cards
              stand fine without it. */}
          <div className="grid sm:grid-cols-3 gap-6">
            {city.section1.benefits.map((b, idx) => (
              <div key={idx} className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-2 text-foreground">{b.h3}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectie 2: Vergelijking */}
      <ProblemSolutionSection />

      {/* Sectie 3: Reviews */}
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'hsl(160 84% 12%)' }}>
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
          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/portfolio">
                Alle projecten bekijken
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sectie 5: FAQ */}
      <LandingFaq h2={city.faq.h2} items={city.faq.items} />

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
