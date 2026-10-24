import { useMemo, useState } from "react";
import { Eye, FolderKanban, Hammer, PenTool, Rocket } from "lucide-react";

import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS_ORDER, TOON, hoofdtaken, type ProjectStatus } from "@/admin/constants";
import { deadlineLabel } from "@/admin/format";
import { useProjects, useTasks } from "@/admin/queries";
import FilterSelect from "@/admin/ui/FilterSelect";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";

const STREEPJES = 44;

/** De productiefases, in de volgorde waarin een project ze doorloopt. */
const FASES: { status: ProjectStatus; label: string; icon: typeof PenTool }[] = [
  { status: "in_ontwerp", label: "Ontwerp", icon: PenTool },
  { status: "in_bouw", label: "Bouw", icon: Hammer },
  { status: "review", label: "Review", icon: Eye },
  { status: "live", label: "Live", icon: Rocket },
];

/**
 * Hoe ver één lopend project is: de balk is het deel van de taken dat klaar
 * is, de regels eronder de fases met waar het project nu staat. Je kiest het
 * project rechtsboven; standaard het lopende project met het meeste open werk.
 */
const ProjectvoortgangKaart = ({ className }: { className?: string }) => {
  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const [gekozenId, setGekozenId] = useState<string | null>(null);

  const { lopend, perProject } = useMemo(() => {
    const eigen = hoofdtaken(tasks);
    const perProject = new Map<string, { klaar: number; totaal: number; open: number }>();
    for (const taak of eigen) {
      if (!taak.project_id) continue;
      const telling = perProject.get(taak.project_id) ?? { klaar: 0, totaal: 0, open: 0 };
      telling.totaal += 1;
      if (taak.status === "klaar") telling.klaar += 1;
      else telling.open += 1;
      perProject.set(taak.project_id, telling);
    }
    const lopend = projects
      .filter((p) => ACTIVE_PROJECT_STATUSES.includes(p.status))
      .sort((a, b) => (perProject.get(b.id)?.open ?? 0) - (perProject.get(a.id)?.open ?? 0));
    return { lopend, perProject };
  }, [projects, tasks]);

  const project = lopend.find((p) => p.id === gekozenId) ?? lopend[0];

  if (!project) {
    return (
      <Panel className={className}>
        <PanelHeader icon={FolderKanban} titel="Projectvoortgang" subtitel="Hoe ver een lopend project is" />
        <PanelBody>
          <EmptyState compact icon={FolderKanban} title="Geen lopende projecten" />
        </PanelBody>
      </Panel>
    );
  }

  const telling = perProject.get(project.id) ?? { klaar: 0, totaal: 0, open: 0 };
  const deel = telling.totaal > 0 ? telling.klaar / telling.totaal : 0;
  const gevuld = Math.round(deel * STREEPJES);
  const huidig = PROJECT_STATUS_ORDER.indexOf(project.status);

  return (
    <Panel
      className={className}
      footer={<PanelFooter to={`/admin/projecten/${project.id}`}>Bekijk project</PanelFooter>}
    >
      <PanelHeader
        icon={FolderKanban}
        titel="Projectvoortgang"
        subtitel="Hoe ver een lopend project is"
        actie={
          lopend.length > 1 ? (
            <FilterSelect
              label="Project"
              waarde={project.id}
              onChange={setGekozenId}
              opties={lopend.map((p) => ({ waarde: p.id, label: p.client?.name ?? p.name }))}
            />
          ) : undefined
        }
      />
      <PanelBody className="space-y-4">
        <div className="flex items-center gap-3">
          {/* Streepjes in plaats van een volle balk: zo telt het oog mee. Het
              gevulde deel loopt op van licht naar vol accent. */}
          <div className="flex h-8 flex-1 items-stretch gap-[3px]" role="img" aria-label={`${Math.round(deel * 100)}% van de taken klaar`}>
            {Array.from({ length: STREEPJES }, (_, i) => (
              <span
                key={i}
                className={cn("flex-1 rounded-full", i >= gevuld ? "bg-muted" : "p-groei-y")}
                style={
                  i < gevuld
                    ? {
                        backgroundColor: `hsl(var(--accent) / ${0.3 + 0.7 * ((i + 1) / gevuld)})`,
                        // Van links naar rechts gevuld, als een balk die oploopt.
                        animationDelay: `${i * 12}ms`,
                      }
                    : undefined
                }
              />
            ))}
          </div>
          <span className="shrink-0 rounded-md border border-accent/25 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            {telling.totaal > 0 ? `${Math.round(deel * 100)}% klaar` : "Geen taken"}
          </span>
        </div>

        <p className="text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">{project.client?.name ?? project.name}</span>
          {telling.totaal > 0 && ` · ${telling.klaar} van ${telling.totaal} taken klaar`}
          {project.deadline && ` · ${deadlineLabel(project.deadline)}`}
        </p>

        <ul className="space-y-2">
          {FASES.map(({ status, label, icon: Icon }) => {
            const index = PROJECT_STATUS_ORDER.indexOf(status);
            const stand = index < huidig ? "klaar" : index === huidig ? "bezig" : "nog niet";
            return (
              <li key={status} className="flex items-center gap-2.5 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{label}</span>
                <span
                  className={cn(
                    "text-[13px]",
                    stand === "klaar" ? TOON.success.tekst : stand === "bezig" ? cn("font-medium", TOON.info.tekst) : "text-muted-foreground",
                  )}
                >
                  {stand === "klaar" ? "Klaar" : stand === "bezig" ? "Bezig" : "Nog niet"}
                </span>
              </li>
            );
          })}
        </ul>
      </PanelBody>
    </Panel>
  );
};

export default ProjectvoortgangKaart;
