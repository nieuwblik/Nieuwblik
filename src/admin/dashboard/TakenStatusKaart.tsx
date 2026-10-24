import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { subDays } from "date-fns";
import { ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";
import { TASK_STATUS, TOON, hoofdtaken, type TaskStatus } from "@/admin/constants";
import { useTasks } from "@/admin/queries";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";

const OPEN_STATUSSEN: TaskStatus[] = ["todo", "bezig", "wacht"];

type Periode = "7d" | "1m";

/**
 * Hoe het open werk verdeeld is: nog te doen, bezig, of wachtend op de
 * klant. Eén gestapelde balk leest sneller dan drie losse getallen, en
 * "wacht" valt op omdat je daar zelf niets mee kunt behalve navragen.
 */
const TakenStatusKaart = () => {
  const { data: tasks = [] } = useTasks();
  const [periode, setPeriode] = useState<Periode>("7d");

  const { perStatus, totaal, afgerond } = useMemo(() => {
    const eigen = hoofdtaken(tasks);
    const perStatus = OPEN_STATUSSEN.map((status) => ({
      status,
      aantal: eigen.filter((t) => t.status === status).length,
    }));
    const vanaf = subDays(new Date(), periode === "7d" ? 7 : 30).toISOString();
    return {
      perStatus,
      totaal: perStatus.reduce((som, s) => som + s.aantal, 0),
      afgerond: eigen.filter((t) => t.status === "klaar" && (t.completed_at ?? "") >= vanaf).length,
    };
  }, [tasks, periode]);

  return (
    <Panel className="md:col-span-3 xl:col-span-4">
      <PanelHeader icon={ListChecks} titel="Taken per status" subtitel={`${totaal} open`} />
      <PanelBody className="space-y-4">
        {totaal > 0 ? (
          <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            {perStatus.map(({ status, aantal }) =>
              aantal > 0 ? (
                <span
                  key={status}
                  className={cn("h-full border-r-2 border-card last:border-r-0", TOON[TASK_STATUS[status].toon].stip)}
                  style={{ width: `${(aantal / totaal) * 100}%` }}
                />
              ) : null,
            )}
          </div>
        ) : (
          <div className="h-2.5 rounded-full bg-muted" aria-hidden="true" />
        )}

        <ul className="space-y-0.5">
          {perStatus.map(({ status, aantal }) => (
            <li key={status}>
              <Link
                to={`/admin/taken?status=${status}`}
                className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-muted/60"
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", TOON[TASK_STATUS[status].toon].stip)} />
                <span className="flex-1">{TASK_STATUS[status].label}</span>
                <span className="tabular-nums text-muted-foreground">{aantal}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <Link to="/admin/taken?status=klaar" className="text-sm hover:underline">
            <span className="font-medium tabular-nums">{afgerond}</span>{" "}
            <span className="text-muted-foreground">afgerond</span>
          </Link>
          <SegmentedControl
            label="Periode voor afgerond"
            waarde={periode}
            onChange={setPeriode}
            opties={[
              { waarde: "7d", label: "7 dagen" },
              { waarde: "1m", label: "30 dagen" },
            ]}
          />
        </div>
      </PanelBody>
      <PanelFooter to="/admin/taken?status=open">Alle taken</PanelFooter>
    </Panel>
  );
};

export default TakenStatusKaart;
