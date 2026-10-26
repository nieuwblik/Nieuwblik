import { useEffect, useMemo, useState, type DragEvent } from "react";
import { addDays, format, getISOWeek, isSameDay, isToday, isWeekend, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACCENT, TOON, isTeLaat } from "@/admin/constants";
import { SLEEP_TYPE, begintSlepen } from "@/admin/kalender";
import type { TaskWithProject } from "@/admin/queries";
import Avatar from "@/admin/ui/Avatar";
import { projectKleur, projectNaam, urenGroep, type UrenRegel } from "@/admin/uren";

/** Hoogte van één uur in de tijdlijn. */
const UUR_PX = 56;
const KOLOMMEN = "grid-cols-[56px_repeat(7,minmax(0,1fr))]";

interface WeekRoosterProps {
  /** De maandag van de week. */
  week: Date;
  gekozenDag: Date;
  perDag: Map<string, TaskWithProject[]>;
  uren: UrenRegel[];
  naamVan: (userId: string) => string;
  onSelectDay: (dag: Date) => void;
  onSelectTask: (taak: TaskWithProject) => void;
  onVerplaats: (taakId: string, dag: string) => void;
  onAddOnDay: (dag: Date) => void;
  onSelectUren: (regel: UrenRegel) => void;
}

const minutenVan = (iso: string) => {
  const d = parseISO(iso);
  return d.getHours() * 60 + d.getMinutes();
};

/**
 * Uren die elkaar overlappen (twee mensen tegelijk) naast elkaar. Per groep
 * regels die in elkaar overlopen krijgt elke regel een baan, en alleen die
 * groep deelt de breedte; een losse regel elders op de dag blijft vol breed.
 * Verwacht de regels op begintijd gesorteerd.
 */
function banen(regels: { start: number; eind: number }[]): { baan: number; banen: number }[] {
  const uit: { baan: number; banen: number }[] = [];
  let groep: number[] = [];
  let einden: number[] = [];
  let groepEind = -1;
  const sluitGroep = () => {
    for (const i of groep) uit[i]!.banen = Math.max(1, einden.length);
    groep = [];
    einden = [];
  };
  regels.forEach((r, i) => {
    if (r.start >= groepEind) {
      sluitGroep();
      groepEind = r.eind;
    } else {
      groepEind = Math.max(groepEind, r.eind);
    }
    let baan = einden.findIndex((eind) => eind <= r.start);
    if (baan === -1) {
      baan = einden.length;
      einden.push(r.eind);
    } else {
      einden[baan] = r.eind;
    }
    uit[i] = { baan, banen: 1 };
    groep.push(i);
  });
  sluitGroep();
  return uit;
}

/**
 * De week als agenda, maandag tot en met zondag. Bovenin per dag de deadlines
 * (taken hebben een datum, geen tijd): te slepen naar een andere dag. Daaronder
 * de tijdlijn met de geregistreerde uren als blokken, in de kleur van het
 * project, met wie het was. Een rode lijn wijst het huidige moment aan.
 *
 * Op een smal scherm schuift het rooster opzij in plaats van samen te knijpen.
 */
const WeekRooster = ({
  week,
  gekozenDag,
  perDag,
  uren,
  naamVan,
  onSelectDay,
  onSelectTask,
  onVerplaats,
  onAddOnDay,
  onSelectUren,
}: WeekRoosterProps) => {
  const dagen = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(week, i)), [week]);
  const [sleepDoel, setSleepDoel] = useState<string | null>(null);

  // Elke minuut de lijn van nu bijwerken.
  const [nu, setNu] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNu(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  // De uren per dag, met begin en eind in minuten; een lopende timer tot nu.
  const blokken = useMemo(() => {
    const perDagSleutel = new Map<string, { regel: UrenRegel; start: number; eind: number }[]>();
    for (const regel of uren) {
      const sleutel = format(parseISO(regel.started_at), "yyyy-MM-dd");
      const start = minutenVan(regel.started_at);
      const eind = regel.ended_at
        ? Math.max(start + 5, isSameDay(parseISO(regel.ended_at), parseISO(regel.started_at)) ? minutenVan(regel.ended_at) : 24 * 60)
        : Math.max(start + 5, nu.getHours() * 60 + nu.getMinutes());
      perDagSleutel.set(sleutel, [...(perDagSleutel.get(sleutel) ?? []), { regel, start, eind }]);
    }
    for (const lijst of perDagSleutel.values()) lijst.sort((a, b) => a.start - b.start);
    return perDagSleutel;
  }, [uren, nu]);

  // Van 8 tot 18 uur, of ruimer als er eerder of later gewerkt is.
  const [beginUur, eindUur] = useMemo(() => {
    let begin = 8;
    let eind = 18;
    for (const lijst of blokken.values()) {
      for (const b of lijst) {
        begin = Math.min(begin, Math.floor(b.start / 60));
        eind = Math.max(eind, Math.ceil(b.eind / 60));
      }
    }
    return [Math.max(0, begin), Math.min(24, eind)];
  }, [blokken]);
  const uurLabels = Array.from({ length: eindUur - beginUur }, (_, i) => beginUur + i);
  const hoogte = (eindUur - beginUur) * UUR_PX;

  const isTaak = (event: DragEvent) => event.dataTransfer.types.includes(SLEEP_TYPE);
  const nuMinuten = nu.getHours() * 60 + nu.getMinutes();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        {/* Kop: per dag het getal en de dag; de gekozen dag onderstreept. */}
        <div className={cn("grid border-b border-border", KOLOMMEN)}>
          <div className="flex items-end justify-center pb-2 text-[11px] text-muted-foreground">wk {getISOWeek(week)}</div>
          {dagen.map((dag) => {
            const gekozen = isSameDay(dag, gekozenDag);
            return (
              <button
                key={dag.toISOString()}
                type="button"
                onClick={() => onSelectDay(dag)}
                aria-pressed={gekozen}
                aria-label={format(dag, "EEEE d MMMM", { locale: nl })}
                className="relative flex flex-col items-center gap-0.5 pb-2.5 pt-1 transition-colors hover:bg-muted/40"
              >
                <span
                  className={cn(
                    "text-[24px] leading-none tabular-nums",
                    isToday(dag) ? "font-medium text-foreground" : "font-light text-foreground/80",
                  )}
                >
                  {format(dag, "d")}
                </span>
                <span className={cn("text-xs", isToday(dag) ? "text-foreground" : "text-muted-foreground")}>
                  {format(dag, "EEE", { locale: nl })}
                </span>
                {gekozen && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-foreground" />}
              </button>
            );
          })}
        </div>

        {/* Deadlines: taken van die dag, te slepen naar een andere dag. */}
        <div className={cn("grid border-b border-border", KOLOMMEN)}>
          <div className="px-1 pt-2 text-center text-[11px] leading-tight text-muted-foreground">Deadlines</div>
          {dagen.map((dag) => {
            const sleutel = format(dag, "yyyy-MM-dd");
            const taken = perDag.get(sleutel) ?? [];
            return (
              <div
                key={sleutel}
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
                  "group relative min-h-[72px] space-y-1 border-l border-border p-1.5 transition-colors",
                  isWeekend(dag) && "bg-muted/25",
                  sleepDoel === sleutel && "bg-accent/5 ring-2 ring-inset ring-accent/50",
                )}
              >
                {taken.slice(0, 3).map((taak) => {
                  const laat = isTeLaat(taak);
                  return (
                    <button
                      key={taak.id}
                      type="button"
                      draggable
                      onDragStart={(event) => begintSlepen(event, taak.id)}
                      onClick={() => onSelectTask(taak)}
                      title={taak.title}
                      className="flex w-full min-w-0 cursor-grab items-center gap-1.5 rounded-md bg-muted/70 px-2 py-1 text-left text-[12px] transition-colors hover:bg-muted active:cursor-grabbing"
                    >
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", laat ? TOON.danger.stip : ACCENT[taak.priority].stip)} />
                      <span className={cn("truncate", laat && TOON.danger.tekst)}>{taak.title}</span>
                    </button>
                  );
                })}
                {taken.length > 3 && (
                  <button
                    type="button"
                    onClick={() => onSelectDay(dag)}
                    className="px-2 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    +{taken.length - 3} meer
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onAddOnDay(dag)}
                  aria-label={`Taak toevoegen op ${format(dag, "EEEE d MMMM", { locale: nl })}`}
                  className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* De tijdlijn met de uren. */}
        <div className={cn("relative grid", KOLOMMEN)} style={{ height: hoogte }}>
          <div className="relative">
            {uurLabels.map((uur, i) => (
              <span
                key={uur}
                className="absolute right-2 -translate-y-1/2 text-[11px] tabular-nums text-muted-foreground"
                style={{ top: i * UUR_PX }}
              >
                {i === 0 ? "" : `${uur}:00`}
              </span>
            ))}
          </div>
          {dagen.map((dag) => {
            const sleutel = format(dag, "yyyy-MM-dd");
            const lijst = blokken.get(sleutel) ?? [];
            const indeling = banen(lijst);
            return (
              <div
                key={sleutel}
                className={cn("relative border-l border-border", isWeekend(dag) && "bg-muted/25")}
                style={{
                  backgroundImage: "linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
                  backgroundSize: `100% ${UUR_PX}px`,
                }}
              >
                {lijst.map(({ regel, start, eind }, i) => {
                  const { baan, banen: aantal } = indeling[i]!;
                  const top = ((start - beginUur * 60) / 60) * UUR_PX;
                  const hoog = Math.max(22, ((eind - start) / 60) * UUR_PX - 2);
                  const kleur = projectKleur(urenGroep(regel).id);
                  const loopt = !regel.ended_at;
                  const tijd = `${format(parseISO(regel.started_at), "H:mm")}–${loopt ? "nu" : format(parseISO(regel.ended_at!), "H:mm")}`;
                  return (
                    <button
                      key={regel.id}
                      type="button"
                      onClick={() => onSelectUren(regel)}
                      title={`${projectNaam(regel)} · ${tijd}${regel.task?.title ? ` · ${regel.task.title}` : ""}`}
                      className={cn(
                        "absolute overflow-hidden rounded-lg border px-2 py-1 text-left text-[12px] leading-tight transition-[filter] hover:brightness-95 dark:hover:brightness-110",
                        kleur.zacht,
                        loopt && "border-dashed",
                      )}
                      style={{
                        top: top + 1,
                        height: hoog,
                        left: `calc(${(baan / aantal) * 100}% + 2px)`,
                        width: `calc(${100 / aantal}% - 4px)`,
                      }}
                    >
                      <span className={cn("block truncate font-medium", kleur.tekst)}>{projectNaam(regel)}</span>
                      {hoog >= 36 && <span className="block truncate text-[11px] text-muted-foreground">{tijd}</span>}
                      {hoog >= 54 && (regel.task?.title || regel.description) && (
                        <span className="block truncate text-[11px] text-foreground/80">{regel.task?.title ?? regel.description}</span>
                      )}
                      {hoog >= 76 && (
                        <span className="mt-1 flex">
                          <Avatar naam={naamVan(regel.user_id)} maat="xs" vorm="rond" />
                        </span>
                      )}
                    </button>
                  );
                })}
                {/* Nu: een rode lijn met een stip, alleen op vandaag. */}
                {isToday(dag) && nuMinuten >= beginUur * 60 && nuMinuten <= eindUur * 60 && (
                  <div
                    className="pointer-events-none absolute inset-x-0 z-[1] h-0.5 bg-danger"
                    style={{ top: ((nuMinuten - beginUur * 60) / 60) * UUR_PX }}
                    aria-hidden="true"
                  >
                    <span className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full bg-danger" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekRooster;
