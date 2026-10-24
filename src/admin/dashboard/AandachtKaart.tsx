import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CircleCheck, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import { PRIORITY_WEIGHT, PROJECT_STATUS, TOON, hoofdtaken, isTeLaat, type Priority } from "@/admin/constants";
import { deadlineLabel } from "@/admin/format";
import { useCombinedRows } from "@/admin/rows";
import { useTasks } from "@/admin/queries";
import Avatar from "@/admin/ui/Avatar";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";
import { Skeleton } from "@/components/ui/skeleton";

const MAX = 6;

interface Regel {
  key: string;
  to: string;
  naam: string;
  slug: string | null;
  fase: string | null;
  open: number;
  teLaat: number;
  urgentie: Priority | null;
  /** Vroegste deadline onder de open taken. */
  deadline: string | null;
  intern?: boolean;
}

/**
 * Waar nu werk ligt, het dringendste eerst: te laat, dan urgent, dan de
 * vroegste deadline. Een compacte lijst in plaats van grote kaarten, zodat
 * zes klanten in één blik passen.
 *
 * Losse taken zonder klant staan er als eigen regel bij. Daar zit vaak juist
 * het werk dat over de datum is (administratie, facturen), en dat viel
 * eerder buiten dit blok.
 */
const AandachtKaart = () => {
  const { rows, isLoading } = useCombinedRows();
  const { data: tasks = [] } = useTasks();

  const regels = useMemo<Regel[]>(() => {
    const open = hoofdtaken(tasks).filter((t) => t.status !== "klaar");

    // Vroegste deadline per project, om per klant te tonen wat het eerst moet.
    const eersteDeadline = new Map<string, string>();
    for (const taak of open) {
      if (!taak.project_id || !taak.due_date) continue;
      const huidig = eersteDeadline.get(taak.project_id);
      if (!huidig || taak.due_date < huidig) eersteDeadline.set(taak.project_id, taak.due_date);
    }

    const klanten: Regel[] = rows
      .filter((row) => row.openTasks > 0)
      .map((row) => {
        const projecten = [row.project, ...row.otherProjects].filter(Boolean);
        const deadlines = projecten
          .map((p) => eersteDeadline.get(p!.id))
          .filter((d): d is string => Boolean(d))
          .sort();
        return {
          key: row.key,
          to: row.to,
          naam: row.client.name,
          slug: row.project?.portfolio_slug ?? null,
          fase: row.status ? PROJECT_STATUS[row.status].label : null,
          open: row.openTasks,
          teLaat: row.teLaat,
          urgentie: row.urgentie,
          deadline: deadlines[0] ?? null,
        };
      });

    const los = open.filter((t) => !t.project_id);
    if (los.length > 0) {
      const teLaat = los.filter((t) => isTeLaat(t)).length;
      klanten.push({
        key: "intern",
        to: teLaat > 0 ? "/admin/taken?filter=te-laat" : "/admin/taken?filter=zonder-klant",
        naam: "Intern, zonder klant",
        slug: null,
        fase: null,
        open: los.length,
        teLaat,
        urgentie: los.reduce<Priority | null>(
          (zwaarste, t) => (!zwaarste || PRIORITY_WEIGHT[t.priority] < PRIORITY_WEIGHT[zwaarste] ? t.priority : zwaarste),
          null,
        ),
        deadline:
          los
            .map((t) => t.due_date)
            .filter((d): d is string => Boolean(d))
            .sort()[0] ?? null,
        intern: true,
      });
    }

    return klanten.sort(
      (a, b) =>
        Number(b.teLaat > 0) - Number(a.teLaat > 0) ||
        PRIORITY_WEIGHT[a.urgentie ?? "laag"] - PRIORITY_WEIGHT[b.urgentie ?? "laag"] ||
        (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999"),
    );
  }, [rows, tasks]);

  const zichtbaar = regels.slice(0, MAX);
  const rest = regels.length - zichtbaar.length;

  return (
    <Panel className="md:col-span-6 xl:col-span-7">
      <PanelHeader
        icon={AlertCircle}
        titel="Vraagt aandacht"
        subtitel="Waar werk openstaat, te laat en urgent eerst"
      />
      <PanelBody className="px-2 pb-2">
        {isLoading ? (
          <div className="space-y-2 px-3 pb-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : zichtbaar.length === 0 ? (
          <EmptyState compact icon={CircleCheck} title="Niets vraagt aandacht" description="Er staat nergens werk open." />
        ) : (
          <ul>
            {zichtbaar.map((regel) => (
              <li key={regel.key}>
                <Link
                  to={regel.to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-muted/60"
                >
                  {regel.intern ? (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Inbox className="h-4 w-4" />
                    </span>
                  ) : (
                    <Avatar naam={regel.naam} slug={regel.slug} maat="md" className="h-9 w-9" />
                  )}

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{regel.naam}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[13px] text-muted-foreground">
                      {regel.fase && <span>{regel.fase}</span>}
                      {regel.fase && <span aria-hidden="true">·</span>}
                      <span>
                        {regel.open} open
                      </span>
                      {regel.teLaat > 0 ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className={cn("font-medium", TOON.danger.tekst)}>{regel.teLaat} te laat</span>
                        </>
                      ) : (
                        regel.deadline && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{deadlineLabel(regel.deadline)}</span>
                          </>
                        )
                      )}
                    </span>
                  </span>

                  {regel.urgentie && <StatusPill kind="priority" value={regel.urgentie} />}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PanelBody>
      <PanelFooter to="/admin/klanten" extra={rest > 0 ? `Nog ${rest} met open werk` : undefined}>
        Alle klanten
      </PanelFooter>
    </Panel>
  );
};

export default AandachtKaart;
