import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht").max(100, "Naam mag maximaal 100 karakters zijn"),
  email: z.string().trim().email("Ongeldig e-mailadres").max(255, "E-mail mag maximaal 255 karakters zijn"),
  company: z.string().trim().max(100, "Bedrijfsnaam mag maximaal 100 karakters zijn").optional(),
  rating: z.number().int().min(1, "Selecteer een beoordeling").max(5, "Maximale beoordeling is 5"),
  review_text: z.string().trim().min(10, "Review moet minimaal 10 karakters bevatten").max(1000, "Review mag maximaal 1000 karakters zijn"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
