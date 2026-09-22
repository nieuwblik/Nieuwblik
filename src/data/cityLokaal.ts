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
        "Veel Leidse bedrijven werken bovendien met internationale collega's, studenten of klanten. Een tweetalige site is dan geen luxe. We zetten Nederlands en Engels netjes naast elkaar, met de juiste taalmarkering voor Google, zodat beide versies gevonden worden in plaats van met elkaar te concurreren.",
        "Werk je vanuit Leiden ook in de omliggende steden, dan sluiten onze pagina's voor [Den Haag](/website-laten-maken-den-haag), [Delft](/website-laten-maken-delft) en [Zoetermeer](/website-laten-maken-zoetermeer) daarop aan. Wij zitten zelf in Enkhuizen, en dat is voor een project in Leiden geen bezwaar: we kennen elkaar via videobellen, we zijn bereikbaar via telefoon en WhatsApp, en langskomen kan in overleg. Je hebt bij ons één vast aanspreekpunt, van de eerste schets tot de dag dat de site live gaat.",
      ],
    },
    faq: [
      {
        q: "Werken jullie voor bedrijven in Leiden terwijl jullie in Enkhuizen zitten?",
        a: "Ja. We werken voor ondernemers door heel Nederland en doen dat grotendeels op afstand. De kennismaking gaat via videobellen, daarna houden we contact via telefoon, mail en WhatsApp. Je hebt steeds hetzelfde aanspreekpunt.",
      },
      {
        q: "Kunnen jullie langskomen in Leiden?",
        a: "In overleg kan dat. De meeste projecten lopen prima via videobellen en schermdelen, omdat je dan sneller schakelt. Is een fysieke afspraak belangrijk voor je, geef het aan bij de kennismaking.",
      },
      {
        q: "Maken jullie ook een Engelstalige of tweetalige website?",
        a: "Ja. Voor bedrijven die met internationale klanten, studenten of collega's werken zetten we Nederlands en Engels naast elkaar, met correcte hreflang-markering. Zo pakt Google per taal de juiste pagina en concurreren de versies niet met elkaar.",
      },
      {
        q: "Helpen jullie ook met vindbaarheid in Leiden en omgeving?",
        a: "Ja. We richten de site technisch goed in en schrijven de teksten op de zoekwoorden die jouw klanten echt gebruiken, inclusief de plaatsnaam. Daarnaast adviseren we over je Google Bedrijfsprofiel, want dat bepaalt voor een groot deel of je lokaal opvalt.",
      },
      {
        q: "Werken jullie ook voor bedrijven in Den Haag, Delft of Zoetermeer?",
        a: "Zeker, die steden liggen om de hoek en we hebben er aparte pagina's voor. Werk je in meerdere plaatsen, dan richten we de site zo in dat je in elke plaats gevonden wordt zonder dat je dezelfde tekst dubbel gebruikt.",
      },
    ],
  },
};

export const getCityLokaal = (slug: string): CityLokaal | undefined => cityLokaal[slug];
