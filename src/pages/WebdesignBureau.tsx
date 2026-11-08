import { PRIJZEN, LEVERTIJD } from "@/config/business";
import { SITE_URL } from "@/config/site";
import { Award, Users, Zap } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";
import LandingHero from "@/components/LandingHero";
import { BeeldSectie, BlokTekst } from "@/components/dienst/BeeldBlok";
import { Linkjes, Pijlers, Sectie, SectieKop } from "@/components/dienst/DienstBlokken";

const url = `${SITE_URL}/webdesign-bureau`;

const faqItems = [
  { q: "Wat is het verschil tussen een webdesign bureau en een freelancer?", a: "Een bureau heeft een team met verschillende disciplines: designer, developer, SEO-specialist en projectleider. Een freelancer doet alles zelf, wat sneller kan zijn voor kleine klussen maar minder diepgang biedt. Nieuwblik werkt als klein bureau met de wendbaarheid van een freelancer en de kwaliteit van een team." },
  { q: "Waar zit Nieuwblik als webdesign bureau?", a: "Wij zitten in Enkhuizen, West-Friesland. We werken voor klanten door heel Nederland, meestal volledig op afstand met korte videocalls. Voor grotere trajecten komen we op locatie." },
  { q: "Voor welke bedrijven werken jullie?", a: "We werken vooral voor MKB en ZZP tussen 1 en 50 medewerkers. Van kappers en restaurants tot advocaten, bouwbedrijven en e-commerce merken. Elke sector waar een sterke online aanwezigheid het verschil maakt." },
  { q: "Wat maakt Nieuwblik anders dan andere webdesign bureaus?", a: `We combineren snelheid met zorgvuldigheid. Waar veel bureaus 8 tot 12 weken doen over een MKB-site, leveren wij die in ${LEVERTIJD.standaard} op zonder in te leveren op kwaliteit. Dat komt door onze AI-ondersteunde workflow en directe communicatie zonder tussenlagen.` },
  { q: "Kunnen jullie ook met een bestaand merk werken?", a: "Absoluut. Als je al een huisstijl, logo en tone-of-voice hebt, verwerken we die 1-op-1. Als je nog niets hebt, ontwikkelen we die samen met jou tijdens het project." },
  { q: "Hoe zit het met eigendom en bronbestanden?", a: "Je krijgt het gebruiksrecht op je website: ontwerp, teksten en afbeeldingen. De intellectuele eigendom blijft volgens onze algemene voorwaarden bij Nieuwblik. Wil je naar een andere partij, dan werken we mee aan de overdracht." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "Webdesign bureau in Nederland - Nieuwblik",
      description: `Webdesign bureau uit Enkhuizen. Persoonlijk, snel en sterk in SEO. Wij bouwen websites voor MKB in heel Nederland vanaf ${PRIJZEN.starter} euro.`,
      url,
      inLanguage: "nl-NL",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${url}#service`,
      name: companyInfo.name,
      url: companyInfo.url,
      description: "Webdesign bureau gespecialiseerd in conversiegerichte websites voor MKB.",
      areaServed: { "@type": "Country", name: "Nederland" },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqItems.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    },
  ],
};

const WebdesignBureau = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Webdesign bureau in Nederland | Nieuwblik"
        description={`Webdesign bureau uit Enkhuizen. Snel, persoonlijk en sterk in SEO. Wij bouwen websites voor MKB in heel Nederland. Vanaf ${PRIJZEN.starter} euro.`}
        keywords="webdesign bureau, webdesign, website bureau, webdesign nederland, mkb website"
        canonicalUrl={url}
        structuredData={jsonLd}
        includeLocalBusinessSchema={true}
        breadcrumbs={[
          { name: "Home", url: companyInfo.url },
          { name: "Webdesign bureau", url },
        ]}
      />

      <main>
        <LandingHero
          h1="Het webdesign bureau dat werk maakt van jouw groei"
          subtitle="Wij zijn Nieuwblik. Een klein, snel webdesign bureau uit Enkhuizen dat conversiegerichte websites bouwt voor MKB in heel Nederland. Geen dikke laag management, geen vage uurtarieven. Wel korte lijnen en tastbare resultaten."
          knoppen={
            <AnimatedButton to="/contact" className="h-12 w-full sm:w-auto">
              Plan een kennismaking
            </AnimatedButton>
          }
        />

        <BeeldSectie keuze="laptop:esveld-installatie" kop="Waarom Nederlandse ondernemers voor ons kiezen">
          <BlokTekst>
            <p>
              De keuze voor een webdesign bureau is een keuze voor een langere samenwerking. Een site is niet klaar bij livegang, hij groeit mee met jouw bedrijf. Daarom werken wij vanaf de eerste minuut aan een basis die vier of vijf jaar mee kan.
            </p>
            <p>
              We investeren in de dingen die echt tellen: een schone codebase, sterke SEO-fundamenten en een design dat past bij jouw merk. We schrijven de teksten zelf, samen met jou, in de tone-of-voice die klopt bij jouw doelgroep. Geen algemene stockzinnen, geen gekopieerde blokken uit een template.
            </p>
            <p>
              Onze klanten zijn kappers, restaurants, taxibedrijven, advocaten, bouwbedrijven en creatieve merken. Wat ze delen is de wens om online zichtbaar te zijn zonder een half jaar aan een traject vast te zitten.
            </p>
          </BlokTekst>
        </BeeldSectie>

        <Sectie>
          <SectieKop titel="Wat je van ons mag verwachten" />
          <Pijlers
            items={[
              { icon: Zap, title: "Snel", description: `${LEVERTIJD.standaard} van briefing naar livegang. Geen eindeloze feedbackrondes, wel duidelijke deadlines.` },
              { icon: Users, title: "Persoonlijk", description: "Je hebt direct contact met de mensen die aan jouw project werken. Geen account manager tussen jou en het werk." },
              { icon: Award, title: "Vakwerk", description: "Elke site is uniek gebouwd in React. Geen templates, geen page builders, wel schone code die snel laadt." },
            ]}
          />
        </Sectie>

        <Sectie>
          <SectieKop titel="Onze diensten in het kort" />
          <Linkjes
            items={[
              { label: "Website op maat", to: "/diensten/website-op-maat" },
              { label: "Webshops", to: "/diensten/webshops" },
              { label: "E-commerce", to: "/diensten/e-commerce" },
              { label: "SEO Enkhuizen", to: "/seo-enkhuizen" },
              { label: "Website laten maken", to: "/website-laten-maken" },
              { label: "Taxi website", to: "/taxi-website-laten-maken" },
            ]}
          />
        </Sectie>

        <LandingFaq h2="Veelgestelde vragen over ons webdesign bureau" items={faqItems} />
      </main>
      <Footer />
    </div>
  );
};

export default WebdesignBureau;
