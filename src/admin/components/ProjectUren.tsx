import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format, isToday, isYesterday, startOfMonth, startOfWeek } from "date-fns";
import { nl } from "date-fns/locale";
import { Pencil, Plus, Timer, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import UrenDialoog from "@/admin/components/UrenDialoog";
import UrenExport from "@/admin/components/UrenExport";
import { useTeam } from "@/admin/queries";
import {
  duurMinuten,
  formatDuur,
  isNietGeactiveerd,
  useDeleteUren,
  useNu,
  useUrenVan,
  type UrenRegel,
} from "@/admin/uren";
import { useConfirm } from "@/admin/useConfirm";
import Avatar from "@/admin/ui/Avatar";
import StatusPill from "@/admin/ui/StatusPill";

/** Zoveel regels tegelijk; daarna een knop voor de rest. */
const STAP = 40;

const dagLabel = (datum: Date) =>
  isToday(datum) ? "Vandaag" : isYesterday(datum) ? "Gisteren" : format(datum, "EEEE d MMMM yyyy", { locale: nl });

/**
 * Alle uren van één project, in het tabblad Uren op de klantpagina: wat er
 * deze week, deze maand en in totaal op zit, en daaronder elke regel per dag,
 * nieuwste eerst. Toevoegen staat het project al ingevuld; de timer zelf staat
 * links in de urenbalk.
 */
const ProjectUren = ({ projectId, naam }: { projectId: string; naam: string }) => {
  const { data: regels = [], isLoading, isError, error } = useUrenVan("project", projectId);
  const { data: team = [] } = useTeam();
  const verwijder = useDeleteUren();
  const { vraagBevestiging, dialoog: bevestiging } = useConfirm();
  const [dialoog, setDialoog] = useState<{ regel?: UrenRegel } | null>(null);
  const [zichtbaar, setZichtbaar] = useState(STAP);
  const nu = useNu(regels.some((r) => !r.ended_at), 30_000);

  const cijfers = useMemo(() => {
    const maandag = startOfWeek(new Date(), { weekStartsOn: 1 });
    const eersteVanMaand = startOfMonth(new Date());
    const som = (lijst: UrenRegel[]) => lijst.reduce((t, r) => t + duurMinuten(r, nu), 0);
    return [
      { label: "Deze week", minuten: som(regels.filter((r) => new Date(r.started_at) >= maandag)) },
      { label: "Deze maand", minuten: som(regels.filter((r) => new Date(r.started_at) >= eersteVanMaand)) },
      { label: "Totaal", minuten: som(regels) },
      { label: "Factureerbaar", minuten: som(regels.filter((r) => r.billable)) },
    ];
  }, [regels, nu]);

  // Per dag, nieuwste bovenaan (de query levert ze al aflopend).
  const dagen = useMemo(() => {
    const groepen: { sleutel: string; datum: Date; regels: UrenRegel[]; minuten: number }[] = [];
    for (const r of regels.slice(0, zichtbaar)) {
      const datum = new Date(r.started_at);
      const sleutel = format(datum, "yyyy-MM-dd");
      let groep = groepen[groepen.length - 1];
      if (groep?.sleutel !== sleutel) {
        groep = { sleutel, datum, regels: [], minuten: 0 };
        groepen.push(groep);
      }
      groep.regels.push(r);
      groep.minuten += duurMinuten(r, nu);
    }
    return groepen;
  }, [regels, zichtbaar, nu]);

  const naamVan = (id: string) => team.find((l) => l.user_id === id)?.name ?? "Onbekend";

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

  if (isError && isNietGeactiveerd(error)) {
    return <EmptyState compact icon={Timer} title="De urenregistratie is nog niet geactiveerd" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg tracking-tight">Uren</h2>
        <div className="flex flex-wrap gap-2">
          <UrenExport projectId={projectId} naam={naam} variant="klein" />
          <Button variant="outline" size="sm" className="h-8" onClick={() => setDialoog({})}>
            <Plus className="h-4 w-4" />
            Uren toevoegen
          </Button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cijfers.map((c) => (
          <div key={c.label} className="rounded-xl border border-border px-4 py-3">
            <dt className="text-[13px] text-muted-foreground">{c.label}</dt>
            <dd className="mt-1 font-epilogue text-xl font-medium tabular-nums">
              {isLoading ? <Skeleton className="h-6 w-16" /> : formatDuur(c.minuten)}
            </dd>
          </div>
        ))}
      </dl>

      {isLoading ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : regels.length === 0 ? (
        <EmptyState
          icon={Timer}
          title="Nog geen uren op dit project"
          description="Start de timer in de urenbalk links, of voeg uren met de hand toe."
          action={
            <Button variant="outline" size="sm" onClick={() => setDialoog({})}>
              <Plus className="h-4 w-4" />
              Uren toevoegen
            </Button>
          }
        />
      ) : (
        <div className="p-vervaag space-y-5">
          {dagen.map((dag) => (
            <section key={dag.sleutel}>
              <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
                <h3 className="p-kaarttitel first-letter:uppercase">{dagLabel(dag.datum)}</h3>
                <span className="font-medium tabular-nums">{formatDuur(dag.minuten)}</span>
              </div>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {dag.regels.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5 text-sm">
                    <span className="w-24 shrink-0 text-[13px] tabular-nums text-muted-foreground">
                      {format(new Date(r.started_at), "HH:mm")} – {r.ended_at ? format(new Date(r.ended_at), "HH:mm") : "nu"}
                    </span>
                    <span className="min-w-0 flex-1 basis-40">
                      <span className="block truncate">
                        {r.task ? (
                          <Link to={`/admin/taken/${r.task.id}`} className="font-medium hover:underline">
                            {r.task.title}
                          </Link>
                        ) : (
                          <span className={cn(!r.description && "text-muted-foreground")}>
                            {r.description ?? "Geen omschrijving"}
                          </span>
                        )}
                      </span>
                      {r.task && r.description && (
                        <span className="block truncate text-[13px] text-muted-foreground">{r.description}</span>
                      )}
                    </span>
                    <span title={naamVan(r.user_id)}>
                      <Avatar naam={naamVan(r.user_id)} maat="xs" vorm="rond" />
                    </span>
                    {!r.billable && <StatusPill toon="neutral">Intern</StatusPill>}
                    {!r.ended_at && <StatusPill toon="success">Loopt</StatusPill>}
                    <span className="w-16 text-right font-medium tabular-nums">{formatDuur(duurMinuten(r, nu))}</span>
                    <span className="flex shrink-0 gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => setDialoog({ regel: r })}
                        aria-label="Bewerken"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => void wisRegel(r)}
                        aria-label="Verwijderen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {regels.length > zichtbaar && (
            <Button variant="outline" size="sm" onClick={() => setZichtbaar((z) => z + STAP)}>
              Toon oudere uren ({regels.length - zichtbaar})
            </Button>
          )}
        </div>
      )}

      <UrenDialoog
        open={dialoog !== null}
        onOpenChange={(open) => !open && setDialoog(null)}
        regel={dialoog?.regel ?? null}
        projectId={projectId}
      />
      {bevestiging}
    </div>
  );
};

export default ProjectUren;
