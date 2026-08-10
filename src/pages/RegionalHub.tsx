import { useParams, Link } from "react-router-dom";
import { MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";
import { projects } from "@/data/projects";
import justinJobImg from "@/assets/justin-job-compressed.webp";
import NotFound from "./NotFound";

const FEATURED_SLUGS = ["taxi-drechterland", "een-bundel-geluk", "aardingsbedrijf-west-friesland"];

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

const HUBS: RegionHubData[] = [
  {
    slug: "noord-holland",
    name: "Noord-Holland",
    title: "Website laten maken Noord-Holland | Nieuwblik",
    description:
      "Website laten maken in Noord-Holland door een lokaal bureau uit Enkhuizen. Snelle sites, conversie eerst, vanaf 990 euro. Actief in Amsterdam, Haarlem, Alkmaar en heel West-Friesland.",
    h1: "Website laten maken in Noord-Holland",
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
      { title: "Snel op locatie", text: "Voor grotere trajecten komen we langs. Persoonlijk contact maakt echt verschil." },
      { title: "Regio-SEO", text: "We optimaliseren op de zoektermen die in jouw plaats werken, niet op algemene termen." },
    ],
    faq: [
      { q: "Werken jullie voor bedrijven in heel Noord-Holland?", a: "Ja. Van Den Helder tot Amsterdam, en van Haarlem tot Enkhuizen. Onze klanten zitten door de hele provincie." },
      { q: "Komen jullie langs voor een kennismaking?", a: "Als je in Noord-Holland zit, komen we graag langs. Voor korte afstemmingen werken we via videocall." },
      { q: "Wat kost een website in Noord-Holland?", a: "Onze projecten starten vanaf 990 euro. Voor uitgebreide sites en webshops rekenen we tussen de 1990 en 4000 euro." },
    ],
  },
  {
    slug: "randstad",
    name: "Randstad",
    title: "Website laten maken Randstad | Nieuwblik",
    description:
      "Website laten maken in de Randstad. Wij bouwen conversiegerichte sites voor MKB in Amsterdam, Rotterdam, Den Haag, Utrecht en omgeving. Vanaf 990 euro, altijd persoonlijk contact.",
    h1: "Website laten maken in de Randstad",
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
    ],
    strengths: [
      { title: "Snelheid", text: "Twee tot vier weken van briefing naar live. Dat is het tempo van de Randstad, en dat halen wij." },
      { title: "Sterk in conversie", text: "Meer bezoekers is niet genoeg. We bouwen sites die die bezoekers omzetten in klanten." },
      { title: "Landelijke uitstraling", text: "Voor bedrijven die vanuit de Randstad heel Nederland bedienen." },
    ],
    faq: [
      { q: "Zitten jullie zelf in de Randstad?", a: "Nee, wij zitten in Enkhuizen. Voor 90 procent van onze Randstad-klanten werken we volledig op afstand. Werkt prima." },
      { q: "Kunnen jullie meerdere talen aan op één site?", a: "Ja. NL, EN en andere talen zetten we netjes op met correcte hreflang tags voor Google." },
      { q: "Hoe snel kunnen jullie starten?", a: "Meestal binnen twee weken na akkoord. Snelheid is een van de redenen dat ondernemers voor ons kiezen." },
    ],
  },
  {
    slug: "oost-nederland",
    name: "Oost-Nederland",
    title: "Website laten maken Oost-Nederland | Nieuwblik",
    description:
      "Website laten maken in Oost-Nederland. Nieuwblik bouwt voor MKB in Gelderland en Overijssel. Persoonlijk, snel en betaalbaar. Vanaf 990 euro, met lokale SEO.",
    h1: "Website laten maken in Oost-Nederland",
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
      { title: "Duidelijk in prijs", text: "Vaste bedragen, geen verrassingen. Vanaf 990 euro voor een complete site." },
      { title: "Regionale SEO", text: "We optimaliseren voor de zoektermen die klanten in jouw plaats echt gebruiken." },
      { title: "Blijvend contact", text: "Na oplevering blijven we bereikbaar. Geen ticket-systeem, gewoon direct contact." },
    ],
    faq: [
      { q: "Werken jullie ook voor bedrijven in Twente?", a: "Zeker. Enschede, Hengelo, Almelo, we hebben in de hele regio klanten." },
      { q: "Werken jullie op afstand of komen jullie langs?", a: "Vooral op afstand via videocall. Voor grotere trajecten plannen we een fysieke afspraak op locatie." },
      { q: "Wat kost een website voor Oost-Nederland?", a: "Onze projecten starten bij 990 euro. Voor webshops en uitgebreide sites tussen de 1990 en 4000 euro." },
    ],
  },
  {
    slug: "zuid-nederland",
    name: "Zuid-Nederland",
    title: "Website laten maken Zuid-Nederland | Nieuwblik",
    description:
      "Website laten maken in Zuid-Nederland. Voor MKB in Noord-Brabant en Limburg. Snelle sites, sterke SEO en vaste prijzen vanaf 990 euro. Vraag een offerte aan.",
    h1: "Website laten maken in Zuid-Nederland",
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
      { title: "Snelle levering", text: "Twee tot vier weken van start tot live, ook voor Zuid-Nederlandse klanten." },
      { title: "Sterke content", text: "We schrijven de teksten zelf, in de tone-of-voice die past bij jouw regio en klant." },
    ],
    faq: [
      { q: "Zijn jullie bekend met de Zuid-Nederlandse markt?", a: "Ja. We hebben klanten in Eindhoven, Breda, Tilburg en Maastricht. De regio kent zijn eigen dynamiek en die respecteren we." },
      { q: "Werken jullie ook in het Duits voor grens-regio's?", a: "Ja. Voor bedrijven in Venlo of Maastricht met Duitse klanten zetten we meertalige sites op met correcte SEO per taal." },
      { q: "Wat kost een website in Zuid-Nederland?", a: "Vanaf 990 euro voor een complete site. Webshops en uitgebreide projecten liggen tussen 1990 en 4000 euro." },
    ],
  },
];

const RegionalHub = () => {
  const { slug } = useParams<{ slug: string }>();
  const hub = HUBS.find((h) => h.slug === slug);
  if (!hub) return <NotFound />;

  const url = `https://www.nieuwblik.com/regio/${hub.slug}`;
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
        offers: { "@type": "Offer", price: "990", priceCurrency: "EUR", url },
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

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Waarom Nieuwblik in {hub.name}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {hub.strengths.map((s) => (
                <div key={s.title} className="bg-background rounded-2xl p-6 border border-border">
                  <CheckCircle2 className="w-6 h-6 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Steden in {hub.name}</h2>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Recent werk voor ondernemers in {hub.name}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Een greep uit websites die we recent opleverden. Van webshop tot leadgeneratie, elke case gebouwd voor snelheid, conversie en lokale vindbaarheid.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_SLUGS.map((slug) => {
                const p = projects.find((x) => x.slug === slug);
                if (!p) return null;
                return (
                  <Link
                    key={p.slug}
                    to={`/portfolio/${p.slug}`}
                    className="group bg-background border border-border rounded-2xl overflow-hidden hover:border-accent transition-colors flex flex-col"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={p.image}
                        alt={`${p.title} website case`}
                        loading="lazy"
                        decoding="async"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <span className="text-xs text-accent font-medium mb-1">{p.category}</span>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{p.description}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                        Bekijk case <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
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
                  Ook voor ondernemers in {hub.name} werken we persoonlijk. We plannen graag een videocall om jouw plan door te nemen, en bij grotere trajecten komen we op locatie langs. Altijd één van ons aan tafel, altijd met een duidelijk voorstel binnen 24 uur.
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

        <ContactBlock h2={`Klaar voor een website in ${hub.name}?`} body="Vertel over jouw bedrijf en plan. Binnen 24 uur een reactie met een concreet voorstel." />
      </main>
      <Footer />
    </div>
  );
};

export default RegionalHub;
