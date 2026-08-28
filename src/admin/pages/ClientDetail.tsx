import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, FolderKanban, Mail, Phone, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import BillingButton from "@/admin/components/BillingButton";
import ClientProjectDialog from "@/admin/components/ClientProjectDialog";
import EmptyState from "@/admin/components/EmptyState";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { formatDate, initials, tintFor } from "@/admin/format";
import { useClient, useProjects } from "@/admin/queries";

/**
 * Klant en project zijn in het portaal één ding, dus deze route stuurt door
 * naar het werk van de klant. Alleen wanneer er nog geen project is, is er
 * iets eigens te tonen: dat gat kan ontstaan als een project verwijderd wordt
 * terwijl de klant blijft staan.
 *
 * De kop is dezelfde als op de gewone klantpagina — kruimelpad, portret,
 * contactknoppen — zodat je bij een klant zonder werk niet op een heel ander
 * scherm belandt.
 */
const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAdminAuth();
  const { data: client, isLoading, isError } = useClient(id);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);

  const own = useMemo(() => projects.filter((p) => p.client_id === id), [projects, id]);

  if (isLoading || projectsLoading) return <p className="text-sm text-muted-foreground">Laden…</p>;
  if (isError || !client) return <p className="text-sm text-muted-foreground">Deze klant bestaat niet (meer).</p>;

  const eerste = own[0];
  if (eerste) return <Navigate to={`/admin/projecten/${eerste.id}`} replace />;

  return (
    <div>
      <div className="flex min-w-0 items-center gap-2 border-b border-border pb-4 text-sm">
        <Link
          to="/admin/klanten"
          className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Klanten
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        <span className="truncate font-medium">{client.name}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5">
        <div className="flex min-w-0 items-center gap-4">
          <span
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold",
              tintFor(client.name),
            )}
            aria-hidden="true"
          >
            {initials(client.name)}
          </span>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">{client.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Klant sinds <span className="font-medium text-foreground">{formatDate(client.created_at)}</span>
              {client.city ? ` · ${client.city}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BillingButton client={client} />

          {client.email ? (
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

          {client.phone ? (
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
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <EmptyState
            icon={FolderKanban}
            title="Nog geen project"
            description="Er hangt geen werk aan deze klant, dus er valt niets bij te houden."
            action={
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Project toevoegen
              </Button>
            }
          />
        </CardContent>
      </Card>

      <ClientProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={client}
        userId={user?.id ?? null}
      />
    </div>
  );
};

export default ClientDetail;
