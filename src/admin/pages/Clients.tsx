import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/admin/components/EmptyState";
import ClientDialog from "@/admin/components/ClientDialog";
import StatusBadge from "@/admin/components/StatusBadge";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { CLIENT_STATUS, CLIENT_STATUS_ORDER, type ClientStatus } from "@/admin/constants";
import { useClients, useProjects } from "@/admin/queries";

const Clients = () => {
  const { user } = useAdminAuth();
  const { data: clients = [], isLoading } = useClients();
  const { data: projects = [] } = useProjects();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ClientStatus | "alle">("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();

  // Aangeroepen vanuit het command-palet met { nieuw: true }.
  useEffect(() => {
    if (!(location.state as { nieuw?: boolean } | null)?.nieuw) return;
    setDialogOpen(true);
    window.history.replaceState({}, "");
  }, [location.state]);

  /** Aantal projecten per klant, zodat de lijst laat zien waar het werk zit. */
  const projectCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      if (!project.client_id) continue;
      counts.set(project.client_id, (counts.get(project.client_id) ?? 0) + 1);
    }
    return counts;
  }, [projects]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (filter !== "alle" && c.status !== filter) return false;
      if (!term) return true;
      return [c.name, c.contact_name, c.email, c.city].some((v) => (v ?? "").toLowerCase().includes(term));
    });
  }, [clients, search, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Klanten</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {clients.length} {clients.length === 1 ? "klant" : "klanten"}.
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
        <Select value={filter} onValueChange={(v) => setFilter(v as ClientStatus | "alle")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle statussen</SelectItem>
            {CLIENT_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {CLIENT_STATUS[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Klanten laden…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Geen klanten gevonden"
          description={clients.length === 0 ? "Voeg je eerste klant toe." : "Pas het filter of de zoekterm aan."}
          action={
            clients.length === 0 ? (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nieuwe klant
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Klant</TableHead>
                <TableHead>Contactpersoon</TableHead>
                <TableHead className="hidden md:table-cell">Plaats</TableHead>
                <TableHead className="hidden lg:table-cell">E-mail</TableHead>
                <TableHead className="text-right">Projecten</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <Link to={`/admin/klanten/${client.id}`} className="hover:underline">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.contact_name || "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{client.city || "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{client.email || "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{projectCounts.get(client.id) ?? 0}</TableCell>
                  <TableCell>
                    <StatusBadge kind="client" value={client.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ClientDialog open={dialogOpen} onOpenChange={setDialogOpen} userId={user?.id ?? null} />
    </div>
  );
};

export default Clients;
