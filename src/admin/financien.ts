import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

/** Een onderdeel van het overzicht: gelukt, of een melding waarom niet. */
export type Onderdeel<T> = { data: T } | { fout: string };

export interface MaandCijfers {
  /** "2026-10" */
  maand: string;
  omzet: number;
  kosten: number;
  winst: number;
}

export interface OpenFactuur {
  id: string;
  nummer: string | null;
  /** open, late, reminded, pending_payment */
  status: string;
  datum: string | null;
  vervaldatum: string | null;
  totaal: number;
  open: number;
  klant: string;
  url: string;
}

export interface Financien {
  ingesteld: true;
  bijgewerkt: string;
  moneybirdUrl: string;
  winstVerlies: Onderdeel<MaandCijfers[]>;
  bank: Onderdeel<{ totaal: number; rekeningen: { naam: string; soort: string; saldo: number }[] }>;
  facturen: Onderdeel<OpenFactuur[]>;
  crediteuren: Onderdeel<{ totaal: number }>;
}

/** Wat de pagina kan tonen: de cijfers, of waarom ze er (nog) niet zijn. */
export type FinancienStand = Financien | { ingesteld: false } | { nietLive: true };

/**
 * Het financiële overzicht uit Moneybird, via de edge function
 * moneybird-financien. Vijf minuten vers: Moneybird beperkt het aantal
 * verzoeken, en boekhoudcijfers veranderen niet per seconde.
 */
export function useFinancien() {
  return useQuery({
    queryKey: ["admin", "financien"],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<FinancienStand> => {
      const { data, error } = await supabase.functions.invoke("moneybird-financien", { body: {} });
      if (error) {
        const status = (error as { context?: Response }).context?.status;
        // Functie bestaat nog niet op de server: nog niet uitgerold. Zonder
        // functie stuurt de server ook geen CORS-koppen mee, en dan ziet de
        // browser alleen "Failed to send a request" in plaats van een 404.
        if (status === 404 || error.name === "FunctionsFetchError") return { nietLive: true };
        const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
        throw new Error(bericht?.error ?? error.message);
      }
      return data as FinancienStand;
    },
  });
}

export const heeftData = <T,>(o: Onderdeel<T> | undefined): o is { data: T } => Boolean(o && "data" in o);

/** "€ 1.250" of "€ 1.250,50"; negatief met een minteken. */
export function formatBedrag(bedrag: number, decimalen: "auto" | 0 = "auto"): string {
  const heel = decimalen === 0 || Math.round(bedrag * 100) % 100 === 0;
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: heel ? 0 : 2,
    maximumFractionDigits: heel ? 0 : 2,
  }).format(bedrag);
}
