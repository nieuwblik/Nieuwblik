import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { daysUntil, timeAgo } from "@/admin/format";
import { DOMEIN_WAARSCHUWING, SSL_WAARSCHUWING, useControleerWebsites, useWebsiteControles } from "@/admin/websites";

const datum = (d: string) => format(parseISO(d), "d MMM yyyy", { locale: nl }).replace(".", "");

/**
 * De stand van de live-site van een project, uit de laatste controle:
 * bereikbaar of niet, laadtijd, en tot wanneer certificaat en domeinnaam
 * lopen. Met een knop om meteen opnieuw te controleren.
 */
const WebsiteStatus = ({ projectId, kop }: { projectId: string; kop: React.ReactNode }) => {
  const { data: controles, isError } = useWebsiteControles();
  const controleer = useControleerWebsites();
  const c = controles?.get(projectId);

  // Tabel bestaat nog niet (migratie): niets tonen in plaats van een foutmelding.
  if (isError) return null;

  const nu = async () => {
    try {
      await controleer.mutateAsync(projectId);
      toast.success("Website gecontroleerd");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Controleren mislukt");
    }
  };

  const ssl = c?.ssl_geldig_tot ? daysUntil(c.ssl_geldig_tot.slice(0, 10)) : null;
  const domein = c?.domein_geldig_tot ? daysUntil(c.domein_geldig_tot.slice(0, 10)) : null;

  return (
    <div className="space-y-3 border-t border-border pt-6 text-sm">
      {kop}
      {!c ? (
        <p className="text-muted-foreground">Nog niet gecontroleerd.</p>
      ) : (
        <dl className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Bereikbaar</dt>
            <dd className={cn("flex items-center gap-1.5 font-medium", !c.online && TOON.danger.tekst)}>
              <span className={cn("h-2 w-2 rounded-full", c.online ? TOON.success.stip : TOON.danger.stip)} aria-hidden="true" />
              {c.online ? `Ja${c.laadtijd_ms ? `, ${(c.laadtijd_ms / 1000).toLocaleString("nl-NL", { maximumFractionDigits: 1 })} s` : ""}` : "Nee"}
            </dd>
          </div>
          {!c.online && c.fout && <p className={cn("text-[13px]", TOON.danger.tekst)}>{c.fout}</p>}
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">SSL-certificaat</dt>
            <dd className={cn("font-medium", ssl !== null && ssl <= SSL_WAARSCHUWING && TOON.warning.tekst)}>
              {c.ssl_geldig_tot ? `tot ${datum(c.ssl_geldig_tot)}` : "Onbekend"}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Domeinnaam</dt>
            <dd className={cn("font-medium", domein !== null && domein <= DOMEIN_WAARSCHUWING && TOON.warning.tekst)}>
              {c.domein_geldig_tot ? `tot ${datum(c.domein_geldig_tot)}` : "Niet openbaar"}
            </dd>
          </div>
        </dl>
      )}
      <div className="flex items-center justify-between gap-3 text-[13px] text-muted-foreground">
        <span>{c ? `Gecontroleerd ${timeAgo(c.created_at)}` : ""}</span>
        <button
          type="button"
          onClick={() => void nu()}
          disabled={controleer.isPending}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          <RotateCw className={cn("h-3.5 w-3.5", controleer.isPending && "animate-spin")} />
          Nu controleren
        </button>
      </div>
    </div>
  );
};

export default WebsiteStatus;
