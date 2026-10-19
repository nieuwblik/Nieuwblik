import { z } from "zod";

export const briefingSchema = z.object({
  bedrijf: z.string().trim().min(2, "Vertel kort wat voor bedrijf je hebt").max(200),
  plaats: z.string().trim().max(80).optional().default(""),
  doelen: z.string().trim().min(10, "Beschrijf je doelen in minimaal 10 tekens").max(1500),
  huidigeSite: z.string().trim().max(200).optional().default(""),
  functies: z.string().trim().max(800).optional().default(""),
  budget: z.string().trim().max(60).optional().default(""),
  start: z.string().trim().max(60).optional().default(""),
});

export type BriefingInput = z.infer<typeof briefingSchema>;

/** Maximaal aantal briefings per IP per uur. */
export const BRIEFING_LIMIET_PER_UUR = 5;
