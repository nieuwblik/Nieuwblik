import type { Database } from "@/integrations/supabase/types";

export type ProjectStatus = Database["public"]["Enums"]["project_status"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];
export type ClientStatus = Database["public"]["Enums"]["client_status"];
export type Priority = Database["public"]["Enums"]["priority_level"];
export type UpdateKind = Database["public"]["Enums"]["update_kind"];

/**
 * Statuskleuren met een vaste betekenis, overal in het portaal dezelfde:
 *
 * - danger: te laat, urgent, mislukt
 * - warning: hoog, wacht op klant, te factureren
 * - info: bezig, in productie
 * - success: klaar, live, gefactureerd, verstuurd
 * - neutral: te doen, normaal, laag, gepauzeerd
 *
 * Kleur staat nooit alleen: elke pil heeft een tekstlabel. De tinten zelf
 * staan als tokens in styles.css (--s-*), met een lichte en een donkere
 * variant; hier staan alleen de klassen, bewust statisch zodat de JIT ze
 * meepakt.
 */
export type Toon = "danger" | "warning" | "info" | "success" | "neutral";

export const TOON: Record<Toon, { pil: string; stip: string; tekst: string; cel: string }> = {
  danger: {
    pil: "bg-danger/10 text-danger-ink border-danger/20",
    stip: "bg-danger",
    tekst: "text-danger-ink",
    cel: "bg-danger/10 border-danger/30",
  },
  warning: {
    pil: "bg-warning/10 text-warning-ink border-warning/25",
    stip: "bg-warning",
    tekst: "text-warning-ink",
    cel: "bg-warning/10 border-warning/30",
  },
  info: {
    pil: "bg-info/10 text-info-ink border-info/20",
    stip: "bg-info",
    tekst: "text-info-ink",
    cel: "bg-info/10 border-info/30",
  },
  success: {
    pil: "bg-success/10 text-success-ink border-success/20",
    stip: "bg-success",
    tekst: "text-success-ink",
    cel: "bg-success/10 border-success/30",
  },
  neutral: {
    pil: "bg-neutral/10 text-neutral-ink border-neutral/20",
    stip: "bg-neutral",
    tekst: "text-neutral-ink",
    cel: "bg-neutral/10 border-neutral/25",
  },
};

interface Meta {
  label: string;
  toon: Toon;
}

/** Statusmeta plus een eigen tint per fase, voor grafieken en stippen. */
interface FaseMeta extends Meta {
  /**
   * Fases zijn categorieën in de volgorde van het werk, dus ze krijgen één
   * palet in plaats van negen losse kleuren: de pijplijn grijs, productie
   * drie tinten blauw, opgeleverd groen, stilgelegd gedempt.
   */
  tint: string;
}

/**
 * De volgorde hier is de volgorde waarin een project door de pijplijn loopt.
 * Het dashboard en de statusfilters lezen die volgorde uit, dus een nieuwe
 * fase toevoegen hoeft alleen hier te gebeuren.
 */
export const PROJECT_STATUS: Record<ProjectStatus, FaseMeta> = {
  lead: { label: "Lead", toon: "neutral", tint: "bg-neutral/45" },
  offerte: { label: "Offerte", toon: "neutral", tint: "bg-neutral/80" },
  in_ontwerp: { label: "In ontwerp", toon: "info", tint: "bg-info/45" },
  in_bouw: { label: "In bouw", toon: "info", tint: "bg-info/75" },
  review: { label: "Review", toon: "info", tint: "bg-info" },
  live: { label: "Live", toon: "success", tint: "bg-success" },
  onderhoud: { label: "Onderhoud", toon: "success", tint: "bg-success/55" },
  gepauzeerd: { label: "Gepauzeerd", toon: "neutral", tint: "bg-neutral/30" },
  geannuleerd: { label: "Geannuleerd", toon: "neutral", tint: "bg-neutral/15" },
};

export const PROJECT_STATUS_ORDER = Object.keys(PROJECT_STATUS) as ProjectStatus[];

/** Fases die nog werk vragen: "lopend werk" op het dashboard en in de filters. */
export const ACTIVE_PROJECT_STATUSES: ProjectStatus[] = [
  "lead",
  "offerte",
  "in_ontwerp",
  "in_bouw",
  "review",
];

export const TASK_STATUS: Record<TaskStatus, Meta> = {
  todo: { label: "Te doen", toon: "neutral" },
  bezig: { label: "Bezig", toon: "info" },
  wacht: { label: "Wacht op klant", toon: "warning" },
  klaar: { label: "Klaar", toon: "success" },
};

export const TASK_STATUS_ORDER = Object.keys(TASK_STATUS) as TaskStatus[];

export const CLIENT_STATUS: Record<ClientStatus, Meta> = {
  prospect: { label: "Prospect", toon: "info" },
  actief: { label: "Actief", toon: "success" },
  inactief: { label: "Inactief", toon: "neutral" },
};

export const CLIENT_STATUS_ORDER = Object.keys(CLIENT_STATUS) as ClientStatus[];

export const PRIORITY: Record<Priority, Meta> = {
  laag: { label: "Laag", toon: "neutral" },
  normaal: { label: "Normaal", toon: "neutral" },
  hoog: { label: "Hoog", toon: "warning" },
  urgent: { label: "Urgent", toon: "danger" },
};

export const PRIORITY_ORDER = Object.keys(PRIORITY) as Priority[];

/** Sorteergewicht: urgent bovenaan in takenlijsten. */
export const PRIORITY_WEIGHT: Record<Priority, number> = {
  urgent: 0,
  hoog: 1,
  normaal: 2,
  laag: 3,
};

export const UPDATE_KIND: Record<UpdateKind, Meta> = {
  update: { label: "Update", toon: "info" },
  notitie: { label: "Notitie", toon: "neutral" },
  mijlpaal: { label: "Mijlpaal", toon: "success" },
};

/**
 * Accentkleur per prioriteit in de kalender: streepje voor de taak, stip in
 * de compacte cel, tint achter de dag. Volgt de statuskleuren hierboven;
 * "laag" is lichter dan "normaal", zodat je ze in een volle cel uit elkaar
 * houdt.
 */
export const ACCENT: Record<Priority, { balk: string; stip: string; cel: string }> = {
  urgent: { balk: TOON.danger.stip, stip: TOON.danger.stip, cel: TOON.danger.cel },
  hoog: { balk: TOON.warning.stip, stip: TOON.warning.stip, cel: TOON.warning.cel },
  normaal: { balk: TOON.neutral.stip, stip: TOON.neutral.stip, cel: TOON.neutral.cel },
  laag: { balk: "bg-neutral/45", stip: "bg-neutral/45", cel: "bg-neutral/5 border-neutral/20" },
};

/**
 * Is deze openstaande taak over zijn deadline? De ene plek voor die check;
 * hij stond eerder negen keer los in de code. Rekent in kalenderdagen, dus
 * een deadline van vandaag is nog niet te laat.
 */
export function isTeLaat(task: { status: TaskStatus; due_date: string | null }): boolean {
  if (task.status === "klaar" || !task.due_date) return false;
  const [jaar, maand, dag] = task.due_date.slice(0, 10).split("-").map(Number);
  const deadline = new Date(jaar ?? 0, (maand ?? 1) - 1, dag ?? 1);
  const nu = new Date();
  return deadline < new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());
}

/**
 * Taken zoals je ze telt: alleen hoofdtaken. Stappen horen bij hun taak en
 * staan daar als "2/5 stappen"; ze apart meetellen gaf getallen die niet
 * klopten met de lijsten eronder.
 */
export function hoofdtaken<T extends { parent_task_id: string | null }>(tasks: T[]): T[] {
  return tasks.filter((t) => !t.parent_task_id);
}
