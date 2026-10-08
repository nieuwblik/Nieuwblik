import { LEVERTIJD, PRIJZEN, euroTeken } from "@/config/business";
import type { LokaleUitbreiding } from "@/data/lokaleInhoud";

/**
 * Handgeschreven, unieke inhoud per werkgebiedpagina (/werkgebied/{slug}).
 * Zonder dit bestand heeft elke plaats dezelfde opbouw met een andere naam;
 * staat een plaats hier, dan komen er een lokaal tekstblok en eigen vragen bij
 * (met FAQPage-markering).
 *
 * Zelfde regels als src/data/cityLokaal.ts: alleen controleerbare feiten, geen
 * verzonnen klanten of cijfers, en [tekst](/pad) voor een interne link.
 */
const STARTER = euroTeken(PRIJZEN.starter);
const PROFESSIONAL = euroTeken(PRIJZEN.professional);
const WEBSHOP = euroTeken(PRIJZEN.webshopVanaf);

export interface WerkgebiedLokaal extends LokaleUitbreiding {
  lokaal: { h2: string; alineas: string[] };
  faq: { q: string; a: string }[];
}

export const werkgebiedLokaal: Record<string, WerkgebiedLokaal> = {
  enkhuizen: {
    lokaal: {
      h2: "Website laten maken in Enkhuizen, door een bureau uit Enkhuizen",
      alineas: [
        "Nieuwblik zit zelf in Enkhuizen, op bedrijventerrein De Trompet. Onderneem je hier, dan heb je een webbureau om de hoek: je spreekt de mensen die je site ontwerpen en bouwen, zonder accountmanager ertussen, en we kennen de stad en de klanten die je wilt bereiken.",
        "Enkhuizen heeft twee gezichten. De historische binnenstad, de havens en het Zuiderzeemuseum trekken veel bezoekers, vooral in het seizoen. Voor winkels, horeca, verhuur en watersportbedrijven betekent dat: gevonden worden op de telefoon, meteen laten zien wanneer je open bent en in één tik laten bellen, reserveren of boeken. Daarnaast is Enkhuizen een centrum van de zaadveredeling en zitten hier veel technische en zakelijke dienstverleners. Voor hen moet een website vooral vertrouwen wekken en aanvragen opleveren.",
        "Voor ondernemers en clubs in Enkhuizen bouwden we onder meer de clubwebsite van [volleybalvereniging Madjoe](/portfolio/vv-madjoe) en de webshop van [Een Bundel Geluk](/portfolio/een-bundel-geluk). Elke site maken we snel, mobiel eerst en vindbaar: in Google, maar ook in AI-zoekmachines als ChatGPT. Wil je vooral hoger in de lokale zoekresultaten, bekijk dan ook onze aanpak voor [SEO in Enkhuizen](/seo-enkhuizen).",
      ],
    },
    faq: [
      {
        q: "Werken jullie ook voor kleine ondernemers in Enkhuizen?",
        a: `Ja. Of je nu zzp'er bent, een winkel in de binnenstad hebt of een bedrijf op een bedrijventerrein: het startpakket begint bij €${PRIJZEN.starter} en je weet vooraf precies wat je krijgt.`,
      },
      {
        q: "Mijn bedrijf draait op toeristen in het seizoen. Waar moet mijn site op letten?",
        a: "Op mobiel. Bezoekers zoeken onderweg en willen meteen openingstijden, route en een knop om te bellen of te reserveren. Prijzen en openingstijden moeten snel aan te passen zijn als het seizoen verandert. Een Engelse of Duitse versie is mogelijk als optionele uitbreiding.",
      },
      {
        q: "Hoe word ik beter gevonden in Enkhuizen en West-Friesland?",
        a: "Met een technisch goede site, een eigen pagina per dienst, een volledig ingevuld Google Bedrijfsprofiel en reviews van klanten. Dat zetten we vanaf het begin goed neer; wie meer wil, kan het combineren met onze lokale SEO-aanpak.",
      },
      {
        q: "Hoe snel staat mijn website online?",
        a: `Meestal binnen ${LEVERTIJD.standaard} na de kennismaking, afhankelijk van hoe snel teksten en foto's klaar zijn.`,
      },
    ],
  },
  hoorn: {
    eigenOpbouw: true,
    intro: `Een website laten maken in Hoorn, met vooraf een vaste prijs en contact met de mensen die hem bouwen. Een Starter-site kost ${STARTER} en staat meestal binnen ${LEVERTIJD.starter} online.`,
    cases: ["taxi-drechterland", "aardingsbedrijf-west-friesland", "een-bundel-geluk", "vv-madjoe"],
    lokaal: {
      h2: "Website laten maken in Hoorn",
      alineas: [
        "Nieuwblik bouwt websites en webshops voor ondernemers in Hoorn en de rest van West-Friesland. We werken vanuit Enkhuizen, dus Hoorn is voor ons geen werkgebied op afstand maar de regio waar we zelf ondernemen. Van het eerste gesprek tot ruim na de livegang heb je hetzelfde aanspreekpunt: de mensen die je site ontwerpen en bouwen.",
        "We beginnen niet met een ontwerp, maar met de vraag wat je website moet opleveren. Een installateur wil offerteaanvragen, een winkel bezoekers die binnenlopen en een adviseur telefoontjes van de juiste klanten. Pas als dat duidelijk is, kiezen we welke pagina's er komen, wat er op staat en waar de knoppen zitten.",
      ],
    },
    secties: [
      {
        h2: "Werk voor ondernemers in en rond Hoorn",
        alineas: [
          "Voor [Taxi Drechterland](/portfolio/taxi-drechterland) uit Hoogkarspel bouwden we de website van een chauffeur die overdag onder meer in Hoorn, Venhuizen en Enkhuizen rijdt. Het boekingsformulier zet de ritwens van de klant om in een kant-en-klaar WhatsApp-bericht, zodat een aanvraag zonder omweg bij de chauffeur binnenkomt. Voor de vindbaarheid kregen de luchthavenritten en de kernen in het werkgebied elk een eigen pagina.",
          "Bij [Aardingsbedrijf West-Friesland](/portfolio/aardingsbedrijf-west-friesland) draait de site om aanvragen uit de regio, met Hoorn, Enkhuizen en Medemblik als belangrijkste plaatsen. Bezoekers lezen eerst waarom aarding en de NEN 1010-norm ertoe doen en vragen daarna in een paar stappen een offerte of inspectie aan.",
        ],
      },
      {
        h2: "Wat kost een website laten maken in Hoorn?",
        alineas: [
          `De prijs staat vooraf vast. Voor een zzp'er of een kleine zaak in Hoorn is het Starter-pakket vaak genoeg: ${STARTER} voor een site van 1 tot 5 pagina's die goed werkt op de telefoon, met een contactformulier, Google Maps en de basis van SEO. Zo'n site staat meestal binnen ${LEVERTIJD.starter} live.`,
          `Bied je meerdere diensten aan, of wil je met losse dienstpagina's en blogs gevonden worden op wat mensen in de regio zoeken? Dan past Professional beter. Dat begint bij ${PROFESSIONAL} en bevat tot 10 pagina's, uitgebreide SEO, een blogfunctie, koppelingen met de software die je al gebruikt en 30 dagen gratis nazorg.`,
          `Een webshop of een site met maatwerk, zoals een klantportaal of een eigen boekingsroute, prijzen we op maat. Webshops beginnen bij ${WEBSHOP}. In de offerte zie je per onderdeel wat het kost, zodat je achteraf niet voor verrassingen staat. Alle pakketten naast elkaar vind je op de pagina met [prijzen](/prijzen).`,
        ],
      },
      {
        h2: "Zo verloopt een project",
        alineas: [
          "Eerst bespreken we in een kennismaking wat je website moet doen en voor wie hij is. Binnen 24 uur heb je daarna een reactie met een concrete offerte: wat je krijgt, wat het kost en wanneer het klaar is.",
          "Tijdens het bouwen zie je tussentijdse versies en geef je feedback voordat er iets live gaat. Teksten schrijven we met je mee, zodat ze kloppen met je vak en aansluiten op hoe klanten zoeken.",
          "Na de livegang doen wij standaard het beheer, zodat snelheid en veiligheid op orde blijven. Wil je zelf teksten en foto's aanpassen, dan bouwen we op verzoek een eenvoudig beheersysteem.",
        ],
      },
      {
        h2: "Gevonden worden in Hoorn en omgeving",
        alineas: [
          "Elke site bouwen we vanaf de eerste dag op vindbaarheid: snel laden, een heldere opbouw met een eigen pagina per dienst en teksten die aansluiten op hoe mensen in de regio zoeken. Dat helpt in Google en ook in AI-zoekmachines als ChatGPT.",
          "Voor lokale zoekopdrachten telt je Google Bedrijfsprofiel minstens zo zwaar als je website. We stemmen die twee op elkaar af, met dezelfde gegevens en openingstijden. Hoe je dat profiel goed inricht, lees je in ons artikel over [het Google Bedrijfsprofiel](/blog/google-bedrijfsprofiel-instellingen-2026).",
          "Werk je vanuit een andere plaats in de regio? Bekijk dan ook [website laten maken in Medemblik](/website-laten-maken-medemblik), [website laten maken in Heerhugowaard](/website-laten-maken-heerhugowaard), [website laten maken in Alkmaar](/website-laten-maken-alkmaar), [webdesign in Purmerend](/website-laten-maken-purmerend) of de pagina voor [heel West-Friesland](/werkgebied/west-friesland).",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost een website laten maken in Hoorn?",
        a: `Een Starter-website kost ${STARTER}, Professional begint bij ${PROFESSIONAL} en een webshop bij ${WEBSHOP}. Je krijgt altijd eerst een offerte met een vaste prijs, dus je weet vooraf waar je aan toe bent.`,
      },
      {
        q: "Hoe snel staat mijn website in Hoorn online?",
        a: `Een Starter-site meestal binnen ${LEVERTIJD.starter}, een gewone bedrijfswebsite binnen ${LEVERTIJD.standaard}. Grotere sites en webshops duren ${LEVERTIJD.complex}. Hoe snel het gaat, hangt ook af van hoe snel teksten en foto's klaar zijn.`,
      },
      {
        q: "Werken jullie ook voor zzp'ers en kleine zaken in Hoorn?",
        a: "Ja. Het Starter-pakket is daar juist voor bedoeld: een complete site van maximaal vijf pagina's voor een vaste prijs, zonder dat je meer koopt dan je nodig hebt.",
      },
      {
        q: "Ik heb al een website. Kunnen jullie die vernieuwen?",
        a: "Ja. We kijken eerst wat je huidige site goed doet en waar bezoekers afhaken. Een [gratis website-analyse](/gratis-website-analyse) is daarvoor een goed begin.",
      },
      {
        q: "Kan ik de website daarna zelf aanpassen?",
        a: "Standaard doen wij het beheer, zodat je er geen omkijken naar hebt. Wil je zelf teksten en foto's wijzigen, dan bouwen we op verzoek een beheersysteem op maat.",
      },
      {
        q: "Hoe word ik beter gevonden in Hoorn?",
        a: "Met een snelle, goed opgebouwde site, een eigen pagina per dienst, een volledig ingevuld Google Bedrijfsprofiel en reviews van klanten. Dat zetten we vanaf het begin goed neer.",
      },
    ],
    todo: [
      "Klanten uit Hoorn zelf: naam, branche en wat de site opleverde (alleen met toestemming van de klant).",
      "Waar spreek je af met ondernemers uit Hoorn: bij hen op locatie, op kantoor in Enkhuizen of via video?",
      "Lokale voorbeelden of ervaring in Hoorn, bijvoorbeeld branches waar je daar veel voor werkt.",
      "Een review of citaat van een klant uit Hoorn, als die er is.",
    ],
  },
};

export const getWerkgebiedLokaal = (
  slug: string,
): WerkgebiedLokaal | undefined => werkgebiedLokaal[slug];
