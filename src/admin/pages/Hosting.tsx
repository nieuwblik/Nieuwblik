import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { addMonths, addYears, endOfMonth, format, isBefore, startOfDay, startOfMonth, subMonths } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { BILLING_CYCLE, dagSleutel, termijnen } from "@/admin/billing";
import { useClients, useInvoicedPeriods, useMarkInvoiced, type Client } from "@/admin/queries";

interface Regel {
  client: Client;
  sleutel: string;
  datum: Date;
  gefactureerd: boolean;
}

/**
 * Wanneer er gefactureerd kan worden, en wat daarvan al de deur uit is.
 *
 * Per maand, want dat is het ritme waarin je factureert. Een jaarcontract
 * verschijnt één keer per jaar in de maand waarin het is ingegaan; een
 * maandcontract elke maand.
 */
const Hosting = () => {
  const { user } = useAdminAuth();
  const { data: clients = [], isLoading } = useClients();
  const { data: gefactureerd = [], isError } = useInvoicedPeriods();
  const markeer = useMarkInvoiced();

  const [maand, setMaand] = useState(() => startOfMonth(new Date()));

  // Sleutel "klant|datum": één opzoeking per regel in plaats van een zoektocht
  // door de hele lijst.
  const afgevinkt = useMemo(
    () => new Set(gefactureerd.map((r) => `${r.client_id}|${r.period_date}`)),
    [gefactureerd],
  );

  const metContract = useMemo(
    () => clients.filter((c) => c.billing_cycle && c.billing_start),
    [clients],
  );

  const regels = useMemo(() => {
    const van = startOfMonth(maand);
    const tot = endOfMonth(maand);

    return metContract
      .flatMap((client) =>
        termijnen(client.billing_start!, client.billing_cycle!, van, tot).map((t) => ({
          client,
          sleutel: t.sleutel,
          datum: t.datum,
          gefactureerd: afgevinkt.has(`${client.id}|${t.sleutel}`),
        })),
      )
      .sort((a, b) => a.sleutel.localeCompare(b.sleutel) || a.client.name.localeCompare(b.client.name));
  }, [metContract, maand, afgevinkt]);

  const open = regels.filter((r) => !r.gefactureerd);
  const vandaag = startOfDay(new Date());

  // Achterstallig: de datum is geweest en er staat geen vinkje. Dat is waar je
  // deze pagina voor opent.
  const achterstallig = useMemo(() => {
    const van = subMonths(startOfMonth(vandaag), 24);
    return metContract
      .flatMap((client) =>
        termijnen(client.billing_start!, client.billing_cycle!, van, vandaag)
          .filter((t) => isBefore(t.datum, vandaag) && !afgevinkt.has(`${client.id}|${t.sleutel}`))
          .map((t) => ({ client, sleutel: t.sleutel, datum: t.datum, gefactureerd: false })),
      )
      .sort((a, b) => a.sleutel.localeCompare(b.sleutel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metContract, afgevinkt]);

  const zet = async (regel: Regel, waarde: boolean) => {
    try {
      await markeer.mutateAsync({
        clientId: regel.client.id,
        periodDate: regel.sleutel,
        userId: user?.id ?? null,
        gefactureerd: waarde,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bijwerken mislukt");
    }
  };

  const rij = (regel: Regel, toonMaand: boolean) => (
    <li
      key={`${regel.client.id}|${regel.sleutel}`}
      className={cn(
        "-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-[background-color,opacity] duration-200 hover:bg-muted/40",
        regel.gefactureerd && "opacity-60",
      )}
    >
      <Checkbox
        checked={regel.gefactureerd}
        onCheckedChange={(v) => void zet(regel, v === true)}
        aria-label={`${regel.client.name} — ${format(regel.datum, "d MMMM yyyy", { locale: nl })} gefactureerd`}
      />

      <span className="w-24 shrink-0 text-xs tabular-nums text-muted-foreground">
        {format(regel.datum, toonMaand ? "d MMM yyyy" : "d MMMM", { locale: nl })}
      </span>

      <Link to={`/admin/klanten`} className="min-w-0 flex-1 truncate text-sm font-medium hover:underline">
        {regel.client.name}
      </Link>

      <span className="shrink-0 text-xs text-muted-foreground">
        {BILLING_CYCLE[regel.client.billing_cycle!].label}
      </span>
    </li>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hosting</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {metContract.length} {metContract.length === 1 ? "klant" : "klanten"} met een terugkerend contract
          {achterstallig.length > 0 && (
            <span className="text-rose-600 dark:text-rose-400"> · {achterstallig.length} nog niet gefactureerd</span>
          )}
        </p>
      </div>

      {isError && (
        <p className="text-sm text-muted-foreground">
          De facturatiegegevens konden niet geladen worden. Draait de migratie al?
        </p>
      )}

      {/* Wat je vergeten bent staat bovenaan; de maand eronder is voor
          vooruitkijken. */}
      {achterstallig.length > 0 && (
        <Card className="border-rose-500/30">
          <CardHeader>
            <CardTitle className="text-base">Nog te factureren</CardTitle>
            <CardDescription>Deze datums zijn geweest en staan nog open.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">{achterstallig.map((r) => rij(r, true))}</ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base first-letter:uppercase">
              {format(maand, "LLLL yyyy", { locale: nl })}
            </CardTitle>
            <CardDescription>
              {regels.length === 0
                ? "Deze maand valt er niets te factureren."
                : `${regels.length} ${regels.length === 1 ? "moment" : "momenten"}, waarvan ${open.length} open.`}
            </CardDescription>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMaand(subMonths(maand, 1))} aria-label="Vorige maand">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMaand(startOfMonth(new Date()))}>
              Deze maand
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMaand(addMonths(maand, 1))} aria-label="Volgende maand">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Laden…</p>
          ) : metContract.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Nog geen contracten"
              description="Zet bij een klant de facturatie en de ingangsdatum, dan verschijnen de momenten hier."
            />
          ) : regels.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">Niets in deze maand.</p>
          ) : (
            <ul className="space-y-1">{regels.map((r) => rij(r, false))}</ul>
          )}
        </CardContent>
      </Card>

      {/* Het jaar in één blik: wie er wanneer aan de beurt is. */}
      {metContract.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contracten</CardTitle>
            <CardDescription>Cyclus, ingangsdatum en het eerstvolgende moment.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {metContract.map((client) => {
                const volgende = termijnen(
                  client.billing_start!,
                  client.billing_cycle!,
                  vandaag,
                  addYears(vandaag, 2),
                )[0];

                return (
                  <li
                    key={client.id}
                    className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-muted/40"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{client.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {BILLING_CYCLE[client.billing_cycle!].label}
                    </span>
                    <span className="w-28 shrink-0 text-right text-xs text-muted-foreground">
                      sinds {format(new Date(client.billing_start!), "MMM yyyy", { locale: nl })}
                    </span>
                    <span className="w-28 shrink-0 text-right text-xs tabular-nums">
                      {volgende
                        ? format(volgende.datum, "d MMM yyyy", { locale: nl })
                        : <span className="text-muted-foreground">—</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Hosting;
