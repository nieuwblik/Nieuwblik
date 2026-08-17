import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ListChecks, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import StatusBadge from "@/admin/components/StatusBadge";
import TaskImages from "@/admin/components/TaskImages";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import {
  PRIORITY,
  PRIORITY_ORDER,
  TASK_STATUS,
  TASK_STATUS_ORDER,
  type Priority,
  type TaskStatus,
} from "@/admin/constants";
import { daysUntil, deadlineLabel, formatDateTime } from "@/admin/format";
import {
  useDeleteTask,
  useSaveTask,
  useTasks,
  useTeam,
  useUpdateTask,
  type TaskWithProject,
} from "@/admin/queries";

const NONE = "__none__";

/** Eén subtaak: afvinken, doorklikken, verwijderen. */
const SubtaskRow = ({ task, onDelete }: { task: TaskWithProject; onDelete: () => void }) => {
  const update = useUpdateTask();
  const done = task.status === "klaar";
  const overdue = !done && (daysUntil(task.due_date) ?? 1) < 0;

  return (
    <li className="flex items-center gap-3 py-2">
      <Checkbox
        checked={done}
        onCheckedChange={(checked) =>
          void update
            .mutateAsync({ id: task.id, values: { status: checked === true ? "klaar" : "todo" } })
            .catch((error: Error) => toast.error(error.message))
        }
        aria-label={done ? "Markeer als open" : "Markeer als klaar"}
      />
      <Link
        to={`/admin/taken/${task.id}`}
        className={cn("min-w-0 flex-1 truncate text-sm hover:underline", done && "text-muted-foreground line-through")}
      >
        {task.title}
      </Link>
      {task.due_date && (
        <span
          className={cn("shrink-0 text-xs", overdue ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground")}
        >
          {deadlineLabel(task.due_date)}
        </span>
      )}
      {task.priority !== "normaal" && <StatusBadge kind="priority" value={task.priority} className="shrink-0" />}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onDelete}
        aria-label="Verwijderen"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </li>
  );
};

/**
 * Volledige taakpagina: alle velden, foto's en de losse stappen eronder.
 *
 * De velden slaan bij verlaten van het veld op in plaats van via een
 * opslaan-knop. Je komt hier om iets bij te werken terwijl je aan het werk
 * bent, niet om een formulier in te vullen.
 */
const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { data: tasks = [], isLoading } = useTasks();
  const { data: team = [] } = useTeam();
  const update = useUpdateTask();
  const save = useSaveTask();
  const remove = useDeleteTask();

  const task = useMemo(() => tasks.find((t) => t.id === id) ?? null, [tasks, id]);
  const parent = useMemo(
    () => (task?.parent_task_id ? (tasks.find((t) => t.id === task.parent_task_id) ?? null) : null),
    [tasks, task?.parent_task_id],
  );
  const subtasks = useMemo(() => tasks.filter((t) => t.parent_task_id === id), [tasks, id]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");

  // Lokale kopie voor de vrije tekstvelden, zodat typen niet per aanslag naar
  // de database gaat. De rest slaat direct op bij het kiezen.
  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description ?? "");
  }, [task?.id, task?.title, task?.description]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Taak laden…</p>;
  if (!task) return <p className="text-sm text-muted-foreground">Deze taak bestaat niet (meer).</p>;

  const patch = async (values: Parameters<typeof update.mutateAsync>[0]["values"]) => {
    try {
      await update.mutateAsync({ id: task.id, values });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  };

  const addSubtask = async () => {
    const trimmed = subtaskTitle.trim();
    if (!trimmed || save.isPending) return;
    try {
      await save.mutateAsync({
        values: {
          title: trimmed.slice(0, 300),
          parent_task_id: task.id,
          project_id: task.project_id,
          assigned_to: task.assigned_to,
          created_by: user?.id ?? null,
        },
      });
      setSubtaskTitle("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toevoegen mislukt");
    }
  };

  const handleDelete = async () => {
    const extra = subtasks.length > 0 ? ` De ${subtasks.length} stappen eronder gaan mee.` : "";
    if (!window.confirm(`"${task.title}" verwijderen?${extra}`)) return;
    try {
      await remove.mutateAsync(task.id);
      toast.success("Taak verwijderd");
      navigate(task.project ? `/admin/projecten/${task.project.id}` : "/admin/taken");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verwijderen mislukt");
    }
  };

  const doneCount = subtasks.filter((t) => t.status === "klaar").length;
  const backTo = parent
    ? `/admin/taken/${parent.id}`
    : task.project
      ? `/admin/projecten/${task.project.id}`
      : "/admin/taken";

  return (
    <div className="max-w-3xl space-y-6">
      <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {parent ? parent.title : (task.project?.name ?? "Taken")}
      </Link>

      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === "klaar"}
          onCheckedChange={(checked) => void patch({ status: checked === true ? "klaar" : "todo" })}
          aria-label={task.status === "klaar" ? "Markeer als open" : "Markeer als klaar"}
          className="mt-2"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== task.title && void patch({ title: title.trim() })}
          maxLength={300}
          aria-label="Titel"
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent p-0 text-2xl font-semibold tracking-tight outline-none focus:ring-0",
            task.status === "klaar" && "text-muted-foreground line-through",
          )}
        />
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => void handleDelete()}
          aria-label="Taak verwijderen"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="td-status">Status</Label>
            <Select value={task.status} onValueChange={(v) => void patch({ status: v as TaskStatus })}>
              <SelectTrigger id="td-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUS_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>
                    {TASK_STATUS[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="td-priority">Prioriteit</Label>
            <Select value={task.priority} onValueChange={(v) => void patch({ priority: v as Priority })}>
              <SelectTrigger id="td-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_ORDER.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRIORITY[p].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="td-assignee">Toegewezen aan</Label>
            <Select
              value={task.assigned_to ?? NONE}
              onValueChange={(v) => void patch({ assigned_to: v === NONE ? null : v })}
            >
              <SelectTrigger id="td-assignee">
                <SelectValue placeholder="Niemand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Niemand</SelectItem>
                {team.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="td-due">Deadline</Label>
            <Input
              id="td-due"
              type="date"
              value={task.due_date ?? ""}
              onChange={(e) => void patch({ due_date: e.target.value || null })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="td-description">Omschrijving</Label>
        <Textarea
          id="td-description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => description !== (task.description ?? "") && void patch({ description: description.trim() || null })}
          placeholder="Wat moet er precies gebeuren?"
          maxLength={10000}
        />
      </div>

      {/* Subtaken alleen op het hoofdniveau: dieper nesten maakt een lijst
          onleesbaar, en de database weigert het ook. */}
      {!parent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stappen</CardTitle>
            <CardDescription>
              {subtasks.length === 0
                ? "Splits deze taak op in losse stappen."
                : `${doneCount} van ${subtasks.length} klaar`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subtasks.length === 0 ? (
              <EmptyState icon={ListChecks} title="Nog geen stappen" />
            ) : (
              <ul className="divide-y divide-border">
                {subtasks.map((sub) => (
                  <SubtaskRow
                    key={sub.id}
                    task={sub}
                    onDelete={() => {
                      if (!window.confirm(`"${sub.title}" verwijderen?`)) return;
                      void remove
                        .mutateAsync(sub.id)
                        .catch((error: Error) => toast.error(error.message));
                    }}
                  />
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <Input
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  void addSubtask();
                }}
                placeholder="Stap toevoegen en op Enter drukken…"
                maxLength={300}
                aria-label="Nieuwe stap"
              />
              <Button variant="outline" onClick={() => void addSubtask()} disabled={!subtaskTitle.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Foto's</CardTitle>
          <CardDescription>Screenshots en beeldmateriaal bij deze taak.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskImages taskId={task.id} userId={user?.id ?? null} />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Aangemaakt {formatDateTime(task.created_at)}
        {task.completed_at && ` · afgerond ${formatDateTime(task.completed_at)}`}
      </p>
    </div>
  );
};

export default TaskDetail;
