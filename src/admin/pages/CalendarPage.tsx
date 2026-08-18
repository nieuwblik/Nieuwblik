import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowUpRight, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import DatePicker from "@/admin/components/DatePicker";
import EmptyState from "@/admin/components/EmptyState";
import MonthGrid, { groepeerPerDag } from "@/admin/components/MonthGrid";
import QuickCapture from "@/admin/components/QuickCapture";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACCENT, PRIORITY, PRIORITY_ORDER, type Priority } from "@/admin/constants";
import { useSaveTask, useTasks, useTeam, useUpdateTask, type TaskWithProject } from "@/admin/queries";
import { CalendarDays } from "lucide-react";

const NONE = "__none__";

/**
 * Kalenderpagina: maandrooster met daarnaast wat er die dag klaarligt.
 *
 * Een taak aanklikken opent een kaart over het rooster in plaats van een
 * nieuwe pagina. Zo blijf je in de maand staan terwijl je iets bijstelt; voor
 * het volledige verhaal is er een doorklik naar de taakpagina.
 */
const CalendarPage = () => {
  const { user } = useAdminAuth();
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const save = useSaveTask();
  const update = useUpdateTask();

  const [maand, setMaand] = useState(() => startOfMonth(new Date()));
  const [gekozenDag, setGekozenDag] = useState<Date>(() => new Date());
  const [open, setOpen] = useState<TaskWithProject | null>(null);
  const [titel, setTitel] = useState("");
  // Datum waarvoor het invoerscherm openstaat; null als het dicht is.
  const [nieuwOpDag, setNieuwOpDag] = useState<string | null>(null);

  const perDag = useMemo(() => groepeerPerDag(tasks), [tasks]);
  const dagSleutel = format(gekozenDag, "yyyy-MM-dd");
  const takenVandaag = perDag.get(dagSleutel) ?? [];

  const patch = async (id: string, values: Parameters<typeof update.mutateAsync>[0]["values"]) => {
    try {
      await update.mutateAsync({ id, values });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  };

  const voegToe = async () => {
    const schoon = titel.trim();
    if (!schoon || save.isPending) return;
    try {
      await save.mutateAsync({
        values: {
          title: schoon.slice(0, 300),
          due_date: dagSleutel,
          assigned_to: user?.id ?? null,
          created_by: user?.id ?? null,
        },
      });
      setTitel("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toevoegen mislukt");
    }
  };

  // De geopende taak vers uit de lijst halen, zodat een wijziging meteen
  // klopt in plaats van de kopie te tonen die bij het openen bestond.
  const actief = open ? (tasks.find((t) => t.id === open.id) ?? null) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alle deadlines op een rij, gekleurd naar prioriteit. Klik een taak om hem bij te stellen.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setMaand(subMonths(maand, 1))} aria-label="Vorige maand">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[9rem] text-sm font-semibold">{format(maand, "LLLL yyyy", { locale: nl })}</span>
              <Button variant="ghost" size="icon" onClick={() => setMaand(addMonths(maand, 1))} aria-label="Volgende maand">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMaand(startOfMonth(new Date()));
                  setGekozenDag(new Date());
                }}
              >
                Deze maand
              </Button>
            </div>

            {/* De detailkaart legt zich over het rooster: je blijft in de maand
                staan terwijl je iets aanpast. */}
            <div className="relative">
              <MonthGrid
                maand={maand}
                gekozenDag={gekozenDag}
                perDag={perDag}
                onSelectDay={(dag) => {
                  setGekozenDag(dag);
                  setOpen(null);
                }}
                onSelectTask={(taak) => setOpen(taak)}
                onAddOnDay={(dag) => {
                  setGekozenDag(dag);
                  setNieuwOpDag(format(dag, "yyyy-MM-dd"));
                }}
              />

              {actief && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-2">
                  <div className="w-full max-w-md rounded-xl border border-border bg-popover p-4 shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-semibold leading-tight">{actief.title}</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => setOpen(null)}
                        aria-label="Sluiten"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Label className="w-24 shrink-0 text-muted-foreground">Datum</Label>
                        <DatePicker
                          value={actief.due_date}
                          onChange={(waarde) => void patch(actief.id, { due_date: waarde })}
                          aria-label="Deadline"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Label className="w-24 shrink-0 text-muted-foreground">Prioriteit</Label>
                        <Select
                          value={actief.priority}
                          onValueChange={(v) => void patch(actief.id, { priority: v as Priority })}
                        >
                          <SelectTrigger className="h-8 flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITY_ORDER.map((p) => (
                              <SelectItem key={p} value={p}>
                                <span className="flex items-center gap-2">
                                  <span className={cn("h-2 w-2 rounded-full", ACCENT[p].stip)} />
                                  {PRIORITY[p].label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-3">
                        <Label className="w-24 shrink-0 text-muted-foreground">Wie</Label>
                        <Select
                          value={actief.assigned_to ?? NONE}
                          onValueChange={(v) => void patch(actief.id, { assigned_to: v === NONE ? null : v })}
                        >
                          <SelectTrigger className="h-8 flex-1">
                            <SelectValue placeholder="Niemand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={NONE}>Niemand</SelectItem>
                            {team.map((m) => (
                              <SelectItem key={m.user_id} value={m.user_id}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-start gap-3">
                        <Label className="w-24 shrink-0 pt-2 text-muted-foreground">Notitie</Label>
                        <Textarea
                          rows={2}
                          defaultValue={actief.description ?? ""}
                          onBlur={(e) => {
                            const waarde = e.target.value.trim();
                            if (waarde === (actief.description ?? "")) return;
                            void patch(actief.id, { description: waarde || null });
                          }}
                          placeholder="Korte aantekening"
                          maxLength={10000}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        to={`/admin/taken/${actief.id}`}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        Hele taak openen
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <Button size="sm" onClick={() => setOpen(null)}>
                        Klaar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:sticky xl:top-4 xl:self-start">
          <CardContent className="p-4">
            <p className="text-sm font-semibold">Gepland</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {format(gekozenDag, "EEEE d MMMM yyyy", { locale: nl })}
            </p>

            {takenVandaag.length === 0 ? (
              <div className="mt-4">
                <EmptyState icon={CalendarDays} title="Niets gepland" description="Voeg hieronder werk toe." />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {takenVandaag.map((taak) => (
                  <li key={taak.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(taak)}
                      className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <span className={cn("mb-2 block h-1 w-full rounded-full", ACCENT[taak.priority].balk)} />
                      <span className="block truncate text-sm font-medium">{taak.title}</span>
                      {taak.description && (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{taak.description}</span>
                      )}
                      <span className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{PRIORITY[taak.priority].label}</span>
                        {taak.project && <span className="truncate">{taak.project.name}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex gap-2">
              <Input
                value={titel}
                onChange={(e) => setTitel(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  void voegToe();
                }}
                placeholder={`Taak op ${format(gekozenDag, "d MMMM", { locale: nl })}…`}
                maxLength={300}
                aria-label="Taak op deze dag"
              />
              <Button variant="outline" onClick={() => void voegToe()} disabled={!titel.trim() || save.isPending}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hetzelfde invoerscherm als elders, met de aangeklikte dag al ingevuld:
          prioriteit en klant kies je daar in één keer mee. */}
      <QuickCapture
        open={nieuwOpDag !== null}
        onOpenChange={(waarde) => !waarde && setNieuwOpDag(null)}
        defaultDueDate={nieuwOpDag}
      />
    </div>
  );
};

export default CalendarPage;
