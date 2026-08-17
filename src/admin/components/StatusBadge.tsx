import { cn } from "@/lib/utils";
import {
  CLIENT_STATUS,
  PRIORITY,
  PROJECT_STATUS,
  TASK_STATUS,
  UPDATE_KIND,
  type ClientStatus,
  type Priority,
  type ProjectStatus,
  type TaskStatus,
  type UpdateKind,
} from "@/admin/constants";

/**
 * Eén badge voor alle statustypes. De variant bepaalt welke tabel met labels
 * en kleuren gebruikt wordt, zodat een status overal in het portaal hetzelfde
 * oogt zonder dat elke pagina zijn eigen kleurenlogica krijgt.
 */
type BadgeProps =
  | { kind: "project"; value: ProjectStatus; className?: string }
  | { kind: "task"; value: TaskStatus; className?: string }
  | { kind: "client"; value: ClientStatus; className?: string }
  | { kind: "priority"; value: Priority; className?: string }
  | { kind: "update"; value: UpdateKind; className?: string };

const TABLES = {
  project: PROJECT_STATUS,
  task: TASK_STATUS,
  client: CLIENT_STATUS,
  priority: PRIORITY,
  update: UPDATE_KIND,
} as const;

const StatusBadge = ({ kind, value, className }: BadgeProps) => {
  const meta = (TABLES[kind] as Record<string, { label: string; className: string }>)[value];
  if (!meta) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
};

export default StatusBadge;
