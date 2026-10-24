import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { daysUntil } from "@/admin/format";

const FINANCIEN_KEY = ["admin", "financien"] as const;

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
  /** Waar Moneybird facturen en herinneringen heen mailt; null als de klant geen adres heeft. */
  email?: string | null;
  /** Creditfactuur: een tegoed voor de klant, met een negatief openstaand bedrag. */
  credit?: boolean;
  /** Heeft de workflow en huisstijl die Moneybird nodig heeft om een herinnering te sturen. */
  kanHerinneren?: boolean;
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
  /** Ontbreekt bij een oudere versie van de serverfunctie. */
  btw?: Onderdeel<BtwKwartaal[]>;
}

export interface BtwKwartaal {
  /** "Q3 2026" */
  label: string;
  /** Het kwartaal loopt nog; de bedragen groeien mee. */
  lopend: boolean;
  /** Uiterlijke datum voor aangifte en betaling (YYYY-MM-DD). */
  deadline: string;
  verschuldigd: number;
  voorbelasting: number;
  /** Verschuldigd min voorbelasting; negatief is terugkrijgen. */
  afdragen: number;
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
    queryKey: FINANCIEN_KEY,
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

/** Tot dit bedrag mag een rest worden afgeboekt; de serverfunctie gebruikt hetzelfde getal. */
export const AFBOEK_GRENS = 5;

export const isCredit = (f: OpenFactuur) => Boolean(f.credit) || f.open < 0;

/** Over de vervaldatum en nog niet betaald. Een creditfactuur is nooit te laat. */
export const isTeLaatFactuur = (f: OpenFactuur) =>
  !isCredit(f) && f.status !== "pending_payment" && (f.status === "late" || (daysUntil(f.vervaldatum) ?? 0) < 0);

/** Een deels betaalde factuur met een rest die je eerder afboekt dan herinnert, zoals € 0,02. */
export const isKleineRest = (f: OpenFactuur) => !isCredit(f) && f.open > 0 && f.open <= AFBOEK_GRENS && f.open < f.totaal;

/** Een herinnering kan bij een te late factuur die Moneybird kan versturen. */
export const kanHerinneren = (f: OpenFactuur) => isTeLaatFactuur(f) && f.kanHerinneren !== false && f.email !== null;

export type FactuurActie =
  | { actie: "herinnering"; ids: string[] }
  | { actie: "betaling"; id: string; bedrag: number; datum: string }
  | { actie: "afboeken"; id: string }
  | { actie: "pdf"; id: string };

/**
 * Een actie van de serverfunctie aanroepen. Een oudere versie van de functie
 * kent geen acties en geeft dan gewoon het overzicht terug; dat mag niet als
 * "gelukt" doorgaan.
 */
async function roepAan<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("moneybird-financien", { body });
  if (error) {
    const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
    throw new Error(bericht?.error ?? error.message);
  }
  if (!data || typeof data !== "object" || "bijgewerkt" in data || "ingesteld" in data) {
    throw new Error("De serverfunctie kent deze actie nog niet. Publiceer de nieuwste versie in Lovable.");
  }
  return data as T;
}

/**
 * Iets doen met een openstaande factuur in Moneybird. Na een herinnering,
 * betaling of afboeking wordt het overzicht opnieuw opgehaald.
 */
export function useFactuurActie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: FactuurActie) => roepAan<{ ok?: boolean; url?: string }>(body),
    onSuccess: (_data, body) => {
      if (body.actie !== "pdf") void qc.invalidateQueries({ queryKey: FINANCIEN_KEY });
    },
  });
}

export interface MoneybirdContact {
  id: string;
  naam: string;
  email: string | null;
  url: string;
}

export interface KlantFinancien {
  /** null: geen (uniek) contact gevonden in Moneybird. */
  contact: MoneybirdContact | null;
  omzetDitJaar?: number;
  open?: number;
  openAantal?: number;
  teLaat?: number;
  /** Gemiddeld aantal dagen tussen factuurdatum en betaling, het laatste jaar. */
  betaaldagen?: number | null;
  facturen?: { id: string; nummer: string | null; status: string; datum: string | null; totaal: number; open: number; url: string }[];
}

/**
 * Facturen en betaalgedrag van één klant, voor de klantpagina. Alleen als
 * Moneybird gekoppeld en de functie live is; anders blijft het stil.
 */
export function useKlantFinancien(clientId: string | undefined) {
  const { data: stand } = useFinancien();
  const live = Boolean(stand && "bijgewerkt" in stand);
  return useQuery({
    queryKey: [...FINANCIEN_KEY, "klant", clientId ?? ""],
    enabled: Boolean(clientId) && live,
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: () => roepAan<KlantFinancien>({ actie: "klant", clientId }),
  });
}

export type UrenFactuurResultaat =
  | { ok: true; factuurUrl: string; waarschuwing?: string }
  | { ok: false; kiesContact: MoneybirdContact[] };

/**
 * Uren van een project als conceptfactuur in Moneybird. Komt er geen uniek
 * contact uit, dan krijg je de kandidaten terug om uit te kiezen.
 */
export function useUrenFactureren() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { projectId: string; urenIds: string[]; uurtarief: number; contactId?: string }) =>
      roepAan<UrenFactuurResultaat>({ actie: "uren-factureren", ...body }),
    onSuccess: (resultaat) => {
      if (!resultaat.ok) return;
      void qc.invalidateQueries({ queryKey: ["admin", "uren"] });
      void qc.invalidateQueries({ queryKey: ["admin", "clients"] });
      void qc.invalidateQueries({ queryKey: FINANCIEN_KEY });
    },
  });
}

/** Uren weer vrijgeven als hun conceptfactuur in Moneybird is weggegooid. */
export function useUrenVrijgeven() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (factuurId: string) => roepAan<{ ok: true }>({ actie: "uren-vrijgeven", factuurId }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "uren"] }),
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
