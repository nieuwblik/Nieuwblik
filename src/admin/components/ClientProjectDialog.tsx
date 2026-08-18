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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { BILLING_CYCLE, BILLING_CYCLE_ORDER, type BillingCycle } from "@/admin/billing";
import {
  CLIENT_STATUS,
  CLIENT_STATUS_ORDER,
  PRIORITY,
  PRIORITY_ORDER,
  PROJECT_STATUS,
  PROJECT_STATUS_ORDER,
  type ClientStatus,
  type Priority,
  type ProjectStatus,
} from "@/admin/constants";
import DatePicker from "@/admin/components/DatePicker";
import { useSaveClient, useSaveProject, type Client, type Project } from "@/admin/queries";

interface ClientProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Beide meegeven om te bewerken; weglaten om een nieuwe klant aan te maken. */
  client?: Client | null;
  project?: Project | null;
  userId: string | null;
  /** Krijgt het nieuwe project-id, zodat de aanroeper er meteen heen kan. */
  onCreated?: (projectId: string) => void;
}

const GEEN = "__geen__";

const EMPTY = {
  name: "",
  contact_name: "",
  email: "",
  phone: "",
  website: "",
  city: "",
  clientStatus: "actief" as ClientStatus,
  notes: "",
  billingCycle: "" as BillingCycle | "",
  billingStart: "",
  billingNote: "",
  status: "lead" as ProjectStatus,
  priority: "normaal" as Priority,
  start_date: "",
  deadline: "",
  live_url: "",
  budget: "",
  description: "",
};

/**
 * Eén formulier voor de klant en het werk dat je voor ze doet.
 *
 * Aanmaken levert altijd allebei op: in dit portaal bestaat een klant zonder
 * project niet als losstaand begrip, en twee losse stappen zouden alleen maar
 * halve records opleveren. Onderwater blijven het twee tabellen, zodat een
 * klant later een tweede project kan krijgen zonder dubbele contactgegevens.
 */
const ClientProjectDialog = ({
  open,
  onOpenChange,
  client,
  project,
  userId,
  onCreated,
}: ClientProjectDialogProps) => {
  const [form, setForm] = useState(EMPTY);
  const saveClient = useSaveClient();
  const saveProject = useSaveProject();
  const isEdit = Boolean(client);

  useEffect(() => {
    if (!open) return;
    setForm(
      client
        ? {
            name: client.name,
            contact_name: client.contact_name ?? "",
            email: client.email ?? "",
            phone: client.phone ?? "",
            website: client.website ?? "",
            city: client.city ?? "",
            clientStatus: client.status,
            notes: client.notes ?? "",
            billingCycle: client.billing_cycle ?? "",
            billingStart: client.billing_start ?? "",
            billingNote: client.billing_note ?? "",
            status: project?.status ?? "lead",
            priority: project?.priority ?? "normaal",
            start_date: project?.start_date ?? "",
            deadline: project?.deadline ?? "",
            live_url: project?.live_url ?? "",
            budget: project?.budget_cents == null ? "" : String(project.budget_cents / 100),
            description: project?.description ?? "",
          }
        : EMPTY,
    );
  }, [open, client, project]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) {
      toast.error("Een naam is verplicht");
      return;
    }

    const budget = form.budget.trim();
    if (budget && !Number.isFinite(Number(budget))) {
      toast.error("Budget moet een bedrag zijn");
      return;
    }

    const clientValues = {
      name,
      contact_name: form.contact_name.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      website: form.website.trim() || null,
      city: form.city.trim() || null,
      status: form.clientStatus,
      notes: form.notes.trim() || null,
      billing_cycle: form.billingCycle || null,
      billing_start: form.billingCycle ? form.billingStart || null : null,
      billing_note: form.billingNote.trim() || null,
    };

    const projectValues = {
      name,
      status: form.status,
      priority: form.priority,
      start_date: form.start_date || null,
      deadline: form.deadline || null,
      live_url: form.live_url.trim() || null,
      budget_cents: budget ? Math.round(Number(budget) * 100) : null,
      description: form.description.trim() || null,
    };

    try {
      const savedClient = await saveClient.mutateAsync({
        id: client?.id,
        values: { ...clientValues, ...(client ? {} : { created_by: userId }) },
      });

      const savedProject = await saveProject.mutateAsync({
        id: project?.id,
        values: {
          ...projectValues,
          client_id: savedClient.id,
          ...(project ? {} : { created_by: userId }),
        },
      });

      toast.success(isEdit ? "Bijgewerkt" : "Klant aangemaakt");
      onOpenChange(false);
      if (!project) onCreated?.(savedProject.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  };

  const isPending = saveClient.isPending || saveProject.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Klant bewerken" : "Nieuwe klant"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Contactgegevens en de stand van het werk."
              : "Contactgegevens en het werk dat je voor ze gaat doen."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cp-name">Naam *</Label>
              <Input
                id="cp-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-contact">Contactpersoon</Label>
                <Input
                  id="cp-contact"
                  value={form.contact_name}
                  onChange={(e) => set("contact_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp-city">Plaats</Label>
                <Input id="cp-city" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-email">E-mail</Label>
                <Input
                  id="cp-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp-phone">Telefoon</Label>
                <Input id="cp-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-website">Website</Label>
                <Input
                  id="cp-website"
                  placeholder="https://"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp-relatie">Relatie</Label>
                <Select value={form.clientStatus} onValueChange={(v) => set("clientStatus", v as ClientStatus)}>
                  <SelectTrigger id="cp-relatie">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENT_STATUS_ORDER.map((s) => (
                      <SelectItem key={s} value={s}>
                        {CLIENT_STATUS[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-status">Fase</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v as ProjectStatus)}>
                  <SelectTrigger id="cp-status">
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
                <Label htmlFor="cp-priority">Prioriteit</Label>
                <Select value={form.priority} onValueChange={(v) => set("priority", v as Priority)}>
                  <SelectTrigger id="cp-priority">
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
                <Label>Startdatum</Label>
                <DatePicker
                  value={form.start_date || null}
                  onChange={(waarde) => set("start_date", waarde ?? "")}
                  aria-label="Startdatum"
                  className="h-10 border border-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <DatePicker
                  value={form.deadline || null}
                  onChange={(waarde) => set("deadline", waarde ?? "")}
                  aria-label="Deadline"
                  className="h-10 border border-input"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-live">Live URL</Label>
                <Input
                  id="cp-live"
                  placeholder="https://"
                  value={form.live_url}
                  onChange={(e) => set("live_url", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp-budget">Budget (€)</Label>
                <Input
                  id="cp-budget"
                  inputMode="decimal"
                  placeholder="2500"
                  value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cp-description">Omschrijving</Label>
              <Textarea
                id="cp-description"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                maxLength={10000}
              />
            </div>

            {/* Hosting en onderhoud: wat er periodiek gefactureerd wordt. De
                datums zelf staan nergens opgeslagen — die volgen hieruit, en
                verschijnen op de hostingpagina. */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-billing">Facturatie</Label>
                <Select
                  value={form.billingCycle || GEEN}
                  onValueChange={(v) => set("billingCycle", v === GEEN ? "" : (v as BillingCycle))}
                >
                  <SelectTrigger id="cp-billing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GEEN}>Geen</SelectItem>
                    {BILLING_CYCLE_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>
                        {BILLING_CYCLE[c].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.billingCycle && (
                <div className="space-y-2">
                  <Label>Ingegaan op</Label>
                  <DatePicker
                    value={form.billingStart || null}
                    onChange={(waarde) => set("billingStart", waarde ?? "")}
                    aria-label="Ingangsdatum facturatie"
                    className="h-10 border border-input"
                  />
                </div>
              )}
            </div>

            {form.billingCycle && (
              <div className="space-y-2">
                <Label htmlFor="cp-billing-note">Notitie bij de facturatie</Label>
                <Textarea
                  id="cp-billing-note"
                  rows={2}
                  placeholder="Wat er onder het contract valt, afwijkende afspraken…"
                  value={form.billingNote}
                  onChange={(e) => set("billingNote", e.target.value)}
                  maxLength={2000}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cp-notes">Interne notities</Label>
              <Textarea
                id="cp-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                maxLength={10000}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Opslaan…" : "Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientProjectDialog;
