import { Link } from "react-router-dom";
import { History } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { PROJECT_STATUS } from "@/admin/constants";
import { leesbareUpdate, momentLabel } from "@/admin/format";
import { useRecentUpdates, useTeam } from "@/admin/queries";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";

/**
 * De laatste updates, mijlpalen en notities over alle projecten heen. Een
 * fasewissel schrijft zelf een mijlpaal weg, dus ook "UVTEQ is live" komt
 * hier langs zonder dat iemand het hoeft te typen.
 */
const ActiviteitKaart = () => {
  const { data: updates = [], isLoading } = useRecentUpdates(8);
  const { data: team = [] } = useTeam();

  const auteur = (id: string | null) => (id ? (team.find((m) => m.user_id === id)?.name ?? null) : null);

  return (
    <Panel className="md:col-span-6 xl:col-span-8">
      <PanelHeader icon={History} titel="Recente activiteit" subtitel="Updates en mijlpalen over alle projecten" />
      <PanelBody className="px-2 pb-2">
        {isLoading ? (
          <div className="space-y-2 px-3 pb-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : updates.length === 0 ? (
          <p className="px-3 pb-3 text-sm text-muted-foreground">Nog geen activiteit.</p>
        ) : (
          // Op een telefoon vijf regels; de rest staat op de projectpagina.
          <ul className="[&>li:nth-child(n+6)]:hidden sm:[&>li:nth-child(n+6)]:block">
            {updates.map((update) => {
              const wie = auteur(update.author_id);
              return (
                <li key={update.id}>
                  <Link
                    to={update.project ? `/admin/projecten/${update.project.id}?tab=tijdlijn` : "/admin/klanten"}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-muted/60"
                  >
                    <StatusPill kind="update" value={update.kind} className="mt-px w-[4.75rem] justify-center" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{leesbareUpdate(update.body, PROJECT_STATUS)}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
                        {[update.project?.name, wie, momentLabel(update.created_at)].filter(Boolean).join(" · ")}
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
