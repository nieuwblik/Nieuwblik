import { Link } from "react-router-dom";
import { Code2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS, type Priority } from "@/admin/constants";
import { daysUntil, deadlineLabel, initials } from "@/admin/format";
import { portfolioBeeld } from "@/admin/portfolio";
import type { ClientRow } from "@/admin/rows";
import { useCreateTask } from "@/admin/useCreateTask";

/**
 * Tint onder de kaart per urgentie. Zonder werk blijft het de neutrale
 * kaartkleur; ligt er iets, dan kleurt de voet mee met het zwaarste dat er
 * ligt. Zo zie je van een afstand welke klant aandacht vraagt, zonder dat de
 * kaart van hoogte verandert.
 *
 * Dezelfde statuskleuren als overal: rood voor urgent, oranje voor hoog,
 * grijs voor normaal en laag. Een vulling, geen vol vlak, zodat de naam
 * leesbaar blijft.
 */
const VOET: Record<Priority, { vlak: string; stip: string }> = {
  urgent: { vlak: "bg-danger/10", stip: "bg-danger" },
  hoog: { vlak: "bg-warning/10", stip: "bg-warning" },
  normaal: { vlak: "bg-neutral/10", stip: "bg-neutral" },
  laag: { vlak: "bg-neutral/5", stip: "bg-neutral/50" },
};

/**
 * Eén klant als kaart, met het portfoliobeeld erboven.
 *
 * Een lijst met namen dwingt je te lezen; een raster met beelden laat je
 * herkennen. Bij twintig klanten die je allemaal kent scheelt dat merkbaar in
 * hoe snel je de juiste te pakken hebt.
 */
const ClientCard = ({ row }: { row: ClientRow }) => {
  const { createTask, isPending } = useCreateTask();
  const beeld = portfolioBeeld(row.project?.portfolio_slug);
  const voet = row.urgentie ? VOET[row.urgentie] : null;

  const meta = [row.client.contact_name, row.client.city].filter(Boolean);

  const late =
    row.deadline !== null &&
    (daysUntil(row.deadline) ?? 1) < 0 &&
    row.status !== null &&
    ACTIVE_PROJECT_STATUSES.includes(row.status);

  return (
    <li className="group relative flex flex-col overflow-hidden rounded-[14px] border border-border bg-card transition-colors duration-200 hover:border-foreground/20">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {beeld ? (
          <img
            src={beeld}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          // Geen case op de site: dan het monogram, zodat het raster niet uit
          // elkaar valt bij een gat.
          <span
            className="flex h-full w-full items-center justify-center text-2xl font-semibold text-foreground/50"
            aria-hidden="true"
          >
            {initials(row.client.name)}
          </span>
        )}

        {/* Alleen bij werk dat nog loopt: bij een portfolio waar bijna alles
            live is, zou een badge op elke kaart niets zeggen. */}
        {row.status && row.status !== "live" && (
          <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
            {PROJECT_STATUS[row.status].label}
          </span>
        )}

        {/* Het aantal ligt over het beeld en niet in de voet: daar zou het de
            kaart hoger maken zodra er werk is, en dan staat het raster scheef. */}
        {row.openTasks > 0 && (
          <span
            title={`${row.openTasks} open ${row.openTasks === 1 ? "taak" : "taken"}`}
            className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium tabular-nums backdrop-blur-sm"
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", voet?.stip)} />
            {row.openTasks}
          </span>
        )}

        {late && (
          <span className="absolute bottom-2 left-2 rounded-full bg-danger px-2 py-0.5 text-xs font-medium text-white">
            {deadlineLabel(row.deadline)}
          </span>
        )}
      </div>

      <div className={cn("flex items-center gap-2 p-3 transition-colors duration-200", voet?.vlak)}>
        <div className="min-w-0 flex-1">
          {/* De hele kaart is klikbaar via een overlay; de plusknop ligt er met
              een eigen laag bovenop. Een knop ín een link is ongeldige HTML. */}
          <div className="flex min-w-0 items-center gap-1.5">
            <Link to={row.to} className="min-w-0 after:absolute after:inset-0">
              <p className="truncate text-sm font-medium leading-tight">{row.client.name}</p>
            </Link>

            {/* Alleen bij TanStack: bij React zou het op bijna elke kaart staan
                en dus niets meer onderscheiden. */}
            {row.tanstack && (
              <span
                title="Gemaakt met TanStack"
                aria-label="Gemaakt met TanStack"
                role="img"
                className="shrink-0 text-muted-foreground"
              >
                <Code2 className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          {/* Altijd een tweede regel, ook als er niets te melden valt: anders
              verspringt de hoogte per kaart. */}
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta.join(" · ") || " "}</p>
        </div>

        {row.project && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => void createTask(row.project!.id)}
            title={`Nieuwe taak voor ${row.client.name}`}
            aria-label={`Nieuwe taak voor ${row.client.name}`}
            className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </li>
  );
};

export default ClientCard;
