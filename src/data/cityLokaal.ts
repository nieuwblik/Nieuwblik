import { PRIJZEN } from "@/config/business";

/**
 * Handgeschreven, unieke inhoud per stadspagina.
 *
 * src/data/cities.ts wordt gegenereerd (scripts/generate-landing-data.mjs) en
 * levert voor alle 30 steden dezelfde opbouw met een andere plaatsnaam. Dit
 * bestand staat daar los van en krijgt voorrang: titel, meta description, H1,
 * het lokale tekstblok en de FAQ. Een stad die hier nog niet in staat, gebruikt
 * gewoon de gegenereerde tekst.
 *
 * Regels voor de inhoud:
 * - Alleen algemeen bekende, controleerbare feiten over de plaats. Bij twijfel weglaten.
 * - Geen verzonnen klanten, cases, cijfers of bezoeken. Een koppeling met een
 *   portfolioklant hoort als `TODO: bevestigen` in de oplevering, niet in de tekst.
 * - Titel maximaal 60 tekens, meta description maximaal 155 (getest in seo-verify).
 * - In de alinea's mag [tekst](/pad) staan voor een interne link.
 */
export interface CityLokaal {
  title: string;
  metaDescription: string;
  h1: string;
  /** Vervangt de gegenereerde intro-alinea. Ongeveer 200 tot 350 woorden. */
  lokaal: { h2: string; alineas: string[] };
  /** 4 tot 6 vragen die echt over deze plaats gaan. */
  faq: { q: string; a: string }[];
}

export const cityLokaal: Record<string, CityLokaal> = {
  leiden: {
    title: `Website laten maken Leiden | Vanaf €${PRIJZEN.starter}, op maat | Nieuwblik`,
    metaDescription: `Website op maat voor ondernemers in Leiden. Vanaf €${PRIJZEN.starter}, geen verborgen kosten en binnen enkele weken live. Vraag vrijblijvend een offerte aan.`,
    h1: "Website laten maken in Leiden",
    lokaal: {
      h2: "Ondernemen in Leiden: kennis, zorg en een drukke binnenstad",
      alineas: [
        "Leiden is een universiteitsstad. De Universiteit Leiden is de oudste van Nederland, en samen met het LUMC en het Leiden Bio Science Park zorgt dat voor een stad vol kennisintensieve bedrijven: onderzoek, life sciences, zorg en alle dienstverleners die daaromheen werken. Wie in die hoek onderneemt, heeft een website nodig die inhoud begrijpelijk maakt zonder oppervlakkig te worden. Een bezoeker die jouw dienst nog niet kent, moet binnen een paar zinnen snappen wat je doet en voor wie.",
        "Daarnaast heeft Leiden een historische binnenstad met grachten, hofjes en musea als Naturalis en het Rijksmuseum van Oudheden. Dat trekt bezoekers, en dat merken winkels, horeca en praktijken aan huis. Voor die ondernemers telt iets anders: snel vindbaar zijn op je telefoon, meteen zien waar je zit en wanneer je open bent, en in één tik kunnen bellen of een afspraak maken. Wij bouwen zulke sites mobiel eerst, omdat het merendeel van dat verkeer van een telefoon komt.",
        "Veel Leidse bedrijven werken bovendien met internationale collega's, studenten of klanten. Een site in twee talen is dan waardevol. Bij ons is meertaligheid een optionele uitbreiding en geen onderdeel van het startpakket: kies je ervoor, dan zetten we Nederlands en Engels netjes naast elkaar, met de juiste taalmarkering voor Google.",
        "Werk je vanuit Leiden ook in de omliggende steden, dan sluiten onze pagina's voor [Den Haag](/website-laten-maken-den-haag), [Delft](/website-laten-maken-delft) en [Zoetermeer](/website-laten-maken-zoetermeer) daarop aan. Wij zitten zelf in Enkhuizen en werken voor ondernemers door heel Nederland grotendeels op afstand.",
      ],
    },
    faq: [
      {
        q: "Werken jullie voor bedrijven in Leiden terwijl jullie in Enkhuizen zitten?",
        a: "Ja. We werken voor ondernemers door heel Nederland en doen dat grotendeels op afstand: kennismaken via videobellen, daarna contact via telefoon, mail en WhatsApp, steeds met hetzelfde aanspreekpunt. Wil je elkaar liever een keer fysiek spreken, dan kan dat in overleg.",
      },
      {
        q: "Kunnen jullie een website in het Nederlands én Engels maken voor internationale klanten of studenten?",
        a: "Ja. Voor bedrijven rond de universiteit, het LUMC en het Bio Science Park zetten we beide talen naast elkaar, met correcte hreflang-markering zodat Google per taal de juiste pagina toont en de versies niet met elkaar concurreren. Meertaligheid is een optionele uitbreiding en zit niet in het startpakket; we nemen het apart mee in je offerte.",
      },
      {
        q: "Wij zijn een zorgpraktijk in Leiden. Maken jullie daar ook websites voor?",
        a: "Ja. Denk aan fysiotherapie-, tandarts- en therapiepraktijken: een rustige opzet, duidelijke informatie over behandelingen en tarieven, en een eenvoudige manier om contact op te nemen of een afspraak aan te vragen. Per branche hebben we een aparte pagina met voorbeelden.",
      },
      {
        q: "Onze dienst is technisch ingewikkeld. Kunnen jullie die begrijpelijk uitleggen op de site?",
        a: "Daar begint het werk bij ons mee. We bepalen eerst voor wie de site bedoeld is en wat die bezoeker moet begrijpen, en bouwen de teksten van daaruit op: eerst de kern in gewone taal, daarna de diepte voor wie verder leest. Zo houd je een site die werkt voor een inkoper én voor een vakgenoot.",
      },
      {
        q: "Wij hebben een winkel of horecazaak in de Leidse binnenstad. Waar moeten we op letten?",
        a: "Vooral op mobiel. Bezoekers in de binnenstad zoeken op hun telefoon en willen meteen zien waar je zit, wanneer je open bent en hoe ze je bereiken. Dat zetten we bovenaan, met bellen en routebeschrijving op één tik. Daarnaast adviseren we over je Google Bedrijfsprofiel, want daar komen je openingstijden en route vandaan.",
      },
    ],
  },
};

export const getCityLokaal = (slug: string): CityLokaal | undefined => cityLokaal[slug];
