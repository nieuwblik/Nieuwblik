import type { MockupScherm } from "@/components/CaseMockup";
import type { VoorNaBeelden } from "@/components/CaseVoorNa";
import type { ToestelNaam } from "@/data/toestellen";
import taxiDrechterland from "@/assets/cases/taxi-drechterland-scherm.webp";
import taxiDrechterlandSet from "@/assets/cases/taxi-drechterland-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
import taxiDrechterlandTelefoon from "@/assets/cases/taxi-drechterland-telefoon.webp";
import taxiDrechterlandTelefoonSet from "@/assets/cases/taxi-drechterland-telefoon.webp?w=800;1200;1600;2160&format=webp&as=srcset";
import feigroDakwerken from "@/assets/cases/feigro-dakwerken-scherm.webp";
import feigroDakwerkenSet from "@/assets/cases/feigro-dakwerken-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
import feigroDakwerkenTelefoon from "@/assets/cases/feigro-dakwerken-telefoon.webp";
import feigroDakwerkenTelefoonSet from "@/assets/cases/feigro-dakwerken-telefoon.webp?w=800;1200;1600;2160&format=webp&as=srcset";
import feigroDakwerkenTelefoonDesktopSet from "@/assets/cases/feigro-dakwerken-telefoon-desktop.webp?w=800;1200;1600;2160&format=webp&as=srcset";
import eenBundelGeluk from "@/assets/cases/een-bundel-geluk-scherm.webp";
import eenBundelGelukSet from "@/assets/cases/een-bundel-geluk-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
import eenBundelGelukTelefoon from "@/assets/cases/een-bundel-geluk-telefoon.webp";
import eenBundelGelukTelefoonSet from "@/assets/cases/een-bundel-geluk-telefoon.webp?w=800;1200;1600;2160&format=webp&as=srcset";
import vvMadjoe from "@/assets/cases/vv-madjoe-scherm.webp";
import vvMadjoeSet from "@/assets/cases/vv-madjoe-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
import vvMadjoeTelefoon from "@/assets/cases/vv-madjoe-telefoon.webp";
import vvMadjoeTelefoonSet from "@/assets/cases/vv-madjoe-telefoon.webp?w=800;1200;1600;2160&format=webp&as=srcset";
import esveldInstallatie from "@/assets/cases/esveld-installatie-scherm.webp";
import esveldInstallatieSet from "@/assets/cases/esveld-installatie-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
import esveldInstallatieTelefoon from "@/assets/cases/esveld-installatie-telefoon.webp";
import esveldInstallatieTelefoonSet from "@/assets/cases/esveld-installatie-telefoon.webp?w=800;1200;1600;2160&format=webp&as=srcset";
import esveldInstallatieVoor from "@/assets/cases/esveld-installatie-voor.webp";
import esveldInstallatieVoorSet from "@/assets/cases/esveld-installatie-voor.webp?w=720;1200;1800&format=webp&as=srcset";
import esveldInstallatieNa from "@/assets/cases/esveld-installatie-na.webp";
import esveldInstallatieNaSet from "@/assets/cases/esveld-installatie-na.webp?w=720;1200;1800&format=webp&as=srcset";

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
  "een-bundel-geluk": {
    src: eenBundelGeluk,
    srcSet: eenBundelGelukSet,
    breedte: 1800,
    hoogte: 11358,
    toestel: "bureau",
  },
  "vv-madjoe": {
    src: vvMadjoe,
    srcSet: vvMadjoeSet,
    breedte: 1800,
    hoogte: 10990,
    toestel: "werkplek",
  },
  "esveld-installatie": {
    src: esveldInstallatie,
    srcSet: esveldInstallatieSet,
    breedte: 1800,
    hoogte: 9234,
    toestel: "studiomonitor",
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
  "een-bundel-geluk": {
    src: eenBundelGelukTelefoon,
    srcSet: eenBundelGelukTelefoonSet,
    breedte: 2160,
    hoogte: 3840,
    midden: 0.5,
    telefoonHoogte: 0.615,
    // Ook hier staat de telefoon groot in beeld (diagonaal): rustigere zoom.
    effect: { zoom: 1.1, naarRechts: 4, zoomMobiel: 1.05, naarRechtsMobiel: 2 },
  },
  "vv-madjoe": {
    src: vvMadjoeTelefoon,
    srcSet: vvMadjoeTelefoonSet,
    breedte: 2160,
    hoogte: 3840,
    midden: 0.455,
    telefoonHoogte: 0.387,
  },
  "esveld-installatie": {
    src: esveldInstallatieTelefoon,
    srcSet: esveldInstallatieTelefoonSet,
    breedte: 2160,
    hoogte: 3840,
    midden: 0.476,
    telefoonHoogte: 0.48,
  },
};

/**
 * Voor en na (CaseVoorNa): de oude site (via de Wayback Machine) en de huidige,
 * allebei bovenaan de homepage in de schermverhouding van het toestel (venster 1440×769
 * voor de blauwe kamer), dpr 1,25 en 1800 breed.
 */
export const caseVoorNa: Record<string, VoorNaBeelden & { toestel: ToestelNaam }> = {
  "esveld-installatie": {
    toestel: "blauwekamer",
    voor: esveldInstallatieVoor,
    voorSet: esveldInstallatieVoorSet,
    na: esveldInstallatieNa,
    naSet: esveldInstallatieNaSet,
    voorLabel: "2023",
    naLabel: "Nu",
  },
};
