import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckSquare, ChevronRight, Mail, MoreHorizontal, Pencil, Phone, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { projects as portfolio } from "@/data/projects";
import EmptyState from "@/admin/components/EmptyState";
import ClientProjectDialog from "@/admin/components/ClientProjectDialog";
import ProjectFiles from "@/admin/components/ProjectFiles";
import ProjectRail from "@/admin/components/ProjectRail";
import TaskList from "@/admin/components/TaskList";
import UpdatesTimeline from "@/admin/components/UpdatesTimeline";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import BillingButton from "@/admin/components/BillingButton";
import { formatDate, initials, momentLabel, mostRecent, tintFor } from "@/admin/format";
import { forgetRecentProject, recordRecentProject } from "@/admin/recent";
import { useConfirm } from "@/admin/useConfirm";
import { useCreateTask } from "@/admin/useCreateTask";
import {
  useClient,
  useDeleteClient,
  useDeleteProject,
  useProject,
  useProjectFiles,
  useProjectUpdates,
  useTasks,
  useTeam,
} from "@/admin/queries";

const beeldPerSlug = new Map(portfolio.map((p) => [p.slug, p.image]));

/** Eén tabblad in de rechterkolom, met het aantal als donkere pil erachter. */
const Tab = ({ value, children, count }: { value: string; children: React.ReactNode; count?: number }) => (
  <TabsTrigger
    value={value}
    className="gap-2 rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
  >
    {children}
    {count !== undefined && count > 0 && (
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[11px] font-medium tabular-nums text-background">
        {count}
      </span>
    )}
  </TabsTrigger>
);

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createTask, isPending } = useCreateTask();
  const { user } = useAdminAuth();
  const { data: project, isLoading, isError } = useProject(id);
  const { data: client } = useClient(project?.client_id ?? undefined);
  const { data: allTasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const { data: files = [] } = useProjectFiles(id);
  const { data: updates = [] } = useProjectUpdates(id);
  const removeProject = useDeleteProject();
  const removeClient = useDeleteClient();
  const { vraagBevestiging, dialoog } = useConfirm();

  const [editOpen, setEditOpen] = useState(false);

  const tasks = useMemo(() => allTasks.filter((t) => t.project_id === id), [allTasks, id]);
  const openTasks = tasks.filter((t) => t.status !== "klaar" && !t.parent_task_id).length;

  // Voedt "recent bekeken" op het dashboard en in het command-palet. Staat
  // boven de vroege returns, want hooks moeten elke render draaien.
  useEffect(() => {
    if (project) recordRecentProject({ id: project.id, name: project.name });
  }, [project]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Project laden…</p>;
  if (isError || !project) return <p className="text-sm text-muted-foreground">Dit project bestaat niet (meer).</p>;

  /**
   * Klant en project zijn één geheel, dus verwijderen haalt allebei weg.
   * De klant wissen is genoeg: het project hangt eraan met ON DELETE CASCADE,
   * en daarmee gaan taken, updates en bestanden vanzelf mee. Alleen het
   * project wissen zou een lege klantregel achterlaten.
   */
  const handleDelete = async () => {
    const label = project.client?.name ?? project.name;
    const door = await vraagBevestiging({
      titel: `"${label}" verwijderen?`,
      beschrijving: "Het project, de taken, updates en bestanden gaan mee.",
    });
    if (!door) return;

    try {
      if (project.client_id) {
        await removeClient.mutateAsync(project.client_id);
      } else {
        await removeProject.mutateAsync(project.id);
      }
      // Anders blijft er een dode snelkoppeling in "recent bekeken" staan.
      forgetRecentProject(project.id);
      toast.success(`"${label}" verwijderd`);
      navigate("/admin/klanten");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verwijderen mislukt");
    }
  };

  const naam = project.client?.name ?? project.name;
  const beeld = project.portfolio_slug ? beeldPerSlug.get(project.portfolio_slug) : undefined;

  // Alles wat aan deze klant is aangeraakt, in één stempel. Dat is de vraag
  // waarmee je een klantpagina opent: is hier recent nog iets gebeurd?
  const laatsteActiviteit = mostRecent(
    project.updated_at,
    updates[0]?.created_at,
    files[0]?.created_at,
    ...tasks.map((t) => t.updated_at),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border pb-4">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link
            to="/admin/klanten"
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Klanten
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          <span className="truncate font-medium">{naam}</span>
        </div>

        {laatsteActiviteit && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Laatste activiteit
            <span className="font-medium text-foreground">{momentLabel(laatsteActiviteit)}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5">
        <div className="flex min-w-0 items-center gap-4">
          {beeld ? (
            <img src={beeld} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover object-top" />
          ) : (
            <span
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold",
                tintFor(naam),
              )}
              aria-hidden="true"
            >
              {initials(naam)}
            </span>
          )}

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">{naam}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {project.client && project.client.name !== project.name ? `${project.name} · ` : ""}
              Klant sinds <span className="font-medium text-foreground">{formatDate(client?.created_at)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {client && <BillingButton client={client} />}

          {/* Mailen en bellen staan vooraan omdat dat de twee dingen zijn die
              je vanaf een klantpagina daadwerkelijk doet. */}
          {client?.email ? (
            <Button variant="outline" asChild>
              <a href={`mailto:${client.email}`}>
                <Mail className="h-4 w-4" />
                Mailen
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled title="Geen e-mailadres bekend">
              <Mail className="h-4 w-4" />
              Mailen
            </Button>
          )}

          {client?.phone ? (
            <Button variant="outline" asChild>
              <a href={`tel:${client.phone}`}>
                <Phone className="h-4 w-4" />
                Bellen
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled title="Geen telefoonnummer bekend">
              <Phone className="h-4 w-4" />
              Bellen
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <MoreHorizontal className="h-4 w-4" />
                Meer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" />
                Bewerken
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={() => void handleDelete()}
              >
                <Trash2 className="h-4 w-4" />
                Verwijderen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Twee kolommen: links wat er speelt, rechts waar je aan werkt. Onder
          de 1024 pixels stapelen ze, met de gegevens eerst. */}
      <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-0">
        <div className="lg:border-r lg:border-border lg:pr-8">
          <ProjectRail project={project} client={client ?? null} team={team} userId={user?.id ?? null} />
        </div>

        <div className="lg:pl-8">
          <Tabs defaultValue="taken">
            <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
              <Tab value="taken" count={openTasks}>
                Taken
              </Tab>
              <Tab value="bestanden" count={files.length}>
                Bestanden
              </Tab>
              <Tab value="tijdlijn">Tijdlijn</Tab>
            </TabsList>

            <TabsContent value="taken" className="mt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-tight">Openstaande taken</h2>
                {/* Eén knop, geen invoerveld vooraf: de taakpagina is de plek
                    waar je alles invult, dus daar kom je meteen terecht. */}
                <Button variant="outline" size="sm" disabled={isPending} onClick={() => void createTask(project.id)}>
                  <Plus className="h-4 w-4" />
                  Nieuwe taak
                </Button>
              </div>

              <TaskList
                tasks={tasks}
                team={team}
                showProject={false}
                variant="kaarten"
                empty={
                  <EmptyState
                    icon={CheckSquare}
                    title="Nog geen taken"
                    description="Maak de eerste taak aan om bij te houden wat er moet gebeuren."
                    action={
                      <Button disabled={isPending} onClick={() => void createTask(project.id)}>
                        <Plus className="h-4 w-4" />
                        Nieuwe taak
                      </Button>
                    }
                  />
                }
              />
            </TabsContent>

            <TabsContent value="bestanden" className="mt-6">
              <ProjectFiles projectId={project.id} userId={user?.id ?? null} team={team} />
            </TabsContent>

            <TabsContent value="tijdlijn" className="mt-6">
              <UpdatesTimeline projectId={project.id} userId={user?.id ?? null} team={team} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ClientProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client ?? null}
        project={project}
        userId={user?.id ?? null}
      />

      {dialoog}
    </div>
  );
};

export default ProjectDetail;
