import { useMemo } from "react";

import { isOpenAanvraag, useAanvragen } from "@/admin/aanvragen";
import { heeftData, isCredit, isTeLaatFactuur, useFinancien } from "@/admin/financien";
import { useClients } from "@/admin/queries";
import { useTeFactureren } from "@/admin/stats";
import { klantIdVan, urenBedrag, useTeFacturerenUren, uurtariefVoor } from "@/admin/uren";

export interface Pijplijn {
  aanvragen: { open: number; nieuw: number };
  /** Null zolang Moneybird niet gekoppeld is of de offertes niet zijn opgehaald. */
  offertesUit: { bedrag: number; aantal: number } | null;
  /** Exclusief btw: geaccepteerde offertes, open uren tegen het klanttarief, hostingtermijnen. */
  teFactureren: { totaal: number; offertes: number; uren: number; hosting: number };
  /** Inclusief btw: wat klanten nog moeten betalen. Null zonder Moneybird. */
  openstaand: { bedrag: number; aantal: number; teLaat: number; teLaatBedrag: number } | null;
}

/**
 * Het geld dat eraan komt, van aanvraag tot betaald. Eén berekening voor de
 * pijplijnkaart op het dashboard en de startpagina, zodat ze nooit iets
 * anders zeggen.
 */
export function usePijplijn(): Pijplijn {
  const { data: aanvragen = [] } = useAanvragen();
  const { data: financien } = useFinancien();
  const { data: uren = [] } = useTeFacturerenUren();
  const { data: clients = [] } = useClients();
  const hosting = useTeFactureren();

  return useMemo(() => {
    const stand = financien && "bijgewerkt" in financien ? financien : null;
    const open = aanvragen.filter(isOpenAanvraag);
    const offertes = stand?.offertes && heeftData(stand.offertes) ? stand.offertes.data : null;
    const uit = offertes?.filter((o) => o.status !== "accepted") ?? [];

    const geaccepteerd = offertes ? offertes.filter((o) => o.status === "accepted").reduce((som, o) => som + o.bedrag, 0) : 0;
    // Per klant, zoals de factuur: met en zonder project, tegen het tarief van de klant.
    const perKlant = new Map<string, typeof uren>();
    for (const r of uren) {
      const sleutel = klantIdVan(r) ?? "";
      perKlant.set(sleutel, [...(perKlant.get(sleutel) ?? []), r]);
    }
    const openUrenBedrag = [...perKlant.entries()].reduce((som, [clientId, lijst]) => {
      const client = clients.find((c) => c.id === clientId);
      return som + urenBedrag(lijst, uurtariefVoor(client));
    }, 0);
    const hostingBedrag = hosting.achterstallig.reduce((som, t) => som + (t.client.billing_amount_cents ?? 0), 0) / 100;

    const facturen = stand && heeftData(stand.facturen) ? stand.facturen.data.filter((f) => !isCredit(f) && f.open > 0) : null;
    const teLaat = facturen?.filter(isTeLaatFactuur) ?? [];

    return {
      aanvragen: { open: open.length, nieuw: open.filter((a) => a.status === "nieuw").length },
      offertesUit: offertes ? { bedrag: uit.reduce((som, o) => som + o.bedrag, 0), aantal: uit.length } : null,
      teFactureren: {
        totaal: geaccepteerd + openUrenBedrag + hostingBedrag,
        offertes: geaccepteerd,
        uren: openUrenBedrag,
        hosting: hostingBedrag,
      },
      openstaand: facturen
        ? {
            bedrag: facturen.reduce((som, f) => som + f.open, 0),
            aantal: facturen.length,
            teLaat: teLaat.length,
            teLaatBedrag: teLaat.reduce((som, f) => som + f.open, 0),
          }
        : null,
    };
  }, [aanvragen, financien, uren, clients, hosting.achterstallig]);
}
