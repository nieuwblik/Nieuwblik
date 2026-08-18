import { addMonths, addYears, isAfter, isBefore, startOfDay } from "date-fns";

import type { Database } from "@/integrations/supabase/types";

export type BillingCycle = Database["public"]["Enums"]["billing_cycle"];

export const BILLING_CYCLE: Record<BillingCycle, { label: string; kort: string }> = {
  maandelijks: { label: "Maandelijks", kort: "p/m" },
  jaarlijks: { label: "Jaarlijks", kort: "p/j" },
};

export const BILLING_CYCLE_ORDER = Object.keys(BILLING_CYCLE) as BillingCycle[];

export interface Termijn {
  /** Eerste dag van de periode; tevens de sleutel waarop je afvinkt. */
  datum: Date;
  sleutel: string;
}

/** yyyy-MM-dd zonder tijdzone-omweg: een datumkolom heeft geen tijd. */
export function dagSleutel(datum: Date): string {
  const maand = `${datum.getMonth() + 1}`.padStart(2, "0");
  const dag = `${datum.getDate()}`.padStart(2, "0");
  return `${datum.getFullYear()}-${maand}-${dag}`;
}

/** Leest yyyy-MM-dd als lokale datum; new Date("2026-08-18") is UTC-middernacht. */
export function leesDatum(waarde: string): Date {
  const [jaar, maand, dag] = waarde.split("-").map(Number);
  return new Date(jaar, maand - 1, dag);
}

/**
 * De factuurmomenten van één afspraak binnen een venster.
 *
 * Ze worden gerekend en niet opgeslagen: de afspraak is de waarheid, en rijen
 * met vooruit geplande data zouden alleen maar kunnen gaan afwijken zodra
 * iemand de ingangsdatum bijstelt. Alleen wat je afvinkt wordt bewaard.
 */
export function termijnen(start: string, cyclus: BillingCycle, van: Date, tot: Date): Termijn[] {
  const eerste = startOfDay(leesDatum(start));
  const uit: Termijn[] = [];

  // Vanaf de ingangsdatum vooruit stappen. Een jaarcontract levert hooguit een
  // handvol stappen op, een maandcontract twaalf per jaar — dat is goedkoper
  // dan vooruitrekenen met deling, en het houdt maandeindes correct.
  let punt = eerste;
  let stappen = 0;
  const MAX = 2000;

  while (isBefore(punt, van) && stappen < MAX) {
    punt = cyclus === "maandelijks" ? addMonths(eerste, ++stappen) : addYears(eerste, ++stappen);
  }

  while (!isAfter(punt, tot) && stappen < MAX) {
    uit.push({ datum: punt, sleutel: dagSleutel(punt) });
    punt = cyclus === "maandelijks" ? addMonths(eerste, ++stappen) : addYears(eerste, ++stappen);
  }

  return uit;
}

/**
 * Het eerstvolgende moment vanaf vandaag, of null als de afspraak leeg is.
 * Handig voor een klantregel: één datum zegt genoeg.
 */
export function volgendeTermijn(start: string | null, cyclus: BillingCycle | null): Date | null {
  if (!start || !cyclus) return null;
  const vandaag = startOfDay(new Date());
  const horizon = cyclus === "maandelijks" ? addMonths(vandaag, 13) : addYears(vandaag, 2);
  return termijnen(start, cyclus, vandaag, horizon)[0]?.datum ?? null;
}
