import tabletLiggend from "@/assets/mockup/tablet-liggend.webp";
import tabletLiggendSet from "@/assets/mockup/tablet-liggend.webp?w=1280;1920;2880;3840&format=webp&as=srcset";
import tabletStaandSet from "@/assets/mockup/tablet-staand.webp?w=720;1080;1440;2160&format=webp&as=srcset";
import tabletMaskerLiggend from "@/assets/mockup/tablet-liggend-masker.png";
import tabletMaskerStaand from "@/assets/mockup/tablet-staand-masker.png";
import bureauLiggend from "@/assets/mockup/bureau-liggend.webp";
import bureauLiggendSet from "@/assets/mockup/bureau-liggend.webp?w=1280;1920;2880;3840&format=webp&as=srcset";
import bureauStaandSet from "@/assets/mockup/bureau-staand.webp?w=720;1080;1440;2160&format=webp&as=srcset";
import bureauMaskerLiggend from "@/assets/mockup/bureau-liggend-masker.png";
import bureauMaskerStaand from "@/assets/mockup/bureau-staand-masker.png";
import werkplekLiggend from "@/assets/mockup/werkplek-liggend.webp";
import werkplekLiggendSet from "@/assets/mockup/werkplek-liggend.webp?w=1280;1920;2880;3840&format=webp&as=srcset";
import werkplekStaandSet from "@/assets/mockup/werkplek-staand.webp?w=720;1080;1440;2160&format=webp&as=srcset";
import werkplekMaskerLiggend from "@/assets/mockup/werkplek-liggend-masker.png";
import werkplekMaskerStaand from "@/assets/mockup/werkplek-staand-masker.png";

/** Eén mockupfoto met een scherm in perspectief, opgemeten met schermUit() in scripts/mockups/telefoon.mjs. */
export interface ToestelFoto {
  /** Masker: het groene vlak uit de originele foto (wit, alfa = groenheid). */
  masker: string;
  /** Verhouding van de foto (breedte / hoogte). */
  ar: number;
  /** Schermhoeken als fractie van de foto: linksboven, rechtsboven, rechtsonder, linksonder. */
  hoeken: [number, number][];
  /** Verhouding van het scherm zelf (breedte / hoogte). */
  verhouding: number;
  /** Hoekafronding van het scherm als fractie van de schermbreedte. */
  radius: number;
}

/**
 * Een toestel voor de hero van een case (CaseToestel): een liggende foto voor
 * liggende schermen en een staande voor telefoons, met het scherm zwart (uit).
 */
export interface Toestel {
  naam: string;
  src: string;
  srcSet: string;
  srcSetStaand: string;
  liggend: ToestelFoto;
  staand: ToestelFoto;
  /** Achtergrondkleur van de sectie (rand van de foto). */
  achtergrond: string;
  /** Licht over het scherm, als CSS-background (bovenop de site). */
  licht: string;
  /** Kleurcorrectie van de site in het scherm, als CSS-filter (optioneel). */
  filter?: string;
  /** Donkere foto: de vaste header wordt erboven licht (wit logo). */
  donker?: boolean;
  /**
   * Hoe het scherm aangaat: "zacht" (standaard, CSS: komt iets te helder op) of
   * "gsap" (GSAP-timeline: paneel licht op, beeld komt van onscherp en overbelicht
   * scherp op zijn plek).
   */
  aan?: "zacht" | "gsap";
  /** Inzoomen op de liggende foto (1 = cover, 1.15 = 15% ingezoomd), rond het midden van de hero; staand blijft cover. */
  zoom?: number;
}

export const toestellen = {
  /*
   * Tablet in twee handen tegen een van achteren belichte grijze studio (Feigro).
   * Licht zoals gemeten in de referentie: achtergrond egaal RGB ~204, handen bijna
   * zwart, scherm zelflichtend en ~7-10% donkerder naar de hoeken, geen glans.
   * Daarom: vignettering 11% naar de hoeken en een grijze sluier van 5%.
   */
  tablet: {
    naam: "tablet",
    src: tabletLiggend,
    srcSet: tabletLiggendSet,
    srcSetStaand: tabletStaandSet,
    liggend: {
      masker: tabletMaskerLiggend,
      ar: 3840 / 2160,
      hoeken: [[0.28677, 0.21772], [0.69139, 0.19876], [0.7085, 0.67774], [0.29814, 0.70362]],
      verhouding: 1.5002,
      radius: 0.0216,
    },
    staand: {
      masker: tabletMaskerStaand,
      ar: 2160 / 3840,
      hoeken: [[0.15909, 0.31939], [0.83887, 0.31547], [0.85443, 0.58888], [0.1634, 0.59329]],
      verhouding: 1.4085,
      radius: 0.0196,
    },
    achtergrond: "#cccdce",
    licht: "radial-gradient(ellipse 78% 74% at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.11) 100%), rgba(204,205,207,0.05)",
  },
  /*
   * Monitor op een houten bureau voor een raam met groen, warm laag zonlicht in een
   * donkere kamer (Een Bundel Geluk). Gemeten: raam RGB 16-34, bureau in de zon
   * 191,136,107 en in de schaduw 103,75,65; het scherm zelf valt buiten het zonlicht
   * en geeft licht (in de referentie helder en neutraal). Daarom alleen een lichte
   * vignettering, een heel kleine warme toon en iets minder contrast, geen glans.
   */
  bureau: {
    naam: "bureau",
    src: bureauLiggend,
    srcSet: bureauLiggendSet,
    srcSetStaand: bureauStaandSet,
    liggend: {
      masker: bureauMaskerLiggend,
      ar: 3840 / 2160,
      hoeken: [[0.27559, 0.18838], [0.7106, 0.16294], [0.71007, 0.63217], [0.27617, 0.60046]],
      verhouding: 1.754,
      radius: 0.0022,
    },
    staand: {
      masker: bureauMaskerStaand,
      ar: 2160 / 3840,
      hoeken: [[0.11057, 0.2867], [0.89947, 0.27055], [0.89966, 0.57495], [0.1071, 0.55548]],
      verhouding: 1.5532,
      radius: 0,
    },
    achtergrond: "#1c1d16",
    licht: "radial-gradient(ellipse 80% 76% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.09) 100%), rgba(255,214,170,0.03)",
    filter: "contrast(0.97)",
    donker: true,
  },
  /*
   * Avondlijke werkplek (VV Madjoe): monitor recht van voren op een houten bureau,
   * een warme lamp erachter laat de muur amber gloeien, de rest van de kamer is donker.
   * Gemeten: muur rond de monitor RGB ~240,165,57, muur ver links 49,34,4, bureau
   * 129,65,11, voorgrond 17,8,2. Het scherm geeft zelf licht en is de koelste lichtbron
   * in de kamer: geen warme toon erover, alleen lichte vignettering. Gaat aan met een
   * GSAP-timeline.
   */
  werkplek: {
    naam: "werkplek",
    src: werkplekLiggend,
    srcSet: werkplekLiggendSet,
    srcSetStaand: werkplekStaandSet,
    liggend: {
      masker: werkplekMaskerLiggend,
      ar: 3840 / 2160,
      hoeken: [[0.32604, 0.29861], [0.67397, 0.29861], [0.67395, 0.61389], [0.32604, 0.61389]],
      verhouding: 1.9618,
      radius: 0,
    },
    staand: {
      masker: werkplekMaskerStaand,
      ar: 2160 / 3840,
      hoeken: [[0.16753, 0.34683], [0.83241, 0.34723], [0.83241, 0.57292], [0.16769, 0.57292]],
      verhouding: 1.6555,
      radius: 0.0034,
    },
    achtergrond: "#1a1208",
    licht: "radial-gradient(ellipse 82% 78% at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.08) 100%)",
    donker: true,
    aan: "gsap",
    zoom: 1.15,
  },
} satisfies Record<string, Toestel>;

export type ToestelNaam = keyof typeof toestellen;
