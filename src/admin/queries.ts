import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Client = Tables<"clients">;
export type Project = Tables<"projects">;
export type Task = Tables<"tasks">;
export type ProjectUpdate = Tables<"project_updates">;
export type ProjectFile = Tables<"project_files">;

/** Project inclusief de klantnaam, zoals lijsten die tonen. */
export type ProjectWithClient = Project & { client: Pick<Client, "id" | "name"> | null };

/** Taak inclusief het project waar hij onder hangt (null bij losse taken). */
export type TaskWithProject = Task & { project: Pick<Project, "id" | "name"> | null };

export interface TeamMember {
  user_id: string;
  name: string;
}

const STORAGE_BUCKET = "project-files";

/**
 * Eén plek voor alle cache-sleutels, zodat een mutatie precies weet wat hij
 * ongeldig moet maken en er geen losse strings door de codebase zwerven.
 */
export const adminKeys = {
  clients: ["admin", "clients"] as const,
  client: (id: string) => ["admin", "clients", id] as const,
  projects: ["admin", "projects"] as const,
  project: (id: string) => ["admin", "projects", id] as const,
  tasks: ["admin", "tasks"] as const,
  updates: (projectId: string) => ["admin", "updates", projectId] as const,
  recentUpdates: ["admin", "updates", "recent"] as const,
  files: (projectId: string) => ["admin", "files", projectId] as const,
  team: ["admin", "team"] as const,
  reviews: ["admin", "reviews"] as const,
};

/** Gooit de Supabase-fout door zodat react-query hem als error-state oppakt. */
function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ---------------------------------------------------------------- team

/**
 * De collega's om werk aan toe te wijzen. Gaat via de admin_team-RPC: welke
 * accounts adminrechten hebben is via de tabellen zelf niet op te vragen,
 * omdat user_roles alleen je eigen rollen prijsgeeft.
 */
export function useTeam() {
  return useQuery({
    queryKey: adminKeys.team,
    queryFn: async (): Promise<TeamMember[]> => unwrap(await supabase.rpc("admin_team")),
    staleTime: 5 * 60 * 1000,
  });
}

// ---------------------------------------------------------------- clients

export function useClients() {
  return useQuery({
    queryKey: adminKeys.clients,
    queryFn: async (): Promise<Client[]> =>
      unwrap(await supabase.from("clients").select("*").order("name", { ascending: true })),
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.client(id ?? ""),
    enabled: Boolean(id),
    queryFn: async (): Promise<Client> =>
      unwrap(await supabase.from("clients").select("*").eq("id", id!).single()),
  });
}

export function useSaveClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: TablesInsert<"clients"> }): Promise<Client> => {
      if (id) {
        return unwrap(
          await supabase.from("clients").update(values as TablesUpdate<"clients">).eq("id", id).select().single(),
        );
      }
      return unwrap(await supabase.from("clients").insert(values).select().single());
    },
    onSuccess: (client) => {
      void qc.invalidateQueries({ queryKey: adminKeys.clients });
      void qc.invalidateQueries({ queryKey: adminKeys.client(client.id) });
      void qc.invalidateQueries({ queryKey: adminKeys.projects });
    },
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.clients });
      void qc.invalidateQueries({ queryKey: adminKeys.projects });
      void qc.invalidateQueries({ queryKey: adminKeys.tasks });
    },
  });
}

// ---------------------------------------------------------------- projects

export function useProjects() {
  return useQuery({
    queryKey: adminKeys.projects,
    queryFn: async (): Promise<ProjectWithClient[]> =>
      unwrap(
        await supabase
          .from("projects")
          .select("*, client:clients(id, name)")
          .order("updated_at", { ascending: false }),
      ) as ProjectWithClient[],
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.project(id ?? ""),
    enabled: Boolean(id),
    queryFn: async (): Promise<ProjectWithClient> =>
      unwrap(
        await supabase.from("projects").select("*, client:clients(id, name)").eq("id", id!).single(),
      ) as ProjectWithClient,
  });
}

/** Invalidatie die elke projectmutatie nodig heeft. */
function invalidateProject(qc: QueryClient, projectId?: string) {
  void qc.invalidateQueries({ queryKey: adminKeys.projects });
  if (projectId) {
    void qc.invalidateQueries({ queryKey: adminKeys.project(projectId) });
    // Een statuswijziging schrijft via een database-trigger een mijlpaal weg.
    void qc.invalidateQueries({ queryKey: adminKeys.updates(projectId) });
  }
  void qc.invalidateQueries({ queryKey: adminKeys.recentUpdates });
}

export function useSaveProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: TablesInsert<"projects"> }): Promise<Project> => {
      if (id) {
        return unwrap(
          await supabase.from("projects").update(values as TablesUpdate<"projects">).eq("id", id).select().single(),
        );
      }
      return unwrap(await supabase.from("projects").insert(values).select().single());
    },
    onSuccess: (project) => invalidateProject(qc, project.id),
  });
}

/** Deelmutatie, gebruikt door de snelle statuswissel op de projectpagina. */
export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: TablesUpdate<"projects"> }): Promise<Project> =>
      unwrap(await supabase.from("projects").update(values).eq("id", id).select().single()),
    onSuccess: (project) => invalidateProject(qc, project.id),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidateProject(qc);
      void qc.invalidateQueries({ queryKey: adminKeys.tasks });
    },
  });
}

// ---------------------------------------------------------------- tasks

export function useTasks() {
  return useQuery({
    queryKey: adminKeys.tasks,
    queryFn: async (): Promise<TaskWithProject[]> =>
      unwrap(
        await supabase
          .from("tasks")
          .select("*, project:projects(id, name)")
          .order("due_date", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false }),
      ) as TaskWithProject[],
  });
}

export function useSaveTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: TablesInsert<"tasks"> }): Promise<Task> => {
      if (id) {
        return unwrap(
          await supabase.from("tasks").update(values as TablesUpdate<"tasks">).eq("id", id).select().single(),
        );
      }
      return unwrap(await supabase.from("tasks").insert(values).select().single());
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.tasks }),
  });
}

/**
 * Deelmutatie voor losse veldwijzigingen — een taak afvinken hoeft niet het
 * hele formulier mee te sturen.
 */
export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: TablesUpdate<"tasks"> }): Promise<Task> =>
      unwrap(await supabase.from("tasks").update(values).eq("id", id).select().single()),
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.tasks }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.tasks }),
  });
}

// ---------------------------------------------------------------- updates

export function useProjectUpdates(projectId: string | undefined) {
  return useQuery({
    queryKey: adminKeys.updates(projectId ?? ""),
    enabled: Boolean(projectId),
    queryFn: async (): Promise<ProjectUpdate[]> =>
      unwrap(
        await supabase
          .from("project_updates")
          .select("*")
          .eq("project_id", projectId!)
          .order("created_at", { ascending: false }),
      ),
  });
}

/** Laatste activiteit over alle projecten heen, voor het dashboard. */
export function useRecentUpdates(limit = 8) {
  return useQuery({
    queryKey: adminKeys.recentUpdates,
    queryFn: async () =>
      unwrap(
        await supabase
          .from("project_updates")
          .select("*, project:projects(id, name)")
          .order("created_at", { ascending: false })
          .limit(limit),
      ) as (ProjectUpdate & { project: Pick<Project, "id" | "name"> | null })[],
  });
}

export function useAddUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: TablesInsert<"project_updates">): Promise<ProjectUpdate> =>
      unwrap(await supabase.from("project_updates").insert(values).select().single()),
    onSuccess: (update) => {
      void qc.invalidateQueries({ queryKey: adminKeys.updates(update.project_id) });
      void qc.invalidateQueries({ queryKey: adminKeys.recentUpdates });
    },
  });
}

export function useDeleteUpdate(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_updates").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.updates(projectId) });
      void qc.invalidateQueries({ queryKey: adminKeys.recentUpdates });
    },
  });
}

// ---------------------------------------------------------------- files

export function useProjectFiles(projectId: string | undefined) {
  return useQuery({
    queryKey: adminKeys.files(projectId ?? ""),
    enabled: Boolean(projectId),
    queryFn: async (): Promise<ProjectFile[]> =>
      unwrap(
        await supabase
          .from("project_files")
          .select("*")
          .eq("project_id", projectId!)
          .order("created_at", { ascending: false }),
      ),
  });
}

/** Maakt van een bestandsnaam een pad dat Storage accepteert. */
function toStorageKey(projectId: string, fileName: string) {
  const safe = fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-120);
  return `${projectId}/${crypto.randomUUID()}-${safe}`;
}

export function useUploadFile(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: string | null }) => {
      const storagePath = toStorageKey(projectId, file.name);

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw new Error(uploadError.message);

      const { error: rowError } = await supabase.from("project_files").insert({
        project_id: projectId,
        storage_path: storagePath,
        file_name: file.name.slice(0, 300),
        file_size: file.size,
        mime_type: file.type || null,
        uploaded_by: userId,
      });

      if (rowError) {
        // Metadata mislukt? Dan mag het bestand niet als wees in de bucket
        // achterblijven — anders groeit de opslag met onvindbare bestanden.
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
        throw new Error(rowError.message);
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.files(projectId) }),
  });
}

export function useDeleteFile(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: ProjectFile) => {
      const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([file.storage_path]);
      if (storageError) throw new Error(storageError.message);

      const { error } = await supabase.from("project_files").delete().eq("id", file.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.files(projectId) }),
  });
}

/**
 * Bestanden staan in een private bucket. Downloaden gaat via een signed URL
 * die na een minuut verloopt, zodat een gedeelde link geen blijvende sleutel is.
 */
export async function getFileUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(storagePath, 60);
  if (error || !data) throw new Error(error?.message ?? "Kon geen downloadlink maken");
  return data.signedUrl;
}
