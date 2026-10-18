import { useState } from "react";
import { Check, Mail, MessageCircle } from "lucide-react";
import { companyInfo } from "@/config/company";
import { HOSTING_PER_MAAND, euroMetCenten, euroTeken } from "@/config/business";
import { EXTRAS, SITE_TYPES, berekenIndicatie, type Extra, type SiteType } from "@/lib/kostenCalculator";

const GROEN = "hsl(var(--sw-green))";
const RAND = "hsl(var(--sw-rule) / 0.1)";
const INKT_65 = "hsl(var(--sw-ink) / 0.65)";

export default function KostenCalculator() {
  const [type, setType] = useState<SiteType>("starter");
  const [extras, setExtras] = useState<Extra[]>([]);
  const { van, tot } = berekenIndicatie(type, extras);

  const toggle = (e: Extra) => setExtras((huidig) => (huidig.includes(e) ? huidig.filter((x) => x !== e) : [...huidig, e]));

  const bericht = [
    "Hoi Nieuwblik, ik heb de kosten calculator ingevuld:",
    `Soort: ${SITE_TYPES[type].label}`,
    extras.length ? `Extra's: ${extras.map((e) => EXTRAS[e].label).join(", ")}` : "Extra's: geen",
    `Indicatie: ${euroTeken(van)} tot ${euroTeken(tot)}`,
    "Kunnen jullie een vaste prijs voor me maken?",
  ].join("\n");
  const whatsapp = `${companyInfo.whatsapp}?text=${encodeURIComponent(bericht)}`;
  const mail = `mailto:${companyInfo.email}?subject=${encodeURIComponent("Prijsindicatie website")}&body=${encodeURIComponent(bericht)}`;

  const knop = (actief: boolean) => ({
    borderColor: actief ? GROEN : RAND,
    boxShadow: actief ? "0 0 0 1px hsl(var(--sw-green))" : undefined,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border bg-white p-6 md:p-8" style={{ borderColor: RAND }}>
        <h3 className="text-lg font-bold tracking-tight sw-ink">1. Wat voor site wil je?</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Soort website">
          {(Object.keys(SITE_TYPES) as SiteType[]).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={type === t}
              onClick={() => setType(t)}
              className="rounded-xl border p-4 text-left transition-colors"
              style={knop(type === t)}
            >
              <span className="block font-semibold sw-ink">{SITE_TYPES[t].label}</span>
              <span className="mt-1 block text-sm" style={{ color: INKT_65 }}>{SITE_TYPES[t].uitleg}</span>
            </button>
          ))}
        </div>

        <h3 className="mt-8 text-lg font-bold tracking-tight sw-ink">2. Wat heb je nog meer nodig?</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(EXTRAS) as Extra[]).map((e) => {
            const aan = extras.includes(e);
            return (
              <button
                key={e}
                type="button"
                aria-pressed={aan}
                onClick={() => toggle(e)}
                className="flex items-center gap-3 rounded-xl border p-4 text-left transition-colors"
                style={knop(aan)}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border" style={{ borderColor: aan ? GROEN : RAND, background: aan ? GROEN : undefined }}>
                  {aan && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} aria-hidden="true" />}
                </span>
                <span className="text-sm font-medium sw-ink">{EXTRAS[e].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col rounded-2xl p-6 text-primary-foreground md:p-8" style={{ background: "hsl(160 84% 12%)" }} aria-live="polite">
        <p className="text-sm font-medium opacity-80">Jouw prijsindicatie</p>
        <p className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          {euroTeken(van)} <span className="text-2xl font-semibold opacity-80">tot {euroTeken(tot)}</span>
        </p>
        <p className="mt-4 text-sm leading-relaxed opacity-80">
          Eenmalig, excl. btw. Hosting met basisonderhoud is optioneel, vanaf {euroMetCenten(HOSTING_PER_MAAND)} per maand. Na een kort gesprek krijg je een vaste prijs.
        </p>
        <div className="mt-auto flex flex-col gap-3 pt-8">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-background px-5 py-3 font-semibold sw-ink">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Stuur via WhatsApp
          </a>
          <a href={mail} className="inline-flex items-center justify-center gap-2 rounded-md border border-current px-5 py-3 font-semibold">
            <Mail className="h-4 w-4" aria-hidden="true" /> Stuur per e-mail
          </a>
        </div>
      </div>
    </div>
  );
}
