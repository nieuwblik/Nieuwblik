import { Link } from "react-router-dom";
import { CheckSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS } from "@/admin/constants";
import { daysUntil, deadlineLabel, initials, timeAgo } from "@/admin/format";
import type { ClientRow } from "@/admin/rows";

/**
 * Gedempte tinten voor het monogram. Geen betekenis, wel houvast: dezelfde
 * klant krijgt altijd dezelfde kleur, en dat maakt een lange lijst scanbaar
 * op vorm in plaats van alleen op tekst.
 */
const TINTS = [
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
  "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
  "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
  "bg-teal-100 text-teal-800 dark:bg-teal-400/15 dark:text-teal-300",
];

function tintFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return TINTS[hash % TINTS.length];
}

/**
 * Eén regel in de klantenlijst, gedeeld door het beginscherm en de
 * klantenpagina.
 *
 * De status staat als stip met label en niet als gevulde badge: bij een
 * portfolio waar bijna alles "Live" is, wordt een rij identieke pillen een
 * muur die je niet meer leest. De tweede regel verschijnt alleen als er iets
 * te melden valt, zodat er geen lege ruimte gereserveerd wordt.
 */
const ClientRowItem = ({ row }: { row: ClientRow }) => {
  const meta = [
    row.client.contact_name,
    row.client.city,
    row.project && row.project.name !== row.client.name ? row.project.name : null,
    row.otherProjects.length > 0
      ? `+${row.otherProjects.length} ${row.otherProjects.length === 1 ? "project" : "projecten"}`
      : null,
    !row.project ? "Nog geen project" : null,
  ].filter(Boolean);

  const late =
    row.deadline !== null &&
    (daysUntil(row.deadline) ?? 1) < 0 &&
    row.status !== null &&
    ACTIVE_PROJECT_STATUSES.includes(row.status);

  return (
    <li>
      <Link to={row.to} className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/60">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
            tintFor(row.client.name),
          )}
          aria-hidden="true"
        >
          {initials(row.client.name)}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{row.client.name}</p>
          {meta.length > 0 && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta.join(" · ")}</p>
          )}
        </div>

        {row.openTasks > 0 && (
          <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
            <CheckSquare className="h-3.5 w-3.5" />
            {row.openTasks}
          </span>
        )}

        {late && (
          <span className="shrink-0 text-xs font-medium text-rose-600 dark:text-rose-400">
            {deadlineLabel(row.deadline)}
          </span>
        )}

        {row.status && (
          <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <span className={cn("h-1.5 w-1.5 rounded-full", PROJECT_STATUS[row.status].dot)} />
            {PROJECT_STATUS[row.status].label}
          </span>
        )}

        <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground/70 lg:block">
          {timeAgo(row.activeAt)}
        </span>
      </Link>
    </li>
  );
};

export default ClientRowItem;
