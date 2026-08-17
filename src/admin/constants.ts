import type { Database } from "@/integrations/supabase/types";

export type ProjectStatus = Database["public"]["Enums"]["project_status"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];
export type ClientStatus = Database["public"]["Enums"]["client_status"];
export type Priority = Database["public"]["Enums"]["priority_level"];
export type UpdateKind = Database["public"]["Enums"]["update_kind"];

interface Meta {
  label: string;
  /** Tailwind-klassen voor de badge; bewust statisch zodat de JIT ze meepakt. */
  className: string;
}

/** Statusmeta plus een vlakke stipkleur voor de donkere zijbalk. */
interface DotMeta extends Meta {
  dot: string;
}

/**
 * De volgorde hier is de volgorde waarin een project door de pijplijn loopt.
 * Het dashboard en de statusfilters lezen die volgorde uit, dus een nieuwe
 * fase toevoegen hoeft alleen hier te gebeuren.
 */
/*
 * Elke status heeft een lichte en een donkere variant. In donkere modus wordt
 * de lichte chip een doorschijnende getinte vulling met lichte tekst: een
 * volvlakke pastelkleur op een bijna-zwarte kaart leest als een sticker die
 * los van de interface zweeft.
 */
export const PROJECT_STATUS: Record<ProjectStatus, DotMeta> = {
  lead: {
    label: "Lead",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25",
    dot: "bg-slate-400",
  },
  offerte: {
    label: "Offerte",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/25",
    dot: "bg-amber-400",
  },
  in_ontwerp: {
    label: "In ontwerp",
    className:
      "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-400/15 dark:text-violet-300 dark:border-violet-400/25",
    dot: "bg-violet-400",
  },
  in_bouw: {
    label: "In bouw",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-400/15 dark:text-blue-300 dark:border-blue-400/25",
    dot: "bg-blue-400",
  },
  review: {
    label: "Review",
    className:
      "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-400/15 dark:text-cyan-300 dark:border-cyan-400/25",
    dot: "bg-cyan-400",
  },
  live: {
    label: "Live",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/25",
    dot: "bg-emerald-400",
  },
  onderhoud: {
    label: "Onderhoud",
    className:
      "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-400/15 dark:text-teal-300 dark:border-teal-400/25",
    dot: "bg-teal-400",
  },
  gepauzeerd: {
    label: "Gepauzeerd",
    className:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-400/15 dark:text-orange-300 dark:border-orange-400/25",
    dot: "bg-orange-400",
  },
  geannuleerd: {
    label: "Geannuleerd",
    className:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-400/15 dark:text-rose-300 dark:border-rose-400/25",
    dot: "bg-rose-400",
  },
};

export const PROJECT_STATUS_ORDER = Object.keys(PROJECT_STATUS) as ProjectStatus[];

/** Fases die nog werk vragen — gebruikt voor "actieve projecten" op het dashboard. */
export const ACTIVE_PROJECT_STATUSES: ProjectStatus[] = [
  "lead",
  "offerte",
  "in_ontwerp",
  "in_bouw",
  "review",
];

export const TASK_STATUS: Record<TaskStatus, Meta> = {
  todo: {
    label: "Te doen",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25",
  },
  bezig: {
    label: "Bezig",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-400/15 dark:text-blue-300 dark:border-blue-400/25",
  },
  wacht: {
    label: "Wacht op klant",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/25",
  },
  klaar: {
    label: "Klaar",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/25",
  },
};

export const TASK_STATUS_ORDER = Object.keys(TASK_STATUS) as TaskStatus[];

export const CLIENT_STATUS: Record<ClientStatus, Meta> = {
  prospect: {
    label: "Prospect",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/25",
  },
  actief: {
    label: "Actief",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/25",
  },
  inactief: {
    label: "Inactief",
    className:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-400/15 dark:text-slate-400 dark:border-slate-400/25",
  },
};

export const CLIENT_STATUS_ORDER = Object.keys(CLIENT_STATUS) as ClientStatus[];

export const PRIORITY: Record<Priority, Meta> = {
  laag: {
    label: "Laag",
    className:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-400/15 dark:text-slate-400 dark:border-slate-400/25",
  },
  normaal: {
    label: "Normaal",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25",
  },
  hoog: {
    label: "Hoog",
    className:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-400/15 dark:text-orange-300 dark:border-orange-400/25",
  },
  urgent: {
    label: "Urgent",
    className:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-400/15 dark:text-rose-300 dark:border-rose-400/25",
  },
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
  update: {
    label: "Update",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-400/15 dark:text-blue-300 dark:border-blue-400/25",
  },
  notitie: {
    label: "Notitie",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25",
  },
  mijlpaal: {
    label: "Mijlpaal",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/25",
  },
};
