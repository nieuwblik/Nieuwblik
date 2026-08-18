import { Link } from "react-router-dom";
import { CheckSquare, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { projects as portfolio } from "@/data/projects";
import { tintFor } from "@/admin/components/ClientRowItem";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS } from "@/admin/constants";
import { daysUntil, deadlineLabel, initials } from "@/admin/format";
import type { ClientRow } from "@/admin/rows";
import { useCreateTask } from "@/admin/useCreateTask";

/**
 * Hetzelfde beeld als op de publieke portfoliopagina, opgezocht via de slug
 * die al op het project staat. Zo blijft er één bron: vervang je de foto op de
 * site, dan verandert hij hier mee.
 */
const beeldPerSlug = new Map(portfolio.map((p) => [p.slug, p.image]));

/**
 * Eén klant als kaart, met het portfoliobeeld erboven.
 *
 * Een lijst met namen dwingt je te lezen; een raster met beelden laat je
 * herkennen. Bij twintig klanten die je allemaal kent scheelt dat merkbaar in
 * hoe snel je de juiste te pakken hebt.
 */
const ClientCard = ({ row }: { row: ClientRow }) => {
  const { createTask, isPending } = useCreateTask();
  const beeld = row.project?.portfolio_slug ? beeldPerSlug.get(row.project.portfolio_slug) : undefined;

  const meta = [row.client.contact_name, row.client.city].filter(Boolean);

  const late =
    row.deadline !== null &&
    (daysUntil(row.deadline) ?? 1) < 0 &&
    row.status !== null &&
    ACTIVE_PROJECT_STATUSES.includes(row.status);

  return (
    <li className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/20">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {beeld ? (
          <img
            src={beeld}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          // Geen case op de site: dan het monogram in de vaste kleur van deze
          // klant, zodat het raster niet uit elkaar valt bij een gat.
          <span
            className={cn(
              "flex h-full w-full items-center justify-center text-2xl font-semibold",
              tintFor(row.client.name),
            )}
            aria-hidden="true"
          >
            {initials(row.client.name)}
          </span>
        )}

        {/* Alleen bij werk dat nog loopt: bij een portfolio waar bijna alles
            live is, zou een badge op elke kaart niets zeggen. */}
        {row.status && row.status !== "live" && (
          <span className="absolute left-2 top-2 rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
            {PROJECT_STATUS[row.status].label}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-start gap-2 p-3">
        <div className="min-w-0 flex-1">
          {/* De hele kaart is klikbaar via een overlay; de plusknop ligt er met
              een eigen laag bovenop. Een knop ín een link is ongeldige HTML. */}
          <Link to={row.to} className="after:absolute after:inset-0">
            <p className="truncate text-sm font-medium leading-tight">{row.client.name}</p>
          </Link>

          {meta.length > 0 && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta.join(" · ")}</p>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            {row.openTasks > 0 && (
              <span className="flex items-center gap-1">
                <CheckSquare className="h-3.5 w-3.5" />
                {row.openTasks}
              </span>
            )}
            {late && (
              <span className="font-medium text-rose-600 dark:text-rose-400">{deadlineLabel(row.deadline)}</span>
            )}
          </div>
        </div>

        {row.project && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => void createTask(row.project!.id)}
            title={`Nieuwe taak voor ${row.client.name}`}
            aria-label={`Nieuwe taak voor ${row.client.name}`}
            className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </li>
  );
};

export default ClientCard;
