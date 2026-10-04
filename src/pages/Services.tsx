import type { ElementType } from "react";
import { SITE_URL } from "@/config/site";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import Reveal from "@/components/Reveal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Globe, Palette, ShoppingBag, Pen, Check } from "lucide-react";
import SocialContentSection from "@/components/SocialContentSection";

/*
 * Dienstenpagina in de stijl van de homepage: grote, strakke koppen in
 * --sw-ink met een groen accent, lichte lopende tekst, een donkergroen paneel
 * zoals de vindbaarheidssectie voor de hoofddienst en rustige witte kaarten op
 * --sw-paper voor de rest. Animatie alleen via Reveal (CSS, één keer).
 */

interface Dienst {
  icon: ElementType;
  title: string;
  description: string;
  features: string[];
  link?: string;
  linkText?: string;
}

const GROEN_LICHT = "hsl(160 70% 58%)";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";

const services: Dienst[] = [
  {
    icon: Globe,
    title: "Website design & development",
    description: "Op maat gemaakte, responsive websites die prachtig design combineren met krachtige functionaliteit. Van corporate sites tot complexe webapplicaties - wij creëren digitale ervaringen die bezoekers omzetten in klanten.",
    features: ["Responsive & mobile-first design", "SEO optimalisatie", "Prestatie & snelheidsoptimalisatie", "CMS integratie (op aanvraag)", "E-commerce oplossingen"],
    link: "/diensten/website-op-maat",
    linkText: "Bekijk website dienst"
  },
  {
    icon: Palette,
    title: "Merkidentiteit & brand kits",
    description: "Complete merkidentiteitssystemen die jouw unieke visuele taal vastleggen. Wij creëren samenhangende brand kits die consistentie garanderen op alle contactpunten met je klanten.",
    features: ["Logo design & variaties", "Kleurenpalet ontwikkeling", "Typografie systeem", "Brand richtlijnen", "Marketing materialen"]
  },
  {
    icon: ShoppingBag,
    title: "E-commerce oplossingen",
    description: "Full-service e-commerce design inclusief productlijsten, banners en complete shop designs die verkoop stimuleren en gebruikerservaring verbeteren.",
    features: ["Productlijst design", "Custom banners & graphics", "Shop pagina layouts", "Conversie optimalisatie", "Mobiele shopping ervaring"],
    link: "/diensten/e-commerce",
    linkText: "Bekijk e-commerce dienst"
  },
  {
    icon: Pen,
    title: "Custom design services",
    description: "Van e-books tot autobelettering - wij leveren hoogwaardige custom designs op maat, perfect afgestemd op jouw specifieke wensen en merkidentiteit.",
    features: ["E-book design & layout", "Voertuigbelettering graphics", "Drukwerk materialen", "Social media graphics", "Custom illustraties"]
  }
];

/** Lijst met groene vinkjes, licht of donker. */
const Kenmerken = ({ items, donker = false }: { items: string[]; donker?: boolean }) => (
  <ul className="space-y-2.5">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3">
        <Check
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: donker ? GROEN_LICHT : "hsl(var(--sw-green))" }}
          strokeWidth={2.6}
          aria-hidden="true"
        />
        <span className={`text-[0.9375rem] ${donker ? "text-white/80" : ""}`} style={donker ? undefined : { color: INKT_65 }}>
          {item}
        </span>
      </li>
    ))}
  </ul>
);

/** De hoofddienst: donkergroen paneel, net als de vindbaarheidssectie op de homepage. */
const HoofdDienst = ({ dienst }: { dienst: Dienst }) => {
  const Icon = dienst.icon;
  return (
    <Reveal afstand={30}>
      <article
        className="relative overflow-hidden rounded-2xl border p-8 text-white md:p-12"
        style={{
          borderColor: "hsl(160 70% 58% / 0.14)",
          background: "linear-gradient(165deg, hsl(160 84% 11%) 0%, hsl(160 84% 8%) 100%)",
          boxShadow: "0 30px 70px -30px rgba(0,0,0,0.55)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 70% at 15% 0%, hsl(160 70% 45% / 0.22) 0%, transparent 60%)" }}
        />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span
              className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: "hsl(160 70% 58% / 0.12)" }}
            >
              <Icon className="h-6 w-6" style={{ color: GROEN_LICHT }} aria-hidden="true" />
            </span>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl" style={{ lineHeight: 1.04 }}>
              {dienst.title}
            </h2>
            <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-white/70 md:text-lg">
              {dienst.description}
            </p>
            {dienst.link && (
              <div className="mt-8">
                <AnimatedButton to={dienst.link} size="lg" variant="white">
                  {dienst.linkText}
                </AnimatedButton>
              </div>
            )}
          </div>
          <div className="lg:col-span-5 lg:self-end">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
              <h3 className="mb-5 text-sm font-semibold" style={{ color: GROEN_LICHT }}>
                Wat je krijgt
              </h3>
              <Kenmerken items={dienst.features} donker />
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
};

/** De overige diensten: rustige witte kaarten op het papier van de homepage. */
const DienstKaart = ({ dienst, index }: { dienst: Dienst; index: number }) => {
  const Icon = dienst.icon;
  return (
    <Reveal afstand={24} delay={index * 0.08} className="h-full">
      <article
        className="flex h-full flex-col rounded-2xl border bg-white p-7 transition-shadow duration-300 hover:shadow-lg md:p-8"
        style={{ borderColor: "hsl(var(--sw-rule) / 0.1)" }}
      >
        <span
          className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: "hsl(var(--sw-green) / 0.08)" }}
        >
          <Icon className="h-5 w-5" style={{ color: "hsl(var(--sw-green))" }} aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-bold tracking-tight sw-ink" style={{ lineHeight: 1.1 }}>
          {dienst.title}
        </h2>
        <p className="mt-3 text-[0.9375rem] font-light leading-relaxed" style={{ color: INKT_65 }}>
          {dienst.description}
        </p>
        <h3 className="mb-4 mt-7 text-sm font-semibold" style={{ color: "hsl(var(--sw-green))" }}>
          Wat je krijgt
        </h3>
        <Kenmerken items={dienst.features} />
        <div className="mt-auto pt-8">
          <AnimatedButton to={dienst.link || "/contact"} variant={dienst.link ? "solid" : "outline"}>
            {dienst.linkText || "Start je project"}
          </AnimatedButton>
        </div>
      </article>
    </Reveal>
  );
};

const Services = () => {
  const [hoofd, ...overig] = services;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Digitale Diensten - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": SITE_URL
    },
    "serviceType": "Webdesign & Digitale Marketing",
    "areaServed": "Nederland",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digitale Diensten",
      "itemListElement": services.map((service) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.description
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Diensten | Webdesign, Webshops & SEO Enkhuizen - Nieuwblik"
        description="Ontdek onze diensten: website op maat, webshops, branding en SEO. Webdesign bureau Enkhuizen voor MKB in West-Friesland. Vraag een offerte aan."
        keywords="webdesign Enkhuizen, webshop laten maken, SEO West-Friesland, branding, e-commerce, website ontwikkeling, online zichtbaarheid"
        canonicalUrl={`${SITE_URL}/diensten`}
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Diensten", url: `${SITE_URL}/diensten` }
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: "Diensten", path: "/diensten" }]} />
          {/* Geen Reveal: de kop moet direct zichtbaar zijn (eerste beeld,
              laadsnelheid). Een CSS-animatie bij het laden is genoeg. */}
          <div className="mt-10 md:mt-14 animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
            <h1
              className="max-w-5xl text-4xl font-bold tracking-tight sw-ink md:text-6xl lg:text-7xl"
              style={{ lineHeight: 1.02 }}
            >
              Complete digitale oplossingen{" "}
              <span style={{ color: "hsl(var(--sw-green))" }}>die groeien met jouw ambities</span>
            </h1>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-backwards motion-reduce:animate-none">
            <p
              className="mt-6 max-w-2xl text-lg font-light leading-relaxed md:text-xl"
              style={{ color: INKT_65 }}
            >
              Wij specialiseren ons in het creëren van premium digitale ervaringen die jouw merk naar een hoger niveau tillen en meetbare resultaten opleveren.
            </p>
          </div>
        </div>
      </section>

      {/* Diensten */}
      <section className="sw-paper py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          {hoofd && <HoofdDienst dienst={hoofd} />}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {overig.map((dienst, index) => (
              <DienstKaart key={dienst.title} dienst={dienst} index={index} />
            ))}
          </div>
        </div>
      </section>

      <SocialContentSection />

      <Footer />
    </div>
  );
};

export default Services;
