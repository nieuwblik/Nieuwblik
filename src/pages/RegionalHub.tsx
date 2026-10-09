import { kiesCases } from "@/lib/cases";
import BenefitList from "@/components/BenefitList";
import { PRIJZEN, LEVERTIJD } from "@/config/business";
import { SITE_URL } from "@/config/site";
import { useParams, Link } from "@/lib/router-compat";
import { MapPin, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import CaseGrid from "@/components/CaseGrid";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";
import justinJobImg from "@/assets/justin-job-compressed.webp";
import NotFound from "./NotFound";

// Deze drie eerst, aangevuld tot zes met de nieuwste cases.
const hubCases = kiesCases(["taxi-drechterland", "een-bundel-geluk", "aardingsbedrijf-west-friesland"]);

interface RegionHubData {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  cities: { name: string; slug: string; note: string }[];
  strengths: { title: string; text: string }[];
  faq: { q: string; a: string }[];
}

export const HUBS: RegionHubData[] = [
  {
    slug: "noord-holland",
    name: "Noord-Holland",
    title: `Website laten maken Noord-Holland vanaf €${PRIJZEN.starter}`,
    description:
      `Website laten maken in Noord-Holland vanaf €${PRIJZEN.starter}. Snel, vindbaar en binnen ${LEVERTIJD.standaard} live. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in Noord-Holland vanaf €${PRIJZEN.starter}`,
    intro:
      "Van de Amsterdamse grachten tot de haven van Enkhuizen bouwen we websites voor ondernemers die willen groeien. Wij zitten zelf in West-Friesland en kennen zowel de kleine dorpskern als de grote stad. Dat merk je in elke keuze die we maken voor jouw site.",
    cities: [
      { name: "Amsterdam", slug: "amsterdam", note: "Websites voor de internationale markt" },
      { name: "Haarlem", slug: "haarlem", note: "Sterke visuele merken en boetieks" },
      { name: "Alkmaar", slug: "alkmaar", note: "MKB en retail in het centrum" },
      { name: "Zaanstad", slug: "zaanstad", note: "Industriële en zakelijke sites" },
      { name: "Amersfoort", slug: "amersfoort", note: "Zakelijke dienstverlening" },
    ],
    strengths: [
      { title: "Lokale kennis", text: "We wonen en werken in Noord-Holland zelf. Van Enkhuizen tot Amsterdam kennen we de lokale markt." },
      { title: "Persoonlijk contact", text: "Eén vast aanspreekpunt, via videocall, telefoon, mail en WhatsApp. Liever in het echt? Dan komen we in overleg bij je langs." },
      { title: "Regio-SEO", text: "We optimaliseren op de zoektermen die in jouw plaats werken, niet op algemene termen." },
    ],
    faq: [
      { q: "Werken jullie voor bedrijven in heel Noord-Holland?", a: "Ja. In de provincie bouwden we onder meer sites voor ondernemers in West-Friesland, zoals in Enkhuizen en Hoogkarspel. Verder werken we grotendeels op afstand, voor ondernemers door heel Nederland." },
      { q: "Hoe verloopt de kennismaking?", a: "Meestal via een videocall. Spreek je elkaar liever in het echt, dan komen we in overleg bij je langs. Daarna houd je hetzelfde vaste aanspreekpunt via telefoon, mail en WhatsApp." },
      { q: "Wat kost een website in Noord-Holland?", a: `Onze projecten starten vanaf ${PRIJZEN.starter} euro. Voor uitgebreide sites en webshops rekenen we tussen de ${PRIJZEN.uitgebreidVan} en ${PRIJZEN.uitgebreidTot} euro.` },
    ],
  },
  {
    slug: "randstad",
    name: "Randstad",
    title: `Website laten maken Randstad vanaf €${PRIJZEN.starter} | Nieuwblik`,
    description:
      `Website laten maken in de Randstad vanaf €${PRIJZEN.starter}. Conversiegericht, persoonlijk en binnen ${LEVERTIJD.standaard} live. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in de Randstad vanaf €${PRIJZEN.starter}`,
    intro:
      "De Randstad is dichtbevolkt, concurrerend en snel. Ondernemers hier hebben geen tijd voor trage bureaus of eindeloze revisies. Wij leveren sites die binnen weken live staan en direct meetellen op Google.",
    cities: [
      { name: "Amsterdam", slug: "amsterdam", note: "Internationaal en snel" },
      { name: "Rotterdam", slug: "rotterdam", note: "Zakelijk en no-nonsense" },
      { name: "Den Haag", slug: "den-haag", note: "Overheid en dienstverlening" },
      { name: "Utrecht", slug: "utrecht", note: "Startups en creatieve bureaus" },
      { name: "Leiden", slug: "leiden", note: "Kennisinstellingen en zorg" },
      { name: "Delft", slug: "delft", note: "Tech en innovatie" },
      { name: "Dordrecht", slug: "dordrecht", note: "MKB en industrie" },
      { name: "Zoetermeer", slug: "zoetermeer", note: "Zakelijke dienstverlening" },
      { name: "Almere", slug: "almere", note: "Jonge stad met groeiend MKB" },
      { name: "Westland", slug: "westland", note: "Glastuinbouw en handel" },
    ],
    strengths: [
      { title: "Snelheid", text: `${LEVERTIJD.standaard} van briefing naar live. Dat is het tempo van de Randstad, en dat halen wij.` },
      { title: "Sterk in conversie", text: "Meer bezoekers is niet genoeg. We bouwen sites die die bezoekers omzetten in klanten." },
      { title: "Landelijke uitstraling", text: "Voor bedrijven die vanuit de Randstad heel Nederland bedienen." },
    ],
    faq: [
      { q: "Zitten jullie zelf in de Randstad?", a: "Nee, wij zitten in Enkhuizen. In de Randstad bouwden we onder meer een site voor een praktijk in Almere. We werken grotendeels op afstand, voor ondernemers door heel Nederland." },
      { q: "Kunnen jullie meerdere talen aan op één site?", a: "Ja. NL, EN en andere talen zetten we netjes op met correcte hreflang tags voor Google." },
      { q: "Hoe snel kunnen jullie starten?", a: "Meestal binnen twee weken na akkoord. Snelheid is een van de redenen dat ondernemers voor ons kiezen." },
    ],
  },
  {
    slug: "oost-nederland",
    name: "Oost-Nederland",
    title: `Website laten maken Oost-Nederland vanaf €${PRIJZEN.starter}`,
    description:
      `Website laten maken in Oost-Nederland vanaf €${PRIJZEN.starter}. Lokale SEO, persoonlijk contact en binnen ${LEVERTIJD.standaard} live. Vraag een offerte aan.`,
    h1: `Website laten maken in Oost-Nederland vanaf €${PRIJZEN.starter}`,
    intro:
      "Ondernemers in Oost-Nederland waarderen duidelijke afspraken en no-nonsense samenwerking. Precies onze manier van werken. We bouwen sites voor MKB van Zwolle tot Nijmegen, met aandacht voor de lokale markt.",
    cities: [
      { name: "Arnhem", slug: "arnhem", note: "Creatieve sector en MKB" },
      { name: "Nijmegen", slug: "nijmegen", note: "Kennis en zorg" },
      { name: "Apeldoorn", slug: "apeldoorn", note: "Zakelijke dienstverlening" },
      { name: "Enschede", slug: "enschede", note: "Tech en industrie" },
      { name: "Zwolle", slug: "zwolle", note: "Handel en logistiek" },
      { name: "Deventer", slug: "deventer", note: "MKB en creatief" },
      { name: "Ede", slug: "ede", note: "Regionale ondernemers" },
    ],
    strengths: [
      { title: "Duidelijk in prijs", text: `Vaste bedragen, geen verrassingen. Vanaf ${PRIJZEN.starter} euro voor een complete site.` },
      { title: "Regionale SEO", text: "We optimaliseren voor de zoektermen die klanten in jouw plaats echt gebruiken." },
      { title: "Blijvend contact", text: "Na oplevering blijven we bereikbaar. Geen ticket-systeem, gewoon direct contact." },
    ],
    faq: [
      { q: "Werken jullie ook voor bedrijven in Twente?", a: "Ja. Voor Carbon6 bouwden we een vastgoedplatform voor de markt in Enschede. Verder werken we grotendeels op afstand, voor ondernemers door heel Nederland." },
      { q: "Hoe werken jullie samen met klanten in de regio?", a: "Voornamelijk online, via videocall, telefoon, mail en WhatsApp, met één vast aanspreekpunt. Spreek je elkaar liever in het echt, dan komen we in overleg bij je langs." },
      { q: "Wat kost een website voor Oost-Nederland?", a: `Onze projecten starten bij ${PRIJZEN.starter} euro. Voor webshops en uitgebreide sites tussen de ${PRIJZEN.uitgebreidVan} en ${PRIJZEN.uitgebreidTot} euro.` },
    ],
  },
  {
    slug: "zuid-nederland",
    name: "Zuid-Nederland",
    title: `Website laten maken Zuid-Nederland vanaf €${PRIJZEN.starter}`,
    description:
      `Website laten maken in Zuid-Nederland vanaf €${PRIJZEN.starter}. Sterke SEO, vaste prijzen en binnen ${LEVERTIJD.standaard} live. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in Zuid-Nederland vanaf €${PRIJZEN.starter}`,
    intro:
      "Van Eindhoven en Den Bosch tot Maastricht en Venlo, Zuid-Nederland kent een sterke MKB-cultuur en een eigen manier van zakendoen. Wij bouwen sites die daarbij passen, met de rust en zorgvuldigheid die klanten hier verwachten.",
    cities: [
      { name: "Eindhoven", slug: "eindhoven", note: "Tech en design" },
      { name: "Tilburg", slug: "tilburg", note: "Industrie en MKB" },
      { name: "Breda", slug: "breda", note: "Retail en horeca" },
      { name: "Den Bosch", slug: "den-bosch", note: "Zakelijke dienstverlening" },
      { name: "Maastricht", slug: "maastricht", note: "Toerisme en horeca" },
      { name: "Venlo", slug: "venlo", note: "Logistiek en handel" },
    ],
    strengths: [
      { title: "Persoonlijke aanpak", text: "Zuid-Nederland waardeert een goede band met leveranciers. Wij ook. Vandaar de persoonlijke aanpak." },
      { title: "Snelle levering", text: `${LEVERTIJD.standaard} van start tot live, ook voor Zuid-Nederlandse klanten.` },
      { title: "Sterke content", text: "We schrijven de teksten zelf, in de tone-of-voice die past bij jouw regio en klant." },
    ],
    faq: [
      { q: "Zijn jullie bekend met de Zuid-Nederlandse markt?", a: "We werken grotendeels op afstand, voor ondernemers door heel Nederland." },
      { q: "Werken jullie ook in het Duits voor grens-regio's?", a: "Ja. Voor bedrijven in Venlo of Maastricht met Duitse klanten zetten we meertalige sites op met correcte SEO per taal." },
      { q: "Wat kost een website in Zuid-Nederland?", a: `Vanaf ${PRIJZEN.starter} euro voor een complete site. Webshops en uitgebreide projecten liggen tussen ${PRIJZEN.uitgebreidVan} en ${PRIJZEN.uitgebreidTot} euro.` },
    ],
  },
  {
    slug: "noord-nederland",
    name: "Noord-Nederland",
    title: `Website laten maken Noord-Nederland vanaf €${PRIJZEN.starter} | Nieuwblik`,
    description:
      `Website laten maken in Noord-Nederland vanaf €${PRIJZEN.starter}. Persoonlijk contact, vindbaar in Google en binnen ${LEVERTIJD.standaard} live. Vraag vrijblijvend een offerte aan.`,
    h1: `Website laten maken in Noord-Nederland vanaf €${PRIJZEN.starter}`,
    intro:
      "Van Groningen en Leeuwarden tot Emmen: ook in het noorden bouwen we websites voor ondernemers die online gevonden willen worden. We werken vanuit Enkhuizen en stemmen af via videocall, met korte lijnen en één vast aanspreekpunt.",
    cities: [
      { name: "Groningen", slug: "groningen", note: "Studentenstad en kennisbedrijven" },
      { name: "Leeuwarden", slug: "leeuwarden", note: "Hoofdstad van Friesland" },
      { name: "Emmen", slug: "emmen", note: "MKB in Zuidoost-Drenthe" },
    ],
    strengths: [
      { title: "Op afstand, toch persoonlijk", text: "Kennismaken en afstemmen doen we via videocall. Je hebt één vast aanspreekpunt, van het eerste gesprek tot de oplevering." },
      { title: "Lokaal vindbaar", text: "We optimaliseren voor de zoektermen die klanten in jouw stad gebruiken, zoals website laten maken Groningen of Leeuwarden." },
      { title: "Vaste prijs vooraf", text: `Je weet vooraf waar je aan toe bent. Een complete website vanaf ${PRIJZEN.starter} euro.` },
    ],
    faq: [
      { q: "Werken jullie ook voor bedrijven in Groningen, Friesland en Drenthe?", a: "Ja. We werken voor ondernemers door heel Nederland. Afstemmen gaat via videocall, dus de afstand tot Enkhuizen maakt voor je project niet uit." },
      { q: "Hoe lang duurt het voordat mijn website in het noorden live staat?", a: `De meeste websites staan binnen ${LEVERTIJD.standaard} live. Grotere sites en webshops duren ${LEVERTIJD.complex}.` },
      { q: "Wat kost een website in Noord-Nederland?", a: `Een complete website begint bij ${PRIJZEN.starter} euro. Webshops en uitgebreide projecten liggen tussen ${PRIJZEN.uitgebreidVan} en ${PRIJZEN.uitgebreidTot} euro.` },
    ],
  },
];

const RegionalHub = () => {
  const { slug } = useParams<{ slug: string }>();
  const hub = HUBS.find((h) => h.slug === slug);
  if (!hub) return <NotFound />;

  const url = `${SITE_URL}/regio/${hub.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: hub.title,
        description: hub.description,
        url,
        inLanguage: "nl-NL",
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Website laten maken ${hub.name}`,
        serviceType: "Webdesign",
        areaServed: { "@type": "AdministrativeArea", name: hub.name },
        provider: { "@type": "Organization", name: companyInfo.name, url: companyInfo.url },
        offers: { "@type": "Offer", price: String(PRIJZEN.starter), priceCurrency: "EUR", url },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: hub.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={hub.title}
        description={hub.description}
        canonicalUrl={url}
        structuredData={jsonLd}
        includeLocalBusinessSchema={true}
        breadcrumbs={[
          { name: "Home", url: companyInfo.url },
          { name: hub.name, url },
        ]}
      />
      <main>
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <MapPin className="w-4 h-4" /> Regio {hub.name}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              {hub.h1}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{hub.intro}</p>
            <AnimatedButton to="/contact">Vraag een offerte aan</AnimatedButton>
          </div>
        </section>

        <BenefitList
          h2={`Waarom ondernemers in ${hub.name} voor Nieuwblik kiezen`}
          items={hub.strengths.map((s) => ({ h3: s.title, text: s.text }))}
          className="bg-muted/30"
        />

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Vind jouw lokale websitepartner in {hub.name}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {hub.cities.map((c) => (
                <Link
                  key={c.slug}
                  to={`/website-laten-maken-${c.slug}`}
                  className="group bg-background border border-border rounded-xl p-5 hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">{c.name}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <span className="text-xs text-muted-foreground">{c.note}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Websites die bezoekers omzetten in klanten
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Een greep uit websites die we recent opleverden. Van webshop tot leadgeneratie, elke case gebouwd voor snelheid, conversie en lokale vindbaarheid.</p>
            </div>
            <CaseGrid projects={hubCases} />
            <div className="text-center mt-10">
              <Link to="/portfolio" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                Bekijk het volledige portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <LandingFaq h2={`Veelgestelde vragen over website laten maken in ${hub.name}`} items={hub.faq} />

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Justin & Job achter Nieuwblik</h2>
                <p className="text-muted-foreground mb-4">
                  Wij zijn Justin en Job, twee gedreven ontwerpers en developers uit Enkhuizen. Geen groot bureau met accountmanagers en tussenlagen, maar een klein team met korte lijnen. Je spreekt altijd degene die ook daadwerkelijk aan jouw website bouwt.
                </p>
                <p className="text-muted-foreground mb-6">
                  Ook voor ondernemers in {hub.name} werken we persoonlijk. We plannen graag een videocall om jouw plan door te nemen; spreek je elkaar liever in het echt, dan komen we in overleg bij je langs. Je spreekt altijd één van ons, en binnen 24 uur heb je een duidelijk voorstel.
                </p>
                <AnimatedButton to="/over-ons">Meer over ons</AnimatedButton>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src={justinJobImg}
                  alt="Justin Slok en Job, oprichters van Nieuwblik uit Enkhuizen"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={900}
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <ContactBlock h2={`Start jouw website in ${hub.name} vanaf €${PRIJZEN.starter}`} body="Vertel over jouw bedrijf en plan. Binnen 24 uur een reactie met een concreet voorstel." />
      </main>
      <Footer />
    </div>
  );
};

export default RegionalHub;
