import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/admin/components/DatePicker";
import { PRIORITY, PRIORITY_ORDER, type Priority } from "@/admin/constants";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { useSaveTask, useTasks } from "@/admin/queries";
import { useCombinedRows } from "@/admin/rows";

interface QuickCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Voorgevulde deadline, bij openen vanaf een dag in de kalender. */
  defaultDueDate?: string | null;
}

const NO_CLIENT = "__none__";

/**
 * Snel vastleggen wat een klant wil, zonder de pagina te verlaten.
 *
 * Dit is de handeling die het vaakst voorkomt: iemand belt of mailt, en dat
 * moet ergens landen voordat het vergeten wordt. Daarom één veld voor de
 * vraag zelf, en verder niets verplichts — prioriteit en klant staan al goed
 * als je gewoon Enter drukt.
 *
 * De eerste regel wordt de titel, de rest de omschrijving. Zo kun je een
 * mailtje in één keer plakken zonder eerst te knippen.
 */
const QuickCapture = ({ open, onOpenChange, defaultDueDate = null }: QuickCaptureProps) => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { rows } = useCombinedRows();
  const { data: tasks = [] } = useTasks();
  const save = useSaveTask();

  const [text, setText] = useState("");
  const [projectId, setProjectId] = useState(NO_CLIENT);
  const [priority, setPriority] = useState<Priority>("normaal");
  const [deadline, setDeadline] = useState<string | null>(null);

  /** Sta je al bij een klant of taak, dan is dat vrijwel altijd de juiste. */
  const projectUitContext = useMemo(() => {
    const projectMatch = location.pathname.match(/^\/admin\/projecten\/([^/]+)/);
    if (projectMatch) return projectMatch[1];

    const taskMatch = location.pathname.match(/^\/admin\/taken\/([^/]+)/);
    if (taskMatch) return tasks.find((t) => t.id === taskMatch[1])?.project_id ?? null;

    return null;
  }, [location.pathname, tasks]);

  useEffect(() => {
    if (!open) return;
    setText("");
    setPriority("normaal");
    setDeadline(defaultDueDate);
    setProjectId(projectUitContext ?? NO_CLIENT);
  }, [open, projectUitContext, defaultDueDate]);

  const keuzes = useMemo(
    () =>
      rows
        .filter((row) => row.project)
        .map((row) => ({ id: row.project!.id, naam: row.client.name }))
        .sort((a, b) => a.naam.localeCompare(b.naam, "nl")),
    [rows],
  );

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || save.isPending) return;

    const [eersteRegel, ...rest] = trimmed.split("\n");
    const omschrijving = rest.join("\n").trim();

    try {
      const taak = await save.mutateAsync({
        values: {
          title: eersteRegel.slice(0, 300),
          description: omschrijving || null,
          project_id: projectId === NO_CLIENT ? null : projectId,
          priority,
          // Een deadline is optioneel: veel verzoeken hebben er geen, en er
          // een verzinnen maakt de kalender onbetrouwbaar.
          due_date: deadline,
          assigned_to: user?.id ?? null,
          created_by: user?.id ?? null,
        },
      });

      const klant = keuzes.find((k) => k.id === projectId)?.naam;
      toast.success(klant ? `Toegevoegd bij ${klant}` : "Toegevoegd", {
        action: { label: "Openen", onClick: () => navigate(`/admin/taken/${taak.id}`) },
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toevoegen mislukt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Wat moet er gebeuren?</DialogTitle>
          <DialogDescription>
            Eerste regel wordt de titel. Plak gerust een heel bericht; de rest komt in de omschrijving.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            autoFocus
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            // Enter verstuurt, Shift+Enter maakt een nieuwe regel: je bent
            // hier om iets kwijt te kunnen, niet om te typen in een formulier.
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey) return;
              event.preventDefault();
              void submit();
            }}
            placeholder="Openingstijden aanpassen naar 8-17u"
            maxLength={10000}
            aria-label="Wat moet er gebeuren"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="qc-klant">Klant</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="qc-klant">
                  <SelectValue placeholder="Geen klant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CLIENT}>Geen klant</SelectItem>
                  {keuzes.map((keuze) => (
                    <SelectItem key={keuze.id} value={keuze.id}>
                      {keuze.naam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qc-prioriteit">Prioriteit</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger id="qc-prioriteit">
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

            <div className="space-y-2">
              <Label>Deadline</Label>
              <DatePicker
                value={deadline}
                onChange={setDeadline}
                placeholder="Geen deadline"
                aria-label="Deadline"
                className="h-10 border border-input"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:items-center sm:justify-between">
          <span className="hidden text-xs text-muted-foreground sm:block">Enter om toe te voegen</span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="button" disabled={save.isPending || !text.trim()} onClick={() => void submit()}>
              {save.isPending ? "Toevoegen…" : "Toevoegen"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCapture;
