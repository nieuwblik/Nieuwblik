import { useMemo } from "react";
import { endOfMonth, startOfDay, startOfMonth, subMonths } from "date-fns";

import { useAdminAuth } from "@/admin/AdminAuthContext";
import { termijnen } from "@/admin/billing";
import { hoofdtaken, isTeLaat } from "@/admin/constants";
import { useClients, useInvoicedPeriods, useTasks, type Client, type TaskWithProject } from "@/admin/queries";

/**
 * De tellingen die op meer plekken staan: zijbalk, belletje, dashboard en de
 * kop van de takenpagina. Eén berekening, zodat een getal nergens anders
 * uitkomt dan ernaast.
 */
export interface TaakTellingen {
  open: TaskWithProject[];
  teLaat: TaskWithProject[];
  mijn: TaskWithProject[];
  vandaag: TaskWithProject[];
  isLoading: boolean;
}

export function useTaakTellingen(): TaakTellingen {
  const { user } = useAdminAuth();
  const { data: tasks = [], isLoading } = useTasks();

  return useMemo(() => {
    const vandaagSleutel = dagSleutelVanVandaag();
    const open = hoofdtaken(tasks).filter((t) => t.status !== "klaar");
    return {
      open,
      teLaat: open.filter((t) => isTeLaat(t)),
      mijn: open.filter((t) => t.assigned_to === user?.id),
      vandaag: open.filter((t) => t.due_date?.slice(0, 10) === vandaagSleutel),
      isLoading,
    };
  }, [tasks, user?.id, isLoading]);
}

function dagSleutelVanVandaag(): string {
  const nu = new Date();
  return `${nu.getFullYear()}-${`${nu.getMonth() + 1}`.padStart(2, "0")}-${`${nu.getDate()}`.padStart(2, "0")}`;
}

export interface OpenTermijn {
  client: Client;
  sleutel: string;
  datum: Date;
}

/**
 * Factuurmomenten die nog niet zijn afgevinkt, van twee jaar terug tot en met
 * het eind van deze maand: wat er achterstallig is plus wat er deze maand nog
 * uit moet. Dat is "te factureren" in de zijbalk en op het dashboard.
 */
export function useTeFactureren() {
  const { data: clients = [], isLoading } = useClients();
  const { data: gefactureerd = [] } = useInvoicedPeriods();

  return useMemo(() => {
    const afgevinkt = new Set(gefactureerd.map((r) => `${r.client_id}|${r.period_date}`));
    const vandaag = startOfDay(new Date());
    const van = subMonths(startOfMonth(vandaag), 24);
    const tot = endOfMonth(vandaag);
    const metContract = clients.filter((c) => c.billing_cycle && c.billing_start);

    const open: OpenTermijn[] = metContract
      .flatMap((client) =>
        termijnen(client.billing_start!, client.billing_cycle!, van, tot)
          .filter((t) => !afgevinkt.has(`${client.id}|${t.sleutel}`))
          .map((t) => ({ client, sleutel: t.sleutel, datum: t.datum })),
      )
      .sort((a, b) => a.sleutel.localeCompare(b.sleutel));

    return {
      open,
      achterstallig: open.filter((t) => t.datum < vandaag),
      bedragCenten: open.reduce((som, t) => som + (t.client.billing_amount_cents ?? 0), 0),
      zonderBedrag: open.filter((t) => t.client.billing_amount_cents == null).length,
      contracten: metContract.length,
      isLoading,
    };
  }, [clients, gefactureerd, isLoading]);
}
