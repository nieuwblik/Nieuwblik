import { useMemo } from "react";

import type { ProjectStatus } from "@/admin/constants";
import { mostRecent } from "@/admin/format";
import {
  useClients,
  useLatestUpdatePerProject,
  useProjects,
  useTasks,
  type Client,
  type ProjectWithClient,
} from "@/admin/queries";

/**
 * Eén klant met het werk dat eronder hangt.
 *
 * Klant en project zijn in het portaal één ding, maar blijven twee tabellen,
 * zodat een klant later een tweede project kan krijgen zonder de
 * contactgegevens te dupliceren. Deze regel is de samenvoeging waar de
 * schermen mee werken.
 */
export interface ClientRow {
  key: string;
  /** Waar de regel heen linkt: het project, of de klant als die er nog geen heeft. */
  to: string;
  client: Client;
  project: ProjectWithClient | null;
  /** Extra projecten van dezelfde klant, buiten het eerste. */
  otherProjects: ProjectWithClient[];
  status: ProjectStatus | null;
  deadline: string | null;
  openTasks: number;
  /** Nieuwste van: project gewijzigd, update geplaatst, taak aangeraakt. */
  activeAt: string | null;
}

export interface CombinedRows {
  rows: ClientRow[];
  isLoading: boolean;
}

/**
 * De gecombineerde lijst, nieuwste activiteit bovenaan.
 *
 * projects.updated_at beweegt alleen mee bij een wijziging aan het project
 * zelf. Een geplaatste update of een aangepaste taak zou daardoor buiten de
 * sortering vallen, dus die bronnen worden hier samengenomen.
 */
export function useCombinedRows(): CombinedRows {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: tasks = [] } = useTasks();
  const { data: latestUpdate = {} } = useLatestUpdatePerProject();

  const rows = useMemo<ClientRow[]>(() => {
    const openPerProject = new Map<string, number>();
    const latestTask = new Map<string, string>();

    for (const task of tasks) {
      if (!task.project_id) continue;
      if (task.status !== "klaar") {
        openPerProject.set(task.project_id, (openPerProject.get(task.project_id) ?? 0) + 1);
      }
      const current = latestTask.get(task.project_id);
      if (!current || task.updated_at > current) latestTask.set(task.project_id, task.updated_at);
    }

    const byClient = new Map<string, ProjectWithClient[]>();
    const withoutClient: ProjectWithClient[] = [];
    for (const project of projects) {
      if (!project.client_id) {
        withoutClient.push(project);
        continue;
      }
      const list = byClient.get(project.client_id) ?? [];
      list.push(project);
      byClient.set(project.client_id, list);
    }

    const activityOf = (project: ProjectWithClient) =>
      mostRecent(project.updated_at, latestUpdate[project.id], latestTask.get(project.id));

    const build = (client: Client, own: ProjectWithClient[]): ClientRow => {
      // Het meest recent aangeraakte project vertegenwoordigt de klant.
      const sorted = [...own].sort((a, b) => {
        const at = activityOf(a);
        const bt = activityOf(b);
        if (!at) return 1;
        if (!bt) return -1;
        return new Date(bt).getTime() - new Date(at).getTime();
      });
      const [primary, ...rest] = sorted;

      return {
        key: client.id,
        to: primary ? `/admin/projecten/${primary.id}` : `/admin/klanten/${client.id}`,
        client,
        project: primary ?? null,
        otherProjects: rest,
        status: primary?.status ?? null,
        deadline: primary?.deadline ?? null,
        openTasks: sorted.reduce((total, p) => total + (openPerProject.get(p.id) ?? 0), 0),
        activeAt: primary ? activityOf(primary) : client.updated_at,
      };
    };

    const clientRows = clients.map((client) => build(client, byClient.get(client.id) ?? []));

    // Projecten zonder klant horen nergens bij, maar mogen niet verdwijnen.
    const looseRows: ClientRow[] = withoutClient.map((project) => ({
      key: `project-${project.id}`,
      to: `/admin/projecten/${project.id}`,
      client: {
        id: "",
        name: project.name,
        contact_name: null,
        email: null,
        phone: null,
        website: null,
        city: null,
        status: "actief",
        notes: null,
        created_by: null,
        created_at: project.created_at,
        updated_at: project.updated_at,
      },
      project,
      otherProjects: [],
      status: project.status,
      deadline: project.deadline,
      openTasks: openPerProject.get(project.id) ?? 0,
      activeAt: activityOf(project),
    }));

    return [...clientRows, ...looseRows].sort((a, b) => {
      if (!a.activeAt) return 1;
      if (!b.activeAt) return -1;
      return new Date(b.activeAt).getTime() - new Date(a.activeAt).getTime();
    });
  }, [projects, clients, tasks, latestUpdate]);

  return { rows, isLoading: projectsLoading || clientsLoading };
}
