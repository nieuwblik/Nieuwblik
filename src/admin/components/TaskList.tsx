import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import StatusBadge from "@/admin/components/StatusBadge";
import { PRIORITY_WEIGHT } from "@/admin/constants";
import { daysUntil, deadlineLabel } from "@/admin/format";
import { useDeleteTask, useTasks, useUpdateTask, type TaskWithProject, type TeamMember } from "@/admin/queries";

interface TaskListProps {
  tasks: TaskWithProject[];
  team: TeamMember[];
  /** Uit bij de takenlijst binnen één project — de projectnaam is daar ruis. */
  showProject?: boolean;
}

/**
 * Urgent bovenaan, daarbinnen op deadline. Alleen voor openstaand werk;
 * afgeronde taken staan apart en hoeven niet op prioriteit gesorteerd.
 */
export function sortTasks(tasks: TaskWithProject[]): TaskWithProject[] {
  return [...tasks].sort((a, b) => {
    const priority = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    if (priority !== 0) return priority;

    // Taken zonder deadline achteraan binnen dezelfde prioriteit.
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return b.created_at.localeCompare(a.created_at);
  });
}

const TaskList = ({ tasks, team, showProject = true }: TaskListProps) => {
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const [afgerondOpen, setAfgerondOpen] = useState(false);
  // De volledige set staat al in de react-query-cache; hieruit tellen we de
  // stappen per taak, ook als de aanroeper een gefilterde lijst doorgeeft.
  const { data: allTasks = [] } = useTasks();

  const steps = (taskId: string) => {
    const own = allTasks.filter((t) => t.parent_task_id === taskId);
    if (own.length === 0) return null;
    return `${own.filter((t) => t.status === "klaar").length}/${own.length} stappen`;
  };

  const toggle = async (task: TaskWithProject, done: boolean) => {
    try {
      await update.mutateAsync({ id: task.id, values: { status: done ? "klaar" : "todo" } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bijwerken mislukt");
    }
  };

  const handleDelete = async (task: TaskWithProject) => {
    if (!window.confirm(`Taak "${task.title}" verwijderen?`)) return;
    try {
      await remove.mutateAsync(task.id);
      toast.success("Taak verwijderd");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verwijderen mislukt");
    }
  };

  const nameFor = (userId: string | null) =>
    userId ? (team.find((m) => m.user_id === userId)?.name ?? "Onbekend") : null;

  const row = (task: TaskWithProject) => {
    const done = task.status === "klaar";
    const overdue = !done && (daysUntil(task.due_date) ?? 1) < 0;
    const assignee = nameFor(task.assigned_to);

    return (
      <li key={task.id} className="flex items-start gap-3 py-3">
        <Checkbox
          checked={done}
          onCheckedChange={(checked) => void toggle(task, checked === true)}
          aria-label={done ? "Markeer als open" : "Markeer als klaar"}
          className="mt-1"
        />

        <div className="min-w-0 flex-1">
          {/* De titel opent de volledige taakpagina, waar de details, foto's
              en losse stappen staan. */}
          <Link
            to={`/admin/taken/${task.id}`}
            className={cn("block text-sm font-medium hover:underline", done && "text-muted-foreground line-through")}
          >
            {task.title}
          </Link>

          {task.description && !done && (
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {showProject && task.project && (
              <Link to={`/admin/projecten/${task.project.id}`} className="hover:text-foreground hover:underline">
                {task.project.name}
              </Link>
            )}
            {assignee && <span>{assignee}</span>}
            {steps(task.id) && <span>{steps(task.id)}</span>}
            {task.due_date && !done && (
              <span className={cn(overdue && "font-medium text-rose-600 dark:text-rose-400")}>
                {deadlineLabel(task.due_date)}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {!done && task.priority !== "normaal" && <StatusBadge kind="priority" value={task.priority} />}
          {!done && task.status !== "todo" && <StatusBadge kind="task" value={task.status} />}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => void handleDelete(task)}
            aria-label="Verwijderen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </li>
    );
  };

  // Stappen verschijnen op de pagina van hun eigen taak, niet los in deze
  // lijst: anders staat hetzelfde werk er twee keer in.
  const eigen = tasks.filter((t) => !t.parent_task_id);
  const open = sortTasks(eigen.filter((t) => t.status !== "klaar"));
  // Laatst afgevinkt bovenaan: dat is meestal wat je nog even wilt nakijken.
  const afgerond = eigen
    .filter((t) => t.status === "klaar")
    .sort((a, b) => (b.completed_at ?? b.updated_at).localeCompare(a.completed_at ?? a.updated_at));

  return (
    <div>
      {open.length > 0 ? (
        <ul className="divide-y divide-border">{open.map(row)}</ul>
      ) : (
        afgerond.length > 0 && <p className="py-3 text-sm text-muted-foreground">Alles afgerond.</p>
      )}

      {/* Afgerond werk verdwijnt niet, maar staat wel opgevouwen: je wilt
          zien wat er nog moet, niet wat er al is. */}
      {afgerond.length > 0 && (
        <div className={cn("rounded-lg border border-border", open.length > 0 && "mt-4")}>
          <button
            type="button"
            onClick={() => setAfgerondOpen((value) => !value)}
            aria-expanded={afgerondOpen}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-150", afgerondOpen && "rotate-180")} />
            Afgerond
            <span className="tabular-nums">({afgerond.length})</span>
          </button>

          {afgerondOpen && (
            <ul className="divide-y divide-border border-t border-border px-3">{afgerond.map(row)}</ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
