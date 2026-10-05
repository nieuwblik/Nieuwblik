import { LEVERTIJD, PRIJZEN } from "@/config/business";

/**
 * Handgeschreven, unieke inhoud per werkgebiedpagina (/werkgebied/{slug}).
 * Zonder dit bestand heeft elke plaats dezelfde opbouw met een andere naam;
 * staat een plaats hier, dan komen er een lokaal tekstblok en eigen vragen bij
 * (met FAQPage-markering).
 *
 * Zelfde regels als src/data/cityLokaal.ts: alleen controleerbare feiten, geen
 * verzonnen klanten of cijfers, en [tekst](/pad) voor een interne link.
 */
export interface WerkgebiedLokaal {
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
};

export const getWerkgebiedLokaal = (
  slug: string,
): WerkgebiedLokaal | undefined => werkgebiedLokaal[slug];
