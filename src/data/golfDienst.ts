import type { GolfInstellingen } from "@/components/golf/golfMotor";

// Instellingen van de golf in de hero van de dienstpagina's (Dienstpagina.tsx), opgeslagen met het afstelpaneel
// (toets p in de ontwikkelomgeving, knop "Opslaan in site"). Die knop maakt ook de
// terugvalbeelden in src/assets/hero opnieuw (hero op 1600 x 900 en 390 x 844).
export const golfDienst: GolfInstellingen = {
  opstelling: {
    spiegel: false,
    adem: true,
    muis: false,
  },
  beweging: {
    ademKracht: 1,
    muisKracht: 1,
  },
  vorm: {
    twistX: -1.14,
    twistKrachtX: 1.27,
    twistY: -0.33,
    twistKrachtY: 1.02,
    twistZ: -0.77,
    twistKrachtZ: 2.38,
    verplaatsing: -5.9,
    freqX: 0.0023,
    freqZ: 0.014,
    snelheid: 0.02,
    glow: 2.37,
    glowMacht: 1.35,
    glowRamp: 0.62,
    vervaging: 17.5,
    vervagingBereik: 0.16,
    korrel: 0.95,
  },
  intro: {
    type: "ontvouwen",
    duur: 1.3,
    vertraging: 0.1,
  },
  scroll: {
    aan: true,
    draaien: 0,
    ontvouwen: 0.05,
    verschuiven: -6.5,
    inzoomen: 0.11,
  },
  desktop: {
    posX: 16.5,
    posY: -50,
    schaal: 1.64,
    rotatie: 23,
  },
  mobiel: {
    posX: 20,
    posY: 24,
    schaal: 2.6,
    rotatie: 60,
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
  kleurBron: {
    sjabloon: "Smaragd donker",
    stijl: "Zacht",
    basisStijl: "Zacht",
    basis: {
      voorRand: ["#9fd9bd", "#aadec0", "#b5e2c4"],
      voorVouw: ["#178f63", "#1d945f", "#23995a"],
      achterVouw: ["#06553d", "#08593a", "#0a5c36"],
      achterRand: ["#021f17", "#032219", "#04261a"],
    },
    basisInstel: {
      pastel: 0.12,
      witheid: 1,
    },
  },
};
