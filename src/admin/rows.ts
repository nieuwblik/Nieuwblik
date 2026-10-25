import { useMemo } from "react";

import { PRIORITY_WEIGHT, isTeLaat, type Priority, type ProjectStatus } from "@/admin/constants";
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
  /** Hoeveel van die open taken over hun deadline zijn. */
  teLaat: number;
  /** Zwaarste prioriteit onder het openstaande werk; null als er niets ligt. */
  urgentie: Priority | null;
  /** Draait de site van deze klant op TanStack? */
  tanstack: boolean;
  /** Nieuwste van: project gewijzigd, update geplaatst, taak aangeraakt. */
  activeAt: string | null;
  /**
   * Niet in de klantenlijst en niet op het dashboard: zelf verborgen, of elk
   * project van de klant is geannuleerd.
   */
  verborgen: boolean;
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
/** Sleutel voor taken die zonder project rechtstreeks bij een klant horen. */
const klantSleutel = (clientId: string) => `klant:${clientId}`;

export function useCombinedRows(): CombinedRows {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: tasks = [] } = useTasks();
  const { data: latestUpdate = {} } = useLatestUpdatePerProject();

  const rows = useMemo<ClientRow[]>(() => {
    const openPerProject = new Map<string, number>();
    const teLaatPerProject = new Map<string, number>();
    const zwaarstePerProject = new Map<string, Priority>();
    const latestTask = new Map<string, string>();

    for (const task of tasks) {
      // Een taak hangt aan een project, of (zonder project) rechtstreeks aan
      // een klant. Beide tellen in dezelfde mappen, met een eigen sleutel.
      const sleutel = task.project_id ?? (task.client_id ? klantSleutel(task.client_id) : null);
      if (!sleutel) continue;
      // Alleen hoofdtaken tellen: stappen staan bij hun taak, en meetellen
      // gaf een getal dat niet klopte met de lijst op de klantpagina.
      if (task.status !== "klaar" && !task.parent_task_id) {
        openPerProject.set(sleutel, (openPerProject.get(sleutel) ?? 0) + 1);
        if (isTeLaat(task)) teLaatPerProject.set(sleutel, (teLaatPerProject.get(sleutel) ?? 0) + 1);

        const huidig = zwaarstePerProject.get(sleutel);
        if (!huidig || PRIORITY_WEIGHT[task.priority] < PRIORITY_WEIGHT[huidig]) {
          zwaarstePerProject.set(sleutel, task.priority);
        }
      }
      const current = latestTask.get(sleutel);
      if (!current || task.updated_at > current) latestTask.set(sleutel, task.updated_at);
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
      // Projecten plus de taken die zonder project bij de klant horen.
      const sleutels = [...sorted.map((p) => p.id), klantSleutel(client.id)];

      return {
        key: client.id,
        to: primary ? `/admin/projecten/${primary.id}` : `/admin/klanten/${client.id}`,
        client,
        project: primary ?? null,
        otherProjects: rest,
        status: primary?.status ?? null,
        tanstack: primary?.built_with_tanstack ?? false,
        deadline: primary?.deadline ?? null,
        openTasks: sleutels.reduce((total, k) => total + (openPerProject.get(k) ?? 0), 0),
        teLaat: sleutels.reduce((total, k) => total + (teLaatPerProject.get(k) ?? 0), 0),
        urgentie: sleutels.reduce<Priority | null>((zwaarste, k) => {
          const eigen = zwaarstePerProject.get(k);
          if (!eigen) return zwaarste;
          if (!zwaarste) return eigen;
          return PRIORITY_WEIGHT[eigen] < PRIORITY_WEIGHT[zwaarste] ? eigen : zwaarste;
        }, null),
        activeAt: primary ? activityOf(primary) : mostRecent(client.updated_at, latestTask.get(klantSleutel(client.id))),
        verborgen: Boolean(client.verborgen_op) || (own.length > 0 && own.every((p) => p.status === "geannuleerd")),
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
        billing_cycle: null,
        billing_amount_cents: null,
        billing_start: null,
        billing_note: null,
        mail_afgemeld_op: null,
        mail_afmeld_token: "",
        moneybird_contact_id: null,
        uurtarief_cents: null,
        created_by: null,
        created_at: project.created_at,
        updated_at: project.updated_at,
      },
      project,
      otherProjects: [],
      status: project.status,
      tanstack: project.built_with_tanstack,
      deadline: project.deadline,
      openTasks: openPerProject.get(project.id) ?? 0,
      teLaat: teLaatPerProject.get(project.id) ?? 0,
      urgentie: zwaarstePerProject.get(project.id) ?? null,
      activeAt: activityOf(project),
      verborgen: project.status === "geannuleerd",
    }));

    return [...clientRows, ...looseRows].sort((a, b) => {
      if (!a.activeAt) return 1;
      if (!b.activeAt) return -1;
      return new Date(b.activeAt).getTime() - new Date(a.activeAt).getTime();
    });
  }, [projects, clients, tasks, latestUpdate]);

  return { rows, isLoading: projectsLoading || clientsLoading };
}
