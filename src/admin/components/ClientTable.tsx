import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ChevronsUpDown, Code2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { BILLING_CYCLE, formatEuro } from "@/admin/billing";
import { ACTIVE_PROJECT_STATUSES, PRIORITY_WEIGHT, PROJECT_STATUS_ORDER, TOON } from "@/admin/constants";
import { daysUntil, deadlineLabel, timeAgo } from "@/admin/format";
import type { ClientRow } from "@/admin/rows";
import { formatDuur } from "@/admin/uren";
import { useCreateTask } from "@/admin/useCreateTask";
import Avatar from "@/admin/ui/Avatar";
import StatusPill from "@/admin/ui/StatusPill";

type Kolom = "naam" | "fase" | "open" | "deadline" | "uren" | "hosting" | "activiteit";
type Richting = "op" | "af";

interface ClientTableProps {
  rows: ClientRow[];
  /** Minuten per klant-id deze maand; ontbreekt als de urenregistratie niet actief is. */
  urenPerKlant?: Map<string, number> | undefined;
}

/** Maandbedrag van een hostingcontract, voor het sorteren: een jaarcontract telt voor een twaalfde. */
const hostingPerMaand = (row: ClientRow) => {
  const { billing_cycle, billing_amount_cents, billing_start } = row.client;
  if (!billing_cycle || !billing_start) return -1;
  return (billing_amount_cents ?? 0) / (billing_cycle === "jaarlijks" ? 12 : 1);
};

/**
 * De klanten als lijst: per regel de dingen waarop je zoekt en vergelijkt,
 * in vaste kolommen. Klik een kolomkop om te sorteren; zonder keuze staat
 * open werk bovenaan (zwaarste urgentie eerst), daarna de laatste activiteit,
 * dezelfde volgorde als het raster.
 *
 * Op een telefoon worden het compacte regels: naam en fase boven, de rest
 * eronder.
 */
const ClientTable = ({ rows, urenPerKlant }: ClientTableProps) => {
  const [sortering, setSortering] = useState<{ kolom: Kolom; richting: Richting } | null>(null);
  const { createTask, isPending } = useCreateTask();

  const uren = (row: ClientRow) => (row.client.id ? (urenPerKlant?.get(row.client.id) ?? 0) : 0);

  const gesorteerd = useMemo(() => {
    const lijst = [...rows];
    if (!sortering) {
      // Standaard: open werk eerst, dan de rest; binnen elke groep de laatste activiteit.
      return lijst.sort((a, b) => {
        const werk = Number(b.openTasks > 0) - Number(a.openTasks > 0);
        if (werk !== 0) return werk;
        if (a.openTasks > 0) {
          const urgentie = PRIORITY_WEIGHT[a.urgentie ?? "laag"] - PRIORITY_WEIGHT[b.urgentie ?? "laag"];
          if (urgentie !== 0) return urgentie;
        }
        return (b.activeAt ?? "").localeCompare(a.activeAt ?? "");
      });
    }
    const waarde = (row: ClientRow): number | string => {
      switch (sortering.kolom) {
        case "naam":
          return row.client.name.toLowerCase();
        case "fase":
          return row.status ? PROJECT_STATUS_ORDER.indexOf(row.status) : 99;
        case "open":
          return row.openTasks * 100 + row.teLaat;
        case "deadline":
          return row.deadline ?? "9999-12-31";
        case "uren":
          return uren(row);
        case "hosting":
          return hostingPerMaand(row);
        case "activiteit":
          return row.activeAt ?? "";
      }
    };
    const factor = sortering.richting === "op" ? 1 : -1;
    return lijst.sort((a, b) => {
      const va = waarde(a);
      const vb = waarde(b);
      return (typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb))) * factor;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sortering, urenPerKlant]);

  /** Eerste klik: logische richting per kolom; tweede klik draait om; derde klik terug naar standaard. */
  const sorteer = (kolom: Kolom) =>
    setSortering((huidig) => {
      const begin: Richting = kolom === "naam" || kolom === "fase" || kolom === "deadline" ? "op" : "af";
      if (huidig?.kolom !== kolom) return { kolom, richting: begin };
      if (huidig.richting === begin) return { kolom, richting: begin === "op" ? "af" : "op" };
      return null;
    });

  // Een gewone functie en geen component: een component die binnen de render
  // wordt gemaakt, is elke render een nieuw type, en dan bouwt React de kop
  // opnieuw op en raak je met het toetsenbord je focus kwijt na het sorteren.
  const kop = (kolom: Kolom, children: string, rechts = false) => {
    const actief = sortering?.kolom === kolom;
    const Icoon = !actief ? ChevronsUpDown : sortering.richting === "op" ? ArrowUp : ArrowDown;
    return (
      <th key={kolom} scope="col" className={cn("px-3 py-2.5 font-normal", rechts && "text-right")} aria-sort={actief ? (sortering.richting === "op" ? "ascending" : "descending") : "none"}>
        <button
          type="button"
          onClick={() => sorteer(kolom)}
          className={cn(
            "inline-flex items-center gap-1 rounded-md transition-colors hover:text-foreground",
            actief && "font-medium text-foreground",
          )}
        >
          {children}
          <Icoon className={cn("h-3.5 w-3.5", !actief && "opacity-40")} />
        </button>
      </th>
    );
  };

  const deadlineCel = (row: ClientRow) => {
    if (!row.deadline) return <span className="text-muted-foreground">–</span>;
    const laat = (daysUntil(row.deadline) ?? 1) < 0 && row.status !== null && ACTIVE_PROJECT_STATUSES.includes(row.status);
    return <span className={cn(laat && cn("font-medium", TOON.danger.tekst))}>{deadlineLabel(row.deadline)}</span>;
  };

  const openCel = (row: ClientRow) =>
    row.openTasks === 0 ? (
      <span className="text-muted-foreground">–</span>
    ) : (
      <span className="tabular-nums">
        {row.openTasks}
        {row.teLaat > 0 && <span className={cn("ml-1.5 font-medium", TOON.danger.tekst)}>{row.teLaat} te laat</span>}
      </span>
    );

  const hostingCel = (row: ClientRow) =>
    row.client.billing_cycle && row.client.billing_start ? (
      <span className="tabular-nums">
        {formatEuro(row.client.billing_amount_cents) ?? "–"}{" "}
        <span className="text-muted-foreground">{BILLING_CYCLE[row.client.billing_cycle].kort}</span>
      </span>
    ) : (
      <span className="text-muted-foreground">–</span>
    );

  const plus = (row: ClientRow) =>
    row.project && (
      <button
        type="button"
        disabled={isPending}
        onClick={() => void createTask(row.project!.id)}
        title={`Nieuwe taak voor ${row.client.name}`}
        aria-label={`Nieuwe taak voor ${row.client.name}`}
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-90 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    );

  const naamCel = (row: ClientRow) => (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar naam={row.client.name} slug={row.project?.portfolio_slug ?? null} maat="sm" />
      <div className="min-w-0">
        {/* De link spant over de hele regel (after:inset-0); de plusknop ligt er bovenop. */}
        <Link to={row.to} className="flex items-center gap-1.5 font-medium after:absolute after:inset-0 hover:underline">
          <span className="truncate">{row.client.name}</span>
          {row.tanstack && (
            <span title="Gemaakt met TanStack" className="shrink-0 text-muted-foreground">
              <Code2 className="h-3.5 w-3.5" />
            </span>
          )}
        </Link>
        <p className="truncate text-[13px] text-muted-foreground">
          {[row.client.contact_name, row.client.city].filter(Boolean).join(" · ") || row.client.email || "Geen contactgegevens"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-vervaag overflow-hidden rounded-[16px] border border-border bg-card">
      {/* Tabel vanaf tablet. */}
      <table className="hidden w-full text-sm md:table">
        <thead className="border-b border-border bg-muted/40 text-left text-[13px] text-muted-foreground">
          <tr>
            {kop("naam", "Klant")}
            {kop("fase", "Fase")}
            {kop("open", "Open taken")}
            {kop("deadline", "Deadline")}
            {urenPerKlant && kop("uren", "Uren deze maand", true)}
            {kop("hosting", "Hosting", true)}
            {kop("activiteit", "Laatste activiteit")}
            <th scope="col" className="w-12">
              <span className="sr-only">Acties</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {gesorteerd.map((row) => (
            <tr key={row.key} className="p-rij relative">
              <td className="max-w-[18rem] px-3 py-2.5">{naamCel(row)}</td>
              <td className="px-3 py-2.5">{row.status ? <StatusPill kind="project" value={row.status} /> : <span className="text-muted-foreground">Geen project</span>}</td>
              <td className="px-3 py-2.5">{openCel(row)}</td>
              <td className="px-3 py-2.5 whitespace-nowrap">{deadlineCel(row)}</td>
              {urenPerKlant && (
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {uren(row) > 0 ? formatDuur(uren(row)) : <span className="text-muted-foreground">–</span>}
                </td>
              )}
              <td className="px-3 py-2.5 text-right whitespace-nowrap">{hostingCel(row)}</td>
              <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{row.activeAt ? timeAgo(row.activeAt) : "–"}</td>
              <td className="px-2 py-2.5">{plus(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Compacte regels op een telefoon. */}
      <ul className="divide-y divide-border md:hidden">
        {gesorteerd.map((row) => (
          <li key={row.key} className="p-rij relative px-3 py-3">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">{naamCel(row)}</div>
              {row.status && <StatusPill kind="project" value={row.status} />}
              {plus(row)}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 pl-11 text-[13px]">
              {row.openTasks > 0 && <span>Open: {openCel(row)}</span>}
              {row.deadline && <span>{deadlineCel(row)}</span>}
              {uren(row) > 0 && <span className="tabular-nums">{formatDuur(uren(row))} deze maand</span>}
              {row.client.billing_cycle && <span>Hosting {hostingCel(row)}</span>}
              <span className="text-muted-foreground">{row.activeAt ? timeAgo(row.activeAt) : ""}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientTable;
