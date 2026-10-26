import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import MonthGrid from "@/admin/components/MonthGrid";
import QuickCapture from "@/admin/components/QuickCapture";
import TaakVenster from "@/admin/components/TaakVenster";
import UrenDialoog from "@/admin/components/UrenDialoog";
import { PRIORITY_WEIGHT, TOON, hoofdtaken, isTeLaat } from "@/admin/constants";
import { begintSlepen, dagVan, groepeerPerDag } from "@/admin/kalender";
import { useClients, useTasks, useTeam, useUpdateTask, type TaskWithProject } from "@/admin/queries";
import Avatar from "@/admin/ui/Avatar";
import { Panel } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";
import {
  duurMinuten,
  formatDuur,
  projectKleur,
  projectNaam,
  urenGroep,
  useUrenInPeriode,
  type UrenRegel,
} from "@/admin/uren";

/** De knoppen in de bovenbalk: wit met een dunne rand, allemaal even hoog. */
const RUSTIGE_KNOP = "h-9 border-border bg-card text-foreground shadow-none hover:bg-muted";
/** Zoveel taken per groep staan er meteen; de rest achter "Toon alle". */
const KORT = 6;

/** "Vandaag", "Morgen", "Gisteren" of "Dinsdag 28 oktober". */
function dagNaam(dag: Date): string {
  if (isToday(dag)) return "Vandaag";
  if (isTomorrow(dag)) return "Morgen";
  if (isYesterday(dag)) return "Gisteren";
  const tekst = format(dag, "EEEE d MMMM", { locale: nl });
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

interface Groep {
  sleutel: string;
  titel: string;
  taken: TaskWithProject[];
  /** De deadline van een taak die je hier toevoegt; undefined: geen plusje. */
  nieuweDatum?: string | null;
  rood?: boolean;
}

/**
 * Kalender: links je takenlijst (te laat, deze week, deze maand, zonder datum)
 * of de uren van de gekozen dag; rechts de maand met de deadlines per dag.
 *
 * Taken sleep je naar een andere dag, ook vanuit de lijst links; uren van de
 * gekozen dag open je met een klik om ze bij te stellen.
 *
 * Alleen hoofdtaken, net als op het dashboard en bij Taken: stappen horen bij
 * hun taak, en zo kloppen de tellingen overal met elkaar.
 */
const CalendarPage = () => {
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const { data: clients = [] } = useClients();
  const update = useUpdateTask();

  const [searchParams] = useSearchParams();
  const dagUitLink = searchParams.get("dag");

  // Het anker bepaalt welke week of maand in beeld is; de gekozen dag is die
  // in het paneel links (en de dag voor nieuwe taken met de plusknop).
  const [anker, setAnker] = useState(() => new Date());
  const [gekozenDag, setGekozenDag] = useState<Date>(() => new Date());
  useEffect(() => {
    const datum = dagUitLink ? parseISO(dagUitLink) : null;
    if (!datum || !isValid(datum)) return;
    setGekozenDag(datum);
    setAnker(datum);
  }, [dagUitLink]);

  const maand = startOfMonth(anker);
  // De uren van de weken in beeld, voor het tabblad Uren van de gekozen dag.
  const [van, tot] = [
    startOfWeek(maand, { weekStartsOn: 1 }),
    addDays(endOfWeek(endOfMonth(maand), { weekStartsOn: 1 }), 1),
  ];
  const { data: uren = [] } = useUrenInPeriode(van, tot);

  const [paneel, setPaneel] = useState<"taken" | "uren">("taken");
  const [dicht, setDicht] = useState<string[]>([]);
  const [alles, setAlles] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [nieuw, setNieuw] = useState<{ datum: string | null } | null>(null);
  const [urenOpen, setUrenOpen] = useState<{ regel: UrenRegel | null; datum: string } | null>(null);

  const open = useMemo(() => hoofdtaken(tasks).filter((t) => t.status !== "klaar"), [tasks]);
  const perDag = useMemo(() => groepeerPerDag(open), [open]);
  const naamVan = (userId: string) => team.find((l) => l.user_id === userId)?.name ?? "Onbekend";
  const vandaagSleutel = format(new Date(), "yyyy-MM-dd");

  // De takenlijst links, in groepen.
  const groepen = useMemo<Groep[]>(() => {
    const nu = new Date();
    const weekEinde = format(endOfWeek(nu, { weekStartsOn: 1 }), "yyyy-MM-dd");
    const maandEinde = format(endOfMonth(nu), "yyyy-MM-dd");
    const opDatum = (a: TaskWithProject, b: TaskWithProject) => (a.due_date ?? "").localeCompare(b.due_date ?? "");
    const datum = (t: TaskWithProject) => (t.due_date ? dagVan(t.due_date) : null);
    return [
      { sleutel: "laat", titel: "Te laat", rood: true, taken: open.filter((t) => isTeLaat(t)).sort(opDatum) },
      {
        sleutel: "week",
        titel: "Deze week",
        nieuweDatum: vandaagSleutel,
        taken: open.filter((t) => !isTeLaat(t) && datum(t) !== null && datum(t)! <= weekEinde).sort(opDatum),
      },
      {
        sleutel: "maand",
        titel: "Deze maand",
        nieuweDatum: format(addDays(endOfWeek(nu, { weekStartsOn: 1 }), 1), "yyyy-MM-dd"),
        taken: open.filter((t) => datum(t) !== null && datum(t)! > weekEinde && datum(t)! <= maandEinde).sort(opDatum),
      },
      {
        sleutel: "zonder",
        titel: "Zonder datum",
        nieuweDatum: null,
        taken: open.filter((t) => !t.due_date).sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]),
      },
    ];
  }, [open, vandaagSleutel]);

  const urenVanDag = useMemo(
    () =>
      uren
        .filter((r) => format(parseISO(r.started_at), "yyyy-MM-dd") === format(gekozenDag, "yyyy-MM-dd"))
        .sort((a, b) => a.started_at.localeCompare(b.started_at)),
    [uren, gekozenDag],
  );

  /** Klant of project bij een taak. */
  const bijWie = (taak: TaskWithProject) =>
    taak.project?.name ?? clients.find((c) => c.id === taak.client_id)?.name ?? null;

  const patch = async (id: string, values: Parameters<typeof update.mutateAsync>[0]["values"]) => {
    try {
      await update.mutateAsync({ id, values });
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
      return false;
    }
  };

  const verplaats = (taakId: string, dag: string) => {
    const taak = tasks.find((t) => t.id === taakId);
    if (!taak || (taak.due_date && dagVan(taak.due_date) === dag)) return;
    void patch(taakId, { due_date: dag });
  };

  const afvinken = async (taak: TaskWithProject) => {
    if (openId === taak.id) setOpenId(null);
    if (!(await patch(taak.id, { status: "klaar" }))) return;
    // Terugdraaien alleen zonder herhaling: daar staat de volgende keer al klaar.
    toast.success("Afgevinkt", {
      description: taak.title,
      ...(taak.herhaling ? {} : { action: { label: "Ongedaan maken", onClick: () => void patch(taak.id, { status: taak.status }) } }),
    });
  };

  const blader = (richting: 1 | -1) => {
    setAnker((a) => addMonths(a, richting));
    setOpenId(null);
  };
  const naarVandaag = () => {
    setAnker(new Date());
    setGekozenDag(new Date());
  };
  const kiesDag = (dag: Date) => {
    setGekozenDag(dag);
    setAnker(dag);
  };

  const periode = format(maand, "LLLL yyyy", { locale: nl });

  const actief = openId ? (tasks.find((t) => t.id === openId) ?? null) : null;

  return (
    <div className="mx-auto max-w-[1500px] space-y-4 lg:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl tracking-tight">Kalender</h1>
          <p className="mt-1 text-sm text-muted-foreground first-letter:uppercase">{periode}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className={cn(RUSTIGE_KNOP, "px-3.5")} onClick={naarVandaag}>
            Vandaag
          </Button>
          <Button variant="outline" size="icon" className={cn(RUSTIGE_KNOP, "w-9")} onClick={() => blader(-1)} aria-label="Vorige maand">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className={cn(RUSTIGE_KNOP, "w-9")} onClick={() => blader(1)} aria-label="Volgende maand">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-9 w-9"
            onClick={() => setNieuw({ datum: format(gekozenDag, "yyyy-MM-dd") })}
            aria-label="Nieuwe taak"
            title="Nieuwe taak"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        {/* Links: de takenlijst, of de uren van de gekozen dag. */}
        <Panel className="order-2 lg:order-none lg:sticky lg:top-20">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <h2 className="p-kaarttitel">{paneel === "taken" ? "Te doen" : dagNaam(gekozenDag)}</h2>
            <SegmentedControl
              label="Paneel"
              waarde={paneel}
              onChange={setPaneel}
              opties={[
                { waarde: "taken", label: "Taken" },
                { waarde: "uren", label: "Uren" },
              ]}
            />
          </div>

          {paneel === "taken" ? (
            <div className="divide-y divide-border">
              {groepen
                .filter((g) => g.sleutel !== "laat" || g.taken.length > 0)
                .map((g) => {
                  const ingeklapt = dicht.includes(g.sleutel);
                  const lijst = alles.includes(g.sleutel) ? g.taken : g.taken.slice(0, KORT);
                  return (
                    <section key={g.sleutel} className="px-2 py-2">
                      <div className="flex items-center gap-1 px-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDicht((d) => (d.includes(g.sleutel) ? d.filter((x) => x !== g.sleutel) : [...d, g.sleutel]))
                          }
                          aria-expanded={!ingeklapt}
                          className={cn(
                            "flex flex-1 items-center gap-1.5 py-1 text-left text-sm font-medium",
                            g.rood && TOON.danger.tekst,
                            g.taken.length === 0 && "font-normal text-muted-foreground",
                          )}
                        >
                          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", ingeklapt && "-rotate-90")} />
                          {g.titel}
                          <span className="font-normal text-muted-foreground">{g.taken.length}</span>
                        </button>
                        {g.nieuweDatum !== undefined && (
                          <button
                            type="button"
                            onClick={() => setNieuw({ datum: g.nieuweDatum ?? null })}
                            aria-label={`Taak toevoegen: ${g.titel.toLowerCase()}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      {!ingeklapt && g.taken.length > 0 && (
                        <ul className="mt-0.5">
                          {lijst.map((taak) => {
                            const laat = isTeLaat(taak);
                            const bij = bijWie(taak);
                            const datum = taak.due_date ? format(parseISO(dagVan(taak.due_date)), "EEE d MMM", { locale: nl }) : null;
                            return (
                              <li
                                key={taak.id}
                                draggable
                                onDragStart={(event) => begintSlepen(event, taak.id)}
                                title="Sleep naar een dag in de kalender"
                                className="flex cursor-grab items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/60 active:cursor-grabbing"
                              >
                                <Checkbox
                                  className="mt-0.5"
                                  checked={false}
                                  onCheckedChange={() => void afvinken(taak)}
                                  aria-label={`${taak.title} afvinken`}
                                />
                                <button type="button" onClick={() => setOpenId(taak.id)} className="min-w-0 flex-1 text-left">
                                  <span className="block truncate text-sm leading-5">{taak.title}</span>
                                  {(datum || bij) && (
                                    <span className={cn("block truncate text-xs", laat ? TOON.danger.tekst : "text-muted-foreground")}>
                                      {[datum, bij].filter(Boolean).join(" · ")}
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                          {g.taken.length > KORT && (
                            <li>
                              <button
                                type="button"
                                onClick={() =>
                                  setAlles((a) => (a.includes(g.sleutel) ? a.filter((x) => x !== g.sleutel) : [...a, g.sleutel]))
                                }
                                className="px-2 py-1 text-[13px] text-muted-foreground hover:text-foreground"
                              >
                                {alles.includes(g.sleutel) ? "Minder tonen" : `Toon alle ${g.taken.length}`}
                              </button>
                            </li>
                          )}
                        </ul>
                      )}
                    </section>
                  );
                })}
            </div>
          ) : (
            <div className="p-2">
              {urenVanDag.length === 0 ? (
                <p className="px-2 py-3 text-[13px] text-muted-foreground">Geen uren op deze dag.</p>
              ) : (
                <>
                  <ul>
                    {urenVanDag.map((r) => {
                      const kleur = projectKleur(urenGroep(r).id);
                      return (
                        <li key={r.id}>
                          <button
                            type="button"
                            onClick={() => setUrenOpen({ regel: r, datum: format(gekozenDag, "yyyy-MM-dd") })}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted/60"
                          >
                            <span className={cn("h-2 w-2 shrink-0 rounded-full", kleur.vlak)} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm">{projectNaam(r)}</span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {format(parseISO(r.started_at), "H:mm")}–{r.ended_at ? format(parseISO(r.ended_at), "H:mm") : "nu"}
                                {(r.task?.title || r.description) && ` · ${r.task?.title ?? r.description}`}
                              </span>
                            </span>
                            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{formatDuur(duurMinuten(r))}</span>
                            <Avatar naam={naamVan(r.user_id)} maat="xs" vorm="rond" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="flex justify-between border-t border-border px-2 pt-2 mt-1 text-[13px]">
                    <span className="text-muted-foreground">Totaal</span>
                    <span className="font-medium tabular-nums">
                      {formatDuur(urenVanDag.reduce((s, r) => s + duurMinuten(r), 0))}
                    </span>
                  </p>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => setUrenOpen({ regel: null, datum: format(gekozenDag, "yyyy-MM-dd") })}
              >
                <Plus className="h-4 w-4" />
                Uren toevoegen
              </Button>
            </div>
          )}
        </Panel>

        {/* Rechts: de maand. */}
        <Panel className="order-1 overflow-hidden p-4 lg:order-none">
          <MonthGrid
            maand={maand}
            gekozenDag={gekozenDag}
            perDag={perDag}
            onSelectDay={kiesDag}
            onSelectTask={(taak) => setOpenId(taak.id)}
            onAddOnDay={(dag) => setNieuw({ datum: format(dag, "yyyy-MM-dd") })}
            onVerplaats={verplaats}
          />
        </Panel>
      </div>

      <TaakVenster
        taak={actief}
        onder={actief ? bijWie(actief) : null}
        team={team}
        onSluit={() => setOpenId(null)}
        patch={patch}
        onAfvinken={(t) => void afvinken(t)}
      />

      <UrenDialoog
        open={urenOpen !== null}
        onOpenChange={(waarde) => !waarde && setUrenOpen(null)}
        regel={urenOpen?.regel ?? null}
        datum={urenOpen?.datum ?? vandaagSleutel}
      />

      {/* Hetzelfde invoerscherm als elders, met de dag al ingevuld. */}
      <QuickCapture open={nieuw !== null} onOpenChange={(waarde) => !waarde && setNieuw(null)} defaultDueDate={nieuw?.datum ?? null} />
    </div>
  );
};

export default CalendarPage;
