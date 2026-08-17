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

/**
 * De volgorde hier is de volgorde waarin een project door de pijplijn loopt.
 * Het dashboard en de statusfilters lezen die volgorde uit, dus een nieuwe
 * fase toevoegen hoeft alleen hier te gebeuren.
 */
export const PROJECT_STATUS: Record<ProjectStatus, Meta> = {
  lead: { label: "Lead", className: "bg-slate-100 text-slate-700 border-slate-200" },
  offerte: { label: "Offerte", className: "bg-amber-100 text-amber-800 border-amber-200" },
  in_ontwerp: { label: "In ontwerp", className: "bg-violet-100 text-violet-800 border-violet-200" },
  in_bouw: { label: "In bouw", className: "bg-blue-100 text-blue-800 border-blue-200" },
  review: { label: "Review", className: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  live: { label: "Live", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  onderhoud: { label: "Onderhoud", className: "bg-teal-100 text-teal-800 border-teal-200" },
  gepauzeerd: { label: "Gepauzeerd", className: "bg-orange-100 text-orange-800 border-orange-200" },
  geannuleerd: { label: "Geannuleerd", className: "bg-rose-100 text-rose-800 border-rose-200" },
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
  todo: { label: "Te doen", className: "bg-slate-100 text-slate-700 border-slate-200" },
  bezig: { label: "Bezig", className: "bg-blue-100 text-blue-800 border-blue-200" },
  wacht: { label: "Wacht op klant", className: "bg-amber-100 text-amber-800 border-amber-200" },
  klaar: { label: "Klaar", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export const TASK_STATUS_ORDER = Object.keys(TASK_STATUS) as TaskStatus[];

export const CLIENT_STATUS: Record<ClientStatus, Meta> = {
  prospect: { label: "Prospect", className: "bg-amber-100 text-amber-800 border-amber-200" },
  actief: { label: "Actief", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  inactief: { label: "Inactief", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

export const CLIENT_STATUS_ORDER = Object.keys(CLIENT_STATUS) as ClientStatus[];

export const PRIORITY: Record<Priority, Meta> = {
  laag: { label: "Laag", className: "bg-slate-100 text-slate-600 border-slate-200" },
  normaal: { label: "Normaal", className: "bg-slate-100 text-slate-700 border-slate-200" },
  hoog: { label: "Hoog", className: "bg-orange-100 text-orange-800 border-orange-200" },
  urgent: { label: "Urgent", className: "bg-rose-100 text-rose-800 border-rose-200" },
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
  update: { label: "Update", className: "bg-blue-100 text-blue-800 border-blue-200" },
  notitie: { label: "Notitie", className: "bg-slate-100 text-slate-700 border-slate-200" },
  mijlpaal: { label: "Mijlpaal", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};
