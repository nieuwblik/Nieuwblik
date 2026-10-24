import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FolderKanban } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS, PROJECT_STATUS_ORDER } from "@/admin/constants";
import { useCombinedRows } from "@/admin/rows";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Hoeveel klanten in welke fase zitten, in de volgorde van het werk. Lege
 * fases vallen weg, anders bestaat de kaart vooral uit nullen. Elke balk
 * opent de klantenlijst gefilterd op die fase.
 */
const FaseKaart = () => {
  const { rows, isLoading } = useCombinedRows();

  const { fases, lopend } = useMemo(() => {
    const fases = PROJECT_STATUS_ORDER.map((status) => ({
      status,
      aantal: rows.filter((row) => row.status === status).length,
    })).filter((f) => f.aantal > 0);
    return {
      fases,
      lopend: rows.filter((row) => row.status && ACTIVE_PROJECT_STATUSES.includes(row.status)).length,
    };
  }, [rows]);

  const hoogste = Math.max(1, ...fases.map((f) => f.aantal));

  return (
    <Panel className="md:col-span-3 xl:col-span-4">
      <PanelHeader icon={FolderKanban} titel="Klanten per fase" subtitel={`${lopend} met lopend werk`} />
      <PanelBody>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-5" />
            ))}
          </div>
        ) : fases.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nog geen projecten.</p>
        ) : (
          <ul className="space-y-0.5">
            {fases.map(({ status, aantal }) => (
              <li key={status}>
                <Link
                  to={`/admin/klanten?status=${status}`}
                  className="-mx-2 grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-muted/60"
                >
                  <span className="truncate">{PROJECT_STATUS[status].label}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <span
                      className={cn("block h-full rounded-full", PROJECT_STATUS[status].tint)}
                      style={{ width: `${Math.max(6, (aantal / hoogste) * 100)}%` }}
                    />
                  </span>
                  <span className="text-right tabular-nums text-muted-foreground">{aantal}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PanelBody>
      <PanelFooter to="/admin/klanten">Alle klanten</PanelFooter>
    </Panel>
  );
};

export default FaseKaart;
