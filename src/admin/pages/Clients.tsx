import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckSquare, Mail, Phone, Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import ClientProjectDialog from "@/admin/components/ClientProjectDialog";
import StatusBadge from "@/admin/components/StatusBadge";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS, PROJECT_STATUS_ORDER, type ProjectStatus } from "@/admin/constants";
import { daysUntil, deadlineLabel, timeAgo } from "@/admin/format";
import { useCombinedRows } from "@/admin/rows";

type Filter = ProjectStatus | "alle" | "actief";

/**
 * De gecombineerde lijst: klant en werk in één regel. Vervangt de losse
 * klanten- en projectenlijst, die met één project per klant hetzelfde
 * toonden onder twee namen.
 */
const Clients = () => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const { rows, isLoading } = useCombinedRows();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();

  // Het command-palet stuurt hierheen met { nieuw: true } om meteen het
  // formulier te openen. De state wordt daarna gewist, anders springt de
  // dialoog bij een refresh opnieuw open.
  useEffect(() => {
    if (!(location.state as { nieuw?: boolean } | null)?.nieuw) return;
    setDialogOpen(true);
    window.history.replaceState({}, "");
  }, [location.state]);

  // Het filter leeft in de URL, zodat de fases in de zijbalk hierheen linken
  // en een gefilterde weergave deelbaar is.
  const statusParam = searchParams.get("status");
  const known = statusParam === "alle" || PROJECT_STATUS_ORDER.includes(statusParam as ProjectStatus);
  const filter: Filter = statusParam && known ? (statusParam as Filter) : "alle";

  const setFilter = (next: Filter) =>
    setSearchParams(next === "alle" ? {} : { status: next }, { replace: true });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter === "actief" && !(row.status && ACTIVE_PROJECT_STATUSES.includes(row.status))) return false;
      if (filter !== "alle" && filter !== "actief" && row.status !== filter) return false;
      if (!term) return true;
      return [row.client.name, row.client.contact_name, row.client.email, row.client.city, row.project?.name].some(
        (value) => (value ?? "").toLowerCase().includes(term),
      );
    });
  }, [rows, filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Klanten</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "klant" : "klanten"} · laatst gewijzigd bovenaan
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Nieuwe klant
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Zoek op naam, contactpersoon, e-mail of plaats"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle fases</SelectItem>
            <SelectItem value="actief">Lopend werk</SelectItem>
            {PROJECT_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {PROJECT_STATUS[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laden…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title={rows.length === 0 ? "Nog geen klanten" : "Niets gevonden"}
          description={rows.length === 0 ? "Voeg je eerste klant toe." : "Pas het filter of de zoekterm aan."}
          action={
            rows.length === 0 ? (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nieuwe klant
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-background">
          {visible.map((row) => {
            const late =
              row.deadline !== null &&
              (daysUntil(row.deadline) ?? 1) < 0 &&
              row.status !== null &&
              ACTIVE_PROJECT_STATUSES.includes(row.status);

            return (
              <li key={row.key}>
                <Link to={row.to} className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/60">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{row.client.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      {row.client.contact_name && <span className="truncate">{row.client.contact_name}</span>}
                      {row.client.city && <span>{row.client.city}</span>}
                      {row.client.email && (
                        <span className="hidden items-center gap-1 md:inline-flex">
                          <Mail className="h-3 w-3" />
                          {row.client.email}
                        </span>
                      )}
                      {row.client.phone && (
                        <span className="hidden items-center gap-1 lg:inline-flex">
                          <Phone className="h-3 w-3" />
                          {row.client.phone}
                        </span>
                      )}
                      {row.otherProjects.length > 0 && (
                        <span>
                          +{row.otherProjects.length} {row.otherProjects.length === 1 ? "project" : "projecten"}
                        </span>
                      )}
                      {!row.project && <span>Nog geen project</span>}
                    </div>
                  </div>

                  {row.openTasks > 0 && (
                    <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                      <CheckSquare className="h-3.5 w-3.5" />
                      {row.openTasks}
                    </span>
                  )}

                  {row.deadline && (
                    <span
                      className={cn(
                        "hidden shrink-0 text-xs md:block",
                        late ? "font-medium text-rose-600 dark:text-rose-400" : "text-muted-foreground",
                      )}
                    >
                      {deadlineLabel(row.deadline)}
                    </span>
                  )}

                  {row.status && <StatusBadge kind="project" value={row.status} className="shrink-0" />}

                  <span className="hidden w-28 shrink-0 text-right text-xs text-muted-foreground lg:block">
                    {timeAgo(row.activeAt)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <ClientProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={user?.id ?? null}
        onCreated={(projectId) => navigate(`/admin/projecten/${projectId}`)}
      />
    </div>
  );
};

export default Clients;
