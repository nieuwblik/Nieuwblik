import {
  useEffect,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { CalendarCheck } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";
import { useDarkNavSection } from "@/components/UnderlayNav";
import desktop1600 from "@/assets/contact/appje-desktop-1600.webp";
import desktop2560 from "@/assets/contact/appje-desktop-2560.webp";
import mobiel750 from "@/assets/contact/appje-mobiel-750.webp";
import mobiel1080 from "@/assets/contact/appje-mobiel-1080.webp";

/*
 * "Contact? Eén appje is genoeg."
 *
 * Schermvullende sectie onderaan de homepage. Terwijl je scrolt blijft hij
 * staan (sticky, geen gekaapte scroll) en speelt er een WhatsApp-gesprek af
 * rondom de telefoon op de foto: typbolletjes, bericht, blauwe vinkjes,
 * antwoord, en tot slot een geplande kennismaking. Terugscrollen speelt het
 * terug.
 *
 * Twee standen, gekozen met CSS (zie .appje-* in styles.css):
 *  - orbit (breed scherm): de appjes zweven links en rechts van de telefoon.
 *    Ze staan in dezelfde "cover"-doos als de foto, dus ze blijven op elk
 *    schermformaat naast de telefoon, hoe de foto ook wordt bijgesneden.
 *  - stapel (telefoon, tablet): een lopende chat die net onder de telefoon
 *    uitkomt, met hooguit drie berichten tegelijk in beeld.
 *
 * Het gesprek is een voorbeeld, geen echte klant, en daarom aria-hidden. De
 * kop, de tekst en de knoppen staan gewoon in de HTML.
 */

const FOOTER_GROEN = "hsl(160 84% 12%)";
const GROEN = "hsl(160 84% 16%)";
const GROEN_LICHT = "hsl(160 70% 58%)";
const INKT = "hsl(160 30% 8%)";
const KLANT_BUBBEL = "hsl(140 60% 90%)";
const SCHADUW =
  "0 14px 34px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06)";
const SPRING = { stiffness: 140, damping: 28, mass: 0.35, restDelta: 0.0005 };

const WHATSAPP = `${companyInfo.whatsapp}?text=${encodeURIComponent(
  "Hoi Nieuwblik! Ik heb een vraag over een website.",
)}`;
const TELEFOON = `tel:${companyInfo.phone.replace(/\s/g, "")}`;

type Van = "klant" | "nieuwblik" | "gepland";

interface Bericht {
  id: string;
  van: Van;
  tekst: string;
  /** Voortgang (0–1 van de vastgezette scroll) waarop het bericht verschijnt. */
  op: number;
  /** Alleen Nieuwblik: vanaf hier typbolletjes, tot het bericht er staat. */
  typen?: number;
  /** Alleen klant: vanaf hier kleuren de vinkjes blauw. */
  gelezen?: number;
  /** Plek rond de telefoon in orbit-stand, in procenten van de foto. */
  orbit: { kant: "links" | "rechts"; y: number };
}

// Desktopfoto (over de schouder): het scherm staat tussen x 55,7–76,1% en
// y 13,9–74,1%. De vingers omklemmen de linkerrand (x 53–57%, y 40–70%), de
// duim ligt rechts (x 74–77%, y 38–44%). Links eindigen de appjes daarom op
// 52,5%, rechts beginnen ze op 79%, in het lege zwart rechtsboven. Rechts zijn
// ze smaller (11,5% van de foto) zodat ze ook op een 3:2-scherm met de
// inzoom van 3% binnen beeld blijven: 66 + (90,5 − 66) × 1,03 = 91,2%, en er
// is tot 92,4% zichtbaar.
const GESPREK: Bericht[] = [
  {
    id: "k1",
    van: "klant",
    tekst:
      "Hoi! Ik wil een nieuwe website voor mijn kapsalon. Kunnen jullie dat?",
    op: 0.12,
    gelezen: 0.2,
    orbit: { kant: "rechts", y: 16 },
  },
  {
    id: "n1",
    van: "nieuwblik",
    tekst: "Hoi! Zeker. Wat heb je nu, en wat wil je anders?",
    typen: 0.2,
    op: 0.29,
    orbit: { kant: "links", y: 22 },
  },
  {
    id: "k2",
    van: "klant",
    tekst: "Mijn site is oud en niet te vinden in Google 😅",
    op: 0.4,
    gelezen: 0.48,
    orbit: { kant: "rechts", y: 29 },
  },
  {
    id: "n2",
    van: "nieuwblik",
    tekst: "Herkenbaar. Zullen we even videobellen? Dan laten we zien wat kan.",
    typen: 0.48,
    op: 0.57,
    orbit: { kant: "links", y: 38 },
  },
  {
    id: "k3",
    van: "klant",
    tekst: "Top! Morgen 10:00?",
    op: 0.67,
    gelezen: 0.74,
    orbit: { kant: "rechts", y: 44 },
  },
  {
    id: "g1",
    van: "gepland",
    tekst: "Kennismaking gepland",
    op: 0.78,
    orbit: { kant: "links", y: 55 },
  },
];

/** 0 → 1 tussen a en b, geklemd. */
const ramp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

const IN = 0.035; // hoe lang een bericht erover doet om te verschijnen
const TYP_IN = 0.02;

// ── Onderdelen van een bubbel ─────────────────────────────────────────────

const Vinkjes = ({
  p,
  gelezen,
}: {
  p: MotionValue<number>;
  gelezen: number;
}) => {
  const blauw = useTransform(p, [gelezen, gelezen + 0.02], [0, 1], {
    clamp: true,
  });
  const pad = "M1.5 8.5l3 3 6-7M7 11.5l1 1 6-7.5";
  return (
    <span className="relative ml-1.5 inline-block h-[0.75em] w-[1.1em] translate-y-[0.1em] align-baseline">
      <svg
        viewBox="0 0 16 14"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d={pad}
          fill="none"
          stroke="hsl(160 10% 45%)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <motion.svg
        viewBox="0 0 16 14"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: blauw }}
        aria-hidden="true"
      >
        <path
          d={pad}
          fill="none"
          stroke="#1d9bf0"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </span>
  );
};

const Bubbel = ({ b, p }: { b: Bericht; p: MotionValue<number> }) => {
  if (b.van === "gepland") {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white"
        style={{
          background: "hsl(160 84% 13% / 0.94)",
          border: `1px solid hsl(160 70% 58% / 0.4)`,
          boxShadow: SCHADUW,
        }}
      >
        <CalendarCheck
          className="h-[1.25em] w-[1.25em] shrink-0"
          style={{ color: GROEN_LICHT }}
          aria-hidden="true"
        />
        <span className="leading-tight">
          <span className="block font-semibold">{b.tekst}</span>
          <span className="block text-[0.82em] text-white/70">
            Videobellen · morgen 10:00
          </span>
        </span>
      </div>
    );
  }

  const klant = b.van === "klant";
  return (
    <div
      className={`rounded-2xl px-3.5 py-2.5 leading-snug ${klant ? "rounded-br-md" : "rounded-bl-md"}`}
      style={{
        background: klant ? KLANT_BUBBEL : "#ffffff",
        color: INKT,
        boxShadow: SCHADUW,
      }}
    >
      {!klant && (
        <span
          className="mb-0.5 block text-[0.74em] font-semibold"
          style={{ color: GROEN }}
        >
          Nieuwblik
        </span>
      )}
      <span>{b.tekst}</span>
      {klant && b.gelezen !== undefined && (
        <Vinkjes p={p} gelezen={b.gelezen} />
      )}
    </div>
  );
};

const Typen = () => (
  <div
    className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3"
    style={{ boxShadow: SCHADUW }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="appje-stip block h-[0.45em] w-[0.45em] rounded-full"
        style={{ background: "hsl(160 10% 45%)" }}
      />
    ))}
  </div>
);

// ── Orbit-stand: appjes rondom de telefoon ─────────────────────────────────

const plekStijl = (b: Bericht) =>
  b.orbit.kant === "links"
    ? { top: `${b.orbit.y}%`, right: "47.5%", transformOrigin: "100% 50%" }
    : { top: `${b.orbit.y}%`, left: "79%", transformOrigin: "0% 50%" };

const OrbitBericht = ({ b, p }: { b: Bericht; p: MotionValue<number> }) => {
  const zicht = useTransform(p, [b.op - IN, b.op], [0, 1], { clamp: true });
  const schaal = useTransform(zicht, [0, 1], [0.72, 1]);
  const y = useTransform(zicht, [0, 1], [16, 0]);
  return (
    <motion.div
      className={`appje-orbit-bubbel absolute ${b.orbit.kant === "rechts" ? "appje-orbit-rechts" : ""}`}
      style={{ ...plekStijl(b), opacity: zicht, scale: schaal, y }}
    >
      <Bubbel b={b} p={p} />
    </motion.div>
  );
};

const OrbitTypen = ({ b, p }: { b: Bericht; p: MotionValue<number> }) => {
  const typen = b.typen ?? b.op;
  const zicht = useTransform(p, (v) =>
    Math.min(ramp(v, typen, typen + TYP_IN), 1 - ramp(v, b.op - TYP_IN, b.op)),
  );
  const schaal = useTransform(zicht, [0, 1], [0.8, 1]);
  return (
    <motion.div
      className={`appje-orbit-bubbel absolute ${b.orbit.kant === "rechts" ? "appje-orbit-rechts" : ""}`}
      style={{ ...plekStijl(b), opacity: zicht, scale: schaal }}
    >
      <Typen />
    </motion.div>
  );
};

// ── Stapel-stand: lopende chat onder de telefoon ───────────────────────────

interface StapelItem {
  sleutel: string;
  soort: "bericht" | "typen";
  b: Bericht;
  start: number;
  eind?: number;
}

const ITEMS: StapelItem[] = GESPREK.flatMap((b) => {
  const items: StapelItem[] = [];
  if (b.typen !== undefined)
    items.push({
      sleutel: `${b.id}-typen`,
      soort: "typen",
      b,
      start: b.typen,
      eind: b.op,
    });
  items.push({ sleutel: b.id, soort: "bericht", b, start: b.op });
  return items;
});

/** Hoe zichtbaar een item is bij voortgang v (0–1). */
const zichtbaar = (it: StapelItem, v: number) =>
  it.soort === "typen"
    ? Math.min(
        ramp(v, it.start, it.start + TYP_IN),
        1 - ramp(v, (it.eind ?? it.start) - TYP_IN, it.eind ?? it.start),
      )
    : ramp(v, it.start - IN, it.start);

const STAPEL_GAT = 10;

const StapelRegel = ({
  it,
  index,
  p,
  versie,
  hoogtes,
  meet,
}: {
  it: StapelItem;
  index: number;
  p: MotionValue<number>;
  /** Telt op na elke meting, zodat de posities opnieuw worden berekend. */
  versie: MotionValue<number>;
  hoogtes: MutableRefObject<number[]>;
  meet: (el: HTMLDivElement | null) => void;
}) => {
  // Elk later bericht duwt dit bericht omhoog met zijn eigen hoogte, naar rato
  // van hoe ver het al verschenen is. Bovenin vervaagt de container (mask).
  const y = useTransform<number, number>([p, versie], ([v = 0]) => {
    let omhoog = 0;
    for (let j = index + 1; j < ITEMS.length; j++) {
      omhoog +=
        ((hoogtes.current[j] ?? 0) + STAPEL_GAT) * zichtbaar(ITEMS[j]!, v);
    }
    return -omhoog + (1 - zichtbaar(it, v)) * 14;
  });
  const opacity = useTransform(p, (v) => zichtbaar(it, v));
  const scale = useTransform(p, (v) => 0.88 + 0.12 * zichtbaar(it, v));
  const rechts = it.b.van === "klant";
  return (
    <motion.div
      ref={meet}
      className={`absolute bottom-0 max-w-[86%] ${rechts ? "right-0" : "left-0"}`}
      style={{
        y,
        opacity,
        scale,
        transformOrigin: rechts ? "100% 100%" : "0% 100%",
      }}
    >
      {it.soort === "typen" ? <Typen /> : <Bubbel b={it.b} p={p} />}
    </motion.div>
  );
};

const StapelChat = ({ p }: { p: MotionValue<number> }) => {
  const elementen = useRef<(HTMLDivElement | null)[]>([]);
  const hoogtes = useRef<number[]>([]);
  // Met reduced motion verandert p nooit; dit signaal laat de posities toch
  // opnieuw uitrekenen zodra de hoogtes bekend zijn.
  const versie = useMotionValue(0);

  useEffect(() => {
    const meetAlles = () => {
      hoogtes.current = elementen.current.map((el) => el?.offsetHeight ?? 0);
      versie.set(versie.get() + 1);
    };
    meetAlles();
    const ro = new ResizeObserver(meetAlles);
    elementen.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [versie]);

  return (
    <div className="appje-stapel text-[15px] orbit:hidden" aria-hidden="true">
      {ITEMS.map((it, i) => (
        <StapelRegel
          key={it.sleutel}
          it={it}
          index={i}
          p={p}
          versie={versie}
          hoogtes={hoogtes}
          meet={(el) => {
            elementen.current[i] = el;
          }}
        />
      ))}
    </div>
  );
};

// ── Kop: woorden komen uit een masker omhoog ───────────────────────────────

const MaskWoord = ({
  e,
  start,
  children,
}: {
  e: MotionValue<number>;
  start: number;
  children: ReactNode;
}) => {
  const y = useTransform(e, [start, start + WOORD_DUUR], ["108%", "0%"], {
    clamp: true,
  });
  return (
    <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span className="inline-block" style={{ y }}>
        {children}
      </motion.span>
    </span>
  );
};

// Drie vaste regels. Het laatste woord moet binnen de binnenkomst (0–1) klaar
// zijn: start 0,45 + 4 × 0,06 = 0,69, plus 0,26 duur = 0,95.
const KOP = [["Contact?"], ["Eén", "appje"], ["is", "genoeg."]];
const WOORD_START = 0.45;
const WOORD_STAP = 0.06;
const WOORD_DUUR = 0.26;

// ── Sectie ─────────────────────────────────────────────────────────────────

const AppjeSectie = () => {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLElement>(null);
  const podiumRef = useDarkNavSection<HTMLDivElement>();

  // Binnenkomst: van "bovenkant onderin beeld" tot "bovenkant bovenin beeld".
  const { scrollYProgress: binnenRuw } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start start"],
  });
  // Vastgezet: het gesprek, over de hoogte van de wrapper.
  const { scrollYProgress: gesprekRuw } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const binnenVeer = useSpring(binnenRuw, SPRING);
  const gesprekVeer = useSpring(gesprekRuw, SPRING);
  const een = useMotionValue(1);

  // Met reduced motion: alles in de eindstand, niets vastgezet.
  const binnen = reduce ? een : binnenVeer;
  const gesprek = reduce ? een : gesprekVeer;

  // Foto: zoomt bij binnenkomst iets uit, en tijdens het gesprek langzaam weer in.
  const fotoSchaal = useTransform<number, number>(
    [binnen, gesprek],
    ([b = 1, g = 0]) => (b < 1 ? 1.08 - 0.08 * b : 1 + 0.03 * g),
  );

  const tekstOpacity = useTransform(binnen, [0.55, 0.95], [0, 1], {
    clamp: true,
  });
  const tekstY = useTransform(binnen, [0.55, 0.95], [18, 0], { clamp: true });
  const knopGloed = useTransform(gesprek, [0.8, 0.9], [0, 1], { clamp: true });

  return (
    <section
      ref={wrapperRef}
      aria-labelledby="appje-kop"
      className="relative"
      style={{ height: reduce ? "100svh" : "260svh", background: FOOTER_GROEN }}
    >
      <div
        ref={podiumRef}
        className="appje-podium sticky top-0 h-[100svh] w-full overflow-hidden"
      >
        <div className="appje-binnen">
          {/* Foto + appjes rond de telefoon: één doos, zodat ze samen meeschalen. */}
          <motion.div
            className="appje-cover"
            style={{
              scale: reduce ? 1 : fotoSchaal,
              transformOrigin: "66% 44%",
            }}
          >
            <picture>
              <source
                media="(orientation: portrait)"
                srcSet={`${mobiel750} 750w, ${mobiel1080} 1080w`}
                sizes="100vw"
              />
              <img
                src={desktop1600}
                srcSet={`${desktop1600} 1600w, ${desktop2560} 2560w`}
                sizes="100vw"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full"
              />
            </picture>

            <div
              className="absolute inset-0 hidden orbit:block"
              aria-hidden="true"
            >
              {GESPREK.map((b) =>
                b.typen !== undefined ? (
                  <OrbitTypen key={`${b.id}-typen`} b={b} p={gesprek} />
                ) : null,
              )}
              {GESPREK.map((b) => (
                <OrbitBericht key={b.id} b={b} p={gesprek} />
              ))}
            </div>
          </motion.div>

          {/* Donkere verlopen voor contrast: links op breed, boven en onder op smal. */}
          <div
            className="pointer-events-none absolute inset-0 hidden orbit:block"
            style={{
              background:
                "linear-gradient(90deg, hsl(160 60% 4% / 0.9) 0%, hsl(160 60% 4% / 0.6) 30%, transparent 52%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 orbit:hidden"
            style={{
              background:
                "linear-gradient(180deg, hsl(160 60% 4% / 0.88) 0%, hsl(160 60% 4% / 0.35) 32%, transparent 48%, transparent 70%, hsl(160 60% 4% / 0.75) 88%)",
            }}
          />
          {/* Onderaan vloeit de foto over in het groen van de footer. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%]"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${FOOTER_GROEN} 100%)`,
            }}
          />

          <StapelChat p={gesprek} />

          <div className="appje-tekst pointer-events-none">
            <div className="pointer-events-auto">
              <motion.p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: GROEN_LICHT, opacity: tekstOpacity }}
              >
                Contact
              </motion.p>
              <h2
                id="appje-kop"
                className="font-bold tracking-tight text-white"
                style={{
                  fontSize: "clamp(2rem, 3.8vw, 3.9rem)",
                  lineHeight: 1.04,
                }}
              >
                {KOP.map((regel, r) => {
                  // Doorlopende index over alle woorden, voor de volgorde.
                  const eerste = KOP.slice(0, r).flat().length;
                  return (
                    <span key={regel.join(" ")} className="block">
                      {regel.map((woord, w) => (
                        <span key={woord}>
                          <MaskWoord
                            e={binnen}
                            start={WOORD_START + (eerste + w) * WOORD_STAP}
                          >
                            {woord}
                          </MaskWoord>
                          {w < regel.length - 1 ? " " : null}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </h2>
              <motion.p
                className="mt-4 max-w-md text-[15px] leading-normal text-white/80 md:mt-5 md:text-lg md:leading-relaxed"
                style={{ opacity: tekstOpacity, y: tekstY }}
              >
                Geen formulier, geen gedoe. Stuur ons een appje met je vraag of
                idee, dan heb je binnen 24 uur een reactie.
              </motion.p>

              <motion.ol
                className="mt-8 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-white/75 orbit:flex"
                style={{ opacity: tekstOpacity }}
              >
                {["Appje sturen", "Kennismaken", "Voorstel op maat"].map(
                  (stap, i) => (
                    <li key={stap} className="flex items-baseline gap-2">
                      <span
                        className="font-black tabular-nums"
                        style={{ color: GROEN_LICHT }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {stap}
                    </li>
                  ),
                )}
              </motion.ol>
            </div>

            <motion.div
              className="pointer-events-auto flex flex-wrap items-center gap-x-6 gap-y-3 pr-16 orbit:mt-10 orbit:pr-0"
              style={{ opacity: tekstOpacity }}
            >
              <span className="relative inline-flex">
                {/* Zachte gloed rond de knop zodra het gesprek rond is. */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-2 rounded-xl"
                  style={{
                    opacity: knopGloed,
                    boxShadow: `0 0 0 1px ${GROEN_LICHT}, 0 0 32px 4px hsl(160 70% 50% / 0.45)`,
                  }}
                />
                <AnimatedButton href={WHATSAPP} size="lg" variant="white">
                  <span className="whitespace-nowrap">Stuur een appje</span>
                </AnimatedButton>
              </span>
              <a
                href={TELEFOON}
                className="text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                of bel {companyInfo.phone}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppjeSectie;
