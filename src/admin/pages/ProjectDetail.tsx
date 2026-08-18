import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckSquare, ExternalLink, Mail, MapPin, Pencil, Phone, Plus, Receipt, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import ClientProjectDialog from "@/admin/components/ClientProjectDialog";
import ProjectFiles from "@/admin/components/ProjectFiles";
import StatusBadge from "@/admin/components/StatusBadge";
import TaskList from "@/admin/components/TaskList";
import UpdatesTimeline from "@/admin/components/UpdatesTimeline";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import BillingButton from "@/admin/components/BillingButton";
import { daysUntil, deadlineLabel, formatBudget, formatDate } from "@/admin/format";
import { forgetRecentProject, recordRecentProject } from "@/admin/recent";
import { useConfirm } from "@/admin/useConfirm";
import { useCreateTask } from "@/admin/useCreateTask";
import {
  useClient,
  useDeleteClient,
  useDeleteProject,
  useProject,
  useProjectFiles,
  useTasks,
  useTeam,
  type TaskWithProject,
} from "@/admin/queries";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm">{children}</p>
  </div>
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
  const removeProject = useDeleteProject();
  const removeClient = useDeleteClient();
  const { vraagBevestiging, dialoog } = useConfirm();

  const [editOpen, setEditOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  const tasks = useMemo(() => allTasks.filter((t) => t.project_id === id), [allTasks, id]);
  const openTasks = tasks.filter((t) => t.status !== "klaar").length;

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
    const naam = project.client?.name ?? project.name;
    const door = await vraagBevestiging({
      titel: `"${naam}" verwijderen?`,
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
      toast.success(`"${naam}" verwijderd`);
      navigate("/admin/klanten");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verwijderen mislukt");
    }
  };

  const late = (daysUntil(project.deadline) ?? 1) < 0;

  return (
    <div className="space-y-6">
      <Link
        to="/admin/klanten"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Klanten
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{project.client?.name ?? project.name}</h1>

          {/* Contactgegevens staan hier en niet op een aparte klantpagina: je
              belt of mailt ze vanuit het werk, niet vanuit een adresboek. */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {project.client && project.client.name !== project.name && <span>{project.name}</span>}
            {client?.contact_name && <span>{client.contact_name}</span>}
            {client?.email && (
              <a href={`mailto:${client.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                <Mail className="h-3.5 w-3.5" />
                {client.email}
              </a>
            )}
            {client?.phone && (
              <a href={`tel:${client.phone}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                <Phone className="h-3.5 w-3.5" />
                {client.phone}
              </a>
            )}
            {client?.city && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {client.city}
              </span>
            )}
            {!project.client && <span>Geen klant gekoppeld</span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* De fase stond hier als keuzelijst, maar met bijna alles op "live"
              zei die niets. Wat je hier wél wilt weten: loopt er een contract,
              en wanneer mag de volgende factuur eruit. De fase staat nog in de
              kaart hieronder en is aanpasbaar via Bewerken. */}
          {client && <BillingButton client={client} />}

          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Bewerken
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => void handleDelete()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Status">
            <StatusBadge kind="project" value={project.status} />
          </Field>
          <Field label="Prioriteit">
            <StatusBadge kind="priority" value={project.priority} />
          </Field>
          <Field label="Deadline">
            <span className={cn(late && project.status !== "live" && "font-medium text-rose-600 dark:text-rose-400")}>
              {deadlineLabel(project.deadline)}
            </span>
          </Field>
          <Field label="Budget">{formatBudget(project.budget_cents)}</Field>
          <Field label="Gestart">{formatDate(project.start_date)}</Field>
          <Field label="Opgeleverd">{formatDate(project.launched_on)}</Field>
          <Field label="Live website">
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {project.live_url.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              "—"
            )}
          </Field>
          <Field label="Portfolio">
            {project.portfolio_slug ? (
              <a
                href={`/portfolio/${project.portfolio_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Case bekijken
              </a>
            ) : (
              "—"
            )}
          </Field>
        </CardContent>
      </Card>

      {project.description && (
        <Card>
          <CardContent className="p-4">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Taken staan vooraan: bij het openen van een project wil je zien wat
          er te doen is, niet wat er is gebeurd. */}
      <Tabs defaultValue="taken">
        <TabsList>
          <TabsTrigger value="taken">Taken{openTasks > 0 && ` (${openTasks})`}</TabsTrigger>
          <TabsTrigger value="updates">Tijdlijn</TabsTrigger>
          <TabsTrigger value="bestanden">Bestanden{files.length > 0 && ` (${files.length})`}</TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <UpdatesTimeline projectId={project.id} userId={user?.id ?? null} team={team} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taken" className="mt-4">
          <Card>
            <CardContent className="p-4">
              {/* Eén knop, geen invoerveld vooraf: de taakpagina is de plek
                  waar je alles invult, dus daar kom je meteen terecht. */}
              <div className="mb-3 flex justify-end">
                <Button size="sm" disabled={isPending} onClick={() => void createTask(project.id)}>
                  <Plus className="h-4 w-4" />
                  Nieuwe taak
                </Button>
              </div>

              <TaskList
                tasks={tasks}
                team={team}
                showProject={false}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bestanden" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <ProjectFiles projectId={project.id} userId={user?.id ?? null} team={team} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
