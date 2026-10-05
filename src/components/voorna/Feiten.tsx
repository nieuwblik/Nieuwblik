import type { CSSProperties } from "react";
import gsap from "gsap";

/*
 * Drie feitenkaarten naast het display van de voor/na-sectie: openbare
 * onderzoekscijfers (met bron) over waarom een snelle, verzorgde site loont.
 * Geen Nieuwblik-resultaten, dus de bron staat er altijd bij.
 *
 * De kaarten staan in de HTML met hun eindwaarde (zonder JavaScript of met
 * prefers-reduced-motion is dat wat je ziet). maakFeitenTijdlijn() bouwt een
 * gepauzeerde GSAP-tijdlijn: de kaart komt omhoog, het icoon tekent zichzelf
 * en het getal telt naar zijn waarde.
 */

type Icoon = "meter" | "staven" | "stopwatch";

interface Feit {
  icoon: Icoon;
  /** Eindwaarde en de waarde waar het tellen begint. */
  waarde: number;
  van: number;
  decimalen: number;
  voor?: string;
  na?: string;
  tekst: string;
  bron: string;
}

const FEITEN: Feit[] = [
  {
    icoon: "meter",
    waarde: 53,
    van: 0,
    decimalen: 0,
    na: "%",
    tekst: "haakt af als een mobiele site langer dan 3 seconden laadt",
    bron: "Google",
  },
  {
    icoon: "staven",
    waarde: 8.4,
    van: 0,
    decimalen: 1,
    voor: "+",
    na: "%",
    tekst: "meer conversies bij een 0,1 seconde snellere site",
    bron: "Deloitte / Google (retail)",
  },
  {
    icoon: "stopwatch",
    waarde: 0.05,
    van: 1,
    decimalen: 2,
    na: " s",
    tekst: "is genoeg voor een eerste indruk van je website",
    bron: "Lindgaard e.a., 2006",
  },
];

// Kleuren komen uit het thema van de kaart (CSS-variabelen).
const GROEN = "var(--k-accent)";
const SPOOR = "var(--k-spoor)";

const getal = (f: Feit, v: number) =>
  `${f.voor ?? ""}${v.toFixed(f.decimalen).replace(".", ",")}${f.na ?? ""}`;

// Meter: de boog loopt tot 53%, de naald draait mee (van -90° tot +5,4°).
const METER_HOEK = -90 + 0.53 * 180;

function IcoonSvg({ soort }: { soort: Icoon }) {
  const lijn = {
    fill: "none",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
  };
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
      {soort === "meter" && (
        <>
          <path d="M7 28 A13 13 0 0 1 33 28" stroke={SPOOR} {...lijn} />
          <path
            data-boog=""
            d="M7 28 A13 13 0 0 1 33 28"
            pathLength={1}
            stroke={GROEN}
            strokeDasharray="1 1"
            strokeDashoffset={0.47}
            {...lijn}
          />
          <line
            data-naald=""
            x1="20"
            y1="28"
            x2="20"
            y2="17"
            stroke="var(--k-naald)"
            strokeWidth={2.2}
            strokeLinecap="round"
            transform={`rotate(${METER_HOEK} 20 28)`}
          />
          <circle cx="20" cy="28" r="2.4" fill="var(--k-naald)" />
        </>
      )}
      {soort === "staven" && (
        <>
          {[
            { x: 8, h: 9 },
            { x: 17, h: 15 },
            { x: 26, h: 23 },
          ].map(({ x, h }, i) => (
            <rect
              key={x}
              data-staaf=""
              x={x}
              y={32 - h}
              width="6"
              height={h}
              rx="1.6"
              fill={i === 2 ? GROEN : SPOOR}
            />
          ))}
        </>
      )}
      {soort === "stopwatch" && (
        <>
          <rect x="17.5" y="5" width="5" height="3" rx="1" fill={GROEN} />
          <circle cx="20" cy="22" r="12" stroke={SPOOR} {...lijn} />
          <circle
            data-ring=""
            cx="20"
            cy="22"
            r="12"
            pathLength={1}
            stroke={GROEN}
            strokeDasharray="1 1"
            strokeDashoffset={0}
            transform="rotate(-90 20 22)"
            {...lijn}
          />
          <line
            data-wijzer=""
            x1="20"
            y1="22"
            x2="20"
            y2="14"
            stroke="var(--k-naald)"
            strokeWidth={2.2}
            strokeLinecap="round"
            transform="rotate(18 20 22)"
          />
          <circle cx="20" cy="22" r="2" fill="var(--k-naald)" />
        </>
      )}
    </svg>
  );
}

/** Plek van elke kaart rond het display, alleen vanaf lg. */
const PLEK = [
  "lg:right-[-4%] lg:top-[5%] xl:right-[-13%]",
  "lg:left-[-4%] lg:top-[56%] xl:left-[-15%]",
  "lg:right-[-3%] lg:top-[60%] xl:right-[-8%]",
];

/*
 * Kleurthema per kaart, uit het palet van Nieuwblik: donkergroen (zoals de
 * vindbaarheidssectie), fel mintgroen en een lichte mint.
 */
const THEMA: CSSProperties[] = [
  {
    background:
      "linear-gradient(160deg, hsl(160 84% 14%) 0%, hsl(160 84% 8%) 100%)",
    borderColor: "hsl(160 70% 58% / 0.18)",
    color: "#fff",
    "--k-tekst": "rgb(255 255 255 / 0.72)",
    "--k-bron": "rgb(255 255 255 / 0.45)",
    "--k-getal": "hsl(160 70% 62%)",
    "--k-accent": "hsl(160 70% 58%)",
    "--k-spoor": "hsl(160 70% 58% / 0.22)",
    "--k-naald": "#fff",
    "--k-chip": "hsl(160 70% 58% / 0.12)",
  } as CSSProperties,
  {
    background: "hsl(160 70% 58%)",
    borderColor: "hsl(160 70% 50%)",
    color: "hsl(160 84% 9%)",
    "--k-tekst": "hsl(160 84% 9% / 0.78)",
    "--k-bron": "hsl(160 84% 9% / 0.55)",
    "--k-getal": "hsl(160 84% 9%)",
    "--k-accent": "hsl(160 84% 12%)",
    "--k-spoor": "hsl(160 84% 12% / 0.2)",
    "--k-naald": "hsl(160 84% 9%)",
    "--k-chip": "rgb(255 255 255 / 0.35)",
  } as CSSProperties,
  {
    background: "hsl(155 45% 94%)",
    borderColor: "hsl(160 50% 80%)",
    color: "hsl(var(--sw-ink))",
    "--k-tekst": "hsl(var(--sw-ink) / 0.68)",
    "--k-bron": "hsl(var(--sw-ink) / 0.45)",
    "--k-getal": "hsl(var(--sw-green))",
    "--k-accent": "hsl(var(--sw-green))",
    "--k-spoor": "hsl(var(--sw-green) / 0.16)",
    "--k-naald": "hsl(var(--sw-ink))",
    "--k-chip": "#fff",
  } as CSSProperties,
];

/** Eigen karakter per kaart: de mintgroene hangt er als sticker iets schuin bij. */
const STIJL = ["", "lg:-rotate-2", ""];

export function FeitKaarten() {
  return (
    <ul className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:block">
      {FEITEN.map((f, i) => (
        <li
          key={f.icoon}
          data-feit={i}
          className={`flex flex-col rounded-2xl border p-3 shadow-[0_24px_50px_-26px_rgba(0,0,0,0.5)] sm:p-4 lg:absolute lg:z-30 lg:w-[232px] lg:rounded-[22px] lg:p-5 ${PLEK[i]} ${STIJL[i]}`}
          style={THEMA[i]}
        >
          {/* Getal groot, het icoon als infographic in een eigen rondje. */}
          <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:justify-between">
            <p
              data-getal=""
              className="whitespace-nowrap text-[1.375rem] font-bold tabular-nums tracking-tighter sm:text-3xl lg:text-[2.6rem]"
              style={{ lineHeight: 0.95, color: "var(--k-getal)" }}
            >
              {getal(f, f.waarde)}
            </p>
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full sm:h-10 sm:w-10 lg:h-12 lg:w-12"
              style={{ background: "var(--k-chip)" }}
            >
              <span className="h-6 w-6 sm:h-7 sm:w-7 lg:h-9 lg:w-9">
                <IcoonSvg soort={f.icoon} />
              </span>
            </span>
          </div>
          <p
            className="mt-2 text-[11px] leading-snug sm:text-[13px] lg:mt-3 lg:text-sm"
            style={{ color: "var(--k-tekst)" }}
          >
            {f.tekst}
          </p>
          {/* 53%: een balk die tot zijn waarde volloopt. */}
          {f.icoon === "meter" && (
            <span
              aria-hidden="true"
              className="mt-3 block h-1.5 overflow-hidden rounded-full"
              style={{ background: "var(--k-spoor)" }}
            >
              <span
                data-balk=""
                className="block h-full rounded-full"
                style={{ width: `${f.waarde}%`, background: "var(--k-accent)" }}
              />
            </span>
          )}
          <p
            className="mt-auto pt-2.5 text-[10px] leading-tight lg:text-[11px]"
            style={{ color: "var(--k-bron)" }}
          >
            Bron: {f.bron}
          </p>
        </li>
      ))}
    </ul>
  );
}

/*
 * Elke kaart komt op zijn eigen manier binnen, en duidelijk na de vorige:
 *  1. schuift van rechts naar binnen en draait recht;
 *  2. popt op vanuit de kant van het display, met een kleine veer;
 *  3. komt van onderen omhoog en kantelt recht.
 */
const BINNENKOMST: {
  start: number;
  van: gsap.TweenVars;
  naar: gsap.TweenVars;
}[] = [
  {
    start: 0,
    van: { autoAlpha: 0, x: 56, rotation: 4 },
    naar: { autoAlpha: 1, x: 0, rotation: 0, duration: 1.1, ease: "expo.out" },
  },
  {
    start: 0.38,
    van: { autoAlpha: 0, scale: 0.55, transformOrigin: "100% 50%" },
    naar: { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.7)" },
  },
  {
    start: 0.74,
    van: { autoAlpha: 0, y: 64, rotation: -3, transformOrigin: "0% 100%" },
    naar: {
      autoAlpha: 1,
      y: 0,
      rotation: 0,
      duration: 1.2,
      ease: "power4.out",
    },
  },
];

/** Gepauzeerde tijdlijn voor de kaarten binnen `root`. */
export function maakFeitenTijdlijn(root: HTMLElement) {
  const tl = gsap.timeline({ paused: true });
  FEITEN.forEach((f, i) => {
    const kaart = root.querySelector<HTMLElement>(`[data-feit="${i}"]`);
    const binnen = BINNENKOMST[i];
    if (!kaart || !binnen) return;
    const start = binnen.start;
    const teller = { v: f.van };
    const getalEl = kaart.querySelector<HTMLElement>("[data-getal]");

    tl.fromTo(kaart, binnen.van, binnen.naar, start).fromTo(
      teller,
      { v: f.van },
      {
        v: f.waarde,
        duration: 1.3,
        ease: "power3.out",
        onUpdate: () => {
          if (getalEl) getalEl.textContent = getal(f, teller.v);
        },
      },
      start + 0.1,
    );

    const q = (s: string) => kaart.querySelectorAll(s);
    if (f.icoon === "meter") {
      tl.fromTo(
        q("[data-boog]"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0.47, duration: 1.3, ease: "power3.out" },
        start + 0.1,
      )
        .fromTo(
          q("[data-naald]"),
          { rotation: -90 },
          {
            rotation: METER_HOEK,
            svgOrigin: "20 28",
            duration: 1.3,
            ease: "back.out(1.6)",
          },
          start + 0.1,
        )
        .fromTo(
          q("[data-balk]"),
          { scaleX: 0, transformOrigin: "0% 50%" },
          { scaleX: 1, duration: 1.3, ease: "power3.out" },
          start + 0.15,
        );
    } else if (f.icoon === "staven") {
      tl.fromTo(
        q("[data-staaf]"),
        { scaleY: 0, transformOrigin: "50% 100%" },
        { scaleY: 1, duration: 0.9, ease: "expo.out", stagger: 0.09 },
        start + 0.1,
      );
    } else {
      tl.fromTo(
        q("[data-ring]"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
        start + 0.1,
      ).fromTo(
        q("[data-wijzer]"),
        { rotation: 0 },
        { rotation: 378, svgOrigin: "20 22", duration: 1.3, ease: "expo.out" },
        start + 0.1,
      );
    }
  });
  return tl;
}
