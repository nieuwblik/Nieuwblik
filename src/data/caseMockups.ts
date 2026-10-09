import type { MockupScherm } from "@/components/CaseMockup";
import taxiDrechterland from "@/assets/cases/taxi-drechterland-scherm.webp";
import taxiDrechterlandSet from "@/assets/cases/taxi-drechterland-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
import taxiDrechterlandTelefoon from "@/assets/cases/taxi-drechterland-telefoon.webp";
import taxiDrechterlandTelefoonSet from "@/assets/cases/taxi-drechterland-telefoon.webp?w=800;1200;1600;2200&format=webp&as=srcset";

/**
 * Full-page screenshots per case voor de mockup in de hero (sleutel = slug
 * uit src/data/projects.ts). Gemaakt in headless Chrome met een venster van
 * 1440×790 (de verhouding van het scherm in de mockup), in 1,5× scherpte en
 * daarna op 1800 breed gezet; cookiemelding geweigerd en zwevende knoppen
 * verborgen. Een case zonder screenshot houdt de gewone hero.
 */
export const caseMockups: Record<string, MockupScherm> = {
  "taxi-drechterland": {
    src: taxiDrechterland,
    srcSet: taxiDrechterlandSet,
    breedte: 1800,
    hoogte: 15704,
  },
};

export interface TelefoonFoto {
  src: string;
  srcSet: string;
  breedte: number;
  hoogte: number;
}

/**
 * Foto van een iPhone in de hand met de mobiele site van de case op het scherm
 * (Higgsfield-foto met groen scherm; de screenshot is er met perspectief in gezet,
 * 402×820 @3x met een statusbalk erboven). Vervangt de oude case-afbeelding.
 */
export const caseTelefoons: Record<string, TelefoonFoto> = {
  "taxi-drechterland": {
    src: taxiDrechterlandTelefoon,
    srcSet: taxiDrechterlandTelefoonSet,
    breedte: 2560,
    hoogte: 3200,
  },
};
