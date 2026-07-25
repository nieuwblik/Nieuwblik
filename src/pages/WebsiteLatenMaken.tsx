import { Link } from "react-router-dom";
import { CheckCircle2, Zap, Search, Users, Rocket, Shield, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LandingFaq from "@/components/LandingFaq";
import ContactBlock from "@/components/ContactBlock";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";

const url = "https://www.nieuwblik.com/website-laten-maken";

const faqItems = [
  { q: "Wat kost een website laten maken in 2026?", a: "Een professionele website op maat bij Nieuwblik begint bij 990 euro. Voor sites met meer pagina's, integraties of een webshop ligt de prijs tussen 1990 en 4000 euro. Alles vooraf transparant, geen verrassingen achteraf." },
  { q: "Hoe lang duurt het om een website te bouwen?", a: "Een standaard MKB-website leveren we binnen twee tot vier weken op. Grotere projecten met veel content of een webshop duren vier tot acht weken. We werken met korte lijnen zodat er geen tijd verloren gaat aan wachten op feedback." },
  { q: "WordPress, Webflow of maatwerk, wat kies ik?", a: "Voor de meeste MKB-sites bouwen we maatwerk in React. Dat geeft betere PageSpeed-scores, veiligere sites zonder plugin-updates en een schonere basis voor SEO. WordPress kan nog, maar we adviseren het steeds minder vaak." },
  { q: "Krijg ik de eigendom van mijn website?", a: "Ja. Alle code, teksten en afbeeldingen zijn na oplevering van jou. Geen vendor lock-in. Je kunt de site altijd meenemen naar een andere partij als dat ooit nodig is." },
  { q: "Doen jullie ook onderhoud en hosting?", a: "Ja. We bieden hosting op snelle servers vanaf 25 euro per maand en onderhoudscontracten voor updates, back-ups en kleine aanpassingen. Optioneel, je bent nergens aan verplicht." },
  { q: "Kan ik zelf teksten en foto's aanpassen na oplevering?", a: "Ja. We bouwen een eenvoudig CMS in waar je zelf blogs, projecten, teksten en afbeeldingen kunt beheren. Zonder technische kennis." },
  { q: "Hoe zit het met SEO?", a: "Elke site die wij bouwen is technisch SEO-ready: snelle laadtijden, correcte structured data, meta-tags per pagina, sitemap en robots.txt. Voor doorlopende content-SEO bieden we losse pakketten aan." },
  { q: "Werken jullie in heel Nederland?", a: "Ja. Wij zitten in Enkhuizen maar bouwen sites voor MKB door heel Nederland, van Groningen tot Maastricht. Meestal volledig op afstand, voor grotere trajecten komen we langs." },
];

const process = [
  { icon: Users, title: "1. Kennismaking", text: "Videocall van 30 minuten. We bespreken jouw doel, doelgroep en concurrenten. Daarna sturen we een concrete offerte." },
  { icon: Search, title: "2. Strategie & content", text: "We onderzoeken zoekwoorden, schrijven de teksten en maken het design. Jij ziet elke stap en geeft feedback." },
  { icon: Rocket, title: "3. Bouw", text: "Onze developers zetten de site in elkaar in React. Snel, veilig en volledig responsive. Twee weken later staat er een testomgeving." },
  { icon: Zap, title: "4. Livegang", text: "Na akkoord zetten we de site live, koppelen we Google Analytics en Search Console en overhandigen we de instructies." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "Website laten maken | Kosten, proces en voorbeelden - Nieuwblik",
      description: "Website laten maken vanaf 990 euro. Wij bouwen conversiegerichte sites op maat voor MKB. Snel, transparant, met sterke SEO en persoonlijk contact.",
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
      offers: { "@type": "Offer", price: "990", priceCurrency: "EUR", availability: "https://schema.org/InStock", url },
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
        title="Website laten maken vanaf 990 euro | Nieuwblik"
        description="Website laten maken door een lokaal Nederlands bureau. Snel, betaalbaar, sterk in SEO. Vanaf 990 euro. Bekijk kosten, proces en voorbeelden."
        keywords="website laten maken, website bouwen, webdesign, website op maat, professionele website"
        canonicalUrl={url}
        structuredData={jsonLd}
        includeLocalBusinessSchema={true}
      />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <Rocket className="w-4 h-4" /> Complete gids
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Website laten maken die klanten oplevert
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Snel, betaalbaar en sterk in SEO. Wij bouwen conversiegerichte websites voor MKB door heel Nederland. Vanaf 990 euro, transparant en zonder verrassingen.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <AnimatedButton to="/contact">Vraag offerte aan</AnimatedButton>
              <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors">
                Bekijk portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Wat is een goede website */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Wat maakt een website een goede investering</h2>
            <p className="text-muted-foreground mb-4">
              De meeste websites worden gebouwd zoals folders vroeger werden gedrukt: eenmalig, mooi gepolijst en daarna vergeten. Dat werkt niet meer. Een goede website in 2026 is een systeem dat blijft werken voor je bedrijf: aantrekkelijk voor bezoekers, snel voor Google en simpel voor jou om aan te passen.
            </p>
            <p className="text-muted-foreground mb-4">
              Wat wij zien bij de sterkste sites van onze klanten: ze laden binnen een seconde, ze staan bovenaan Google op de zoektermen die er toe doen, en ze zetten bezoekers om in aanvragen zonder pop-ups of trucjes. Dat is geen toeval, dat is een keuze in hoe je bouwt.
            </p>
            <p className="text-muted-foreground">
              Wij bouwen sites in React met een schone codebase, WebP-afbeeldingen, correcte structured data en aandacht voor micro-interacties. Het resultaat is een site die niet alleen bij oplevering goed voelt, maar ook drie jaar later nog snel en stabiel is.
            </p>
          </div>
        </section>

        {/* Proces */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Zo werken wij</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((s) => (
                <div key={s.title} className="bg-background border border-border rounded-2xl p-6">
                  <s.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prijzen */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Wat kost een website in 2026</h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">Drie duidelijke pakketten. Geen verborgen kosten, geen vage uurtarieven. Je weet vooraf wat je krijgt en wat je betaalt.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Starter", price: "990", desc: "One-pager of kleine site tot 5 pagina's. Ideaal voor ZZP en starters." },
                { name: "Professional", price: "1990", desc: "Complete site tot 10 pagina's, met CMS en sterke SEO-basis.", highlight: true },
                { name: "Premium", price: "2990+", desc: "Uitgebreide site of webshop, met integraties en meerdere talen." },
              ].map((p) => (
                <div key={p.name} className={`rounded-2xl p-6 border ${p.highlight ? "border-accent bg-background shadow-lg" : "border-border bg-background"}`}>
                  <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                  <div className="text-3xl font-bold mb-3">€{p.price}</div>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wat je krijgt */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Wat zit er in elk project</h2>
            <ul className="space-y-3">
              {[
                "Uniek design op maat, geen template",
                "Volledig responsive voor mobiel, tablet en desktop",
                "Technische SEO-basis: sitemap, robots, structured data, meta-tags",
                "PageSpeed score van 90+ op mobiel",
                "Eenvoudig CMS om zelf teksten en afbeeldingen aan te passen",
                "WhatsApp, contactformulier en Google Maps integratie",
                "Google Analytics en Search Console koppeling",
                "1 jaar kosteloos kleine aanpassingen na livegang",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Voor wie */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Voor welke ondernemers werken wij</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Kappers", slug: "kapper" },
                { name: "Restaurants & horeca", slug: "restaurant" },
                { name: "Bouw & installatie", slug: "bouwbedrijf" },
                { name: "Fysiotherapie & zorg", slug: "fysiotherapie" },
                { name: "Advocaten", slug: "advocaat" },
                { name: "Fotografen", slug: "fotograaf" },
              ].map((b) => (
                <Link key={b.slug} to={`/website-laten-maken-${b.slug}`} className="bg-background border border-border rounded-xl p-4 hover:border-accent transition-colors flex items-center justify-between">
                  <span className="font-medium">{b.name}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Regio's */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Actief in heel Nederland</h2>
            <p className="text-muted-foreground mb-8">Kies jouw regio voor lokale voorbeelden en zoektermen.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { name: "Noord-Holland", slug: "noord-holland" },
                { name: "Randstad", slug: "randstad" },
                { name: "Oost-Nederland", slug: "oost-nederland" },
                { name: "Zuid-Nederland", slug: "zuid-nederland" },
              ].map((r) => (
                <Link key={r.slug} to={`/regio/${r.slug}`} className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors">
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <LandingFaq h2="Veelgestelde vragen over een website laten maken" items={faqItems} />
        <ContactBlock h2="Klaar om te starten?" body="Vertel over jouw project. Binnen 24 uur een reactie met een concrete offerte." />
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLatenMaken;
