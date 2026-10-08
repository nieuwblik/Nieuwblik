/**
 * Gedeelde opbouw voor handgeschreven, plaatsgebonden inhoud op stads- en
 * werkgebiedpagina's (src/data/cityLokaal.ts en src/data/werkgebiedLokaal.ts).
 *
 * Een pagina met `eigenOpbouw` laat de sjabloonblokken weg (algemene voordelen,
 * vergelijking, standaardwerkwijze) en toont in plaats daarvan haar eigen
 * secties. Zo is de pagina geen kopie met een andere plaatsnaam.
 */
export interface LokaleSectie {
  h2: string;
  /** Alinea's; [tekst](/pad) wordt een interne link. */
  alineas: string[];
}

export interface LokaleUitbreiding {
  /** Vervangt het algemene introzinnetje onder de H1. */
  intro?: string;
  /** Eigen secties na het lokale tekstblok. */
  secties?: LokaleSectie[];
  /** Case-slugs die als eerste getoond worden. */
  cases?: string[];
  /** Laat de sjabloonblokken weg en toon alleen de eigen inhoud. */
  eigenOpbouw?: boolean;
  /**
   * Wat de eigenaar nog moet aanleveren. Alleen zichtbaar in development
   * (import.meta.env.DEV), nooit in de productiebuild.
   */
  todo?: string[];
}
