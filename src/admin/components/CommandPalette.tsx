import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Star,
  Users,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { PROJECT_STATUS } from "@/admin/constants";
import { useRecentProjects } from "@/admin/recent";
import { useClients, useProjects, useTasks } from "@/admin/queries";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const recent = useRecentProjects();
  // Deze queries draaien elders in het portaal ook; react-query deelt de cache,
  // dus het palet openen kost geen extra netwerkverkeer.
  const { data: projects = [] } = useProjects();
  const { data: clients = [] } = useClients();
  const { data: tasks = [] } = useTasks();

  const go = (to: string, state?: unknown) => {
    onOpenChange(false);
    navigate(to, state ? { state } : undefined);
  };

  const openTasks = tasks.filter((t) => t.status !== "klaar").slice(0, 5);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Zoek een project, klant of taak…" />
      <CommandList>
        <CommandEmpty>Niets gevonden.</CommandEmpty>

        {recent.length > 0 && (
          <CommandGroup heading="Recent bekeken">
            {recent.map((project) => (
              <CommandItem
                key={`recent-${project.id}`}
                value={`recent ${project.name}`}
                onSelect={() => go(`/admin/projecten/${project.id}`)}
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Projecten">
          {projects.map((project) => (
            <CommandItem
              key={project.id}
              value={`${project.name} ${project.client?.name ?? ""}`}
              onSelect={() => go(`/admin/projecten/${project.id}`)}
            >
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{project.name}</span>
              <CommandShortcut>{PROJECT_STATUS[project.status].label}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Klanten">
          {clients.map((client) => (
            <CommandItem
              key={client.id}
              value={`${client.name} ${client.contact_name ?? ""} ${client.city ?? ""}`}
              onSelect={() => go(`/admin/klanten/${client.id}`)}
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{client.name}</span>
              {client.city && <CommandShortcut>{client.city}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        {openTasks.length > 0 && (
          <CommandGroup heading="Openstaande taken">
            {openTasks.map((task) => (
              <CommandItem
                key={task.id}
                value={`taak ${task.title} ${task.project?.name ?? ""}`}
                onSelect={() => go(task.project ? `/admin/projecten/${task.project.id}` : "/admin/taken")}
              >
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{task.title}</span>
                {task.project && <CommandShortcut>{task.project.name}</CommandShortcut>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Acties">
          <CommandItem value="nieuwe taak toevoegen" onSelect={() => go("/admin/taken", { nieuw: true })}>
            <Plus className="h-4 w-4 text-muted-foreground" />
            Nieuwe taak
          </CommandItem>
          <CommandItem value="nieuw project aanmaken" onSelect={() => go("/admin/projecten", { nieuw: true })}>
            <Plus className="h-4 w-4 text-muted-foreground" />
            Nieuw project
          </CommandItem>
          <CommandItem value="nieuwe klant toevoegen" onSelect={() => go("/admin/klanten", { nieuw: true })}>
            <Plus className="h-4 w-4 text-muted-foreground" />
            Nieuwe klant
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Ga naar">
          <CommandItem value="dashboard overzicht" onSelect={() => go("/admin")}>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            Dashboard
          </CommandItem>
          <CommandItem value="alle projecten" onSelect={() => go("/admin/projecten")}>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
            Projecten
          </CommandItem>
          <CommandItem value="alle klanten" onSelect={() => go("/admin/klanten")}>
            <Users className="h-4 w-4 text-muted-foreground" />
            Klanten
          </CommandItem>
          <CommandItem value="alle taken" onSelect={() => go("/admin/taken")}>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            Taken
          </CommandItem>
          <CommandItem value="reviews beoordelingen" onSelect={() => go("/admin/reviews")}>
            <Star className="h-4 w-4 text-muted-foreground" />
            Reviews
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

/** Luistert op Cmd+K / Ctrl+K en zet het palet aan of uit. */
export function useCommandPaletteShortcut(setOpen: (fn: (open: boolean) => boolean) => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen((open) => !open);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);
}

export default CommandPalette;
