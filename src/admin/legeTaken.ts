import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { adminKeys } from "@/admin/queries";
import { NIEUWE_TAAK_TITEL } from "@/admin/useCreateTask";

/**
 * Een nieuwe taak bestaat al voordat je iets invult (zie useCreateTask). Haak
 * je af, dan bleef er een lege "Nieuwe taak" staan. Die ruimen we op, maar
 * alleen als er echt niets aan is gedaan: nog de werktitel, geen omschrijving,
 * deadline of herhaling, nog te doen met normale prioriteit, en geen stappen,
 * bestanden of uren eraan. Steeds vers uit de database gelezen, zodat een
 * titel die net wordt opgeslagen nooit verloren gaat.
 */
export async function ruimLegeTaakOp(id: string): Promise<boolean> {
  const { data: taak } = await supabase
    .from("tasks")
    .select("title, description, due_date, herhaling, status, priority")
    .eq("id", id)
    .maybeSingle();
  if (
    !taak ||
    taak.title !== NIEUWE_TAAK_TITEL ||
    taak.description?.trim() ||
    taak.due_date ||
    taak.herhaling ||
    taak.status !== "todo" ||
    taak.priority !== "normaal"
  ) {
    return false;
  }
  const [{ count: stappen }, { count: bestanden }, { count: uren }] = await Promise.all([
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("parent_task_id", id),
    supabase.from("task_files").select("id", { count: "exact", head: true }).eq("task_id", id),
    supabase.from("time_entries").select("id", { count: "exact", head: true }).eq("task_id", id),
  ]);
  if ((stappen ?? 0) > 0 || (bestanden ?? 0) > 0 || (uren ?? 0) > 0) return false;
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  return !error;
}

/**
 * Eén keer per bezoek: lege taken van jezelf die ouder zijn dan een uur
 * opruimen. Vangt op wat de taakpagina niet zelf kon opruimen, zoals een
 * tabblad dat werd gesloten.
 */
export function useLegeTakenOpruimen(actief: boolean) {
  const { user } = useAdminAuth();
  const qc = useQueryClient();
  const gedaan = useRef(false);

  useEffect(() => {
    if (!actief || !user || gedaan.current) return;
    gedaan.current = true;
    void (async () => {
      const uurGeleden = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("tasks")
        .select("id")
        .eq("title", NIEUWE_TAAK_TITEL)
        .eq("created_by", user.id)
        .lt("created_at", uurGeleden)
        .limit(50);
      let weg = 0;
      for (const { id } of data ?? []) if (await ruimLegeTaakOp(id)) weg += 1;
      if (weg > 0) void qc.invalidateQueries({ queryKey: adminKeys.tasks });
    })();
  }, [actief, user, qc]);
}
