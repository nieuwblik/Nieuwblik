import { useMemo, useState } from "react";
import { addDays, format, isToday, startOfWeek, subWeeks } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowDown, ArrowUp, Clock, Timer } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/admin/components/EmptyState";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { TOON } from "@/admin/constants";
import {
  duurMinuten,
  formatDuur,
  isNietGeactiveerd,
  projectKleur,
  projectNaam,
  useNu,
  useUrenInPeriode,
} from "@/admin/uren";
import FilterSelect from "@/admin/ui/FilterSelect";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";

type Wie = "iedereen" | "ik";

/** Een rond aantal uren voor de bovenkant van de as. */
function asMaximum(uren: number): number {
  return [4, 6, 8, 10, 12, 16, 20, 24].find((s) => s >= uren) ?? Math.ceil(uren / 4) * 4;
}

/**
 * De gewerkte uren van deze week per dag, uitgesplitst naar project. Het
 * totaal staat erboven met het verschil tegenover vorige week. De gekozen
 * dag (vandaag, of waar je overheen gaat) toont de verdeling met getallen.
 */
const UrenKaart = ({ className }: { className?: string }) => {
  const { user } = useAdminAuth();
  const [wie, setWie] = useState<Wie>("iedereen");
  const [aangewezen, setAangewezen] = useState<number | null>(null);

  const maandag = startOfWeek(new Date(), { weekStartsOn: 1 });
  const vorigeMaandag = subWeeks(maandag, 1);
  // Twee weken in één keer: deze voor de grafiek, vorige voor de vergelijking.
  const { data: regels = [], isLoading, isError, error } = useUrenInPeriode(vorigeMaandag, addDays(maandag, 7));
  const nu = useNu(regels.some((r) => !r.ended_at), 30_000);

  const { dagen, dezeWeek, vorigeWeek } = useMemo(() => {
    const eigen = regels.filter((r) => wie === "iedereen" || r.user_id === user?.id);
    const dagen = Array.from({ length: 7 }, (_, i) => {
      const datum = addDays(maandag, i);
      const sleutel = format(datum, "yyyy-MM-dd");
      const opDag = eigen.filter((r) => format(new Date(r.started_at), "yyyy-MM-dd") === sleutel);
      const perProject = new Map<string, { id: string | null; naam: string; minuten: number }>();
      for (const r of opDag) {
        const k = r.project_id ?? "geen";
        const huidig = perProject.get(k) ?? { id: r.project_id, naam: projectNaam(r), minuten: 0 };
        huidig.minuten += duurMinuten(r, nu);
        perProject.set(k, huidig);
      }
      const delen = [...perProject.values()].sort((a, b) => b.minuten - a.minuten);
      return { datum, sleutel, delen, minuten: delen.reduce((som, d) => som + d.minuten, 0) };
    });
    const somVan = (van: Date, tot: Date) =>
      eigen
        .filter((r) => new Date(r.started_at) >= van && new Date(r.started_at) < tot)
        .reduce((som, r) => som + duurMinuten(r, nu), 0);
    return {
      dagen,
      dezeWeek: somVan(maandag, addDays(maandag, 7)),
      vorigeWeek: somVan(vorigeMaandag, maandag),
    };
    // maandag en vorigeMaandag volgen uit de datum van vandaag; die veranderen niet binnen een render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regels, wie, user?.id, nu]);

  if (isError && isNietGeactiveerd(error)) {
    return (
      <Panel className={className}>
        <PanelHeader icon={Clock} titel="Gewerkte uren" subtitel="Per dag, per project" />
        <PanelBody>
          <EmptyState
            compact
            icon={Timer}
            title="Urenregistratie nog niet actief"
            description="Zodra de migratie is uitgevoerd, verschijnen hier je uren en de timer bovenin."
          />
        </PanelBody>
      </Panel>
    );
  }

  const max = asMaximum(Math.max(1, ...dagen.map((d) => d.minuten / 60)));
  const vandaagIndex = dagen.findIndex((d) => isToday(d.datum));
  const gekozen = aangewezen ?? vandaagIndex;
  const dag = dagen[gekozen];
  const bijnaLeeg = dezeWeek < 15;
  const procent = vorigeWeek > 0 ? Math.round(((dezeWeek - vorigeWeek) / vorigeWeek) * 100) : null;

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/uren">Bekijk urenregistratie</PanelFooter>}>
      <PanelHeader
        icon={Clock}
        titel="Gewerkte uren"
        subtitel="Deze week, per dag en per project"
        actie={
          <FilterSelect
            label="Wiens uren"
            waarde={wie}
            onChange={setWie}
            opties={[
              { waarde: "iedereen", label: "Iedereen" },
              { waarde: "ik", label: "Mijn uren" },
            ]}
          />
        }
      />
      <PanelBody>
        {isLoading ? (
          <Skeleton className="h-48" />
        ) : (
          <>
            <p className="flex flex-wrap items-baseline gap-x-1 gap-y-1">
              <span className="font-epilogue text-[32px] font-medium leading-none tabular-nums tracking-tight">
                {Math.floor(dezeWeek / 60)}
              </span>
              <span className="text-sm text-muted-foreground">u</span>
              <span className="ml-1 font-epilogue text-[32px] font-medium leading-none tabular-nums tracking-tight">
                {dezeWeek % 60}
              </span>
              <span className="text-sm text-muted-foreground">min</span>
              {procent !== null && (
                <span
                  className={cn(
                    "ml-3 inline-flex items-center gap-1 text-[13px] font-medium",
                    procent > 0 ? TOON.success.tekst : procent < 0 ? TOON.danger.tekst : "text-muted-foreground",
                  )}
                >
                  {procent > 0 ? <ArrowUp className="h-3.5 w-3.5" /> : procent < 0 ? <ArrowDown className="h-3.5 w-3.5" /> : null}
                  {Math.abs(procent)}%
                  <span className="font-normal text-muted-foreground">· t.o.v. vorige week</span>
                </span>
              )}
            </p>

            {/* Onder een kwartier is een grafiek alleen lege as; dan een regel tekst. */}
            {bijnaLeeg ? (
              <p className="mt-3 text-[13px] text-muted-foreground">
                {dezeWeek === 0 ? "Nog geen uren deze week." : "Nog bijna geen uren deze week."} Start de timer bovenin om bij
                te houden waar je aan werkt.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2">
                <div className="relative h-40 text-right text-xs tabular-nums text-muted-foreground" aria-hidden="true">
                  {[max, max / 2, 0].map((waarde, i) => (
                    <span key={i} className="absolute right-0 -translate-y-1/2" style={{ top: `${i * 50}%` }}>
                      {waarde}u
                    </span>
                  ))}
                </div>

                <div className="relative h-40" onMouseLeave={() => setAangewezen(null)}>
                  {[0, 50, 100].map((top) => (
                    <span key={top} className="absolute inset-x-0 border-t border-dashed border-border" style={{ top: `${top}%` }} aria-hidden="true" />
                  ))}

                  <ol className="absolute inset-0 flex items-end justify-between gap-2 sm:gap-4">
                    {dagen.map((d, i) => {
                      const actief = i === gekozen;
                      return (
                        <li key={d.sleutel} className="flex h-full flex-1 items-end justify-center">
                          <button
                            type="button"
                            onMouseEnter={() => setAangewezen(i)}
                            onFocus={() => setAangewezen(i)}
                            onClick={() => setAangewezen(i)}
                            aria-label={`${format(d.datum, "EEEE", { locale: nl })}: ${formatDuur(d.minuten)}`}
                            className="flex h-full w-full max-w-12 flex-col justify-end"
                          >
                            <span
                              className={cn(
                                "p-groei-y flex w-full flex-col-reverse overflow-hidden rounded-md transition-colors duration-150",
                                !actief && "bg-muted hover:bg-muted-foreground/25",
                              )}
                              style={{ animationDelay: `${i * 35}ms`, height: `${(d.minuten / 60 / max) * 100}%`, minHeight: d.minuten > 0 ? 4 : 0 }}
                            >
                              {actief &&
                                d.delen.map((deel) => (
                                  <span
                                    key={deel.id ?? "geen"}
                                    className={projectKleur(deel.id).vlak}
                                    style={{ height: `${(deel.minuten / d.minuten) * 100}%` }}
                                  />
                                ))}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>

                  {dag && dag.minuten > 0 && (
                    <div
                      key={gekozen}
                      className="p-vervaag pointer-events-none absolute top-2 z-10 w-max min-w-36 max-w-56 rounded-lg bg-foreground px-3 py-2 text-background shadow-md"
                      style={
                        gekozen >= dagen.length / 2
                          ? { right: `${((dagen.length - gekozen) / dagen.length) * 100}%` }
                          : { left: `${((gekozen + 1) / dagen.length) * 100}%` }
                      }
                    >
                      <p className="text-xs opacity-70 first-letter:uppercase">{format(dag.datum, "EEEE d MMM", { locale: nl })}</p>
                      <ul className="mt-1 space-y-1">
                        {dag.delen.slice(0, 4).map((deel) => (
                          <li key={deel.id ?? "geen"} className="flex items-center gap-2 text-[13px]">
                            <span className={cn("h-3.5 w-1 shrink-0 rounded-full", projectKleur(deel.id).vlak)} />
                            <span className="font-medium tabular-nums">{formatDuur(deel.minuten)}</span>
                            <span className="truncate opacity-70">{deel.naam}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <span />
                <ol className="mt-2 flex justify-between gap-2 text-center text-xs text-muted-foreground sm:gap-4" aria-hidden="true">
                  {dagen.map((d, i) => (
                    <li key={d.sleutel} className={cn("flex-1", i === gekozen && "font-medium text-foreground")}>
                      {format(d.datum, "EEEEEE", { locale: nl })}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </PanelBody>
    </Panel>
  );
};

export default UrenKaart;
