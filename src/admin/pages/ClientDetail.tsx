import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FolderKanban, Mail, MapPin, Pencil, Phone, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/admin/components/EmptyState";
import ClientDialog from "@/admin/components/ClientDialog";
import ProjectDialog from "@/admin/components/ProjectDialog";
import StatusBadge from "@/admin/components/StatusBadge";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { deadlineLabel, formatDate } from "@/admin/format";
import { useClient, useDeleteClient, useProjects } from "@/admin/queries";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { data: client, isLoading, isError } = useClient(id);
  const { data: allProjects = [] } = useProjects();
  const remove = useDeleteClient();
  const [editOpen, setEditOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  const projects = useMemo(() => allProjects.filter((p) => p.client_id === id), [allProjects, id]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Klant laden…</p>;
  if (isError || !client) return <p className="text-sm text-muted-foreground">Deze klant bestaat niet (meer).</p>;

  const handleDelete = async () => {
    const message =
      projects.length > 0
        ? `"${client.name}" verwijderen? De ${projects.length} gekoppelde ${
            projects.length === 1 ? "project verdwijnt" : "projecten verdwijnen"
          } dan ook, inclusief taken, updates en bestanden.`
        : `"${client.name}" verwijderen?`;
    if (!window.confirm(message)) return;

    try {
      await remove.mutateAsync(client.id);
      toast.success("Klant verwijderd");
      navigate("/admin/klanten");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verwijderen mislukt");
    }
  };

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
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
            <StatusBadge kind="client" value={client.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Klant sinds {formatDate(client.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Bewerken
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => void handleDelete()}
          >
            <Trash2 className="h-4 w-4" />
            Verwijderen
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contactgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {client.contact_name && <p className="font-medium">{client.contact_name}</p>}
            {client.email && (
              <a href={`mailto:${client.email}`} className="flex items-center gap-2 hover:underline">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{client.email}</span>
              </a>
            )}
            {client.phone && (
              <a href={`tel:${client.phone}`} className="flex items-center gap-2 hover:underline">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                {client.phone}
              </a>
            )}
            {client.city && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                {client.city}
              </p>
            )}
            {client.website && (
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{client.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
            {!client.email && !client.phone && !client.city && !client.website && !client.contact_name && (
              <p className="text-muted-foreground">Nog geen contactgegevens ingevuld.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Projecten</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setProjectOpen(true)}>
              <Plus className="h-4 w-4" />
              Project
            </Button>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="Nog geen projecten"
                description="Koppel een project aan deze klant."
              />
            ) : (
              <ul className="divide-y divide-border">
                {projects.map((project) => (
                  <li key={project.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link
                        to={`/admin/projecten/${project.id}`}
                        className="block truncate text-sm font-medium hover:underline"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{deadlineLabel(project.deadline)}</p>
                    </div>
                    <StatusBadge kind="project" value={project.status} className="shrink-0" />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {client.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      <ClientDialog open={editOpen} onOpenChange={setEditOpen} client={client} userId={user?.id ?? null} />
      <ProjectDialog
        open={projectOpen}
        onOpenChange={setProjectOpen}
        defaultClientId={client.id}
        userId={user?.id ?? null}
      />
    </div>
  );
};

export default ClientDetail;
