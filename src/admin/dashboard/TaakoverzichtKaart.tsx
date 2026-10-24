import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { subDays } from "date-fns";
import { ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";
import { TASK_STATUS, TOON, hoofdtaken, type TaskStatus } from "@/admin/constants";
import { useTasks } from "@/admin/queries";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";

type Periode = "1d" | "7d" | "1m";

const DAGEN: Record<Periode, number> = { "1d": 1, "7d": 7, "1m": 30 };

/**
 * Hoe al het werk verdeeld is: wat nog moet, wat loopt, wat op de klant
 * wacht, en wat er in de gekozen periode is afgerond. Eén dikke balk leest
 * sneller dan vier losse getallen.
 */
const TaakoverzichtKaart = ({ className }: { className?: string }) => {
  const { data: tasks = [] } = useTasks();
  const [periode, setPeriode] = useState<Periode>("7d");

  const rijen = useMemo(() => {
    const eigen = hoofdtaken(tasks);
    const vanaf = subDays(new Date(), DAGEN[periode]).toISOString();
    const statussen: TaskStatus[] = ["todo", "bezig", "wacht", "klaar"];
    return statussen.map((status) => ({
      status,
      aantal:
        status === "klaar"
          ? eigen.filter((t) => t.status === "klaar" && (t.completed_at ?? "") >= vanaf).length
          : eigen.filter((t) => t.status === status).length,
    }));
  }, [tasks, periode]);

  const totaal = rijen.reduce((som, r) => som + r.aantal, 0);

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/taken?status=open">Bekijk taken</PanelFooter>}>
      <PanelHeader
        icon={ListChecks}
        titel="Taakoverzicht"
        subtitel="Open en afgerond werk"
        actie={
          <SegmentedControl
            label="Periode voor afgerond"
            waarde={periode}
            onChange={setPeriode}
            opties={[
              { waarde: "1d", label: "1d" },
              { waarde: "7d", label: "7d" },
              { waarde: "1m", label: "1m" },
            ]}
          />
        }
      />
      <PanelBody>
        <p className="text-lg font-medium">
          Taken <span className="text-muted-foreground">({totaal})</span>
        </p>

        <div className="mt-3 flex h-3 gap-1" aria-hidden="true">
          {totaal === 0 ? (
            <span className="flex-1 rounded-full bg-muted" />
          ) : (
            rijen
              .filter((r) => r.aantal > 0)
              .map((r) => (
                <span
                  key={r.status}
                  className={cn("p-groei-x rounded-full", TOON[TASK_STATUS[r.status].toon].stip)}
                  style={{ flexGrow: r.aantal, flexBasis: 0 }}
                />
              ))
          )}
        </div>

        <ul className="mt-4 space-y-0.5">
          {rijen.map(({ status, aantal }) => (
            <li key={status}>
              <Link
                to={`/admin/taken?status=${status}`}
                className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm p-rij"
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", TOON[TASK_STATUS[status].toon].stip)} />
                <span className="flex-1">
                  {status === "klaar" ? `Afgerond (${periode === "1d" ? "vandaag" : periode === "7d" ? "7 dagen" : "30 dagen"})` : TASK_STATUS[status].label}
                </span>
                <span className="tabular-nums">
                  <span className="font-medium">{aantal}</span>{" "}
                  <span className="text-muted-foreground">{aantal === 1 ? "taak" : "taken"}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PanelBody>
    </Panel>
  );
};

export default TaakoverzichtKaart;
