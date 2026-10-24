import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TOON } from "@/admin/constants";
import { formatDateTime } from "@/admin/format";
import { useClients, useMailings } from "@/admin/queries";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";

/**
 * De laatste mailing en wat het mailen in de weg zit: klanten zonder
 * e-mailadres krijgen niets, dus dat getal staat hier zichtbaar, met een
 * link naar precies die klanten.
 */
const MailenKaart = ({ className }: { className?: string }) => {
  const { data: mailings = [], isLoading, isError } = useMailings(1);
  const { data: clients = [] } = useClients();

  const { zonderEmail, afgemeld } = useMemo(
    () => ({
      zonderEmail: clients.filter((c) => !c.email?.includes("@")).length,
      afgemeld: clients.filter((c) => c.mail_afgemeld_op).length,
    }),
    [clients],
  );

  const laatste = mailings[0];

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/mailen">Bekijk mailingen</PanelFooter>}>
      <PanelHeader icon={Mail} titel="Mailen" subtitel="Laatste mailing aan je klanten" />
      <PanelBody className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-16" />
        ) : isError ? (
          <p className="text-sm text-muted-foreground">De mailingen konden niet geladen worden.</p>
        ) : laatste ? (
          <div className="rounded-lg border border-border px-3 py-2.5">
            <p className="truncate text-sm font-medium">{laatste.onderwerp}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
              <span>{formatDateTime(laatste.created_at)}</span>
              <StatusPill toon="success">{laatste.aantal_ontvangers} verstuurd</StatusPill>
              {laatste.aantal_mislukt > 0 && <StatusPill toon="danger">{laatste.aantal_mislukt} mislukt</StatusPill>}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nog niets verstuurd.</p>
        )}

        <ul className="space-y-0.5 text-sm">
          {zonderEmail > 0 && (
            <li>
              <Link
                to="/admin/mailen?ontvangers=zonder-email"
                className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 p-rij"
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", TOON.warning.stip)} />
                <span className="flex-1">
                  {zonderEmail} {zonderEmail === 1 ? "klant" : "klanten"} zonder e-mailadres
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          )}
          {afgemeld > 0 && (
            <li className="flex items-center gap-2.5 py-1.5">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", TOON.neutral.stip)} />
              <span className="text-muted-foreground">{afgemeld} afgemeld voor mailingen</span>
            </li>
          )}
        </ul>
      </PanelBody>
    </Panel>
  );
};

export default MailenKaart;
