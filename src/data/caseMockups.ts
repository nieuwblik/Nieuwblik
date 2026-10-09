import type { MockupScherm } from "@/components/CaseMockup";
import taxiDrechterland from "@/assets/cases/taxi-drechterland-scherm.webp";
import taxiDrechterlandSet from "@/assets/cases/taxi-drechterland-scherm.webp?w=720;1440;1800&format=webp&as=srcset";

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
