import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { nl } from "date-fns/locale";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { PRIORITY_WEIGHT, type Priority } from "@/admin/constants";
import type { TaskWithProject } from "@/admin/queries";

/** Accentkleur per prioriteit: streepje voor de taak, tint achter de dag. */
export const ACCENT: Record<Priority, { balk: string; stip: string; cel: string }> = {
  urgent: { balk: "bg-rose-500", stip: "bg-rose-500", cel: "bg-rose-500/10 border-rose-500/30" },
  hoog: { balk: "bg-orange-500", stip: "bg-orange-500", cel: "bg-orange-500/10 border-orange-500/30" },
  normaal: { balk: "bg-sky-500", stip: "bg-sky-500", cel: "bg-sky-500/10 border-sky-500/30" },
  laag: { balk: "bg-slate-400", stip: "bg-slate-400", cel: "bg-slate-400/10 border-slate-400/30" },
};

const DAGEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];

/** Openstaande taken met deadline, gegroepeerd per dag en op urgentie. */
export function groepeerPerDag(tasks: TaskWithProject[]): Map<string, TaskWithProject[]> {
  const map = new Map<string, TaskWithProject[]>();
  for (const taak of tasks) {
    if (!taak.due_date || taak.status === "klaar") continue;
    const lijst = map.get(taak.due_date) ?? [];
    lijst.push(taak);
    map.set(taak.due_date, lijst);
  }
  for (const lijst of map.values()) {
    lijst.sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
  }
  return map;
}

interface MonthGridProps {
  maand: Date;
  gekozenDag: Date;
  perDag: Map<string, TaskWithProject[]>;
  onSelectDay: (dag: Date) => void;
  onSelectTask?: (taak: TaskWithProject) => void;
  /** Plusje rechtsonder in de cel om meteen op die dag iets vast te leggen. */
  onAddOnDay?: (dag: Date) => void;
  /** Compact toont alleen stippen; ruim toont de titels in de cel. */
  compact?: boolean;
}

/**
 * Maandrooster met de deadlines in de dagcellen.
 *
 * Compact op het dashboard, ruim op de kalenderpagina. Het verschil is niet
 * alleen grootte: in de compacte vorm passen titels niet leesbaar, dus daar
 * staan stippen die zeggen hoeveel en hoe dringend, en lees je de details in
 * het paneel eronder.
 */
const MonthGrid = ({
  maand,
  gekozenDag,
  perDag,
  onSelectDay,
  onSelectTask,
  onAddOnDay,
  compact,
}: MonthGridProps) => {
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
          const taken = perDag.get(sleutel) ?? [];
          const zwaarste = taken[0]?.priority;
          const buitenMaand = !isSameMonth(dag, maand);
          const gekozen = isSameDay(dag, gekozenDag);

          return (
            <div
              key={sleutel}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDay(dag)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                onSelectDay(dag);
              }}
              aria-label={format(dag, "d MMMM yyyy", { locale: nl })}
              aria-pressed={gekozen}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-1 rounded-lg border p-1.5 text-left transition-colors",
                compact ? "h-16" : "h-28 lg:h-32",
                zwaarste ? ACCENT[zwaarste].cel : "border-border bg-background hover:bg-muted/50",
                buitenMaand && "opacity-40",
                gekozen && "ring-2 ring-ring ring-offset-1 ring-offset-background",
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

              {compact ? (
                <span className="flex flex-wrap items-center gap-0.5">
                  {taken.slice(0, 4).map((taak) => (
                    <span key={taak.id} className={cn("h-1.5 w-1.5 rounded-full", ACCENT[taak.priority].stip)} />
                  ))}
                  {taken.length > 4 && <span className="text-[10px] text-muted-foreground">+{taken.length - 4}</span>}
                </span>
              ) : (
                <span className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                  {taken.slice(0, 3).map((taak) => (
                    <span
                      key={taak.id}
                      role={onSelectTask ? "button" : undefined}
                      tabIndex={onSelectTask ? 0 : undefined}
                      onClick={(event) => {
                        if (!onSelectTask) return;
                        event.stopPropagation();
                        onSelectTask(taak);
                      }}
                      onKeyDown={(event) => {
                        if (!onSelectTask || (event.key !== "Enter" && event.key !== " ")) return;
                        event.preventDefault();
                        event.stopPropagation();
                        onSelectTask(taak);
                      }}
                      className={cn(
                        "flex items-center gap-1 rounded px-0.5",
                        onSelectTask && "hover:bg-foreground/5",
                      )}
                    >
                      <span className={cn("h-3 w-0.5 shrink-0 rounded-full", ACCENT[taak.priority].balk)} />
                      <span className="truncate text-[11px] leading-tight">{taak.title}</span>
                    </span>
                  ))}
                  {taken.length > 3 && (
                    <span className="px-0.5 text-[11px] text-muted-foreground">+{taken.length - 3} meer</span>
                  )}
                </span>
              )}

              {/* Verschijnt bij hover of toetsfocus: altijd tonen zou zesendertig
                  plusjes op het scherm zetten die je zelden gebruikt. */}
              {onAddOnDay && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddOnDay(dag);
                  }}
                  aria-label={`Toevoegen op ${format(dag, "d MMMM yyyy", { locale: nl })}`}
                  className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-md bg-background/80 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthGrid;
