import type { MockupScherm } from "@/components/CaseMockup";
import taxiDrechterland from "@/assets/cases/taxi-drechterland-scherm.webp";
import taxiDrechterlandSet from "@/assets/cases/taxi-drechterland-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
import taxiDrechterlandTelefoon from "@/assets/cases/taxi-drechterland-telefoon.webp";
import taxiDrechterlandTelefoonSet from "@/assets/cases/taxi-drechterland-telefoon.webp?w=800;1200;1600;2160&format=webp&as=srcset";
import feigroDakwerken from "@/assets/cases/feigro-dakwerken-scherm.webp";
import feigroDakwerkenSet from "@/assets/cases/feigro-dakwerken-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
import feigroDakwerkenTelefoon from "@/assets/cases/feigro-dakwerken-telefoon.webp";
import feigroDakwerkenTelefoonSet from "@/assets/cases/feigro-dakwerken-telefoon.webp?w=800;1200;1600;2160&format=webp&as=srcset";
import feigroDakwerkenTelefoonDesktopSet from "@/assets/cases/feigro-dakwerken-telefoon-desktop.webp?w=800;1200;1600;2160&format=webp&as=srcset";

/**
 * Full-page screenshots per case voor de mockup in de hero (sleutel = slug
 * uit src/data/projects.ts), gemaakt met scripts/mockups/nieuwe-case.mjs: venster
 * in de verhouding van het scherm in het toestel (monitor 1440×790, tablet
 * 1440×960), scherp gemaakt en op 1800 breed gezet; cookiemelding geweigerd en
 * zwevende knoppen verborgen. Een case zonder screenshot houdt de gewone hero.
 */
export const caseMockups: Record<string, MockupScherm> = {
  "taxi-drechterland": {
    src: taxiDrechterland,
    srcSet: taxiDrechterlandSet,
    breedte: 1800,
    hoogte: 15704,
  },
  "feigro-dakwerken": {
    src: feigroDakwerken,
    srcSet: feigroDakwerkenSet,
    breedte: 1800,
    hoogte: 11369,
    toestel: "tablet",
  },
};

export interface TelefoonFoto {
  src: string;
  srcSet: string;
  /**
   * Optioneel voor desktop: dezelfde foto gespiegeld (scherm naar de tekst rechts),
   * met de site opnieuw in het scherm gezet zodat die gewoon leesbaar blijft.
   */
  srcSetDesktop?: string;
  breedte: number;
  hoogte: number;
  /** Verticaal midden van de telefoon in de foto (0-1); daar centreert het kader op. */
  midden: number;
  /** Hoogte van de telefoon (met rand) als deel van de fotohoogte; begrenst de zoom-animatie. */
  telefoonHoogte: number;
  /** Breedte van de foto als deel van de kolom op desktop (standaard 1, de hele kolom). */
  schaal?: number;
  /** Kleur van de egale achtergrond in de foto; vult de kolom als de foto smaller is. */
  achtergrond?: string;
  /** Scroll-animatie (eindstand) als die afwijkt van de standaard in CaseTelefoon. */
  effect?: { zoom: number; naarRechts: number; zoomMobiel: number; naarRechtsMobiel: number };
}

/**
 * Foto van een iPhone in de hand met de mobiele site van de case op het scherm
 * (Higgsfield-foto met groen scherm; de screenshot is er met perspectief in gezet,
 * 402×820 @3x met een statusbalk erboven). Staand 9:16, zodat de foto op halve
 * breedte 110vh kan vullen zonder in te zoomen. Vervangt de oude case-afbeelding.
 */
export const caseTelefoons: Record<string, TelefoonFoto> = {
  "taxi-drechterland": {
    src: taxiDrechterlandTelefoon,
    srcSet: taxiDrechterlandTelefoonSet,
    breedte: 2160,
    hoogte: 3840,
    midden: 0.44,
    telefoonHoogte: 0.44,
  },
  "feigro-dakwerken": {
    src: feigroDakwerkenTelefoon,
    srcSet: feigroDakwerkenTelefoonSet,
    // Op desktop gespiegeld, zodat het scherm naar de tekst ernaast kijkt.
    srcSetDesktop: feigroDakwerkenTelefoonDesktopSet,
    breedte: 2160,
    hoogte: 3840,
    midden: 0.47,
    telefoonHoogte: 0.52,
    // De telefoon staat in deze studiofoto groot in beeld: kleiner tonen en rustiger animeren.
    schaal: 0.8,
    achtergrond: "rgb(242, 241, 241)",
    effect: { zoom: 1.08, naarRechts: 3, zoomMobiel: 1.04, naarRechtsMobiel: 1.5 },
  },
};
