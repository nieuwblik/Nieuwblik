import { useSyncExternalStore } from "react";

export interface RecentProject {
  id: string;
  name: string;
}

const KEY = "nieuwblik:portaal:recente-projecten";
const MAX = 6;

/**
 * Snapshot in het geheugen naast localStorage. useSyncExternalStore vergelijkt
 * op referentie, dus elke lees-actie moet dezelfde array teruggeven zolang er
 * niets veranderd is — anders blijft de component hertekenen.
 */
let cache: RecentProject[] | null = null;
const listeners = new Set<() => void>();

function read(): RecentProject[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed)
      ? parsed.filter((p): p is RecentProject => typeof p?.id === "string" && typeof p?.name === "string")
      : [];
  } catch {
    // Onleesbare of geblokkeerde opslag mag het portaal niet stukmaken.
    cache = [];
  }
  return cache;
}

function write(next: RecentProject[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Vol of geweigerd: de lijst leeft dan alleen deze sessie. Geen ramp.
  }
  listeners.forEach((notify) => notify());
}

/** Zet een project vooraan; een eerder bezoek schuift mee in plaats van te dupliceren. */
export function recordRecentProject(project: RecentProject) {
  const current = read();
  if (current[0]?.id === project.id && current[0]?.name === project.name) return;
  write([project, ...current.filter((p) => p.id !== project.id)].slice(0, MAX));
}

/** Haalt een verwijderd project uit de lijst, zodat er geen dode link blijft staan. */
export function forgetRecentProject(id: string) {
  const current = read();
  if (!current.some((p) => p.id === id)) return;
  write(current.filter((p) => p.id !== id));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRecentProjects(): RecentProject[] {
  return useSyncExternalStore(subscribe, read, () => []);
}
