import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAdminAuth } from "@/admin/AdminAuthContext";
import { useSaveTask } from "@/admin/queries";

/** Werktitel tot je hem op de taakpagina vervangt. */
export const NIEUWE_TAAK_TITEL = "Nieuwe taak";

/**
 * Maakt een lege taak aan en opent meteen de taakpagina.
 *
 * De taak bestaat dus al voordat je iets hebt ingevuld. Dat is bewust: zo is
 * er één plek waar je een taak invult, in plaats van een klein formulier
 * vooraf en een volledige pagina erna. De titel is verplicht in de database,
 * vandaar een werktitel die op de pagina meteen geselecteerd staat.
 */
export function useCreateTask() {
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const save = useSaveTask();

  const createTask = useCallback(
    async (projectId: string | null) => {
      try {
        const task = await save.mutateAsync({
          values: {
            title: NIEUWE_TAAK_TITEL,
            project_id: projectId,
            assigned_to: user?.id ?? null,
            created_by: user?.id ?? null,
          },
        });
        navigate(`/admin/taken/${task.id}`, { state: { nieuw: true } });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Taak aanmaken mislukt");
      }
    },
    [navigate, save, user?.id],
  );

  return { createTask, isPending: save.isPending };
}
