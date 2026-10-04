import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import Reveal from "@/components/Reveal";

// AI / search-engine logos (kept from the original vindbaarheid section)
import claudeLogo from "@/assets/ai/claude-logo.webp";
import copilotLogo from "@/assets/ai/copilot-logo.webp";
import grokLogo from "@/assets/ai/grok-logo.webp";
import perplexityLogo from "@/assets/ai/perplexity-logo.webp";

// ── Brand tokens (Nieuwblik) ───────────────────────────────────
const GREEN_LINE = "hsl(160, 84%, 45%)"; // glowing accent line (matches connection-line green)
const GREEN_LIGHT = "hsl(160, 70%, 58%)"; // accent text on dark
const EASE = [0.22, 1, 0.36, 1] as const;

// Peak of the growth curve, expressed in the 600×300 viewBox so the tooltip
// (positioned with %) lines up with the SVG point exactly. Kept well short of
// the right edge (~70%, not ~78%) so the tooltip — centred on this point but
// rendered in real pixels, not viewBox units — has room to fit inside the
// card on narrow mobile widths instead of overflowing/clipping.
const PEAK_X = 420;
const PEAK_Y = 66;
const PEAK_LEFT = (PEAK_X / 600) * 100;
const PEAK_TOP = (PEAK_Y / 300) * 100;

/*
 * Animatie.
 *
 * De opbouw speelt één keer en is bewust eenvoudig: kop, tekst, paneel en
 * tegels komen met Reveal binnen (opdoemen en een stukje omhoog, CSS-overgang
 * op transform en opacity, dus de compositor doet het werk). Eerder hing alles
 * aan de scroll, met een 3D-kantelend paneel, woord voor woord draaiende
 * koppen en een blur-filter op de bewegende lijn; dat liep bij de eerste keer
 * haperig.
 *
 * Alleen de groeilijn volgt de scroll, in beide richtingen: hij tekent zich
 * mee naar beneden en loopt terug als je omhoog scrolt. Stip, label en
 * stippellijn verschijnen zodra hij de piek bereikt. De gloed van de lijn is
 * een tweede, bredere en doorzichtige lijn in plaats van een SVG-filter, zodat
 * er per beeldje niets geblurd hoeft te worden.
 */
const SPRING = { stiffness: 150, damping: 28, mass: 0.35, restDelta: 0.0005 };

/** Waarde van a naar b over [van, tot] van de voortgang; buiten dat venster geklemd. */
const useRange = (
  p: MotionValue<number>,
  van: number,
  tot: number,
  a: number,
  b: number,
) => useTransform(p, [van, tot], [a, b], { clamp: true });

// Eén maat voor alle zes logo's in hun witte tegel van 32px. Google en
// ChatGPT waren inline-SVG's van 24–28px, de rest afbeeldingen van 16px; nu
// zijn ze even groot. De afbeeldingen in src/assets/ai zijn daarvoor
// bijgesneden tot het logo zelf en vierkant gemaakt (Copilot had veel lege
// ruimte opzij en werd daardoor nog kleiner weergegeven).
const LOGO = "h-5 w-5";

// Brand marks for the inline (multi-colour) logos.
const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className={LOGO} aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const OpenAIMark = () => (
  <svg viewBox="0 0 24 24" className={LOGO} aria-hidden="true">
    <path
      d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
      fill="#10A37F"
    />
  </svg>
);

// Channels shown as the "geoptimaliseerd per kanaal" tiles. `kind` is the
// optimisation discipline (SEO for Google, GEO/AEO for the AI engines).
type Channel = { name: string; kind: string; node?: ReactNode; img?: string };
const CHANNELS: Channel[] = [
  { name: "Google", kind: "SEO", node: <GoogleMark /> },
  { name: "ChatGPT", kind: "GEO", node: <OpenAIMark /> },
  { name: "Perplexity", kind: "GEO", img: perplexityLogo },
  { name: "Claude", kind: "GEO", img: claudeLogo },
  { name: "Copilot", kind: "GEO", img: copilotLogo },
  { name: "Grok", kind: "AEO", img: grokLogo },
];

// Live ticker of engines shown in the panel header.
const TICKER = ["Google", "ChatGPT", "Perplexity", "Claude", "Copilot", "Grok"];

/** Kanaaltegel: komt om en om iets na de vorige binnen. */
const ChannelTile = ({ c, i }: { c: Channel; i: number }) => (
  <Reveal
    from={i % 2 === 0 ? "links" : "rechts"}
    afstand={12}
    delay={0.05 * i}
    className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5"
  >
    {/* Logo tile */}
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs">
      {c.node ?? (
        <img
          src={c.img}
          alt={c.name}
          className={`${LOGO} object-contain`}
          loading="lazy"
          width={20}
          height={20}
        />
      )}
    </span>

    {/* Name + optimisation kind */}
    <span className="flex min-w-0 flex-1 flex-col leading-tight">
      <span className="truncate text-sm text-white/85">{c.name}</span>
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/40">
        {c.kind}
      </span>
    </span>

    {/* Status */}
    <Check
      className="h-4 w-4 shrink-0"
      style={{ color: GREEN_LIGHT }}
      strokeWidth={2.6}
    />
  </Reveal>
);

const LIJN = "M 0 250 C 80 244 150 232 215 197 C 290 157 340 112 420 66";

const SearchVisibility = () => {
  const reduce = useReducedMotion();

  // Rotating "Vindbaar in …" ticker in the panel header.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((i) => (i + 1) % TICKER.length), 2200);
    return () => clearInterval(t);
  }, []);

  // ── Groeilijn: volgt de scroll in beide richtingen ─────────────
  // Begint zodra het paneel onderin beeld komt, staat als het midden op 55%
  // van het scherm staat.
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "center 0.55"],
  });
  const lijn = useSpring(scrollYProgress, SPRING);

  const lineLength = useRange(lijn, 0.36, 0.86, 0, 1);
  const dotScale = useRange(lijn, 0.84, 0.92, 0, 1);
  const extrasOpacity = useRange(lijn, 0.86, 0.98, 0, 1);
  const tooltipY = useRange(lijn, 0.88, 0.98, 10, 0);

  // Ring rond de piek pulseert pas als de lijn daar is; scroll je terug, dan stopt hij.
  const [peaked, setPeaked] = useState(false);
  useMotionValueEvent(lijn, "change", (v) => {
    const nu = v > 0.9;
    setPeaked((oud) => (oud === nu ? oud : nu));
  });
  const pulseOn = reduce ? false : peaked;

  return (
    <section className="sw-paper overflow-hidden py-20 md:py-28 lg:py-36">
      <div className="container mx-auto grid grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        {/* ── Left — editorial heading + intro + CTA ─────────────── */}
        <div>
          <Reveal afstand={14} className="mb-6">
            <span
              className="sw-mono inline-block"
              style={{ color: "hsl(var(--sw-green))" }}
            >
              Vindbaarheid
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold tracking-tight sw-ink"
              style={{ lineHeight: 1.03 }}
            >
              Vindbaar in elke zoekmachine,{" "}
              <span style={{ color: "hsl(var(--sw-green))" }}>
                van Google tot AI
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p
              className="mt-6 max-w-xl text-lg md:text-xl font-light leading-relaxed"
              style={{ color: "hsl(var(--sw-ink) / 0.65)" }}
            >
              Of je klanten nu zoeken via Google, vragen stellen aan ChatGPT, of
              advies vragen aan Claude: jouw website wordt gevonden.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              className="mt-7 max-w-lg text-base font-light italic leading-relaxed"
              style={{ color: "hsl(var(--sw-ink) / 0.5)" }}
            >
              "Zichtbaarheid is geen toeval, het is strategie. Wij zorgen dat
              jouw website de juiste vindbaarheid krijgt, vandaag en in de
              toekomst."
            </p>
          </Reveal>

          <Reveal delay={0.26} className="mt-10">
            <AnimatedButton to="/contact" size="lg">
              Boost mijn vindbaarheid
            </AnimatedButton>
          </Reveal>
        </div>

        {/* ── Right — dark instrument panel ──────────────────────── */}
        <Reveal afstand={40} delay={0.1}>
          <div
            ref={panelRef}
            className="relative overflow-hidden rounded-2xl border p-6 text-white md:p-8"
            style={{
              borderColor: "hsl(160 70% 58% / 0.14)",
              background:
                "linear-gradient(165deg, hsl(160 84% 11%) 0%, hsl(160 84% 8%) 100%)",
              boxShadow: "0 30px 70px -30px rgba(0,0,0,0.55)",
            }}
          >
            {/* Gloed bovenin */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 90% 60% at 50% 0%, hsl(160 70% 45% / 0.22) 0%, transparent 62%)",
              }}
            />

            {/* Header — label + live engine ticker */}
            <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <span
                className="sw-mono shrink-0"
                style={{
                  background: "hsl(160 70% 58% / 0.12)",
                  color: GREEN_LIGHT,
                  padding: "6px 11px",
                  borderRadius: 8,
                }}
              >
                Zichtbaarheid
              </span>
              <span className="flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/45 sm:text-[0.7rem] sm:tracking-[0.14em]">
                Vindbaar in
                <span className="relative inline-flex h-4 min-w-[70px] items-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={TICKER[tick]}
                      initial={{ y: reduce ? 0 : 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: reduce ? 0 : -12, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="absolute left-0 font-semibold normal-case tracking-normal text-[0.8rem]"
                      style={{ color: GREEN_LIGHT }}
                    >
                      {TICKER[tick]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </div>

            {/* Growth curve — tekent zich mee met je scroll, piekt, en loopt dan door */}
            <div className="relative mt-10 aspect-[2/1] w-full">
              <svg
                viewBox="0 0 600 300"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  <filter
                    id="sv-dot-glow"
                    x="-400%"
                    y="-400%"
                    width="900%"
                    height="900%"
                  >
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Drop line from the peak to the axis */}
                <motion.line
                  x1={PEAK_X}
                  y1={PEAK_Y + 8}
                  x2={PEAK_X}
                  y2={272}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={1}
                  strokeDasharray="2 6"
                  style={{ opacity: reduce ? 1 : extrasOpacity }}
                />

                {/* Gloed: brede, doorzichtige lijn eronder (geen filter) */}
                <motion.path
                  d={LIJN}
                  fill="none"
                  stroke={GREEN_LINE}
                  strokeOpacity={0.22}
                  strokeWidth={14}
                  strokeLinecap="round"
                  style={{ pathLength: reduce ? 1 : lineLength }}
                />
                {/* De lijn zelf — lengte volgt de scroll */}
                <motion.path
                  d={LIJN}
                  fill="none"
                  stroke={GREEN_LINE}
                  strokeWidth={3}
                  strokeLinecap="round"
                  style={{ pathLength: reduce ? 1 : lineLength }}
                />

                {/* Dotted continuation — sustained visibility */}
                <motion.path
                  d="M 420 66 C 470 50 535 46 600 44"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray="0.1 11"
                  style={{ opacity: reduce ? 1 : extrasOpacity }}
                />

                {/* Pulsing ring at the peak — pas zodra de lijn daar is */}
                <motion.circle
                  cx={PEAK_X}
                  cy={PEAK_Y}
                  r={9}
                  fill="hsl(160 84% 45% / 0.5)"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                  initial={{ opacity: 0 }}
                  animate={
                    pulseOn
                      ? { scale: [1, 2.4], opacity: [0.55, 0] }
                      : { scale: 1, opacity: 0 }
                  }
                  transition={
                    pulseOn
                      ? { duration: 1.5, repeat: Infinity, ease: "easeOut" }
                      : { duration: 0.2 }
                  }
                />
                {/* Peak dot */}
                <motion.circle
                  cx={PEAK_X}
                  cy={PEAK_Y}
                  r={7}
                  fill="#ffffff"
                  filter="url(#sv-dot-glow)"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    ...(reduce ? {} : { scale: dotScale, opacity: dotScale }),
                  }}
                />
              </svg>

              {/* Tooltip above the peak */}
              <div
                className="absolute"
                style={{ left: `${PEAK_LEFT}%`, top: `${PEAK_TOP}%` }}
              >
                <motion.div
                  className="absolute bottom-full left-1/2 mb-5 -translate-x-1/2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 sm:px-3.5 sm:py-2"
                  style={{
                    borderColor: "hsl(160 70% 58% / 0.25)",
                    background: "hsl(160 84% 7% / 0.85)",
                    ...(reduce ? {} : { opacity: extrasOpacity, y: tooltipY }),
                  }}
                >
                  <span className="font-mono text-xs font-semibold text-white sm:text-sm">
                    100%
                  </span>
                  <span className="ml-1.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-white/55 sm:text-[0.625rem] sm:tracking-[0.16em]">
                    zichtbaar
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Axis — visibility growth over time. The middle "Top posities"
                label is hidden below sm: on narrow phones there isn't enough
                room between "Start" and "Blijvend" to fit it without
                overlapping — the tooltip above the peak already says
                "100% zichtbaar", so nothing is lost. */}
            <div className="relative mt-5 h-4 font-mono text-[0.6875rem] tracking-[0.08em]">
              <span className="absolute left-0 text-white/40">Start</span>
              <span
                className="absolute hidden -translate-x-1/2 whitespace-nowrap font-semibold text-white sm:block"
                style={{ left: `${PEAK_LEFT}%` }}
              >
                Top posities
              </span>
              <span className="absolute right-0 text-white/40">Blijvend</span>
            </div>

            {/* Coverage per channel */}
            <div className="relative mt-10 border-t border-white/10 pt-8">
              <h3
                className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: GREEN_LIGHT }}
              >
                Geoptimaliseerd per kanaal
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
                {CHANNELS.map((c, i) => (
                  <ChannelTile key={c.name} c={c} i={i} />
                ))}
              </div>
            </div>

            <p className="relative mt-8 max-w-md text-sm leading-relaxed text-white/55">
              Van klassieke SEO tot GEO voor AI-zoekmachines: we bouwen je
              website zo dat elk platform hem begrijpt, indexeert en aanbeveelt.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SearchVisibility;
