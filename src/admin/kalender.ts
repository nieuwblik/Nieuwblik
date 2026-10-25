import type { DragEvent } from "react";

import { PRIORITY_WEIGHT } from "@/admin/constants";
import type { TaskWithProject } from "@/admin/queries";

/** Het type dat een gesleepte taak meekrijgt; zo reageren de dagen alleen op taken. */
export const SLEEP_TYPE = "application/x-nieuwblik-taak";

/** Een taak oppakken om te slepen naar een dag in het rooster. */
export function begintSlepen(event: DragEvent, taakId: string) {
  event.dataTransfer.setData(SLEEP_TYPE, taakId);
  event.dataTransfer.effectAllowed = "move";
}

/** De dag van een deadline als yyyy-MM-dd, ook als er een tijd achter staat. */
export const dagVan = (datum: string) => datum.slice(0, 10);

/** Openstaande taken met deadline, gegroepeerd per dag en op urgentie. */
export function groepeerPerDag(tasks: TaskWithProject[]): Map<string, TaskWithProject[]> {
  const map = new Map<string, TaskWithProject[]>();
  for (const taak of tasks) {
    if (!taak.due_date || taak.status === "klaar") continue;
    const sleutel = dagVan(taak.due_date);
    map.set(sleutel, [...(map.get(sleutel) ?? []), taak]);
  }
  for (const lijst of map.values()) {
    lijst.sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
  }
  return map;
}
