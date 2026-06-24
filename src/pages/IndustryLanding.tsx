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
import { getIndustryBySlug } from "@/data/industries";

const featuredTitles = ["Quantum Rehab Europe", "Pride Mobility Europe", "Puur in Harmonie", "BeNoted", "Erica van Dijk", "Danique Kwakman"];
const featuredProjects = featuredTitles
  .map((t) => projects.find((p) => p.title === t))
  .filter((p): p is typeof projects[number] => Boolean(p));

const IndustryLanding = ({ slug }: { slug: string }) => {
  const industry = getIndustryBySlug(slug);
  if (!industry) return <Navigate to="/404" replace />;

  const url = `https://www.nieuwblik.com/website-laten-maken-${industry.slug}`;
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: industry.title,
        description: industry.metaDescription,
        url,
        inLanguage: "nl-NL",
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Website laten maken voor ${industry.name.toLowerCase()}`,
        serviceType: "Webdesign",
        areaServed: { "@type": "Country", name: "Nederland" },
        provider: { "@type": "Organization", name: "Nieuwblik", url: "https://www.nieuwblik.com" },
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
        title={industry.title}
        description={industry.metaDescription}
        canonicalUrl={url}
        structuredData={graphJsonLd}
        includeLocalBusinessSchema={true}
      />
      <Navigation />

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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">
            {industry.section1.h2}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-3xl mx-auto text-center">
            {industry.section1.body}
          </p>
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

      {/* Sectie 2: Vergelijking */}
      <ProblemSolutionSection />

      {/* Sectie 3: Reviews */}
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'hsl(160 84% 12%)' }}>
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
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default IndustryLanding;
