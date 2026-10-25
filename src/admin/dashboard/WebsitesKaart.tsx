import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { timeAgo } from "@/admin/format";
import { useProjects } from "@/admin/queries";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import { useWebsiteControles, websiteProblemen } from "@/admin/websites";

/**
 * De stand van alle live-sites in één regel. De bel meldt alleen wat er mis
 * is; hier zie je ook dat alles in orde is, en wanneer dat voor het laatst is
 * nagekeken. Een probleem staat als eigen regel met een link naar het project.
 *
 * Zonder sites met een live-adres, of zolang de bewaking nog niet live is,
 * verschijnt de kaart niet.
 */
const WebsitesKaart = ({ className }: { className?: string }) => {
  const { data: controles, isError } = useWebsiteControles();
  const { data: projects = [] } = useProjects();

  const stand = useMemo(() => {
    const metSite = projects.filter((p) => p.live_url?.trim());
    const gecontroleerd = metSite.flatMap((p) => {
      const c = controles?.get(p.id);
      return c ? [{ project: p, controle: c }] : [];
    });
    const problemen = gecontroleerd.flatMap(({ project, controle }) =>
      websiteProblemen(controle).map((probleem) => ({ ...probleem, naam: project.client?.name ?? project.name, fout: controle.fout })),
    );
    const laatste = gecontroleerd.reduce<string | null>(
      (nieuwste, { controle }) => (!nieuwste || controle.created_at > nieuwste ? controle.created_at : nieuwste),
      null,
    );
    return { sites: metSite.length, gecontroleerd: gecontroleerd.length, problemen, laatste };
  }, [controles, projects]);

  if (isError || !controles || stand.sites === 0) return null;

  const nogNiet = stand.sites - stand.gecontroleerd;

  return (
    <Panel className={className}>
      <PanelHeader
        icon={Globe}
        titel="Websites"
        subtitel={stand.laatste ? `Gecontroleerd ${timeAgo(stand.laatste)}` : "Nog niet gecontroleerd"}
      />
      <PanelBody className="space-y-1 text-sm">
        {stand.problemen.length === 0 ? (
          stand.gecontroleerd > 0 && (
            <p className="flex items-center gap-2.5">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", TOON.success.stip)} aria-hidden="true" />
              {stand.gecontroleerd === 1 ? "De site is" : `Alle ${stand.gecontroleerd} sites zijn`} online, SSL en
              domeinnaam in orde
            </p>
          )
        ) : (
          <ul className="space-y-0.5">
            {stand.problemen.map((p) => (
              <li key={`${p.projectId}-${p.soort}`}>
                <Link to={`/admin/projecten/${p.projectId}`} className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 p-rij">
                  <span
                    className={cn("h-2 w-2 shrink-0 rounded-full", p.soort === "offline" ? TOON.danger.stip : TOON.warning.stip)}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {p.soort === "offline"
                      ? `${p.naam} is niet bereikbaar`
                      : `${p.soort === "ssl" ? "SSL-certificaat" : "Domeinnaam"} van ${p.naam} ${
                          p.dagen !== null && p.dagen < 0
                            ? "is verlopen"
                            : `verloopt over ${p.dagen} ${p.dagen === 1 ? "dag" : "dagen"}`
                        }`}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
        {nogNiet > 0 && (
          <p className="text-[13px] text-muted-foreground">
            {nogNiet} {nogNiet === 1 ? "site" : "sites"} nog niet gecontroleerd
          </p>
        )}
      </PanelBody>
    </Panel>
  );
};

export default WebsitesKaart;
