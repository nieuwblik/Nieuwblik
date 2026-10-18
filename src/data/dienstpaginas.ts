import type { DienstpaginaData } from "@/pages/Dienstpagina";
import { PRIJZEN, LEVERTIJD, HOSTING_PER_MAAND, euroTeken, euroMetCenten } from "@/config/business";

const standaardPakketten = {
  titel: "Vaste prijzen, vooraf duidelijk",
  intro: "Geen uurtarief en geen verrassingen achteraf. Hosting met basisonderhoud is optioneel.",
  items: [
    { naam: "Starter", prijs: euroTeken(PRIJZEN.starter), omschrijving: "Kleine site tot 5 pagina's, snel live en goed vindbaar.", levertijd: LEVERTIJD.starter },
    { naam: "Professional", prijs: euroTeken(PRIJZEN.professional), omschrijving: "Complete site tot 10 pagina's met blog en uitgebreide SEO.", levertijd: LEVERTIJD.standaard, uitgelicht: true },
    { naam: "Webshop", prijs: `vanaf ${euroTeken(PRIJZEN.webshopVanaf)}`, omschrijving: "Verkopen met Stripe, producten en betalingen netjes ingericht.", levertijd: LEVERTIJD.complex },
  ],
};

export const installateur: DienstpaginaData = {
  slug: "website-laten-maken-installateur",
  title: `Website laten maken als installateur vanaf €${PRIJZEN.starter} | Nieuwblik`,
  description: `Website voor installateurs: meer offerteaanvragen voor cv, warmtepompen en zonnepanelen. Vanaf €${PRIJZEN.starter}, binnen ${LEVERTIJD.standaard} live.`,
  keywords: "website laten maken installateur, website installatiebedrijf, website installateur, webdesign installateur, website warmtepomp installateur",
  dienst: "Website laten maken installateur",
  titel: "Een website voor installateurs die",
  accent: "offertes oplevert",
  intro: "Klanten zoeken op 'warmtepomp laten installeren' of 'cv-ketel vervangen' in hun eigen plaats. Wij bouwen een snelle site die jouw installatiebedrijf daar laat zien en bezoekers direct een offerte laat aanvragen.",
  secties: [
    {
      titel: "Wat een installateur nodig heeft op zijn website",
      vinkjes: [
        "Een pagina per dienst: cv, warmtepomp, airco, zonnepanelen, loodgieterswerk",
        "Offerteformulier met foto-upload, zodat je vooraf weet wat er speelt",
        "Een duidelijke spoedknop met je telefoonnummer, ook op mobiel",
        "Werkgebied per plaats, zodat je lokaal gevonden wordt",
        "Certificeringen en keurmerken goed in beeld",
        "Reviews van klanten uit je eigen regio",
      ],
    },
    {
      titel: "Waarom veel installateurs aanvragen mislopen",
      alineas: [
        "De meeste installateurs hebben het druk genoeg, maar krijgen vooral kleine klussen binnen. De grote opdrachten, zoals een warmtepomp of een complete badkamer, gaan naar het bedrijf dat online het meest betrouwbaar overkomt.",
        "Een verouderde site, geen prijsindicatie en geen projectfoto's zorgen ervoor dat klanten doorklikken. Wij zorgen dat jij degene bent die ze bellen.",
      ],
    },
  ],
  pakketten: standaardPakketten,
  faq: [
    { q: "Wat kost een website voor een installateur?", a: `Een kleine site start bij ${euroTeken(PRIJZEN.starter)}, een complete site met pagina's per dienst en per plaats bij ${euroTeken(PRIJZEN.professional)}. Je krijgt vooraf een vaste prijs.` },
    { q: "Hoe snel staat mijn site online?", a: `Een Starter-site staat binnen ${LEVERTIJD.starter} live, een complete site binnen ${LEVERTIJD.standaard}.` },
    { q: "Kunnen klanten foto's meesturen bij een offerte?", a: "Ja. Het offerteformulier ondersteunt foto's, zodat je de situatie al ziet voordat je langsgaat." },
    { q: "Word ik gevonden in mijn eigen regio?", a: "Daar richten we de site op in. We maken pagina's per dienst en werkgebied en helpen met je Google Bedrijfsprofiel." },
  ],
  links: [
    { label: "Website voor elektriciens", to: "/website-laten-maken-elektricien" },
    { label: "Website voor loodgieters", to: "/website-laten-maken-loodgieter" },
    { label: "Website voor bouwbedrijven", to: "/website-laten-maken-bouwbedrijf" },
    { label: "Wat kost een website", to: "/wat-kost-een-website" },
  ],
  contact: { h2: "Meer offerteaanvragen voor jouw installatiebedrijf?", body: "Vertel kort wat je doet en waar je werkt. Binnen 24 uur krijg je een vaste prijs en planning." },
  prijsVanaf: PRIJZEN.starter,
};

export const wordpress: DienstpaginaData = {
  slug: "overstappen-van-wordpress",
  title: "Overstappen van WordPress naar een snelle site | Nieuwblik",
  description: `WordPress traag, onveilig of duur in onderhoud? Wij zetten je site over naar snel maatwerk, zonder verlies in Google. Vanaf €${PRIJZEN.starter}.`,
  keywords: "overstappen van wordpress, wordpress website laten maken, wordpress onderhoud, wordpress traag, wordpress alternatief, wordpress specialist",
  dienst: "Overstappen van WordPress",
  titel: "Klaar met WordPress?",
  accent: "Stap over zonder gedoe",
  intro: "Plugins die elke week een update willen, een trage site en een hosting die steeds duurder wordt. Wij bouwen je site opnieuw op als snel maatwerk en zetten alles over, inclusief je posities in Google.",
  secties: [
    {
      titel: "Herken je dit?",
      vinkjes: [
        "Je site laadt traag, vooral op mobiel",
        "Na een update ligt er ineens iets plat",
        "Je betaalt voor plugins en thema's die je niet begrijpt",
        "Je bent bang dat je site gehackt wordt",
        "Je durft zelf niets meer aan te passen",
        "Je PageSpeed-score blijft rood",
      ],
    },
    {
      titel: "Hoe de overstap werkt",
      alineas: [
        "We beginnen met een gratis analyse van je huidige WordPress-site: welke pagina's scoren in Google en wat moet er mee.",
        "Daarna bouwen we je nieuwe site, nemen we teksten en afbeeldingen over en zetten we voor elke oude pagina een doorverwijzing. Zo behoud je je vindbaarheid.",
        `Na de livegang regelen wij hosting en onderhoud vanaf ${euroMetCenten(HOSTING_PER_MAAND)} per maand. Geen plugins meer om bij te houden.`,
      ],
    },
  ],
  pakketten: standaardPakketten,
  faq: [
    { q: "Verlies ik mijn posities in Google bij een overstap?", a: "Niet als het goed gebeurt. We nemen je bestaande teksten mee en zetten voor elke oude pagina een permanente doorverwijzing." },
    { q: "Bouwen jullie ook nieuwe WordPress-sites?", a: "Nee, wij bouwen snel maatwerk. Daardoor heb je geen plugins, minder onderhoud en een site die veel sneller laadt." },
    { q: "Kan ik daarna nog zelf teksten aanpassen?", a: "Ja, op aanvraag krijg je een eenvoudig beheersysteem. Of je stuurt een berichtje en wij passen het aan." },
    { q: "Wat kost overstappen van WordPress?", a: `Dat hangt af van het aantal pagina's. Een kleine site start bij ${euroTeken(PRIJZEN.starter)}, een complete site bij ${euroTeken(PRIJZEN.professional)}.` },
  ],
  links: [
    { label: "Waarom je WordPress-site traag is", to: "/blog/waarom-wordpress-website-traag-is" },
    { label: "Website vernieuwen", to: "/blog/website-vernieuwen-wanneer-tijd-voor-redesign" },
    { label: "Website op maat", to: "/diensten/website-op-maat" },
    { label: "Wat kost een website", to: "/wat-kost-een-website" },
  ],
  contact: { h2: "Wil je weten wat overstappen jou oplevert?", body: "Vraag een gratis analyse aan van je WordPress-site. Je ziet direct wat sneller en beter kan." },
  prijsVanaf: PRIJZEN.starter,
};

const webshopVragen = (platform: string) => [
  { q: `Is ${platform} geschikt voor mijn webshop?`, a: `${platform} werkt prima voor veel winkels. Of het de beste keuze is, hangt af van je aantal producten, je budget en hoeveel je zelf wilt beheren. We helpen je eerlijk kiezen.` },
  { q: "Wat kost een webshop bij Nieuwblik?", a: `Een webshop op maat start bij ${euroTeken(PRIJZEN.webshopVanaf)}, inclusief betalingen via Stripe. Je betaalt geen maandelijkse platformkosten of transactietoeslag aan ons.` },
  { q: "Hoe lang duurt het bouwen van een webshop?", a: `Reken op ${LEVERTIJD.complex}, afhankelijk van het aantal producten en koppelingen.` },
  { q: "Regelen jullie ook verzending en voorraad?", a: "Wij bouwen de webshop, de productpagina's en de betalingen. De verkoop, verzending en voorraad doe je zelf. We leggen alles helder uit bij de oplevering." },
];

export const shopify: DienstpaginaData = {
  slug: "shopify-webshop-laten-maken",
  title: "Shopify webshop laten maken of liever maatwerk? | Nieuwblik",
  description: `Shopify webshop laten maken? Vergelijk maandkosten, transactiekosten en vrijheid met een webshop op maat. Maatwerk vanaf €${PRIJZEN.webshopVanaf}.`,
  keywords: "shopify webshop laten maken, shopify laten bouwen, shopify specialist, shopify of maatwerk, shopify kosten",
  dienst: "Shopify webshop laten maken",
  titel: "Shopify webshop laten maken,",
  accent: "of slimmer kiezen?",
  intro: "Shopify is snel opgezet, maar je betaalt elke maand voor het abonnement en voor apps. Wij zetten de keuze eerlijk op een rij en bouwen, als dat beter past, een snelle webshop op maat met Stripe.",
  secties: [
    {
      titel: "Shopify in het kort",
      vinkjes: [
        "Snel een winkel online, veel kant-en-klare thema's",
        "Vast abonnement per maand, plus kosten voor apps",
        "Extra transactiekosten als je niet hun eigen betaaloplossing gebruikt",
        "Je site en data staan op het platform van Shopify",
      ],
    },
    {
      titel: "Wanneer maatwerk beter is",
      alineas: [
        "Heb je een overzichtelijk assortiment en wil je een unieke uitstraling, snelle laadtijden en geen maandelijkse platformkosten? Dan is een webshop op maat vaak goedkoper op de lange termijn.",
        "Betalingen lopen via Stripe met iDEAL, creditcard en Apple Pay. Je betaalt alleen de transactiekosten van Stripe zelf.",
      ],
    },
  ],
  pakketten: standaardPakketten,
  faq: webshopVragen("Shopify"),
  links: [
    { label: "WooCommerce webshop", to: "/woocommerce-webshop-laten-maken" },
    { label: "Webshops", to: "/diensten/webshops" },
    { label: "E-commerce", to: "/diensten/e-commerce" },
    { label: "Wat kost een website", to: "/wat-kost-een-website" },
  ],
  contact: { h2: "Twijfel je tussen Shopify en maatwerk?", body: "Vertel wat je wilt verkopen. We geven eerlijk advies en een vaste prijs, zonder verplichtingen." },
  prijsVanaf: PRIJZEN.webshopVanaf,
};

export const woocommerce: DienstpaginaData = {
  slug: "woocommerce-webshop-laten-maken",
  title: "WooCommerce webshop laten maken of maatwerk? | Nieuwblik",
  description: `WooCommerce webshop laten maken? Vergelijk onderhoud, snelheid en kosten met een webshop op maat met Stripe. Maatwerk vanaf €${PRIJZEN.webshopVanaf}.`,
  keywords: "woocommerce webshop laten maken, woocommerce laten bouwen, woocommerce specialist, woocommerce of shopify, woocommerce traag",
  dienst: "WooCommerce webshop laten maken",
  titel: "WooCommerce webshop laten maken,",
  accent: "of sneller verkopen?",
  intro: "WooCommerce draait op WordPress. Dat geeft veel vrijheid, maar ook veel plugins, updates en een webshop die snel traag wordt. Wij laten zien wanneer een webshop op maat de betere keuze is.",
  secties: [
    {
      titel: "WooCommerce in het kort",
      vinkjes: [
        "Gratis plugin, maar betaalde uitbreidingen tellen snel op",
        "Hosting en beveiliging regel je zelf",
        "Elke update kan iets breken in je winkel",
        "Bij veel producten wordt de shop vaak traag",
      ],
    },
    {
      titel: "Waarom ondernemers overstappen naar maatwerk",
      alineas: [
        "Een trage webshop kost omzet. Bezoekers haken af als een productpagina niet binnen een paar seconden laadt.",
        `Wij bouwen een snelle webshop met betalingen via Stripe en regelen hosting en basisonderhoud vanaf ${euroMetCenten(HOSTING_PER_MAAND)} per maand. Geen plugins om bij te houden.`,
      ],
    },
  ],
  pakketten: standaardPakketten,
  faq: webshopVragen("WooCommerce"),
  links: [
    { label: "Shopify webshop", to: "/shopify-webshop-laten-maken" },
    { label: "Overstappen van WordPress", to: "/overstappen-van-wordpress" },
    { label: "Webshops", to: "/diensten/webshops" },
    { label: "Wat kost een website", to: "/wat-kost-een-website" },
  ],
  contact: { h2: "Wil je een snellere webshop?", body: "Vraag een gratis analyse aan van je huidige winkel, of vertel wat je wilt gaan verkopen." },
  prijsVanaf: PRIJZEN.webshopVanaf,
};
