import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { adminKeys, type Client } from "@/admin/queries";

/**
 * Kolommen uit de migratie mailing_uitbreiding (concepten, inplannen,
 * spreiden, opmaak en afleverstatus). Optioneel tot de migratie is uitgevoerd
 * en de types opnieuw zijn gemaakt; daarna kan dit weg en komen de velden uit
 * Tables<"mailings">, Tables<"mailing_ontvangers"> en Tables<"clients">.
 */
export interface MailingUitbreiding {
  status?: MailingStatus;
  ingepland_op?: string | null;
  spreiding_minuten?: number;
  persoonlijk?: boolean;
  afmeldkop?: boolean;
  klant_ids?: string[] | null;
  updated_at?: string;
}

export interface KlantMailing {
  email_onbestelbaar_op?: string | null;
}

export type MailingStatus = "concept" | "ingepland" | "verstuurd" | "geannuleerd";

/** Stand per ontvanger, zoals send-mailing en de Resend-meldingen hem zetten. */
export type OntvangerStatus =
  | "ingepland"
  | "verstuurd"
  | "vertraagd"
  | "afgeleverd"
  | "gebounced"
  | "klacht"
  | "mislukt"
  | "geannuleerd";

export interface MailingOntvanger {
  id: string;
  mailing_id: string;
  email: string;
  naam: string | null;
  status: OntvangerStatus;
  fout: string | null;
  gepland_op?: string | null;
}

/** Het adres kan geen mailing krijgen: geen adres, of eerder onbestelbaar. */
export const kanMailen = (k: Client & KlantMailing) => Boolean(k.email?.includes("@")) && !k.email_onbestelbaar_op;

/** De velden die in een mailing worden ingevuld, net als in send-mailing. */
export function mailVelden(k: Pick<Client, "name" | "contact_name" | "website">) {
  const contact = (k.contact_name ?? "").trim();
  const website = (k.website ?? "").trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  return {
    naam: contact || k.name,
    voornaam: contact ? contact.split(/\s+/)[0]! : k.name,
    bedrijf: k.name,
    website: website || "je website",
  };
}

export const vulMailIn = (tekst: string, v: ReturnType<typeof mailVelden>) =>
  tekst
    .replace(/\{naam\}/g, v.naam)
    .replace(/\{voornaam\}/g, v.voornaam)
    .replace(/\{bedrijf\}/g, v.bedrijf)
    .replace(/\{website\}/g, v.website);

/** De ontvangers van de laatste mailingen, voor de afleverstatus per mailing. */
export function useMailingOntvangers(mailingIds: string[]) {
  return useQuery({
    queryKey: [...adminKeys.mailings, "ontvangers", mailingIds.join(",")] as const,
    enabled: mailingIds.length > 0,
    queryFn: async (): Promise<MailingOntvanger[]> => {
      const { data, error } = await supabase
        .from("mailing_ontvangers")
        .select("*")
        .in("mailing_id", mailingIds)
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return data as unknown as MailingOntvanger[];
    },
  });
}

export interface ConceptGegevens {
  onderwerp: string;
  tekst: string;
  statussen: string[];
  klant_ids: string[];
  ingepland_op: string | null;
  spreiding_minuten: number;
  persoonlijk: boolean;
  afmeldkop: boolean;
}

/** Een concept opslaan (nieuw, of het bestaande bijwerken). Geeft het id terug. */
export function useConceptOpslaan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, gegevens, userId }: { id: string | null; gegevens: ConceptGegevens; userId: string | null }) => {
      // De nieuwe kolommen staan nog niet in de gegenereerde types (zie MailingUitbreiding).
      const rij = { ...gegevens, status: "concept", verstuurd_door: userId, updated_at: new Date().toISOString() };
      const { data, error } = id
        ? await supabase.from("mailings").update(rij as TablesUpdate<"mailings">).eq("id", id).select("id").single()
        : await supabase.from("mailings").insert(rij as TablesInsert<"mailings">).select("id").single();
      if (error) {
        throw new Error(
          /status|column|schema cache/i.test(error.message)
            ? "Concepten werken pas als de migratie mailing_uitbreiding is uitgevoerd."
            : error.message,
        );
      }
      return data.id;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.mailings }),
  });
}

export function useConceptWeggooien() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mailings").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.mailings }),
  });
}

/** De mails van een ingeplande mailing die nog niet weg zijn, annuleren bij Resend. */
export function useMailingAnnuleren() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mailingId: string): Promise<{ geannuleerd: number; alWeg: number }> => {
      const { data, error } = await supabase.functions.invoke("send-mailing", { body: { annuleer: mailingId } });
      if (error) {
        const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
        throw new Error(bericht?.error ?? error.message);
      }
      return data as { geannuleerd: number; alWeg: number };
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.mailings }),
  });
}
