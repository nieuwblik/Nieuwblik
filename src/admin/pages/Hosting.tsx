import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  addYears,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { nl } from "date-fns/locale";
import {
  AlertCircle,
  CalendarRange,
  DownloadCloud,
  FileText,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import BillingCalendar, {
  type BillingMoment,
} from "@/admin/components/BillingCalendar";
import {
  BILLING_CYCLE,
  formatEuro,
  leesDatum,
  termijnen,
} from "@/admin/billing";
import { TOON } from "@/admin/constants";
import {
  useClients,
  useInvoicedPeriods,
  useMarkInvoiced,
  type Client,
} from "@/admin/queries";
import { useTeFactureren } from "@/admin/stats";
import { useHostingFactureren } from "@/admin/useHostingFactureren";
import HostingUitMoneybird from "@/admin/components/HostingUitMoneybird";
import HostingMoneybirdActies from "@/admin/components/HostingMoneybirdActies";
import { factureertMoneybird } from "@/admin/financien";
import MonthNav from "@/admin/ui/MonthNav";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";

interface Regel {
  client: Client;
  sleutel: string;
  datum: Date;
  gefactureerd: boolean;
  /** Moneybird factureert dit contract zelf (terugkerende factuur). */
  viaMoneybird?: boolean;
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
  // Achterstallig komt uit dezelfde berekening als de teller in de zijbalk
  // en de kaart op het dashboard, zodat die getallen altijd gelijk zijn.
  const { achterstallig } = useTeFactureren();
  const moneybird = useHostingFactureren();

  const [maand, setMaand] = useState(() => startOfMonth(new Date()));
  // Vanuit de melding op het dashboard opent het inleesvenster meteen.
  const [inlezen, setInlezen] = useState(() => new URLSearchParams(window.location.search).get("inlezen") === "1");

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
        termijnen(client.billing_start!, client.billing_cycle!, van, tot).map(
          (t) => ({
            client,
            sleutel: t.sleutel,
            datum: t.datum,
            gefactureerd:
              afgevinkt.has(`${client.id}|${t.sleutel}`) ||
              factureertMoneybird(client),
            viaMoneybird: factureertMoneybird(client),
          }),
        ),
      )
      .sort(
        (a, b) =>
          a.sleutel.localeCompare(b.sleutel) ||
          a.client.name.localeCompare(b.client.name),
      );
  }, [metContract, maand, afgevinkt]);

  const open = regels.filter((r) => !r.gefactureerd);
  const vandaag = startOfDay(new Date());

  // Wat er deze maand aan facturen uit kan. Contracten zonder bedrag tellen
  // niet mee; die zouden het totaal stilletjes te laag maken.
  const maandTotaal = regels.reduce(
    (som, r) => som + (r.client.billing_amount_cents ?? 0),
    0,
  );
  const zonderBedrag = regels.filter(
    (r) => r.client.billing_amount_cents == null,
  ).length;

  const perDagKalender = useMemo(() => {
    const map = new Map<string, BillingMoment[]>();
    for (const r of regels) {
      const lijst = map.get(r.sleutel) ?? [];
      lijst.push({
        clientId: r.client.id,
        clientNaam: r.client.name,
        cyclus: r.client.billing_cycle!,
        sleutel: r.sleutel,
        gefactureerd: r.gefactureerd,
      });
      map.set(r.sleutel, lijst);
    }
    // Jaarlijks eerst: dat is wat je in een volle cel als eerste wilt zien.
    for (const lijst of map.values()) {
      lijst.sort((a, b) =>
        a.cyclus === b.cyclus ? 0 : a.cyclus === "jaarlijks" ? -1 : 1,
      );
    }
    return map;
  }, [regels]);

  const zet = async (regel: Regel, waarde: boolean) => {
    try {
      await markeer.mutateAsync({
        clientId: regel.client.id,
        periodDate: regel.sleutel,
        userId: user?.id ?? null,
        gefactureerd: waarde,
      });
      // Een vinkje weghalen wist wie en wanneer er gefactureerd is. Geen
      // dialoog ervoor (dat remt het gewone afvinken), wel een weg terug.
      if (!waarde) {
        toast(`${regel.client.name}: niet meer gefactureerd`, {
          action: {
            label: "Ongedaan maken",
            onClick: () => void zet(regel, true),
          },
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bijwerken mislukt");
    }
  };

  const rij = (regel: Regel, toonMaand: boolean) => (
    <li
      key={`${regel.client.id}|${regel.sleutel}`}
      className={cn(
        "-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-[background-color,opacity] duration-200 hover:bg-muted/50",
        regel.gefactureerd && "opacity-60",
      )}
    >
      {regel.viaMoneybird ? (
        <span
          title="Moneybird verstuurt deze factuur zelf"
          className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </span>
      ) : (
        <Checkbox
          checked={regel.gefactureerd}
          onCheckedChange={(v) => void zet(regel, v === true)}
          aria-label={`${regel.client.name}, ${format(regel.datum, "d MMMM yyyy", { locale: nl })} gefactureerd`}
        />
      )}

      {/* Op een telefoon passen vier kolommen niet naast elkaar: de naam werd
          er volledig uitgedrukt. Datum en cyclus zakken daar onder de naam. */}
      <span className="hidden w-24 shrink-0 text-[13px] tabular-nums text-muted-foreground sm:block">
        {format(regel.datum, toonMaand ? "d MMM yyyy" : "d MMMM", {
          locale: nl,
        })}
      </span>

      <div className="min-w-0 flex-1">
        <Link
          to={`/admin/klanten/${regel.client.id}`}
          className="block truncate text-sm font-medium hover:underline"
        >
          {regel.client.name}
        </Link>
        <span className="text-[13px] text-muted-foreground sm:hidden">
          {format(regel.datum, "d MMM yyyy", { locale: nl })} ·{" "}
          {BILLING_CYCLE[regel.client.billing_cycle!].label}
        </span>
      </div>

      {formatEuro(regel.client.billing_amount_cents) && (
        <span className="shrink-0 text-right text-sm tabular-nums sm:w-20">
          {formatEuro(regel.client.billing_amount_cents)}
        </span>
      )}

      <span className="hidden w-24 shrink-0 text-right text-[13px] text-muted-foreground sm:block">
        {BILLING_CYCLE[regel.client.billing_cycle!].label}
      </span>

      {/* Vaste breedte, ook bij een afgevinkte termijn, zodat de kolommen gelijk blijven. */}
      {moneybird.live && (
        <span className="flex w-10 shrink-0 justify-end md:w-24">
          {regel.viaMoneybird ? (
            <span className="hidden text-[13px] text-muted-foreground md:inline">
              Via Moneybird
            </span>
          ) : (
            !regel.gefactureerd && moneybird.knop(regel)
          )}
        </span>
      )}
    </li>
  );

  const achterstalligeRegels: Regel[] = achterstallig.map((t) => ({
    ...t,
    gefactureerd: false,
  }));

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 lg:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl tracking-tight">Hosting</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {metContract.length}{" "}
            {metContract.length === 1 ? "klant" : "klanten"} met een terugkerend
            contract
            {achterstallig.length > 0 && (
              <span className={TOON.danger.tekst}>
                {" "}
                · {achterstallig.length} nog niet gefactureerd
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={() => setInlezen(true)}>
          <DownloadCloud className="h-4 w-4" />
          Uit Moneybird inlezen
        </Button>
      </div>

      <HostingUitMoneybird open={inlezen} onOpenChange={setInlezen} />

      {isError && (
        <p
          className={cn("rounded-lg border px-3 py-2 text-sm", TOON.danger.cel)}
        >
          De facturatiegegevens konden niet geladen worden.
        </p>
      )}

      {/* Wat je vergeten bent staat bovenaan; de maand eronder is voor
          vooruitkijken. */}
      {achterstalligeRegels.length > 0 && (
        <Panel className="border-danger/30">
          <PanelHeader
            icon={AlertCircle}
            titel="Nog te factureren"
            subtitel="Deze datums zijn geweest en staan nog open."
            actie={moneybird.allesKnop(achterstalligeRegels)}
          />
          <PanelBody>
            <ul className="space-y-1">
              {achterstalligeRegels.map((r) => rij(r, true))}
            </ul>
          </PanelBody>
        </Panel>
      )}

      <Panel>
        <PanelHeader
          icon={CalendarRange}
          titel={
            <span className="inline-block first-letter:uppercase">
              {format(maand, "LLLL yyyy", { locale: nl })}
            </span>
          }
          // Zonder contracten valt er niets te bladeren: dan alleen de lege staat.
          subtitel={
            metContract.length === 0 ? undefined : regels.length === 0 ? (
              "Deze maand valt er niets te factureren."
            ) : (
              <>
                {regels.length} {regels.length === 1 ? "moment" : "momenten"},
                waarvan {open.length} open
                {maandTotaal > 0 && <> · {formatEuro(maandTotaal)}</>}
                {zonderBedrag > 0 && <> · {zonderBedrag} zonder bedrag</>}
              </>
            )
          }
          actie={
            metContract.length > 0 ? (
              <MonthNav maand={maand} onChange={setMaand} />
            ) : undefined
          }
        />

        <PanelBody>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : metContract.length === 0 ? (
            <EmptyState
              compact
              icon={Receipt}
              title="Nog geen contracten"
              description="Open een klant en kies Facturatie: cyclus, ingangsdatum en bedrag. Dan verschijnen de factuurmomenten hier."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/klanten">Naar de klanten</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-5">
              {/* Het rooster is om te zien aankomen, de lijst eronder om af te
                  vinken. Een jaarcontract valt in het rooster op, want dat is
                  het moment dat je één keer per jaar niet mag missen. */}
              <BillingCalendar maand={maand} perDag={perDagKalender} />

              {regels.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Niets in deze maand.
                </p>
              ) : (
                <ul className="space-y-1 border-t border-border pt-4">
                  {regels.map((r) => rij(r, false))}
                </ul>
              )}
            </div>
          )}
        </PanelBody>
      </Panel>

      {/* Het jaar in één blik: wie er wanneer aan de beurt is. */}
      {metContract.length > 0 && (
        <Panel>
          <PanelHeader
            icon={FileText}
            titel="Contracten"
            subtitel="Cyclus, ingangsdatum en het eerstvolgende moment."
          />
          <PanelBody>
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
                    className="relative -mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 p-rij"
                  >
                      {/* De link spant over de regel (after:inset-0); het menu ligt erboven. */}
                      <Link
                        to={`/admin/klanten/${client.id}`}
                        className="min-w-0 flex-1 truncate text-sm font-medium after:absolute after:inset-0 hover:underline"
                      >
                        {client.name}
                      </Link>
                      {factureertMoneybird(client) && (
                        <span className="hidden shrink-0 text-[13px] text-muted-foreground md:inline">
                          Via Moneybird
                        </span>
                      )}
                      <span className="shrink-0 text-[13px] text-muted-foreground">
                        {BILLING_CYCLE[client.billing_cycle!].label}
                      </span>
                      {/* leesDatum: new Date("2026-08-01") is UTC-middernacht en
                          kan in een andere tijdzone de vorige maand opleveren. */}
                      <span className="hidden w-28 shrink-0 text-right text-[13px] text-muted-foreground sm:block">
                        sinds{" "}
                        {format(leesDatum(client.billing_start!), "MMM yyyy", {
                          locale: nl,
                        })}
                      </span>
                      <span className="w-24 shrink-0 text-right text-[13px] tabular-nums">
                        {volgende ? (
                          format(volgende.datum, "d MMM yyyy", { locale: nl })
                        ) : (
                          <span className="text-muted-foreground">Geen</span>
                        )}
                      </span>
                      <span className="relative z-10">
                        <HostingMoneybirdActies client={client} volgende={volgende?.datum ?? null} />
                      </span>
                  </li>
                );
              })}
            </ul>
          </PanelBody>
        </Panel>
      )}

      {moneybird.dialogen}
    </div>
  );
};

export default Hosting;
