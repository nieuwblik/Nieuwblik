import {
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  animate,
  useInView,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";
import { useDarkNavSection } from "@/components/UnderlayNav";
import desktop1600 from "@/assets/contact/appje-desktop-1600.webp";
import desktop2560 from "@/assets/contact/appje-desktop-2560.webp";
import mobiel750 from "@/assets/contact/appje-mobiel-750.webp";
import mobiel1080 from "@/assets/contact/appje-mobiel-1080.webp";
import justinAvatar from "@/assets/contact/justin-avatar.webp";
// QR-code naar WHATSAPP (hieronder), eenmalig gemaakt met het qrcode-pakket en
// teruggelezen met een decoder: hij scant naar precies deze link.
import whatsappQr from "@/assets/contact/whatsapp-qr.svg";

/*
 * "Je nieuwe website begint met een appje."
 *
 * Schermvullende sectie onderaan de homepage. Zodra hij voor bijna de helft
 * in beeld is, speelt er één keer een WhatsApp-gesprek af rondom de telefoon
 * op de foto: typbolletjes, bericht, blauwe vinkjes, antwoord, en tot slot een
 * geplande kennismaking. De appjes vallen een stukje over de telefoon heen.
 *
 * Twee standen, gekozen met CSS (zie .appje-* in styles.css):
 *  - orbit (breed scherm): de appjes zweven links en rechts over de randen
 *    van de telefoon.
 *    Ze staan in dezelfde "cover"-doos als de foto, dus ze blijven op elk
 *    schermformaat naast de telefoon, hoe de foto ook wordt bijgesneden.
 *  - stapel (telefoon, tablet): een lopende chat over de bovenkant van de
 *    telefoon, met hooguit drie berichten tegelijk in beeld.
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
/** Hoe lang het gesprek duurt, in seconden. De kennismaking staat er op 90%. */
const GESPREK_DUUR = 4;

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
}

// Het gesprek. In orbit-stand staat het als één kolom op de telefoon (zie
// .appje-orbit-gesprek): klant rechts, Nieuwblik links, de geplande
// kennismaking gecentreerd onderaan.
const GESPREK: Bericht[] = [
  {
    id: "k1",
    van: "klant",
    tekst:
      "Hoi! Ik wil een nieuwe website voor mijn kapsalon. Kunnen jullie dat?",
    op: 0.09,
    gelezen: 0.16,
  },
  {
    id: "n1",
    van: "nieuwblik",
    tekst: "Hoi! Zeker. Wat heb je nu, en wat wil je anders?",
    typen: 0.16,
    op: 0.28,
  },
  {
    id: "k2",
    van: "klant",
    tekst: "Mijn site is oud en niet te vinden in Google 😅",
    op: 0.42,
    gelezen: 0.52,
  },
  {
    id: "n2",
    van: "nieuwblik",
    tekst: "Herkenbaar. Zullen we even videobellen? Dan laten we zien wat kan.",
    // Geen typbolletjes: alleen het eerste antwoord laat zien dat Justin typt,
    // anders flitst er twee keer een vlakje op vlak voor het bericht.
    op: 0.6,
  },
  {
    id: "k3",
    van: "klant",
    tekst: "Top! Morgen 10:00?",
    op: 0.76,
    gelezen: 0.85,
  },
  {
    id: "g1",
    van: "gepland",
    tekst: "Kennismaking gepland",
    op: 0.9,
  },
];

/** 0 → 1 tussen a en b, geklemd. */
const ramp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

// Hoe lang een bericht erover doet om te verschijnen (0,08 × 4 s ≈ 0,3 s).
const IN = 0.08;
const TYP_IN = 0.03;

/** Zachte uitloop (ease-out cubic), zodat een appje niet lineair binnenschuift. */
const uit = (t: number) => 1 - (1 - t) ** 3;
/** Ease-out back: schiet iets over 1 heen en veert terug, als een pop. */
const pop = (t: number) => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;

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
  if (b.van === "gepland") return <GeplandChip b={b} p={p} />;

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
          className="mb-1 flex items-center gap-1.5 text-[0.74em] font-semibold"
          style={{ color: GROEN }}
        >
          <Avatar />
          Justin · Nieuwblik
        </span>
      )}
      <span>{b.tekst}</span>
      {klant && b.gelezen !== undefined && (
        <Vinkjes p={p} gelezen={b.gelezen} />
      )}
    </div>
  );
};

/** Klein rond fotootje van Justin: je appt met een mens, niet met een bedrijf. */
const Avatar = () => (
  <img
    src={justinAvatar}
    alt=""
    width={48}
    height={48}
    loading="lazy"
    className="h-[1.9em] w-[1.9em] shrink-0 rounded-full object-cover"
    style={{ boxShadow: "0 0 0 1.5px hsl(160 70% 58% / 0.6)" }}
  />
);

const Typen = () => (
  <div
    className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white py-2 pl-2 pr-3.5"
    style={{ boxShadow: SCHADUW }}
  >
    <span className="mr-1.5 inline-flex text-[0.8em]">
      <Avatar />
    </span>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="appje-stip block h-[0.45em] w-[0.45em] rounded-full"
        style={{ background: "hsl(160 10% 45%)" }}
      />
    ))}
  </div>
);

// ── Slotstuk: de geplande kennismaking ─────────────────────────────────────
//
// Geen appje maar een melding onderaan het gesprek, gecentreerd zoals een
// systeembericht in WhatsApp. De kaart ploft erin met een veer (iets te groot,
// dan terug); de beweging zit verder in het kalendericoon: dat springt erin
// en wiebelt, er gaan groene ringen vanaf, een paar vonkjes spatten weg en het
// vinkje tekent zichzelf.

const VONKEN = Array.from({ length: 8 }, (_, i) => {
  const hoek = (i / 8) * Math.PI * 2 + 0.4;
  const ver = i % 2 === 0 ? 1.9 : 1.55;
  return {
    x: `${(Math.cos(hoek) * ver).toFixed(2)}em`,
    y: `${(Math.sin(hoek) * ver).toFixed(2)}em`,
    kleur: i % 2 === 0 ? GROEN_LICHT : "#ffffff",
  };
});

const chipVarianten: Variants = {
  uit: { opacity: 0, scale: 0.45, y: 28 },
  aan: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 13,
      mass: 0.9,
      opacity: { duration: 0.18 },
    },
  },
};

const regelVarianten = (vertraging: number): Variants => ({
  uit: { opacity: 0, y: 8 },
  aan: {
    opacity: 1,
    y: 0,
    transition: { delay: vertraging, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
});

// Ringen rond het icoon: drie keer een puls, daarna rust.
const ringVarianten = (i: number): Variants => ({
  uit: { opacity: 0, scale: 1 },
  aan: {
    opacity: [0, 0.85, 0],
    scale: [0.9, 2.3],
    transition: {
      duration: 1.1,
      delay: 0.35 + i * 0.3,
      ease: "easeOut",
      repeat: 2,
      repeatDelay: 0.9,
    },
  },
});

/** Kalender met een vinkje dat zichzelf tekent (lucide calendar-check). */
const Kalender = ({ beweeg }: { beweeg: boolean }) => (
  <span
    className="relative inline-flex shrink-0"
    style={{ color: GROEN_LICHT }}
  >
    {beweeg &&
      [0, 1].map((i) => (
        <motion.span
          key={`ring-${i}`}
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${GROEN_LICHT}` }}
          variants={ringVarianten(i)}
        />
      ))}
    {beweeg &&
      VONKEN.map((v, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] block h-[4px] w-[4px] rounded-full"
          style={{ background: v.kleur }}
          variants={{
            uit: { opacity: 0, x: "0em", y: "0em", scale: 0 },
            aan: {
              opacity: [0, 1, 1, 0],
              x: v.x,
              y: v.y,
              scale: [0, 1.3, 1, 0.4],
              transition: {
                delay: 0.3 + (i % 2) * 0.05,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        />
      ))}
    <motion.svg
      viewBox="0 0 24 24"
      className="relative h-[1.35em] w-[1.35em]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...(beweeg
        ? {
            variants: {
              uit: { scale: 0, rotate: -30 },
              aan: {
                scale: [0, 1.35, 1],
                rotate: [-30, 14, -8, 4, 0],
                transition: { delay: 0.15, duration: 0.8, ease: "easeOut" },
              },
            },
          }
        : {})}
    >
      <path d="M8 2v4M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <motion.path
        d="m9 16 2 2 4-4"
        {...(beweeg
          ? {
              variants: {
                uit: { pathLength: 0 },
                aan: {
                  pathLength: 1,
                  transition: { delay: 0.6, duration: 0.4, ease: "easeOut" },
                },
              },
            }
          : {})}
      />
    </motion.svg>
  </span>
);

const GeplandChip = ({ b, p }: { b: Bericht; p: MotionValue<number> }) => {
  const reduce = useReducedMotion();
  const [aan, setAan] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    if (v >= b.op - IN) setAan(true);
  });
  useEffect(() => {
    if (p.get() >= b.op - IN) setAan(true);
  }, [p, b.op]);
  // Zonder beweging alleen een fade; de varianten (veer, icoon) vallen weg.
  const met = (varianten: Variants) => (reduce ? {} : { variants: varianten });

  const kaart = (
    <motion.div
      className="relative flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-white"
      style={{
        background: "hsl(160 84% 13% / 0.95)",
        border: `1px solid hsl(160 70% 58% / 0.45)`,
        boxShadow: `${SCHADUW}, 0 0 28px -6px hsl(160 70% 58% / 0.45)`,
      }}
      {...met(chipVarianten)}
    >
      <Kalender beweeg={!reduce} />
      <span className="leading-tight">
        <motion.span
          className="block font-semibold"
          {...met(regelVarianten(0.16))}
        >
          {b.tekst}
        </motion.span>
        <motion.span
          className="block text-[0.82em] text-white/70"
          {...met(regelVarianten(0.28))}
        >
          Videobellen · morgen 10:00
        </motion.span>
      </span>
    </motion.div>
  );

  if (reduce) {
    return (
      <motion.div
        initial={false}
        animate={{ opacity: aan ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {kaart}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative"
      initial="uit"
      animate={aan ? "aan" : "uit"}
    >
      {kaart}
    </motion.div>
  );
};

// ── Orbit-stand: appjes rondom de telefoon ─────────────────────────────────

// Desktopfoto (over de schouder): de telefoon staat tussen x 55–76,5% en
// y 13–76%. Het gesprek is één kolom over het donkere scherm, van x 49% tot
// 82%, die aan beide kanten een stuk buiten de telefoon uitsteekt, met de
// onderkant op 70%. De appjes zijn 20% van de foto breed, dus in het midden
// (62–69%) lopen ze langs elkaar; verticaal staan ze op een vaste afstand, hoe
// breed het scherm ook is.

const OrbitBericht = ({ b, p }: { b: Bericht; p: MotionValue<number> }) => {
  const t = useTransform(p, (v) => ramp(v, b.op - IN, b.op));
  const zicht = useTransform(t, uit);
  const schaal = useTransform(t, (x) => 0.8 + 0.2 * pop(x));
  const y = useTransform(zicht, [0, 1], [14, 0]);
  return (
    <motion.div
      className="will-change-[transform,opacity]"
      style={{
        opacity: zicht,
        scale: schaal,
        y,
        transformOrigin: b.van === "klant" ? "100% 50%" : "0% 50%",
      }}
    >
      <Bubbel b={b} p={p} />
    </motion.div>
  );
};

/** Typbolletjes, op de plek waar straks het bericht komt. */
const OrbitTypen = ({ b, p }: { b: Bericht; p: MotionValue<number> }) => {
  const typen = b.typen ?? b.op;
  const zicht = useTransform(p, (v) =>
    // Weg in de eerste helft van de binnenkomst van het bericht.
    Math.min(
      ramp(v, typen, typen + TYP_IN),
      1 - ramp(v, b.op - IN, b.op - IN / 2),
    ),
  );
  const schaal = useTransform(zicht, [0, 1], [0.8, 1]);
  return (
    <motion.div
      className="absolute left-0 top-0 will-change-[transform,opacity]"
      style={{ opacity: zicht, scale: schaal, transformOrigin: "0% 50%" }}
    >
      <Typen />
    </motion.div>
  );
};

const OrbitRegel = ({ b, p }: { b: Bericht; p: MotionValue<number> }) => {
  if (b.van === "gepland") {
    return (
      <div className="mt-[0.9em] self-center">
        <GeplandChip b={b} p={p} />
      </div>
    );
  }
  return (
    <div
      className={`appje-orbit-bubbel relative ${b.van === "klant" ? "self-end" : "self-start"}`}
    >
      {b.typen !== undefined && <OrbitTypen b={b} p={p} />}
      <OrbitBericht b={b} p={p} />
    </div>
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
        1 - ramp(v, (it.eind ?? it.start) - IN, (it.eind ?? it.start) - IN / 2),
      )
    : uit(ramp(v, it.start - IN, it.start));

// De geplande kennismaking krijgt wat extra lucht, voor de ringen en vonkjes.
const STAPEL_GAT = 10;
const gat = (it: StapelItem) => (it.b.van === "gepland" ? 18 : STAPEL_GAT);

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
  const gepland = it.b.van === "gepland";
  const y = useTransform<number, number>([p, versie], ([v = 0]) => {
    let omhoog = 0;
    for (let j = index + 1; j < ITEMS.length; j++) {
      omhoog +=
        ((hoogtes.current[j] ?? 0) + gat(ITEMS[j]!)) * zichtbaar(ITEMS[j]!, v);
    }
    return -omhoog + (gepland ? 0 : (1 - zichtbaar(it, v)) * 14);
  });
  // De kennismaking heeft een eigen entree (GeplandChip).
  const opacity = useTransform(p, (v) => (gepland ? 1 : zichtbaar(it, v)));
  const scale = useTransform(p, (v) =>
    gepland ? 1 : 0.88 + 0.12 * zichtbaar(it, v),
  );
  const rechts = it.b.van === "klant";
  return (
    <motion.div
      ref={meet}
      className={`absolute bottom-0 max-w-[86%] will-change-[transform,opacity] ${
        gepland ? "left-1/2 -translate-x-1/2" : rechts ? "right-0" : "left-0"
      }`}
      style={{
        y,
        opacity,
        scale,
        transformOrigin: gepland
          ? "50% 100%"
          : rechts
            ? "100% 100%"
            : "0% 100%",
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
  // 150%: het masker is door de pb-[0.14em] hoger dan het woord, en J, b en de
  // puntjes van i/j steken boven het woord uit. Bij 108% bleven die topjes
  // vóór de animatie net zichtbaar.
  const y = useTransform(e, [start, start + WOORD_DUUR], ["150%", "0%"], {
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

// Twee vaste regels. Het laatste woord moet binnen de binnenkomst (0–1) klaar
// zijn: start 0,45 + 6 × 0,045 = 0,72, plus 0,26 duur = 0,98.
const KOP = [
  ["Je", "nieuwe", "website"],
  ["begint", "met", "een", "appje."],
];
const WOORD_START = 0.45;
const WOORD_STAP = 0.045;
const WOORD_DUUR = 0.26;

// ── Sectie ─────────────────────────────────────────────────────────────────

const AppjeSectie = () => {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLElement>(null);
  const podiumRef = useDarkNavSection<HTMLDivElement>();

  // Twee klokken van 0 naar 1, die starten zodra de sectie voor bijna de helft
  // in beeld is: eerst de kop (kort), daarna het gesprek. Alles wat beweegt
  // leidt zijn stand af van deze twee waarden.
  const binnen = useMotionValue(0);
  const gesprek = useMotionValue(0);
  const inBeeld = useInView(wrapperRef, { once: true, amount: 0.3 });

  // Pas starten als de foto gedecodeerd is: anders valt het decoderen van de
  // grote foto midden in de animatie. Uiterlijk 1,2 s na in beeld start hij toch.
  const fotoRef = useRef<HTMLImageElement>(null);
  const [fotoKlaar, setFotoKlaar] = useState(false);
  const fotoGeladen = () => {
    const img = fotoRef.current;
    if (!img) return;
    img
      .decode()
      .catch(() => undefined)
      .then(() => setFotoKlaar(true));
  };
  useEffect(() => {
    if (fotoRef.current?.complete) fotoGeladen();
  }, []);
  // Vangnet vanaf het moment dat de sectie in beeld is (de foto laadt lazy).
  useEffect(() => {
    if (!inBeeld) return;
    const t = setTimeout(() => setFotoKlaar(true), 1200);
    return () => clearTimeout(t);
  }, [inBeeld]);

  useEffect(() => {
    // Met reduced motion: meteen de eindstand.
    if (reduce) {
      binnen.set(1);
      gesprek.set(1);
      return;
    }
    if (!inBeeld || !fotoKlaar) return;
    const kop = animate(binnen, 1, { duration: 1.4, ease: [0.22, 1, 0.36, 1] });
    const chat = animate(gesprek, 1, {
      duration: GESPREK_DUUR,
      ease: "linear",
      delay: 0.2,
    });
    return () => {
      kop.stop();
      chat.stop();
    };
  }, [inBeeld, fotoKlaar, reduce, binnen, gesprek]);

  // Foto: zoomt bij binnenkomst iets uit, en tijdens het gesprek langzaam weer in.
  const fotoSchaal = useTransform<number, number>(
    [binnen, gesprek],
    ([b = 1, g = 0]) => (b < 1 ? 1.08 - 0.08 * b : 1 + 0.03 * g),
  );

  const tekstOpacity = useTransform(binnen, [0.55, 0.95], [0, 1], {
    clamp: true,
  });
  const tekstY = useTransform(binnen, [0.55, 0.95], [18, 0], { clamp: true });

  return (
    <section
      ref={wrapperRef}
      aria-labelledby="appje-kop"
      className="relative"
      style={{ background: FOOTER_GROEN }}
    >
      <div
        ref={podiumRef}
        className="appje-podium relative h-[100svh] w-full overflow-hidden"
      >
        <div className="appje-binnen">
          {/* Foto en appjes staan in dezelfde cover-doos, maar in aparte lagen:
              alleen de foto zoomt. Zoomden de appjes mee, dan moest de browser
              de hele foto met alle bewegende appjes elk beeldje opnieuw tekenen
              (dat haperde). De zoom is om x 66%, y 44%, het midden van de
              telefoon; daar blijven de appjes op een paar pixels na staan. */}
          <motion.div
            className="appje-cover will-change-transform"
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
                ref={fotoRef}
                onLoad={fotoGeladen}
              />
            </picture>
          </motion.div>

          <div className="appje-cover">
            <div
              className="absolute inset-0 hidden orbit:block"
              aria-hidden="true"
            >
              <div className="appje-orbit-gesprek">
                {GESPREK.map((b) => (
                  <OrbitRegel key={b.id} b={b} p={gesprek} />
                ))}
              </div>
            </div>
          </div>

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
                  fontSize: "clamp(1.6rem, 9cqi, 3.4rem)",
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
                idee, meestal heb je dezelfde dag antwoord.
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
              <AnimatedButton href={WHATSAPP} size="lg" variant="white">
                <span className="whitespace-nowrap">Stuur een appje</span>
              </AnimatedButton>
              <a
                href={TELEFOON}
                className="text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                of bel {companyInfo.phone}
              </a>

              {/* Achter een laptop stuur je niet zomaar een appje: scan de code
                  met je telefoon en het gesprek staat klaar. Alleen met een
                  muis of trackpad, en alleen in de brede stand. */}
              <div className="hidden w-full items-center gap-5 pt-4 orbit:pointer-fine:flex">
                {/* Wit op de donkere achtergrond, zonder vlak eromheen. De
                    camera's van iPhone en Android lezen omgekeerde codes. */}
                <img
                  src={whatsappQr}
                  alt="QR-code die WhatsApp opent met een bericht aan Nieuwblik"
                  width={116}
                  height={116}
                  loading="lazy"
                  className="-ml-2 block h-[116px] w-[116px] shrink-0"
                />
                <span className="max-w-[14rem] text-sm leading-snug text-white/70">
                  Achter je laptop? Scan de code met je telefoon, dan staat je
                  appje al klaar.
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppjeSectie;
