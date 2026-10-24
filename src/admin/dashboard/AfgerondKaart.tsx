import { useMemo, useState } from "react";
import { addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowDown, ArrowUp, CheckCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON, hoofdtaken } from "@/admin/constants";
import { useTasks, useTeam } from "@/admin/queries";
import FilterSelect from "@/admin/ui/FilterSelect";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";

type Periode = "8" | "12";

/** Vaste kleur per persoon, in de volgorde van het team; "niemand" is grijs. */
const REEKS_KLEUR = ["bg-accent", "bg-info", "bg-warning", "bg-success"];
const NIEMAND = "__niemand__";

/** Een rond getal voor de bovenkant van de as: 4, 6, 8, 10, 15, 20, ... */
function asMaximum(hoogste: number): number {
  const stappen = [4, 6, 8, 10, 15, 20, 30, 40, 50, 75, 100];
  return stappen.find((s) => s >= hoogste) ?? Math.ceil(hoogste / 50) * 50;
}

/**
 * Hoeveel taken er per week zijn afgevinkt, uitgesplitst naar wie ze op naam
 * had. Gebouwd op completed_at, dat de database bij het afvinken zet; er is
 * geen urenregistratie, dus dit is de eerlijkste maat voor "wat is er gedaan".
 *
 * De balken zijn grijs; de gekozen week (standaard deze week, anders die waar
 * je overheen gaat) toont de verdeling in kleur, met de getallen ernaast.
 */
const AfgerondKaart = ({ className }: { className?: string }) => {
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const [periode, setPeriode] = useState<Periode>("8");
  const [aangewezen, setAangewezen] = useState<number | null>(null);

  const { weken, reeksen, dezeWeek, vorigeWeek } = useMemo(() => {
    const aantal = Number(periode);
    const eerste = subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), aantal - 1);
    const klaar = hoofdtaken(tasks).filter((t) => t.status === "klaar" && t.completed_at);

    // Alleen mensen die in deze periode iets hebben afgerond, plus "niemand"
    // als er werk zonder naam bij zit.
    const reeksen = [
      ...team.map((lid, i) => ({ id: lid.user_id, naam: lid.name, kleur: REEKS_KLEUR[i % REEKS_KLEUR.length]! })),
      { id: NIEMAND, naam: "Niet toegewezen", kleur: "bg-neutral" },
    ];

    const weken = Array.from({ length: aantal }, (_, i) => {
      const van = addWeeks(eerste, i);
      const tot = addWeeks(van, 1);
      const inWeek = klaar.filter((t) => {
        const moment = new Date(t.completed_at!);
        return moment >= van && moment < tot;
      });
      // Wie niet (meer) in het team zit, telt mee als "niet toegewezen".
      const wieVan = (toegewezen: string | null) =>
        toegewezen && team.some((lid) => lid.user_id === toegewezen) ? toegewezen : NIEMAND;
      const perReeks = reeksen.map((r) => ({
        ...r,
        aantal: inWeek.filter((t) => wieVan(t.assigned_to) === r.id).length,
      }));
      return { van, totaal: inWeek.length, perReeks };
    });

    const gebruikt = reeksen.filter((r) => weken.some((w) => w.perReeks.some((p) => p.id === r.id && p.aantal > 0)));

    return {
      weken,
      reeksen: gebruikt,
      dezeWeek: weken[weken.length - 1]?.totaal ?? 0,
      vorigeWeek: weken[weken.length - 2]?.totaal ?? 0,
    };
  }, [tasks, team, periode]);

  const max = asMaximum(Math.max(1, ...weken.map((w) => w.totaal)));
  // Zonder aanwijzen de laatste week waarin iets is afgerond; een lege
  // "deze week" op maandagochtend zou anders een grafiek zonder kleur geven.
  const laatsteMetWerk = weken.map((w) => w.totaal > 0).lastIndexOf(true);
  const gekozen = aangewezen ?? (laatsteMetWerk >= 0 ? laatsteMetWerk : weken.length - 1);
  const week = weken[gekozen];
  const verschil = dezeWeek - vorigeWeek;

  return (
    <Panel
      className={className}
      footer={<PanelFooter to="/admin/taken?status=klaar">Bekijk afgerond werk</PanelFooter>}
    >
      <PanelHeader
        icon={CheckCheck}
        titel="Afgerond werk"
        subtitel="Afgevinkte taken per week"
        actie={
          <FilterSelect
            label="Periode"
            waarde={periode}
            onChange={(waarde) => {
              setPeriode(waarde);
              setAangewezen(null);
            }}
            opties={[
              { waarde: "8", label: "Laatste 8 weken" },
              { waarde: "12", label: "Laatste 12 weken" },
            ]}
          />
        }
      />
      <PanelBody>
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-epilogue text-[32px] font-medium leading-none tabular-nums tracking-tight">{dezeWeek}</span>
          <span className="text-sm text-muted-foreground">deze week</span>
          <span
            className={cn(
              "ml-1 inline-flex items-center gap-1 text-[13px] font-medium",
              verschil > 0 ? TOON.success.tekst : verschil < 0 ? TOON.danger.tekst : "text-muted-foreground",
            )}
          >
            {verschil > 0 ? <ArrowUp className="h-3.5 w-3.5" /> : verschil < 0 ? <ArrowDown className="h-3.5 w-3.5" /> : null}
            {verschil === 0 ? "gelijk" : Math.abs(verschil)}
            <span className="font-normal text-muted-foreground">· t.o.v. vorige week</span>
          </span>
        </p>

        {/* De grafiek: as links met drie streepjes, balken per week. */}
        <div className="mt-5 grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2">
          <div className="relative h-52 text-right text-xs tabular-nums text-muted-foreground" aria-hidden="true">
            {[max, max / 2, 0].map((waarde, i) => (
              <span key={waarde} className="absolute right-0 -translate-y-1/2" style={{ top: `${i * 50}%` }}>
                {Number.isInteger(waarde) ? waarde : waarde.toFixed(1)}
              </span>
            ))}
          </div>

          <div className="relative h-52" onMouseLeave={() => setAangewezen(null)}>
            {[0, 50, 100].map((top) => (
              <span
                key={top}
                className="absolute inset-x-0 border-t border-dashed border-border"
                style={{ top: `${top}%` }}
                aria-hidden="true"
              />
            ))}

            <ol className="absolute inset-0 flex items-end justify-between gap-1.5 sm:gap-3">
              {weken.map((w, i) => {
                const actief = i === gekozen;
                return (
                  <li key={w.van.toISOString()} className="relative flex h-full flex-1 items-end justify-center">
                    <button
                      type="button"
                      onMouseEnter={() => setAangewezen(i)}
                      onFocus={() => setAangewezen(i)}
                      onClick={() => setAangewezen(i)}
                      aria-label={`Week van ${format(w.van, "d MMMM", { locale: nl })}: ${w.totaal} afgerond`}
                      className="flex h-full w-full max-w-11 flex-col justify-end"
                    >
                      <span
                        className={cn(
                          "flex w-full flex-col-reverse overflow-hidden rounded-md transition-colors duration-150",
                          !actief && "bg-muted hover:bg-muted-foreground/25",
                        )}
                        style={{ height: `${(w.totaal / max) * 100}%`, minHeight: w.totaal > 0 ? 4 : 0 }}
                      >
                        {actief &&
                          w.perReeks
                            .filter((p) => p.aantal > 0)
                            .map((p) => (
                              <span key={p.id} className={p.kleur} style={{ height: `${(p.aantal / w.totaal) * 100}%` }} />
                            ))}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Het kaartje bij de gekozen week, naast de balk. */}
            {week && week.totaal > 0 && (
              <div
                className="pointer-events-none absolute top-2 z-10 w-max min-w-32 rounded-lg bg-foreground px-3 py-2 text-background shadow-md"
                style={
                  // Naast de balk, aan de kant met de meeste ruimte, zodat het
                  // kaartje ook op een telefoon binnen de grafiek blijft.
                  gekozen >= weken.length / 2
                    ? { right: `${((weken.length - gekozen) / weken.length) * 100}%` }
                    : { left: `${((gekozen + 1) / weken.length) * 100}%` }
                }
              >
                <p className="text-xs opacity-70">Week van {format(week.van, "d MMM", { locale: nl })}</p>
                <ul className="mt-1 space-y-1">
                  {week.perReeks
                    .filter((p) => p.aantal > 0)
                    .map((p) => (
                      <li key={p.id} className="flex items-center gap-2 text-[13px]">
                        <span className={cn("h-3.5 w-1 rounded-full", p.kleur)} />
                        <span className="font-medium tabular-nums">{p.aantal}</span>
                        <span className="opacity-70">{p.naam}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          <span />
          <ol className="mt-2 flex justify-between gap-1.5 text-center text-xs text-muted-foreground sm:gap-3" aria-hidden="true">
            {weken.map((w, i) => (
              <li key={w.van.toISOString()} className={cn("flex-1 truncate", i === gekozen && "font-medium text-foreground")}>
                {/* Op een telefoon past "19 okt" niet onder elke balk. */}
                <span className="sm:hidden">{format(w.van, "d/M")}</span>
                <span className="hidden sm:inline">{format(w.van, "d MMM", { locale: nl })}</span>
              </li>
            ))}
          </ol>
        </div>

        {reeksen.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
            {reeksen.map((r) => (
              <li key={r.id} className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-sm", r.kleur)} />
                {r.naam}
              </li>
            ))}
          </ul>
        )}
      </PanelBody>
    </Panel>
  );
};

export default AfgerondKaart;
