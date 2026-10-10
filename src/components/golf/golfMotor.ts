// Zijden golf in WebGL2 voor de homepage-hero. Afgesteld in het prototype
// (_prototypes/hero-golf, afstelpaneel met toets p); de instellingen staan in
// src/data/golfHero.ts.
//
// Opbouw (zelfde principe als de golf op stripe.com, eigen code):
// 1. Een in de lengte dubbelgevouwen vel: dwars een smalle U met een ronde vouw, zodat
//    voor- en achterkant tegelijk zichtbaar zijn. Lichte hoogteverplaatsing met
//    simplex-ruis en drie twists rond schuine assen die volgens een exponentiele stap
//    over het vel verlopen.
// 2. Orthografische camera in CSS-pixels die er schuin op kijkt.
// 3. Kleur uit een paletvlak (OKLCH) over het hele vel. Samengeperste delen blijven
//    verzadigd, vlakke delen lichten op; de samendrukking wordt per pixel exact uit de
//    vorm berekend. Daarover zijdevezels die alleen oplichten.
// 4. Nabewerking: gaussische vervaging naar boven- en onderrand en filmkorrel.
//
// Prestaties: alleen tekenen als er iets beweegt of verandert en de hero in beeld is;
// zwakke toestellen krijgen een grover raster zonder multisampling.

export type GolfDeel = "voorRand" | "voorVouw" | "achterVouw" | "achterRand";
export type GolfProfiel = {
  posX: number;
  posY: number;
  schaal: number;
  rotatie: number;
};
export type GolfInstellingen = {
  opstelling: { spiegel: boolean; adem: boolean; muis: boolean };
  beweging: { ademKracht: number; muisKracht: number };
  vorm: {
    twistX: number;
    twistKrachtX: number;
    twistY: number;
    twistKrachtY: number;
    twistZ: number;
    twistKrachtZ: number;
    verplaatsing: number;
    freqX: number;
    freqZ: number;
    snelheid: number;
    glow: number;
    glowMacht: number;
    glowRamp: number;
    vervaging: number;
    vervagingBereik: number;
    korrel: number;
  };
  desktop: GolfProfiel;
  mobiel: GolfProfiel;
  kleuren: Record<GolfDeel, string[]>;
  kleurInstel: {
    pastel: number;
    witheid: number;
    vezels: number;
    vezelBasis: number;
    banen: number;
    vouwOvergang: number;
  };
  /** Herkomst van de kleuren (sjabloon en stijl) voor het afstelpaneel; de golf zelf gebruikt het niet. */
  kleurBron?: unknown;
};

const DELEN: GolfDeel[] = ["voorRand", "voorVouw", "achterVouw", "achterRand"];

/** Mobiel profiel bij een smal of staand vlak (zelfde regel als het prototype). */
export const isMobielVlak = (b: number, h: number) => b < 760 || b / h < 0.9;

// ------------------------------------------------------------------ kleur (OKLab/OKLCH)
const naarLin = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const vanLin = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
function hexNaarOklab(hx: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map((i) =>
    naarLin(parseInt(hx.slice(i, i + 2), 16) / 255),
  ) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function oklabNaarLin(
  L: number,
  A: number,
  B: number,
): [number, number, number] {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

type Lch = [number, number, number];
const smooth = (f: number) => f * f * (3 - 2 * f);
const naarLch = ([L, A, B]: [number, number, number]): Lch => [
  L,
  Math.hypot(A, B),
  Math.atan2(B, A),
];
// Mengen op de kleurcirkel: helderheid en verzadiging lineair, tint via de kortste weg, zodat
// het midden tussen twee verre tinten fel blijft. Bij (bijna) grijs telt de andere tint.
function meng(a: Lch, b: Lch, f: number): Lch {
  const ha = a[1] < 0.02 ? b[2] : a[2],
    hb = b[1] < 0.02 ? a[2] : b[2];
  let dh = hb - ha;
  if (dh > Math.PI) dh -= 2 * Math.PI;
  if (dh < -Math.PI) dh += 2 * Math.PI;
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, ha + dh * f];
}

// Paletvlak: breedte langs het vel (drie stops per deel), hoogte dwars over het vel van de
// rand van de voorkant via de vouw naar de rand van de achterkant. Rond de vouw lopen voor-
// en achterkant over een zone in elkaar over, zodat de omslag geen harde kleurgrens wordt.
const PALET_B = 256,
  PALET_H = 96;
function paletData(S: GolfInstellingen) {
  const b = S.kleurInstel.vouwOvergang;
  const strook = DELEN.map((d) => {
    const st = S.kleuren[d].map((hx) => naarLch(hexNaarOklab(hx)));
    return Array.from({ length: PALET_B }, (_, x) => {
      const t = x / (PALET_B - 1),
        seg = t < 0.5 ? 0 : 1,
        f = smooth(seg ? (t - 0.5) * 2 : t * 2);
      return meng(st[seg]!, st[seg + 1]!, f);
    });
  });
  const grenzen: [number, number, number, number] = [0, 0.5 - b, 0.5 + b, 1];
  const data = new Uint8Array(PALET_B * PALET_H * 4);
  for (let y = 0; y < PALET_H; y++) {
    const u = y / (PALET_H - 1);
    const s = u < grenzen[1] ? 0 : u < grenzen[2] ? 1 : 2;
    const g0 = grenzen[s]!,
      g1 = grenzen[s + 1]!;
    const f = smooth(
      g1 > g0 ? Math.min(1, Math.max(0, (u - g0) / (g1 - g0))) : 0,
    );
    for (let x = 0; x < PALET_B; x++) {
      const [L, C, h] = meng(strook[s]![x]!, strook[s + 1]![x]!, f);
      const rgb = oklabNaarLin(L, C * Math.cos(h), C * Math.sin(h));
      const o = (y * PALET_B + x) * 4;
      for (let i = 0; i < 3; i++)
        data[o + i] = Math.round(
          Math.min(1, Math.max(0, vanLin(Math.min(1, Math.max(0, rgb[i]!))))) *
            255,
        );
      data[o + 3] = 255;
    }
  }
  return data;
}

// ------------------------------------------------------------------ shaders
// 2D simplex-ruis (Ashima Arts / Stefan Gustavson, MIT-licentie).
const RUIS = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}`;

const VS_GOLF = `#version 300 es
precision highp float;
in vec2 a_uv;
uniform mat4 u_mv; uniform vec2 u_canvas; uniform vec2 u_res; uniform float u_tijd, u_klok, u_adem, u_muisTwist;
uniform float u_twistX, u_twistKrachtX, u_twistY, u_twistKrachtY, u_twistZ, u_twistKrachtZ;
uniform float u_verplaatsing, u_freqX, u_freqZ;
out vec2 v_uv; out vec4 v_J;
${RUIS}
float expStap(float x, float n) { return exp2(-exp2(n) * pow(x, n)); }
mat3 draai(vec3 as, float hoek) {
  as = normalize(as); float s = sin(hoek), c = cos(hoek), oc = 1.0 - c;
  return mat3(oc*as.x*as.x + c,      oc*as.x*as.y - as.z*s, oc*as.z*as.x + as.y*s,
              oc*as.x*as.y + as.z*s, oc*as.y*as.y + c,      oc*as.y*as.z - as.x*s,
              oc*as.z*as.x - as.y*s, oc*as.y*as.z + as.x*s, oc*as.z*as.z + c);
}
vec3 vel(vec2 uv) {
  float u = clamp(uv.x, 0.0, 1.0), a = (u - 0.5) * 2.0, y, z;
  if (abs(a) > 0.08) { z = -100.0 + 400.0 * min(u, 1.0 - u); y = a < 0.0 ? 4.0 : -4.0; }
  else { float phi = (a / 0.08) * 1.5707963; z = 84.0 + 4.0 * cos(phi); y = -4.0 * sin(phi); }
  vec3 p = vec3(-200.0 + 400.0 * uv.y, y, z);
  p.y += u_verplaatsing * snoise(vec2(p.x * u_freqX + u_tijd, p.z * u_freqZ + u_tijd));
  float a1 = 1.0 + u_adem * 0.035 * sin(u_klok * 0.32);
  float a2 = 1.0 + u_adem * 0.03 * sin(u_klok * 0.27 + 1.7);
  float a3 = 1.0 + u_adem * 0.03 * sin(u_klok * 0.23 + 3.1);
  p = p * draai(vec3(0.5, 0.0, 0.5), (u_twistY + u_muisTwist) * a1 * expStap(u, u_twistKrachtY));
  p = p * draai(vec3(0.0, 0.5, 0.5), u_twistX * a2 * expStap(uv.y, u_twistKrachtX));
  p = p * draai(vec3(0.5, 0.0, 0.5), u_twistZ * a3 * expStap(uv.y, u_twistKrachtZ));
  return p;
}
vec3 clip(vec2 uv) { vec4 m = u_mv * vec4(vel(uv), 1.0); return vec3(m.x * 2.0 / u_canvas.x, m.y * 2.0 / u_canvas.y, clamp((-m.z - 5000.0) / 3000.0, -1.0, 1.0)); }
void main() {
  v_uv = a_uv;
  vec3 c = clip(a_uv);
  // Schermafgeleiden (apparaatpixels per uv-eenheid), vloeiend over de driehoeken.
  const float e = 0.0015;
  vec2 su = (clip(a_uv + vec2(e, 0.0)).xy - clip(a_uv - vec2(e, 0.0)).xy) / (2.0 * e) * 0.5 * u_res;
  vec2 sv = (clip(a_uv + vec2(0.0, e)).xy - clip(a_uv - vec2(0.0, e)).xy) / (2.0 * e) * 0.5 * u_res;
  v_J = vec4(su, sv);
  gl_Position = vec4(c, 1.0);
}`;

const FS_GOLF = `#version 300 es
precision highp float;
in vec2 v_uv; in vec4 v_J;
uniform vec2 u_res; uniform sampler2D u_palet; uniform float u_dpr;
uniform float u_glow, u_glowMacht, u_glowRamp, u_pastel, u_witheid, u_vezels, u_vezelBasis, u_banen;
out vec4 kleur;
${RUIS}
float parabool(float x, float k) { return pow(4.0 * x * (1.0 - x), k); }
void main() {
  float det = v_J.x * v_J.w - v_J.z * v_J.y;
  det = abs(det) < 1e-6 ? 1e-6 : det;
  float dvdy = v_J.x / det;
  vec2 dudp = vec2(v_J.w, -v_J.z) / det;
  float pdy = dvdy * u_res.y * u_glow;
  pdy = clamp(pdy * 0.5 + 0.5, 0.0, 1.0);
  pdy = clamp(smoothstep(0.0, u_glowRamp, pow(pdy, u_glowMacht)), 0.0, 1.0);
  vec3 c = texture(u_palet, vec2(v_uv.y, v_uv.x)).rgb;
  float n0 = snoise(vec2(v_uv.x * 0.1, v_uv.y * 0.5));
  float f = 600.0 + 300.0 * n0;
  float n1 = snoise(vec2(v_uv.x * f, v_uv.y * 4.0 * n0)) * 0.5 + 0.5;
  // Vezels alleen op de schaal waarop ze als fijne zijde lezen.
  float vp = f * length(dudp);
  n1 = mix(n1, 0.5, smoothstep(0.35, 0.8, vp));
  n1 = mix(0.5, n1, smoothstep(0.03, 0.1, vp * u_dpr));
  c += n1 * u_vezels * (1.0 - c.b * 0.9) * pdy * (1.0 - parabool(v_uv.x, 3.0));
  // Glans en zijdebanen: alleen oplichten, nooit donkere strepen.
  vec3 ruimte = 1.0 - clamp(c, 0.0, 1.0);
  c += ruimte * max(n1 - 0.5, 0.0) * u_vezelBasis;
  float fb = 90.0 + 40.0 * n0;
  float bp = fb * length(dudp);
  float banen = snoise(vec2(v_uv.x * fb, v_uv.y * 1.5 + n0 * 2.0)) * (1.0 - smoothstep(0.4, 0.9, bp)) * smoothstep(0.02, 0.07, bp * u_dpr);
  c += ruimte * max(banen, 0.0) * u_banen;
  float licht = (1.0 - pdy) * u_pastel;
  vec3 helder = c / max(max(c.r, c.g), max(c.b, 0.001));
  c = mix(c, mix(helder, vec3(1.0), u_witheid), clamp(licht * 2.0, 0.0, 1.0));
  kleur = vec4(clamp(c, 0.0, 1.0), 1.0);
}`;

const VS_VLAK = `#version 300 es
in vec2 a_p; out vec2 v_uv;
void main() { v_uv = a_p * 0.5 + 0.5; gl_Position = vec4(a_p, 0.0, 1.0); }`;

const FS_NA = `#version 300 es
precision highp float;
in vec2 v_uv; uniform sampler2D u_scene; uniform float u_vervaging, u_bereik, u_dpr, u_korrel, u_zaad;
out vec4 kleur;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  // Gaussische vervaging die naar boven- en onderrand toeneemt; straal in CSS-pixels.
  float e = max(smoothstep(1.0 - u_bereik, 1.0, v_uv.y), smoothstep(1.0 - u_bereik, 1.0, 1.0 - v_uv.y));
  float r = u_vervaging * u_dpr * e * e;
  vec4 c;
  if (r < 0.5) c = texture(u_scene, v_uv);
  else {
    vec2 px = 1.0 / vec2(textureSize(u_scene, 0));
    float a0 = hash(gl_FragCoord.xy) * 6.2831853;
    vec4 som = vec4(0.0); float ws = 0.0;
    for (int i = 0; i < 32; i++) {
      float f = (float(i) + 0.5) / 32.0, a = float(i) * 2.3999632 + a0;
      float g = exp(-2.5 * f);
      som += texture(u_scene, v_uv + vec2(cos(a), sin(a)) * sqrt(f) * r * px) * g; ws += g;
    }
    c = som / ws;
  }
  c.rgb += (hash(gl_FragCoord.xy + u_zaad) - 0.5) * 0.045 * u_korrel * c.a;
  kleur = vec4(clamp(c.rgb, 0.0, c.a), c.a);
}`;

// Beeldmatrix van de camera (kolomsgewijs), gemeten op een canvas van 1393 CSS-pixels breed.
const MV = [
  -2.5913, 7.5977, -4.0694, 0, -7.5845, -2.5433, 0.0812, 0, -0.6759, 2.158,
  4.4594, 0, 380.146, -301.7, -5004.499, 1,
];
const REF_B = 1393;
const VORM_UNIFORMS = [
  "twistX",
  "twistKrachtX",
  "twistY",
  "twistKrachtY",
  "twistZ",
  "twistKrachtZ",
  "verplaatsing",
  "freqX",
  "freqZ",
  "glow",
  "glowMacht",
  "glowRamp",
] as const;
const KLEUR_UNIFORMS = [
  "pastel",
  "witheid",
  "vezels",
  "vezelBasis",
  "banen",
] as const;

type Opties = {
  /** Na het eerste getekende beeld (om het terugvalbeeld weg te laten vloeien). */
  opEersteBeeld?: () => void;
  /** Als de WebGL-context wegvalt (terugvalbeeld weer tonen). */
  opVerloren?: () => void;
};

export type GolfMotor = {
  /** Stoppen en het GPU-geheugen vrijgeven. */
  stop: () => void;
  /** Andere instellingen gebruiken (het afstelpaneel past het object ook zelf aan). */
  zet: (instellingen: GolfInstellingen) => void;
  /** Opnieuw tekenen na een aanpassing in de instellingen. */
  markeer: () => void;
  instellingen: () => GolfInstellingen;
  /** Profiel dat nu geldt (mobiel bij een smal of staand vlak). */
  profiel: () => GolfProfiel;
  /**
   * Teken de scene op een andere resolutie, per vorm uit de lijst (null = huidige
   * vorm), en roep na elk beeld opBeeld aan. Daarna meteen weer op schermresolutie.
   */
  momentopnames: (
    schaal: number,
    vormen: (Partial<GolfInstellingen["vorm"]> | null)[],
    opBeeld: (i: number) => void,
  ) => void;
  /** Kopie van het canvas, gespiegeld als de opstelling dat is. */
  kopie: (
    achtergrond: string | null,
    doel?: HTMLCanvasElement,
    breedte?: number,
    hoogte?: number,
  ) => HTMLCanvasElement;
};

/**
 * Start de golf op een canvas. Geeft null als WebGL2 ontbreekt of de shaders
 * niet bouwen (dan blijft het terugvalbeeld staan).
 */
export function startGolf(
  canvas: HTMLCanvasElement,
  start: GolfInstellingen,
  opties: Opties = {},
): GolfMotor | null {
  let S = start;
  const context = canvas.getContext("webgl2", {
    antialias: false,
    premultipliedAlpha: true,
    alpha: true,
  });
  if (!context) return null;
  const gl: WebGL2RenderingContext = context;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const geheugen =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const zwak =
    (matchMedia("(pointer: coarse)").matches && geheugen <= 4) ||
    (navigator.hardwareConcurrency ?? 8) <= 4;

  let pGolf: WebGLProgram, pNa: WebGLProgram;
  let vaoGolf: WebGLVertexArrayObject | null = null,
    vaoVlak: WebGLVertexArrayObject | null = null;
  let paletTex: WebGLTexture | null = null,
    sceneTex: WebGLTexture | null = null;
  let msFbo: WebGLFramebuffer | null = null,
    texFbo: WebGLFramebuffer | null = null;
  let msKleur: WebGLRenderbuffer | null = null,
    msDiepte: WebGLRenderbuffer | null = null;
  let aantalIdx = 0,
    w = 0,
    h = 0;
  let UG: (n: string) => WebGLUniformLocation | null = () => null;
  let UN: (n: string) => WebGLUniformLocation | null = () => null;

  function prog(vs: string, fs: string) {
    const maak = (t: number, bron: string) => {
      const s = gl.createShader(t)!;
      gl.shaderSource(s, bron);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, maak(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, maak(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(p) ?? "programma");
    return p;
  }
  const uniformCache = (p: WebGLProgram) => {
    const cache = new Map<string, WebGLUniformLocation | null>();
    return (n: string) => {
      if (!cache.has(n)) cache.set(n, gl.getUniformLocation(p, n));
      return cache.get(n) ?? null;
    };
  };

  function opbouw() {
    pGolf = prog(VS_GOLF, FS_GOLF);
    pNa = prog(VS_VLAK, FS_NA);
    UG = uniformCache(pGolf);
    UN = uniformCache(pNa);
    // Raster 257 x 129; zwakke toestellen 129 x 65.
    const RIJEN = zwak ? 129 : 257,
      KOL = zwak ? 65 : 129;
    const uv = new Float32Array(RIJEN * KOL * 2);
    for (let r = 0, k = 0; r < RIJEN; r++)
      for (let c = 0; c < KOL; c++, k++) {
        uv[k * 2] = c / (KOL - 1);
        uv[k * 2 + 1] = 1 - r / (RIJEN - 1);
      }
    const idx = new Uint32Array((RIJEN - 1) * (KOL - 1) * 6);
    for (let r = 0, k = 0; r < RIJEN - 1; r++)
      for (let c = 0; c < KOL - 1; c++) {
        const a = r * KOL + c,
          b = a + 1,
          d = a + KOL,
          e = d + 1;
        idx[k++] = a;
        idx[k++] = d;
        idx[k++] = b;
        idx[k++] = b;
        idx[k++] = d;
        idx[k++] = e;
      }
    aantalIdx = idx.length;
    vaoGolf = gl.createVertexArray();
    gl.bindVertexArray(vaoGolf);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    const lUv = gl.getAttribLocation(pGolf, "a_uv");
    gl.enableVertexAttribArray(lUv);
    gl.vertexAttribPointer(lUv, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    vaoVlak = gl.createVertexArray();
    gl.bindVertexArray(vaoVlak);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const la = gl.getAttribLocation(pNa, "a_p");
    gl.enableVertexAttribArray(la);
    gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
    paletTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, paletTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    paletSleutel = "";
    bouwPalet();
    w = h = 0;
  }

  // Paletvlak alleen opnieuw opbouwen als de kleuren veranderen.
  let paletSleutel = "";
  function bouwPalet() {
    const sleutel = JSON.stringify([S.kleuren, S.kleurInstel.vouwOvergang]);
    if (sleutel === paletSleutel) return;
    paletSleutel = sleutel;
    gl.bindTexture(gl.TEXTURE_2D, paletTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      PALET_B,
      PALET_H,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      paletData(S),
    );
  }

  function buffers() {
    if (msKleur) gl.deleteRenderbuffer(msKleur);
    if (msDiepte) gl.deleteRenderbuffer(msDiepte);
    if (msFbo) gl.deleteFramebuffer(msFbo);
    if (texFbo) gl.deleteFramebuffer(texFbo);
    if (sceneTex) gl.deleteTexture(sceneTex);
    const samples = zwak
      ? 0
      : Math.min(4, gl.getParameter(gl.MAX_SAMPLES) as number);
    msFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, msFbo);
    msKleur = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, msKleur);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.RGBA8, w, h);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.RENDERBUFFER,
      msKleur,
    );
    msDiepte = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, msDiepte);
    gl.renderbufferStorageMultisample(
      gl.RENDERBUFFER,
      samples,
      gl.DEPTH_COMPONENT24,
      w,
      h,
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      msDiepte,
    );
    sceneTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, texFbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      sceneTex,
      0,
    );
  }
  let exportSchaal = 0;
  function maat() {
    const dpr = exportSchaal || Math.min(devicePixelRatio || 1, zwak ? 1.5 : 2);
    const nw = Math.round(canvas.clientWidth * dpr),
      nh = Math.round(canvas.clientHeight * dpr);
    if (!nw || !nh || (nw === w && nh === h)) return false;
    canvas.width = w = nw;
    canvas.height = h = nh;
    buffers();
    return true;
  }

  let vuil = true,
    zichtbaar = true,
    verloren = false,
    eersteBeeld = false,
    frame = 0;
  let klok = 0,
    tijd = 0,
    vorige = performance.now();
  const muis = { x: 0, y: 0, dx: 0, dy: 0 },
    scroll = { doel: 0, nu: 0 };
  const opMuis = (e: PointerEvent) => {
    muis.dx = e.clientX / innerWidth - 0.5;
    muis.dy = e.clientY / innerHeight - 0.5;
  };
  const opScroll = () => {
    scroll.doel = scrollY;
  };
  // Muis en scroll alleen volgen als de opstelling dat vraagt.
  let luistert = false;
  const luister = () => {
    if (luistert || !S.opstelling.muis || reduced) return;
    luistert = true;
    addEventListener("pointermove", opMuis, { passive: true });
    addEventListener("scroll", opScroll, { passive: true });
  };

  function teken(nu: number) {
    const dt = Math.min(0.1, Math.max(0, (nu - vorige) / 1000));
    vorige = nu;
    const beweegt = !reduced && (S.vorm.snelheid > 0 || S.opstelling.adem);
    if (!zichtbaar || verloren) return;
    if (beweegt) {
      klok += dt;
      tijd +=
        dt *
        (S.vorm.snelheid +
          (S.opstelling.adem ? 0.02 * S.beweging.ademKracht : 0));
    }
    // Muis en scroll volgen met een zachte naloop.
    const volg = 1 - Math.pow(0.004, dt),
      mee = S.opstelling.muis && !reduced;
    const oud = muis.x + muis.y + scroll.nu;
    muis.x += ((mee ? muis.dx : 0) - muis.x) * volg;
    muis.y += ((mee ? muis.dy : 0) - muis.y) * volg;
    scroll.nu += ((mee ? scroll.doel : 0) - scroll.nu) * volg;
    const loopt = Math.abs(muis.x + muis.y + scroll.nu - oud) > 1e-4;
    if (maat()) vuil = true;
    if (!(vuil || beweegt || loopt) || !w || !h) return;
    vuil = false;
    luister();
    bouwPalet();

    const W = canvas.clientWidth,
      H = canvas.clientHeight,
      kr = S.beweging.muisKracht;
    const pr = isMobielVlak(W, H) ? S.mobiel : S.desktop;
    const k = ((0.8 * W) / REF_B) * pr.schaal,
      mv = MV.slice();
    for (let i = 0; i < 12; i++) if (i % 4 !== 3) mv[i] = mv[i]! * k;
    // Draaien in het schermvlak rond het midden van het vel; positief = met de klok mee.
    if (pr.rotatie) {
      const a = (-pr.rotatie * Math.PI) / 180,
        cs = Math.cos(a),
        sn = Math.sin(a);
      for (const o of [0, 4, 8]) {
        const x = mv[o]!,
          y = mv[o + 1]!;
        mv[o] = cs * x - sn * y;
        mv[o + 1] = sn * x + cs * y;
      }
    }
    mv[12] =
      mv[12]! * k +
      0.1 * W +
      (pr.posX / 100) * W +
      muis.x * 0.03 * W * kr * (S.opstelling.spiegel ? -1 : 1);
    mv[13] =
      mv[13]! * k -
      (pr.posY / 100) * H -
      muis.y * 0.03 * H * kr -
      scroll.nu * 0.18 * kr;

    gl.bindFramebuffer(gl.FRAMEBUFFER, msFbo);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.useProgram(pGolf);
    gl.bindVertexArray(vaoGolf);
    gl.uniformMatrix4fv(UG("u_mv"), false, mv);
    gl.uniform2f(UG("u_canvas"), W, H);
    gl.uniform2f(UG("u_res"), w, h);
    gl.uniform1f(UG("u_dpr"), w / W);
    gl.uniform1f(UG("u_tijd"), tijd);
    gl.uniform1f(UG("u_klok"), klok);
    gl.uniform1f(
      UG("u_adem"),
      S.opstelling.adem && !reduced ? S.beweging.ademKracht : 0,
    );
    gl.uniform1f(UG("u_muisTwist"), muis.x * 0.08 * kr);
    for (const n of VORM_UNIFORMS) gl.uniform1f(UG("u_" + n), S.vorm[n]);
    for (const n of KLEUR_UNIFORMS)
      gl.uniform1f(UG("u_" + n), S.kleurInstel[n]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, paletTex);
    gl.uniform1i(UG("u_palet"), 0);
    gl.drawElements(gl.TRIANGLES, aantalIdx, gl.UNSIGNED_INT, 0);

    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, msFbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, texFbo);
    gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(pNa);
    gl.bindVertexArray(vaoVlak);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(UN("u_scene"), 0);
    gl.uniform1f(UN("u_vervaging"), S.vorm.vervaging);
    gl.uniform1f(UN("u_bereik"), S.vorm.vervagingBereik);
    gl.uniform1f(UN("u_dpr"), w / W);
    gl.uniform1f(UN("u_korrel"), S.vorm.korrel);
    gl.uniform1f(UN("u_zaad"), beweegt ? (nu % 1000) * 0.017 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!eersteBeeld) {
      eersteBeeld = true;
      opties.opEersteBeeld?.();
    }
  }
  const lus = (nu: number) => {
    teken(nu);
    frame = requestAnimationFrame(lus);
  };

  // Niet tekenen buiten beeld.
  const kijker = new IntersectionObserver((e) => {
    zichtbaar = e[0]?.isIntersecting ?? true;
    if (zichtbaar) vuil = true;
  });
  kijker.observe(canvas);
  // WebGL-context kwijt (bijv. GPU-reset): terugvalbeeld tonen en bij herstel opnieuw opbouwen.
  const opVerloren = (e: Event) => {
    e.preventDefault();
    verloren = true;
    eersteBeeld = false;
    opties.opVerloren?.();
  };
  const opHersteld = () => {
    try {
      opbouw();
      verloren = false;
      vuil = true;
    } catch {
      /* blijft terugvalbeeld */
    }
  };
  canvas.addEventListener("webglcontextlost", opVerloren);
  canvas.addEventListener("webglcontextrestored", opHersteld);

  try {
    opbouw();
  } catch {
    return null;
  }
  frame = requestAnimationFrame(lus);

  const momentopnames: GolfMotor["momentopnames"] = (
    schaal,
    vormen,
    opBeeld,
  ) => {
    const vormNu = S.vorm,
      was = zichtbaar;
    exportSchaal = schaal;
    zichtbaar = true;
    vormen.forEach((v, i) => {
      S.vorm = v ? { ...vormNu, ...v } : vormNu;
      vuil = true;
      teken(performance.now());
      opBeeld(i);
    });
    S.vorm = vormNu;
    exportSchaal = 0;
    vuil = true;
    teken(performance.now());
    zichtbaar = was;
  };
  const kopie: GolfMotor["kopie"] = (
    achtergrond,
    doel = document.createElement("canvas"),
    breedte = w,
    hoogte = h,
  ) => {
    doel.width = breedte;
    doel.height = hoogte;
    const ctx = doel.getContext("2d")!;
    if (achtergrond) {
      ctx.fillStyle = achtergrond;
      ctx.fillRect(0, 0, breedte, hoogte);
    }
    if (S.opstelling.spiegel) {
      ctx.translate(breedte, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(canvas, 0, 0, breedte, hoogte);
    return doel;
  };

  return {
    stop: () => {
      cancelAnimationFrame(frame);
      kijker.disconnect();
      removeEventListener("pointermove", opMuis);
      removeEventListener("scroll", opScroll);
      canvas.removeEventListener("webglcontextlost", opVerloren);
      canvas.removeEventListener("webglcontextrestored", opHersteld);
      // GPU-geheugen meteen vrijgeven bij het verlaten van de pagina.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
    zet: (instellingen) => {
      S = instellingen;
      vuil = true;
    },
    markeer: () => {
      vuil = true;
    },
    instellingen: () => S,
    profiel: () =>
      isMobielVlak(canvas.clientWidth, canvas.clientHeight)
        ? S.mobiel
        : S.desktop,
    momentopnames,
    kopie,
  };
}
