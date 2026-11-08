import type { ElementType, ReactNode } from "react";
import { ArrowRight, Check, Clock, MessageCircle, Plus, Star } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import LandingHero from "@/components/LandingHero";
import { Link } from "@/lib/router-compat";
import Reveal from "@/components/Reveal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { companyInfo } from "@/config/company";

/*
 * Bouwblokken voor de dienstpagina's (website op maat, webshops, e-commerce),
 * in de stijl van de installateurspagina: witte secties, sectiekoppen links,
 * punten met haarlijnen in plaats van kaarten en een effen donkergroen paneel
 * voor het prijsblok. Geen inloopanimaties tijdens het scrollen; de hero speelt
 * alleen bij het laden.
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
  tweedeKnop,
}: {
  kruimels: { label: string; path: string }[];
  /** Eerste deel van de kop. */
  titel: string;
  /** Laatste deel van de kop (optioneel). */
  accent?: string;
  intro: ReactNode;
  /** Optioneel kadertje onder de intro. */
  kader?: ReactNode;
  knop: { label: string; to: string };
  /** Tweede knop (outline). Zonder deze prop: WhatsApp. */
  tweedeKnop?: { label: string; to: string };
}) {
  // Zelfde hero als de stads-, branche- en werkgebiedpagina's: kop, intro en
  // knoppen links, Justin en Job rechts.
  return (
    <LandingHero
      h1={accent ? `${titel} ${accent}` : titel}
      subtitle={intro}
      kruimels={<Breadcrumb items={kruimels} />}
      onderIntro={
        kader ? (
          <div className="rounded-xl border bg-white px-5 py-4 text-[0.9375rem] leading-relaxed" style={{ borderColor: RAND, color: INKT_65 }}>
            {kader}
          </div>
        ) : undefined
      }
      knoppen={
        <>
          <AnimatedButton to={knop.to} className="h-12 w-full sm:w-auto">
            {knop.label}
          </AnimatedButton>
          {tweedeKnop ? (
            <AnimatedButton to={tweedeKnop.to} variant="outline" className="h-12 w-full sm:w-auto">
              {tweedeKnop.label}
            </AnimatedButton>
          ) : (
            <AnimatedButton href={companyInfo.whatsapp} variant="outline" showArrow={false} className="h-12 w-full sm:w-auto">
              <MessageCircle className="mr-2 inline h-4 w-4" />
              WhatsApp direct
            </AnimatedButton>
          )}
        </>
      }
    />
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
    <div className="mb-10 max-w-4xl md:mb-14">
      <h2 className="sectie-kop">{titel}</h2>
      {intro && (
        <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed" style={{ color: INKT_65 }}>
          {intro}
        </p>
      )}
    </div>
  );
}

// ── Pijlers (drie kaarten) ───────────────────────────────────────

export interface Pijler {
  icon: ElementType;
  title: string;
  subtitle?: string;
  description: string;
}

export function Pijlers({ items }: { items: Pijler[] }) {
  // Drie kolommen met een haarlijn erboven, zonder kaarten en iconen.
  return (
    <div className="grid grid-cols-1 gap-x-10 md:grid-cols-3">
      {items.map((p) => (
        <article key={p.title} className="border-t border-border py-7 md:py-8">
          <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">{p.title}</h3>
          {p.subtitle && (
            <p className="mt-1 text-sm font-semibold" style={{ color: GROEN }}>
              {p.subtitle}
            </p>
          )}
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.description}</p>
        </article>
      ))}
    </div>
  );
}

// ── Stappen ──────────────────────────────────────────────────────

export function Stappen({ items }: { items: { title: string; description: string }[] }) {
  return (
    <ol className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <li key={s.title} className="border-t border-border py-7">
          <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">{s.title}</h3>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.description}</p>
        </li>
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
  const kolom = (titel: string, punten: string[], Icon: ElementType) => (
    <div className="border-t border-border pt-7">
      <h3 className="mb-6 text-xl font-semibold tracking-tight text-foreground md:text-2xl">{titel}</h3>
      <ul className="grid gap-3.5 sm:grid-cols-2 sm:gap-x-6">
        {punten.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Icon className="mt-1 h-4 w-4 shrink-0" style={{ color: GROEN }} strokeWidth={2.6} aria-hidden="true" />
            <span className="text-base leading-relaxed" style={{ color: INKT_65 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
      {kolom(standaardTitel, standaard, Check)}
      {kolom(extraTitel, extra, Plus)}
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
  /** to voor een interne pagina, href voor een externe link (nieuw tabblad). */
  knop: { label: string; to?: string; href?: string };
}) {
  // Effen donkergroen, zoals de uitgelichte kolom van de pakketten.
  return (
    <section className="bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 text-white md:p-12" style={{ background: "hsl(160 84% 16%)" }}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="sectie-kop" style={{ color: "white" }}>
                {titel}
              </h2>
              <p className="mt-4 text-base font-light leading-relaxed text-white/75 md:text-lg">{tekst}</p>
            </div>
            <div className="shrink-0">
              <AnimatedButton {...(knop.href ? { href: knop.href } : { to: knop.to ?? "/contact" })} size="lg" variant="white">
                {knop.label}
              </AnimatedButton>
            </div>
          </div>
        </div>
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

// ── Lopende tekst ────────────────────────────────────────────────

export function Tekst({ children }: { children: ReactNode }) {
  return (
    <Reveal afstand={20}>
      <div className="max-w-3xl space-y-5 text-lg font-light leading-relaxed" style={{ color: INKT_65 }}>
        {children}
      </div>
    </Reveal>
  );
}

// ── Pakketten (prijskaarten) ─────────────────────────────────────

export interface Pakket {
  naam: string;
  prijs: string;
  omschrijving: string;
  levertijd?: string;
  /** Groene rand en schaduw, voor het meest gekozen pakket. */
  uitgelicht?: boolean;
}

/**
 * Prijzen als één strak blok in plaats van losse kaarten: drie kolommen met dunne
 * scheidingslijnen, een grote prijs en per kolom een knop. Het uitgelichte pakket
 * staat in het donkergroen. Op de telefoon onder elkaar.
 */
export function Pakketten({ items }: { items: Pakket[] }) {
  return (
    <div
      className="grid grid-cols-1 overflow-hidden rounded-3xl border bg-white md:grid-cols-3"
      style={{ borderColor: RAND }}
    >
      {items.map((p, i) => {
        const vanaf = /^vanaf\s+/i.test(p.prijs);
        const bedrag = p.prijs.replace(/^vanaf\s+/i, "");
        const donker = Boolean(p.uitgelicht);
        return (
          <article
            key={p.naam}
            className={`relative flex flex-col p-8 md:p-10 ${i > 0 && !donker && !items[i - 1]?.uitgelicht ? "border-t md:border-l md:border-t-0" : ""}`}
            style={{
              borderColor: RAND,
              background: donker ? "hsl(160 84% 16%)" : undefined,
              color: donker ? "white" : undefined,
            }}
          >
            <h3 className={`text-lg font-semibold tracking-tight ${donker ? "" : "sw-ink"}`}>{p.naam}</h3>
            <p className="mt-8 flex items-baseline gap-2">
              {vanaf && (
                <span className="text-base font-light" style={{ color: donker ? "rgba(255,255,255,0.7)" : INKT_65 }}>
                  vanaf
                </span>
              )}
              <span
                className={`text-5xl font-normal md:text-6xl ${donker ? "" : "sw-ink"}`}
                style={{ letterSpacing: "-0.035em", lineHeight: 1 }}
              >
                {bedrag}
              </span>
            </p>
            <p
              className="mt-6 text-[0.9375rem] font-light leading-relaxed md:text-base"
              style={{ color: donker ? "rgba(255,255,255,0.78)" : INKT_65 }}
            >
              {p.omschrijving}
            </p>
            <div className="mt-auto pt-10">
              {p.levertijd && (
                <p
                  className="mb-6 flex items-center gap-2 border-t pt-6 text-sm"
                  style={{ color: donker ? "rgba(255,255,255,0.78)" : INKT_65, borderColor: donker ? "rgba(255,255,255,0.16)" : RAND }}
                >
                  <Clock className="h-4 w-4 shrink-0" style={{ color: donker ? "white" : GROEN }} aria-hidden="true" />
                  Levertijd: {p.levertijd}
                </p>
              )}
              <AnimatedButton to="/contact" variant={donker ? "white" : "outline"} className="h-12 w-full">
                Start je project
              </AnimatedButton>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ── Lijst met vinkjes in een kaart ───────────────────────────────

export function Vinkjes({ items }: { items: string[] }) {
  return (
    <Reveal afstand={24}>
      <div className="rounded-2xl border bg-white p-7 md:p-9" style={{ borderColor: RAND }}>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-x-10">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="mt-1 h-4 w-4 shrink-0" style={{ color: GROEN }} strokeWidth={2.6} aria-hidden="true" />
              <span className="text-[0.9375rem] leading-relaxed" style={{ color: INKT_65 }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

// ── Interne links als knoppen (branches, regio's) ────────────────

export function Linkjes({ items }: { items: { label: string; to: string }[] }) {
  return (
    <Reveal afstand={20}>
      <div className="flex flex-wrap gap-2.5">
        {items.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="group inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2.5 text-sm font-medium sw-ink transition-colors hover:border-[hsl(var(--sw-green))]"
            style={{ borderColor: RAND }}
          >
            {l.label}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              style={{ color: GROEN }}
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </Reveal>
  );
}

export { GROEN, GROEN_LICHT, RAND };
