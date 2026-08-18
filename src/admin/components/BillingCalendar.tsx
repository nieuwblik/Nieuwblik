import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { nl } from "date-fns/locale";

import { cn } from "@/lib/utils";
import type { BillingCycle } from "@/admin/billing";

export interface BillingMoment {
  clientId: string;
  clientNaam: string;
  cyclus: BillingCycle;
  sleutel: string;
  gefactureerd: boolean;
}

const DAGEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];

/**
 * De maand met de factuurmomenten in de dagcellen.
 *
 * Jaarcontracten krijgen een opvallender kleur dan maandcontracten: een
 * maandelijkse factuur komt vanzelf weer langs, een jaarlijkse zie je één keer
 * en moet je niet missen. Wat al gefactureerd is vervaagt.
 */
const BillingCalendar = ({
  maand,
  perDag,
}: {
  maand: Date;
  perDag: Map<string, BillingMoment[]>;
}) => {
  const dagen = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(maand), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(maand), { weekStartsOn: 1 }),
      }),
    [maand],
  );

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 pb-1.5">
        {DAGEN.map((dag) => (
          <div key={dag} className="text-center text-[11px] uppercase tracking-wide text-muted-foreground">
            {dag}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {dagen.map((dag) => {
          const sleutel = format(dag, "yyyy-MM-dd");
          const momenten = perDag.get(sleutel) ?? [];
          const buitenMaand = !isSameMonth(dag, maand);
          const heeftJaarlijks = momenten.some((m) => m.cyclus === "jaarlijks" && !m.gefactureerd);
          const heeftOpen = momenten.some((m) => !m.gefactureerd);

          return (
            <div
              key={sleutel}
              className={cn(
                "flex h-12 flex-col gap-1 rounded-lg border p-1.5 text-left sm:aspect-[4/3] sm:h-auto",
                heeftJaarlijks
                  ? "border-amber-500/40 bg-amber-500/10"
                  : heeftOpen
                    ? "border-sky-500/30 bg-sky-500/10"
                    : "border-border bg-background",
                buitenMaand && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "text-xs tabular-nums",
                  isToday(dag) ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {format(dag, "d")}
              </span>

              <span className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                {momenten.slice(0, 3).map((m) => (
                  <span
                    key={`${m.clientId}|${m.sleutel}`}
                    title={`${m.clientNaam} — ${m.cyclus}${m.gefactureerd ? " (gefactureerd)" : ""}`}
                    className={cn("flex items-center gap-1", m.gefactureerd && "opacity-50")}
                  >
                    <span
                      className={cn(
                        "h-3 w-0.5 shrink-0 rounded-full",
                        m.cyclus === "jaarlijks" ? "bg-amber-500" : "bg-sky-500",
                      )}
                    />
                    <span className={cn("truncate text-[11px] leading-tight", m.gefactureerd && "line-through")}>
                      {m.clientNaam}
                    </span>
                  </span>
                ))}
                {momenten.length > 3 && (
                  <span className="px-0.5 text-[11px] text-muted-foreground">+{momenten.length - 3} meer</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Jaarlijks
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          Maandelijks
        </span>
      </div>
    </div>
  );
};

export default BillingCalendar;
