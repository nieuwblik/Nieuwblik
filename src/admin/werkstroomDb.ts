import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

/**
 * Tabellen uit de migratie portaal_werkstroom (aanvragen, taak_signalen,
 * website_controles en tasks.herhaling) staan nog niet in de gegenereerde
 * types. Tot die migratie is uitgevoerd en de types opnieuw zijn gemaakt,
 * gaan de vragen voor die tabellen via deze ongetypeerde client; de
 * vormen staan hieronder. Daarna kan dit terug naar de gewone client.
 */
export const werkstroomDb = supabase as unknown as SupabaseClient;

export type AanvraagStatus = "nieuw" | "contact" | "offerte" | "gewonnen" | "verloren";

export interface Aanvraag {
  id: string;
  naam: string;
  bedrijf: string | null;
  email: string;
  telefoon: string | null;
  onderwerp: string | null;
  bericht: string | null;
  status: AanvraagStatus;
  notitie: string | null;
  client_id: string | null;
  created_at: string;
  updated_at: string;
}

export type Herhaling = "wekelijks" | "maandelijks" | "kwartaal" | "jaarlijks";

export interface WebsiteControle {
  id: string;
  project_id: string;
  url: string;
  online: boolean;
  status_code: number | null;
  laadtijd_ms: number | null;
  ssl_geldig_tot: string | null;
  domein_geldig_tot: string | null;
  fout: string | null;
  created_at: string;
}

/** Ontbrekende tabel of kolom: de migratie is nog niet uitgevoerd. */
export function isMigratieNodig(error: unknown): boolean {
  const tekst = error instanceof Error ? error.message : String((error as { message?: string })?.message ?? error ?? "");
  return /schema cache|does not exist|PGRST20[45]|42P01|42703|column/i.test(tekst);
}

export function unwrapWerkstroom<T>({ data, error }: { data: unknown; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}
