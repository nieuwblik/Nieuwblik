import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckSquare, Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import StatusBadge from "@/admin/components/StatusBadge";
import TaskDialog from "@/admin/components/TaskDialog";
import TaskList from "@/admin/components/TaskList";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import type { ProjectStatus } from "@/admin/constants";
import { daysUntil, deadlineLabel, mostRecent, timeAgo } from "@/admin/format";
import {
  useClients,
  useLatestUpdatePerProject,
  useProjects,
  useTasks,
  useTeam,
  type TaskWithProject,
} from "@/admin/queries";

/**
 * Eén regel op het beginscherm: een klant met het project waar je op klikt.
 * Klanten zonder project krijgen ook een regel, anders vallen ze van het
 * scherm zodra je ze net hebt aangemaakt.
 */
interface Row {
  key: string;
  to: string;
  clientName: string;
  projectName: string | null;
  status: ProjectStatus;
  hasProject: boolean;
  deadline: string | null;
  openTasks: number;
  activeAt: string | null;
}

const Dashboard = () => {
  const { user, displayName } = useAdminAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const { data: latestUpdate = {} } = useLatestUpdatePerProject();
  const [search, setSearch] = useState("");
  const [taskOpen, setTaskOpen] = useState(false);
  const [editing, setEditing] = useState<TaskWithProject | null>(null);

  const rows = useMemo<Row[]>(() => {
    const openPerProject = new Map<string, number>();
    let latestTaskPerProject: Record<string, string> = {};

    for (const task of tasks) {
      if (!task.project_id) continue;
      if (task.status !== "klaar") {
        openPerProject.set(task.project_id, (openPerProject.get(task.project_id) ?? 0) + 1);
      }
      const current = latestTaskPerProject[task.project_id];
      if (!current || task.updated_at > current) {
        latestTaskPerProject = { ...latestTaskPerProject, [task.project_id]: task.updated_at };
      }
    }

    const projectRows: Row[] = projects.map((project) => ({
      key: project.id,
      to: `/admin/projecten/${project.id}`,
      clientName: project.client?.name ?? project.name,
      projectName: project.client && project.client.name !== project.name ? project.name : null,
      status: project.status,
      hasProject: true,
      deadline: project.deadline,
      openTasks: openPerProject.get(project.id) ?? 0,
      // Laatste activiteit is het nieuwste van: het project zelf gewijzigd,
      // een update geplaatst, of een taak aangeraakt.
      activeAt: mostRecent(project.updated_at, latestUpdate[project.id], latestTaskPerProject[project.id]),
    }));

    const clientsWithProject = new Set(projects.map((p) => p.client_id).filter(Boolean));
    const orphanRows: Row[] = clients
      .filter((client) => !clientsWithProject.has(client.id))
      .map((client) => ({
        key: `klant-${client.id}`,
        to: `/admin/klanten/${client.id}`,
        clientName: client.name,
        projectName: null,
        status: "lead" as const,
        hasProject: false,
        deadline: null,
        openTasks: 0,
        activeAt: client.updated_at,
      }));

    // Nieuwste bovenaan: precies wat er als laatste is aangeraakt staat vooraan.
    return [...projectRows, ...orphanRows].sort((a, b) => {
      if (!a.activeAt) return 1;
      if (!b.activeAt) return -1;
      return new Date(b.activeAt).getTime() - new Date(a.activeAt).getTime();
    });
  }, [projects, clients, tasks, latestUpdate]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (row) =>
        row.clientName.toLowerCase().includes(term) || (row.projectName ?? "").toLowerCase().includes(term),
    );
  }, [rows, search]);

  const myOpenTasks = useMemo(
    () => tasks.filter((t) => t.status !== "klaar" && t.assigned_to === user?.id),
    [tasks, user?.id],
  );

  const openTotal = tasks.filter((t) => t.status !== "klaar").length;
  const overdue = tasks.filter((t) => t.status !== "klaar" && (daysUntil(t.due_date) ?? 1) < 0).length;
  const isLoading = projectsLoading || clientsLoading;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hallo{displayName ? `, ${displayName.split(/[\s@]/)[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {clients.length} klanten · {openTotal} openstaande {openTotal === 1 ? "taak" : "taken"}
            {overdue > 0 && <span className="text-rose-600 dark:text-rose-400"> · {overdue} te laat</span>}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Zoek een klant"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">Klanten</h2>
          <span className="text-xs text-muted-foreground">Laatst gewijzigd bovenaan</span>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Laden…</p>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Users}
            title={rows.length === 0 ? "Nog geen klanten" : "Niets gevonden"}
            description={rows.length === 0 ? "Voeg een klant toe om te beginnen." : "Pas je zoekterm aan."}
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-background">
            {visible.map((row) => {
              const late = row.deadline !== null && (daysUntil(row.deadline) ?? 1) < 0;
              return (
                <li key={row.key}>
                  <Link
                    to={row.to}
                    className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{row.clientName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {row.projectName ?? (row.hasProject ? " " : "Nog geen project")}
                      </p>
                    </div>

                    {row.openTasks > 0 && (
                      <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                        <CheckSquare className="h-3.5 w-3.5" />
                        {row.openTasks}
                      </span>
                    )}

                    {row.deadline && (
                      <span
                        className={cn(
                          "hidden shrink-0 text-xs md:block",
                          late ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground",
                        )}
                      >
                        {deadlineLabel(row.deadline)}
                      </span>
                    )}

                    {row.hasProject && <StatusBadge kind="project" value={row.status} className="shrink-0" />}

                    <span className="hidden w-28 shrink-0 text-right text-xs text-muted-foreground lg:block">
                      {timeAgo(row.activeAt)}
                    </span>

                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mijn taken</CardTitle>
          <CardDescription>
            Openstaand werk op jouw naam, over alle projecten heen. Toevoegen doe je in het project zelf.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myOpenTasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="Niets openstaand" description="Er staan geen taken op jouw naam." />
          ) : (
            <TaskList
              tasks={myOpenTasks}
              team={team}
              onEdit={(task) => {
                setEditing(task);
                setTaskOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      <TaskDialog open={taskOpen} onOpenChange={setTaskOpen} task={editing} userId={user?.id ?? null} />
    </div>
  );
};

export default Dashboard;
