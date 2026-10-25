import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Toon } from "@/admin/constants";
import { unwrapWerkstroom, werkstroomDb, type Aanvraag, type AanvraagStatus } from "@/admin/werkstroomDb";

export const aanvragenKey = ["admin", "aanvragen"] as const;

export const AANVRAAG_STATUS: Record<AanvraagStatus, { label: string; toon: Toon }> = {
  nieuw: { label: "Nieuw", toon: "info" },
  contact: { label: "In contact", toon: "warning" },
  offerte: { label: "Offerte", toon: "warning" },
  gewonnen: { label: "Gewonnen", toon: "success" },
  verloren: { label: "Verloren", toon: "neutral" },
};

export const AANVRAAG_STATUS_ORDER = Object.keys(AANVRAAG_STATUS) as AanvraagStatus[];

/** Nog in behandeling: nieuw, in contact of offerte. */
export const isOpenAanvraag = (a: Pick<Aanvraag, "status">) => a.status === "nieuw" || a.status === "contact" || a.status === "offerte";

/** Alle aanvragen, nieuwste eerst. Het zijn er hooguit een paar per week. */
export function useAanvragen() {
  return useQuery({
    queryKey: aanvragenKey,
    retry: false,
    queryFn: async (): Promise<Aanvraag[]> =>
      unwrapWerkstroom<Aanvraag[]>(
        await werkstroomDb.from("aanvragen").select("*").order("created_at", { ascending: false }).limit(500),
      ),
  });
}

export function useUpdateAanvraag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Pick<Aanvraag, "status" | "notitie" | "client_id">> }) => {
      const { error } = await werkstroomDb.from("aanvragen").update(values).eq("id", id);
      if (error) throw new Error(error.message);
    },
    // Meteen tonen, niet wachten op de server: een statuswissel moet direct voelen.
    onMutate: async ({ id, values }) => {
      await qc.cancelQueries({ queryKey: aanvragenKey });
      const vorige = qc.getQueryData<Aanvraag[]>(aanvragenKey);
      qc.setQueryData<Aanvraag[]>(aanvragenKey, (lijst) => lijst?.map((a) => (a.id === id ? { ...a, ...values } : a)));
      return { vorige };
    },
    onError: (_fout, _var, context) => {
      if (context?.vorige) qc.setQueryData(aanvragenKey, context.vorige);
    },
    onSettled: () => void qc.invalidateQueries({ queryKey: aanvragenKey }),
  });
}

export function useDeleteAanvraag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await werkstroomDb.from("aanvragen").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: aanvragenKey }),
  });
}
