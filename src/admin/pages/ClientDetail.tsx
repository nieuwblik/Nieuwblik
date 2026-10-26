import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, CloudUpload, Eye, EyeOff, FolderKanban, Mail, Phone, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BillingButton from "@/admin/components/BillingButton";
import ClientProjectDialog from "@/admin/components/ClientProjectDialog";
import EmptyState from "@/admin/components/EmptyState";
import InMoneybirdZetten from "@/admin/components/InMoneybirdZetten";
import NotitieWerkplek from "@/admin/components/NotitieWerkplek";
import TaskList from "@/admin/components/TaskList";
import { hoofdtaken } from "@/admin/constants";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { formatDate } from "@/admin/format";
import Avatar from "@/admin/ui/Avatar";
import { useClient, useProjects, useTasks, useTeam, useVerbergKlant } from "@/admin/queries";

/**
 * Klant en project zijn in het portaal één ding, dus deze route stuurt door
 * naar het werk van de klant. Alleen wanneer er nog geen project is, is er
 * iets eigens te tonen: dat gat kan ontstaan als een project verwijderd wordt
 * terwijl de klant blijft staan.
 *
 * De kop is dezelfde als op de gewone klantpagina — kruimelpad, portret,
 * contactknoppen — zodat je bij een klant zonder werk niet op een heel ander
 * scherm belandt.
 *
 * Taken kunnen ook zonder project bij een klant horen (nabellen over een
 * factuur, een offerte factureren); die staan hier.
 */
const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAdminAuth();
  const { data: client, isLoading, isError } = useClient(id);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const verberg = useVerbergKlant();
  const [inMoneybird, setInMoneybird] = useState(false);

  const own = useMemo(() => projects.filter((p) => p.client_id === id), [projects, id]);
  const taken = useMemo(() => tasks.filter((t) => t.client_id === id), [tasks, id]);

  if (isLoading || projectsLoading) return <Skeleton className="h-40 rounded-[14px]" />;
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
          <Avatar naam={client.name} maat="lg" vorm="rond" />

          <div className="min-w-0">
            <h1 className="truncate text-2xl tracking-tight">{client.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Klant sinds <span className="font-medium text-foreground">{formatDate(client.created_at)}</span>
              {client.city ? ` · ${client.city}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!client.moneybird_contact_id && (
            <Button variant="outline" onClick={() => setInMoneybird(true)}>
              <CloudUpload className="h-4 w-4" />
              In Moneybird zetten
            </Button>
          )}
          <Button
            variant="outline"
            disabled={verberg.isPending}
            onClick={() => {
              const verbergen = !client.verborgen_op;
              verberg.mutate(
                { id: client.id, verbergen },
                {
                  onSuccess: () => toast.success(verbergen ? `${client.name} is verborgen` : `${client.name} staat weer in de lijst`),
                  onError: (e) => toast.error(e.message),
                },
              );
            }}
          >
            {client.verborgen_op ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {client.verborgen_op ? "Weer tonen" : "Verbergen"}
          </Button>
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

      {hoofdtaken(taken).length > 0 && (
        <div className="mt-6">
          <TaskList tasks={taken} team={team} showProject={false} />
        </div>
      )}

      <div className="mt-6">
          <EmptyState
            icon={FolderKanban}
            title="Nog geen project"
            description={
              taken.length > 0
                ? "Deze taken horen bij de klant zelf. Voor websitewerk maak je een project aan."
                : "Er hangt geen werk aan deze klant, dus er valt niets bij te houden."
            }
            action={
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Project toevoegen
              </Button>
            }
          />
      </div>

      {/* Ook een klant zonder project kan notities hebben. */}
      <div className="mt-8">
        <NotitieWerkplek
          klantId={client.id}
          kop={<h2 className="text-lg font-semibold tracking-tight">Notities</h2>}
          hoogte="lg:h-[560px]"
        />
      </div>

      <InMoneybirdZetten open={inMoneybird} onOpenChange={setInMoneybird} client={client} />

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
