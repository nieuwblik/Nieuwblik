import { differenceInCalendarDays, format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

/** Datum uit de database (YYYY-MM-DD of ISO-timestamp) naar "12 aug 2026". */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = parseISO(value);
  return isValid(date) ? format(date, "d MMM yyyy", { locale: nl }) : "—";
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = parseISO(value);
  return isValid(date) ? format(date, "d MMM yyyy 'om' HH:mm", { locale: nl }) : "—";
}

/** "3 dagen geleden" — voor de activiteitskolom op het beginscherm. */
export function timeAgo(value: string | null | undefined): string {
  if (!value) return "—";
  const date = parseISO(value);
  if (!isValid(date)) return "—";

  // Onder de minuut leest "0 minuten geleden" raar.
  if (Date.now() - date.getTime() < 60_000) return "zojuist";
  return `${formatDistanceToNowStrict(date, { locale: nl })} geleden`;
}

/**
 * De meest recente van een reeks tijdstippen; null als er geen bruikbare bij
 * zit. Vergelijkt op geparste tijd en niet op de tekst: twee tijdstempels
 * kunnen dezelfde tijd in een andere schrijfwijze bevatten ("Z" tegenover
 * "+00:00"), en dan klopt een alfabetische vergelijking niet.
 */
export function mostRecent(...values: (string | null | undefined)[]): string | null {
  let best: string | null = null;
  let bestTime = -Infinity;

  for (const value of values) {
    if (!value) continue;
    const time = parseISO(value).getTime();
    if (Number.isNaN(time) || time <= bestTime) continue;
    best = value;
    bestTime = time;
  }

  return best;
}

/**
 * Hoeveel dagen een deadline nog weg is. Negatief betekent verstreken.
 * Rekent in kalenderdagen, zodat "morgen om 09:00" ook echt 1 oplevert.
 */
export function daysUntil(value: string | null | undefined): number | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? differenceInCalendarDays(date, new Date()) : null;
}

/** Korte, menselijke omschrijving van een deadline. */
export function deadlineLabel(value: string | null | undefined): string {
  const days = daysUntil(value);
  if (days === null) return "Geen deadline";
  if (days < 0) return `${Math.abs(days)} ${Math.abs(days) === 1 ? "dag" : "dagen"} te laat`;
  if (days === 0) return "Vandaag";
  if (days === 1) return "Morgen";
  if (days <= 14) return `Over ${days} dagen`;
  return formatDate(value);
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["kB", "MB", "GB"];
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`;
}

export function formatBudget(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Initialen voor de avatar in de zijbalk. */
export function initials(name: string): string {
  const parts = name.trim().split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
