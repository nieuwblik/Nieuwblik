// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- zie hieronder
// @ts-nocheck -- Afsteltool, rechtstreeks overgezet uit het prototype
// (_prototypes/hero-golf/golf.js). Werkt met losse DOM-elementen buiten React en
// wordt alleen geladen in de ontwikkelomgeving of met ?afstellen in de url.
//
// Toets p opent het paneel. "Opslaan in site" (alleen in de ontwikkelomgeving)
// schrijft de instellingen naar src/data/golfHero.ts en maakt de terugvalbeelden
// opnieuw (via de Vite-middleware in scripts/vite-golf-afstellen.ts). De
// opslagvakjes worden in de ontwikkelomgeving gedeeld met het prototype.
import { startGolf, type GolfInstellingen, type GolfMotor } from "./golfMotor";
import "./golfPaneel.css";

type Opties = { motor: GolfMotor; hero: HTMLElement; site: GolfInstellingen };

export function startPaneel({ motor, hero, site }: Opties): () => void {
  const opruimen = [];
  const luister = (doel, type, f, o) => {
    doel.addEventListener(type, f, o);
    opruimen.push(() => doel.removeEventListener(type, f, o));
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lettertypen van het paneel (Claude-stijlreferentie); zonder vallen ze terug op systeemletters.
  if (!document.getElementById("golf-paneel-fonts")) {
    const l = document.createElement("link");
    l.id = "golf-paneel-fonts";
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }

  // ---------------------------------------------------------------- kleur (OKLab/OKLCH)
  const hex = (s) =>
    [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
  const naarLin = (c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const vanLin = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  const hexNaarOklab = (hx) => {
    const [r, g, b] = hex(hx).map(naarLin);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
  };
  const oklabNaarLin = (L, A, B) => {
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3,
      m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3,
      s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
  };
  const linNaarHex = (rgb) =>
    "#" +
    rgb
      .map((x) =>
        Math.round(
          Math.min(1, Math.max(0, vanLin(Math.min(1, Math.max(0, x))))) * 255,
        )
          .toString(16)
          .padStart(2, "0"),
      )
      .join("");
  const hexNaarOklch = (hx) => {
    const [L, A, B] = hexNaarOklab(hx);
    return [
      L,
      Math.hypot(A, B),
      ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360,
    ];
  };
  const oklchNaarHex = (L, C, h) => {
    const rgb = (c) =>
      oklabNaarLin(
        L,
        c * Math.cos((h * Math.PI) / 180),
        c * Math.sin((h * Math.PI) / 180),
      );
    const binnen = (v) => v.every((x) => x >= -0.0005 && x <= 1.0005);
    let lo = 0,
      hi = C,
      v = rgb(C);
    if (!binnen(v)) {
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        if (binnen(rgb(mid))) lo = mid;
        else hi = mid;
      }
      v = rgb(lo);
    }
    return linNaarHex(v);
  };
  const mengOklab = (a, b, t) => {
    const x = hexNaarOklab(a),
      y = hexNaarOklab(b);
    return linNaarHex(oklabNaarLin(...x.map((v, i) => v + (y[i] - v) * t)));
  };

  // ---------------------------------------------------------------- sjablonen en vormen
  const DELEN = ["voorRand", "voorVouw", "achterVouw", "achterRand"];
  const SJABLONEN = {
    "Nieuwblik groen": [
      [
        "#cceee8",
        "#e0f5d1",
        "#33b899",
        "#6bcc6b",
        "#088f6b",
        "#1a9e4d",
        "#053d33",
        "#0a4a2b",
      ],
      0.25,
      0.2,
      1,
    ],
    "Bos en mint": [
      [
        "#e3f4ea",
        "#eef8e8",
        "#7fcf9f",
        "#9ed8a0",
        "#0f6b45",
        "#18804f",
        "#062e22",
        "#0b3a26",
      ],
      0.28,
      0.18,
      1,
    ],
    Zeegroen: [
      [
        "#d4f1f0",
        "#dcf3ea",
        "#3fbfb0",
        "#4fc79a",
        "#0a8a85",
        "#0b8f6e",
        "#05403f",
        "#06463a",
      ],
      0.24,
      0.2,
      1,
    ],
    "Lime fris": [
      [
        "#eef9d8",
        "#f4fbe0",
        "#9ad84f",
        "#b8e04a",
        "#2f9e3a",
        "#4fae2c",
        "#12401c",
        "#1c4a14",
      ],
      0.22,
      0.22,
      1,
    ],
    "Smaragd donker": [
      [
        "#9fd9bd",
        "#b5e2c4",
        "#178f63",
        "#23995a",
        "#06553d",
        "#0a5c36",
        "#021f17",
        "#04261a",
      ],
      0.12,
      0.26,
      1,
    ],
    "Salie zacht": [
      [
        "#eef2ea",
        "#f2f4ec",
        "#a9c3a8",
        "#b9cca4",
        "#5d8a6a",
        "#6e9466",
        "#2c4635",
        "#344c33",
      ],
      0.3,
      0.14,
      1,
    ],
    "Groen met goud": [
      [
        "#e6f4e6",
        "#fbf1d6",
        "#4fb07a",
        "#e3b85a",
        "#127a4c",
        "#c98a2e",
        "#073a26",
        "#5a3a10",
      ],
      0.22,
      0.2,
      1,
    ],
    "Smaragd fel": [
      [
        "#7fe0b0",
        "#a6ec8a",
        "#22c47a",
        "#5fd34a",
        "#00a35a",
        "#16b03a",
        "#006b45",
        "#0b7a2a",
      ],
      0.24,
      0.2,
      0.15,
    ],
    "Neon lime": [
      [
        "#c8f56a",
        "#8ff0b6",
        "#7fe02a",
        "#2fe08a",
        "#3fb800",
        "#00b863",
        "#1f7a00",
        "#007a45",
      ],
      0.22,
      0.2,
      0.1,
    ],
    Zonsondergang: [
      [
        "#c9d4ff",
        "#e3d2ff",
        "#9a7cf0",
        "#e07ad0",
        "#ff9a3c",
        "#ff7a4a",
        "#f2557a",
        "#e0458f",
      ],
      0.24,
      0.2,
      0.3,
    ],
    Aurora: [
      [
        "#c8f3e6",
        "#cfe0ff",
        "#3fcfa0",
        "#5a8cf0",
        "#14a87a",
        "#7a5ae0",
        "#0a5a50",
        "#4a2a9a",
      ],
      0.24,
      0.2,
      0.35,
    ],
    "Oceaan en koraal": [
      [
        "#cfeef7",
        "#d9f2ee",
        "#45b8d8",
        "#3fc4b0",
        "#ff8a6a",
        "#ff7a5a",
        "#e0505a",
        "#c84068",
      ],
      0.24,
      0.2,
      0.3,
    ],
    "Stripe origineel": [
      [
        "#c7d2fb",
        "#e7ddfb",
        "#9a8cf2",
        "#d78de6",
        "#f7a24b",
        "#f58a5c",
        "#f26a7c",
        "#ea5ca6",
      ],
      0.25,
      0.2,
      0.3,
    ],
  };
  const sjabloonKleuren = (k) =>
    Object.fromEntries(
      DELEN.map((d, i) => [
        d,
        [k[i * 2], mengOklab(k[i * 2], k[i * 2 + 1], 0.5), k[i * 2 + 1]],
      ]),
    );
  const VORMEN = {
    Stripe: {
      twistX: -0.65,
      twistKrachtX: 3.63,
      twistY: 0.41,
      twistKrachtY: 0.7,
      twistZ: -0.58,
      twistKrachtZ: 3.95,
      verplaatsing: -7.821,
      freqX: 0.0058,
      freqZ: 0.016,
    },
    Plooi: {
      twistX: -1.18,
      twistKrachtX: 3.43,
      twistY: 0.39,
      twistKrachtY: 0.96,
      twistZ: -0.5,
      twistKrachtZ: 4.62,
      verplaatsing: -4.92,
      freqX: 0.004,
      freqZ: 0.016,
    },
    Zeil: {
      twistX: -0.43,
      twistKrachtX: 2.27,
      twistY: 0.89,
      twistKrachtY: 0.6,
      twistZ: 1.03,
      twistKrachtZ: 5.04,
      verplaatsing: -7.51,
      freqX: 0.003,
      freqZ: 0.01,
    },
    Sluier: {
      twistX: -1.5,
      twistKrachtX: 1.3,
      twistY: 0.61,
      twistKrachtY: 0.99,
      twistZ: -0.81,
      twistKrachtZ: 2.59,
      verplaatsing: -8.17,
      freqX: 0.005,
      freqZ: 0.013,
    },
    Kelk: {
      twistX: -0.64,
      twistKrachtX: 2.75,
      twistY: 0.4,
      twistKrachtY: 1.9,
      twistZ: -1.01,
      twistKrachtZ: 4.8,
      verplaatsing: -4.53,
      freqX: 0.002,
      freqZ: 0.008,
    },
    Bocht: {
      twistX: -1.97,
      twistKrachtX: 3.66,
      twistY: 0.32,
      twistKrachtY: 0.86,
      twistZ: 1.65,
      twistKrachtZ: 4.03,
      verplaatsing: -5.86,
      freqX: 0.006,
      freqZ: 0.014,
    },
    Zwaai: {
      twistX: -1.87,
      twistKrachtX: 3.27,
      twistY: -0.47,
      twistKrachtY: 0.98,
      twistZ: 1.06,
      twistKrachtZ: 2.87,
      verplaatsing: -3,
      freqX: 0.005,
      freqZ: 0.013,
    },
    Zuil: {
      twistX: -1.09,
      twistKrachtX: 4.35,
      twistY: -0.71,
      twistKrachtY: 1.72,
      twistZ: 0.93,
      twistKrachtZ: 2.37,
      verplaatsing: -4.76,
      freqX: 0.005,
      freqZ: 0.013,
    },
    Draai: {
      twistX: -1.56,
      twistKrachtX: 1.7,
      twistY: -0.76,
      twistKrachtY: 0.51,
      twistZ: 1.68,
      twistKrachtZ: 2.82,
      verplaatsing: -2.62,
      freqX: 0.004,
      freqZ: 0.007,
    },
    Lint: {
      twistX: -1.92,
      twistKrachtX: 1.6,
      twistY: 0.31,
      twistKrachtY: 1.18,
      twistZ: -1.23,
      twistKrachtZ: 4.85,
      verplaatsing: -5.02,
      freqX: 0.002,
      freqZ: 0.008,
    },
  };
  const VORM_SLEUTELS = Object.keys(VORMEN.Stripe);

  // ---------------------------------------------------------------- instellingen
  const kloon = (o) => JSON.parse(JSON.stringify(o));
  const SCROLL_STANDAARD = {
    aan: false,
    draaien: 18,
    ontvouwen: 0.35,
    verschuiven: 12,
    inzoomen: 0.12,
  };
  // De instellingen zoals ze in src/data/golfHero.ts staan zijn de basis; wat ontbreekt
  // (ook in vakjes uit het prototype) wordt daaruit aangevuld.
  function normaliseer(o) {
    const s = kloon(site);
    if (!o || typeof o !== "object") o = {};
    for (const sectie of [
      "opstelling",
      "beweging",
      "vorm",
      "desktop",
      "mobiel",
      "kleurInstel",
    ])
      Object.assign(s[sectie], o[sectie] ?? {});
    // Scrollanimatie bestaat in oudere vakjes nog niet: aanvullen met die van de site.
    s.scroll = {
      ...SCROLL_STANDAARD,
      ...(site.scroll ?? {}),
      ...(o.scroll ?? {}),
    };
    if (s.vorm.vervaging < 1) {
      s.vorm.vervaging = site.vorm.vervaging;
      s.vorm.vervagingBereik = site.vorm.vervagingBereik;
    }
    if (o.vorm && "posX" in o.vorm) {
      s.desktop.posX = o.vorm.posX;
      s.desktop.posY = o.vorm.posY ?? 0;
      delete s.vorm.posX;
      delete s.vorm.posY;
    }
    const k = o.kleuren ?? {};
    for (const d of DELEN) {
      if (Array.isArray(k[d]) && k[d].length === 3) s.kleuren[d] = k[d].slice();
      else if (k[d + "Begin"] && k[d + "Eind"])
        s.kleuren[d] = [
          k[d + "Begin"],
          mengOklab(k[d + "Begin"], k[d + "Eind"], 0.5),
          k[d + "Eind"],
        ];
    }
    // Herkomst van de kleuren (sjabloon en stijl): uit de instellingen zelf, anders die van
    // de site als de kleuren gelijk zijn, anders afgeleid uit de kleuren.
    const bron = o.kleurBron?.basis
      ? o.kleurBron
      : site.kleurBron?.basis &&
          JSON.stringify(s.kleuren) === JSON.stringify(site.kleuren)
        ? site.kleurBron
        : null;
    if (bron) s.kleurBron = kloon(bron);
    else {
      const sl = JSON.stringify(s.kleuren);
      const sjabloon =
        Object.keys(SJABLONEN).find(
          (n) => JSON.stringify(sjabloonKleuren(SJABLONEN[n][0])) === sl,
        ) ?? null;
      s.kleurBron = {
        sjabloon,
        stijl: "Zacht",
        basisStijl: "Zacht",
        basis: kloon(s.kleuren),
        basisInstel: {
          pastel: s.kleurInstel.pastel,
          witheid: s.kleurInstel.witheid,
        },
      };
    }
    return s;
  }
  // Wat nu op de site staat (na "Opslaan in site" bijgewerkt).
  let SITE = normaliseer(site);
  const zonderBron = (o) => {
    const { kleurBron, ...rest } = o;
    return JSON.stringify(rest);
  };

  const LAATST = "nieuwblik-golf-site-laatst";
  const HASH = "#golf=";
  const leesHash = () => {
    try {
      return location.hash.startsWith(HASH)
        ? JSON.parse(
            decodeURIComponent(
              escape(
                atob(
                  location.hash
                    .slice(HASH.length)
                    .replace(/-/g, "+")
                    .replace(/_/g, "/"),
                ),
              ),
            ),
          )
        : null;
    } catch {
      return null;
    }
  };
  const maakHash = (o) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(o))))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  const uitLink = leesHash();
  if (uitLink)
    history.replaceState(
      history.state,
      "",
      location.pathname + location.search,
    );
  // Niet-opgeslagen wijzigingen van de vorige keer gaan voor op de site.
  let S = normaliseer(
    uitLink ??
      (() => {
        try {
          return JSON.parse(localStorage.getItem(LAATST));
        } catch {
          return null;
        }
      })() ??
      site,
  );
  motor.zet(S);

  const pasOpstellingToe = () =>
    hero.classList.toggle("golf-hero--gespiegeld", S.opstelling.spiegel);
  const markeer = () => motor.markeer();
  const papier = () =>
    getComputedStyle(document.body).backgroundColor || "#ffffff";
  function maakAfbeelding(type, metAchtergrond, schaal = 2, kwaliteit = 0.92) {
    let c2;
    motor.momentopnames(
      Math.min(schaal, 4096 / hero.clientWidth),
      [null],
      () => {
        c2 = motor.kopie(metAchtergrond ? papier() : null);
      },
    );
    return new Promise((klaar) => c2.toBlob(klaar, type, kwaliteit));
  }
  const download = (blob, naam) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = naam;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  // Terugvalbeeld op een vaste maat: een tweede golf op een canvas buiten beeld.
  function terugvalbeeld(breedte, hoogte, schaal, kwaliteit) {
    const doos = document.createElement("div");
    doos.style.cssText = `position:fixed;left:-20000px;top:0;width:${breedte}px;height:${hoogte}px;pointer-events:none`;
    const c = document.createElement("canvas");
    c.style.cssText = "display:block;width:100%;height:100%";
    doos.appendChild(c);
    document.body.appendChild(doos);
    const m = startGolf(c, kloon(S));
    if (!m) {
      doos.remove();
      return Promise.reject(new Error("geen WebGL"));
    }
    let beeld;
    m.momentopnames(schaal, [null], () => {
      beeld = m.kopie(null);
    });
    m.stop();
    doos.remove();
    return new Promise((klaar) => beeld.toBlob(klaar, "image/webp", kwaliteit));
  }
  const naarBase64 = (blob) =>
    new Promise((klaar) => {
      const r = new FileReader();
      r.onload = () => klaar(String(r.result).split(",")[1]);
      r.readAsDataURL(blob);
    });

  // ---------------------------------------------------------------- paneel
  const META = {
    vorm: {
      Twist: {
        twistX: [-3, 3, 0.01, "Twist X"],
        twistKrachtX: [0, 8, 0.01, "Kracht X"],
        twistY: [-3, 3, 0.01, "Twist Y"],
        twistKrachtY: [0, 8, 0.01, "Kracht Y"],
        twistZ: [-3, 3, 0.01, "Twist Z"],
        twistKrachtZ: [0, 8, 0.01, "Kracht Z"],
      },
      Golving: {
        verplaatsing: [-30, 30, 0.1, "Hoogte"],
        freqX: [0, 0.05, 0.0001, "Frequentie in de lengte"],
        freqZ: [0, 0.05, 0.0001, "Frequentie dwars"],
        snelheid: [0, 0.6, 0.01, "Snelheid"],
      },
      Licht: {
        glow: [0, 5, 0.01, "Gloed"],
        glowMacht: [0.1, 3, 0.01, "Contrast"],
        glowRamp: [0.05, 1, 0.01, "Overgang"],
      },
      Afwerking: {
        vervaging: [0, 80, 0.5, "Vervaging boven en onder (px)"],
        vervagingBereik: [0.05, 0.6, 0.01, "Bereik van de vervaging"],
        korrel: [0, 3, 0.05, "Filmkorrel"],
      },
    },
    positie: {
      posX: [-80, 80, 0.5, "Horizontaal (%)"],
      posY: [-80, 80, 0.5, "Verticaal (%)"],
      schaal: [0.3, 4, 0.01, "Grootte"],
      rotatie: [-180, 180, 0.5, "Draaien (graden)"],
    },
    kleurInstel: {
      vouwOvergang: [0, 0.3, 0.005, "Overgang voor- en achterkant bij de vouw"],
      pastel: [0, 0.6, 0.01, "Oplichten in vlakke delen"],
      witheid: [0, 1, 0.01, "Witheid (0 = fel, 1 = pastel)"],
      vezels: [0, 0.6, 0.01, "Vezels in de plooien"],
      vezelBasis: [0, 0.5, 0.01, "Vezels over het hele vel"],
      banen: [0, 0.3, 0.005, "Zijdebanen"],
    },
  };
  const ICOON = {
    terug:
      '<path d="M5 3.5L2 6.5l3 3M2 6.5h7.5a3.5 3.5 0 010 7H7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    vooruit:
      '<path d="M11 3.5l3 3-3 3M14 6.5H6.5a3.5 3.5 0 000 7H9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    oog: '<path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    telefoon:
      '<rect x="4.5" y="1.5" width="7" height="13" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7 12.2h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    sluit:
      '<path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    slotDicht:
      '<rect x="3.5" y="7" width="9" height="7" rx="1.5" fill="currentColor"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    slotOpen:
      '<rect x="3.5" y="7" width="9" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5a2.5 2.5 0 015 0" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  };
  const svg = (n) =>
    `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">${ICOON[n]}</svg>`;

  const paneel = document.createElement("div");
  paneel.className = "golf-paneel";
  // Het muiswiel hoort bij het paneel, niet bij de smooth scroll (Lenis) van de pagina.
  paneel.setAttribute("data-lenis-prevent", "");
  paneel.setAttribute("role", "dialog");
  paneel.setAttribute("aria-label", "Golf afstellen");
  paneel.innerHTML = `
    <div class="p-kop" title="Sleep naar een andere hoek van het scherm">
      <h2 class="p-titel">Golf afstellen</h2>
      <div class="p-kopknoppen">
        <button class="p-ikoon" type="button" data-actie="terug" aria-label="Ongedaan maken (Ctrl+Z)" title="Ongedaan maken (Ctrl+Z)">${svg("terug")}</button>
        <button class="p-ikoon" type="button" data-actie="vooruit" aria-label="Opnieuw (Ctrl+Y)" title="Opnieuw (Ctrl+Y)">${svg("vooruit")}</button>
        <button class="p-ikoon" type="button" data-actie="voorbeeld" aria-label="Voorbeeld schermvullend" title="Voorbeeld schermvullend">${svg("oog")}</button>
        <button class="p-ikoon" type="button" data-actie="mobiel" aria-label="Mobiel voorbeeld" title="Mobiel voorbeeld" aria-pressed="false">${svg("telefoon")}</button>
        <button class="p-ikoon" type="button" data-actie="sluit" aria-label="Sluiten (Esc)" title="Sluiten (Esc)">${svg("sluit")}</button>
      </div>
    </div>
    <div class="vakjes"><div class="vakjes-rij" role="group" aria-label="Opgeslagen instellingen"></div>
      <p class="vakjes-uitleg">Klik op een leeg vakje om op te slaan, op een gevuld vakje om te laden. Shift+klik overschrijft, rechtsklik maakt leeg.</p></div>
    <div class="tabs" role="tablist"><button type="button" role="tab" data-tab="vorm" class="actief">Vorm</button><button type="button" role="tab" data-tab="kleuren">Kleuren</button></div>
    <div class="p-inhoud"><div class="tab actief" data-tab="vorm"></div><div class="tab" data-tab="kleuren"></div></div>
    <div class="acties">
      <div class="acties-hoofd"><button type="button" class="secundair" data-actie="herstel" title="Terug naar wat nu op de site staat">Zoals op de site</button><button type="button" class="primair" data-actie="opslaan">Opslaan in site</button></div>
      <div class="acties-meer">
        <button type="button" data-actie="kopieer" title="Instellingen als JSON kopieren">Kopieren</button>
        <button type="button" data-actie="exporteer" title="Instellingen als JSON-bestand downloaden">Exporteren</button>
        <button type="button" data-actie="importeer" title="Instellingen uit een JSON-bestand laden">Importeren</button>
        <button type="button" data-actie="deel" title="Link met deze instellingen kopieren">Deellink</button>
        <button type="button" data-actie="png" title="Transparante PNG op 2x">PNG</button>
        <button type="button" data-actie="webp" title="WebP op 2x met achtergrond">WebP</button>
      </div>
    </div>`;
  document.body.appendChild(paneel);
  opruimen.push(() => paneel.remove());
  const $ = (sel) => paneel.querySelector(sel);
  const tabVorm = $('.tab[data-tab="vorm"]'),
    tabKleur = $('.tab[data-tab="kleuren"]');
  paneel.querySelectorAll(".tabs button").forEach((b) =>
    b.addEventListener("click", () => {
      paneel
        .querySelectorAll(".tabs button, .tab")
        .forEach((e) =>
          e.classList.toggle("actief", e.dataset.tab === b.dataset.tab),
        );
    }),
  );
  const melding = (knop, tekst) => {
    const oud = knop.textContent;
    knop.textContent = tekst;
    setTimeout(() => (knop.textContent = oud), 1500);
  };

  // ---------------------------------------------------------------- opslag op schijf (alleen ontwikkelomgeving)
  let schijf = false;
  const naarSchijf = (data) => {
    if (schijf)
      fetch("/__golf/opslag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {});
  };

  // ---------------------------------------------------------------- geschiedenis (ongedaan maken)
  const velden = [];
  let geschiedenis = [JSON.stringify(S)],
    stap = 0;
  const vernieuw = () => {
    velden.forEach((f) => f());
    pasOpstellingToe();
    markeer();
    stuurVoorbeeld();
    knoppenGeschiedenis();
    toonOpslaan();
  };
  function bewaar() {
    const j = JSON.stringify(S);
    try {
      if (zonderBron(S) === zonderBron(SITE)) localStorage.removeItem(LAATST);
      else localStorage.setItem(LAATST, j);
    } catch {
      /* geen opslag */
    }
    toonOpslaan();
    if (j === geschiedenis[stap]) return;
    geschiedenis = geschiedenis.slice(0, stap + 1);
    geschiedenis.push(j);
    if (geschiedenis.length > 120) geschiedenis.shift();
    stap = geschiedenis.length - 1;
    knoppenGeschiedenis();
  }
  function ganaar(i) {
    if (i < 0 || i >= geschiedenis.length) return;
    stap = i;
    S = JSON.parse(geschiedenis[stap]);
    motor.zet(S);
    vernieuw();
    try {
      localStorage.setItem(LAATST, geschiedenis[stap]);
    } catch {
      /* geen opslag */
    }
  }
  function knoppenGeschiedenis() {
    $('[data-actie="terug"]').disabled = stap === 0;
    $('[data-actie="vooruit"]').disabled = stap >= geschiedenis.length - 1;
  }
  const toepassen = (o) => {
    S = normaliseer(o);
    motor.zet(S);
    vernieuw();
    bewaar();
  };
  function toonOpslaan() {
    const k = $('[data-actie="opslaan"]');
    const gelijk = zonderBron(S) === zonderBron(SITE);
    k.disabled = gelijk || !schijf;
    k.hidden = !schijf;
    if (!k.dataset.bezig)
      k.textContent = gelijk ? "Staat op de site" : "Opslaan in site";
    $('[data-actie="herstel"]').disabled = gelijk;
  }

  // ---------------------------------------------------------------- bouwstenen
  const groep = (doel, titel) => {
    const g = document.createElement("section");
    g.className = "groep";
    g.innerHTML = `<h3 class="groep-titel">${titel}</h3>`;
    doel.appendChild(g);
    return g;
  };
  const decimalen = (st) => (String(st).split(".")[1] || "").length;
  function schuif(doel, sectie, sleutel, [min, max, st, naam], opWijzig) {
    const l = document.createElement("label");
    l.className = "veld";
    l.innerHTML = `<span class="veld-kop"><span class="veld-naam">${naam}</span><output class="veld-waarde"></output></span><input type="range" min="${min}" max="${max}" step="${st}">`;
    const inp = l.querySelector("input"),
      out = l.querySelector("output");
    const toon = () => {
      const v = sectie()[sleutel];
      inp.value = v;
      out.textContent = (+v).toFixed(decimalen(st));
      inp.style.setProperty("--vul", `${((v - min) / (max - min)) * 100}%`);
    };
    inp.addEventListener("input", () => {
      sectie()[sleutel] = +inp.value;
      toon();
      opWijzig?.();
      markeer();
      stuurVoorbeeld();
    });
    inp.addEventListener("change", bewaar);
    velden.push(toon);
    toon();
    doel.appendChild(l);
    return l;
  }
  function schakelaar(doel, naam, uitleg, lees, zet) {
    const l = document.createElement("label");
    l.className = "schakel";
    l.innerHTML = `<span class="schakel-tekst"><span class="veld-naam">${naam}</span><span class="schakel-uitleg">${uitleg}</span></span><input type="checkbox" role="switch"><span class="schakel-baan" aria-hidden="true"></span>`;
    const inp = l.querySelector("input");
    inp.addEventListener("change", () => {
      zet(inp.checked);
      vernieuw();
      bewaar();
    });
    velden.push(() => {
      inp.checked = lees();
    });
    inp.checked = lees();
    doel.appendChild(l);
  }
  function chips(doel, label, opties, lees, kies) {
    const c = document.createElement("div");
    c.className = "chips";
    c.setAttribute("role", "radiogroup");
    c.setAttribute("aria-label", label);
    const zet = () =>
      c.querySelectorAll("button").forEach((x) => {
        const a = x.dataset.waarde === lees();
        x.classList.toggle("actief", a);
        x.setAttribute("aria-checked", a);
      });
    for (const o of opties) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o;
      b.dataset.waarde = o;
      b.setAttribute("role", "radio");
      b.addEventListener("click", () => {
        kies(o);
        zet();
      });
      c.appendChild(b);
    }
    velden.push(zet);
    zet();
    doel.appendChild(c);
    return c;
  }
  const hint = (doel, tekst) =>
    doel.insertAdjacentHTML("beforeend", `<p class="veld-hint">${tekst}</p>`);

  // ---------------------------------------------------------------- tab Vorm
  const gVormen = groep(tabVorm, "Vormen");
  const vormRaster = document.createElement("div");
  vormRaster.className = "vormen";
  gVormen.appendChild(vormRaster);
  const vormNaam = () =>
    Object.keys(VORMEN).find((n) =>
      VORM_SLEUTELS.every((k) => Math.abs(S.vorm[k] - VORMEN[n][k]) < 1e-6),
    ) ?? "";
  const vormKaart = {};
  for (const naam of Object.keys(VORMEN)) {
    const b = document.createElement("button");
    b.type = "button";
    b.innerHTML = `<canvas class="vorm-beeld" aria-hidden="true"></canvas><span>${naam}</span>`;
    b.addEventListener("click", () => {
      Object.assign(S.vorm, VORMEN[naam]);
      vernieuw();
      bewaar();
    });
    vormKaart[naam] = b.querySelector("canvas");
    velden.push(() => b.classList.toggle("actief", vormNaam() === naam));
    vormRaster.appendChild(b);
  }
  let beeldSleutel = "",
    beeldGepland = 0;
  function tekenVormbeelden() {
    if (
      !paneel.classList.contains("open") ||
      !tabVorm.classList.contains("actief")
    )
      return;
    const sl = JSON.stringify([
      S.kleuren,
      S.kleurInstel,
      S.opstelling.spiegel,
      motor.profiel(),
      S.vorm.glow,
      S.vorm.glowMacht,
      S.vorm.glowRamp,
      hero.clientWidth,
      hero.clientHeight,
    ]);
    if (sl === beeldSleutel) return;
    beeldSleutel = sl;
    const namen = Object.keys(VORMEN);
    motor.momentopnames(
      320 / hero.clientWidth,
      namen.map((n) => VORMEN[n]),
      (i) => motor.kopie(null, vormKaart[namen[i]]),
    );
  }
  const planVormbeelden = () => {
    clearTimeout(beeldGepland);
    beeldGepland = setTimeout(tekenVormbeelden, 250);
  };
  velden.push(planVormbeelden);
  paneel
    .querySelector('.tabs [data-tab="vorm"]')
    .addEventListener("click", planVormbeelden);

  const KARAKTER = {
    Rustig: { k: 0.6, golf: 5 },
    Gebalanceerd: { k: 1, golf: 8 },
    Uitgesproken: { k: 1.3, golf: 9 },
  };
  const vormGen = { karakter: "Gebalanceerd", variatie: 0.3 };
  const tussen = (a, b) => a + Math.random() * (b - a);
  const teken1 = () => (Math.random() < 0.5 ? -1 : 1);
  const rond = (v, st) => +(Math.round(v / st) * st).toFixed(decimalen(st));
  const VORM_META = Object.assign({}, META.vorm.Twist, META.vorm.Golving);
  function zetVorm(v) {
    for (const k of VORM_SLEUTELS) {
      const [min, max, st] = VORM_META[k];
      S.vorm[k] = rond(Math.min(max, Math.max(min, v[k])), st);
    }
    vernieuw();
    bewaar();
  }
  const gVgen = groep(tabVorm, "Vormgenerator");
  chips(
    gVgen,
    "Karakter",
    Object.keys(KARAKTER),
    () => vormGen.karakter,
    (o) => {
      vormGen.karakter = o;
    },
  );
  const vgKnoppen = document.createElement("div");
  vgKnoppen.className = "knoppen-rij";
  vgKnoppen.innerHTML =
    '<button type="button" class="gen-knop" data-v="nieuw">Nieuwe vorm</button><button type="button" class="gen-knop" data-v="variatie">Variatie op deze</button>';
  gVgen.appendChild(vgKnoppen);
  schuif(gVgen, () => vormGen, "variatie", [
    0.05,
    1,
    0.01,
    "Sterkte van de variatie",
  ]);
  vgKnoppen.querySelector('[data-v="nieuw"]').addEventListener("click", () => {
    const { k, golf } = KARAKTER[vormGen.karakter];
    zetVorm({
      twistX: (Math.random() < 0.85 ? -1 : 1) * tussen(0.4, 1.6) * k,
      twistKrachtX: tussen(1.6, 4.5),
      twistY: teken1() * tussen(0.2, 1.1) * k,
      twistKrachtY: tussen(0.4, 2),
      twistZ: teken1() * tussen(0.3, 1.4) * k,
      twistKrachtZ: tussen(2.2, 5.2),
      verplaatsing: -tussen(2, golf),
      freqX: tussen(0.002, 0.006),
      freqZ: tussen(0.006, 0.016),
    });
  });
  vgKnoppen
    .querySelector('[data-v="variatie"]')
    .addEventListener("click", () => {
      const v = {};
      for (const k of VORM_SLEUTELS) {
        const [min, max] = VORM_META[k];
        v[k] =
          S.vorm[k] +
          (Math.random() * 2 - 1) * (max - min) * 0.06 * vormGen.variatie;
      }
      const binnen = (x, a, b, nu) =>
        nu >= a && nu <= b ? Math.min(b, Math.max(a, x)) : x;
      v.verplaatsing = binnen(v.verplaatsing, -12, 12, S.vorm.verplaatsing);
      v.freqX = binnen(v.freqX, 0.001, 0.008, S.vorm.freqX);
      v.freqZ = binnen(v.freqZ, 0.004, 0.02, S.vorm.freqZ);
      zetVorm(v);
    });
  hint(gVgen, "Niet mooi? Ctrl+Z gaat terug naar de vorige vorm.");

  const gOpst = groep(tabVorm, "Opstelling");
  schakelaar(
    gOpst,
    "Spiegelen",
    "Golf links, tekst rechts",
    () => S.opstelling.spiegel,
    (v) => (S.opstelling.spiegel = v),
  );
  let bewerk = "desktop";
  gOpst.insertAdjacentHTML(
    "beforeend",
    '<span class="veld-label">Positie en grootte voor</span>',
  );
  chips(
    gOpst,
    "Positie en grootte voor",
    ["Desktop", "Mobiel"],
    () => (bewerk === "desktop" ? "Desktop" : "Mobiel"),
    (o) => {
      bewerk = o === "Desktop" ? "desktop" : "mobiel";
      velden.forEach((f) => f());
      if (bewerk === "mobiel" && !mobielAan) zetMobiel(true);
    },
  );
  for (const [k, m] of Object.entries(META.positie))
    schuif(gOpst, () => S[bewerk], k, m);
  hint(
    gOpst,
    "Mobiel geldt bij een smal of staand scherm. Kies Mobiel om het voorbeeld ernaast te zien.",
  );

  const gBew = groep(tabVorm, "Beweging");
  schakelaar(
    gBew,
    "Ademen",
    "Heel langzaam levende vervorming",
    () => S.opstelling.adem,
    (v) => (S.opstelling.adem = v),
  );
  schuif(gBew, () => S.beweging, "ademKracht", [0, 3, 0.05, "Sterkte ademen"]);
  schakelaar(
    gBew,
    "Muis",
    "Kantelt en verschuift licht mee met de muis",
    () => S.opstelling.muis,
    (v) => (S.opstelling.muis = v),
  );
  schuif(gBew, () => S.beweging, "muisKracht", [0, 3, 0.05, "Sterkte muis"]);
  if (reduced)
    hint(
      gBew,
      "Je systeem vraagt om minder beweging; ademen, muis en scrollanimatie staan daarom stil.",
    );

  // Scrollanimatie: naar rato van hoe ver de hero uit beeld is gescrold.
  const gScroll = groep(tabVorm, "Scrollanimatie");
  schakelaar(
    gScroll,
    "Aan",
    "De golf beweegt mee terwijl je de hero uit scrolt",
    () => S.scroll.aan,
    (v) => (S.scroll.aan = v),
  );
  schuif(gScroll, () => S.scroll, "draaien", [
    -90,
    90,
    0.5,
    "Draaien (graden)",
  ]);
  schuif(gScroll, () => S.scroll, "ontvouwen", [0, 1, 0.01, "Ontvouwen"]);
  schuif(gScroll, () => S.scroll, "verschuiven", [
    -60,
    60,
    0.5,
    "Achterblijven (%)",
  ]);
  schuif(gScroll, () => S.scroll, "inzoomen", [-0.5, 1, 0.01, "Inzoomen"]);
  hint(
    gScroll,
    "Scroll de pagina om het effect te zien; het paneel blijft staan. De waarden gelden voor het moment dat de hero helemaal uit beeld is.",
  );

  for (const [titel, lijst] of Object.entries(META.vorm)) {
    const g = groep(tabVorm, titel);
    for (const [k, m] of Object.entries(lijst)) schuif(g, () => S.vorm, k, m);
  }

  // ---------------------------------------------------------------- tab Kleuren
  const HARMONIE = {
    Monochroom: { delen: [0, 0, 0, 0], lengte: 0 },
    Analoog: { delen: [-36, -12, 12, 36], lengte: 18 },
    Complementair: { delen: [0, 12, 180, 196], lengte: 16 },
    Gesplitst: { delen: [0, 18, 150, 212], lengte: 14 },
    Triade: { delen: [0, 30, 120, 240], lengte: 14 },
    "Koel en warm": { delen: [-150, -95, 0, 30], lengte: 20 },
    Tetrade: { delen: [0, 90, 180, 270], lengte: 12 },
  };
  const STIJL = {
    Zacht: {
      L: [0.94, 0.78, 0.62, 0.46],
      C: [0.22, 0.8, 1.0, 0.6],
      witheid: 1,
      pastel: 0.25,
      maxC: 0.22,
    },
    Levendig: {
      L: [0.86, 0.74, 0.64, 0.5],
      C: [0.6, 1.05, 1.15, 0.9],
      witheid: 0.45,
      pastel: 0.2,
      maxC: 0.28,
    },
    Intens: {
      L: [0.82, 0.72, 0.64, 0.5],
      C: [0.9, 1.25, 1.35, 1.1],
      witheid: 0.12,
      pastel: 0.16,
      maxC: 0.32,
    },
  };
  const sloten = {
    voorRand: false,
    voorVouw: false,
    achterVouw: false,
    achterRand: false,
  };
  function pasStijlToe() {
    const b = S.kleurBron,
      van = STIJL[b.basisStijl],
      naar = STIJL[b.stijl],
      gelijk = b.stijl === b.basisStijl;
    DELEN.forEach((d, i) => {
      if (sloten[d]) return;
      S.kleuren[d] = gelijk
        ? b.basis[d].slice()
        : b.basis[d].map((hx) => {
            const [L, C, h] = hexNaarOklch(hx);
            return oklchNaarHex(
              Math.min(0.98, Math.max(0.12, L + naar.L[i] - van.L[i])),
              C * (naar.C[i] / van.C[i]),
              h,
            );
          });
    });
    Object.assign(
      S.kleurInstel,
      gelijk ? b.basisInstel : { witheid: naar.witheid, pastel: naar.pastel },
    );
  }
  const nieuweBasis = (sjabloon = null) => {
    S.kleurBron = {
      sjabloon,
      stijl: S.kleurBron.stijl,
      basisStijl: S.kleurBron.stijl,
      basis: kloon(S.kleuren),
      basisInstel: {
        pastel: S.kleurInstel.pastel,
        witheid: S.kleurInstel.witheid,
      },
    };
  };
  const gStijl = groep(tabKleur, "Stijl");
  chips(
    gStijl,
    "Stijl",
    ["Zacht", "Levendig", "Intens"],
    () => S.kleurBron.stijl,
    (o) => {
      S.kleurBron.stijl = o;
      pasStijlToe();
      vernieuw();
      bewaar();
    },
  );
  hint(
    gStijl,
    "Werkt op het gekozen sjabloon, de generator en je eigen kleuren. Zacht is het sjabloon zoals het is ontworpen.",
  );

  const gSjab = groep(tabKleur, "Sjablonen");
  const sjab = document.createElement("div");
  sjab.className = "sjablonen";
  gSjab.appendChild(sjab);
  for (const [naam, [k, pastel, vezels, witheid]] of Object.entries(
    SJABLONEN,
  )) {
    const b = document.createElement("button");
    b.type = "button";
    const kl = sjabloonKleuren(k);
    b.innerHTML = `<span class="staal" style="background:linear-gradient(90deg,${k[0]},${k[2]},${k[4]},${k[6]})"></span>${naam}`;
    b.addEventListener("click", () => {
      S.kleurBron = {
        sjabloon: naam,
        stijl: S.kleurBron.stijl,
        basisStijl: "Zacht",
        basis: kloon(kl),
        basisInstel: { pastel, witheid },
      };
      S.kleurInstel.vezels = vezels;
      pasStijlToe();
      vernieuw();
      bewaar();
    });
    velden.push(() =>
      b.classList.toggle("actief", S.kleurBron.sjabloon === naam),
    );
    sjab.appendChild(b);
  }

  const gen = {
    basis: "#1a9e4d",
    harmonie: "Analoog",
    mix: 0.5,
    diepte: 0.6,
    verzadiging: 1,
  };
  function genereer() {
    const [, C0, h1] = hexNaarOklch(gen.basis);
    const hm = HARMONIE[gen.harmonie],
      st = STIJL[S.kleurBron.stijl],
      d = gen.diepte;
    const c = Math.min(st.maxC, Math.max(0.08, C0)) * gen.verzadiging;
    const dL = [0, -0.06 * d, -0.08 * d, -0.2 * d];
    DELEN.forEach((deel, i) => {
      if (sloten[deel]) return;
      S.kleuren[deel] = [0, 0.5, 1].map((f) =>
        oklchNaarHex(
          st.L[i] + dL[i] + 0.03 * (f - 0.5),
          c * st.C[i] * (0.92 + 0.16 * f),
          (h1 + hm.delen[i] * gen.mix + hm.lengte * (0.4 + gen.mix) * f + 720) %
            360,
        ),
      );
    });
    Object.assign(S.kleurInstel, { witheid: st.witheid, pastel: st.pastel });
    nieuweBasis();
    vernieuw();
  }
  const gGen = groep(tabKleur, "Generator");
  const genBasis = document.createElement("label");
  genBasis.className = "kleur";
  genBasis.innerHTML = `<input type="color" aria-label="Basiskleur"><span class="kleur-naam">Basiskleur</span><span class="kleur-hex"></span>`;
  const gbInp = genBasis.querySelector("input"),
    gbHex = genBasis.querySelector(".kleur-hex");
  const toonBasis = () => {
    gbInp.value = gen.basis;
    gbHex.textContent = gen.basis;
  };
  gbInp.addEventListener("input", () => {
    gen.basis = gbInp.value;
    toonBasis();
    genereer();
  });
  gbInp.addEventListener("change", bewaar);
  toonBasis();
  gGen.appendChild(genBasis);
  chips(
    gGen,
    "Harmonie",
    Object.keys(HARMONIE),
    () => gen.harmonie,
    (o) => {
      gen.harmonie = o;
      genereer();
      bewaar();
    },
  );
  schuif(
    gGen,
    () => gen,
    "mix",
    [0, 1, 0.01, "Kleurmix (0 = een familie, 1 = volle mix)"],
    genereer,
  );
  schuif(gGen, () => gen, "diepte", [0, 1, 0.01, "Diepte"], genereer);
  schuif(
    gGen,
    () => gen,
    "verzadiging",
    [0.2, 1.6, 0.01, "Verzadiging"],
    genereer,
  );
  const genStrook = document.createElement("div");
  genStrook.className = "gen-voorbeeld";
  genStrook.setAttribute("aria-hidden", "true");
  gGen.appendChild(genStrook);
  velden.push(
    () =>
      (genStrook.style.background = `linear-gradient(90deg, ${DELEN.flatMap((d) => S.kleuren[d]).join(", ")})`),
  );
  const genKnop = document.createElement("button");
  genKnop.type = "button";
  genKnop.className = "gen-knop";
  genKnop.textContent = "Verrassing";
  gGen.appendChild(genKnop);
  const gok = (a) => a[Math.floor(Math.random() * a.length)];
  genKnop.addEventListener("click", () => {
    S.kleurBron.stijl = gok(Object.keys(STIJL));
    Object.assign(gen, {
      basis: oklchNaarHex(0.6, 0.08 + Math.random() * 0.1, Math.random() * 360),
      harmonie: gok(Object.keys(HARMONIE)),
      mix: +(0.3 + Math.random() * 0.7).toFixed(2),
      diepte: +(0.3 + Math.random() * 0.6).toFixed(2),
      verzadiging: +(0.7 + Math.random() * 0.6).toFixed(2),
    });
    toonBasis();
    genereer();
    bewaar();
    velden.forEach((f) => f());
  });
  hint(
    gGen,
    "Vergrendelde delen (slotje hieronder) blijven staan bij de generator en Verrassing.",
  );

  const DEEL_NAAM = {
    voorRand: "Rand",
    voorVouw: "Bij de vouw",
    achterVouw: "Bij de vouw",
    achterRand: "Rand",
  };
  const deelRegel = (doel, deel) => {
    const r = document.createElement("div");
    r.className = "deel";
    r.innerHTML = `<div class="deel-kop"><span class="kleur-naam">${DEEL_NAAM[deel]}</span><button type="button" class="slot" aria-pressed="false" title="Vergrendelen voor generator en Verrassing"></button></div>
      <div class="deel-stops">${[0, 1, 2].map((i) => `<input type="color" aria-label="${DEEL_NAAM[deel]}, ${["begin", "midden", "eind"][i]}">`).join("")}<span class="deel-strook" aria-hidden="true"></span></div>`;
    const ins = r.querySelectorAll("input"),
      slot = r.querySelector(".slot"),
      strook = r.querySelector(".deel-strook");
    const toon = () => {
      ins.forEach((inp, i) => {
        inp.value = S.kleuren[deel][i];
        inp.title = S.kleuren[deel][i];
      });
      strook.style.background = `linear-gradient(90deg, ${S.kleuren[deel].join(", ")})`;
      slot.innerHTML = svg(sloten[deel] ? "slotDicht" : "slotOpen");
      slot.setAttribute("aria-pressed", sloten[deel]);
      slot.classList.toggle("dicht", sloten[deel]);
      slot.setAttribute(
        "aria-label",
        sloten[deel]
          ? `${DEEL_NAAM[deel]} ontgrendelen`
          : `${DEEL_NAAM[deel]} vergrendelen`,
      );
    };
    ins.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        S.kleuren[deel][i] = inp.value;
        nieuweBasis();
        markeer();
        stuurVoorbeeld();
        velden.forEach((f) => f());
      });
      inp.addEventListener("change", bewaar);
    });
    slot.addEventListener("click", () => {
      sloten[deel] = !sloten[deel];
      toon();
    });
    velden.push(toon);
    toon();
    doel.appendChild(r);
  };
  const gVoor = groep(tabKleur, "Voorkant");
  deelRegel(gVoor, "voorRand");
  deelRegel(gVoor, "voorVouw");
  const gAchter = groep(tabKleur, "Achterkant");
  deelRegel(gAchter, "achterVouw");
  deelRegel(gAchter, "achterRand");
  const gOpp = groep(tabKleur, "Oppervlak");
  for (const [k, m] of Object.entries(META.kleurInstel)) {
    schuif(
      gOpp,
      () => S.kleurInstel,
      k,
      m,
      () => {
        if (
          k in S.kleurBron.basisInstel &&
          S.kleurBron.stijl === S.kleurBron.basisStijl
        )
          S.kleurBron.basisInstel[k] = S.kleurInstel[k];
      },
    );
  }

  // ---------------------------------------------------------------- opslagvakjes
  const VAKJES = "nieuwblik-golf-vakjes";
  const leesVakjes = () => {
    try {
      const v = JSON.parse(localStorage.getItem(VAKJES) || "[]");
      return Array.from({ length: 10 }, (_, i) => v[i] ?? null);
    } catch {
      return Array(10).fill(null);
    }
  };
  const schrijfVakjes = (v) => {
    try {
      localStorage.setItem(VAKJES, JSON.stringify(v));
    } catch {
      /* geen opslag */
    }
    naarSchijf({ vakjes: v });
  };
  const vakjes = leesVakjes();
  let actiefVak = -1;
  const rij = $(".vakjes-rij");
  function tekenVakjes() {
    rij.innerHTML = "";
    vakjes.forEach((v, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "vak";
      if (v) {
        const k = normaliseer(v).kleuren;
        b.classList.add("gevuld");
        b.style.setProperty(
          "--staal",
          `linear-gradient(135deg, ${k.voorRand[0]}, ${k.voorVouw[1]}, ${k.achterVouw[1]}, ${k.achterRand[2]})`,
        );
        b.classList.toggle("gespiegeld", !!v.opstelling?.spiegel);
        b.setAttribute("aria-label", `Vakje ${i + 1}: instellingen laden`);
      } else {
        b.textContent = i + 1;
        b.setAttribute(
          "aria-label",
          `Vakje ${i + 1}: huidige instellingen opslaan`,
        );
      }
      b.classList.toggle("actief", i === actiefVak);
      b.addEventListener("click", (e) => {
        if (!vakjes[i] || e.shiftKey) {
          vakjes[i] = kloon(S);
          schrijfVakjes(vakjes);
          actiefVak = i;
          tekenVakjes();
          rij.children[i].dataset.melding = "Opgeslagen";
        } else {
          toepassen(vakjes[i]);
          actiefVak = i;
          tekenVakjes();
          rij.children[i].dataset.melding = "Geladen";
        }
        setTimeout(
          () => rij.children[i] && delete rij.children[i].dataset.melding,
          1100,
        );
      });
      b.addEventListener("contextmenu", (e) => {
        if (!vakjes[i]) return;
        e.preventDefault();
        vakjes[i] = null;
        schrijfVakjes(vakjes);
        if (actiefVak === i) actiefVak = -1;
        tekenVakjes();
      });
      rij.appendChild(b);
    });
  }
  tekenVakjes();

  // ---------------------------------------------------------------- knoppen
  $('[data-actie="herstel"]').addEventListener("click", () => toepassen(SITE));
  $('[data-actie="opslaan"]').addEventListener("click", async (e) => {
    const knop = e.currentTarget;
    knop.dataset.bezig = "1";
    knop.disabled = true;
    knop.textContent = "Bezig met opslaan";
    try {
      // Terugvalbeelden op dezelfde maten als eerder: desktop 1600 x 900, mobiel 390 x 844 op 2x.
      const [desktop, mobiel] = await Promise.all([
        terugvalbeeld(1600, 900, 1, 0.82),
        terugvalbeeld(390, 844, 2, 0.8),
      ]);
      const r = await fetch("/__golf/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instellingen: S,
          desktop: await naarBase64(desktop),
          mobiel: await naarBase64(mobiel),
        }),
      });
      if (!r.ok) throw new Error(await r.text());
      SITE = kloon(S);
      try {
        localStorage.removeItem(LAATST);
      } catch {
        /* geen opslag */
      }
      knop.textContent = "Opgeslagen";
    } catch (fout) {
      console.error("Golf opslaan mislukt", fout);
      knop.textContent = "Opslaan mislukt";
    }
    setTimeout(() => {
      delete knop.dataset.bezig;
      toonOpslaan();
    }, 1800);
  });
  $('[data-actie="kopieer"]').addEventListener("click", async (e) => {
    const knop = e.currentTarget;
    try {
      await navigator.clipboard.writeText(JSON.stringify(S, null, 2));
      melding(knop, "Gekopieerd");
    } catch {
      console.log(JSON.stringify(S, null, 2));
      melding(knop, "In console");
    }
  });
  $('[data-actie="exporteer"]').addEventListener("click", () =>
    download(
      new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }),
      "golf-instellingen.json",
    ),
  );
  const bestand = document.createElement("input");
  bestand.type = "file";
  bestand.accept = "application/json,.json";
  bestand.hidden = true;
  paneel.appendChild(bestand);
  $('[data-actie="importeer"]').addEventListener("click", () =>
    bestand.click(),
  );
  bestand.addEventListener("change", async () => {
    const f = bestand.files?.[0];
    if (!f) return;
    try {
      toepassen(JSON.parse(await f.text()));
      melding($('[data-actie="importeer"]'), "Geladen");
    } catch {
      melding($('[data-actie="importeer"]'), "Ongeldig");
    }
    bestand.value = "";
  });
  $('[data-actie="deel"]').addEventListener("click", async (e) => {
    const knop = e.currentTarget,
      url = `${location.origin}${location.pathname}?afstellen${HASH}${maakHash(S)}`;
    try {
      await navigator.clipboard.writeText(url);
      melding(knop, "Gekopieerd");
    } catch {
      prompt("Deellink", url);
    }
  });
  $('[data-actie="png"]').addEventListener("click", async () =>
    download(await maakAfbeelding("image/png", false), "golf.png"),
  );
  $('[data-actie="webp"]').addEventListener("click", async () =>
    download(await maakAfbeelding("image/webp", true), "golf.webp"),
  );
  $('[data-actie="terug"]').addEventListener("click", () => ganaar(stap - 1));
  $('[data-actie="vooruit"]').addEventListener("click", () => ganaar(stap + 1));
  $('[data-actie="sluit"]').addEventListener("click", () => zetPaneel(false));
  const html = document.documentElement;
  const zetPaneel = (aan) => {
    paneel.classList.toggle("open", aan);
    html.classList.toggle("golf-paneel-open", aan);
    if (aan) planVormbeelden();
    else if (mobielAan) zetMobiel(false);
  };
  opruimen.push(() =>
    html.classList.remove(
      "golf-paneel-open",
      "golf-voorbeeld-modus",
      "golf-zonder-tekst",
    ),
  );

  // ---------------------------------------------------------------- voorbeeld schermvullend
  const pil = document.createElement("div");
  pil.className = "golf-voorbeeld-pil";
  pil.innerHTML =
    '<button type="button" data-v="tekst">Tekst verbergen</button><button type="button" data-v="terug" class="primair">Terug naar afstellen</button>';
  document.body.appendChild(pil);
  opruimen.push(() => pil.remove());
  const zetVoorbeeld = (aan) => {
    html.classList.toggle("golf-voorbeeld-modus", aan);
    html.classList.remove("golf-zonder-tekst");
    pil.querySelector('[data-v="tekst"]').textContent = "Tekst verbergen";
    if (aan && mobielAan) zetMobiel(false);
    if (aan) scrollTo({ top: 0 });
    zetPaneel(!aan);
  };
  $('[data-actie="voorbeeld"]').addEventListener("click", () =>
    zetVoorbeeld(true),
  );
  pil
    .querySelector('[data-v="terug"]')
    .addEventListener("click", () => zetVoorbeeld(false));
  pil.querySelector('[data-v="tekst"]').addEventListener("click", (e) => {
    const z = html.classList.toggle("golf-zonder-tekst");
    e.currentTarget.textContent = z ? "Tekst tonen" : "Tekst verbergen";
  });

  // ---------------------------------------------------------------- mobiel voorbeeld
  const mobielVak = document.createElement("div");
  mobielVak.className = "golf-mobiel-voorbeeld";
  mobielVak.innerHTML =
    '<div class="golf-mobiel-scherm"><iframe title="Mobiel voorbeeld" tabindex="-1"></iframe></div><p>Mobiel, 390 x 844</p>';
  document.body.appendChild(mobielVak);
  opruimen.push(() => mobielVak.remove());
  const iframe = mobielVak.querySelector("iframe");
  let mobielAan = false,
    stuurGepland = false;
  function stuurVoorbeeld() {
    if (!mobielAan || stuurGepland) return;
    stuurGepland = true;
    requestAnimationFrame(() => {
      stuurGepland = false;
      iframe.contentWindow?.postMessage(
        { type: "golf-instellingen", instellingen: S },
        location.origin,
      );
    });
  }
  // Het voorbeeld meldt zich zodra de golf daar draait; dan de huidige instellingen sturen.
  luister(window, "message", (e) => {
    if (e.origin === location.origin && e.data?.type === "golf-voorbeeld-klaar")
      stuurVoorbeeld();
  });
  function zetMobiel(aan) {
    mobielAan = aan;
    mobielVak.classList.toggle("open", aan);
    $('[data-actie="mobiel"]').setAttribute("aria-pressed", aan);
    if (aan && !iframe.src) iframe.src = location.pathname + "?golfvoorbeeld";
    if (aan) {
      bewerk = "mobiel";
      velden.forEach((f) => f());
    }
    plaatsMobiel();
    stuurVoorbeeld();
  }
  $('[data-actie="mobiel"]').addEventListener("click", () =>
    zetMobiel(!mobielAan),
  );

  // ---------------------------------------------------------------- paneel verplaatsen (hoeken)
  const HOEK = "nieuwblik-golf-hoek";
  const HOEKEN = ["rb", "lb", "ro", "lo"];
  let hoek = (() => {
    try {
      const v = localStorage.getItem(HOEK);
      return HOEKEN.includes(v) ? v : "rb";
    } catch {
      return "rb";
    }
  })();
  function plaatsMobiel() {
    mobielVak.classList.toggle("links", hoek[0] === "r");
  }
  function zetHoek(hk) {
    HOEKEN.forEach((x) => paneel.classList.toggle("hoek-" + x, x === hk));
    hoek = hk;
    plaatsMobiel();
    try {
      localStorage.setItem(HOEK, hk);
    } catch {
      /* geen opslag */
    }
  }
  zetHoek(hoek);
  const kop = $(".p-kop");
  kop.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("button") || innerWidth <= 760)
      return;
    e.preventDefault();
    const r = paneel.getBoundingClientRect(),
      dx = e.clientX - r.left,
      dy = e.clientY - r.top;
    kop.setPointerCapture(e.pointerId);
    paneel.classList.add("sleept");
    paneel.style.left = r.left + "px";
    paneel.style.top = r.top + "px";
    const beweeg = (ev) => {
      paneel.style.left =
        Math.min(innerWidth - r.width, Math.max(0, ev.clientX - dx)) + "px";
      paneel.style.top =
        Math.min(innerHeight - r.height, Math.max(0, ev.clientY - dy)) + "px";
    };
    const los = () => {
      kop.removeEventListener("pointermove", beweeg);
      kop.removeEventListener("pointerup", los);
      kop.removeEventListener("pointercancel", los);
      const eerst = paneel.getBoundingClientRect(),
        mx = eerst.left + eerst.width / 2,
        my = eerst.top + eerst.height / 2;
      paneel.classList.remove("sleept");
      paneel.style.left = paneel.style.top = "";
      zetHoek(
        (mx > innerWidth / 2 ? "r" : "l") + (my > innerHeight / 2 ? "o" : "b"),
      );
      const na = paneel.getBoundingClientRect();
      paneel.style.transition = "none";
      paneel.style.transform = `translate(${eerst.left - na.left}px, ${eerst.top - na.top}px)`;
      paneel.getBoundingClientRect();
      paneel.style.transition = "transform .38s cubic-bezier(.22,1,.36,1)";
      paneel.style.transform = "";
      setTimeout(() => {
        paneel.style.transition = "";
      }, 420);
    };
    kop.addEventListener("pointermove", beweeg);
    kop.addEventListener("pointerup", los);
    kop.addEventListener("pointercancel", los);
  });

  // ---------------------------------------------------------------- toetsen
  luister(window, "keydown", (e) => {
    const t = e.target;
    if (
      t?.closest?.(
        "input:not([type=range]):not([type=checkbox]):not([type=color]), textarea, select, [contenteditable=true]",
      )
    )
      return;
    const ctrl = e.ctrlKey || e.metaKey,
      toets = e.key.toLowerCase();
    const open =
      paneel.classList.contains("open") ||
      html.classList.contains("golf-voorbeeld-modus");
    if (open && ctrl && toets === "z" && !e.shiftKey) {
      e.preventDefault();
      ganaar(stap - 1);
      return;
    }
    if (open && ctrl && (toets === "y" || (toets === "z" && e.shiftKey))) {
      e.preventDefault();
      ganaar(stap + 1);
      return;
    }
    if (e.key === "Escape" && open) {
      if (html.classList.contains("golf-voorbeeld-modus")) zetVoorbeeld(false);
      else zetPaneel(false);
      return;
    }
    if (toets === "p" && !ctrl && !e.altKey)
      zetPaneel(!paneel.classList.contains("open"));
  });

  vernieuw();
  // Opslag op schijf (ontwikkelomgeving): gedeelde vakjes met het prototype.
  fetch("/__golf/opslag", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return;
      schijf = true;
      let anders = false;
      (d.vakjes ?? []).slice(0, 10).forEach((v, i) => {
        if (v && !vakjes[i]) {
          vakjes[i] = v;
          anders = true;
        }
      });
      if (anders) {
        try {
          localStorage.setItem(VAKJES, JSON.stringify(vakjes));
        } catch {
          /* geen opslag */
        }
        tekenVakjes();
      }
      toonOpslaan();
    })
    .catch(() => {
      /* geen ontwikkelserver */
    });
  // Open meteen als er niet-opgeslagen wijzigingen of een deellink zijn.
  if (uitLink || zonderBron(S) !== zonderBron(SITE)) zetPaneel(true);

  return () => {
    clearTimeout(beeldGepland);
    opruimen.forEach((f) => f());
  };
}
