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

const GROEN = "hsl(var(--sw-green))";
const SPOOR = "hsl(var(--sw-green) / 0.14)";

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
            stroke="hsl(var(--sw-ink))"
            strokeWidth={2.2}
            strokeLinecap="round"
            transform={`rotate(${METER_HOEK} 20 28)`}
          />
          <circle cx="20" cy="28" r="2.4" fill="hsl(var(--sw-ink))" />
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
            stroke="hsl(var(--sw-ink))"
            strokeWidth={2.2}
            strokeLinecap="round"
            transform="rotate(18 20 22)"
          />
          <circle cx="20" cy="22" r="2" fill="hsl(var(--sw-ink))" />
        </>
      )}
    </svg>
  );
}

/** Plek van elke kaart rond het display, alleen vanaf lg. */
const PLEK = [
  "lg:right-[-4%] lg:top-[5%] xl:right-[-13%]",
  "lg:left-[-4%] lg:top-[56%] xl:left-[-15%]",
  "lg:right-[4%] lg:top-[77%]",
];

export function FeitKaarten() {
  return (
    <ul className="mt-4 grid grid-cols-3 gap-2 lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:block">
      {FEITEN.map((f, i) => (
        <li
          key={f.icoon}
          data-feit={i}
          className={`rounded-xl border bg-white/90 p-2.5 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-3 lg:absolute lg:z-30 lg:w-[220px] lg:rounded-2xl lg:p-4 ${PLEK[i]}`}
          style={{ borderColor: "hsl(var(--sw-rule) / 0.1)" }}
        >
          <div className="mb-2 hidden h-10 w-10 lg:block">
            <IcoonSvg soort={f.icoon} />
          </div>
          <p
            data-getal=""
            className="text-lg font-bold tabular-nums tracking-tight sw-ink sm:text-xl lg:text-3xl"
            style={{ lineHeight: 1.05 }}
          >
            {getal(f, f.waarde)}
          </p>
          <p
            className="mt-1 text-[11px] leading-snug sm:text-xs lg:text-sm"
            style={{ color: "hsl(var(--sw-ink) / 0.65)" }}
          >
            {f.tekst}
          </p>
          <p
            className="mt-1.5 text-[10px] leading-tight lg:text-[11px]"
            style={{ color: "hsl(var(--sw-ink) / 0.4)" }}
          >
            Bron: {f.bron}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Gepauzeerde tijdlijn voor de kaarten binnen `root`. */
export function maakFeitenTijdlijn(root: HTMLElement) {
  const tl = gsap.timeline({ paused: true });
  FEITEN.forEach((f, i) => {
    const kaart = root.querySelector<HTMLElement>(`[data-feit="${i}"]`);
    if (!kaart) return;
    const start = i * 0.14;
    const teller = { v: f.van };
    const getalEl = kaart.querySelector<HTMLElement>("[data-getal]");

    tl.fromTo(
      kaart,
      { autoAlpha: 0, y: 28, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" },
      start,
    ).fromTo(
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
      ).fromTo(
        q("[data-naald]"),
        { rotation: -90 },
        {
          rotation: METER_HOEK,
          svgOrigin: "20 28",
          duration: 1.3,
          ease: "back.out(1.6)",
        },
        start + 0.1,
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
