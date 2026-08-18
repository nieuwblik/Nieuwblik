import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ClientGrid from "@/admin/components/ClientGrid";
import EmptyState from "@/admin/components/EmptyState";
import TaskCalendar from "@/admin/components/TaskCalendar";
import TaskList from "@/admin/components/TaskList";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { PROJECT_STATUS } from "@/admin/constants";
import { daysUntil, initials, tintFor } from "@/admin/format";
import { useCombinedRows } from "@/admin/rows";
import { useTasks, useTeam } from "@/admin/queries";

const Dashboard = () => {
  const { displayName } = useAdminAuth();
  const { rows, isLoading } = useCombinedRows();
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const [search, setSearch] = useState("");
  const zoekRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const treffers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];
    return rows
      .filter((row) =>
        [row.client.name, row.client.contact_name, row.client.city, row.project?.name].some((value) =>
          (value ?? "").toLowerCase().includes(term),
        ),
      )
      .slice(0, 8);
  }, [rows, search]);

  // Buiten het zoekveld klikken sluit de lijst; anders blijft hij over de
  // pagina hangen zodra je ergens anders verder werkt.
  useEffect(() => {
    if (!search.trim()) return;

    const onPointerDown = (event: MouseEvent) => {
      if (zoekRef.current?.contains(event.target as Node)) return;
      setSearch("");
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [search]);

  /*
   * Alles wat openstaat, niet alleen wat op jouw naam staat. Met z'n tweeën
   * werk je door dezelfde stapel: een taak die bij je collega ligt wil je hier
   * ook zien. Bij wie hij ligt staat per regel vermeld.
   */
  const openTasks = useMemo(() => tasks.filter((t) => t.status !== "klaar"), [tasks]);

  const openTotal = tasks.filter((t) => t.status !== "klaar").length;
  const overdue = tasks.filter((t) => t.status !== "klaar" && (daysUntil(t.due_date) ?? 1) < 0).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hallo{displayName ? `, ${displayName.split(/[\s@]/)[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} klanten · {openTotal} openstaande {openTotal === 1 ? "taak" : "taken"}
            {overdue > 0 && <span className="text-rose-600 dark:text-rose-400"> · {overdue} te laat</span>}
          </p>
        </div>

        {/* Treffers verschijnen direct onder het veld. De volledige lijst staat
            verderop op de pagina; die daar filteren zou betekenen dat je na het
            typen alsnog moet scrollen om je resultaat te zien. */}
        <div ref={zoekRef} className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Zoek een klant"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearch("");
                return;
              }
              if (event.key === "Enter" && treffers[0]) {
                event.preventDefault();
                navigate(treffers[0].to);
                setSearch("");
              }
            }}
            aria-label="Zoek een klant"
          />

          {search.trim() && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
              {treffers.length === 0 ? (
                <p className="px-3 py-3 text-sm text-muted-foreground">Geen klant gevonden.</p>
              ) : (
                <ul className="max-h-80 overflow-y-auto py-1">
                  {treffers.map((row) => (
                    <li key={row.key}>
                      <Link
                        to={row.to}
                        onClick={() => setSearch("")}
                        className="flex items-center gap-2.5 px-2 py-2 transition-colors hover:bg-muted"
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                            tintFor(row.client.name),
                          )}
                        >
                          {initials(row.client.name)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{row.client.name}</span>
                          {row.client.contact_name && (
                            <span className="block truncate text-xs text-muted-foreground">
                              {row.client.contact_name}
                            </span>
                          )}
                        </span>
                        {row.status && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {PROJECT_STATUS[row.status].label}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Openstaande taken</CardTitle>
          <CardDescription>Al het werk dat nog loopt, over alle klanten en beide van jullie heen.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={openTasks}
            team={team}
            empty={
              <EmptyState icon={CheckSquare} title="Niets openstaand" description="Er staat geen werk meer open." />
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Planning</CardTitle>
          <CardDescription>
            Deadlines per dag, gekleurd naar prioriteit. Klik een dag om er werk op te zetten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskCalendar />
        </CardContent>
      </Card>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">Klanten</h2>
          <span className="text-xs text-muted-foreground">Openstaand werk bovenaan</span>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Laden…</p>
        ) : rows.length === 0 ? (
          <EmptyState icon={Users} title="Nog geen klanten" description="Voeg een klant toe om te beginnen." />
        ) : (
          <ClientGrid rows={rows} />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
