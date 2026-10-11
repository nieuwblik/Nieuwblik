import type { GolfInstellingen } from "@/components/golf/golfMotor";

// Instellingen van de golf in de homepage-hero, opgeslagen met het afstelpaneel
// (toets p in de ontwikkelomgeving, knop "Opslaan in site"). Die knop maakt ook de
// terugvalbeelden in src/assets/hero opnieuw (hero op 1600 x 900 en 390 x 844).
export const golfHero: GolfInstellingen = {
  opstelling: {
    spiegel: true,
    adem: false,
    muis: false,
  },
  beweging: {
    ademKracht: 1,
    muisKracht: 1,
  },
  vorm: {
    twistX: -0.65,
    twistKrachtX: 3.63,
    twistY: 0.41,
    twistKrachtY: 0.7,
    twistZ: -0.58,
    twistKrachtZ: 3.95,
    verplaatsing: -7.821,
    freqX: 0.0058,
    freqZ: 0.016,
    snelheid: 0.02,
    glow: 2.37,
    glowMacht: 1.35,
    glowRamp: 0.62,
    vervaging: 16,
    vervagingBereik: 0.1,
    korrel: 0.95,
  },
  intro: { type: "ontvouwen", duur: 2.6, vertraging: 0.1 },
  scroll: {
    aan: true,
    draaien: 18,
    ontvouwen: 0.35,
    verschuiven: 12,
    inzoomen: 0.12,
  },
  desktop: {
    posX: 14.5,
    posY: 0,
    schaal: 0.94,
    rotatie: 12,
  },
  mobiel: {
    posX: -13,
    posY: 16.5,
    schaal: 2.45,
    rotatie: 27.5,
  },
  kleuren: {
    voorRand: ["#9fd9bd", "#aadec0", "#b5e2c4"],
    voorVouw: ["#178f63", "#1d945f", "#23995a"],
    achterVouw: ["#06553d", "#08593a", "#0a5c36"],
    achterRand: ["#021f17", "#032219", "#04261a"],
  },
  kleurInstel: {
    pastel: 0.12,
    witheid: 1,
    vezels: 0.26,
    vezelBasis: 0.22,
    banen: 0.105,
    vouwOvergang: 0.15,
  },
};
