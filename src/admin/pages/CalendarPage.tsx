import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { format, isSameMonth, isToday, isTomorrow, isValid, isYesterday, parseISO, startOfMonth } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowUpRight, CalendarArrowDown, CalendarCheck, Check, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import DatePicker from "@/admin/components/DatePicker";
import MonthGrid from "@/admin/components/MonthGrid";
import { begintSlepen, dagVan, groepeerPerDag } from "@/admin/kalender";
import QuickCapture from "@/admin/components/QuickCapture";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACCENT, PRIORITY, PRIORITY_ORDER, PRIORITY_WEIGHT, TOON, hoofdtaken, isTeLaat, type Priority } from "@/admin/constants";
import { useClients, useSaveTask, useTasks, useTeam, useUpdateTask, type TaskWithProject } from "@/admin/queries";
import MonthNav from "@/admin/ui/MonthNav";
import { Panel, PanelHeader } from "@/admin/ui/Panel";

const NONE = "__none__";
/** Zoveel taken zonder datum staan er meteen; de rest achter "Toon alle". */
const ZONDER_DATUM_KORT = 6;

/** "Vandaag", "Morgen", "Gisteren" of "Dinsdag 28 oktober". */
function dagNaam(dag: Date): string {
  if (isToday(dag)) return "Vandaag";
  if (isTomorrow(dag)) return "Morgen";
  if (isYesterday(dag)) return "Gisteren";
  const tekst = format(dag, "EEEE d MMMM", { locale: nl });
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

/**
 * Eén taak in de lijsten naast het rooster: afvinken, openen, en slepen naar
 * een dag. Rechts een kleine actie die per lijst verschilt (naar vandaag,
 * op de gekozen dag zetten).
 */
const TaakRegel = ({
  taak,
  onder,
  onAfvinken,
  onOpen,
  actie,
}: {
  taak: TaskWithProject;
  onder: string | null;
  onAfvinken: () => void;
  onOpen: () => void;
  actie?: ReactNode;
}) => {
  const laat = isTeLaat(taak);
  return (
    <li
      draggable
      onDragStart={(event) => begintSlepen(event, taak.id)}
      title="Sleep naar een dag in de kalender"
      className="group/regel flex cursor-grab items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/60 active:cursor-grabbing"
    >
      <Checkbox className="mt-0.5" checked={false} onCheckedChange={onAfvinken} aria-label={`${taak.title} afvinken`} />
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <span className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", laat ? TOON.danger.stip : ACCENT[taak.priority].stip)} />
          <span className="truncate text-sm">{taak.title}</span>
        </span>
        {onder && <span className={cn("block truncate pl-3 text-xs", laat ? TOON.danger.tekst : "text-muted-foreground")}>{onder}</span>}
      </button>
      {actie}
    </li>
  );
};

/**
 * Kalenderpagina: het maandrooster met daarnaast de gekozen dag, wat te laat
 * is en wat nog geen datum heeft.
 *
 * Werken gaat hier ook: taken afvinken, naar een andere dag slepen (ook vanuit
 * de lijsten), te laat werk met één klik naar vandaag zetten, en werk zonder
 * datum inplannen op de gekozen dag. Een taak openen geeft een venster met de
 * belangrijkste velden; voor het volledige verhaal is er een doorklik.
 *
 * Alleen hoofdtaken, net als op het dashboard en bij Taken: stappen horen bij
 * hun taak, en zo kloppen de tellingen overal met elkaar.
 */
const CalendarPage = () => {
  const { user } = useAdminAuth();
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const { data: clients = [] } = useClients();
  const save = useSaveTask();
  const update = useUpdateTask();

  // ?dag=2026-10-24 opent die dag, zodat de weekstrook op het dashboard
  // meteen naar de juiste dag in de kalender springt; ook als de kalender al open is.
  const [searchParams] = useSearchParams();
  const dagUitLink = searchParams.get("dag");
  const [maand, setMaand] = useState(() => startOfMonth(new Date()));
  const [gekozenDag, setGekozenDag] = useState<Date>(() => new Date());
  useEffect(() => {
    const datum = dagUitLink ? parseISO(dagUitLink) : null;
    if (!datum || !isValid(datum)) return;
    setGekozenDag(datum);
    setMaand(startOfMonth(datum));
  }, [dagUitLink]);

  const [openId, setOpenId] = useState<string | null>(null);
  const [titel, setTitel] = useState("");
  const [allesZonderDatum, setAllesZonderDatum] = useState(false);
  // Datum waarvoor het invoerscherm openstaat; null als het dicht is.
  const [nieuwOpDag, setNieuwOpDag] = useState<string | null>(null);

  const open = useMemo(() => hoofdtaken(tasks).filter((t) => t.status !== "klaar"), [tasks]);
  const perDag = useMemo(() => groepeerPerDag(open), [open]);
  const dagSleutel = format(gekozenDag, "yyyy-MM-dd");
  const opDag = perDag.get(dagSleutel) ?? [];
  const teLaat = useMemo(
    () => open.filter((t) => isTeLaat(t)).sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? "")),
    [open],
  );
  const zonderDatum = useMemo(
    () => open.filter((t) => !t.due_date).sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]),
    [open],
  );

  const kiesDag = (dag: Date) => {
    setGekozenDag(dag);
    // Met de pijltjes over de rand van de maand: de maand loopt mee.
    if (!isSameMonth(dag, maand)) setMaand(startOfMonth(dag));
  };

  const wisselMaand = (nieuw: Date) => {
    setMaand(nieuw);
    setOpenId(null);
  };

  /** Klant of project onder de titel, met bij te laat werk hoe ver over de datum. */
  const onder = (taak: TaskWithProject, metDatum = false) => {
    const bij = taak.project?.name ?? clients.find((c) => c.id === taak.client_id)?.name ?? null;
    if (!metDatum || !taak.due_date) return bij;
    const datum = format(parseISO(dagVan(taak.due_date)), "d MMM", { locale: nl });
    return bij ? `${datum} · ${bij}` : datum;
  };

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

  // De geopende taak vers uit de lijst, zodat een wijziging meteen klopt.
  const actief = openId ? (tasks.find((t) => t.id === openId) ?? null) : null;
  const vandaagSleutel = format(new Date(), "yyyy-MM-dd");
  const zichtbaarZonderDatum = allesZonderDatum ? zonderDatum : zonderDatum.slice(0, ZONDER_DATUM_KORT);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
      <h1 className="text-2xl tracking-tight">Kalender</h1>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="p-4">
          <div className="mb-4">
            <MonthNav maand={maand} onChange={wisselMaand} onVandaag={() => setGekozenDag(new Date())} />
          </div>
          <MonthGrid
            maand={maand}
            gekozenDag={gekozenDag}
            perDag={perDag}
            onSelectDay={kiesDag}
            onSelectTask={(taak) => setOpenId(taak.id)}
            onAddOnDay={(dag) => {
              setGekozenDag(dag);
              setNieuwOpDag(format(dag, "yyyy-MM-dd"));
            }}
            onVerplaats={verplaats}
          />
        </Panel>

        <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          {/* De gekozen dag: wat er staat, afvinken, en snel iets toevoegen. */}
          <Panel>
            <PanelHeader
              titel={dagNaam(gekozenDag)}
              subtitel={opDag.length === 0 ? "Niets gepland" : `${opDag.length} ${opDag.length === 1 ? "taak" : "taken"}`}
            />
            <div className="p-2">
              {opDag.length > 0 && (
                <ul className="mb-1">
                  {opDag.map((taak) => (
                    <TaakRegel
                      key={taak.id}
                      taak={taak}
                      onder={onder(taak)}
                      onAfvinken={() => void afvinken(taak)}
                      onOpen={() => setOpenId(taak.id)}
                    />
                  ))}
                </ul>
              )}
              <div className="flex gap-2 p-1">
                <Input
                  value={titel}
                  onChange={(e) => setTitel(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    void voegToe();
                  }}
                  placeholder={`Taak op ${format(gekozenDag, "d MMMM", { locale: nl })}`}
                  maxLength={300}
                  aria-label="Taak op deze dag"
                  className="h-9"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => void voegToe()}
                  disabled={!titel.trim() || save.isPending}
                  aria-label="Toevoegen"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Panel>

          {/* Te laat: altijd in beeld, niet alleen op vandaag. Met één klik naar vandaag. */}
          {teLaat.length > 0 && (
            <Panel>
              <PanelHeader titel={<span className={TOON.danger.tekst}>Te laat</span>} subtitel={`${teLaat.length} open`} />
              <ul className="p-2">
                {teLaat.map((taak) => (
                  <TaakRegel
                    key={taak.id}
                    taak={taak}
                    onder={onder(taak, true)}
                    onAfvinken={() => void afvinken(taak)}
                    onOpen={() => setOpenId(taak.id)}
                    actie={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground"
                        onClick={() => verplaats(taak.id, vandaagSleutel)}
                        title="Naar vandaag"
                        aria-label={`${taak.title} naar vandaag`}
                      >
                        <CalendarCheck className="h-4 w-4" />
                      </Button>
                    }
                  />
                ))}
              </ul>
            </Panel>
          )}

          {/* Zonder datum: inplannen op de gekozen dag, of slepen naar een dag. */}
          {zonderDatum.length > 0 && (
            <Panel>
              <PanelHeader titel="Zonder datum" subtitel={`${zonderDatum.length} open`} />
              <ul className="p-2">
                {zichtbaarZonderDatum.map((taak) => (
                  <TaakRegel
                    key={taak.id}
                    taak={taak}
                    onder={onder(taak)}
                    onAfvinken={() => void afvinken(taak)}
                    onOpen={() => setOpenId(taak.id)}
                    actie={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground"
                        onClick={() => verplaats(taak.id, dagSleutel)}
                        title={`Op ${format(gekozenDag, "d MMMM", { locale: nl })} zetten`}
                        aria-label={`${taak.title} op ${format(gekozenDag, "d MMMM", { locale: nl })} zetten`}
                      >
                        <CalendarArrowDown className="h-4 w-4" />
                      </Button>
                    }
                  />
                ))}
              </ul>
              {zonderDatum.length > ZONDER_DATUM_KORT && (
                <button
                  type="button"
                  onClick={() => setAllesZonderDatum((v) => !v)}
                  className="w-full border-t border-border px-4 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {allesZonderDatum ? "Minder tonen" : `Toon alle ${zonderDatum.length}`}
                </button>
              )}
            </Panel>
          )}
        </div>
      </div>

      {/* Een taak bijstellen zonder de kalender te verlaten. */}
      <Dialog open={actief !== null} onOpenChange={(waarde) => !waarde && setOpenId(null)}>
        {actief && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="pr-6 leading-snug">{actief.title}</DialogTitle>
              <DialogDescription>{onder(actief) ?? "Zonder project"}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Label className="w-24 shrink-0 text-muted-foreground">Deadline</Label>
                <DatePicker
                  value={actief.due_date ? dagVan(actief.due_date) : null}
                  onChange={(waarde) => void patch(actief.id, { due_date: waarde })}
                  aria-label="Deadline"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-24 shrink-0 text-muted-foreground">Prioriteit</Label>
                <Select value={actief.priority} onValueChange={(v) => void patch(actief.id, { priority: v as Priority })}>
                  <SelectTrigger className="h-9 flex-1">
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
                  <SelectTrigger className="h-9 flex-1">
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
                {/* De key hoort bij de taak: zonder key hield het veld de tekst van
                    de vorige taak vast en kon die in deze taak worden opgeslagen. */}
                <Textarea
                  key={actief.id}
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

            <DialogFooter className="flex-row items-center sm:justify-between">
              <Link
                to={`/admin/taken/${actief.id}`}
                className="mr-auto inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Hele taak openen
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Button variant="outline" size="sm" onClick={() => void afvinken(actief)}>
                <Check className="h-4 w-4" />
                Afvinken
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

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
