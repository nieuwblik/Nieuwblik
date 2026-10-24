import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckSquare,
  Clock,
  FolderKanban,
  LayoutDashboard,
  Mail,
  Plus,
  Receipt,
  UserPen,
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
import { PROJECT_STATUS, PRIORITY_WEIGHT, hoofdtaken } from "@/admin/constants";
import { deadlineLabel } from "@/admin/format";
import { useRecentProjects } from "@/admin/recent";
import { useCombinedRows } from "@/admin/rows";
import { useTasks } from "@/admin/queries";
import { useCreateTask } from "@/admin/useCreateTask";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Alle pagina's van het portaal, zodat "Ga naar" nooit een pagina mist. */
const PAGINAS = [
  { to: "/admin", label: "Dashboard", zoek: "dashboard overzicht start", icon: LayoutDashboard },
  { to: "/admin/kalender", label: "Kalender", zoek: "kalender planning agenda", icon: CalendarDays },
  { to: "/admin/klanten", label: "Klanten", zoek: "klanten projecten", icon: Users },
  { to: "/admin/taken", label: "Taken", zoek: "taken todo werk", icon: CheckSquare },
  { to: "/admin/hosting", label: "Hosting", zoek: "hosting facturatie facturen", icon: Receipt },
  { to: "/admin/mailen", label: "Mailen", zoek: "mailen mailing nieuwsbrief", icon: Mail },
] as const;

/**
 * Het zoekpalet: het enige zoekveld van het portaal. Klanten (ook op
 * e-mailadres), extra projecten, alle open taken, alle pagina's en de
 * acties die je het vaakst doet.
 */
const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const recent = useRecentProjects();
  const { createTask } = useCreateTask();
  // Deze queries draaien elders in het portaal ook; react-query deelt de cache,
  // dus het palet openen kost geen extra netwerkverkeer.
  const { rows } = useCombinedRows();
  const { data: tasks = [] } = useTasks();

  const go = (to: string, state?: unknown) => {
    onOpenChange(false);
    navigate(to, state ? { state } : undefined);
  };

  // Alle open hoofdtaken, urgent en vroegste deadline eerst. Stappen staan op
  // de pagina van hun taak; daar brengt de taak zelf je ook.
  const openTasks = hoofdtaken(tasks)
    .filter((t) => t.status !== "klaar")
    .sort(
      (a, b) =>
        PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority] ||
        (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"),
    );

  // Een klant toont zijn meest recente project; de rest komt hier los te staan.
  const extraProjecten = rows.flatMap((row) => row.otherProjects.map((project) => ({ project, klant: row.client.name })));

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Zoek een klant, taak of pagina…" />
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

        {/* Klant en project zijn in het portaal één ding, dus één groep. */}
        <CommandGroup heading="Klanten">
          {rows.map((row) => (
            <CommandItem
              key={row.key}
              value={[row.client.name, row.client.contact_name, row.client.email, row.client.city, row.project?.name]
                .filter(Boolean)
                .join(" ")}
              onSelect={() => go(row.to)}
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{row.client.name}</span>
              {row.status && <CommandShortcut>{PROJECT_STATUS[row.status].label}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        {extraProjecten.length > 0 && (
          <CommandGroup heading="Projecten">
            {extraProjecten.map(({ project, klant }) => (
              <CommandItem
                key={`project-${project.id}`}
                value={`project ${project.name} ${klant}`}
                onSelect={() => go(`/admin/projecten/${project.id}`)}
              >
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{project.name}</span>
                <CommandShortcut>{klant}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {openTasks.length > 0 && (
          <CommandGroup heading="Open taken">
            {openTasks.map((task) => (
              <CommandItem
                key={task.id}
                value={`taak ${task.title} ${task.project?.name ?? ""} ${task.id}`}
                onSelect={() => go(`/admin/taken/${task.id}`)}
              >
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{task.title}</span>
                <CommandShortcut>
                  {task.project?.name ?? (task.due_date ? deadlineLabel(task.due_date) : "")}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Acties">
          <CommandItem
            value="nieuwe taak toevoegen"
            onSelect={() => {
              onOpenChange(false);
              void createTask(null);
            }}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
            Nieuwe taak
          </CommandItem>
          <CommandItem
            value="nieuwe klant toevoegen nieuw project aanmaken"
            onSelect={() => go("/admin/klanten", { nieuw: true })}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
            Nieuwe klant
          </CommandItem>
          <CommandItem
            value="naam wijzigen instellen profiel"
            onSelect={() => {
              onOpenChange(false);
              window.dispatchEvent(new Event("portaal:naam-instellen"));
            }}
          >
            <UserPen className="h-4 w-4 text-muted-foreground" />
            Naam instellen
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Ga naar">
          {PAGINAS.map(({ to, label, zoek, icon: Icon }) => (
            <CommandItem key={to} value={`ga naar ${zoek}`} onSelect={() => go(to)}>
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </CommandItem>
          ))}
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
