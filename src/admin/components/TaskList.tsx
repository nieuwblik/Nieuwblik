import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import StatusBadge from "@/admin/components/StatusBadge";
import { PRIORITY_WEIGHT } from "@/admin/constants";
import { daysUntil, deadlineLabel, formatDate, initials, tintFor } from "@/admin/format";
import { useDeleteTask, useTasks, useUpdateTask, type TaskWithProject, type TeamMember } from "@/admin/queries";
import { useConfirm } from "@/admin/useConfirm";

interface TaskListProps {
  tasks: TaskWithProject[];
  team: TeamMember[];
  /** Uit bij de takenlijst binnen één project — de projectnaam is daar ruis. */
  showProject?: boolean;
  /**
   * Wat te tonen als er niets staat. Hoort hier en niet bij de aanroeper: die
   * zou de lijst vervangen op het moment dat je de laatste taak afvinkt, en
   * daarmee de afloop halverwege afbreken.
   */
  empty?: ReactNode;
  /** Kaarten op de klantpagina, compacte regels in de lijsten. */
  variant?: "lijst" | "kaarten";
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

const TaskList = ({ tasks, team, showProject = true, empty, variant = "lijst" }: TaskListProps) => {
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const { vraagBevestiging, dialoog } = useConfirm();
  // null = nog niet aangeraakt; de weergave bepaalt dan zelf de beginstand.
  const [afgerondOpen, setAfgerondOpen] = useState<boolean | null>(null);
  // De volledige set staat al in de react-query-cache; hieruit tellen we de
  // stappen per taak, ook als de aanroeper een gefilterde lijst doorgeeft.
  const { data: allTasks = [] } = useTasks();

  const steps = (taskId: string) => {
    const own = allTasks.filter((t) => t.parent_task_id === taskId);
    if (own.length === 0) return null;
    return `${own.filter((t) => t.status === "klaar").length}/${own.length} stappen`;
  };

  /*
   * Een afgevinkte taak valt meteen uit de lijst, want de aanroeper filtert op
   * openstaand werk. Dan zie je je eigen vinkje niet: de regel is al weg. We
   * houden hem daarom even vast — streep, vervagen, dan pas inklappen.
   */
  const [netAf, setNetAf] = useState<Record<string, { taak: TaskWithProject; vertrekt: boolean }>>({});
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const laatLos = (id: string) =>
    setNetAf((huidig) => {
      const { [id]: _weg, ...rest } = huidig;
      return rest;
    });

  const toggle = async (task: TaskWithProject, done: boolean) => {
    if (done) {
      setNetAf((huidig) => ({ ...huidig, [task.id]: { taak: { ...task, status: "klaar" }, vertrekt: false } }));
      timers.current.push(
        window.setTimeout(
          () =>
            setNetAf((huidig) => {
              const item = huidig[task.id];
              return item ? { ...huidig, [task.id]: { ...item, vertrekt: true } } : huidig;
            }),
          420,
        ),
        window.setTimeout(() => laatLos(task.id), 640),
      );
    }

    try {
      await update.mutateAsync({ id: task.id, values: { status: done ? "klaar" : "todo" } });
    } catch (error) {
      laatLos(task.id);
      toast.error(error instanceof Error ? error.message : "Bijwerken mislukt");
    }
  };

  const handleDelete = async (task: TaskWithProject) => {
    if (!(await vraagBevestiging({ titel: `Taak "${task.title}" verwijderen?` }))) return;
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
    const afscheid = netAf[task.id];

    return (
      <li
        key={task.id}
        className={cn(
          // De regel loopt iets buiten de lijst zodat het hover-vlak breder is
          // dan de tekst; anders lijkt aanwijzen niet te reageren.
          "-mx-2 flex items-start gap-3 rounded-lg px-2 py-3 transition-[background-color,opacity] duration-200 hover:bg-muted/40",
          done && "opacity-60",
          // Alleen de vertrekkende regel krijgt een hoogte-overgang: bij alle
          // regels zou overflow-hidden de badges kunnen afknippen.
          afscheid && "max-h-40 overflow-hidden transition-[max-height,opacity,padding] duration-200 ease-in",
          afscheid?.vertrekt && "max-h-0 py-0 opacity-0",
        )}
      >
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
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              done ? "text-muted-foreground" : "hover:underline",
            )}
          >
            {/* De doorhaalstreep groeit door de tekst heen in plaats van er
                ineens te staan. Een achtergrondlijn en geen line-through:
                die laatste is niet te animeren. */}
            <span
              className={cn(
                "bg-[linear-gradient(currentColor,currentColor)] bg-[position:0_55%] bg-no-repeat transition-[background-size] duration-200 ease-out",
                done ? "bg-[length:100%_1px]" : "bg-[length:0%_1px]",
              )}
            >
              {task.title}
            </span>
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
            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => void handleDelete(task)}
            aria-label="Verwijderen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </li>
    );
  };

  /**
   * De kaartvorm van dezelfde taak, voor de klantpagina. Dezelfde gegevens,
   * maar met lucht eromheen en de deadline rechts uitgelijnd, zodat je een
   * stapel taken in één blik langs kunt.
   */
  const kaart = (task: TaskWithProject) => {
    const done = task.status === "klaar";
    const overdue = !done && (daysUntil(task.due_date) ?? 1) < 0;
    const afscheid = netAf[task.id];
    const maker = nameFor(task.created_by);
    const uitvoerder = nameFor(task.assigned_to);

    return (
      <li
        key={task.id}
        className={cn(
          "rounded-md border border-border p-4 transition-[background-color,opacity] duration-200",
          done ? "bg-muted/40" : "hover:border-foreground/20",
          afscheid && "max-h-60 overflow-hidden transition-[max-height,opacity,padding,margin] duration-200 ease-in",
          afscheid?.vertrekt && "max-h-0 border-0 py-0 opacity-0",
        )}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            checked={done}
            onCheckedChange={(checked) => void toggle(task, checked === true)}
            aria-label={done ? "Markeer als open" : "Markeer als klaar"}
            className="mt-0.5"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
              <Link
                to={`/admin/taken/${task.id}`}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  done ? "text-muted-foreground" : "hover:underline",
                )}
              >
                <span
                  className={cn(
                    "bg-[linear-gradient(currentColor,currentColor)] bg-[position:0_55%] bg-no-repeat transition-[background-size] duration-200 ease-out",
                    done ? "bg-[length:100%_1px]" : "bg-[length:0%_1px]",
                  )}
                >
                  {task.title}
                </span>
              </Link>

              {task.due_date && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  Deadline:{" "}
                  <span className={cn("font-medium text-foreground", overdue && "text-rose-600 dark:text-rose-400")}>
                    {deadlineLabel(task.due_date)}
                  </span>
                </span>
              )}
            </div>

            {task.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
            )}

            {/* Onderregel: wie eraan werkt links, de kenmerken rechts. Dat is
                de indeling van de referentie, en ze vechten niet om ruimte. */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                {uitvoerder || maker ? (
                  <>
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold",
                        tintFor(uitvoerder ?? maker ?? ""),
                      )}
                      aria-hidden="true"
                    >
                      {initials(uitvoerder ?? maker ?? "")}
                    </span>
                    <span className="truncate">
                      {uitvoerder ? "Ligt bij " : "Aangemaakt door "}
                      <span className="font-medium text-foreground">{uitvoerder ?? maker}</span>
                    </span>
                  </>
                ) : (
                  <span>Niemand toegewezen</span>
                )}
                {steps(task.id) && <span className="shrink-0">· {steps(task.id)}</span>}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {!done && task.priority !== "normaal" && <StatusBadge kind="priority" value={task.priority} />}
                {!done && task.status !== "todo" && <StatusBadge kind="task" value={task.status} />}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => void handleDelete(task)}
                  aria-label="Verwijderen"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };

  // Stappen verschijnen op de pagina van hun eigen taak, niet los in deze
  // lijst: anders staat hetzelfde werk er twee keer in.
  const eigen = tasks.filter((t) => !t.parent_task_id);
  const wachtend = new Set(Object.keys(netAf));

  // De net afgevinkte taak houdt zijn oorspronkelijke prioriteit, dus de
  // sortering laat hem staan waar hij stond terwijl hij vervaagt.
  const open = sortTasks([
    ...eigen.filter((t) => t.status !== "klaar" && !wachtend.has(t.id)),
    ...Object.values(netAf).map((v) => v.taak),
  ]);

  // Laatst afgevinkt bovenaan: dat is meestal wat je nog even wilt nakijken.
  // Wie nog aan het vertrekken is, staat hierboven en hoort er nog niet bij.
  const afgerond = eigen
    .filter((t) => t.status === "klaar" && !wachtend.has(t.id))
    .sort((a, b) => (b.completed_at ?? b.updated_at).localeCompare(a.completed_at ?? a.updated_at));

  // In de kaartweergave staat de geschiedenis open zolang het overzichtelijk
  // blijft. Bij een klant met tientallen afgeronde taken zou dat de pagina
  // onbruikbaar lang maken, dus daarboven blijft hij dicht tot je hem opent.
  const kaarten = variant === "kaarten";
  const afgerondZichtbaar = afgerondOpen ?? (kaarten && afgerond.length <= 5);

  // Per dag gegroepeerd, zoals de referentie: een datum boven het blok leest
  // sneller dan een datum achter elke regel.
  const perDag = kaarten
    ? afgerond.reduce<{ dag: string; label: string; taken: TaskWithProject[] }[]>((groepen, task) => {
        const stempel = task.completed_at ?? task.updated_at;
        const dag = stempel.slice(0, 10);
        const laatste = groepen[groepen.length - 1];
        if (laatste?.dag === dag) laatste.taken.push(task);
        else groepen.push({ dag, label: formatDate(stempel), taken: [task] });
        return groepen;
      }, [])
    : [];

  const regel = kaarten ? kaart : row;

  return (
    <div>
      {open.length > 0 ? (
        <ul className={kaarten ? "space-y-3" : "space-y-2"}>{open.map(regel)}</ul>
      ) : afgerond.length > 0 ? (
        <p className="py-3 text-sm text-muted-foreground">Alles afgerond.</p>
      ) : (
        empty
      )}

      {/* Afgerond werk verdwijnt niet, maar staat wel apart: je wilt zien wat
          er nog moet, niet wat er al is. */}
      {afgerond.length > 0 &&
        (kaarten ? (
          <div className={cn(open.length > 0 && "mt-8")}>
            <button
              type="button"
              onClick={() => setAfgerondOpen(!afgerondZichtbaar)}
              aria-expanded={afgerondZichtbaar}
              className="group flex items-center gap-2 text-base font-semibold transition-colors hover:text-muted-foreground"
            >
              Taakgeschiedenis
              <span className="text-sm font-normal text-muted-foreground">({afgerond.length})</span>
              <ChevronDown
                className={cn("h-4 w-4 text-muted-foreground transition-transform duration-150", afgerondZichtbaar && "rotate-180")}
              />
            </button>

            {afgerondZichtbaar && (
              <div className="mt-4 space-y-6">
                {perDag.map((groep) => (
                  <div key={groep.dag}>
                    <p className="mb-2 text-sm text-muted-foreground">{groep.label}</p>
                    <ul className="space-y-3">{groep.taken.map(kaart)}</ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={cn("rounded-lg border border-border", open.length > 0 && "mt-4")}>
            <button
              type="button"
              onClick={() => setAfgerondOpen(!afgerondZichtbaar)}
              aria-expanded={afgerondZichtbaar}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-150", afgerondZichtbaar && "rotate-180")} />
              Afgerond
              <span className="tabular-nums">({afgerond.length})</span>
            </button>

            {afgerondZichtbaar && <ul className="space-y-2 border-t border-border px-3 py-2">{afgerond.map(row)}</ul>}
          </div>
        ))}

      {dialoog}
    </div>
  );
};

export default TaskList;
