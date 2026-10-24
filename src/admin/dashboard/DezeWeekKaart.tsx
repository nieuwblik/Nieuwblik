import { useMemo } from "react";
import { Link } from "react-router-dom";
import { addDays, format, isToday, startOfWeek } from "date-fns";
import { nl } from "date-fns/locale";
import { CalendarDays, FolderKanban } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACCENT, ACTIVE_PROJECT_STATUSES, hoofdtaken } from "@/admin/constants";
import { useProjects, useTasks } from "@/admin/queries";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";

interface Item {
  key: string;
  to: string;
  titel: string;
  /** Streepje links: de prioriteitskleur van een taak, of het accent voor een projectdeadline. */
  streep: string;
  project?: boolean;
}

const MAX_ITEMS = 6;

/**
 * De week van maandag tot en met zondag: taken met een deadline en
 * opleverdata van lopende projecten. Werk dat al over de datum is staat in
 * Vraagt aandacht en in de begroeting, niet nog een keer hier.
 */
const DezeWeekKaart = ({ className }: { className?: string }) => {
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();

  const { dagen } = useMemo(() => {
    const maandag = startOfWeek(new Date(), { weekStartsOn: 1 });
    const open = hoofdtaken(tasks).filter((t) => t.status !== "klaar");

    const dagen = Array.from({ length: 7 }, (_, i) => {
      const datum = addDays(maandag, i);
      const sleutel = format(datum, "yyyy-MM-dd");
      const items: Item[] = [
        ...projects
          .filter((p) => p.deadline === sleutel && ACTIVE_PROJECT_STATUSES.includes(p.status))
          .map((p) => ({
            key: `p-${p.id}`,
            to: `/admin/projecten/${p.id}`,
            titel: `Oplevering ${p.client?.name ?? p.name}`,
            streep: "bg-accent",
            project: true,
          })),
        ...open
          .filter((t) => t.due_date?.slice(0, 10) === sleutel)
          .map((t) => ({
            key: t.id,
            to: `/admin/taken/${t.id}`,
            titel: t.title,
            streep: ACCENT[t.priority].balk,
          })),
      ];
      return { datum, sleutel, items };
    });

    return { dagen };
  }, [tasks, projects]);

  // Alleen dagen met iets erop in de lijst; de strook erboven laat de hele week zien.
  let ruimte = MAX_ITEMS;
  const lijst = dagen
    .filter((d) => d.items.length > 0)
    .map((d) => {
      const items = d.items.slice(0, Math.max(ruimte, 0));
      ruimte -= items.length;
      return { ...d, items };
    })
    .filter((d) => d.items.length > 0);
  const totaal = dagen.reduce((som, d) => som + d.items.length, 0);
  const getoond = lijst.reduce((som, d) => som + d.items.length, 0);

  return (
    <Panel
      className={className}
      footer={
        <PanelFooter to="/admin/kalender" extra={totaal > getoond ? `Nog ${totaal - getoond} deze week` : undefined}>
          Bekijk de kalender
        </PanelFooter>
      }
    >
      <PanelHeader icon={CalendarDays} titel="Deze week" subtitel="Deadlines en opleveringen" />
      <PanelBody className="space-y-4">
        {/* Weekstrook: elke dag een knop naar die dag in de kalender. */}
        <ol className="grid grid-cols-7 gap-1">
          {dagen.map((dag) => {
            const vandaag = isToday(dag.datum);
            return (
              <li key={dag.sleutel}>
                <Link
                  to={`/admin/kalender?dag=${dag.sleutel}`}
                  aria-label={`${format(dag.datum, "EEEE d MMMM", { locale: nl })}: ${dag.items.length} gepland`}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border py-2 transition-colors duration-150",
                    vandaag ? "border-accent/40 bg-accent/10" : "border-transparent hover:bg-muted/60",
                  )}
                >
                  <span className="text-xs text-muted-foreground">{format(dag.datum, "EEEEEE", { locale: nl })}</span>
                  <span className={cn("text-sm tabular-nums", vandaag && "font-semibold")}>{format(dag.datum, "d")}</span>
                  <span className="flex h-1.5 items-center gap-0.5" aria-hidden="true">
                    {dag.items.slice(0, 3).map((item) => (
                      <span key={item.key} className={cn("h-1.5 w-1.5 rounded-full", item.streep)} />
                    ))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        {lijst.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">Geen deadlines deze week.</p>
        ) : (
          <div className="space-y-3">
            {lijst.map((dag) => (
              <div key={dag.sleutel}>
                <p className="mb-1 text-[13px] text-muted-foreground first-letter:uppercase">
                  {isToday(dag.datum) ? "Vandaag" : format(dag.datum, "EEEE d MMMM", { locale: nl })}
                </p>
                <ul className="space-y-0.5">
                  {dag.items.map((item) => (
                    <li key={item.key}>
                      <Link
                        to={item.to}
                        className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-muted/60"
                      >
                        <span className={cn("h-4 w-0.5 shrink-0 rounded-full", item.streep)} aria-hidden="true" />
                        {item.project && <FolderKanban className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                        <span className="truncate">{item.titel}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </PanelBody>
    </Panel>
  );
};

export default DezeWeekKaart;
