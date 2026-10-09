import { PRIJZEN, PAKKETTEN, LEVERTIJD, HOSTING_ZIN } from "@/config/business";
import { SITE_URL } from "@/config/site";
import { Link } from "@/lib/router-compat";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContactBlock from "@/components/ContactBlock";
import { AnimatedButton } from "@/components/ui/animated-button";
import { DienstHero, INKT_65, Linkjes, Pakketten, Sectie, SectieKop, Stappen, Tekst, Vinkjes, Vragen } from "@/components/dienst/DienstBlokken";
import { companyInfo } from "@/config/company";
import { industryLinks } from "@/data/industryLinks";

const url = `${SITE_URL}/website-laten-maken`;

const faqItems = [
  { q: "Wat kost een website laten maken in 2026?", a: `Een professionele website op maat bij Nieuwblik begint bij ${PRIJZEN.starter} euro. Voor sites met meer pagina's, integraties of een webshop ligt de prijs tussen ${PRIJZEN.uitgebreidVan} en ${PRIJZEN.uitgebreidTot} euro. Alles vooraf transparant, geen verrassingen achteraf.` },
  { q: "Hoe lang duurt het om een website te bouwen?", a: `Een standaard MKB-website leveren we binnen ${LEVERTIJD.standaard} op. Grotere projecten met veel content of een webshop duren ${LEVERTIJD.complex}. We werken met korte lijnen zodat er geen tijd verloren gaat aan wachten op feedback.` },
  { q: "WordPress, Webflow of maatwerk, wat kies ik?", a: "Voor de meeste MKB-sites bouwen we maatwerk met React. Zo'n site laadt snel en heeft geen plugins die bijgewerkt moeten worden. Bouwen in WordPress kan ook, als dat beter bij je past." },
  { q: "Krijg ik de eigendom van mijn website?", a: "Je krijgt het gebruiksrecht op je website: ontwerp, teksten en afbeeldingen. De intellectuele eigendom blijft volgens onze algemene voorwaarden bij Nieuwblik. Wil je naar een andere partij, dan werken we mee aan de overdracht." },
  { q: "Doen jullie ook onderhoud en hosting?", a: `Ja. ${HOSTING_ZIN} Daarin zitten back-ups en updates. Er is geen apart onderhoudscontract.` },
  { q: "Kan ik zelf teksten en foto's aanpassen na oplevering?", a: "Ja, op aanvraag. Standaard verzorgen wij het beheer van je website. Wil je zelf blogs, projecten, teksten en afbeeldingen beheren, dan bouwen we daar een eenvoudig CMS voor, met een aparte offerte. Zonder technische kennis te gebruiken." },
  { q: "Hoe zit het met SEO?", a: "Elke site die wij bouwen is technisch SEO-ready: snelle laadtijden, correcte structured data, meta-tags per pagina, sitemap en robots.txt. Voor doorlopende content-SEO bieden we losse pakketten aan." },
  { q: "Werken jullie in heel Nederland?", a: "Ja. Wij zitten in Enkhuizen maar bouwen sites voor MKB door heel Nederland, van Groningen tot Maastricht. Meestal volledig op afstand, voor grotere trajecten komen we langs." },
];

const proces = [
  { title: "1. Kennismaking", text: "Videocall van 30 minuten. We bespreken jouw doel, doelgroep en concurrenten. Daarna sturen we een concrete offerte." },
  { title: "2. Strategie & content", text: "We onderzoeken zoekwoorden, schrijven de teksten en maken het design. Jij ziet elke stap en geeft feedback." },
  { title: "3. Bouw", text: "Onze developers zetten de site in elkaar in React. Snel, veilig en volledig responsive. Twee weken later staat er een testomgeving." },
  { title: "4. Livegang", text: "Na akkoord zetten we de site live, koppelen we Google Analytics en Search Console en overhandigen we de instructies." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "Website laten maken | Kosten, proces en voorbeelden - Nieuwblik",
      description: `Website laten maken vanaf ${PRIJZEN.starter} euro. Wij bouwen conversiegerichte sites op maat voor MKB. Snel, transparant, met sterke SEO en persoonlijk contact.`,
      url,
      inLanguage: "nl-NL",
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

const WebsiteLatenMaken = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Website laten maken vanaf ${PRIJZEN.starter} euro | Nieuwblik`}
        description={`Website laten maken door een lokaal Nederlands bureau. Snel, betaalbaar, sterk in SEO. Vanaf ${PRIJZEN.starter} euro. Bekijk kosten, proces en voorbeelden.`}
        keywords="website laten maken, website bouwen, webdesign, website op maat, professionele website"
        canonicalUrl={url}
        structuredData={jsonLd}
        includeLocalBusinessSchema={true}
        breadcrumbs={[
          { name: "Home", url: companyInfo.url },
          { name: "Website laten maken", url },
        ]}
      />

      <main>
        <DienstHero
          kruimels={[{ label: "Website laten maken", path: "/website-laten-maken" }]}
          titel="Website laten maken"
          accent="die klanten oplevert"
          intro={
            <>
              Snel, betaalbaar en sterk in SEO. Wij bouwen conversiegerichte websites voor MKB door heel Nederland. Vanaf {PRIJZEN.starter} euro, transparant en zonder verrassingen.
            </>
          }
          knop={{ label: "Vraag offerte aan", to: "/contact" }}
          tweedeKnop={{ label: "Bekijk portfolio", to: "/portfolio" }}
        />

        <Sectie papier>
          <SectieKop titel="Wat maakt een website een goede investering" />
          <Tekst>
            <p>
              De meeste websites worden gebouwd zoals folders vroeger werden gedrukt: eenmalig, mooi gepolijst en daarna vergeten. Dat werkt niet meer. Een goede website in 2026 is een systeem dat blijft werken voor je bedrijf: aantrekkelijk voor bezoekers, snel voor Google en simpel voor jou om aan te passen.
            </p>
            <p>
              Wat wij zien bij de sterkste sites van onze klanten: ze laden binnen een seconde, ze staan bovenaan Google op de zoektermen die er toe doen, en ze zetten bezoekers om in aanvragen zonder pop-ups of trucjes. Dat is geen toeval, dat is een keuze in hoe je bouwt.
            </p>
            <p>
              Wij bouwen sites in React met een schone codebase, WebP-afbeeldingen, correcte structured data en aandacht voor micro-interacties. Het resultaat is een site die niet alleen bij oplevering goed voelt, maar ook drie jaar later nog snel en stabiel is.
            </p>
          </Tekst>
        </Sectie>

        <Sectie>
          <SectieKop titel="Zo werken wij" />
          <Stappen items={proces.map((s) => ({ title: s.title, description: s.text }))} />
        </Sectie>

        <Sectie papier>
          <SectieKop
            titel="Wat kost een website in 2026"
            intro="Drie duidelijke pakketten. Geen verborgen kosten, geen vage uurtarieven. Je weet vooraf wat je krijgt en wat je betaalt."
          />
          <Pakketten
            items={[
              { naam: PAKKETTEN.starter.naam, prijs: `€${PAKKETTEN.starter.prijs}`, omschrijving: "One-pager of kleine site tot 5 pagina's. Ideaal voor ZZP en starters." },
              { naam: PAKKETTEN.professional.naam, prijs: `€${PAKKETTEN.professional.prijs}`, omschrijving: "Complete site tot 10 pagina's, met blog en uitgebreide SEO.", uitgelicht: true },
              { naam: PAKKETTEN.opMaat.naam, prijs: "Op aanvraag", omschrijving: "Uitgebreide site of webshop, met integraties en meerdere talen." },
            ]}
          />
          <div className="mt-10">
            <AnimatedButton to="/prijzen" variant="outline">
              Bekijk alle pakketten
            </AnimatedButton>
          </div>
        </Sectie>

        <Sectie>
          <SectieKop titel="Wat zit er in elk project" />
          <Vinkjes
            items={[
              "Uniek design op maat, geen template",
              "Volledig responsive voor mobiel, tablet en desktop",
              "Technische SEO-basis: sitemap, robots, structured data, meta-tags",
              "Ons streven is een PageSpeed-score van 90 of hoger op mobiel.",
              "Basisonderhoud inbegrepen bij de hosting. Op aanvraag een eenvoudig CMS om zelf aan te passen.",
              "WhatsApp, contactformulier en Google Maps integratie",
              "Google Analytics en Search Console koppeling",
            ]}
          />
        </Sectie>

        {/* Alle branchepagina's: de footer linkt hiernaartoe (#branches). */}
        <section id="branches" className="sw-paper scroll-mt-24 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <SectieKop titel="Voor welke ondernemers werken wij" />
            <Linkjes
              items={[...industryLinks, { name: "Taxi", slug: "taxi" }].map((b) => ({
                label: b.name,
                to: b.slug === "taxi" ? "/taxi-website-laten-maken" : `/website-laten-maken-${b.slug}`,
              }))}
            />
          </div>
        </section>

        <Sectie>
          <SectieKop titel="Actief in heel Nederland" intro="Kies jouw regio voor lokale voorbeelden en zoektermen." />
          <Linkjes
            items={[
              { label: "Noord-Holland", to: "/regio/noord-holland" },
              { label: "Randstad", to: "/regio/randstad" },
              { label: "Oost-Nederland", to: "/regio/oost-nederland" },
              { label: "Zuid-Nederland", to: "/regio/zuid-nederland" },
              { label: "Noord-Nederland", to: "/regio/noord-nederland" },
            ]}
          />
          <p className="mt-10 max-w-3xl text-lg font-light leading-relaxed" style={{ color: INKT_65 }}>
            Dicht bij ons kantoor in Enkhuizen? Lees over{" "}
            <Link to="/website-laten-maken-alkmaar" className="text-accent hover:underline font-semibold">website laten maken in Alkmaar</Link>,{" "}
            <Link to="/werkgebied/hoorn" className="text-accent hover:underline font-semibold">een website voor je bedrijf in Hoorn</Link> of{" "}
            <Link to="/website-laten-maken-heerhugowaard" className="text-accent hover:underline font-semibold">webdesign in Heerhugowaard</Link>.
          </p>
        </Sectie>

        <Sectie papier>
          <SectieKop titel="Veelgestelde vragen over een website laten maken" />
          <Vragen items={faqItems.map((f) => ({ question: f.q, answer: f.a }))} />
        </Sectie>

        <ContactBlock h2="Klaar om te starten?" body="Vertel over jouw project. Binnen 24 uur een reactie met een concrete offerte." />
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLatenMaken;
