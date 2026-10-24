import { useMemo, useState } from "react";
import { startOfWeek } from "date-fns";
import { Clock, Play, Square } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import UrenExport from "@/admin/components/UrenExport";
import { TOON, hoofdtaken } from "@/admin/constants";
import { useTasks } from "@/admin/queries";
import {
  duurMinuten,
  formatDuur,
  formatKlok,
  isNietGeactiveerd,
  projectNaam,
  useLopendeTimer,
  useNu,
  useStartTimer,
  useStopTimer,
  useUrenVan,
} from "@/admin/uren";

const GEEN = "__geen__";

/**
 * De timer op de klantpagina, vast gekoppeld aan dit project: starten zet de
 * uren meteen op deze klant, zonder eerst een project te kiezen. Eronder de
 * uren van deze week en in totaal, en de export van alle uren van dit project.
 *
 * Loopt je timer op een ander project, dan staat dat erbij; starten hier
 * stopt die eerst (er loopt er altijd maar één).
 */
const ProjectTimer = ({ projectId, naam }: { projectId: string; naam: string }) => {
  const { data: lopend } = useLopendeTimer();
  const { data: regels = [], isError, error } = useUrenVan("project", projectId);
  const { data: tasks = [] } = useTasks();
  const start = useStartTimer();
  const stop = useStopTimer();
  const [omschrijving, setOmschrijving] = useState("");
  const [taakId, setTaakId] = useState<string>(GEEN);

  const looptHier = lopend?.project_id === projectId;
  const nu = useNu(looptHier);

  const openTaken = useMemo(
    () => hoofdtaken(tasks).filter((t) => t.project_id === projectId && t.status !== "klaar"),
    [tasks, projectId],
  );

  const { week, totaal } = useMemo(() => {
    const maandag = startOfWeek(new Date(), { weekStartsOn: 1 });
    return {
      week: regels.filter((r) => new Date(r.started_at) >= maandag).reduce((som, r) => som + duurMinuten(r, nu), 0),
      totaal: regels.reduce((som, r) => som + duurMinuten(r, nu), 0),
    };
  }, [regels, nu]);

  if (isError && isNietGeactiveerd(error)) return null;

  const klik = async () => {
    try {
      if (looptHier && lopend) {
        await stop.mutateAsync(lopend);
        toast.success("Timer gestopt");
      } else {
        await start.mutateAsync({
          project_id: projectId,
          task_id: taakId === GEEN ? null : taakId,
          description: omschrijving.trim() || null,
        });
        setOmschrijving("");
        setTaakId(GEEN);
      }
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Dat lukte niet");
    }
  };

  const seconden = looptHier && lopend ? (nu - new Date(lopend.started_at).getTime()) / 1000 : 0;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3">
      <div className="flex items-center gap-2.5">
        {looptHier ? (
          <span className="p-puls mx-1 h-2 w-2 shrink-0 rounded-full bg-success" aria-hidden="true" />
        ) : (
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {looptHier ? (lopend?.task?.title ?? lopend?.description ?? `Bezig voor ${naam}`) : "Uren"}
        </span>
        <span
          className={cn(
            "rounded-md border border-border bg-background px-2 py-0.5 text-[13px] tabular-nums",
            !looptHier && "text-muted-foreground",
          )}
        >
          {formatKlok(seconden)}
        </span>
        <Button
          size="icon"
          onClick={() => void klik()}
          disabled={start.isPending || stop.isPending}
          title={looptHier ? "Timer stoppen" : `Timer starten voor ${naam}`}
          aria-label={looptHier ? "Timer stoppen" : `Timer starten voor ${naam}`}
          className={cn(
            "h-8 w-8 rounded-lg",
            looptHier ? "bg-danger text-white hover:bg-danger/90" : "bg-accent text-accent-foreground hover:bg-accent/90",
          )}
        >
          {looptHier ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
        </Button>
      </div>

      {/* Waaraan, voordat je start. Loopt de timer hier, dan staat dat al in de kop. */}
      {!looptHier && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={omschrijving}
            onChange={(e) => setOmschrijving(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void klik();
            }}
            placeholder="Waar werk je aan?"
            maxLength={500}
            className="h-9 bg-background text-sm"
            aria-label="Omschrijving"
          />
          {openTaken.length > 0 && (
            <Select value={taakId} onValueChange={setTaakId}>
              <SelectTrigger className="h-9 bg-background text-sm sm:w-44" aria-label="Taak">
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
          )}
        </div>
      )}

      {lopend && !looptHier && (
        <p className={cn("text-[13px]", TOON.warning.tekst)}>
          Je timer loopt nu op {projectNaam(lopend)}. Starten hier stopt die.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[13px] text-muted-foreground">
        <span>
          Deze week <span className="font-medium text-foreground tabular-nums">{formatDuur(week)}</span>
          {" · "}
          Totaal <span className="font-medium text-foreground tabular-nums">{formatDuur(totaal)}</span>
        </span>
        <UrenExport projectId={projectId} naam={naam} variant="klein" />
      </div>
    </div>
  );
};

export default ProjectTimer;
