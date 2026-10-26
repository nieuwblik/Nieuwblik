import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import DatePicker from "@/admin/components/DatePicker";
import { ACCENT, PRIORITY, PRIORITY_ORDER, type Priority } from "@/admin/constants";
import { dagVan } from "@/admin/kalender";
import type { TaskWithProject, TeamMember } from "@/admin/queries";
import type { TablesUpdate } from "@/integrations/supabase/types";

const NONE = "__none__";

/**
 * Een taak bijstellen zonder de kalender te verlaten: deadline, prioriteit,
 * wie, een korte notitie, afvinken, en een doorklik naar de hele taak.
 * Elke wijziging gaat meteen door (patch).
 */
const TaakVenster = ({
  taak,
  onder,
  team,
  onSluit,
  patch,
  onAfvinken,
}: {
  taak: TaskWithProject | null;
  /** Project of klant onder de titel. */
  onder: string | null;
  team: TeamMember[];
  onSluit: () => void;
  patch: (id: string, values: Omit<TablesUpdate<"tasks">, "herhaling">) => unknown;
  onAfvinken: (taak: TaskWithProject) => void;
}) => (
  <Dialog open={taak !== null} onOpenChange={(waarde) => !waarde && onSluit()}>
    {taak && (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pr-6 leading-snug">{taak.title}</DialogTitle>
          <DialogDescription>{onder ?? "Zonder project"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Label className="w-24 shrink-0 text-muted-foreground">Deadline</Label>
            <DatePicker
              value={taak.due_date ? dagVan(taak.due_date) : null}
              onChange={(waarde) => void patch(taak.id, { due_date: waarde })}
              aria-label="Deadline"
            />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-24 shrink-0 text-muted-foreground">Prioriteit</Label>
            <Select value={taak.priority} onValueChange={(v) => void patch(taak.id, { priority: v as Priority })}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_ORDER.map((p) => (
                  <SelectItem key={p} value={p}>
                    <span className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", ACCENT[p].stip)} />
                      {PRIORITY[p].label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-24 shrink-0 text-muted-foreground">Wie</Label>
            <Select
              value={taak.assigned_to ?? NONE}
              onValueChange={(v) => void patch(taak.id, { assigned_to: v === NONE ? null : v })}
            >
              <SelectTrigger className="h-9 flex-1">
                <SelectValue placeholder="Niemand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Niemand</SelectItem>
                {team.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-3">
            <Label className="w-24 shrink-0 pt-2 text-muted-foreground">Notitie</Label>
            {/* De key hoort bij de taak: zonder key hield het veld de tekst van
                de vorige taak vast en kon die in deze taak worden opgeslagen. */}
            <Textarea
              key={taak.id}
              rows={2}
              defaultValue={taak.description ?? ""}
              onBlur={(e) => {
                const waarde = e.target.value.trim();
                if (waarde === (taak.description ?? "")) return;
                void patch(taak.id, { description: waarde || null });
              }}
              placeholder="Korte aantekening"
              maxLength={10000}
              className="flex-1"
            />
          </div>
        </div>

        <DialogFooter className="flex-row items-center sm:justify-between">
          <Link
            to={`/admin/taken/${taak.id}`}
            className="mr-auto inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Hele taak openen
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Button variant="outline" size="sm" onClick={() => onAfvinken(taak)}>
            <Check className="h-4 w-4" />
            Afvinken
          </Button>
        </DialogFooter>
      </DialogContent>
    )}
  </Dialog>
);

export default TaakVenster;
