import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { addDays, addWeeks, format, isSameWeek, isToday, startOfWeek, subWeeks } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, Pencil, Plus, Timer, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import UrenDialoog from "@/admin/components/UrenDialoog";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { useProjects, useTeam } from "@/admin/queries";
import {
  duurMinuten,
  formatDuur,
  isNietGeactiveerd,
  projectKleur,
  projectNaam,
  useDeleteUren,
  useNu,
  useUrenInPeriode,
  type UrenRegel,
} from "@/admin/uren";
import { useConfirm } from "@/admin/useConfirm";
import Avatar from "@/admin/ui/Avatar";
import FilterSelect from "@/admin/ui/FilterSelect";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";

/** Uren als decimale waarde voor de as en de staafjes. */
const inUren = (minuten: number) => minuten / 60;

/**
 * De urenregistratie per week: bovenaan het totaal en de verdeling over
 * projecten, daaronder per dag een tijdlijn met de blokken en de regels.
 *
 * Gelezen wordt van iedereen; filteren op persoon of project kan rechtsboven.
 */
const Uren = () => {
  const { user } = useAdminAuth();
  const { data: team = [] } = useTeam();
  const { data: projects = [] } = useProjects();
  const [week, setWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [wie, setWie] = useState<string>("iedereen");
  const [project, setProject] = useState<string>("alle");
  const [dialoog, setDialoog] = useState<{ regel?: UrenRegel; datum?: string } | null>(null);
  const verwijder = useDeleteUren();
  const { vraagBevestiging, dialoog: bevestiging } = useConfirm();

  const { data: regels = [], isLoading, isError, error } = useUrenInPeriode(week, addWeeks(week, 1));
  const loopt = regels.some((r) => !r.ended_at);
  const nu = useNu(loopt, 30_000);

  const zichtbaar = useMemo(
    () =>
      regels.filter(
        (r) =>
          (wie === "iedereen" || r.user_id === (wie === "ik" ? user?.id : wie)) &&
          (project === "alle" || (project === "geen" ? !r.project_id : r.project_id === project)),
      ),
    [regels, wie, project, user?.id],
  );

  const dagen = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const datum = addDays(week, i);
        const sleutel = format(datum, "yyyy-MM-dd");
        const eigen = zichtbaar.filter((r) => format(new Date(r.started_at), "yyyy-MM-dd") === sleutel);
        return { datum, sleutel, regels: eigen, minuten: eigen.reduce((som, r) => som + duurMinuten(r, nu), 0) };
      }),
    [week, zichtbaar, nu],
  );

  const totaal = dagen.reduce((som, d) => som + d.minuten, 0);
  const factureerbaar = zichtbaar.filter((r) => r.billable).reduce((som, r) => som + duurMinuten(r, nu), 0);

  const perProject = useMemo(() => {
    const map = new Map<string, { id: string | null; naam: string; minuten: number }>();
    for (const r of zichtbaar) {
      const sleutel = r.project_id ?? "geen";
      const huidig = map.get(sleutel) ?? { id: r.project_id, naam: projectNaam(r), minuten: 0 };
      huidig.minuten += duurMinuten(r, nu);
      map.set(sleutel, huidig);
    }
    return [...map.values()].sort((a, b) => b.minuten - a.minuten);
  }, [zichtbaar, nu]);

  const naamVan = (id: string) => team.find((l) => l.user_id === id)?.name ?? "Onbekend";
  const hoogsteDag = Math.max(60, ...dagen.map((d) => d.minuten));

  const wisRegel = async (regel: UrenRegel) => {
    const ja = await vraagBevestiging({
      titel: "Deze uren verwijderen?",
      beschrijving: `${formatDuur(duurMinuten(regel, nu))} op ${format(new Date(regel.started_at), "d MMMM", { locale: nl })}. Dit kun je niet terugdraaien.`,
    });
    if (!ja) return;
    try {
      await verwijder.mutateAsync(regel.id);
      toast.success("Uren verwijderd");
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Verwijderen mislukt");
    }
  };

  const dezeWeek = isSameWeek(week, new Date(), { weekStartsOn: 1 });
  const weekLabel = `${format(week, "d MMM", { locale: nl })} – ${format(addDays(week, 6), "d MMM yyyy", { locale: nl })}`;

  if (isError && isNietGeactiveerd(error)) {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        <h1 className="text-2xl tracking-tight">Uren</h1>
        <EmptyState
          icon={Timer}
          title="De urenregistratie is nog niet geactiveerd"
          description="De databasetabel bestaat nog niet. Zodra de migratie 'urenregistratie' is uitgevoerd, werkt deze pagina en verschijnt de timer in de bovenbalk."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl tracking-tight">Uren</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {weekLabel} · {formatDuur(totaal)} totaal
            {totaal > 0 && `, ${formatDuur(factureerbaar)} factureerbaar`}
          </p>
        </div>
        <Button onClick={() => setDialoog({})}>
          <Plus className="h-4 w-4" />
          Uren toevoegen
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeek(subWeeks(week, 1))} aria-label="Vorige week">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeek(addWeeks(week, 1))} aria-label="Volgende week">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            disabled={dezeWeek}
            onClick={() => setWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Deze week
          </Button>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <FilterSelect
            label="Wie"
            waarde={wie}
            onChange={setWie}
            opties={[
              { waarde: "iedereen", label: "Iedereen" },
              { waarde: "ik", label: "Mijn uren" },
              ...team.filter((l) => l.user_id !== user?.id).map((l) => ({ waarde: l.user_id, label: l.name })),
            ]}
          />
          <FilterSelect
            label="Project"
            waarde={project}
            onChange={setProject}
            opties={[
              { waarde: "alle", label: "Alle projecten" },
              { waarde: "geen", label: "Zonder project" },
              ...projects.map((p) => ({ waarde: p.id, label: p.client?.name ?? p.name })),
            ]}
          />
        </div>
      </div>

      {/* De week in één blik: uren per dag en per project. */}
      <Panel>
        <PanelHeader icon={Clock} titel={dezeWeek ? "Deze week" : "Weekoverzicht"} subtitel={weekLabel} />
        <PanelBody className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="flex items-baseline gap-1">
              <span className="font-epilogue text-[32px] font-medium leading-none tabular-nums tracking-tight">
                {Math.floor(totaal / 60)}
              </span>
              <span className="text-sm text-muted-foreground">u</span>
              <span className="ml-1 font-epilogue text-[32px] font-medium leading-none tabular-nums tracking-tight">
                {totaal % 60}
              </span>
              <span className="text-sm text-muted-foreground">min</span>
            </p>
            <ol className="mt-4 grid h-28 grid-cols-7 items-end gap-2">
              {dagen.map((d) => (
                <li key={d.sleutel} className="flex h-full flex-col items-center justify-end gap-1.5">
                  <span
                    className={cn("p-groei-y w-full max-w-9 rounded-md", d.minuten > 0 ? "bg-accent" : "bg-muted")}
                    style={{ animationDelay: `${dagen.indexOf(d) * 35}ms`, height: `${Math.max(4, (d.minuten / hoogsteDag) * 100)}%` }}
                    title={`${format(d.datum, "EEEE", { locale: nl })}: ${formatDuur(d.minuten)}`}
                  />
                  <span className={cn("text-xs text-muted-foreground", isToday(d.datum) && "font-medium text-foreground")}>
                    {format(d.datum, "EEEEEE", { locale: nl })}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-[13px] text-muted-foreground">Per project</p>
            {perProject.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Nog niets geregistreerd.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {perProject.slice(0, 6).map((p) => (
                  <li key={p.id ?? "geen"} className="space-y-1">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", projectKleur(p.id).vlak)} />
                        <span className="truncate">{p.naam}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">{formatDuur(p.minuten)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={cn("p-groei-x h-full rounded-full", projectKleur(p.id).vlak)} style={{ width: `${(p.minuten / totaal) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PanelBody>
      </Panel>

      {isLoading ? (
        <Skeleton className="h-48 rounded-[16px]" />
      ) : zichtbaar.length === 0 ? (
        <EmptyState
          icon={Timer}
          title="Geen uren in deze week"
          description="Start de timer in de bovenbalk, of voeg uren met de hand toe."
          action={
            <Button variant="outline" size="sm" onClick={() => setDialoog({})}>
              <Plus className="h-4 w-4" />
              Uren toevoegen
            </Button>
          }
        />
      ) : (
        dagen
          .filter((d) => d.regels.length > 0)
          .map((dag) => <DagKaart key={dag.sleutel} dag={dag} nu={nu} naamVan={naamVan} onBewerk={(regel) => setDialoog({ regel })} onWis={(regel) => void wisRegel(regel)} onNieuw={() => setDialoog({ datum: dag.sleutel })} />)
      )}

      <UrenDialoog
        open={dialoog !== null}
        onOpenChange={(open) => !open && setDialoog(null)}
        regel={dialoog?.regel ?? null}
        {...(dialoog?.datum ? { datum: dialoog.datum } : {})}
      />
      {bevestiging}
    </div>
  );
};

interface Dag {
  datum: Date;
  sleutel: string;
  regels: UrenRegel[];
  minuten: number;
}

/**
 * Eén dag: een tijdlijn van de vroegste tot de laatste blokken (minstens
 * 08:00 tot 18:00), en daaronder de regels met project, wie, tijd en duur.
 */
const DagKaart = ({
  dag,
  nu,
  naamVan,
  onBewerk,
  onWis,
  onNieuw,
}: {
  dag: Dag;
  nu: number;
  naamVan: (id: string) => string;
  onBewerk: (regel: UrenRegel) => void;
  onWis: (regel: UrenRegel) => void;
  onNieuw: () => void;
}) => {
  const uurVan = (iso: string | null) => {
    const d = iso ? new Date(iso) : new Date(nu);
    return d.getHours() + d.getMinutes() / 60;
  };
  const begin = Math.min(8, ...dag.regels.map((r) => Math.floor(uurVan(r.started_at))));
  const eind = Math.max(18, ...dag.regels.map((r) => Math.ceil(uurVan(r.ended_at))));
  const breedte = Math.max(1, eind - begin);
  const labels = Array.from({ length: Math.floor(breedte / 2) + 1 }, (_, i) => begin + i * 2).filter((u) => u <= eind);

  return (
    <Panel className="p-vervaag">
      <PanelHeader
        titel={
          <span className="first-letter:uppercase inline-block">
            {format(dag.datum, "EEEE d MMMM", { locale: nl })}:{" "}
            <span className="font-epilogue tabular-nums">{formatDuur(dag.minuten)}</span>
          </span>
        }
        actie={
          <Button variant="ghost" size="sm" className="h-8" onClick={onNieuw}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Toevoegen</span>
          </Button>
        }
      />
      <PanelBody className="space-y-4">
        <div>
          <div className="relative h-9 rounded-lg bg-muted/60">
            {dag.regels.map((r) => {
              const links = ((uurVan(r.started_at) - begin) / breedte) * 100;
              const breed = (inUren(duurMinuten(r, nu)) / breedte) * 100;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onBewerk(r)}
                  title={`${projectNaam(r)}: ${format(new Date(r.started_at), "HH:mm")} – ${r.ended_at ? format(new Date(r.ended_at), "HH:mm") : "nu"}`}
                  className={cn(
                    "absolute inset-y-1 rounded-md border transition-opacity hover:opacity-80",
                    projectKleur(r.project_id).zacht,
                    !r.ended_at && "border-dashed",
                  )}
                  style={{ left: `${links}%`, width: `max(${breed}%, 6px)` }}
                />
              );
            })}
          </div>
          <div className="relative mt-1.5 h-4 text-xs tabular-nums text-muted-foreground" aria-hidden="true">
            {labels.map((uur) => (
              <span key={uur} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: `${((uur - begin) / breedte) * 100}%` }}>
                {`${uur}`.padStart(2, "0")}:00
              </span>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-border rounded-lg border border-border">
          {dag.regels.map((r) => {
            const kleur = projectKleur(r.project_id);
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5 text-sm">
                <span className="min-w-0 flex-1 basis-48">
                  <span className="block truncate font-medium">
                    {r.task ? (
                      <Link to={`/admin/taken/${r.task.id}`} className="hover:underline">
                        {r.task.title}
                      </Link>
                    ) : (
                      (r.description ?? "Geen omschrijving")
                    )}
                  </span>
                  {r.task && r.description && <span className="block truncate text-[13px] text-muted-foreground">{r.description}</span>}
                </span>
                <span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium", kleur.zacht, kleur.tekst)}>
                  {projectNaam(r)}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground" title={naamVan(r.user_id)}>
                  <Avatar naam={naamVan(r.user_id)} maat="xs" vorm="rond" />
                  <span className="hidden lg:inline">{naamVan(r.user_id)}</span>
                </span>
                <span className="w-28 text-[13px] tabular-nums text-muted-foreground">
                  {format(new Date(r.started_at), "HH:mm")} – {r.ended_at ? format(new Date(r.ended_at), "HH:mm") : "loopt"}
                </span>
                <span className="w-20 text-right font-medium tabular-nums">
                  {formatDuur(duurMinuten(r, nu))}
                  {!r.billable && <span className="block text-xs font-normal text-muted-foreground">intern</span>}
                </span>
                <span className="flex shrink-0 gap-0.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onBewerk(r)} aria-label="Bewerken">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onWis(r)}
                    aria-label="Verwijderen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </span>
              </li>
            );
          })}
        </ul>
      </PanelBody>
    </Panel>
  );
};

export default Uren;
