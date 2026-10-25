import { useEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isWeekend,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { nl } from "date-fns/locale";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACCENT, TOON, isTeLaat } from "@/admin/constants";
import { SLEEP_TYPE, begintSlepen } from "@/admin/kalender";
import type { TaskWithProject } from "@/admin/queries";

const DAGEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];

interface MonthGridProps {
  maand: Date;
  gekozenDag: Date;
  perDag: Map<string, TaskWithProject[]>;
  onSelectDay: (dag: Date) => void;
  onSelectTask: (taak: TaskWithProject) => void;
  /** Plusje rechtsonder in de cel om meteen op die dag iets vast te leggen. */
  onAddOnDay: (dag: Date) => void;
  /** Een taak is op een dag losgelaten. */
  onVerplaats: (taakId: string, dag: string) => void;
}

/**
 * Maandrooster met de deadlines in de dagcellen.
 *
 * Rustig van zichzelf: de cellen hebben geen kleur, alleen de taken erin een
 * stip naar prioriteit. Wat over de datum is staat in rood. Vandaag heeft een
 * zacht vlakje achter het getal, het weekend een iets andere ondergrond.
 *
 * Werken gaat in het rooster zelf: een taak naar een andere dag slepen zet
 * de deadline om, ook vanuit de lijsten ernaast (te laat, zonder datum). Met
 * het toetsenbord loop je met de pijltjes door de dagen; de taken van de
 * gekozen dag staan in het paneel ernaast. Op een telefoon passen titels niet
 * leesbaar in zeven kolommen, daar staan stippen.
 */
const MonthGrid = ({ maand, gekozenDag, perDag, onSelectDay, onSelectTask, onAddOnDay, onVerplaats }: MonthGridProps) => {
  const [sleepDoel, setSleepDoel] = useState<string | null>(null);
  const rooster = useRef<HTMLDivElement>(null);
  const metToetsen = useRef(false);

  const dagen = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(maand), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(maand), { weekStartsOn: 1 }),
      }),
    [maand],
  );

  // Na een pijltje de focus meenemen naar de nieuwe dag (ook als die in een
  // andere maand ligt en het rooster opnieuw is opgebouwd).
  const gekozenSleutel = format(gekozenDag, "yyyy-MM-dd");
  useEffect(() => {
    if (!metToetsen.current) return;
    metToetsen.current = false;
    rooster.current?.querySelector<HTMLButtonElement>(`[data-dag="${gekozenSleutel}"]`)?.focus();
  }, [gekozenSleutel, maand]);

  const pijltjes = (event: KeyboardEvent, dag: Date) => {
    const stap = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    if (!stap) return;
    event.preventDefault();
    metToetsen.current = true;
    onSelectDay(addDays(dag, stap));
  };

  // Alleen de gekozen dag is met Tab bereikbaar (als die in beeld is), anders de eerste van de maand.
  const tabDag = dagen.some((d) => isSameDay(d, gekozenDag)) ? gekozenSleutel : format(startOfMonth(maand), "yyyy-MM-dd");

  const isTaak = (event: DragEvent) => event.dataTransfer.types.includes(SLEEP_TYPE);

  return (
    <div ref={rooster}>
      <div className="grid grid-cols-7 gap-1.5 pb-1.5" aria-hidden="true">
        {DAGEN.map((dag) => (
          <div key={dag} className="text-center text-xs text-muted-foreground">
            {dag}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {dagen.map((dag) => {
          const sleutel = format(dag, "yyyy-MM-dd");
          const taken = perDag.get(sleutel) ?? [];
          const buitenMaand = !isSameMonth(dag, maand);
          const gekozen = sleutel === gekozenSleutel;
          const vandaag = isToday(dag);
          const datumTekst = format(dag, "EEEE d MMMM", { locale: nl });

          return (
            <div
              key={sleutel}
              // Klikken op de lege ruimte kiest de dag; het getal is de echte knop
              // (voor toetsenbord en schermlezer), zodat er geen knoppen in knoppen zitten.
              onClick={() => onSelectDay(dag)}
              onDragOver={(event) => {
                if (!isTaak(event)) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (sleepDoel !== sleutel) setSleepDoel(sleutel);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSleepDoel(null);
              }}
              onDrop={(event) => {
                setSleepDoel(null);
                const taakId = event.dataTransfer.getData(SLEEP_TYPE);
                if (!taakId) return;
                event.preventDefault();
                onVerplaats(taakId, sleutel);
              }}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-1 rounded-lg border p-1.5 transition-colors duration-150",
                // Vaste beeldverhouding vanaf tablet; op een telefoon een lage vaste hoogte.
                "h-14 sm:aspect-[4/3] sm:h-auto",
                isWeekend(dag) ? "border-border/60 bg-muted/30" : "border-border/60 bg-background",
                "hover:bg-muted/50",
                buitenMaand && "opacity-45",
                gekozen && "border-foreground/25 ring-1 ring-inset ring-foreground/25",
                sleepDoel === sleutel && "border-accent bg-accent/5 ring-2 ring-inset ring-accent/50",
              )}
            >
              <span className="flex items-center justify-between">
                <button
                  type="button"
                  data-dag={sleutel}
                  tabIndex={sleutel === tabDag ? 0 : -1}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectDay(dag);
                  }}
                  onKeyDown={(event) => pijltjes(event, dag)}
                  aria-label={`${datumTekst}${taken.length ? `, ${taken.length} ${taken.length === 1 ? "taak" : "taken"}` : ""}`}
                  aria-pressed={gekozen}
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-xs tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    // Vandaag: een zacht vlakje en het getal in de gewone tekstkleur, geen zwarte bol.
                    vandaag ? "bg-foreground/[0.07] font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {format(dag, "d")}
                </button>
                {/* Op een telefoon: hoeveel er die dag staat, als stippen. */}
                {taken.length > 0 && (
                  <span className="flex items-center gap-0.5 sm:hidden" aria-hidden="true">
                    {taken.slice(0, 3).map((taak) => (
                      <span
                        key={taak.id}
                        className={cn("h-1.5 w-1.5 rounded-full", isTeLaat(taak) ? TOON.danger.stip : ACCENT[taak.priority].stip)}
                      />
                    ))}
                  </span>
                )}
              </span>

              <span className="hidden min-h-0 flex-1 flex-col gap-px overflow-hidden sm:flex">
                {taken.slice(0, 3).map((taak) => {
                  const laat = isTeLaat(taak);
                  return (
                    <button
                      key={taak.id}
                      type="button"
                      tabIndex={-1}
                      draggable
                      onDragStart={(event) => begintSlepen(event, taak.id)}
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectTask(taak);
                      }}
                      title={laat ? `${taak.title} (te laat)` : taak.title}
                      className="flex min-w-0 cursor-grab items-center gap-1.5 rounded px-1 py-px text-left transition-colors hover:bg-foreground/[0.06] active:cursor-grabbing"
                    >
                      <span
                        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", laat ? TOON.danger.stip : ACCENT[taak.priority].stip)}
                      />
                      <span className={cn("truncate text-[12px] leading-tight", laat && TOON.danger.tekst)}>{taak.title}</span>
                    </button>
                  );
                })}
                {taken.length > 3 && (
                  <span className="px-1 text-[11px] text-muted-foreground">+{taken.length - 3} meer</span>
                )}
              </span>

              {/* Verschijnt bij aanwijzen: altijd tonen zou tientallen plusjes
                  op het scherm zetten. Met het toetsenbord voeg je toe in het
                  paneel naast het rooster. */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(event) => {
                  event.stopPropagation();
                  onAddOnDay(dag);
                }}
                aria-label={`Taak toevoegen op ${datumTekst}`}
                className="absolute bottom-1 right-1 hidden h-6 w-6 items-center justify-center rounded-md bg-background/80 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 sm:flex"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthGrid;
