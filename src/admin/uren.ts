import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAdminAuth } from "@/admin/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type TimeEntry = Tables<"time_entries">;

/** Een urenregel met het project (en de klant) en de taak erbij. */
export type UrenRegel = TimeEntry & {
  project: { id: string; name: string; client: { name: string } | null } | null;
  task: { id: string; title: string } | null;
};

const SELECTIE = "*, project:projects(id, name, client:clients(name)), task:tasks(id, title)";

export const urenKeys = {
  alles: ["admin", "uren"] as const,
  periode: (van: string, tot: string) => ["admin", "uren", "periode", van, tot] as const,
  lopend: (userId: string) => ["admin", "uren", "lopend", userId] as const,
  taak: (taskId: string) => ["admin", "uren", "taak", taskId] as const,
  project: (projectId: string) => ["admin", "uren", "project", projectId] as const,
};

/**
 * Bestaat de tabel nog niet (migratie niet uitgevoerd), dan geeft Supabase
 * een foutcode in plaats van een lege lijst. De schermen tonen dan een
 * uitleg in plaats van een kale foutmelding.
 */
export function isNietGeactiveerd(error: unknown): boolean {
  const tekst = error instanceof Error ? error.message : String(error ?? "");
  return /time_entries|schema cache|does not exist|PGRST205|42P01/i.test(tekst);
}

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ------------------------------------------------------------------ duur

/** Minuten tussen begin en eind; een lopende timer telt tot nu. */
export function duurMinuten(regel: Pick<TimeEntry, "started_at" | "ended_at">, nu = Date.now()): number {
  const begin = new Date(regel.started_at).getTime();
  const eind = regel.ended_at ? new Date(regel.ended_at).getTime() : nu;
  return Math.max(0, Math.round((eind - begin) / 60_000));
}

/** "6u 24min", "45min", "0min". */
export function formatDuur(minuten: number): string {
  const uren = Math.floor(minuten / 60);
  const rest = minuten % 60;
  if (uren === 0) return `${rest}min`;
  return rest === 0 ? `${uren}u` : `${uren}u ${rest}min`;
}

/** "02:30:42" voor de lopende timer. */
export function formatKlok(seconden: number): string {
  const s = Math.max(0, Math.floor(seconden));
  const twee = (n: number) => `${n}`.padStart(2, "0");
  return `${twee(Math.floor(s / 3600))}:${twee(Math.floor((s % 3600) / 60))}:${twee(s % 60)}`;
}

/** Tikt elke seconde (of elk ander interval) zolang `actief` waar is. */
export function useNu(actief: boolean, interval = 1000): number {
  const [nu, setNu] = useState(() => Date.now());
  useEffect(() => {
    if (!actief) return;
    setNu(Date.now());
    const id = window.setInterval(() => setNu(Date.now()), interval);
    return () => window.clearInterval(id);
  }, [actief, interval]);
  return nu;
}

// ------------------------------------------------------------------ lezen

/** Alle regels die in een periode begonnen zijn, van iedereen. */
export function useUrenInPeriode(van: Date, tot: Date) {
  return useQuery({
    queryKey: urenKeys.periode(van.toISOString(), tot.toISOString()),
    retry: false,
    queryFn: async (): Promise<UrenRegel[]> =>
      unwrap(
        await supabase
          .from("time_entries")
          .select(SELECTIE)
          .gte("started_at", van.toISOString())
          .lt("started_at", tot.toISOString())
          .order("started_at", { ascending: true }),
      ) as unknown as UrenRegel[],
  });
}

/** Alle regels van één taak of één project, voor het totaal op die pagina. */
export function useUrenVan(soort: "taak" | "project", id: string | undefined) {
  return useQuery({
    queryKey: soort === "taak" ? urenKeys.taak(id ?? "") : urenKeys.project(id ?? ""),
    enabled: Boolean(id),
    retry: false,
    queryFn: async (): Promise<TimeEntry[]> =>
      unwrap(
        await supabase
          .from("time_entries")
          .select("*")
          .eq(soort === "taak" ? "task_id" : "project_id", id!),
      ),
  });
}

/** Jouw lopende timer, of null. */
export function useLopendeTimer() {
  const { user } = useAdminAuth();
  return useQuery({
    queryKey: urenKeys.lopend(user?.id ?? ""),
    enabled: Boolean(user?.id),
    retry: false,
    queryFn: async (): Promise<UrenRegel | null> =>
      unwrap(
        await supabase
          .from("time_entries")
          .select(SELECTIE)
          .eq("user_id", user!.id)
          .is("ended_at", null)
          .maybeSingle(),
      ) as unknown as UrenRegel | null,
  });
}

// ------------------------------------------------------------------ schrijven

function useVernieuw() {
  const qc = useQueryClient();
  return () => void qc.invalidateQueries({ queryKey: urenKeys.alles });
}

/**
 * Start een timer. Loopt er al een, dan stopt die eerst: je werkt aan één
 * ding tegelijk, en de database staat er ook maar één toe.
 */
export function useStartTimer() {
  const { user } = useAdminAuth();
  const vernieuw = useVernieuw();
  return useMutation({
    mutationFn: async (waarden: { project_id: string | null; task_id: string | null; description: string | null }) => {
      if (!user) throw new Error("Niet ingelogd");
      const nu = new Date().toISOString();
      const { error: stopFout } = await supabase
        .from("time_entries")
        .update({ ended_at: nu })
        .eq("user_id", user.id)
        .is("ended_at", null);
      if (stopFout) throw new Error(stopFout.message);
      return unwrap(
        await supabase
          .from("time_entries")
          .insert({ ...waarden, user_id: user.id, started_at: nu })
          .select()
          .single(),
      );
    },
    onSuccess: vernieuw,
  });
}

export function useStopTimer() {
  const vernieuw = useVernieuw();
  return useMutation({
    mutationFn: async (regel: Pick<TimeEntry, "id" | "started_at">) => {
      // Minstens een minuut, anders weigert de database een eind gelijk aan het begin.
      const eind = Math.max(Date.now(), new Date(regel.started_at).getTime() + 60_000);
      const { error } = await supabase
        .from("time_entries")
        .update({ ended_at: new Date(eind).toISOString() })
        .eq("id", regel.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: vernieuw,
  });
}

export function useSaveUren() {
  const { user } = useAdminAuth();
  const vernieuw = useVernieuw();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: Partial<TimeEntry> }) => {
      if (id) {
        const { error } = await supabase.from("time_entries").update(values).eq("id", id);
        if (error) throw new Error(error.message);
        return;
      }
      const { error } = await supabase
        .from("time_entries")
        .insert({ ...values, user_id: values.user_id ?? user!.id });
      if (error) throw new Error(error.message);
    },
    onSuccess: vernieuw,
  });
}

export function useDeleteUren() {
  const vernieuw = useVernieuw();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("time_entries").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: vernieuw,
  });
}

// ------------------------------------------------------------------ kleuren

/**
 * Een vaste kleur per project in de tijdlijn en de grafiek. Dit zijn
 * categorieën, geen statussen, dus een eigen reeks; dezelfde klant krijgt
 * altijd dezelfde kleur, ook op een andere dag.
 */
const PROJECT_KLEUREN = [
  { vlak: "bg-[hsl(262_70%_60%)]", zacht: "bg-[hsl(262_70%_60%/0.14)] border-[hsl(262_70%_60%/0.55)]", tekst: "text-[hsl(262_55%_48%)] dark:text-[hsl(262_80%_76%)]" },
  { vlak: "bg-[hsl(28_92%_54%)]", zacht: "bg-[hsl(28_92%_54%/0.14)] border-[hsl(28_92%_54%/0.55)]", tekst: "text-[hsl(24_80%_40%)] dark:text-[hsl(28_92%_70%)]" },
  { vlak: "bg-[hsl(182_60%_42%)]", zacht: "bg-[hsl(182_60%_42%/0.14)] border-[hsl(182_60%_42%/0.55)]", tekst: "text-[hsl(184_70%_30%)] dark:text-[hsl(182_60%_62%)]" },
  { vlak: "bg-[hsl(212_76%_54%)]", zacht: "bg-[hsl(212_76%_54%/0.14)] border-[hsl(212_76%_54%/0.55)]", tekst: "text-[hsl(214_70%_40%)] dark:text-[hsl(212_90%_76%)]" },
  { vlak: "bg-[hsl(330_65%_56%)]", zacht: "bg-[hsl(330_65%_56%/0.14)] border-[hsl(330_65%_56%/0.55)]", tekst: "text-[hsl(330_60%_42%)] dark:text-[hsl(330_80%_76%)]" },
  { vlak: "bg-[hsl(140_55%_42%)]", zacht: "bg-[hsl(140_55%_42%/0.14)] border-[hsl(140_55%_42%/0.55)]", tekst: "text-[hsl(142_60%_28%)] dark:text-[hsl(140_55%_62%)]" },
];

const GEEN_PROJECT = {
  vlak: "bg-neutral",
  zacht: "bg-neutral/10 border-neutral/40",
  tekst: "text-neutral-ink",
};

export function projectKleur(projectId: string | null | undefined) {
  if (!projectId) return GEEN_PROJECT;
  let hash = 0;
  for (let i = 0; i < projectId.length; i += 1) hash = (hash * 31 + projectId.charCodeAt(i)) % 9973;
  return PROJECT_KLEUREN[hash % PROJECT_KLEUREN.length]!;
}

/** Naam voor op het scherm: de klant als die er is, anders het project. */
export function projectNaam(regel: Pick<UrenRegel, "project">): string {
  return regel.project?.client?.name ?? regel.project?.name ?? "Zonder project";
}
