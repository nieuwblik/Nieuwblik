/**
 * Eén bron voor reviewscore, prijzen en doorlooptijd.
 *
 * Deze getallen stonden los in tientallen teksten en liepen uiteen: 5,0 op de
 * homepage en 4.9 op /over-ons, websites "vanaf 990" en op de stad- en
 * branchepagina's "vanaf 1500", en een doorlooptijd van "binnen 1 week" tot
 * "2 tot 6 weken". Teksten lezen nu hieruit, zodat zo'n tegenstrijdigheid niet
 * meer kan ontstaan.
 *
 * Bewust zonder imports: ook scripts/generate-landing-data.mjs leest dit.
 */

export const REVIEWS = {
  /** Gemiddelde op Google. */
  score: 5,
  scoreLabel: "5,0",
  /** Aantal Google-reviews, gecontroleerd op het profiel op 05-10-2026. */
  aantalLabel: "19",
  /**
   * Google Bedrijfsprofiel van Nieuwblik (place 0x47c8a310c36365c7:0x34f95b56393a64b2,
   * CID decimaal). De oude CID 17053451632150536956 was het gebouw De Trompet 18H,
   * niet het bedrijf: wie op "Google-reviews" klikte, zag de reviews niet.
   */
  profielUrl: "https://www.google.com/maps?cid=3817182585058649266",
  /** Deellink van het Bedrijfsprofiel (opent het profiel in Google, met "Review schrijven"). */
  schrijfUrl: "https://share.google/VvooqtbIEOETdNs3J",
} as const;

export const PRIJZEN = {
  /** Instapprijs voor een website: het Starter-pakket. */
  starter: 990,
  professional: 1990,
  /** Bandbreedte voor uitgebreide sites en webshops. */
  uitgebreidVan: 1990,
  uitgebreidTot: 4000,
  webshopVanaf: 2990,
  /** Taxiwebsite met WhatsApp-boekingsformulier en luchthavenpagina's: een eigen product. */
  taxiWebsiteVanaf: 1500,
} as const;

export const PAKKETTEN = {
  starter: { naam: "Starter", prijs: PRIJZEN.starter },
  professional: { naam: "Professional", prijs: PRIJZEN.professional },
  opMaat: { naam: "Op maat", prijs: null },
} as const;

export const LEVERTIJD = {
  /** Starter-pakket. */
  starter: "2 weken",
  /** Standaard MKB-website. */
  standaard: "2 tot 4 weken",
  /** Grotere sites en complexe webshops. */
  complex: "4 tot 6 weken",
} as const;

/** Hosting bij Nieuwblik is optioneel: vanafprijs per maand, exclusief btw. Meer kan, afhankelijk van wat de site nodig heeft. Basisonderhoud zit erbij. */
export const HOSTING_PER_MAAND = 29.95;

/** Bedrag met centen, zoals "€29,95". */
export const euroMetCenten = (bedrag: number): string => `€${bedrag.toFixed(2).replace(".", ",")}`;

/** Eén formulering voor hosting en basisonderhoud, overal op de site gelijk. */
export const HOSTING_ZIN = `Hosting kan bij ons vanaf ${euroMetCenten(HOSTING_PER_MAAND)} per maand (excl. btw), afhankelijk van wat je site nodig heeft, met basisonderhoud inbegrepen.`;
/** Dezelfde zin met een kleine letter, voor na een dubbele punt. */
export const HOSTING_ZIN_KLEIN = HOSTING_ZIN.charAt(0).toLowerCase() + HOSTING_ZIN.slice(1);

/** Bedrag met euroteken en duizendtalpunt, zoals "€2.990". Zonder toLocaleString: server en browser moeten exact gelijk renderen. */
export const euroTeken = (bedrag: number): string =>
  `€${String(bedrag).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
