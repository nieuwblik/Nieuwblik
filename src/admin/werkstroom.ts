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
