import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, FolderKanban, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import ProjectDialog from "@/admin/components/ProjectDialog";
import StatusBadge from "@/admin/components/StatusBadge";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACTIVE_PROJECT_STATUSES, PROJECT_STATUS, PROJECT_STATUS_ORDER, type ProjectStatus } from "@/admin/constants";
import { daysUntil, deadlineLabel, formatBudget } from "@/admin/format";
import { useProjects } from "@/admin/queries";

type Filter = ProjectStatus | "alle" | "actief";

const Projects = () => {
  const { user } = useAdminAuth();
  const { data: projects = [], isLoading } = useProjects();
  const [filter, setFilter] = useState<Filter>("actief");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();

  // Aangeroepen vanuit het command-palet met { nieuw: true }.
  useEffect(() => {
    if (!(location.state as { nieuw?: boolean } | null)?.nieuw) return;
    setDialogOpen(true);
    window.history.replaceState({}, "");
  }, [location.state]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter === "actief" && !ACTIVE_PROJECT_STATUSES.includes(p.status)) return false;
      if (filter !== "alle" && filter !== "actief" && p.status !== filter) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        (p.client?.name ?? "").toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term)
      );
    });
  }, [projects, filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projecten</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? "project" : "projecten"} in het portaal.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Nieuw project
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Zoek op project, klant of omschrijving"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="actief">Lopend werk</SelectItem>
            <SelectItem value="alle">Alle statussen</SelectItem>
            {PROJECT_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {PROJECT_STATUS[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Projecten laden…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Geen projecten gevonden"
          description={
            projects.length === 0
              ? "Maak je eerste project aan om te beginnen."
              : "Pas het filter of de zoekterm aan."
          }
          action={
            projects.length === 0 ? (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nieuw project
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => {
            const late = (daysUntil(project.deadline) ?? 1) < 0 && ACTIVE_PROJECT_STATUSES.includes(project.status);
            return (
              <Card key={project.id} className="transition-colors hover:border-foreground/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/admin/projecten/${project.id}`} className="min-w-0">
                      <p className="truncate font-medium hover:underline">{project.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {project.client?.name ?? "Geen klant"}
                      </p>
                    </Link>
                    <StatusBadge kind="project" value={project.status} className="shrink-0" />
                  </div>

                  {project.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {project.deadline && (
                      <span className={cn(late && "font-medium text-rose-600")}>{deadlineLabel(project.deadline)}</span>
                    )}
                    {project.budget_cents !== null && <span>{formatBudget(project.budget_cents)}</span>}
                    {project.priority !== "normaal" && <StatusBadge kind="priority" value={project.priority} />}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} userId={user?.id ?? null} />
    </div>
  );
};

export default Projects;
