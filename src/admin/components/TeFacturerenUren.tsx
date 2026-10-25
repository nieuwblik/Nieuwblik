import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Receipt } from "lucide-react";

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

  const { groepen, zonderKlant } = useMemo(() => {
    const perKlant = new Map<string, UrenRegel[]>();
    let zonderKlant = 0;
    for (const r of regels) {
      const klantId = klantIdVan(r);
      if (!klantId) {
        zonderKlant += duurMinuten(r);
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
    return { groepen, zonderKlant };
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
          </li>
        ))}
      </ul>
      {zonderKlant > 0 && (
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          {formatDuur(zonderKlant)} zonder klant.{" "}
          <Link to="/admin/uren" className="underline-offset-2 hover:underline">
            Koppel een klant in Uren
          </Link>{" "}
          om ze te kunnen factureren.
        </p>
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
