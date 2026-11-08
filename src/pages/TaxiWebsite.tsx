import { PRIJZEN } from "@/config/business";
import { SITE_URL } from "@/config/site";
import { Link } from "@/lib/router-compat";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import { AnimatedButton } from "@/components/ui/animated-button";
import { OptimizedImage } from "@/components/OptimizedImage";
import { companyInfo } from "@/config/company";
import LandingHero from "@/components/LandingHero";
import { BeeldSectie, BlokLijst, BlokTekst, BlokVinkjes, TekstBlok } from "@/components/dienst/BeeldBlok";
import { Sectie, SectieKop } from "@/components/dienst/DienstBlokken";
import taxiImg from "@/assets/taxidrechterland.webp";
import { laatstGewijzigd } from "@/lib/lastmod";

const url = `${SITE_URL}/taxi-website-laten-maken`;

const faqItems = [
  {
    q: "Wat kost een taxi website laten maken bij Nieuwblik?",
    a: `Een complete taxi website op maat, inclusief WhatsApp-boekingsformulier, luchthavenpagina's en lokale SEO, begint bij ons vanaf ${PRIJZEN.taxiWebsiteVanaf} euro. Voor uitgebreidere sites met meerdere diensten of extra integraties maken we een offerte op maat. Altijd transparant en zonder verrassingen achteraf.`,
  },
  {
    q: "Hoe snel is de site van Taxi Drechterland precies?",
    a: "Ons streven is een PageSpeed-score van 90 of hoger op mobiel en desktop. Daarvoor gebruiken we een statische build, WebP-afbeeldingen, lazy loading en het volledig vermijden van zware trackers of externe systemen. Voor een taxi is dat cruciaal, want klanten boeken vaak snel op hun telefoon langs de weg.",
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
      // Zelfde bron als de lastmod in de sitemap.
      dateModified: laatstGewijzigd("/taxi-website-laten-maken", "2026-07-15"),
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
      offers: { "@type": "Offer", price: String(PRIJZEN.taxiWebsiteVanaf), priceCurrency: "EUR", availability: "https://schema.org/InStock", url },
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
    title: "Maatwerk zonder CMS-overhead",
    text: "Gebouwd in React met een statische build. De site laadt snel en heeft geen plugins die bijgewerkt moeten worden: schone code die precies doet wat nodig is.",
  },
  {
    title: "WhatsApp boekingsformulier",
    text: "In een paar tikken geeft de klant zijn rit door. Het formulier zet alles om in een compleet WhatsApp-bericht dat direct bij de chauffeur landt, klaar om te bevestigen.",
  },
  {
    title: "Mobile-first ontwerp",
    text: "Plus- en minknoppen in plaats van dropdowns, een zwevende bel- en app-widget, en een sticky actiebalk. Alles bedient met één duim, ook onderweg of in de auto.",
  },
  {
    title: "Ritme van het bedrijf uitgelegd",
    text: "Overdag lokaal, vanaf de middag luchthavens. Dat staat expliciet op de site, zodat bezoekers direct zien of ze op het juiste moment aanvragen. Geen valse beloftes.",
  },
];

const speedPoints = [
  "Statische build zonder database queries op de server",
  "WebP-afbeeldingen met lazy loading buiten de eerste viewport",
  "Geen zware trackers of third-party scripts die het laden vertragen",
  "Aggressieve edge caching en optimale headers voor herhaalbezoek",
  "Ons streven is een PageSpeed-score van 90 of hoger op mobiel en desktop",
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
        <LandingHero
          h1="Taxi website laten maken die ritten oplevert"
          subtitle="Van boekingsformulier tot luchthaven-SEO. Zo bouwde Nieuwblik voor Taxi Drechterland een razendsnelle website die klanten uit West-Friesland en heel Noord-Holland naar de juiste chauffeur brengt."
          knoppen={
            <>
              <AnimatedButton to="/contact" className="h-12 w-full sm:w-auto">
                Vraag een voorstel aan
              </AnimatedButton>
              <AnimatedButton href="https://taxidrechterland.nl" variant="outline" className="h-12 w-full sm:w-auto">
                Bekijk de live site
              </AnimatedButton>
            </>
          }
        />

        {/* Featured image + intro */}
        <section className="bg-background pb-16 pt-8 md:pb-24 md:pt-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 overflow-hidden rounded-3xl border border-border md:mb-16">
              <OptimizedImage
                src={taxiImg}
                alt="Taxi Drechterland website case door Nieuwblik"
                type="hero"
                className="h-auto w-full"
              />
            </div>
            <div className="max-w-3xl space-y-6 text-xl font-light leading-relaxed md:text-2xl" style={{ color: "hsl(var(--sw-ink) / 0.75)" }}>
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
        <BeeldSectie keuze="taxi-drechterland" kop="Zo is de site gebouwd">
          <BlokTekst>
            <p>
              Vier bouwstenen die samen bepalen waarom deze taxi website werkt in de praktijk, in plaats van alleen op papier goed lijkt.
            </p>
          </BlokTekst>
          <BlokLijst items={buildBlocks.map((b) => ({ h3: b.title, text: b.text }))} />
        </BeeldSectie>

        {/* Waarom hij snel is */}
        <TekstBlok kop="Waarom deze taxi website zo snel is">
          <p>
            Voor een taxi is snelheid geen luxe. Klanten boeken op hun telefoon, vaak met haast, soms met slecht bereik. Een halve seconde vertraging kost letterlijk ritten. Daarom is elke laag van de site gebouwd rond performance.
          </p>
          <BlokVinkjes items={speedPoints} />
        </TekstBlok>

        {/* Airport SEO */}
        <Sectie>
          <SectieKop
            titel="Gevonden worden op elke luchthavenrit"
            intro="Iemand die een taxi naar Schiphol zoekt, typt bijna nooit alleen 'taxi' in Google. Hij typt 'taxi naar Schiphol vanuit West-Friesland', of 'taxi Hoogkarspel Eindhoven Airport'. Daarom kreeg elke luchthaven een eigen landingspagina met eigen copy, structured data en interne linkstructuur."
          />
          <div className="mb-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {airports.map((a) => (
              <div key={a.slug} className="border-t border-border py-5">
                <h3 className="text-lg font-semibold text-foreground">Taxi naar {a.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Eigen landingspagina met route en tarief</p>
              </div>
            ))}
          </div>
          <p className="max-w-3xl text-lg font-light leading-relaxed text-muted-foreground">
            Elke pagina is geschreven op de zoekintentie van de klant, met een duidelijke prijsindicatie, reistijd en een directe boekingsknop. Google ziet dat de site echt over die specifieke rit gaat, en beloont dat met betere posities in de zoekresultaten.
          </p>
        </Sectie>

        {/* Lokale keywords West-Friesland */}
        <Sectie>
          <SectieKop
            titel="Sterk in elke kern van West-Friesland"
            intro="In West-Friesland zoekt bijna niemand op alleen 'taxi'. Mensen zoeken op hun eigen dorp: taxi Hoogkarspel, taxi Enkhuizen, taxi Bovenkarspel. Voor elke kern in het werkgebied is de site afgestemd op precies die lokale zoektermen."
          />
          <div className="mb-10 flex max-w-4xl flex-wrap gap-2.5">
            {localCores.map((c) => (
              <span key={c} className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground">
                Taxi {c}
              </span>
            ))}
          </div>
          <div className="max-w-3xl space-y-4 text-lg font-light leading-relaxed text-muted-foreground">
            <p>
              De site is gekoppeld aan een geoptimaliseerd Google Business profiel met de juiste categorieën, foto's en openingstijden. Klantrecensies uit de regio versterken de positie in de lokale kaart, en per kern zijn de pagina's opgebouwd rond concrete vragen: van 'taxi naar het station Hoorn' tot 'taxi naar het ziekenhuis in Enkhuizen'.
            </p>
            <p>
              Zo wordt Taxi Drechterland gevonden op precies de zoekopdrachten waar de klant op dat moment mee bezig is. Geen algemene concurrentie met de grote centrales, maar sterke posities op de zoektermen die tot een echte rit leiden.
            </p>
          </div>
        </Sectie>

        {/* FAQ */}
        <LandingFaq h2="Veelgestelde vragen over een taxi website" items={faqItems} />

        {/* Interne links */}
        <section className="bg-background py-16 md:py-20">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
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
