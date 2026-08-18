import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Clock,
  Flag,
  Paperclip,
  Plus,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import StatusBadge from "@/admin/components/StatusBadge";
import DatePicker from "@/admin/components/DatePicker";
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
import { useConfirm } from "@/admin/useConfirm";
import {
  useDeleteTask,
  useSaveTask,
  useTaskFileCounts,
  useTasks,
  useTeam,
  useUpdateTask,
  type TaskWithProject,
} from "@/admin/queries";

const NONE = "__none__";

/** Eén eigenschap: icoon en label links, de waarde rechts. */
const Row = ({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-3 py-2.5">
    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
    {/* Vast label, maar smal: de waarde ernaast is wat je leest, en een
        e-mailadres past anders niet in deze kolom. */}
    <span className="w-24 shrink-0 truncate text-sm text-muted-foreground">{label}</span>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

/**
 * Eén stap. Een stap is zelf een volledige taak, dus prioriteit en foto's
 * horen er gewoon bij. Ze staan hier in de regel zodat je er niet voor hoeft
 * door te klikken; de titel opent nog wel de eigen pagina met omschrijving,
 * deadline en toewijzing.
 */
const SubtaskRow = ({
  task,
  userId,
  fotoAantal,
  onDelete,
}: {
  task: TaskWithProject;
  userId: string | null;
  fotoAantal: number;
  onDelete: () => void;
}) => {
  const update = useUpdateTask();
  const done = task.status === "klaar";
  const overdue = !done && (daysUntil(task.due_date) ?? 1) < 0;

  return (
    <li className="flex items-center gap-2 py-2">
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
          className={cn(
            "shrink-0 text-xs",
            overdue ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground",
          )}
        >
          {deadlineLabel(task.due_date)}
        </span>
      )}

      <Select
        value={task.priority}
        onValueChange={(v) =>
          void update
            .mutateAsync({ id: task.id, values: { priority: v as Priority } })
            .catch((error: Error) => toast.error(error.message))
        }
      >
        <SelectTrigger
          aria-label={`Prioriteit van "${task.title}"`}
          className="h-7 w-auto gap-1 border-0 bg-transparent px-2 text-xs shadow-none hover:bg-muted focus:ring-0"
        >
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

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Bijlagen bij "${task.title}"`}
            className={cn("h-7 shrink-0 gap-1 px-2 text-xs", fotoAantal === 0 && "text-muted-foreground")}
          >
            <Paperclip className="h-3.5 w-3.5" />
            {fotoAantal > 0 && <span className="tabular-nums">{fotoAantal}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3">
          <TaskImages taskId={task.id} userId={userId} />
        </PopoverContent>
      </Popover>

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
  const { vraagBevestiging, dialoog } = useConfirm();

  const task = useMemo(() => tasks.find((t) => t.id === id) ?? null, [tasks, id]);
  const parent = useMemo(
    () => (task?.parent_task_id ? (tasks.find((t) => t.id === task.parent_task_id) ?? null) : null),
    [tasks, task?.parent_task_id],
  );
  const subtasks = useMemo(() => tasks.filter((t) => t.parent_task_id === id), [tasks, id]);
  const subtaskIds = useMemo(() => subtasks.map((t) => t.id), [subtasks]);
  const { data: fotoAantallen = {} } = useTaskFileCounts(subtaskIds);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const didFocus = useRef(false);
  const location = useLocation();

  /*
   * Net aangemaakt via een plusknop: de werktitel staat geselecteerd, zodat
   * je meteen de echte titel kunt typen zonder eerst te wissen.
   *
   * Wacht op een gevulde titel: de taak wordt een tik later geladen dan de
   * eerste render, en selecteren vóór dat moment gaat bij de volgende render
   * weer verloren. De ref zorgt dat het daarna bij één keer blijft.
   */
  useEffect(() => {
    if (didFocus.current || !title || !titleRef.current) return;
    if (!(location.state as { nieuw?: boolean } | null)?.nieuw) return;

    didFocus.current = true;
    titleRef.current.focus();
    titleRef.current.select();
    window.history.replaceState({}, "");
  }, [location.state, title]);

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
    const door = await vraagBevestiging({
      titel: `"${task.title}" verwijderen?`,
      beschrijving: subtasks.length > 0 ? `De ${subtasks.length} stappen eronder gaan mee.` : undefined,
    });
    if (!door) return;
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
    <div className="space-y-6">
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
          ref={titleRef}
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

      {/* Inhoud links, eigenschappen in een vaste kolom ernaast. Alles over de
          volle breedte uitrekken zou een omschrijvingsveld opleveren waarin
          een regel tekst te lang wordt om prettig te lezen. */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="td-description">Omschrijving</Label>
            <Textarea
              id="td-description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() =>
                description !== (task.description ?? "") && void patch({ description: description.trim() || null })
              }
              placeholder="Wat moet er precies gebeuren?"
              maxLength={10000}
              className="max-w-3xl"
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
                {subtasks.length > 0 && (
                  <ul className="divide-y divide-border">
                    {subtasks.map((sub) => (
                      <SubtaskRow
                        key={sub.id}
                        task={sub}
                        userId={user?.id ?? null}
                        fotoAantal={fotoAantallen[sub.id] ?? 0}
                        onDelete={() => {
                          void (async () => {
                            if (!(await vraagBevestiging({ titel: `"${sub.title}" verwijderen?` }))) return;
                            await remove.mutateAsync(sub.id).catch((error: Error) => toast.error(error.message));
                          })();
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
              <CardTitle className="text-base">Foto&apos;s</CardTitle>
              <CardDescription>Screenshots en beeldmateriaal bij deze taak.</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskImages taskId={task.id} userId={user?.id ?? null} />
            </CardContent>
          </Card>
        </div>

        {/* Eigenschappen als label-met-waarde-rijen: je leest ze vaker dan je
            ze wijzigt, en een kolom formuliervelden trekt daar te veel
            aandacht naartoe. Wijzigen kan nog steeds direct in de rij. */}
        <aside className="space-y-4 xl:sticky xl:top-4">
          <Card>
            <CardContent className="divide-y divide-border p-0">
              <Row icon={CircleDot} label="Status">
                <Select value={task.status} onValueChange={(v) => void patch({ status: v as TaskStatus })}>
                  <SelectTrigger className="h-8 border-0 bg-transparent px-2 shadow-none hover:bg-muted focus:ring-0">
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
              </Row>

              <Row icon={Flag} label="Prioriteit">
                <Select value={task.priority} onValueChange={(v) => void patch({ priority: v as Priority })}>
                  <SelectTrigger className="h-8 border-0 bg-transparent px-2 shadow-none hover:bg-muted focus:ring-0">
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
              </Row>

              <Row icon={UserRound} label="Toegewezen aan">
                <Select
                  value={task.assigned_to ?? NONE}
                  onValueChange={(v) => void patch({ assigned_to: v === NONE ? null : v })}
                >
                  <SelectTrigger className="h-8 border-0 bg-transparent px-2 shadow-none hover:bg-muted focus:ring-0">
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
              </Row>

              <Row icon={CalendarDays} label="Deadline">
                <DatePicker
                  value={task.due_date}
                  onChange={(waarde) => void patch({ due_date: waarde })}
                  aria-label="Deadline"
                />
              </Row>

              {/* Alleen tonen als er stappen zijn: een balk op 0% bij een taak
                  zonder stappen suggereert achterstand die er niet is. */}
              {!parent && subtasks.length > 0 && (
                <Row icon={CircleDashed} label="Voortgang">
                  <div className="flex items-center gap-3 px-2">
                    <Progress value={(doneCount / subtasks.length) * 100} className="w-24" />
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {Math.round((doneCount / subtasks.length) * 100)}%
                    </span>
                  </div>
                </Row>
              )}

              <Row icon={Clock} label="Aangemaakt">
                <span className="px-2 text-sm text-muted-foreground">{formatDateTime(task.created_at)}</span>
              </Row>

              {task.completed_at && (
                <Row icon={CircleCheck} label="Afgerond">
                  <span className="px-2 text-sm text-muted-foreground">{formatDateTime(task.completed_at)}</span>
                </Row>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      {dialoog}
    </div>
  );
};

export default TaskDetail;

