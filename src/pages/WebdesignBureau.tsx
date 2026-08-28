import { Link } from "@/lib/router-compat";
import { CheckCircle2, Award, Users, Zap, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";

const url = "https://www.nieuwblik.com/webdesign-bureau";

const faqItems = [
  { q: "Wat is het verschil tussen een webdesign bureau en een freelancer?", a: "Een bureau heeft een team met verschillende disciplines: designer, developer, SEO-specialist en projectleider. Een freelancer doet alles zelf, wat sneller kan zijn voor kleine klussen maar minder diepgang biedt. Nieuwblik werkt als klein bureau met de wendbaarheid van een freelancer en de kwaliteit van een team." },
  { q: "Waar zit Nieuwblik als webdesign bureau?", a: "Wij zitten in Enkhuizen, West-Friesland. We werken voor klanten door heel Nederland, meestal volledig op afstand met korte videocalls. Voor grotere trajecten komen we op locatie." },
  { q: "Voor welke bedrijven werken jullie?", a: "We werken vooral voor MKB en ZZP tussen 1 en 50 medewerkers. Van kappers en restaurants tot advocaten, bouwbedrijven en e-commerce merken. Elke sector waar een sterke online aanwezigheid het verschil maakt." },
  { q: "Wat maakt Nieuwblik anders dan andere webdesign bureaus?", a: "We combineren snelheid met zorgvuldigheid. Waar veel bureaus 8 tot 12 weken doen over een MKB-site, leveren wij die in 2 tot 4 weken op zonder in te leveren op kwaliteit. Dat komt door onze AI-ondersteunde workflow en directe communicatie zonder tussenlagen." },
  { q: "Kunnen jullie ook met een bestaand merk werken?", a: "Absoluut. Als je al een huisstijl, logo en tone-of-voice hebt, verwerken we die 1-op-1. Als je nog niets hebt, ontwikkelen we die samen met jou tijdens het project." },
  { q: "Hoe zit het met eigendom en bronbestanden?", a: "Alles is van jou na oplevering. Code, Figma-bestanden, teksten en afbeeldingen. Geen vendor lock-in, geen verrassingen. Je kunt de site altijd meenemen naar een ander bureau." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "Webdesign bureau in Nederland - Nieuwblik",
      description: "Webdesign bureau uit Enkhuizen. Persoonlijk, snel en sterk in SEO. Wij bouwen websites voor MKB in heel Nederland vanaf 990 euro.",
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
        description="Webdesign bureau uit Enkhuizen. Snel, persoonlijk en sterk in SEO. Wij bouwen websites voor MKB in heel Nederland. Vanaf 990 euro."
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
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <Award className="w-4 h-4" /> Webdesign bureau uit Enkhuizen
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Het webdesign bureau dat werk maakt van jouw groei
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Wij zijn Nieuwblik. Een klein, snel webdesign bureau uit Enkhuizen dat conversiegerichte websites bouwt voor MKB in heel Nederland. Geen dikke laag management, geen vage uurtarieven. Wel korte lijnen en tastbare resultaten.
            </p>
            <AnimatedButton to="/contact">Plan een kennismaking</AnimatedButton>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Waarom Nederlandse ondernemers voor ons kiezen</h2>
            <p className="text-muted-foreground mb-4">
              De keuze voor een webdesign bureau is een keuze voor een langere samenwerking. Een site is niet klaar bij livegang, hij groeit mee met jouw bedrijf. Daarom werken wij vanaf de eerste minuut aan een basis die vier of vijf jaar mee kan.
            </p>
            <p className="text-muted-foreground mb-4">
              We investeren in de dingen die echt tellen: een schone codebase, sterke SEO-fundamenten en een design dat past bij jouw merk. We schrijven de teksten zelf, samen met jou, in de tone-of-voice die klopt bij jouw doelgroep. Geen algemene stockzinnen, geen gekopieerde blokken uit een template.
            </p>
            <p className="text-muted-foreground">
              Onze klanten zijn kappers, restaurants, taxibedrijven, advocaten, bouwbedrijven en creatieve merken. Wat ze delen is de wens om online zichtbaar te zijn zonder een half jaar aan een traject vast te zitten.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Wat je van ons mag verwachten</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Snel", text: "Twee tot vier weken van briefing naar livegang. Geen eindeloze feedbackrondes, wel duidelijke deadlines." },
                { icon: Users, title: "Persoonlijk", text: "Je hebt direct contact met de mensen die aan jouw project werken. Geen account manager tussen jou en het werk." },
                { icon: Award, title: "Vakwerk", text: "Elke site is uniek gebouwd in React. Geen templates, geen page builders, wel schone code die snel laadt." },
              ].map((s) => (
                <div key={s.title} className="bg-background border border-border rounded-2xl p-6">
                  <s.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Onze diensten in het kort</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Website op maat", to: "/diensten/website-op-maat" },
                { label: "Webshops", to: "/diensten/webshops" },
                { label: "E-commerce", to: "/diensten/e-commerce" },
                { label: "SEO Enkhuizen", to: "/seo-enkhuizen" },
                { label: "Website laten maken", to: "/website-laten-maken" },
                { label: "Taxi website", to: "/taxi-website-laten-maken" },
              ].map((s) => (
                <Link key={s.to} to={s.to} className="bg-background border border-border rounded-xl p-4 hover:border-accent transition-colors flex items-center justify-between">
                  <span className="font-medium">{s.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <LandingFaq h2="Veelgestelde vragen over ons webdesign bureau" items={faqItems} />
        <ContactBlock h2="Laten we samenwerken" body="Vertel over jouw project. Binnen 24 uur een persoonlijk antwoord." />
      </main>
      <Footer />
    </div>
  );
};

export default WebdesignBureau;
