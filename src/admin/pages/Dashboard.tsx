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
import { ACTIVE_PROJECT_STATUSES } from "@/admin/constants";
import { daysUntil, deadlineLabel, timeAgo } from "@/admin/format";
import { useCombinedRows } from "@/admin/rows";
import { useTasks, useTeam, type TaskWithProject } from "@/admin/queries";

const Dashboard = () => {
  const { user, displayName } = useAdminAuth();
  const { rows, isLoading } = useCombinedRows();
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const [search, setSearch] = useState("");
  const [taskOpen, setTaskOpen] = useState(false);
  const [editing, setEditing] = useState<TaskWithProject | null>(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      [row.client.name, row.client.contact_name, row.client.city].some((value) =>
        (value ?? "").toLowerCase().includes(term),
      ),
    );
  }, [rows, search]);

  const myOpenTasks = useMemo(
    () => tasks.filter((t) => t.status !== "klaar" && t.assigned_to === user?.id),
    [tasks, user?.id],
  );

  const openTotal = tasks.filter((t) => t.status !== "klaar").length;
  const overdue = tasks.filter((t) => t.status !== "klaar" && (daysUntil(t.due_date) ?? 1) < 0).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hallo{displayName ? `, ${displayName.split(/[\s@]/)[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} klanten · {openTotal} openstaande {openTotal === 1 ? "taak" : "taken"}
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
              const late =
                row.deadline !== null &&
                (daysUntil(row.deadline) ?? 1) < 0 &&
                row.status !== null &&
                ACTIVE_PROJECT_STATUSES.includes(row.status);

              return (
                <li key={row.key}>
                  <Link
                    to={row.to}
                    className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{row.client.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {row.client.contact_name ?? (row.project ? " " : "Nog geen project")}
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

                    {row.status && <StatusBadge kind="project" value={row.status} className="shrink-0" />}

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
            Openstaand werk op jouw naam, over alle klanten heen. Toevoegen doe je bij de klant zelf.
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
