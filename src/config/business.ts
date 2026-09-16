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
  // TODO(Justin): echt aantal Google-reviews aanleveren. "19+" is de tekst die
  // op de homepage stond en is niet gecontroleerd.
  aantalLabel: "19+",
  /**
   * Google Bedrijfsprofiel van Nieuwblik. De CID komt uit de place-ID in
   * companyInfo.address.googleMapsUrl (0x…:0xecaa07e808a362fc), omgerekend
   * naar decimaal.
   */
  profielUrl: "https://www.google.com/maps?cid=17053451632150536956",
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

/** Bedrag met euroteken en duizendtalpunt, zoals "€2.990". Zonder toLocaleString: server en browser moeten exact gelijk renderen. */
export const euroTeken = (bedrag: number): string =>
  `€${String(bedrag).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
