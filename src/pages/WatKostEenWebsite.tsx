import { PRIJZEN, PAKKETTEN, LEVERTIJD, REVIEWS, euroTeken, HOSTING_PER_MAAND, euroMetCenten, HOSTING_ZIN } from "@/config/business";
import { SITE_URL } from "@/config/site";
import { Calculator, Shield, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Reveal from "@/components/Reveal";
import ContactBlock from "@/components/ContactBlock";
import { DienstHero, GROEN, INKT_65, Pakketten, Pijlers, RAND, Sectie, SectieKop, Tekst, Vinkjes, Vragen } from "@/components/dienst/DienstBlokken";
import { companyInfo } from "@/config/company";

const url = `${SITE_URL}/wat-kost-een-website`;

const faqItems = [
  { q: "Wat kost een gemiddelde website in 2026?", a: `Een professionele MKB-website kost in 2026 tussen de ${euroTeken(PRIJZEN.starter)} en ${euroTeken(PRIJZEN.professional)}. Kleine sites tot 5 pagina's beginnen bij ${euroTeken(PRIJZEN.starter)}, complete sites met blog en uitgebreide SEO bij ${euroTeken(PRIJZEN.professional)}. Een CMS om zelf te beheren is op aanvraag. Webshops starten bij ${euroTeken(PRIJZEN.webshopVanaf)}.` },
  { q: "Waarom kiezen jullie voor een vaste prijs in plaats van een uurtarief?", a: `Met een vaste prijs weet je vooraf precies waar je aan toe bent. Bij een uurtarief betaal je elke extra ronde feedback, elke technische blip en elk telefoontje. Wij spreken een bedrag en een oplevertermijn af en daaraan houden we ons.` },
  { q: "Zijn er nog verborgen kosten bij een website?", a: `Bij ons niet. Wat je wel altijd kwijt bent, ook bij andere bureaus: een domeinnaam (circa 10 euro per jaar) en hosting (bij ons vanaf ${euroMetCenten(HOSTING_PER_MAAND)} per maand excl. btw, optioneel). Die vermeld we gewoon bij de offerte, zodat je geen verrassingen krijgt.` },
  { q: "Wat kost onderhoud na de oplevering?", a: `${HOSTING_ZIN} Er is geen apart onderhoudscontract.` },
  { q: "Is een duurdere website beter?", a: `Niet automatisch. Een goede website verdient zichzelf terug door aanvragen op te leveren, niet door zoveel mogelijk te kosten. Daarom adviseren we vaak eerst een compacte site die goed converteert, en later uitbreiden zodra het bedrijf groeit.` },
  { q: "Hoe snel kan ik een website hebben?", a: `Een Starter-pakket staat binnen ${LEVERTIJD.starter} live, een volledige MKB-website binnen ${LEVERTIJD.standaard}. Grote projecten en webshops duren ${LEVERTIJD.complex}.` },
  { q: "Wat kost een webshop laten maken?", a: `Een webshop bij Nieuwblik start bij ${euroTeken(PRIJZEN.webshopVanaf)}. Daar zit de koppeling met Stripe inbegrepen, plus instructies om zelf te starten met verkopen. Bekijk ook onze pagina over webshops.` },
  { q: "Kan ik ergens anders goedkoper uit zijn?", a: `Met een bouwpakket of een student die het "even probeert" wel, maar daar betaal je later dubbel voor: trage sites, geen Google-vindbaarheid en niemand die je kunt bellen. Wij leveren maatwerk met doorlopende support waar je niet omheen kunt.` },
];

const prijsFactoren = [
  { icon: Calculator, title: "Omvang van de site", text: "Een one-pager is andere rekenkunde dan een site met 30 pagina's of een webshop met honderden producten. Meer pagina's betekent meer design, tekst en techniek." },
  { icon: Clock, title: "Content en fotografie", text: "Heb je al teksten en foto's? Dan scheelt dat. Moeten wij ze schrijven en verzinnen, dan zit dat verwerkt in de prijs. Wij leveren bij elk project teksten op die passen bij jouw doelgroep." },
  { icon: Shield, title: "Techniek en integraties", text: "Een koppeling met een kassysteem, een klantportaal of meertaligheid brengt de prijs omhoog. Wij geven in de offerte precies aan wat elke uitbreiding kost." },
];

const verborgenKosten = [
  { kosten: "Domeinnaam", prijs: "circa 10 euro per jaar", toelichting: "Regel je zelf of wij nemen hem mee in de opdracht." },
  { kosten: "Hosting", prijs: `vanaf ${euroMetCenten(HOSTING_PER_MAAND)} per maand excl. btw`, toelichting: "Optioneel; de prijs hangt af van wat je site nodig heeft. Snelle servers, met back-ups en updates voor jou geregeld." },
  { kosten: "Onderhoud", prijs: "inbegrepen bij de hosting", toelichting: "Basisonderhoud zit bij de hosting, er is geen apart onderhoudscontract." },
  { kosten: "Google-tools", prijs: "gratis", toelichting: "Analytics en Search Console koppelen wij standaard bij elk project." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "Wat kost een website laten maken in 2026? Kosten en prijzen",
      description: `Complete gids over websitekosten in 2026. Vaste prijzen vanaf ${euroTeken(PRIJZEN.starter)}, geen verborgen kosten.`,
      url,
      inLanguage: "nl-NL",
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
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: "Website laten maken",
      serviceType: "Webdesign en webontwikkeling",
      provider: { "@type": "Organization", name: companyInfo.name, url: companyInfo.url },
      areaServed: { "@type": "Country", name: "Nederland" },
      offers: { "@type": "Offer", price: String(PRIJZEN.starter), priceCurrency: "EUR", availability: "https://schema.org/InStock", url },
    },
  ],
};

const WatKostEenWebsite = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Wat kost een website laten maken in 2026? Vanaf ${euroTeken(PRIJZEN.starter)}`}
        description={`Wat kost een website in 2026? Complete kostengids met vaste prijzen vanaf ${euroTeken(PRIJZEN.starter)}, uitleg over verborgen kosten en het verschil met een uurtarief.`}
        keywords="wat kost een website, website kosten 2026, prijs website laten maken, kosten webshop laten maken, website prijzen nederland"
        canonicalUrl={url}
        structuredData={jsonLd}
        includeLocalBusinessSchema={true}
        breadcrumbs={[
          { name: "Home", url: companyInfo.url },
          { name: "Wat kost een website", url },
        ]}
      />

      <main>
        <DienstHero
          kruimels={[{ label: "Wat kost een website", path: "/wat-kost-een-website" }]}
          titel="Wat kost een website laten maken"
          accent="in 2026?"
          intro={
            <>
              Het eerlijke antwoord: tussen de {euroTeken(PRIJZEN.starter)} en {euroTeken(PRIJZEN.professional)} voor de meeste MKB-bedrijven. In deze gids laten we precies zien wat je krijgt voor dat geld en welke kosten je moet verwachten.
            </>
          }
          knop={{ label: "Vraag een prijs op maat", to: "/contact" }}
          tweedeKnop={{ label: "Bekijk alle pakketten", to: "/prijzen" }}
        />

        <Sectie papier>
          <SectieKop titel="Het korte antwoord" />
          <Tekst>
            <p>
              Een website laten maken kost bij een betrouwbaar Nederlands bureau in 2026 gemiddeld tussen de {euroTeken(PRIJZEN.starter)} en {euroTeken(PRIJZEN.professional)}. Onder de {euroTeken(500)} kom je alleen terecht bij bouwpakketten waar je zelf alles moet doen, of bij partijen die een template in tien minuten neerzetten en daarna verdwijnen.
            </p>
            <p>
              Boven de {euroTeken(5000)} betaal je meestal voor bureaus met grote kantoren, accountmanagers en overleglagen tussen jou en de maker. Soms terecht bij complexe trajecten, maar voor de meeste ondernemers is het gewoon geld dat niet in de site zit.
            </p>
            <p>
              Onze aanpak zit daar tussenin: vaste prijzen, geen tussenpersonen, en je spreekt rechtstreeks met degene die bouwt.
            </p>
          </Tekst>
        </Sectie>

        <Sectie>
          <SectieKop
            titel="Onze vaste prijzen in 2026"
            intro="Geen uurtarieven, geen verrassingen. Je krijgt een vaste prijs en een afgesproken opleverdatum."
          />
          <Pakketten
            items={[
              { naam: PAKKETTEN.starter.naam, prijs: euroTeken(PAKKETTEN.starter.prijs), omschrijving: "One-pager of kleine site tot 5 pagina's. Ideaal voor ZZP-ers en starters die gevonden willen worden.", levertijd: LEVERTIJD.starter },
              { naam: PAKKETTEN.professional.naam, prijs: euroTeken(PAKKETTEN.professional.prijs), omschrijving: "Complete site tot 10 pagina's met blog, uitgebreide SEO en koppelingen met Google.", levertijd: LEVERTIJD.standaard, uitgelicht: true },
              { naam: PAKKETTEN.opMaat.naam, prijs: `vanaf ${euroTeken(PRIJZEN.webshopVanaf)}`, omschrijving: "Uitgebreide site of webshop met integraties, meerdere talen of een klantportaal.", levertijd: LEVERTIJD.complex },
            ]}
          />
        </Sectie>

        <Sectie papier>
          <SectieKop
            titel="Wat bepaalt de prijs van een website?"
            intro="Drie factoren wegen het zwaarst mee bij de prijsvorming."
          />
          <Pijlers items={prijsFactoren.map((f) => ({ icon: f.icon, title: f.title, description: f.text }))} />
        </Sectie>

        <Sectie>
          <SectieKop titel="Vaste prijs of uurtarief: wat is slimmer?" />
          <Tekst>
            <p>
              Veel bureaus rekenen een uurtarief van 75 tot 150 euro en sturen daarna een offerte "indicatief". In de praktijk betekent dat: een bodemprijs bij de start en een rekening die meegroeit met elke e-mail die je verstuurt. Het gemiddelde MKB-project loopt op die manier vaak een paar honderd euro over de oorspronkelijke schatting heen.
            </p>
            <p>
              Met een vaste prijs leggen wij het risico in eigen hand. Als een project meer tijd kost dan we dachten, is dat ons probleem, niet dat van jou. Jij betaalt wat we zijn overeengekomen, ongeacht hoe lang wij erover doen.
            </p>
            <p>
              Het nadeel van een vaste prijs is dat je precies moet weten wat je wilt. Daarom nemen we bij elk project een uitgebreide kennismaking, zodat er geen discussie kan ontstaan over wat er wel en niet in zit.
            </p>
          </Tekst>
        </Sectie>

        <Sectie papier>
          <SectieKop
            titel="Kosten waar je op moet letten"
            intro="Los van de bouwkosten zijn er een paar vaste uitgaven die bij elk bureau spelen. Wij zetten ze gewoon op tafel."
          />
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {verborgenKosten.map((k, i) => (
              <Reveal key={k.kosten} afstand={24} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: RAND }}>
                  <dt className="text-lg font-bold tracking-tight sw-ink">{k.kosten}</dt>
                  <dd className="mt-2 text-[0.9375rem] font-semibold" style={{ color: GROEN }}>
                    {k.prijs}
                  </dd>
                  <dd className="mt-3 text-[0.9375rem] font-light leading-relaxed" style={{ color: INKT_65 }}>
                    {k.toelichting}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Sectie>

        <Sectie>
          <SectieKop titel="Wat zit er in elke prijs" />
          <Vinkjes
            items={[
              "Uniek design op maat, geen template of bouwpakket",
              "Alle teksten geschreven voor jouw doelgroep",
              "Technische SEO-basis: sitemap, robots, structured data, meta-tags",
              "Ons streven is een PageSpeed-score van 90 of hoger op mobiel.",
              "Basisonderhoud inbegrepen bij de hosting. Op aanvraag een eenvoudig CMS om zelf aan te passen.",
              "Google Analytics en Search Console koppeling",
            ]}
          />
          <p className="mt-10 max-w-3xl text-lg font-light leading-relaxed" style={{ color: INKT_65 }}>
            Terugverdienen doet zo'n website doorgaans in de aanvragen die je anders had gemist. Met {REVIEWS.aantalLabel} vijfsternreviews van ondernemers vóór jou weten we dat de investering zich vooral laat voelen in een vollere agenda, niet in je portemonnee.
          </p>
        </Sectie>

        <Sectie papier>
          <SectieKop titel="Veelgestelde vragen over de kosten van een website" />
          <Vragen items={faqItems.map((f) => ({ question: f.q, answer: f.a }))} />
        </Sectie>

        <ContactBlock h2="Wil je een prijs voor jouw project?" body="Vertel kort wat je zoekt. Binnen 24 uur krijg je een concrete prijs en oplevertermijn, zonder verplichtingen." />
      </main>
      <Footer />
    </div>
  );
};

export default WatKostEenWebsite;
