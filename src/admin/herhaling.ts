import { addMonths, addWeeks, addYears, format, isValid, parseISO } from "date-fns";

import type { Herhaling } from "@/admin/werkstroom";

export const HERHALING: Record<Herhaling, string> = {
  wekelijks: "Elke week",
  maandelijks: "Elke maand",
  kwartaal: "Elk kwartaal",
  jaarlijks: "Elk jaar",
};

export const HERHALING_ORDER = Object.keys(HERHALING) as Herhaling[];

/**
 * De deadline van de volgende keer: één periode na de huidige deadline, of na
 * vandaag als de taak geen deadline had. Ligt die datum al in het verleden
 * (lang na de deadline afgerond), dan schuift hij door tot vandaag of later.
 */
export function volgendeDeadline(huidig: string | null, herhaling: Herhaling): string {
  const stap = (d: Date) =>
    herhaling === "wekelijks"
      ? addWeeks(d, 1)
      : herhaling === "maandelijks"
        ? addMonths(d, 1)
        : herhaling === "kwartaal"
          ? addMonths(d, 3)
          : addYears(d, 1);
  const vandaag = new Date();
  vandaag.setHours(0, 0, 0, 0);
  const basis = huidig && isValid(parseISO(huidig)) ? parseISO(huidig) : vandaag;
  let volgende = stap(basis);
  while (volgende < vandaag) volgende = stap(volgende);
  return format(volgende, "yyyy-MM-dd");
}
