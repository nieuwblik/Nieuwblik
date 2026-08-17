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
  TASK_STATUS,
  TASK_STATUS_ORDER,
  type Priority,
  type TaskStatus,
} from "@/admin/constants";
import { useProjects, useSaveTask, useTeam, type Task } from "@/admin/queries";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  /** Vult het project voor als de taak vanaf een projectpagina wordt gemaakt. */
  defaultProjectId?: string;
  /** Verbergt de projectkeuze wanneer het project vaststaat. */
  lockProject?: boolean;
  userId: string | null;
}

const NONE = "__none__";

const EMPTY = {
  title: "",
  description: "",
  project_id: NONE,
  assigned_to: NONE,
  status: "todo" as TaskStatus,
  priority: "normaal" as Priority,
  due_date: "",
};

const TaskDialog = ({ open, onOpenChange, task, defaultProjectId, lockProject, userId }: TaskDialogProps) => {
  const [form, setForm] = useState(EMPTY);
  const { data: projects = [] } = useProjects();
  const { data: team = [] } = useTeam();
  const save = useSaveTask();

  useEffect(() => {
    if (!open) return;
    setForm(
      task
        ? {
            title: task.title,
            description: task.description ?? "",
            project_id: task.project_id ?? NONE,
            assigned_to: task.assigned_to ?? NONE,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date ?? "",
          }
        : { ...EMPTY, project_id: defaultProjectId ?? NONE },
    );
  }, [open, task, defaultProjectId]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast.error("Geef de taak een titel");
      return;
    }

    try {
      await save.mutateAsync({
        id: task?.id,
        values: {
          title: form.title.trim(),
          description: form.description.trim() || null,
          project_id: form.project_id === NONE ? null : form.project_id,
          assigned_to: form.assigned_to === NONE ? null : form.assigned_to,
          status: form.status,
          priority: form.priority,
          due_date: form.due_date || null,
          ...(task ? {} : { created_by: userId }),
        },
      });
      toast.success(task ? "Taak bijgewerkt" : "Taak toegevoegd");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Taak bewerken" : "Nieuwe taak"}</DialogTitle>
          <DialogDescription>Wijs toe aan jezelf of je collega en geef eventueel een deadline mee.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Titel *</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              maxLength={300}
              required
            />
          </div>

          {!lockProject && (
            <div className="space-y-2">
              <Label htmlFor="task-project">Project</Label>
              <Select value={form.project_id} onValueChange={(v) => set("project_id", v)}>
                <SelectTrigger id="task-project">
                  <SelectValue placeholder="Kies een project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Losse taak</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Toegewezen aan</Label>
              <Select value={form.assigned_to} onValueChange={(v) => set("assigned_to", v)}>
                <SelectTrigger id="task-assignee">
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
            <div className="space-y-2">
              <Label htmlFor="task-due">Deadline</Label>
              <Input
                id="task-due"
                type="date"
                value={form.due_date}
                onChange={(e) => set("due_date", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as TaskStatus)}>
                <SelectTrigger id="task-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {TASK_STATUS[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-priority">Prioriteit</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v as Priority)}>
                <SelectTrigger id="task-priority">
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

          <div className="space-y-2">
            <Label htmlFor="task-description">Omschrijving</Label>
            <Textarea
              id="task-description"
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

export default TaskDialog;
