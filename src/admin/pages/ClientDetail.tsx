import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, FolderKanban, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClientProjectDialog from "@/admin/components/ClientProjectDialog";
import EmptyState from "@/admin/components/EmptyState";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { useClient, useProjects } from "@/admin/queries";

/**
 * Klant en project zijn in het portaal één ding, dus deze route stuurt door
 * naar het werk van de klant. Alleen wanneer er nog geen project is, is er
 * iets eigens te tonen: dat gat kan ontstaan als een project verwijderd wordt
 * terwijl de klant blijft staan.
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

  if (own.length > 0) return <Navigate to={`/admin/projecten/${own[0].id}`} replace />;

  return (
    <div className="space-y-6">
      <Link
        to="/admin/klanten"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Klanten
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {[client.contact_name, client.email, client.city].filter(Boolean).join(" · ") || "Geen contactgegevens"}
        </p>
      </div>

      <Card>
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
