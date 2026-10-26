import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Receipt, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import UrenFactureren from "@/admin/components/UrenFactureren";
import { useClients, type Client } from "@/admin/queries";
import {
  duurMinuten,
  formatDuur,
  klantIdVan,
  urenBedrag,
  useTeFacturerenUren,
  useZetFactureerbaar,
  uurtariefVoor,
  type UrenRegel,
} from "@/admin/uren";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

interface Groep {
  clientId: string;
  naam: string;
  client: Client | null;
  regels: UrenRegel[];
  minuten: number;
  tarief: number;
  bedrag: number;
  vanaf: string;
}

/**
 * De uren die nog op een factuur moeten, per klant, met wat dat oplevert
 * tegen het tarief van de klant (anders het standaardtarief). Uren van
 * projecten en losse uren zonder project (een mail, een belletje) staan
 * samen. Elke regel heeft een knop die er één conceptfactuur in Moneybird
 * van maakt. Uren zonder klant kunnen niet op een factuur; die worden
 * apart genoemd, zodat je ze in Uren aan een klant kunt hangen.
 *
 * Staat op het dashboard in de kaart Gewerkte uren en bovenaan de pagina
 * Uren. Zonder openstaande uren toont hij één regel, of niets (verberg).
 */
const TeFacturerenUren = ({ className, verbergAlsLeeg = false }: { className?: string; verbergAlsLeeg?: boolean }) => {
  const { data: regels = [], isLoading, isError } = useTeFacturerenUren();
  const { data: clients = [] } = useClients();
  const { bedrag } = useBedragenVerborgen();
  const [open, setOpen] = useState<Groep | null>(null);
  const zet = useZetFactureerbaar();

  /**
   * Het kruisje: deze uren niet factureren. Ze gaan uit de lijst maar blijven
   * in de urenregistratie staan (als niet factureerbaar); terugdraaien kan
   * meteen vanuit de melding, of later per regel in Uren.
   */
  const nietFactureren = (ids: string[], wie: string) =>
    zet.mutate(
      { ids, billable: false },
      {
        onSuccess: () =>
          toast.success(`${wie} niet gefactureerd`, {
            description: "De uren blijven in je urenregistratie staan.",
            action: {
              label: "Ongedaan maken",
              onClick: () =>
                zet.mutate({ ids, billable: true }, { onError: (e) => toast.error(e.message) }),
            },
          }),
        onError: (e) => toast.error(e.message),
      },
    );

  const { groepen, zonderKlant, zonderKlantIds } = useMemo(() => {
    const perKlant = new Map<string, UrenRegel[]>();
    let zonderKlant = 0;
    const zonderKlantIds: string[] = [];
    for (const r of regels) {
      const klantId = klantIdVan(r);
      if (!klantId) {
        zonderKlant += duurMinuten(r);
        zonderKlantIds.push(r.id);
        continue;
      }
      perKlant.set(klantId, [...(perKlant.get(klantId) ?? []), r]);
    }
    const groepen: Groep[] = [...perKlant.entries()]
      .map(([clientId, lijst]) => {
        const client = clients.find((c) => c.id === clientId) ?? null;
        const minuten = lijst.reduce((som, r) => som + duurMinuten(r), 0);
        const tarief = uurtariefVoor(client);
        return {
          clientId,
          naam: client?.name ?? lijst[0]?.project?.client?.name ?? lijst[0]?.klant?.name ?? "Klant",
          client,
          regels: lijst,
          minuten,
          tarief,
          bedrag: Math.round(urenBedrag(lijst, tarief) * 100) / 100,
          vanaf: lijst[0]!.started_at,
        };
      })
      .sort((a, b) => b.bedrag - a.bedrag);
    return { groepen, zonderKlant, zonderKlantIds };
  }, [regels, clients]);

  if (isError) return null;
  if (isLoading) return <Skeleton className={cn("h-24", className)} />;
  if (groepen.length === 0 && zonderKlant === 0) {
    return verbergAlsLeeg ? null : (
      <p className={cn("text-[13px] text-muted-foreground", className)}>Alle factureerbare uren staan op een factuur.</p>
    );
  }

  const totaal = groepen.reduce((som, g) => som + g.bedrag, 0);
  const totaalMinuten = groepen.reduce((som, g) => som + g.minuten, 0);

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium">Nog te factureren</h3>
        <p className="text-[13px] tabular-nums text-muted-foreground">
          {formatDuur(totaalMinuten)} · <span className="font-medium text-foreground">{bedrag(totaal)}</span> excl. btw
        </p>
      </div>
      <ul className="divide-y divide-border">
        {groepen.map((g) => (
          <li key={g.clientId} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
            <span className="min-w-0 flex-1 basis-40">
              <Link to={`/admin/klanten/${g.clientId}`} className="block truncate font-medium hover:underline">
                {g.naam}
              </Link>
              <span className="block text-[13px] text-muted-foreground">
                {formatDuur(g.minuten)} sinds {format(new Date(g.vanaf), "d MMMM", { locale: nl })} · {bedrag(g.tarief, 0)}
                /uur
              </span>
            </span>
            <span className="shrink-0 font-medium tabular-nums">{bedrag(g.bedrag)}</span>
            <Button size="sm" variant="outline" className="shrink-0" onClick={() => setOpen(g)}>
              <Receipt className="h-4 w-4" />
              Factureren
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 text-muted-foreground"
              onClick={() => nietFactureren(g.regels.map((r) => r.id), g.naam)}
              disabled={zet.isPending}
              title="Niet factureren"
              aria-label={`Uren van ${g.naam} niet factureren`}
            >
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
      {zonderKlant > 0 && (
        <div className="mt-1.5 flex items-center gap-3 text-[13px] text-muted-foreground">
          <p className="min-w-0 flex-1">
            {formatDuur(zonderKlant)} zonder klant.{" "}
            <Link to="/admin/uren" className="underline-offset-2 hover:underline">
              Koppel een klant in Uren
            </Link>{" "}
            om ze te kunnen factureren.
          </p>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={() => nietFactureren(zonderKlantIds, "Uren zonder klant")}
            disabled={zet.isPending}
            title="Niet factureren"
            aria-label="Uren zonder klant niet factureren"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <UrenFactureren
        open={open !== null}
        onOpenChange={(o) => !o && setOpen(null)}
        clientId={open?.clientId ?? ""}
        client={open?.client ?? null}
        regels={open?.regels ?? []}
      />
    </div>
  );
};

export default TeFacturerenUren;
