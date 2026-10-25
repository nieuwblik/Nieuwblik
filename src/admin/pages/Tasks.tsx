import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckSquare, ListTodo, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/admin/components/EmptyState";
import TaskList from "@/admin/components/TaskList";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { TASK_STATUS, TASK_STATUS_ORDER, TOON, isTeLaat, type TaskStatus } from "@/admin/constants";
import { useTasks, useTeam } from "@/admin/queries";
import { useTaakTellingen } from "@/admin/stats";
import { useCreateTask } from "@/admin/useCreateTask";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import { cn } from "@/lib/utils";

type StatusFilter = TaskStatus | "open" | "alle";
/** Extra filters die vanaf het dashboard en het belletje binnenkomen. */
type Extra = "te-laat" | "zonder-klant" | null;

const EXTRA_LABEL: Record<Exclude<Extra, null>, string> = {
  "te-laat": "Te laat",
  "zonder-klant": "Zonder klant",
};

/**
 * Alle taken met zoeken en filters. De filters staan in de URL, zodat elke
 * link van het dashboard ("3 te laat", "Bezig") precies de lijst opent die
 * erachter zit, en een gefilterde weergave te delen of te bookmarken is.
 */
const Tasks = () => {
  const { user } = useAdminAuth();
  const { data: tasks = [], isLoading } = useTasks();
  const { data: team = [] } = useTeam();
  const tellingen = useTaakTellingen();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { createTask, isPending } = useCreateTask();

  const statusParam = searchParams.get("status");
  // Standaard alles: de lijst zet afgerond werk zelf in een opgevouwen vak,
  // dus vooraf filteren zou dat vak permanent leeg houden.
  const status: StatusFilter =
    statusParam === "open" || statusParam === "alle" || TASK_STATUS_ORDER.includes(statusParam as TaskStatus)
      ? (statusParam as StatusFilter)
      : "alle";
  const owner = searchParams.get("wie") ?? "iedereen";
  const extraParam = searchParams.get("filter");
  const extra: Extra = extraParam === "te-laat" || extraParam === "zonder-klant" ? extraParam : null;

  const zet = (sleutel: string, waarde: string | null) => {
    const volgende = new URLSearchParams(searchParams);
    if (waarde === null) volgende.delete(sleutel);
    else volgende.set(sleutel, waarde);
    setSearchParams(volgende, { replace: true });
  };

  // Oude links met { nieuw: true } in de state maken nog steeds een taak aan,
  // maar één keer: de state wordt via de router gewist en een ref vangt een
  // tweede render op. Eerder kon hier een tweede lege taak ontstaan.
  const aangemaakt = useRef(false);
  useEffect(() => {
    if (!(location.state as { nieuw?: boolean } | null)?.nieuw || aangemaakt.current) return;
    aangemaakt.current = true;
    navigate(location.pathname + location.search, { replace: true, state: null });
    void createTask(null);
  }, [location.state, location.pathname, location.search, navigate, createTask]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (status === "open" && task.status === "klaar") return false;
      if (status !== "open" && status !== "alle" && task.status !== status) return false;

      if (extra === "te-laat" && !isTeLaat(task)) return false;
      if (extra === "zonder-klant" && (task.project_id || task.client_id)) return false;

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
  }, [tasks, owner, status, extra, search, user?.id]);

  // Hoofdtaken, net als de lijst zelf: stappen staan op de pagina van hun taak.
  const zichtbaarAantal = visible.filter((t) => !t.parent_task_id).length;

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 lg:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl tracking-tight">Taken</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tellingen.open.length} open · {tellingen.mijn.length} van jou
            {tellingen.teLaat.length > 0 && (
              <span className={TOON.danger.tekst}> · {tellingen.teLaat.length} te laat</span>
            )}
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
            className="bg-card pl-9"
            placeholder="Zoek in taken"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={owner} onValueChange={(v) => zet("wie", v === "iedereen" ? null : v)}>
          <SelectTrigger className="w-[190px] bg-card">
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
        <Select value={status} onValueChange={(v) => zet("status", v === "alle" ? null : v)}>
          <SelectTrigger className="w-[170px] bg-card">
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

      {/* Een filter van buitenaf (het belletje, een dashboardkaart) staat er
          zichtbaar bij, met een kruisje om het los te laten. */}
      {extra && (
        <div>
          <button
            type="button"
            onClick={() => zet("filter", null)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium transition-colors hover:opacity-80",
              extra === "te-laat" ? TOON.danger.pil : TOON.neutral.pil,
            )}
          >
            {EXTRA_LABEL[extra]}
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Filter weghalen</span>
          </button>
        </div>
      )}

      <Panel>
        <PanelHeader
          icon={ListTodo}
          titel={`${zichtbaarAantal} ${zichtbaarAantal === 1 ? "taak" : "taken"}`}
          subtitel="Urgent bovenaan, daarna op deadline. Afgevinkt werk zakt naar beneden."
        />
        <PanelBody>
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <TaskList
              tasks={visible}
              team={team}
              empty={
                <EmptyState
                  compact
                  icon={CheckSquare}
                  title="Geen taken gevonden"
                  description={tasks.length === 0 ? "Maak je eerste taak aan." : "Pas de filters aan."}
                  action={
                    tasks.length === 0 ? (
                      <Button disabled={isPending} onClick={() => void createTask(null)}>
                        <Plus className="h-4 w-4" />
                        Nieuwe taak
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setSearchParams({}, { replace: true })}>
                        Filters wissen
                      </Button>
                    )
                  }
                />
              }
            />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
};

export default Tasks;
