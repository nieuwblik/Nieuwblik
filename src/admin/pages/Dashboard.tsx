import { useMemo, useState } from "react";
import { CheckSquare, Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClientRowItem from "@/admin/components/ClientRowItem";
import EmptyState from "@/admin/components/EmptyState";
import TaskList from "@/admin/components/TaskList";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { daysUntil } from "@/admin/format";
import { useCombinedRows } from "@/admin/rows";
import { useTasks, useTeam } from "@/admin/queries";

const Dashboard = () => {
  const { user, displayName } = useAdminAuth();
  const { rows, isLoading } = useCombinedRows();
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const [search, setSearch] = useState("");

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
            {visible.map((row) => (
              <ClientRowItem key={row.key} row={row} />
            ))}
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
            <TaskList tasks={myOpenTasks} team={team} />
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;
