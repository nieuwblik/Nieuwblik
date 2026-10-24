import { Play, Square } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  duurMinuten,
  formatDuur,
  isNietGeactiveerd,
  useLopendeTimer,
  useNu,
  useStartTimer,
  useStopTimer,
  useUrenVan,
} from "@/admin/uren";

/**
 * Bij een taak: hoeveel tijd erin zit en een knop om de timer voor deze taak
 * te starten of te stoppen. Loopt de timer op een andere taak, dan stopt die
 * bij het starten vanzelf.
 */
const TaakTimer = ({ taskId, projectId }: { taskId: string; projectId: string | null }) => {
  const { data: regels = [], isError, error } = useUrenVan("taak", taskId);
  const { data: lopend } = useLopendeTimer();
  const start = useStartTimer();
  const stop = useStopTimer();
  const loopthier = lopend?.task_id === taskId;
  const nu = useNu(loopthier, 30_000);

  if (isError && isNietGeactiveerd(error)) return null;

  const totaal = regels.reduce((som, r) => som + duurMinuten(r, nu), 0);

  const klik = async () => {
    try {
      if (loopthier && lopend) await stop.mutateAsync(lopend);
      else await start.mutateAsync({ project_id: projectId, task_id: taskId, description: null });
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Dat lukte niet");
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      {totaal > 0 && <span className="hidden text-[13px] tabular-nums text-muted-foreground sm:inline">{formatDuur(totaal)}</span>}
      <Button
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => void klik()}
        disabled={start.isPending || stop.isPending}
      >
        {loopthier ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
        {loopthier ? "Timer stoppen" : "Timer starten"}
      </Button>
    </div>
  );
};

export default TaakTimer;
