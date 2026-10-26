import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAdminAuth } from "@/admin/AdminAuthContext";
import { adminKeys } from "@/admin/queries";
import { supabase } from "@/integrations/supabase/client";

export interface Notitie {
  id: string;
  titel: string;
  inhoud: string;
  client_id: string | null;
  vastgezet: boolean;
  task_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

const tabel = () => supabase.from("notities");

export const notitiesKey = ["admin", "notities"] as const;

/** Bestaat de tabel nog niet, dan een duidelijke melding in plaats van een databasefout. */
function fout(bericht: string): Error {
  return new Error(
    /notities|schema cache|does not exist/i.test(bericht)
      ? "Notities werken pas als de migratie notities is uitgevoerd."
      : bericht,
  );
}

/** Alle notities, vastgezette eerst, dan laatst bewerkt bovenaan. */
export function useNotities() {
  return useQuery({
    queryKey: notitiesKey,
    retry: false,
    queryFn: async (): Promise<Notitie[]> => {
      const { data, error } = await tabel()
        .select("*")
        .order("vastgezet", { ascending: false })
        .order("updated_at", { ascending: false })
        .limit(1000);
      if (error) throw fout(error.message);
      return (data ?? []) as Notitie[];
    },
  });
}

/** Een notitie aanmaken; geeft de nieuwe terug. */
export function useNieuweNotitie() {
  const qc = useQueryClient();
  const { user } = useAdminAuth();
  return useMutation({
    mutationFn: async (waarden: Partial<Pick<Notitie, "titel" | "inhoud" | "client_id">> = {}): Promise<Notitie> => {
      const { data, error } = await tabel()
        .insert({ titel: "", inhoud: "", ...waarden, created_by: user?.id ?? null })
        .select()
        .single();
      if (error) throw fout(error.message);
      return data as Notitie;
    },
    onSuccess: (notitie) => {
      qc.setQueryData<Notitie[]>(notitiesKey, (oud) => [notitie, ...(oud ?? [])]);
    },
  });
}

/**
 * Velden van een notitie bijwerken. Meteen in de lijst gezet, zodat typen en
 * vastzetten direct zichtbaar zijn; de database zet de bewerktijd.
 */
export function useBewaarNotitie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, waarden }: { id: string; waarden: Partial<Notitie> }) => {
      const { error } = await tabel().update(waarden).eq("id", id);
      if (error) throw fout(error.message);
    },
    onMutate: ({ id, waarden }) => {
      const nu = new Date().toISOString();
      qc.setQueryData<Notitie[]>(notitiesKey, (oud) =>
        (oud ?? []).map((n) => (n.id === id ? { ...n, ...waarden, updated_at: nu } : n)),
      );
    },
  });
}

export function useVerwijderNotitie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await tabel().delete().eq("id", id);
      if (error) throw fout(error.message);
    },
    onSuccess: (_, id) => {
      qc.setQueryData<Notitie[]>(notitiesKey, (oud) => (oud ?? []).filter((n) => n.id !== id));
    },
  });
}

/**
 * Van een notitie (of een stuk ervan) een taak maken: de eerste regel wordt de
 * titel, de rest de omschrijving, bij dezelfde klant en voor jou. De taak
 * wordt bij de notitie bewaard, zodat je ernaartoe kunt.
 */
export function useNotitieNaarTaak() {
  const qc = useQueryClient();
  const { user } = useAdminAuth();
  return useMutation({
    mutationFn: async ({ notitie, tekst }: { notitie: Notitie; tekst: string }) => {
      const regels = tekst.trim().split("\n");
      const eerste = (regels[0] ?? "").replace(/^\s*(?:[-*•]|\[\s?\]|\d+[.)])\s*/, "").trim();
      const titel = (eerste || notitie.titel.trim() || "Taak uit notitie").slice(0, 300);
      const rest = regels.slice(1).join("\n").trim();
      const omschrijving = [rest, notitie.titel.trim() ? `Uit de notitie "${notitie.titel.trim()}".` : ""]
        .filter(Boolean)
        .join("\n\n");
      const { data: taak, error } = await supabase
        .from("tasks")
        .insert({
          title: titel,
          description: omschrijving || null,
          client_id: notitie.client_id,
          assigned_to: user?.id ?? null,
          created_by: user?.id ?? null,
        })
        .select("id, title")
        .single();
      if (error) throw new Error(error.message);
      const { error: koppelFout } = await tabel().update({ task_id: taak.id }).eq("id", notitie.id);
      if (koppelFout) throw fout(koppelFout.message);
      return taak;
    },
    onSuccess: (taak, { notitie }) => {
      qc.setQueryData<Notitie[]>(notitiesKey, (oud) =>
        (oud ?? []).map((n) => (n.id === notitie.id ? { ...n, task_id: taak.id } : n)),
      );
      void qc.invalidateQueries({ queryKey: adminKeys.tasks });
    },
  });
}
