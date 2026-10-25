import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";
import { TASK_STATUS, TOON, hoofdtaken, type TaskStatus } from "@/admin/constants";
import { useTasks } from "@/admin/queries";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";

const OPEN: TaskStatus[] = ["todo", "bezig", "wacht"];

/**
 * Hoe het openstaande werk verdeeld is: wat nog moet, wat loopt en wat op de
 * klant wacht. Eén balk leest sneller dan drie losse getallen. Afgerond werk
 * staat in de kaart Afgerond werk, per week en per persoon.
 */
const TaakoverzichtKaart = ({ className }: { className?: string }) => {
  const { data: tasks = [] } = useTasks();

  const rijen = useMemo(() => {
    const eigen = hoofdtaken(tasks);
    return OPEN.map((status) => ({ status, aantal: eigen.filter((t) => t.status === status).length }));
  }, [tasks]);

  const totaal = rijen.reduce((som, r) => som + r.aantal, 0);

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/taken?status=open">Bekijk taken</PanelFooter>}>
      <PanelHeader icon={ListChecks} titel="Taakoverzicht" subtitel={`${totaal} open, per status`} />
      <PanelBody>
        <div className="flex h-3 gap-1" aria-hidden="true">
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

        <ul className="mt-3 space-y-0.5">
          {rijen.map(({ status, aantal }) => (
            <li key={status}>
              <Link
                to={`/admin/taken?status=${status}`}
                className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm p-rij"
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", TOON[TASK_STATUS[status].toon].stip)} />
                <span className="flex-1">{TASK_STATUS[status].label}</span>
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
