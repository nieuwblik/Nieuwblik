import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "@/admin/components/DatePicker";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { hoofdtaken } from "@/admin/constants";
import { useProjects, useTasks, useTeam } from "@/admin/queries";
import { formatDuur, useSaveUren, type UrenRegel } from "@/admin/uren";

const GEEN = "__geen__";

interface UrenDialoogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Meegeven om te bewerken; weglaten om nieuwe uren toe te voegen. */
  regel?: UrenRegel | null;
  /** Begindatum bij nieuwe uren (yyyy-MM-dd), standaard vandaag. */
  datum?: string;
  /** Project dat bij nieuwe uren al gekozen staat, zoals op de klantpagina. */
  projectId?: string | null;
}

const LEEG = {
  datum: "",
  van: "09:00",
  tot: "10:00",
  projectId: null as string | null,
  taskId: null as string | null,
  omschrijving: "",
  billable: true,
  userId: "",
};

/** "09:30" op een datum naar een Date in de eigen tijdzone. */
function opDag(datum: string, tijd: string): Date {
  const [jaar, maand, dag] = datum.split("-").map(Number);
  const [uur, minuut] = tijd.split(":").map(Number);
  return new Date(jaar ?? 0, (maand ?? 1) - 1, dag ?? 1, uur ?? 0, minuut ?? 0);
}

/**
 * Uren met de hand vastleggen of bijstellen: voor werk waar de timer niet bij
 * liep, of als je vergat hem te stoppen. Een lopende timer bewerk je hier ook;
 * leeg je de eindtijd niet, dan stopt hij op de ingevulde tijd.
 */
const UrenDialoog = ({ open, onOpenChange, regel, datum, projectId = null }: UrenDialoogProps) => {
  const { user } = useAdminAuth();
  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const save = useSaveUren();
  const [form, setForm] = useState(LEEG);

  useEffect(() => {
    if (!open) return;
    if (regel) {
      const begin = new Date(regel.started_at);
      const eind = regel.ended_at ? new Date(regel.ended_at) : new Date();
      setForm({
        datum: format(begin, "yyyy-MM-dd"),
        van: format(begin, "HH:mm"),
        tot: format(eind, "HH:mm"),
        projectId: regel.project_id,
        taskId: regel.task_id,
        omschrijving: regel.description ?? "",
        billable: regel.billable,
        userId: regel.user_id,
      });
    } else {
      setForm({ ...LEEG, datum: datum ?? format(new Date(), "yyyy-MM-dd"), userId: user?.id ?? "", projectId });
    }
  }, [open, regel, datum, projectId, user?.id]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const taken = useMemo(
    () =>
      hoofdtaken(tasks).filter(
        (t) => (t.status !== "klaar" || t.id === form.taskId) && (!form.projectId || t.project_id === form.projectId),
      ),
    [tasks, form.projectId, form.taskId],
  );

  const begin = form.datum ? opDag(form.datum, form.van) : null;
  const eind = form.datum ? opDag(form.datum, form.tot) : null;
  const minuten = begin && eind ? Math.round((eind.getTime() - begin.getTime()) / 60_000) : 0;

  const opslaan = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!begin || !eind || minuten <= 0) {
      toast.error("De eindtijd moet na de begintijd liggen");
      return;
    }
    try {
      await save.mutateAsync({
        ...(regel ? { id: regel.id } : {}),
        values: {
          started_at: begin.toISOString(),
          ended_at: eind.toISOString(),
          project_id: form.projectId,
          task_id: form.taskId,
          description: form.omschrijving.trim() || null,
          billable: form.billable,
          user_id: form.userId || user!.id,
        },
      });
      toast.success(regel ? "Uren bijgewerkt" : "Uren toegevoegd");
      onOpenChange(false);
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Opslaan mislukt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{regel ? "Uren bewerken" : "Uren toevoegen"}</DialogTitle>
          <DialogDescription>
            {regel && !regel.ended_at
              ? "Deze timer loopt nog. Opslaan zet hem stil op de eindtijd hieronder."
              : "Voor werk waar de timer niet bij liep."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={opslaan} className="space-y-4">
          <div className="grid grid-cols-[1fr_auto_auto] items-end gap-3">
            <div className="space-y-1.5">
              <Label>Datum</Label>
              <DatePicker
                value={form.datum || null}
                onChange={(waarde) => set("datum", waarde ?? "")}
                aria-label="Datum"
                className="h-10 w-full border border-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uren-van">Van</Label>
              <Input id="uren-van" type="time" value={form.van} onChange={(e) => set("van", e.target.value)} className="w-[6.5rem]" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uren-tot">Tot</Label>
              <Input id="uren-tot" type="time" value={form.tot} onChange={(e) => set("tot", e.target.value)} className="w-[6.5rem]" />
            </div>
          </div>
          <p className="-mt-2 text-[13px] text-muted-foreground">
            {minuten > 0 ? formatDuur(minuten) : "Eindtijd ligt voor de begintijd"}
          </p>

          <div className="space-y-1.5">
            <Label>Project</Label>
            <Select
              value={form.projectId ?? GEEN}
              onValueChange={(v) => setForm((f) => ({ ...f, projectId: v === GEEN ? null : v, taskId: null }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GEEN}>Zonder project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.client?.name ?? p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Taak</Label>
            <Select
              value={form.taskId ?? GEEN}
              onValueChange={(v) => {
                const taak = tasks.find((t) => t.id === v);
                setForm((f) => ({ ...f, taskId: v === GEEN ? null : v, projectId: taak?.project_id ?? f.projectId }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GEEN}>Geen taak</SelectItem>
                {taken.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="uren-omschrijving">Omschrijving</Label>
            <Input
              id="uren-omschrijving"
              value={form.omschrijving}
              onChange={(e) => set("omschrijving", e.target.value)}
              placeholder="Wat heb je gedaan?"
              maxLength={500}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={form.billable} onCheckedChange={(v) => set("billable", v === true)} />
              Factureerbaar
            </label>
            {team.length > 1 && (
              <Select value={form.userId} onValueChange={(v) => set("userId", v)}>
                <SelectTrigger className="h-9 w-auto gap-2" aria-label="Wie">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {team.map((lid) => (
                    <SelectItem key={lid.user_id} value={lid.user_id}>
                      {lid.user_id === user?.id ? `${lid.name} (jij)` : lid.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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

export default UrenDialoog;
