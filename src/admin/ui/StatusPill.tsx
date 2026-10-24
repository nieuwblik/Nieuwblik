import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  CLIENT_STATUS,
  PRIORITY,
  PROJECT_STATUS,
  TASK_STATUS,
  TOON,
  UPDATE_KIND,
  type ClientStatus,
  type Priority,
  type ProjectStatus,
  type TaskStatus,
  type Toon,
  type UpdateKind,
} from "@/admin/constants";

/**
 * Eén pil voor elke status in het portaal: taakstatus, prioriteit, fase,
 * klantrelatie, updatesoort, en vrije labels als "3 dagen te laat" of
 * "Gefactureerd". De kleur komt altijd uit TOON in constants.ts, zodat rood
 * overal "te laat of urgent" betekent en nergens iets anders.
 */
type PillProps = { className?: string; stip?: boolean } & (
  | { kind: "project"; value: ProjectStatus }
  | { kind: "task"; value: TaskStatus }
  | { kind: "client"; value: ClientStatus }
  | { kind: "priority"; value: Priority }
  | { kind: "update"; value: UpdateKind }
  | { kind?: undefined; toon: Toon; children: ReactNode }
);

const TABELLEN = {
  project: PROJECT_STATUS,
  task: TASK_STATUS,
  client: CLIENT_STATUS,
  priority: PRIORITY,
  update: UPDATE_KIND,
} as const;

const StatusPill = (props: PillProps) => {
  let toon: Toon;
  let label: ReactNode;

  if (props.kind === undefined) {
    toon = props.toon;
    label = props.children;
  } else {
    const meta = (TABELLEN[props.kind] as Record<string, { label: string; toon: Toon }>)[props.value];
    if (!meta) return null;
    toon = meta.toon;
    label = meta.label;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium leading-4",
        TOON[toon].pil,
        props.className,
      )}
    >
      {props.stip && <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", TOON[toon].stip)} aria-hidden="true" />}
      {label}
    </span>
  );
};

export default StatusPill;
