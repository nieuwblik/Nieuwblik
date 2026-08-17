import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects, useSaveTask } from "@/admin/queries";

interface QuickAddTaskProps {
  /** De taak komt op naam van wie hem toevoegt; dat is bijna altijd de bedoeling. */
  userId: string | null;
}

const NO_PROJECT = "__none__";

/**
 * Eén regel om werk vast te leggen zonder dialoog: titel typen, Enter, klaar.
 * Prioriteit en deadline blijven bewust weg — die zijn er zelden op het moment
 * dat je iets snel wilt noteren, en zijn achteraf in de taak zelf te zetten.
 */
const QuickAddTask = ({ userId }: QuickAddTaskProps) => {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(NO_PROJECT);
  const { data: projects = [] } = useProjects();
  const save = useSaveTask();

  const create = async () => {
    const trimmed = title.trim();
    if (!trimmed || save.isPending) return;

    try {
      await save.mutateAsync({
        values: {
          title: trimmed.slice(0, 300),
          project_id: projectId === NO_PROJECT ? null : projectId,
          assigned_to: userId,
          created_by: userId,
        },
      });
      // Alleen het tekstveld leegmaken: bij meerdere taken achter elkaar blijft
      // de projectkeuze meestal hetzelfde.
      setTitle("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toevoegen mislukt");
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void create();
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        // Enter wordt hier expliciet afgehandeld. De impliciete
        // formulierverzending van de browser slaat over zodra het Radix-select
        // zijn verborgen native <select> in dit formulier zet, waardoor de
        // toets stilletjes niets deed.
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          void create();
        }}
        placeholder="Taak toevoegen en op Enter drukken…"
        maxLength={300}
        className="flex-1"
        aria-label="Nieuwe taak"
      />
      <Select value={projectId} onValueChange={setProjectId}>
        <SelectTrigger className="sm:w-[200px]" aria-label="Project kiezen">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_PROJECT}>Losse taak</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={save.isPending || !title.trim()}>
        <Plus className="h-4 w-4" />
        <span className="sm:sr-only">Toevoegen</span>
      </Button>
    </form>
  );
};

export default QuickAddTask;
