import type { Tables } from "@/integrations/supabase/types";

/**
 * Types voor de tabellen uit de migratie portaal_werkstroom (aanvragen,
 * taak_signalen, website_controles en tasks.herhaling). De database bewaart
 * status en herhaling als tekst met een controle; hier staan de toegestane
 * waarden, zodat de code ze niet kan verwarren.
 */
export type AanvraagStatus = "nieuw" | "contact" | "offerte" | "gewonnen" | "verloren";

export type Aanvraag = Omit<Tables<"aanvragen">, "status"> & { status: AanvraagStatus };

export type Herhaling = "wekelijks" | "maandelijks" | "kwartaal" | "jaarlijks";

export type WebsiteControle = Tables<"website_controles">;

/**
 * tasks.client_id uit de migratie taken_klant: een taak bij een klant zonder
 * project. Optioneel tot de migratie is uitgevoerd en de types opnieuw zijn
 * gemaakt; daarna kan dit weg en komt het veld uit Tables<"tasks">.
 */
export interface TaakKlant {
  client_id?: string | null;
}

/** Staat de kolom er al? Een select("*") geeft hem dan bij elke rij mee. */
export const heeftKlantKolom = (taken: readonly object[]) => taken.length > 0 && "client_id" in taken[0]!;
