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
  uitgaven?: Onderdeel<Uitgaven>;
  betalingen?: Onderdeel<Betaling[]>;
  offertes?: Onderdeel<Offerte[]>;
}

export interface Uitgaven {
  /** Excl. btw, het laatste jaar. */
  totaal: number;
  /** Inkoopfacturen en bonnetjes die nog niet zijn verwerkt (en dus niet meetellen). */
  nogTeVerwerken: number;
  perLeverancier: { naam: string; bedrag: number; aantal: number }[];
  perCategorie: { naam: string; bedrag: number }[];
  recent: {
    id: string;
    soort: string;
    leverancier: string;
    omschrijving: string | null;
    datum: string | null;
    /** Incl. btw, omgerekend naar euro. */
    bedrag: number;
    /** De valuta van de bon als die geen euro is, zoals "TRY". */
    valuta?: string | null;
    status: string;
    url: string;
  }[];
}

export interface Betaling {
  id: string;
  nummer: string | null;
  klant: string;
  bedrag: number;
  betaaldOp: string | null;
  url: string;
}

export interface Offerte {
  id: string;
  nummer: string | null;
  klant: string;
  /** open, late (verlopen), accepted */
  status: string;
  datum: string | null;
  vervaldatum: string | null;
  verstuurd: string | null;
  geaccepteerd: string | null;
  /** Excl. btw. */
  bedrag: number;
  url: string;
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
export function useFinancien({ verversen = false, actief = true }: { verversen?: boolean; actief?: boolean } = {}) {
  return useQuery({
    queryKey: FINANCIEN_KEY,
    enabled: actief,
    staleTime: 5 * 60 * 1000,
    // De schil van het portaal ververst elke vijf minuten, voor de betaalmeldingen.
    refetchInterval: verversen ? 5 * 60 * 1000 : false,
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

/** Na zoveel dagen zonder reactie verdient een offerte een herinnering. */
export const OFFERTE_WACHTTIJD = 14;

/** Hoe lang een verstuurde offerte al zonder antwoord is (0 als hij geaccepteerd is). */
export const offerteWachtDagen = (o: Offerte) =>
  o.status === "open" || o.status === "late"
    ? -(daysUntil((o.verstuurd ?? o.datum ?? "").slice(0, 10) || null) ?? 0)
    : 0;

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
    // Een functie die ouder is dan deze knop kent de actie niet.
    if (bericht?.error === "Onbekende actie.") {
      throw new Error("De serverfunctie kent deze actie nog niet. Publiceer de nieuwste versie in Lovable.");
    }
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
    mutationFn: (body: {
      /** Uren van één project, of (clientId) alle uren van een klant met en zonder project. */
      projectId?: string;
      clientId?: string;
      urenIds: string[];
      uurtarief: number;
      contactId?: string;
    }) =>
      roepAan<UrenFactuurResultaat>({ actie: "uren-factureren", ...body }),
    onSuccess: (resultaat) => {
      if (!resultaat.ok) return;
      void qc.invalidateQueries({ queryKey: ["admin", "uren"] });
      void qc.invalidateQueries({ queryKey: ["admin", "clients"] });
      void qc.invalidateQueries({ queryKey: FINANCIEN_KEY });
    },
  });
}

export interface BtwRubriek {
  /** "1a", "5b" */
  rubriek: string;
  /** Zoals Moneybird het tarief noemt, bijvoorbeeld "21% btw". */
  naam: string;
  /** Het bedrag waarover de btw is berekend. */
  grondslag: number;
  btw: number;
  voorbelasting: boolean;
}

export interface BtwKwartaalDetail extends BtwKwartaal {
  jaar: number;
  kwartaal: number;
  rubrieken: BtwRubriek[];
  /**
   * Documenten uit dit kwartaal die nog in de inbox van Moneybird staan, met
   * de btw erop (voor zover al uitgelezen). Ontbreekt bij een oudere functie.
   */
  nietVerwerkt?: {
    aantal: number;
    /** Geschatte Nederlandse btw op de uitgelezen documenten. */
    btw: number;
    zonderBedrag: number;
    /** Bonnen in een andere valuta; tellen niet mee in de schatting. */
    buitenland?: number;
    /** De documenten zelf, meeste btw eerst (hooguit twintig). */
    documenten?: {
      id: string;
      leverancier: string;
      datum: string;
      /** In de valuta van de bon. */
      bedrag: number;
      btw: number;
      valuta: string | null;
      url: string;
    }[];
  };
}

/** Btw per kwartaal met de rubrieken, dit jaar en vorig jaar. Pas opgehaald als het tabblad open is. */
export function useBtwOverzicht(actief: boolean) {
  return useQuery({
    queryKey: [...FINANCIEN_KEY, "btw"],
    enabled: actief,
    staleTime: 10 * 60 * 1000,
    retry: false,
    queryFn: () => roepAan<{ ok: true; kwartalen: BtwKwartaalDetail[] }>({ actie: "btw-overzicht" }),
  });
}

export interface OmzetJaar {
  jaar: number;
  lopend: boolean;
  omzet: number;
  kosten: number;
  winst: number;
  kwartalen: { kwartaal: number; omzet: number; kosten: number; winst: number }[];
}

/** Omzet, kosten en winst per jaar en kwartaal, vier jaar terug. Pas opgehaald als het tabblad open is. */
export function useOmzetHistorie(actief: boolean) {
  return useQuery({
    queryKey: [...FINANCIEN_KEY, "omzet"],
    enabled: actief,
    staleTime: 10 * 60 * 1000,
    retry: false,
    queryFn: () => roepAan<{ ok: true; jaren: OmzetJaar[] }>({ actie: "omzet-historie" }),
  });
}

export type BankSoort = "met-bon" | "zonder-bon" | "niet-verwerkt" | "geen-kosten";

export interface BankTransactie {
  id: string;
  datum: string;
  bedrag: number;
  tegenpartij: string;
  omschrijving: string | null;
  /** De grootboekrekening waarop hij geboekt is, als dat al gebeurd is. */
  categorie: string | null;
  soort: BankSoort;
}

export interface BankGroep {
  naam: string;
  bedrag: number;
  aantal: number;
  soorten: BankSoort[];
  transacties: BankTransactie[];
}

export interface BankKwartaal {
  afgeschreven: { bedrag: number; aantal: number };
  metBon: { bedrag: number; aantal: number };
  zonderBon: { bedrag: number; aantal: number };
  nietVerwerkt: { bedrag: number; aantal: number };
  geenKosten: { bedrag: number; aantal: number };
  /** Zonder bon of niet verwerkt, per tegenpartij, grootste eerst. */
  teControleren: BankGroep[];
  /** Privé, belastingen en overboekingen: geen kosten, dus ook geen bon nodig. */
  geenKostenLijst: BankGroep[];
}

/** Afschrijvingen van één kwartaal en of er een bon bij zit. */
export function useBankKwartaal(jaar: number, kwartaal: number) {
  return useQuery({
    queryKey: [...FINANCIEN_KEY, "bank", jaar, kwartaal],
    staleTime: 10 * 60 * 1000,
    retry: false,
    queryFn: () => roepAan<BankKwartaal & { ok: true }>({ actie: "bank-zonder-bon", jaar, kwartaal }),
  });
}

export type HostingResultaat =
  | { ok: true; gemaakt: { naam: string; url: string }[]; overgeslagen: { naam: string; reden: string }[] }
  | { ok: false; kiesContact: MoneybirdContact[] };

/**
 * Hostingtermijnen als conceptfactuur in Moneybird. Bij één termijn zonder
 * duidelijk contact komen de kandidaten terug om uit te kiezen; bij meerdere
 * worden die overgeslagen en gemeld.
 */
export function useHostingFactureren() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { items: { clientId: string; periodDate: string }[]; contactId?: string }) =>
      roepAan<HostingResultaat>({ actie: "hosting-factureren", ...body }),
    onSuccess: (resultaat) => {
      if (!resultaat.ok) return;
      void qc.invalidateQueries({ queryKey: ["admin", "gefactureerd"] });
      void qc.invalidateQueries({ queryKey: ["admin", "clients"] });
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

/** "Toptas Consultancy B.V." en "toptas consultancy" zijn dezelfde klant. */
export const klantSleutel = (naam: string) =>
  naam
    .toLowerCase()
    .replace(/\b(b\.?v\.?|v\.?o\.?f\.?|n\.?v\.?|holding)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

/** De klant in het portaal bij een Moneybird-naam: op e-mailadres, anders op naam. */
export function zoekKlantBij<K extends { name: string; email: string | null }>(
  bron: { naam: string; email?: string | null | undefined },
  clients: K[],
): K | null {
  const email = bron.email?.toLowerCase();
  if (email) {
    const opMail = clients.find((c) => c.email?.toLowerCase() === email);
    if (opMail) return opMail;
  }
  const naam = klantSleutel(bron.naam);
  return naam ? (clients.find((c) => klantSleutel(c.name) === naam) ?? null) : null;
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

export interface KlantVoorstel {
  clientId: string;
  klant: string;
  contact: MoneybirdContact;
  velden: Partial<Record<"email" | "phone" | "city" | "contact_name", string>>;
}

/** Voorstellen om ontbrekende klantgegevens uit Moneybird te vullen. Pas opgehaald als het venster open is. */
export function useKlantenAanvullen(actief: boolean) {
  return useQuery({
    queryKey: [...FINANCIEN_KEY, "klanten-aanvullen"],
    enabled: actief,
    staleTime: 0,
    retry: false,
    queryFn: () =>
      roepAan<{
        ok: true;
        voorstellen: KlantVoorstel[];
        zonderContact: { clientId: string; naam: string }[];
        twijfel: { clientId: string; naam: string }[];
      }>({
        actie: "klanten-aanvullen",
      }),
  });
}

export interface MoneybirdContactVolledig extends MoneybirdContact {
  telefoon: string | null;
  plaats: string | null;
  persoon: string | null;
}

/** Alle Moneybird-contacten, om een klant zelf te koppelen. Pas opgehaald als nodig. */
export function useMoneybirdContacten(actief: boolean) {
  return useQuery({
    queryKey: [...FINANCIEN_KEY, "contacten"],
    enabled: actief,
    staleTime: 10 * 60 * 1000,
    retry: false,
    queryFn: () => roepAan<{ ok: true; contacten: MoneybirdContactVolledig[] }>({ actie: "moneybird-contacten" }),
  });
}

export interface HostingVoorstel {
  id: string;
  contact: { id: string; naam: string };
  clientId: string | null;
  klantNaam: string | null;
  alIngesteld: boolean;
  /** null: een frequentie die het portaal niet kent (bijvoorbeeld per kwartaal). */
  cyclus: "maandelijks" | "jaarlijks" | null;
  frequentie: string;
  bedragCenten: number;
  start: string | null;
  volgende: string | null;
  omschrijving: string | null;
  url: string;
}

/** Actieve terugkerende facturen in Moneybird, als voorstel voor hostingcontracten. */
export function useHostingUitMoneybird(actief: boolean) {
  return useQuery({
    queryKey: [...FINANCIEN_KEY, "hosting-uit-moneybird"],
    enabled: actief,
    staleTime: 0,
    retry: false,
    queryFn: () => roepAan<{ ok: true; voorstellen: HostingVoorstel[] }>({ actie: "hosting-uit-moneybird" }),
  });
}

/**
 * Een hostingcontract dat Moneybird zelf factureert (ingelezen uit een
 * terugkerende factuur). Het portaal zet daar geen "nog te factureren" bij,
 * zodat er nooit een tweede factuur komt.
 */
export const MONEYBIRD_NOTITIE = "Moneybird: terugkerende factuur";
export const factureertMoneybird = (c: { billing_note: string | null }) =>
  Boolean(c.billing_note?.startsWith(MONEYBIRD_NOTITIE));

export interface MoneybirdProduct {
  id: string;
  naam: string;
  omschrijving: string;
  prijs: number;
  btwId: string | null;
}

export interface BtwTarief {
  id: string;
  naam: string;
  percentage: number;
}

/** Producten en btw-tarieven uit Moneybird, voor het opstellen van een offerte of factuur. */
export function useDocumentGegevens(actief: boolean) {
  return useQuery({
    queryKey: [...FINANCIEN_KEY, "document-gegevens"],
    enabled: actief,
    staleTime: 30 * 60 * 1000,
    retry: false,
    queryFn: () =>
      roepAan<{ ok: true; producten: MoneybirdProduct[]; btwTarieven: BtwTarief[] }>({ actie: "document-gegevens" }),
  });
}

export interface DocumentRegel {
  omschrijving: string;
  aantal: number;
  prijs: number;
  btwId: string | null;
  productId: string | null;
}

export type DocumentOntvanger =
  | { soort: "contact"; contactId: string }
  | { soort: "klant"; clientId: string }
  | { soort: "nieuw"; bedrijf: string; naam: string; email: string; telefoon: string };

export type DocumentResultaat =
  | { ok: true; verstuurd: boolean; url: string }
  | { ok: false; kiesContact: MoneybirdContact[] };

/** Een offerte of factuur aanmaken in Moneybird, als concept of meteen versturen. */
export function useDocumentMaken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      soort,
      ontvanger,
      regels,
      referentie,
      toelichting,
      versturen,
    }: {
      soort: "offerte" | "factuur";
      ontvanger: DocumentOntvanger;
      regels: DocumentRegel[];
      referentie: string;
      toelichting: string;
      versturen: boolean;
    }) =>
      roepAan<DocumentResultaat>({
        actie: "document-maken",
        soort,
        regels,
        referentie,
        toelichting,
        versturen,
        ...(ontvanger.soort === "contact"
          ? { contactId: ontvanger.contactId }
          : ontvanger.soort === "klant"
            ? { clientId: ontvanger.clientId }
            : { nieuwContact: ontvanger }),
      }),
    onSuccess: (r) => {
      if (r.ok) void qc.invalidateQueries({ queryKey: FINANCIEN_KEY });
    },
  });
}

export type OfferteWat = "versturen" | "pdf" | "accepteren" | "afwijzen" | "archiveren" | "factureren";

/** Iets doen met een offerte in Moneybird. Behalve de pdf ververst daarna het overzicht. */
export function useOfferteActie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, wat }: { id: string; wat: OfferteWat }) =>
      roepAan<{ ok?: boolean; url?: string }>({ actie: "offerte-actie", id, wat }),
    onSuccess: (_r, { wat }) => {
      if (wat !== "pdf") void qc.invalidateQueries({ queryKey: FINANCIEN_KEY });
    },
  });
}

// ------------------------------------------------------------------ bonnen

export interface BonResultaat {
  ok: true;
  gelukt: { naam: string; url: string }[];
  mislukt: { naam: string; reden: string }[];
}

/**
 * Foto's of pdf's van bonnen en inkoopfacturen naar de inbox van Moneybird.
 * Als formulier, niet als JSON: de bestanden gaan rechtstreeks mee.
 */
export function useBonnenUploaden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ bestanden, omschrijving }: { bestanden: File[]; omschrijving: string }): Promise<BonResultaat> => {
      const form = new FormData();
      form.append("actie", "bon-uploaden");
      if (omschrijving.trim()) form.append("omschrijving", omschrijving.trim());
      for (const b of bestanden) form.append("bestand", b, b.name);
      const { data, error } = await supabase.functions.invoke("moneybird-financien", { body: form });
      if (error) {
        const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
        if (bericht?.error === "Onbekende actie.") {
          throw new Error("De serverfunctie kent het uploaden nog niet. Publiceer de nieuwste versie in Lovable.");
        }
        throw new Error(bericht?.error ?? error.message);
      }
      // Een oude functie leest het formulier niet en geeft het overzicht terug.
      if (!data || typeof data !== "object" || !("gelukt" in data)) {
        throw new Error("De serverfunctie kent het uploaden nog niet. Publiceer de nieuwste versie in Lovable.");
      }
      return data as BonResultaat;
    },
    // Het btw-overzicht telt de documenten die nog verwerkt moeten worden.
    onSuccess: () => void qc.invalidateQueries({ queryKey: FINANCIEN_KEY }),
  });
}

// ------------------------------------------------------------------ hosting en contacten

type MetContactKeuze<T> = ({ ok: true } & T) | { ok: false; kiesContact: MoneybirdContact[] };

/** Een hostingcontract als terugkerende factuur in Moneybird. */
export function useTerugkerendMaken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { clientId: string; eersteFactuur: string; automatischVersturen: boolean; contactId?: string }) =>
      roepAan<MetContactKeuze<{ url: string }>>({ actie: "terugkerend-maken", ...body }),
    onSuccess: (r) => {
      if (!r.ok) return;
      void qc.invalidateQueries({ queryKey: ["admin", "clients"] });
      void qc.invalidateQueries({ queryKey: FINANCIEN_KEY });
    },
  });
}

/** Een link voor een incassomachtiging via Moneybird Payments, 14 dagen geldig. */
export function useMachtigingLink() {
  return useMutation({
    mutationFn: (body: { clientId: string; contactId?: string }) =>
      roepAan<MetContactKeuze<{ url: string }>>({ actie: "machtiging-link", ...body }),
  });
}

/**
 * Wijzigingen aan een klant ook in Moneybird zetten (e-mail, telefoon, plaats,
 * contactpersoon). Geeft terug welke velden er in Moneybird veranderd zijn.
 */
export const contactBijwerken = (clientId: string) =>
  roepAan<{ ok: true; velden: string[] }>({ actie: "contact-bijwerken", clientId });

/** Een contact in Moneybird archiveren; niet als het aan een klant gekoppeld is. */
export function useContactArchiveren() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contactId: string) => roepAan<{ ok: true }>({ actie: "contact-archiveren", contactId }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: [...FINANCIEN_KEY, "contacten"] }),
  });
}

export type ContactAanmakenResultaat =
  | { ok: true; soort: "gekoppeld" | "aangemaakt" | "al-gekoppeld"; contact: MoneybirdContact }
  | { ok: false; kiesContact: MoneybirdContact[] };

/**
 * Een klant uit het portaal in Moneybird zetten. Zonder keuze zoekt de
 * serverfunctie eerst een bestaand contact; met contactId koppelt hij aan dat
 * contact, met nieuw: true maakt hij hoe dan ook een nieuw contact.
 */
export function useContactAanmaken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { clientId: string; contactId?: string; nieuw?: boolean }) =>
      roepAan<ContactAanmakenResultaat>({ actie: "contact-aanmaken", ...body }),
    onSuccess: (r) => {
      if (!r.ok) return;
      void qc.invalidateQueries({ queryKey: ["admin", "clients"] });
      void qc.invalidateQueries({ queryKey: [...FINANCIEN_KEY, "contacten"] });
    },
  });
}
