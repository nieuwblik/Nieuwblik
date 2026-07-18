import { Link } from "react-router-dom";
import { Zap, Smartphone, MessageCircle, MapPin, Plane, Gauge, Search, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import { AnimatedButton } from "@/components/ui/animated-button";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useDarkNavSection } from "@/components/UnderlayNav";
import { companyInfo } from "@/config/company";
import taxiImg from "@/assets/taxidrechterland.webp";

const url = "https://www.nieuwblik.com/taxi-website-laten-maken";

const faqItems = [
  {
    q: "Wat kost een taxi website laten maken bij Nieuwblik?",
    a: "Een complete taxi website op maat, inclusief WhatsApp-boekingsformulier, luchthavenpagina's en lokale SEO, begint bij ons vanaf 1500 euro. Voor uitgebreidere sites met meerdere diensten of extra integraties maken we een offerte op maat. Altijd transparant en zonder verrassingen achteraf.",
  },
  {
    q: "Hoe snel is de site van Taxi Drechterland precies?",
    a: "De site laadt op mobiel binnen 1 seconde en scoort 90+ op Google PageSpeed. Dat komt door een statische build, WebP-afbeeldingen, lazy loading en het volledig vermijden van zware trackers of externe systemen. Voor een taxi is dat cruciaal, want klanten boeken vaak snel op hun telefoon langs de weg.",
  },
  {
    q: "Waarom een WhatsApp boekingsformulier in plaats van een agendasysteem?",
    a: "Een agenda-integratie met realtime beschikbaarheid werkt niet voor een chauffeur die zelf rijdt. Het WhatsApp-formulier zet de aanvraag om in een compleet, netjes opgemaakt bericht dat direct in de app van de chauffeur landt. Geen account, geen wachtrij, en de chauffeur bevestigt persoonlijk met een prijsindicatie.",
  },
  {
    q: "Werken jullie ook voor taxibedrijven buiten West-Friesland?",
    a: "Ja, we bouwen taxi websites voor bedrijven door heel Nederland. De aanpak, snelheid en SEO-structuur zijn universeel, alleen de lokale zoektermen en werkgebieden passen we aan op jouw regio en luchthavens waar je op rijdt.",
  },
  {
    q: "Hoe zorgen jullie dat een taxi website goed scoort op Google?",
    a: "We maken aparte landingspagina's per luchthaven en per dorp of stad in het werkgebied, met copy geschreven op de zoekintentie van de klant. Combineer dat met een snelle site, schone structured data en een geoptimaliseerd Google Business profiel, en je bent zichtbaar op precies de zoekopdrachten die tot een rit leiden.",
  },
];

const graphJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: "Taxi website laten maken, de case van Taxi Drechterland",
      description: "Hoe Nieuwblik voor Taxi Drechterland een razendsnelle taxi website bouwde met WhatsApp-boekingsformulier, luchthaven-SEO en lokale zichtbaarheid in West-Friesland.",
      image: `${companyInfo.url}/og-image.webp`,
      author: { "@type": "Organization", name: companyInfo.name, url: companyInfo.url },
      publisher: { "@type": "Organization", name: companyInfo.name, url: companyInfo.url },
      datePublished: "2026-07-15",
      dateModified: "2026-07-15",
      mainEntityOfPage: url,
    },
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: "Taxi website laten maken",
      serviceType: "Webdesign voor taxibedrijven",
      areaServed: [
        { "@type": "AdministrativeArea", name: "West-Friesland" },
        { "@type": "Country", name: "Nederland" },
      ],
      provider: { "@type": "Organization", name: companyInfo.name, url: companyInfo.url },
      offers: { "@type": "Offer", price: "1500", priceCurrency: "EUR", availability: "https://schema.org/InStock", url },
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

const buildBlocks = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Maatwerk zonder CMS-overhead",
    text: "Gebouwd in React met een statische build. Geen WordPress-plugins die traag worden of veiligheidslekken opleveren, gewoon schone code die precies doet wat nodig is.",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "WhatsApp boekingsformulier",
    text: "In een paar tikken geeft de klant zijn rit door. Het formulier zet alles om in een compleet WhatsApp-bericht dat direct bij de chauffeur landt, klaar om te bevestigen.",
  },
  {
    icon: <Smartphone className="w-5 h-5" />,
    title: "Mobile-first ontwerp",
    text: "Plus- en minknoppen in plaats van dropdowns, een zwevende bel- en app-widget, en een sticky actiebalk. Alles bedient met één duim, ook onderweg of in de auto.",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Ritme van het bedrijf uitgelegd",
    text: "Overdag lokaal, vanaf de middag luchthavens. Dat staat expliciet op de site, zodat bezoekers direct zien of ze op het juiste moment aanvragen. Geen valse beloftes.",
  },
];

const speedPoints = [
  "Statische build zonder database queries op de server",
  "WebP-afbeeldingen met lazy loading buiten de eerste viewport",
  "Geen zware trackers of third-party scripts die het laden vertragen",
  "Aggressieve edge caching en optimale headers voor herhaalbezoek",
  "PageSpeed 90+ op zowel mobiel als desktop",
];

const airports = [
  { name: "Schiphol", slug: "schiphol" },
  { name: "Eindhoven Airport", slug: "eindhoven" },
  { name: "Rotterdam The Hague Airport", slug: "rotterdam" },
  { name: "Groningen Airport Eelde", slug: "groningen" },
  { name: "Maastricht Aachen Airport", slug: "maastricht" },
];

const localCores = [
  "Hoogkarspel", "Venhuizen", "Westwoud", "Oosterblokker", "Hoorn",
  "Enkhuizen", "Bovenkarspel", "Grootebroek", "Andijk", "Wervershoof", "Medemblik",
];

const TaxiWebsite = () => {
  const darkNavRef = useDarkNavSection<HTMLElement>();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Taxi website laten maken | Case Drechterland - Nieuwblik"
        description="Taxi website laten maken die ritten oplevert. Bekijk de case van Taxi Drechterland: razendsnel, WhatsApp-boekingen, luchthaven-SEO en lokaal sterk."
        canonicalUrl={url}
        ogType="article"
        articlePublishedTime="2026-07-15T00:00:00+02:00"
        articleModifiedTime="2026-07-15T00:00:00+02:00"
        articleAuthor={companyInfo.name}
        structuredData={graphJsonLd}
        breadcrumbs={[
          { name: "Home", url: companyInfo.url },
          { name: "Portfolio", url: `${companyInfo.url}/portfolio` },
          { name: "Taxi website laten maken", url },
        ]}
      />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <Plane className="w-4 h-4" />
              Case: Taxi Drechterland, juli 2026
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Taxi website laten maken die ritten oplevert
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Van boekingsformulier tot luchthaven-SEO. Zo bouwde Nieuwblik voor Taxi Drechterland een razendsnelle website die klanten uit West-Friesland en heel Noord-Holland naar de juiste chauffeur brengt.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <AnimatedButton to="/contact" size="lg">
                Vraag een voorstel aan
              </AnimatedButton>
              <AnimatedButton href="https://taxidrechterland.nl" size="lg" variant="outline">
                Bekijk de live site
              </AnimatedButton>
            </div>
          </div>
        </section>

        {/* Featured image + intro */}
        <section className="pb-16 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="rounded-3xl overflow-hidden mb-12 border border-border">
              <OptimizedImage
                src={taxiImg}
                alt="Taxi Drechterland website case door Nieuwblik"
                type="hero"
                className="w-full h-auto"
              />
            </div>
            <div className="max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Taxi Drechterland uit Hoogkarspel is geen centrale met een callcenter, maar één vaste chauffeur die zijn eigen ritten rijdt. Precies dat is de kracht van het bedrijf, en precies dat maakte een klassiek boekingssysteem ongeschikt. De opdracht was om de aanvraag zo kort mogelijk te maken zonder de chauffeur zijn regie af te nemen.
              </p>
              <p>
                Het resultaat is een website die de kortste route neemt tussen een bezoeker met een vraag en een chauffeur met een antwoord. Geen systeem dat onderhouden moet worden, geen techniek die belooft wat één chauffeur niet kan waarmaken, maar een snelle en heldere site die elke aanvraag als een compleet bericht op de telefoon van de chauffeur legt.
              </p>
            </div>
          </div>
        </section>

        {/* Hoe is de site gebouwd */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">
              Zo is de site gebouwd
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-3xl mx-auto text-center">
              Vier bouwstenen die samen bepalen waarom deze taxi website werkt in de praktijk, in plaats van alleen op papier goed lijkt.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {buildBlocks.map((item) => (
                <div key={item.title} className="bg-background rounded-2xl p-6 border border-border">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Waarom hij snel is */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Gauge className="w-4 h-4" />
                Snelheid als conversiefactor
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Waarom deze taxi website zo snel is
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                Voor een taxi is snelheid geen luxe. Klanten boeken op hun telefoon, vaak met haast, soms met slecht bereik. Een halve seconde vertraging kost letterlijk ritten. Daarom is elke laag van de site gebouwd rond performance.
              </p>
            </div>
            <ul className="space-y-4 max-w-2xl mx-auto">
              {speedPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Airport SEO */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Plane className="w-4 h-4" />
                Luchthaven-SEO integratie
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Gevonden worden op elke luchthavenrit
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                Iemand die een taxi naar Schiphol zoekt, typt bijna nooit alleen 'taxi' in Google. Hij typt 'taxi naar Schiphol vanuit West-Friesland', of 'taxi Hoogkarspel Eindhoven Airport'. Daarom kreeg elke luchthaven een eigen landingspagina met eigen copy, structured data en interne linkstructuur.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {airports.map((a) => (
                <div key={a.slug} className="bg-background rounded-2xl p-5 border border-border flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Taxi naar {a.name}</h3>
                    <p className="text-xs text-muted-foreground">Eigen landingspagina met route en tarief</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center">
              Elke pagina is geschreven op de zoekintentie van de klant, met een duidelijke prijsindicatie, reistijd en een directe boekingsknop. Google ziet dat de site echt over die specifieke rit gaat, en beloont dat met betere posities in de zoekresultaten.
            </p>
          </div>
        </section>

        {/* Lokale keywords West-Friesland */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Search className="w-4 h-4" />
                Lokale zoekwoorden
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Sterk in elke kern van West-Friesland
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                In West-Friesland zoekt bijna niemand op alleen 'taxi'. Mensen zoeken op hun eigen dorp: taxi Hoogkarspel, taxi Enkhuizen, taxi Bovenkarspel. Voor elke kern in het werkgebied is de site afgestemd op precies die lokale zoektermen.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10 max-w-3xl mx-auto">
              {localCores.map((c) => (
                <div key={c} className="bg-secondary rounded-xl px-4 py-3 text-center text-sm font-medium text-foreground border border-border">
                  Taxi {c}
                </div>
              ))}
            </div>
            <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
              <p>
                De site is gekoppeld aan een geoptimaliseerd Google Business profiel met de juiste categorieën, foto's en openingstijden. Klantrecensies uit de regio versterken de positie in de lokale kaart, en per kern zijn de pagina's opgebouwd rond concrete vragen: van 'taxi naar het station Hoorn' tot 'taxi naar het ziekenhuis in Enkhuizen'.
              </p>
              <p>
                Zo wordt Taxi Drechterland gevonden op precies de zoekopdrachten waar de klant op dat moment mee bezig is. Geen algemene concurrentie met de grote centrales, maar sterke posities op de zoektermen die tot een echte rit leiden.
              </p>
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section ref={darkNavRef} className="py-20 md:py-28" style={{ background: "hsl(160 84% 12%)" }}>
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ook een taxi website die echt werkt?
            </h2>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Of je nu één chauffeur bent of een klein team runt, wij bouwen de website die past bij hoe jij daadwerkelijk rijdt. Snel, gevonden en direct bereikbaar.
            </p>
            <AnimatedButton to="/contact" size="lg" variant="white">
              Start je project
            </AnimatedButton>
          </div>
        </section>

        {/* FAQ */}
        <LandingFaq h2="Veelgestelde vragen over een taxi website" items={faqItems} />

        {/* Contact */}
        <ContactBlock
          h2="Klaar om jouw taxibedrijf online te laten groeien?"
          body="Vraag een vrijblijvend voorstel aan. We denken mee over het boekingsproces, de lokale SEO en de luchthavens waar jij op rijdt, en leveren binnen enkele weken een site die aanvragen oplevert."
        />

        {/* Interne links */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <p className="text-muted-foreground leading-relaxed">
              Bekijk ook de{" "}
              <Link to="/portfolio/taxi-drechterland" className="text-accent hover:underline font-semibold">volledige case van Taxi Drechterland</Link>
              , onze{" "}
              <Link to="/diensten/website-op-maat" className="text-accent hover:underline font-semibold">website op maat</Link>
              {" "}dienst, of ontdek het{" "}
              <Link to="/werkgebied/west-friesland" className="text-accent hover:underline font-semibold">werkgebied West-Friesland</Link>
              {" "}en de{" "}
              <Link to="/seo-enkhuizen" className="text-accent hover:underline font-semibold">lokale SEO aanpak in Enkhuizen</Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TaxiWebsite;
