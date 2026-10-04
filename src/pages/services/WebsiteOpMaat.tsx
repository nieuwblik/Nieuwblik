import { PRIJZEN, LEVERTIJD, euroTeken } from "@/config/business";
import { SITE_URL } from "@/config/site";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import CaseGrid from "@/components/CaseGrid";
import { kiesCases } from "@/lib/cases";
import Reveal from "@/components/Reveal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Palette, Zap, Bot } from "lucide-react";
import {
  DienstHero,
  GroenPaneel,
  INKT_65,
  Inbegrepen,
  Pijlers,
  Quote,
  RAND,
  Sectie,
  SectieKop,
  Stappen,
} from "@/components/dienst/DienstBlokken";

// Zelfde cases als voorheen, nu met het caseraster van de homepage.
const cases = kiesCases(["puur-in-harmonie", "benoted", "danique-kwakman", "erica-van-dijk"], 4);

// Tool logos
import lovableLogo from "@/assets/tools/lovable-logo.webp";
import figmaLogo from "@/assets/tools/figma-logo.webp";
import geminiLogo from "@/assets/tools/gemini-logo.webp";
import hadoseoLogo from "@/assets/tools/hadoseo-logo.webp";
import wordpressLogo from "@/assets/tools/wordpress.svg";
import elementorLogo from "@/assets/tools/elementor.svg";
import woocommerceLogo from "@/assets/tools/woocommerce.svg";

const WebsiteOpMaat = () => {
  const usps = [{
    icon: Palette,
    title: "Design excellence",
    subtitle: "Luxe en branding",
    description: "Elk ontwerp begint in Figma waar we jouw unieke merkidentiteit tot leven brengen met oog voor detail en luxe uitstraling."
  }, {
    icon: Zap,
    title: "Technische fundering",
    subtitle: "Snelheid en schone code",
    description: "Gebouwd met Lovable en moderne technologie voor bliksemsnelle laadtijden en perfecte Google scores."
  }, {
    icon: Bot,
    title: "AI & automatisering",
    subtitle: "Efficiëntie en funneling",
    description: "Slimme integraties via HadoSEO zorgen voor optimale vindbaarheid en automatische lead-generatie."
  }];

  const steps = [{
    title: "Concept & strategie",
    description: "We starten met jouw project briefing om doelen, doelgroep en merkidentiteit in kaart te brengen."
  }, {
    title: "Luxe design & UX",
    description: "In Figma creëren we wireframes en het visuele ontwerp dat jouw merk perfect representeert."
  }, {
    title: "Technische development",
    description: "Met Lovable en Gemini AI bouwen we een ultra-snelle, SEO-geoptimaliseerde website."
  }, {
    title: "Livegang & optimalisatie",
    description: "Na de lancering optimaliseren we continu voor prestaties en koppelen we Google Business voor reviews."
  }];

  const includedStandard = ["Responsive & mobile-first design", "SEO-fundament met HadoSEO koppeling", "Google Analytics 4 integratie", "Google Business koppeling voor reviews", "SSL-certificaat & beveiliging", "Laadtijd onder 2 seconden", "Contactformulieren met automatisering", "3 revisierondes inbegrepen"];
  const optionalModules = ["Custom AI chatbot integratie", "E-commerce functionaliteit", "Meertalige website opties", "Premium CMS licenties", "Geavanceerde animaties", "Lead generation funnels"];

  const tools = [
  { name: "Lovable", logo: lovableLogo },
  { name: "Figma", logo: figmaLogo },
  { name: "Gemini AI", logo: geminiLogo },
  { name: "HadoSEO", logo: hadoseoLogo, link: "https://www.hadoseo.com" },
  { name: "WordPress", logo: wordpressLogo },
  { name: "Elementor Pro", logo: elementorLogo },
  { name: "WooCommerce", logo: woocommerceLogo }];


  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Website op Maat - Nieuwblik",
    "provider": {
      "@type": "Organization",
      "name": "Nieuwblik",
      "url": SITE_URL
    },
    "serviceType": "Custom Website Development",
    "description": "Luxe websites en digitale architectuur op maat. Ultra-snelle, SEO-geoptimaliseerde websites met HadoSEO koppeling.",
    "areaServed": "Nederland",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Website op Maat Enkhuizen | Webdesign West-Friesland - Nieuwblik"
        description={`Website laten maken in Enkhuizen? Wij bouwen snelle, SEO-geoptimaliseerde websites op maat. Webdesign bureau West-Friesland. Live in ${LEVERTIJD.standaard}!`}
        keywords="website op maat Enkhuizen, webdesign West-Friesland, website laten maken, SEO website, snelle website, webdesign bureau Enkhuizen"
        canonicalUrl={`${SITE_URL}/diensten/website-op-maat`}
        structuredData={structuredData}
        breadcrumbs={[
        { name: "Home", url: SITE_URL },
        { name: "Diensten", url: `${SITE_URL}/diensten` },
        { name: "Website op maat", url: `${SITE_URL}/diensten/website-op-maat` }]
        } />
      


      <DienstHero
        kruimels={[
          { label: "Diensten", path: "/diensten" },
          { label: "Website op Maat", path: "/diensten/website-op-maat" },
        ]}
        titel="Luxe websites & digitale architectuur"
        accent="op maat"
        intro={<>
          Wij bouwen ultra-snelle websites met AI-automatisering en meetbare groei.
          Jouw website binnen {LEVERTIJD.standaard} live, perfect vindbaar in alle zoekmachines.
        </>}
        knop={{ label: "Start je website project", to: "/contact" }}
      />

      <Sectie papier>
        <SectieKop titel="Waarom Nieuwblik?" intro="Drie pilaren die jouw website onderscheiden van de rest" />
        <Pijlers items={usps} />
      </Sectie>

      <Sectie>
        <SectieKop titel="Het website project stappenplan" intro="Transparant en efficiënt: zo bouwen wij jouw website" />
        <Stappen items={steps} />
      </Sectie>

      <Sectie papier>
        <SectieKop titel="Wat is inbegrepen?" intro="Heldere scope en verwachtingen voor jouw project" />
        <Inbegrepen
          standaardTitel="Inbegrepen standaard"
          standaard={includedStandard}
          extraTitel="Optionele modules"
          extra={optionalModules}
        />
      </Sectie>

      <GroenPaneel
        titel="Elk project is uniek"
        tekst={<>Laten we samen de scope bepalen en een offerte op maat maken. Websites vanaf {euroTeken(PRIJZEN.starter)}, binnen {LEVERTIJD.standaard} live.</>}
        knop={{ label: "Ontvang een offerte", to: "/contact" }}
      />

      <Sectie>
        <SectieKop titel="Recente website projecten" intro="Bekijk enkele van onze meest recente succesvolle website projecten" />
        <Reveal afstand={24}>
          <CaseGrid projects={cases} />
        </Reveal>
        <div className="mt-16 md:mt-20">
          <AnimatedButton to="/portfolio" size="lg">
            Bekijk alle projecten
          </AnimatedButton>
        </div>
      </Sectie>

      <Sectie papier>
        <Quote
          tekst="Nieuwblik heeft onze website binnen een week live gezet. De snelheid en professionaliteit zijn ongekend. We krijgen nu dagelijks nieuwe aanvragen via de site!"
          naam="Niels van Esveld, Esveld Installatie"
        />
      </Sectie>

      <Sectie>
        <SectieKop titel="Gebouwd met de beste tools" intro="We gebruiken moderne technologie voor maximale snelheid en vindbaarheid" />
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {tools.map((tool, index) => {
            const tegel = (
              <>
                <span className="flex h-20 w-full items-center justify-center rounded-2xl border bg-white p-4 transition-colors group-hover:border-[hsl(var(--sw-green)/0.4)]" style={{ borderColor: RAND }}>
                  <img src={tool.logo} alt={tool.name} className="h-10 w-10 object-contain" loading="lazy" width="40" height="40" />
                </span>
                <span className="mt-3 block text-sm font-medium sw-ink">{tool.name}</span>
              </>
            );
            return (
              <Reveal key={tool.name} afstand={16} delay={index * 0.04} className="group text-center">
                {tool.link ? (
                  <a href={tool.link} target="_blank" rel="noopener noreferrer">{tegel}</a>
                ) : tegel}
              </Reveal>
            );
          })}
        </div>
        <Reveal afstand={16}>
          <p className="mt-12 max-w-3xl rounded-2xl border px-6 py-5 text-[0.9375rem] leading-relaxed" style={{ borderColor: RAND, color: INKT_65, background: "hsl(var(--sw-paper))" }}>
            <span className="font-semibold sw-ink">Ook mogelijk:</span> Websites bouwen met WordPress en Elementor Pro,
            of complete webshops met WordPress, Elementor Pro en WooCommerce.
            Wij kiezen de beste oplossing voor jouw specifieke situatie.
          </p>
        </Reveal>
      </Sectie>

      <Footer />
    </div>
  );
};

export default WebsiteOpMaat;
