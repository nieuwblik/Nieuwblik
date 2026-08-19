import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { UPDATE_KIND } from "@/admin/constants";
import { initials, momentLabel, tintFor } from "@/admin/format";
import { useProjectFiles, useProjectUpdates, useTasks, type TeamMember } from "@/admin/queries";

interface ActivityFeedProps {
  projectId: string;
  team: TeamMember[];
  /** Wie er kijkt: eigen handelingen lezen prettiger als "Jij". */
  userId: string | null;
  limit?: number;
}

interface Gebeurtenis {
  id: string;
  wie: string;
  wat: string;
  detail: string | null;
  wanneer: string;
  chip?: { label: string; className: string };
}

/**
 * Wat er de laatste tijd bij deze klant is gebeurd, uit alle hoeken bij
 * elkaar: geplaatste berichten, afgeronde en aangemaakte taken, geüploade
 * bestanden. Alleen lezen — plaatsen doe je op de tijdlijn zelf.
 *
 * Zonder deze samenvoeging moet je drie tabbladen langs om te zien of er iets
 * beweegt bij een klant, en dat is precies de vraag waarmee je zo'n pagina
 * opent.
 */
const ActivityFeed = ({ projectId, team, userId, limit = 6 }: ActivityFeedProps) => {
  const { data: updates = [] } = useProjectUpdates(projectId);
  const { data: allTasks = [] } = useTasks();
  const { data: files = [] } = useProjectFiles(projectId);

  const gebeurtenissen = useMemo<Gebeurtenis[]>(() => {
    const naam = (id: string | null) => {
      if (!id) return "Systeem";
      if (id === userId) return "Jij";
      return team.find((m) => m.user_id === id)?.name ?? "Onbekend";
    };

    const taken = allTasks.filter((t) => t.project_id === projectId);
    const alles: Gebeurtenis[] = [];

    for (const update of updates) {
      alles.push({
        id: `update-${update.id}`,
        wie: naam(update.author_id),
        wat: `plaatste een ${UPDATE_KIND[update.kind].label.toLowerCase()}`,
        detail: update.body,
        wanneer: update.created_at,
        chip: { label: UPDATE_KIND[update.kind].label, className: UPDATE_KIND[update.kind].className },
      });
    }

    for (const task of taken) {
      if (task.status === "klaar" && task.completed_at) {
        alles.push({
          id: `af-${task.id}`,
          wie: naam(task.assigned_to ?? task.created_by),
          wat: "rondde een taak af",
          detail: task.title,
          wanneer: task.completed_at,
          chip: {
            label: "Afgerond",
            className:
              "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/25",
          },
        });
      } else {
        alles.push({
          id: `nieuw-${task.id}`,
          wie: naam(task.created_by),
          wat: "maakte een taak aan",
          detail: task.title,
          wanneer: task.created_at,
        });
      }
    }

    for (const file of files) {
      alles.push({
        id: `bestand-${file.id}`,
        wie: naam(file.uploaded_by),
        wat: "voegde een bestand toe",
        detail: file.file_name,
        wanneer: file.created_at,
      });
    }

    return alles
      .sort((a, b) => new Date(b.wanneer).getTime() - new Date(a.wanneer).getTime())
      .slice(0, limit);
  }, [updates, allTasks, files, team, userId, projectId, limit]);

  if (gebeurtenissen.length === 0) {
    return <p className="text-sm text-muted-foreground">Nog niets gebeurd bij deze klant.</p>;
  }

  return (
    <ol className="space-y-4">
      {gebeurtenissen.map((g, i) => (
        <li key={g.id} className="relative flex gap-3">
          {/* De lijn verbindt de bolletjes en stopt bij de laatste, anders
              wijst hij naar beneden alsof er nog iets komt. */}
          {i < gebeurtenissen.length - 1 && (
            <span aria-hidden="true" className="absolute left-4 top-9 h-[calc(100%-1rem)] w-px bg-border" />
          )}

          <span
            className={cn(
              "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
              tintFor(g.wie),
            )}
            aria-hidden="true"
          >
            {initials(g.wie)}
          </span>

          <div className="min-w-0 flex-1 pb-1">
            <p className="text-sm leading-snug">
              <span className="font-medium">{g.wie}</span> <span className="text-muted-foreground">{g.wat}</span>
            </p>
            {g.detail && <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{g.detail}</p>}

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">{momentLabel(g.wanneer)}</span>
              {g.chip && (
                <span className={cn("rounded border px-1.5 py-0.5 text-[11px] font-medium", g.chip.className)}>
                  {g.chip.label}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ActivityFeed;
