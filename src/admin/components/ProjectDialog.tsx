import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PRIORITY,
  PRIORITY_ORDER,
  PROJECT_STATUS,
  PROJECT_STATUS_ORDER,
  type Priority,
  type ProjectStatus,
} from "@/admin/constants";
import { useClients, useSaveProject, type Project } from "@/admin/queries";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  /** Voorselectie bij aanmaken vanaf een klantpagina. */
  defaultClientId?: string;
  userId: string | null;
}

const NO_CLIENT = "__none__";

const EMPTY = {
  name: "",
  client_id: NO_CLIENT,
  status: "lead" as ProjectStatus,
  priority: "normaal" as Priority,
  start_date: "",
  deadline: "",
  live_url: "",
  budget: "",
  description: "",
};

const ProjectDialog = ({ open, onOpenChange, project, defaultClientId, userId }: ProjectDialogProps) => {
  const [form, setForm] = useState(EMPTY);
  const { data: clients = [] } = useClients();
  const save = useSaveProject();

  useEffect(() => {
    if (!open) return;
    setForm(
      project
        ? {
            name: project.name,
            client_id: project.client_id ?? NO_CLIENT,
            status: project.status,
            priority: project.priority,
            start_date: project.start_date ?? "",
            deadline: project.deadline ?? "",
            live_url: project.live_url ?? "",
            budget: project.budget_cents === null ? "" : String(project.budget_cents / 100),
            description: project.description ?? "",
          }
        : { ...EMPTY, client_id: defaultClientId ?? NO_CLIENT },
    );
  }, [open, project, defaultClientId]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Een projectnaam is verplicht");
      return;
    }

    const budget = form.budget.trim();
    if (budget && !Number.isFinite(Number(budget))) {
      toast.error("Budget moet een bedrag zijn");
      return;
    }

    try {
      await save.mutateAsync({
        id: project?.id,
        values: {
          name: form.name.trim(),
          client_id: form.client_id === NO_CLIENT ? null : form.client_id,
          status: form.status,
          priority: form.priority,
          start_date: form.start_date || null,
          deadline: form.deadline || null,
          live_url: form.live_url.trim() || null,
          budget_cents: budget ? Math.round(Number(budget) * 100) : null,
          description: form.description.trim() || null,
          ...(project ? {} : { created_by: userId }),
        },
      });
      toast.success(project ? "Project bijgewerkt" : "Project aangemaakt");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{project ? "Project bewerken" : "Nieuw project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Werk de gegevens van dit project bij."
              : "Statuswijzigingen komen automatisch in de tijdlijn te staan."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Projectnaam *</Label>
            <Input
              id="project-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-client">Klant</Label>
            <Select value={form.client_id} onValueChange={(v) => set("client_id", v)}>
              <SelectTrigger id="project-client">
                <SelectValue placeholder="Kies een klant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CLIENT}>Geen klant</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as ProjectStatus)}>
                <SelectTrigger id="project-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {PROJECT_STATUS[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-priority">Prioriteit</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v as Priority)}>
                <SelectTrigger id="project-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_ORDER.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY[p].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-start">Startdatum</Label>
              <Input
                id="project-start"
                type="date"
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-deadline">Deadline</Label>
              <Input
                id="project-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-url">Live URL</Label>
              <Input
                id="project-url"
                placeholder="https://"
                value={form.live_url}
                onChange={(e) => set("live_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-budget">Budget (€)</Label>
              <Input
                id="project-budget"
                inputMode="decimal"
                placeholder="2500"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Omschrijving</Label>
            <Textarea
              id="project-description"
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={10000}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Opslaan…" : "Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
