import { Link } from "react-router-dom";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { CheckSquare, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "@/admin/components/StatusBadge";
import { ACCENT } from "@/admin/constants";
import { useTasks, useTeam, type TaskWithProject } from "@/admin/queries";

interface DayPlanCardProps {
  dag: Date;
  taken: TaskWithProject[];
  /** Nieuw werk op deze dag; weglaten verbergt de knop. */
  onAdd?: () => void;
  /** Sluit de popup na een klik die je ergens anders heen brengt. */
  onNavigate?: () => void;
}

/**
 * Wat er op één dag staat, met alles erbij: klant, wie het doet, prioriteit,
 * eventuele stappen en de omschrijving.
 *
 * De maandcellen tonen hooguit een stip of een afgekapte titel — genoeg om te
 * zien dát er iets is, te weinig om te weten wát. Deze kaart vult dat gat
 * zonder je uit de maand weg te halen.
 */
const DayPlanCard = ({ dag, taken, onAdd, onNavigate }: DayPlanCardProps) => {
  const { data: team = [] } = useTeam();
  const { data: alle = [] } = useTasks();

  const naamVan = (userId: string | null) =>
    userId ? (team.find((m) => m.user_id === userId)?.name ?? "Onbekend") : null;

  const stappen = (taskId: string) => {
    const eigen = alle.filter((t) => t.parent_task_id === taskId);
    if (eigen.length === 0) return null;
    return `${eigen.filter((t) => t.status === "klaar").length}/${eigen.length} stappen`;
  };

  return (
    <div className="w-80 max-w-[calc(100vw-2rem)]">
      <div className="flex items-baseline justify-between gap-2 border-b border-border px-3 py-2.5">
        {/* Alleen de eerste letter omhoog: capitalize zou er ook "26 Augustus"
            van maken, en Nederlandse maandnamen blijven klein. */}
        <p className="text-sm font-medium first-letter:uppercase">{format(dag, "EEEE d MMMM", { locale: nl })}</p>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {taken.length} {taken.length === 1 ? "taak" : "taken"}
        </span>
      </div>

      {taken.length === 0 ? (
        <p className="px-3 py-6 text-center text-sm text-muted-foreground">Niets gepland.</p>
      ) : (
        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
          {taken.map((taak) => {
            const wie = naamVan(taak.assigned_to);
            const stap = stappen(taak.id);

            return (
              <li key={taak.id} className="px-3 py-2.5">
                <div className="flex items-start gap-2">
                  {/* Het streepje herhaalt de kleur uit de maandcel, zodat de
                      stip die je aanklikte en de taak hier bij elkaar horen. */}
                  <span className={cn("mt-1 h-3.5 w-0.5 shrink-0 rounded-full", ACCENT[taak.priority].balk)} />

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/admin/taken/${taak.id}`}
                      onClick={onNavigate}
                      className="block text-sm font-medium leading-tight hover:underline"
                    >
                      {taak.title}
                    </Link>

                    {taak.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {taak.description}
                      </p>
                    )}

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                      {taak.project && (
                        <Link
                          to={`/admin/projecten/${taak.project.id}`}
                          onClick={onNavigate}
                          className="hover:text-foreground hover:underline"
                        >
                          {taak.project.name}
                        </Link>
                      )}
                      {wie && <span>{wie}</span>}
                      {stap && (
                        <span className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          {stap}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {taak.priority !== "normaal" && <StatusBadge kind="priority" value={taak.priority} />}
                    {taak.status !== "todo" && <StatusBadge kind="task" value={taak.status} />}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {onAdd && (
        <div className="border-t border-border p-2">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Werk op deze dag
          </Button>
        </div>
      )}
    </div>
  );
};

export default DayPlanCard;
