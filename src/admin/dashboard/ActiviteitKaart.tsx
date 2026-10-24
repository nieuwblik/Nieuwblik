import { useMemo } from "react";
import { Link } from "react-router-dom";
import { History } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { PROJECT_STATUS } from "@/admin/constants";
import { leesbareUpdate, momentLabel } from "@/admin/format";
import { useRecentUpdates, useTeam } from "@/admin/queries";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";

const MAX = 5;

/**
 * De laatste updates, mijlpalen en notities over alle projecten heen. Een
 * fasewissel schrijft zelf een mijlpaal weg, dus die komt hier langs zonder
 * dat iemand iets hoeft te typen.
 *
 * Opeenvolgende regels met dezelfde tekst (zoals de import uit het
 * portfolio, die voor elk project dezelfde mijlpaal schreef) worden één
 * regel met de projecten erachter, anders is de kaart één lange herhaling.
 */
const ActiviteitKaart = ({ className }: { className?: string }) => {
  const { data: updates = [], isLoading } = useRecentUpdates(20);
  const { data: team = [] } = useTeam();

  const auteur = (id: string | null) => (id ? (team.find((m) => m.user_id === id)?.name ?? null) : null);

  const regels = useMemo(() => {
    // Alleen de letters tellen voor "dezelfde tekst": de import schreef
    // "Opgeleverd in 2025" en "in 2026" door elkaar, met en zonder punt.
    const kern = (tekst: string) => tekst.replace(/[^a-z]/gi, "").toLowerCase();
    const groepen: { eerste: (typeof updates)[number]; projecten: string[] }[] = [];
    for (const update of updates) {
      const vorige = groepen[groepen.length - 1];
      if (vorige && vorige.eerste.kind === update.kind && kern(vorige.eerste.body) === kern(update.body)) {
        if (update.project?.name) vorige.projecten.push(update.project.name);
        continue;
      }
      groepen.push({ eerste: update, projecten: update.project?.name ? [update.project.name] : [] });
    }
    return groepen.slice(0, MAX);
  }, [updates]);

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/klanten">Bekijk alle projecten</PanelFooter>}>
      <PanelHeader icon={History} titel="Recente activiteit" subtitel="Updates en mijlpalen over alle projecten" />
      <PanelBody className="px-2 pb-2 pt-2">
        {isLoading ? (
          <div className="space-y-2 px-2 py-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : regels.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">Nog geen activiteit.</p>
        ) : (
          <ul className="p-vervaag">
            {regels.map(({ eerste, projecten }) => {
              const meer = projecten.length > 1;
              // Gebundeld: de eerste zin, met het aantal projecten erachter.
              const tekst = meer
                ? `${leesbareUpdate(eerste.body, PROJECT_STATUS).split(/\.\s/)[0]?.replace(/\.$/, "")} · ${projecten.length} projecten`
                : leesbareUpdate(eerste.body, PROJECT_STATUS);
              const onder = meer
                ? `${projecten.slice(0, 3).join(", ")}${projecten.length > 3 ? ` en ${projecten.length - 3} meer` : ""}`
                : [eerste.project?.name, auteur(eerste.author_id)].filter(Boolean).join(" · ");
              return (
                <li key={eerste.id}>
                  <Link
                    to={eerste.project && !meer ? `/admin/projecten/${eerste.project.id}?tab=tijdlijn` : "/admin/klanten"}
                    className="flex items-start gap-3 rounded-lg px-2 py-2 p-rij"
                  >
                    <StatusPill kind="update" value={eerste.kind} className="mt-px w-[4.75rem] justify-center" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{tekst}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
                        {[onder, momentLabel(eerste.created_at)].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </PanelBody>
    </Panel>
  );
};

export default ActiviteitKaart;
