import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/admin/components/EmptyState";
import { formatEuro } from "@/admin/billing";
import { TOON } from "@/admin/constants";
import { useClients } from "@/admin/queries";
import { useTeFactureren } from "@/admin/stats";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";

/**
 * Wat er aan hosting te factureren is. Zonder contracten toont de kaart geen
 * rij nullen maar wat je moet doen om hem te vullen: een kaart vol "€ 0"
 * zegt niets en ziet eruit alsof er iets stuk is.
 */
const HostingKaart = ({ className }: { className?: string }) => {
  const facturen = useTeFactureren();
  const { data: clients = [] } = useClients();

  // Schatting op het huidige bedrag: een jaarcontract telt voor een twaalfde.
  // Er is geen factuurgeschiedenis, dus meer dan een schatting is het niet.
  const maandomzet = useMemo(
    () =>
      clients.reduce((som, c) => {
        if (!c.billing_cycle || !c.billing_start || c.billing_amount_cents == null) return som;
        return som + (c.billing_cycle === "maandelijks" ? c.billing_amount_cents : c.billing_amount_cents / 12);
      }, 0),
    [clients],
  );

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/hosting">Bekijk hosting</PanelFooter>}>
      <PanelHeader icon={Receipt} titel="Hosting" subtitel="Te factureren tot en met deze maand" />
      <PanelBody>
        {facturen.isLoading ? (
          <Skeleton className="h-24" />
        ) : facturen.contracten === 0 ? (
          <EmptyState
            compact
            icon={Receipt}
            title="Nog geen hostingcontracten"
            description="Open een klant en kies Facturatie; dan zie je hier wat er te factureren is."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/klanten">Facturatie instellen</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            <p className="flex items-baseline gap-2">
              <span className="font-epilogue text-[28px] font-medium leading-none tabular-nums tracking-tight">
                {formatEuro(facturen.bedragCenten) ?? "€ 0"}
              </span>
              <span className="text-sm text-muted-foreground">
                {facturen.open.length} {facturen.open.length === 1 ? "factuur" : "facturen"}
              </span>
            </p>

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Achterstallig</dt>
                <dd className={cn("tabular-nums", facturen.achterstallig.length > 0 && cn("font-medium", TOON.danger.tekst))}>
                  {facturen.achterstallig.length}
                </dd>
              </div>
              {facturen.zonderBedrag > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Zonder bedrag</dt>
                  <dd className="tabular-nums">{facturen.zonderBedrag}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Per maand (schatting)</dt>
                <dd className="tabular-nums">{formatEuro(Math.round(maandomzet)) ?? "€ 0"}</dd>
              </div>
            </dl>
          </div>
        )}
      </PanelBody>
    </Panel>
  );
};

export default HostingKaart;
