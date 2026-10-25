import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { BadgeCheck, CalendarClock, ExternalLink, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { daysUntil } from "@/admin/format";
import {
  heeftData,
  isCredit,
  type Betaling,
  type Onderdeel,
  type OpenFactuur,
  type Uitgaven,
} from "@/admin/financien";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

const datumKort = (d: string | null) => (d ? format(parseISO(d), "d MMM", { locale: nl }).replace(".", "") : "–");

const Fout = ({ tekst }: { tekst: string }) => <p className={cn("text-sm", TOON.danger.tekst)}>{tekst}</p>;

/** Een lijst bedragen als liggende balken, de grootste vol. */
const Balken = ({ titel, regels }: { titel: string; regels: { naam: string; bedrag: number; extra?: string }[] }) => {
  const { bedrag, verborgen } = useBedragenVerborgen();
  const max = Math.max(...regels.map((r) => r.bedrag), 1);
  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-[13px] text-muted-foreground">{titel}</h3>
      {regels.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nog niets geboekt.</p>
      ) : (
        <ul className="space-y-2.5">
          {regels.map((r, i) => (
            <li key={r.naam} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate">
                  {r.naam}
                  {r.extra && <span className="text-muted-foreground"> · {r.extra}</span>}
                </span>
                <span className="shrink-0 font-medium tabular-nums">{bedrag(r.bedrag, 0)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="p-groei-x h-full rounded-full bg-neutral/45"
                  style={{ width: verborgen ? "0%" : `${Math.max(2, (r.bedrag / max) * 100)}%`, animationDelay: `${i * 30}ms` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * Waar het geld heen gaat, het laatste jaar: per leverancier, per categorie
 * en de meest recente inkoopfacturen en bonnetjes. Documenten die in
 * Moneybird nog op verwerking wachten tellen niet mee; dat staat erbij.
 */
export const UitgavenPanel = ({ uitgaven, moneybirdUrl }: { uitgaven: Onderdeel<Uitgaven>; moneybirdUrl: string }) => {
  const { bedrag } = useBedragenVerborgen();
  return (
    <Panel>
      <PanelHeader
        icon={ShoppingBag}
        titel="Uitgaven"
        subtitel={heeftData(uitgaven) ? `Het laatste jaar, excl. btw: ${bedrag(uitgaven.data.totaal, 0)}` : "Het laatste jaar"}
      />
      <PanelBody className="space-y-6">
        {!heeftData(uitgaven) ? (
          <Fout tekst={uitgaven.fout} />
        ) : (
          <>
            {uitgaven.data.nogTeVerwerken > 0 && (
              <p className={cn("rounded-lg border px-3 py-2 text-[13px]", TOON.warning.cel)}>
                {uitgaven.data.nogTeVerwerken}{" "}
                {uitgaven.data.nogTeVerwerken === 1 ? "document wacht" : "documenten wachten"} in Moneybird nog op verwerking
                {uitgaven.data.nogTeVerwerkenBedrag ? ` (samen ongeveer ${bedrag(uitgaven.data.nogTeVerwerkenBedrag, 0)} excl. btw)` : ""}{" "}
                en {uitgaven.data.nogTeVerwerken === 1 ? "telt" : "tellen"} nog niet mee in de totalen.
                {uitgaven.data.recent.some((u) => u.status === "new") && " In Recent staan ze al wel."}{" "}
                <a href={`${moneybirdUrl}/documents`} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                  Verwerken
                </a>
              </p>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              <Balken
                titel="Per leverancier"
                regels={uitgaven.data.perLeverancier.map((l) => ({
                  naam: l.naam,
                  bedrag: l.bedrag,
                  extra: `${l.aantal}×`,
                }))}
              />
              <Balken titel="Per categorie" regels={uitgaven.data.perCategorie} />
            </div>
            {uitgaven.data.recent.length > 0 && (
              <div>
                <h3 className="mb-2 text-[13px] text-muted-foreground">Recent</h3>
                <ul className="-mx-2">
                  {uitgaven.data.recent.map((u) => (
                    <li key={u.id}>
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-rij flex items-center gap-3 rounded-lg px-2 py-2 text-sm"
                      >
                        <span className="w-14 shrink-0 text-[13px] tabular-nums text-muted-foreground">{datumKort(u.datum)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{u.leverancier}</span>
                          <span className="block truncate text-[13px] text-muted-foreground">
                            {/* Nog niet verwerkt in Moneybird: bedrag en leverancier kunnen nog wijzigen. */}
                            {u.status === "new" && <span className={cn("font-medium", TOON.warning.tekst)}>Te verwerken · </span>}
                            {u.soort}
                            {u.valuta && ` in ${u.valuta}, omgerekend`}
                            {u.omschrijving && ` · ${u.omschrijving}`}
                          </span>
                        </span>
                        <span className={cn("shrink-0 tabular-nums", u.status === "new" ? "text-muted-foreground" : "font-medium")}>
                          {u.status === "new" && !u.bedrag ? "–" : bedrag(u.bedrag)}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </PanelBody>
    </Panel>
  );
};

const EMMERS: { label: string; kleur: string; past: (dagenTeLaat: number) => boolean }[] = [
  { label: "Nog niet vervallen", kleur: TOON.neutral.stip, past: (d) => d <= 0 },
  { label: "1 tot 30 dagen te laat", kleur: TOON.warning.stip, past: (d) => d >= 1 && d <= 30 },
  { label: "31 tot 60 dagen te laat", kleur: cn(TOON.danger.stip, "opacity-55"), past: (d) => d >= 31 && d <= 60 },
  { label: "Meer dan 60 dagen te laat", kleur: TOON.danger.stip, past: (d) => d > 60 },
];

/**
 * Hoe oud wat er openstaat is, en wat er de komende weken vervalt. Gerekend
 * vanaf de vervaldatum; creditfacturen tellen niet mee.
 */
export const OuderdomPanel = ({ facturen }: { facturen: OpenFactuur[] }) => {
  const { bedrag, verborgen } = useBedragenVerborgen();
  const open = facturen.filter((f) => !isCredit(f) && f.open > 0);
  const teLaat = (f: OpenFactuur) => -(daysUntil(f.vervaldatum) ?? 0);
  const totaal = open.reduce((som, f) => som + f.open, 0);
  const emmers = EMMERS.map((e) => {
    const lijst = open.filter((f) => e.past(teLaat(f)));
    return { ...e, aantal: lijst.length, bedrag: lijst.reduce((som, f) => som + f.open, 0) };
  });
  const vervaltBinnen = (dagen: number) =>
    open.filter((f) => {
      const d = daysUntil(f.vervaldatum);
      return d !== null && d >= 0 && d <= dagen;
    });

  return (
    <Panel>
      <PanelHeader icon={CalendarClock} titel="Ouderdom" subtitel="Wat er openstaat, naar hoe lang het al vervallen is" />
      <PanelBody className="space-y-5">
        {open.length === 0 ? (
          <p className="text-sm text-muted-foreground">Er staat niets open.</p>
        ) : (
          <>
            <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              {!verborgen &&
                emmers.map(
                  (e) =>
                    e.bedrag > 0 && (
                      <span
                        key={e.label}
                        className={cn("h-full border-r-2 border-card last:border-r-0", e.kleur)}
                        style={{ width: `${(e.bedrag / totaal) * 100}%` }}
                      />
                    ),
                )}
            </div>
            <ul className="space-y-2 text-sm">
              {emmers.map((e) => (
                <li key={e.label} className="flex items-center gap-2.5">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", e.kleur)} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{e.label}</span>
                  <span className="text-[13px] text-muted-foreground">{e.aantal}</span>
                  <span className="w-20 text-right font-medium tabular-nums">{bedrag(e.bedrag, 0)}</span>
                </li>
              ))}
            </ul>
            <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
              {[7, 30].map((dagen) => {
                const lijst = vervaltBinnen(dagen);
                return (
                  <div key={dagen}>
                    <dt className="text-[13px] text-muted-foreground">Vervalt binnen {dagen} dagen</dt>
                    <dd className="mt-0.5 font-medium tabular-nums">
                      {bedrag(lijst.reduce((som, f) => som + f.open, 0), 0)}
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · {lijst.length} {lijst.length === 1 ? "factuur" : "facturen"}
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </>
        )}
      </PanelBody>
    </Panel>
  );
};

/** Wie er de laatste twee weken heeft betaald. */
export const BetalingenPanel = ({ betalingen }: { betalingen: Onderdeel<Betaling[]> }) => {
  const { bedrag } = useBedragenVerborgen();
  return (
    <Panel>
      <PanelHeader icon={BadgeCheck} titel="Recent betaald" subtitel="De laatste twee weken" />
      <PanelBody className="px-2 pb-2 pt-2">
        {!heeftData(betalingen) ? (
          <div className="px-2 py-2">
            <Fout tekst={betalingen.fout} />
          </div>
        ) : betalingen.data.length === 0 ? (
          <p className="px-2 py-2 text-sm text-muted-foreground">Geen betalingen in de laatste twee weken.</p>
        ) : (
          <ul>
            {betalingen.data.map((b) => (
              <li key={b.id}>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-rij flex items-center gap-3 rounded-lg px-2 py-2 text-sm"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{b.klant}</span>
                    <span className="block text-[13px] text-muted-foreground">
                      {b.nummer} · betaald {b.betaaldOp ? datumKort(b.betaaldOp.slice(0, 10)) : ""}
                    </span>
                  </span>
                  <span className={cn("shrink-0 font-medium tabular-nums", TOON.success.tekst)}>{bedrag(b.bedrag)}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </PanelBody>
    </Panel>
  );
};


/**
 * Offertes die uitstaan, verlopen zijn of geaccepteerd zijn en nog
 * gefactureerd moeten worden. Wie al twee weken niets van zich liet horen,
 * krijgt een duidelijk teken: tijd om na te bellen.
 */
