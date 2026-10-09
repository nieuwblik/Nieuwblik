import { PRIJZEN, PAKKETTEN, LEVERTIJD, euroTeken, HOSTING_PER_MAAND, euroMetCenten, HOSTING_ZIN } from "@/config/business";
import { SITE_URL } from "@/config/site";
import { Link } from "@/lib/router-compat";
import { CheckCircle2, ArrowRight, Calculator, Shield, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import { AnimatedButton } from "@/components/ui/animated-button";
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
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <Calculator className="w-4 h-4" /> Kosten gids 2026
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Wat kost een website laten maken in 2026?
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Het eerlijke antwoord: tussen de {euroTeken(PRIJZEN.starter)} en {euroTeken(PRIJZEN.professional)} voor de meeste MKB-bedrijven. In deze gids laten we precies zien wat je krijgt voor dat geld en welke kosten je moet verwachten.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <AnimatedButton to="/contact">Vraag een prijs op maat</AnimatedButton>
              <Link to="/prijzen" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors">
                Bekijk alle pakketten <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Snel antwoord */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Het korte antwoord</h2>
            <p className="text-muted-foreground mb-4">
              Een website laten maken kost bij een betrouwbaar Nederlands bureau in 2026 gemiddeld tussen de {euroTeken(PRIJZEN.starter)} en {euroTeken(PRIJZEN.professional)}. Onder de {euroTeken(500)} kom je alleen terecht bij bouwpakketten waar je zelf alles moet doen, of bij partijen die een template in tien minuten neerzetten en daarna verdwijnen.
            </p>
            <p className="text-muted-foreground mb-6">
              Boven de {euroTeken(5000)} betaal je meestal voor bureaus met grote kantoren, accountmanagers en overleglagen tussen jou en de maker. Soms terecht bij complexe trajecten, maar voor de meeste ondernemers is het gewoon geld dat niet in de site zit.
            </p>
            <p className="text-muted-foreground">
              Onze aanpak zit daar tussenin: vaste prijzen, geen tussenpersonen, en je spreekt rechtstreeks met degene die bouwt.
            </p>
          </div>
        </section>

        {/* Prijstabel */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Onze vaste prijzen in 2026</h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">Geen uurtarieven, geen verrassingen. Je krijgt een vaste prijs en een afgesproken opleverdatum.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: PAKKETTEN.starter.naam, price: euroTeken(PAKKETTEN.starter.prijs), desc: "One-pager of kleine site tot 5 pagina's. Ideaal voor ZZP-ers en starters die gevonden willen worden.", levertijd: LEVERTIJD.starter },
                { name: PAKKETTEN.professional.naam, price: euroTeken(PAKKETTEN.professional.prijs), desc: "Complete site tot 10 pagina's met blog, uitgebreide SEO en koppelingen met Google.", levertijd: LEVERTIJD.standaard, highlight: true },
                { name: PAKKETTEN.opMaat.naam, price: `vanaf ${euroTeken(PRIJZEN.webshopVanaf)}`, desc: "Uitgebreide site of webshop met integraties, meerdere talen of een klantportaal.", levertijd: LEVERTIJD.complex },
              ].map((p) => (
                <div key={p.name} className={`rounded-2xl p-6 border ${p.highlight ? "border-accent bg-background shadow-lg" : "border-border bg-background"}`}>
                  <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                  <div className="text-3xl font-bold mb-3">{p.price}</div>
                  <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent" /> Levertijd: {p.levertijd}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prijs bepalende factoren */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Wat bepaalt de prijs van een website?</h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">Drie factoren wegen het zwaarst mee bij de prijsvorming.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {prijsFactoren.map((f) => (
                <div key={f.title} className="bg-background border border-border rounded-2xl p-6">
                  <f.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Uurtarief vs vaste prijs */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Vaste prijs of uurtarief: wat is slimmer?</h2>
            <p className="text-muted-foreground mb-4">
              Veel bureaus rekenen een uurtarief van 75 tot 150 euro en sturen daarna een offerte "indicatief". In de praktijk betekent dat: een bodemprijs bij de start en een rekening die meegroeit met elke e-mail die je verstuurt. Het gemiddelde MKB-project loopt op die manier vaak een paar honderd euro over de oorspronkelijke schatting heen.
            </p>
            <p className="text-muted-foreground mb-4">
              Met een vaste prijs leggen wij het risico in eigen hand. Als een project meer tijd kost dan we dachten, is dat ons probleem, niet dat van jou. Jij betaalt wat we zijn overeengekomen, ongeacht hoe lang wij erover doen.
            </p>
            <p className="text-muted-foreground">
              Het nadeel van een vaste prijs is dat je precies moet weten wat je wilt. Daarom nemen we bij elk project een uitgebreide kennismaking, zodat er geen discussie kan ontstaan over wat er wel en niet in zit.
            </p>
          </div>
        </section>

        {/* Verborgen kosten */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Kosten waar je op moet letten</h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">Los van de bouwkosten zijn er een paar vaste uitgaven die bij elk bureau spelen. Wij zetten ze gewoon op tafel.</p>
            <div className="overflow-x-auto rounded-2xl border border-border bg-background">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 font-semibold">Post</th>
                    <th className="px-5 py-3 font-semibold">Kosten</th>
                    <th className="px-5 py-3 font-semibold">Toelichting</th>
                  </tr>
                </thead>
                <tbody>
                  {verborgenKosten.map((k) => (
                    <tr key={k.kosten} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium">{k.kosten}</td>
                      <td className="px-5 py-3 text-muted-foreground">{k.prijs}</td>
                      <td className="px-5 py-3 text-muted-foreground">{k.toelichting}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Wat krijg je voor je geld */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Wat zit er in elke prijs</h2>
            <ul className="space-y-3">
              {[
                "Uniek design op maat, geen template of bouwpakket",
                "Alle teksten geschreven voor jouw doelgroep",
                "Technische SEO-basis: sitemap, robots, structured data, meta-tags",
                "Ons streven is een PageSpeed-score van 90 of hoger op mobiel.",
                "Basisonderhoud inbegrepen bij de hosting. Op aanvraag een eenvoudig CMS om zelf aan te passen.",
                "Google Analytics en Search Console koppeling",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-8">
              Terugverdienen doet zo'n website doorgaans in de aanvragen die je anders had gemist. Met 19 vijfsternreviews van ondernemers vóór jou weten we dat de investering zich vooral laat voelen in een vollere agenda, niet in je portemonnee.
            </p>
          </div>
        </section>

        <LandingFaq h2="Veelgestelde vragen over de kosten van een website" items={faqItems} />
        <ContactBlock h2="Wil je een prijs voor jouw project?" body="Vertel kort wat je zoekt. Binnen 24 uur krijg je een concrete prijs en oplevertermijn, zonder verplichtingen." />
      </main>
      <Footer />
    </div>
  );
};

export default WatKostEenWebsite;
