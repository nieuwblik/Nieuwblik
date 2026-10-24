import { useMemo, useState } from "react";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { Activity } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTasks } from "@/admin/queries";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";

type Periode = "1d" | "7d" | "1m";

const DAGEN: Record<Periode, number> = { "1d": 1, "7d": 7, "1m": 30 };

interface Ring {
  label: string;
  /** Tailwind-tekstkleur; de ring gebruikt currentColor. */
  kleur: string;
  streep: string;
  deel: number;
  geheel: number;
}

/**
 * Drie verhoudingen in één blik, als ringen om elkaar heen:
 *
 * - Taken: afgerond in de periode tegenover afgerond plus wat nog openstaat.
 * - Stappen: hetzelfde voor de stappen binnen taken.
 * - Deadlines: van de deadlines die in de periode vielen, hoeveel er gehaald
 *   zijn (afgevinkt op of voor de dag zelf).
 */
const WerkactiviteitKaart = ({ className }: { className?: string }) => {
  const { data: tasks = [] } = useTasks();
  const [periode, setPeriode] = useState<Periode>("7d");

  const ringen = useMemo<Ring[]>(() => {
    const vandaag = endOfDay(new Date());
    const van = startOfDay(subDays(new Date(), DAGEN[periode] - 1));
    const inPeriode = (iso: string | null) => Boolean(iso) && new Date(iso!) >= van && new Date(iso!) <= vandaag;

    const verhouding = (lijst: typeof tasks) => {
      const afgerond = lijst.filter((t) => t.status === "klaar" && inPeriode(t.completed_at)).length;
      const open = lijst.filter((t) => t.status !== "klaar").length;
      return { deel: afgerond, geheel: afgerond + open };
    };

    const hoofd = tasks.filter((t) => !t.parent_task_id);
    const stappen = tasks.filter((t) => t.parent_task_id);

    const metDeadline = hoofd.filter((t) => t.due_date && inPeriode(`${t.due_date.slice(0, 10)}T12:00:00`));
    const gehaald = metDeadline.filter(
      (t) => t.status === "klaar" && t.completed_at && t.completed_at.slice(0, 10) <= t.due_date!.slice(0, 10),
    ).length;

    return [
      { label: "Taken", kleur: "text-accent", streep: "bg-accent", ...verhouding(hoofd) },
      { label: "Stappen", kleur: "text-info", streep: "bg-info", ...verhouding(stappen) },
      { label: "Deadlines gehaald", kleur: "text-warning", streep: "bg-warning", deel: gehaald, geheel: metDeadline.length },
    ];
  }, [tasks, periode]);

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/taken?status=klaar">Bekijk afgerond werk</PanelFooter>}>
      <PanelHeader
        icon={Activity}
        titel="Werkactiviteit"
        subtitel="Afgerond werk en gehaalde deadlines"
        actie={
          <SegmentedControl
            label="Periode"
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
      <PanelBody className="flex items-center gap-4">
        <ul className="flex-1 space-y-3">
          {ringen.map((ring) => (
            <li key={ring.label} className="flex gap-2.5">
              <span className={cn("w-1 shrink-0 rounded-full", ring.streep)} aria-hidden="true" />
              <span>
                <span className="block text-[13px] text-muted-foreground">{ring.label}</span>
                <span className="font-epilogue text-xl font-medium tabular-nums">
                  {ring.geheel === 0 ? (
                    "–"
                  ) : (
                    <>
                      {ring.deel}
                      <span className="text-muted-foreground">/{ring.geheel}</span>
                    </>
                  )}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {/* Drie ringen om één middelpunt, de buitenste voor taken. */}
        <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0 -rotate-90" aria-hidden="true">
          {ringen.map((ring, i) => {
            const straal = 52 - i * 13;
            const omtrek = 2 * Math.PI * straal;
            const deel = ring.geheel > 0 ? ring.deel / ring.geheel : 0;
            return (
              <g key={ring.label} className={ring.kleur}>
                <circle cx="60" cy="60" r={straal} fill="none" strokeWidth="8" className="stroke-muted" />
                {deel > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r={straal}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    strokeDasharray={`${deel * omtrek} ${omtrek}`}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </PanelBody>
    </Panel>
  );
};

export default WerkactiviteitKaart;
