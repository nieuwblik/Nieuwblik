import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CalendarClock,
  CheckSquare,
  Clock,
  FolderKanban,
  Plus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import QuickAddTask from "@/admin/components/QuickAddTask";
import StatusBadge from "@/admin/components/StatusBadge";
import TaskDialog from "@/admin/components/TaskDialog";
import TaskList from "@/admin/components/TaskList";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS_ORDER } from "@/admin/constants";
import { daysUntil, deadlineLabel, formatDateTime } from "@/admin/format";
import { useRecentProjects } from "@/admin/recent";
import {
  useClients,
  useProjects,
  useRecentUpdates,
  useTasks,
  useTeam,
  type TaskWithProject,
} from "@/admin/queries";

interface StatProps {
  icon: typeof FolderKanban;
  label: string;
  value: number | string;
  hint?: string;
  to: string;
  alert?: boolean;
}

const Stat = ({ icon: Icon, label, value, hint, to, alert }: StatProps) => (
  <Link
    to={to}
    className="rounded-lg border border-border bg-background p-4 transition-colors hover:border-foreground/20"
  >
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className={cn("mt-2 text-3xl font-semibold tabular-nums", alert && "text-rose-600 dark:text-rose-400")}>{value}</p>
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </Link>
);

const Dashboard = () => {
  const { user, displayName } = useAdminAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: clients = [] } = useClients();
  const { data: team = [] } = useTeam();
  const { data: updates = [] } = useRecentUpdates(8);
  const recent = useRecentProjects();
  const [taskOpen, setTaskOpen] = useState(false);
  const [editing, setEditing] = useState<TaskWithProject | null>(null);

  const stats = useMemo(() => {
    const openTasks = tasks.filter((t) => t.status !== "klaar");
    return {
      activeProjects: projects.filter((p) => ACTIVE_PROJECT_STATUSES.includes(p.status)).length,
      liveProjects: projects.filter((p) => p.status === "live").length,
      openTasks: openTasks.length,
      overdueTasks: openTasks.filter((t) => (daysUntil(t.due_date) ?? 1) < 0).length,
      mine: openTasks.filter((t) => t.assigned_to === user?.id),
    };
  }, [projects, tasks, user?.id]);

  /** Projecten met een deadline binnen twee weken, of al verstreken. */
  const upcoming = useMemo(
    () =>
      projects
        .filter((p) => {
          if (!p.deadline || !ACTIVE_PROJECT_STATUSES.includes(p.status)) return false;
          const days = daysUntil(p.deadline);
          return days !== null && days <= 14;
        })
        .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))
        .slice(0, 6),
    [projects],
  );

  const pipeline = useMemo(
    () =>
      PROJECT_STATUS_ORDER.map((status) => ({
        status,
        count: projects.filter((p) => p.status === status).length,
      })).filter((row) => row.count > 0),
    [projects],
  );

  const openEditor = (task: TaskWithProject) => {
    setEditing(task);
    setTaskOpen(true);
  };

  // Alles opgeleverd en niets genoteerd: dan is een leeg dashboard correct maar
  // niet behulpzaam, dus leggen we uit wat er te doen valt.
  const nothingRunning = !projectsLoading && !tasksLoading && stats.activeProjects === 0 && tasks.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hallo{displayName ? `, ${displayName.split(/[\s@]/)[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Dit staat er vandaag open.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setEditing(null);
            setTaskOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Taak met details
        </Button>
      </div>

      <QuickAddTask userId={user?.id ?? null} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={FolderKanban}
          label="Lopend werk"
          value={projectsLoading ? "…" : stats.activeProjects}
          hint={`${stats.liveProjects} live · ${projects.length} totaal`}
          to="/admin/projecten"
        />
        <Stat
          icon={CheckSquare}
          label="Openstaande taken"
          value={tasksLoading ? "…" : stats.openTasks}
          hint={`${stats.mine.length} van jou`}
          to="/admin/taken"
        />
        <Stat
          icon={AlertTriangle}
          label="Te laat"
          value={tasksLoading ? "…" : stats.overdueTasks}
          hint="Taken over de deadline"
          to="/admin/taken"
          alert={stats.overdueTasks > 0}
        />
        <Stat
          icon={Users}
          label="Klanten"
          value={clients.length}
          hint={`${clients.filter((c) => c.status === "actief").length} actief`}
          to="/admin/klanten"
        />
      </div>

      {nothingRunning && (
        <Card className="border-dashed">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Je {projects.length} sites staan erin als opgeleverd werk, dus er is niets lopend. Zet een project op{" "}
            <span className="text-foreground">In bouw</span> of <span className="text-foreground">Onderhoud</span> zodra
            er weer aan gewerkt wordt, of noteer hierboven je eerste taak.
          </CardContent>
        </Card>
      )}

      {recent.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Recent bekeken
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((project) => (
              <Link
                key={project.id}
                to={`/admin/projecten/${project.id}`}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:border-foreground/20 hover:bg-muted"
              >
                {project.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Mijn taken</CardTitle>
            <CardDescription>Openstaand werk dat aan jou is toegewezen.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.mine.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="Niets openstaand"
                description="Er staan geen taken op jouw naam."
              />
            ) : (
              <TaskList tasks={stats.mine} team={team} onEdit={openEditor} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deadlines</CardTitle>
            <CardDescription>Projecten die binnen twee weken moeten staan.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <EmptyState icon={CalendarClock} title="Geen deadlines in zicht" />
            ) : (
              <ul className="space-y-3">
                {upcoming.map((project) => {
                  const late = (daysUntil(project.deadline) ?? 1) < 0;
                  return (
                    <li key={project.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/admin/projecten/${project.id}`}
                          className="block truncate text-sm font-medium hover:underline"
                        >
                          {project.name}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">{project.client?.name ?? "Geen klant"}</p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 text-xs",
                          late ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground",
                        )}
                      >
                        {deadlineLabel(project.deadline)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pijplijn</CardTitle>
            <CardDescription>Verdeling over de fases.</CardDescription>
          </CardHeader>
          <CardContent>
            {pipeline.length === 0 ? (
              <EmptyState icon={FolderKanban} title="Nog geen projecten" />
            ) : (
              <ul className="space-y-2">
                {pipeline.map(({ status, count }) => (
                  <li key={status} className="flex items-center justify-between gap-3">
                    <StatusBadge kind="project" value={status} />
                    <span className="text-sm tabular-nums text-muted-foreground">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Laatste activiteit</CardTitle>
            <CardDescription>Updates en statuswijzigingen over alle projecten.</CardDescription>
          </CardHeader>
          <CardContent>
            {updates.length === 0 ? (
              <EmptyState icon={FolderKanban} title="Nog geen activiteit" />
            ) : (
              <ul className="space-y-3">
                {updates.map((update) => (
                  <li key={update.id} className="flex gap-3">
                    <StatusBadge kind="update" value={update.kind} className="mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm">{update.body}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {update.project && (
                          <Link to={`/admin/projecten/${update.project.id}`} className="hover:underline">
                            {update.project.name}
                          </Link>
                        )}
                        {update.project && " · "}
                        {formatDateTime(update.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <TaskDialog open={taskOpen} onOpenChange={setTaskOpen} task={editing} userId={user?.id ?? null} />
    </div>
  );
};

export default Dashboard;
