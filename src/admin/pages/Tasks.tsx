import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckSquare, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmptyState from "@/admin/components/EmptyState";
import TaskList from "@/admin/components/TaskList";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { TASK_STATUS, TASK_STATUS_ORDER, type TaskStatus } from "@/admin/constants";
import { daysUntil } from "@/admin/format";
import { useTasks, useTeam } from "@/admin/queries";
import { useCreateTask } from "@/admin/useCreateTask";

type Owner = "iedereen" | "ik" | "niemand" | string;
type StatusFilter = TaskStatus | "open" | "alle";

const Tasks = () => {
  const { user } = useAdminAuth();
  const { data: tasks = [], isLoading } = useTasks();
  const { data: team = [] } = useTeam();
  const [owner, setOwner] = useState<Owner>("iedereen");
  const [status, setStatus] = useState<StatusFilter>("open");
  const [search, setSearch] = useState("");
  const location = useLocation();
  const { createTask, isPending } = useCreateTask();

  // Het command-palet stuurt hierheen met { nieuw: true }. De state wordt
  // meteen gewist, anders maakt een refresh nog een lege taak aan.
  useEffect(() => {
    if (!(location.state as { nieuw?: boolean } | null)?.nieuw) return;
    window.history.replaceState({}, "");
    void createTask(null);
  }, [location.state, createTask]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (status === "open" && task.status === "klaar") return false;
      if (status !== "open" && status !== "alle" && task.status !== status) return false;

      if (owner === "ik" && task.assigned_to !== user?.id) return false;
      if (owner === "niemand" && task.assigned_to !== null) return false;
      if (owner !== "iedereen" && owner !== "ik" && owner !== "niemand" && task.assigned_to !== owner) return false;

      if (!term) return true;
      return (
        task.title.toLowerCase().includes(term) ||
        (task.description ?? "").toLowerCase().includes(term) ||
        (task.project?.name ?? "").toLowerCase().includes(term)
      );
    });
  }, [tasks, owner, status, search, user?.id]);

  const counts = useMemo(() => {
    const open = tasks.filter((t) => t.status !== "klaar");
    return {
      open: open.length,
      overdue: open.filter((t) => (daysUntil(t.due_date) ?? 1) < 0).length,
      mine: open.filter((t) => t.assigned_to === user?.id).length,
    };
  }, [tasks, user?.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Taken</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {counts.open} openstaand · {counts.mine} van jou
            {counts.overdue > 0 && <span className="text-rose-600 dark:text-rose-400"> · {counts.overdue} te laat</span>}
          </p>
        </div>
        <Button disabled={isPending} onClick={() => void createTask(null)}>
          <Plus className="h-4 w-4" />
          Nieuwe taak
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Zoek in taken"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={owner} onValueChange={setOwner}>
          <SelectTrigger className="w-[190px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iedereen">Iedereen</SelectItem>
            <SelectItem value="ik">Mijn taken</SelectItem>
            <SelectItem value="niemand">Niet toegewezen</SelectItem>
            {team
              .filter((m) => m.user_id !== user?.id)
              .map((m) => (
                <SelectItem key={m.user_id} value={m.user_id}>
                  {m.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Openstaand</SelectItem>
            <SelectItem value="alle">Alles</SelectItem>
            {TASK_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {TASK_STATUS[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {visible.length} {visible.length === 1 ? "taak" : "taken"}
          </CardTitle>
          <CardDescription>Urgent bovenaan, daarna op deadline. Afgevinkt werk zakt naar beneden.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Taken laden…</p>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="Geen taken gevonden"
              description={tasks.length === 0 ? "Maak je eerste taak aan." : "Pas de filters aan."}
            />
          ) : (
            <TaskList tasks={visible} team={team} />
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default Tasks;
