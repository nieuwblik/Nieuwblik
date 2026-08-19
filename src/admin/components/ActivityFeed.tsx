import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Check, Flag, MessageSquare, Paperclip, Plus, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { momentLabel } from "@/admin/format";
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
  /** Waar het over gaat: de taaknaam, het bericht, de bestandsnaam. */
  onderwerp: string;
  /** Wat ermee gebeurde, kort. */
  actie: string;
  wie: string;
  wanneer: string;
  icoon: LucideIcon;
  kleur: string;
  /** Waar je heen gaat als je erop klikt; niet alles heeft een eigen pagina. */
  to?: string;
}

const SOORT = {
  af: { icoon: Check, kleur: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  nieuw: { icoon: Plus, kleur: "bg-muted text-muted-foreground" },
  bericht: { icoon: MessageSquare, kleur: "bg-sky-500/15 text-sky-600 dark:text-sky-400" },
  mijlpaal: { icoon: Flag, kleur: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  bestand: { icoon: Paperclip, kleur: "bg-muted text-muted-foreground" },
};

/**
 * Wat er de laatste tijd bij deze klant is gebeurd, uit alle hoeken bij
 * elkaar: geplaatste berichten, afgeronde en aangemaakte taken, geüploade
 * bestanden. Alleen lezen — plaatsen doe je op de tijdlijn zelf.
 *
 * Het onderwerp staat vooraan en de handeling eronder, en niet andersom. Met
 * z'n tweeën is "Jij maakte een taak aan" op elke regel hetzelfde; waar het
 * om gaat is wélke taak. Het soort gebeurtenis zit in het icoon, zodat je aan
 * de linkerrand al ziet of er iets af is of juist bij is gekomen.
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
      const soort = update.kind === "mijlpaal" ? SOORT.mijlpaal : SOORT.bericht;
      alles.push({
        id: `update-${update.id}`,
        onderwerp: update.body,
        actie: update.kind === "mijlpaal" ? "Mijlpaal" : update.kind === "notitie" ? "Notitie" : "Update",
        wie: naam(update.author_id),
        wanneer: update.created_at,
        ...soort,
      });
    }

    for (const task of taken) {
      const af = task.status === "klaar" && task.completed_at;
      alles.push({
        id: af ? `af-${task.id}` : `nieuw-${task.id}`,
        onderwerp: task.title,
        actie: af ? "Taak afgerond" : "Taak aangemaakt",
        wie: naam(af ? (task.assigned_to ?? task.created_by) : task.created_by),
        wanneer: af ? task.completed_at! : task.created_at,
        to: `/admin/taken/${task.id}`,
        ...(af ? SOORT.af : SOORT.nieuw),
      });
    }

    for (const file of files) {
      alles.push({
        id: `bestand-${file.id}`,
        onderwerp: file.file_name,
        actie: "Bestand toegevoegd",
        wie: naam(file.uploaded_by),
        wanneer: file.created_at,
        ...SOORT.bestand,
      });
    }

    return alles.sort((a, b) => new Date(b.wanneer).getTime() - new Date(a.wanneer).getTime()).slice(0, limit);
  }, [updates, allTasks, files, team, userId, projectId, limit]);

  if (gebeurtenissen.length === 0) {
    return <p className="text-sm text-muted-foreground">Nog niets gebeurd bij deze klant.</p>;
  }

  return (
    <ol className="space-y-4">
      {gebeurtenissen.map((g, i) => {
        const Icoon = g.icoon;

        return (
          <li key={g.id} className="relative flex gap-3">
            {/* De lijn verbindt de bolletjes en stopt bij de laatste, anders
                wijst hij naar beneden alsof er nog iets komt. */}
            {i < gebeurtenissen.length - 1 && (
              <span aria-hidden="true" className="absolute left-4 top-9 h-[calc(100%-1rem)] w-px bg-border" />
            )}

            <span
              className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", g.kleur)}
              aria-hidden="true"
            >
              <Icoon className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1 pb-1">
              {g.to ? (
                <Link to={g.to} className="block text-sm font-medium leading-snug hover:underline">
                  <span className="line-clamp-2">{g.onderwerp}</span>
                </Link>
              ) : (
                <p className="line-clamp-2 text-sm font-medium leading-snug">{g.onderwerp}</p>
              )}

              <p className="mt-1 text-xs text-muted-foreground">
                {g.actie} · {g.wie} · {momentLabel(g.wanneer)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default ActivityFeed;
