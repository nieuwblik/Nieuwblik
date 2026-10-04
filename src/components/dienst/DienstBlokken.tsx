import type { ElementType, ReactNode } from "react";
import { Check, MessageCircle, Plus, Star } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";

/*
 * Bouwblokken voor de dienstpagina's (website op maat, webshops, e-commerce),
 * in de stijl van de homepage en /diensten: grote koppen in --sw-ink met een
 * groen accent, lichte lopende tekst, witte kaarten op --sw-paper en een
 * donkergroen paneel voor het prijsblok. Animatie alleen via Reveal (CSS,
 * één keer); de hero speelt een CSS-animatie bij het laden af, zodat de kop
 * meteen zichtbaar is.
 */

export const INKT_65 = "hsl(var(--sw-ink) / 0.65)";
const GROEN = "hsl(var(--sw-green))";
const GROEN_LICHT = "hsl(160 70% 58%)";
const RAND = "hsl(var(--sw-rule) / 0.1)";

const LADEN = "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards motion-reduce:animate-none";

// ── Hero ─────────────────────────────────────────────────────────

export function DienstHero({
  kruimels,
  titel,
  accent,
  intro,
  kader,
  knop,
}: {
  kruimels: { label: string; path: string }[];
  /** Eerste deel van de kop, in inkt. */
  titel: string;
  /** Laatste deel van de kop, in het groen (optioneel). */
  accent?: string;
  intro: ReactNode;
  /** Optioneel kadertje onder de intro. */
  kader?: ReactNode;
  knop: { label: string; to: string };
}) {
  return (
    <section className="pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6">
        <Breadcrumb items={kruimels} />
        <div className={`mt-10 md:mt-14 ${LADEN}`}>
          <h1
            className="max-w-5xl text-4xl font-bold tracking-tight sw-ink md:text-6xl lg:text-7xl"
            style={{ lineHeight: 1.02 }}
          >
            {titel}
            {accent && (
              <>
                {" "}
                <span style={{ color: GROEN }}>{accent}</span>
              </>
            )}
          </h1>
        </div>
        <div className={`${LADEN} delay-100`}>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed md:text-xl" style={{ color: INKT_65 }}>
            {intro}
          </p>
          {kader && (
            <div
              className="mt-6 max-w-2xl rounded-xl border bg-white px-5 py-4 text-[0.9375rem] leading-relaxed"
              style={{ borderColor: RAND, color: INKT_65 }}
            >
              {kader}
            </div>
          )}
        </div>
        <div className={`mt-10 flex flex-col gap-3 sm:flex-row ${LADEN} delay-200`}>
          <AnimatedButton to={knop.to} size="lg">
            {knop.label}
          </AnimatedButton>
          <AnimatedButton href={companyInfo.whatsapp} size="lg" variant="outline" showArrow={false}>
            <MessageCircle className="mr-2 inline h-5 w-5" />
            WhatsApp direct
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}

// ── Sectie en kop ────────────────────────────────────────────────

export function Sectie({
  papier = false,
  children,
}: {
  /** Achtergrond in --sw-paper in plaats van wit. */
  papier?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`py-16 md:py-24 ${papier ? "sw-paper" : ""}`}>
      <div className="container mx-auto px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function SectieKop({ titel, intro }: { titel: string; intro?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <Reveal afstand={20}>
        <h2
          className="max-w-4xl text-3xl font-bold tracking-tight sw-ink md:text-5xl"
          style={{ lineHeight: 1.04 }}
        >
          {titel}
        </h2>
      </Reveal>
      {intro && (
        <Reveal afstand={20} delay={0.06}>
          <p className="mt-4 max-w-2xl text-lg font-light leading-relaxed" style={{ color: INKT_65 }}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

// ── Pijlers (drie kaarten) ───────────────────────────────────────

export interface Pijler {
  icon: ElementType;
  title: string;
  subtitle: string;
  description: string;
}

export function Pijlers({ items }: { items: Pijler[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {items.map((p, i) => {
        const Icon = p.icon;
        return (
          <Reveal key={p.title} afstand={24} delay={i * 0.08} className="h-full">
            <article className="h-full rounded-2xl border bg-white p-7 md:p-8" style={{ borderColor: RAND }}>
              <span
                className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: "hsl(var(--sw-green) / 0.08)" }}
              >
                <Icon className="h-5 w-5" style={{ color: GROEN }} aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold tracking-tight sw-ink">{p.title}</h3>
              <p className="mt-1 text-sm font-semibold" style={{ color: GROEN }}>
                {p.subtitle}
              </p>
              <p className="mt-4 text-[0.9375rem] font-light leading-relaxed" style={{ color: INKT_65 }}>
                {p.description}
              </p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

// ── Stappen ──────────────────────────────────────────────────────

export function Stappen({ items }: { items: { title: string; description: string }[] }) {
  return (
    <ol className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <Reveal key={s.title} as="li" afstand={20} delay={i * 0.08}>
          <span
            aria-hidden="true"
            className="mb-5 block h-2.5 w-2.5 rounded-full"
            style={{ background: GROEN, boxShadow: "0 0 0 5px hsl(var(--sw-green) / 0.12)" }}
          />
          <h3 className="text-lg font-bold tracking-tight sw-ink">{s.title}</h3>
          <p className="mt-2 text-[0.9375rem] font-light leading-relaxed" style={{ color: INKT_65 }}>
            {s.description}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}

// ── Inbegrepen / uitbreidingen ───────────────────────────────────

export function Inbegrepen({
  standaardTitel,
  standaard,
  extraTitel,
  extra,
}: {
  standaardTitel: string;
  standaard: string[];
  extraTitel: string;
  extra: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Reveal afstand={24}>
        <div className="h-full rounded-2xl border bg-white p-7 md:p-9" style={{ borderColor: RAND }}>
          <h3 className="mb-6 text-xl font-bold tracking-tight sw-ink">{standaardTitel}</h3>
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-6">
            {standaard.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GROEN }} strokeWidth={2.6} aria-hidden="true" />
                <span className="text-[0.9375rem]" style={{ color: INKT_65 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal afstand={24} delay={0.08}>
        <div
          className="h-full rounded-2xl border p-7 md:p-9"
          style={{ borderColor: RAND, background: "hsl(var(--sw-green) / 0.04)" }}
        >
          <h3 className="mb-6 text-xl font-bold tracking-tight sw-ink">{extraTitel}</h3>
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-6">
            {extra.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Plus className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GROEN }} strokeWidth={2.4} aria-hidden="true" />
                <span className="text-[0.9375rem]" style={{ color: INKT_65 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

// ── Prijs- of offerteblok: donkergroen paneel ────────────────────

export function GroenPaneel({
  titel,
  tekst,
  knop,
}: {
  titel: string;
  tekst: ReactNode;
  knop: { label: string; to: string };
}) {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal afstand={30}>
          <div
            className="relative overflow-hidden rounded-2xl border p-8 text-white md:p-12"
            style={{
              borderColor: "hsl(160 70% 58% / 0.14)",
              background: "linear-gradient(165deg, hsl(160 84% 11%) 0%, hsl(160 84% 8%) 100%)",
              boxShadow: "0 30px 70px -30px rgba(0,0,0,0.55)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 80% 70% at 15% 0%, hsl(160 70% 45% / 0.22) 0%, transparent 60%)" }}
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl" style={{ lineHeight: 1.04 }}>
                  {titel}
                </h2>
                <p className="mt-4 text-base font-light leading-relaxed text-white/75 md:text-lg">{tekst}</p>
              </div>
              <div className="shrink-0">
                <AnimatedButton to={knop.to} size="lg" variant="white">
                  {knop.label}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Veelgestelde vragen (alle antwoorden zichtbaar) ──────────────

export function Vragen({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((f, i) => (
        <Reveal key={f.question} afstand={20} delay={(i % 2) * 0.06}>
          <div className="h-full rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: RAND }}>
            <h3 data-faq-vraag="" className="text-base font-bold tracking-tight sw-ink md:text-lg">
              {f.question}
            </h3>
            <p className="mt-2 text-[0.9375rem] font-light leading-relaxed" style={{ color: INKT_65 }}>
              {f.answer}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

// ── Klantquote ───────────────────────────────────────────────────

export function Quote({ tekst, naam }: { tekst: string; naam: string }) {
  return (
    <Reveal afstand={24}>
      <figure className="max-w-4xl">
        <div className="mb-6 flex gap-1" aria-label="5 sterren">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="h-5 w-5" style={{ color: GROEN, fill: GROEN }} aria-hidden="true" />
          ))}
        </div>
        <blockquote
          className="text-2xl font-semibold tracking-tight sw-ink md:text-4xl"
          style={{ lineHeight: 1.2 }}
        >
          "{tekst}"
        </blockquote>
        <figcaption className="mt-6 text-base" style={{ color: INKT_65 }}>
          {naam}
        </figcaption>
      </figure>
    </Reveal>
  );
}

export { GROEN, GROEN_LICHT, RAND };
