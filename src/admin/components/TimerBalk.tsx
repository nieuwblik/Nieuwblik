import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Clock, Play, Square } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { hoofdtaken } from "@/admin/constants";
import { useProjects, useTasks } from "@/admin/queries";
import {
  formatKlok,
  isNietGeactiveerd,
  projectNaam,
  useLopendeTimer,
  useNu,
  useSaveUren,
  useStartTimer,
  useStopTimer,
} from "@/admin/uren";

/** Radix Select verdraagt geen lege waarde als item. */
const GEEN = "__geen__";

interface Keuze {
  projectId: string | null;
  taskId: string | null;
  omschrijving: string;
}

/**
 * De timer in de bovenbalk: waaraan je werkt, hoe lang al, en één knop om te
 * starten of te stoppen. Loopt er een timer, dan pas je hier ook aan waar hij
 * op staat; dat schrijft meteen door naar de lopende regel.
 *
 * Bestaat de urentabel nog niet (migratie niet uitgevoerd), dan verdwijnt de
 * timer stil uit de balk in plaats van een fout te tonen.
 */
const TimerBalk = () => {
  const { data: lopend, isError, error } = useLopendeTimer();
  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const start = useStartTimer();
  const stop = useStopTimer();
  const save = useSaveUren();
  const nu = useNu(Boolean(lopend));
  const [open, setOpen] = useState(false);
  const [keuze, setKeuze] = useState<Keuze>({
    projectId: null,
    taskId: null,
    omschrijving: "",
  });

  // Loopt er een timer, dan toont het keuzemenu waar die op staat.
  useEffect(() => {
    if (!open || !lopend) return;
    setKeuze({
      projectId: lopend.project_id,
      taskId: lopend.task_id,
      omschrijving: lopend.description ?? "",
    });
  }, [open, lopend]);

  const openTaken = useMemo(
    () =>
      hoofdtaken(tasks)
        .filter(
          (t) =>
            t.status !== "klaar" &&
            (!keuze.projectId || t.project_id === keuze.projectId),
        )
        .slice(0, 50),
    [tasks, keuze.projectId],
  );

  if (isError && isNietGeactiveerd(error)) return null;

  const gekozenProject = projects.find((p) => p.id === keuze.projectId);
  const gekozenTaak = tasks.find((t) => t.id === keuze.taskId);
  const label = lopend
    ? (lopend.task?.title ??
      (lopend.project ? projectNaam(lopend) : lopend.description) ??
      "Timer loopt")
    : (gekozenTaak?.title ??
      gekozenProject?.client?.name ??
      gekozenProject?.name ??
      "Waar werk je aan?");

  const waarden = () => ({
    project_id: keuze.projectId,
    task_id: keuze.taskId,
    description: keuze.omschrijving.trim() || null,
  });

  const startOfStop = async () => {
    try {
      if (lopend) {
        await stop.mutateAsync(lopend);
        toast.success("Timer gestopt");
      } else {
        await start.mutateAsync(waarden());
      }
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Dat lukte niet");
    }
  };

  const bewaarKeuze = async () => {
    setOpen(false);
    if (!lopend) return;
    try {
      await save.mutateAsync({ id: lopend.id, values: waarden() });
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Bijwerken mislukt");
    }
  };

  const seconden = lopend
    ? (nu - new Date(lopend.started_at).getTime()) / 1000
    : 0;

  return (
    <div className="flex h-10 shrink-0 items-center gap-1 rounded-xl border border-border bg-muted/60 p-1">
      <Popover
        open={open}
        onOpenChange={(waarde) => (waarde ? setOpen(true) : void bewaarKeuze())}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className="hidden h-8 min-w-0 max-w-56 items-center gap-2 rounded-lg px-2 text-sm transition-colors hover:bg-background md:flex"
          >
            {/* Loopt de timer, dan een kloppende stip in plaats van de klok: je
                ziet vanuit je ooghoek dat er tijd wordt geschreven. */}
            {lopend ? (
              <span
                className="p-puls mx-1 h-2 w-2 shrink-0 rounded-full bg-success"
                aria-hidden="true"
              />
            ) : (
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span
              className={cn(
                "truncate",
                !lopend &&
                  !keuze.projectId &&
                  !keuze.taskId &&
                  "text-muted-foreground",
              )}
            >
              {label}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 space-y-3 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-normal text-muted-foreground">
              Project
            </Label>
            <Select
              value={keuze.projectId ?? GEEN}
              onValueChange={(v) =>
                setKeuze((k) => ({
                  ...k,
                  projectId: v === GEEN ? null : v,
                  taskId: null,
                }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GEEN}>Zonder project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.client?.name ?? p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-normal text-muted-foreground">
              Taak
            </Label>
            <Select
              value={keuze.taskId ?? GEEN}
              onValueChange={(v) => {
                const taak = tasks.find((t) => t.id === v);
                setKeuze((k) => ({
                  ...k,
                  taskId: v === GEEN ? null : v,
                  projectId: taak?.project_id ?? k.projectId,
                }));
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GEEN}>Geen taak</SelectItem>
                {openTaken.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="timer-omschrijving"
              className="text-xs font-normal text-muted-foreground"
            >
              Omschrijving
            </Label>
            <Input
              id="timer-omschrijving"
              value={keuze.omschrijving}
              onChange={(e) =>
                setKeuze((k) => ({ ...k, omschrijving: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") void bewaarKeuze();
              }}
              placeholder="Waar werk je aan?"
              maxLength={500}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {lopend
              ? "Wijzigingen gelden voor de lopende timer."
              : "Start de timer met de knop in de balk."}
          </p>
        </PopoverContent>
      </Popover>

      <span
        className={cn(
          "hidden rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[13px] tabular-nums sm:block",
          !lopend && "text-muted-foreground",
        )}
        aria-label={
          lopend ? `Timer loopt: ${formatKlok(seconden)}` : "Timer staat stil"
        }
      >
        {formatKlok(seconden)}
      </span>

      {/* Zoals de andere icoonknoppen in de bovenbalk: geen eigen vlak, alleen
          het icoon in kleur (groen om te starten, rood zolang hij loopt) en
          bij hover hetzelfde grijze vlak. */}
      <button
        type="button"
        onClick={() => void startOfStop()}
        disabled={start.isPending || stop.isPending}
        title={lopend ? "Timer stoppen" : "Timer starten"}
        aria-label={lopend ? "Timer stoppen" : "Timer starten"}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-90 disabled:opacity-50",
          lopend
            ? "text-danger-ink"
            : "text-accent dark:text-[hsl(160_60%_55%)]",
        )}
      >
        {lopend ? (
          <Square className="h-2.5 w-2.5 fill-current" />
        ) : (
          <Play className="ml-px h-3 w-3 fill-current" />
        )}
      </button>
    </div>
  );
};

export default TimerBalk;
