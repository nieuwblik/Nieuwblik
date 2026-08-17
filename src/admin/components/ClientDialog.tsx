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
import { CLIENT_STATUS, CLIENT_STATUS_ORDER, type ClientStatus } from "@/admin/constants";
import { useSaveClient, type Client } from "@/admin/queries";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Meegeven om te bewerken; weglaten om een nieuwe klant aan te maken. */
  client?: Client | null;
  userId: string | null;
}

const EMPTY = {
  name: "",
  contact_name: "",
  email: "",
  phone: "",
  website: "",
  city: "",
  status: "actief" as ClientStatus,
  notes: "",
};

const ClientDialog = ({ open, onOpenChange, client, userId }: ClientDialogProps) => {
  const [form, setForm] = useState(EMPTY);
  const save = useSaveClient();

  // Het formulier vullen zodra de dialoog opengaat, zodat een vorige
  // bewerking niet blijft hangen in het volgende scherm.
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
            status: client.status,
            notes: client.notes ?? "",
          }
        : EMPTY,
    );
  }, [open, client]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Een klantnaam is verplicht");
      return;
    }

    try {
      await save.mutateAsync({
        id: client?.id,
        values: {
          name: form.name.trim(),
          contact_name: form.contact_name.trim() || null,
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          website: form.website.trim() || null,
          city: form.city.trim() || null,
          status: form.status,
          notes: form.notes.trim() || null,
          ...(client ? {} : { created_by: userId }),
        },
      });
      toast.success(client ? "Klant bijgewerkt" : "Klant toegevoegd");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{client ? "Klant bewerken" : "Nieuwe klant"}</DialogTitle>
          <DialogDescription>
            {client ? "Pas de gegevens van deze klant aan." : "Voeg een klant toe om projecten aan te koppelen."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Bedrijfsnaam *</Label>
            <Input
              id="client-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client-contact">Contactpersoon</Label>
              <Input
                id="client-contact"
                value={form.contact_name}
                onChange={(e) => set("contact_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-city">Plaats</Label>
              <Input id="client-city" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client-email">E-mail</Label>
              <Input
                id="client-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Telefoon</Label>
              <Input id="client-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client-website">Website</Label>
              <Input
                id="client-website"
                placeholder="https://"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as ClientStatus)}>
                <SelectTrigger id="client-status">
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

          <div className="space-y-2">
            <Label htmlFor="client-notes">Notities</Label>
            <Textarea
              id="client-notes"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
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

export default ClientDialog;
