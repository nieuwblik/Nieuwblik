import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { endOfMonth, format, isWithinInterval, parseISO, startOfMonth, subMonths } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import logoSrc from "@/assets/logo.webp";
import { useProject, useTasks } from "@/admin/queries";
import { duurMinuten, formatDuur, useUrenVan } from "@/admin/uren";
import MonthNav from "@/admin/ui/MonthNav";
import { useWebsiteControles } from "@/admin/websites";

const leesMaand = (waarde: string | null) => {
  const d = waarde ? parseISO(`${waarde}-01`) : subMonths(new Date(), 1);
  return startOfMonth(Number.isNaN(d.getTime()) ? subMonths(new Date(), 1) : d);
};

/**
 * Maandoverzicht voor een klant: welk werk er die maand is gedaan, hoeveel
 * uur erin zat en hoe de website ervoor staat. Bedoeld om af te drukken of
 * als pdf op te slaan en mee te sturen; bij afdrukken verdwijnen zijbalk,
 * bovenbalk en knoppen. Standaard de vorige maand, de maand die je meestal
 * rapporteert.
 */
const Maandrapport = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const maand = leesMaand(searchParams.get("maand"));
  const { data: project, isLoading } = useProject(id);
  const { data: regels = [] } = useUrenVan("project", id);
  const { data: tasks = [] } = useTasks();
  const { data: controles } = useWebsiteControles();

  const bereik = { start: startOfMonth(maand), end: endOfMonth(maand) };

  const uren = useMemo(() => {
    const inMaand = regels.filter((r) => r.ended_at && isWithinInterval(new Date(r.started_at), bereik));
    const groepen = new Map<string, number>();
    for (const r of inMaand) {
      const naam = r.task?.title?.trim() || r.description?.trim() || "Overige werkzaamheden";
      groepen.set(naam, (groepen.get(naam) ?? 0) + duurMinuten(r));
    }
    return {
      totaal: inMaand.reduce((t, r) => t + duurMinuten(r), 0),
      regels: [...groepen.entries()].sort((a, b) => b[1] - a[1]),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regels, maand.getTime()]);

  const afgerond = useMemo(
    () =>
      tasks
        .filter(
          (t) =>
            t.project_id === id &&
            !t.parent_task_id &&
            t.status === "klaar" &&
            t.completed_at &&
            isWithinInterval(new Date(t.completed_at), bereik),
        )
        .sort((a, b) => (a.completed_at ?? "").localeCompare(b.completed_at ?? "")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, id, maand.getTime()],
  );

  const controle = id ? controles?.get(id) : undefined;
  const klant = project?.client?.name ?? project?.name ?? "";

  if (isLoading || !project) {
    return <Skeleton className="mx-auto h-96 max-w-3xl rounded-[16px]" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="geen-print flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/admin/projecten/${project.id}`}>
            <ArrowLeft className="h-4 w-4" />
            Terug naar {klant}
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <MonthNav maand={maand} onChange={(m) => setSearchParams({ maand: format(m, "yyyy-MM") }, { replace: true })} />
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Afdrukken of pdf
          </Button>
        </div>
      </div>

      <article className="rapport space-y-8 rounded-[16px] border border-border bg-card p-8 sm:p-10">
        <header className="flex items-start justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="text-sm text-muted-foreground">Maandoverzicht</p>
            <h1 className="mt-1 text-2xl tracking-tight first-letter:uppercase">
              {format(maand, "LLLL yyyy", { locale: nl })}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{klant}</p>
          </div>
          <img src={logoSrc} alt="Nieuwblik" className="h-6 w-auto brightness-0 dark:invert" />
        </header>

        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="p-kaarttitel">Gewerkte uren</h2>
            <span className="font-medium tabular-nums">{formatDuur(uren.totaal)}</span>
          </div>
          {uren.regels.length === 0 ? (
            <p className="text-sm text-muted-foreground">Geen uren geregistreerd in deze maand.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {uren.regels.map(([naam, minuten]) => (
                <li key={naam} className="flex items-baseline justify-between gap-4 py-2">
                  <span>{naam}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{formatDuur(minuten)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="p-kaarttitel mb-3">Afgerond</h2>
          {afgerond.length === 0 ? (
            <p className="text-sm text-muted-foreground">Geen taken afgerond in deze maand.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {afgerond.map((t) => (
                <li key={t.id} className="flex items-baseline justify-between gap-4 py-2">
                  <span>{t.title}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {format(new Date(t.completed_at!), "d MMM", { locale: nl }).replace(".", "")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {project.live_url?.trim() && (
          <section>
            <h2 className="p-kaarttitel mb-3">Website</h2>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Adres</dt>
                <dd>{project.live_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</dd>
              </div>
              {controle ? (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Bereikbaar bij de laatste controle</dt>
                    <dd>{controle.online ? "Ja" : "Nee"}</dd>
                  </div>
                  {controle.ssl_geldig_tot && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Beveiligde verbinding (SSL) geldig tot</dt>
                      <dd>{format(parseISO(controle.ssl_geldig_tot), "d MMMM yyyy", { locale: nl })}</dd>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Nog niet gecontroleerd.</p>
              )}
            </dl>
          </section>
        )}
      </article>
    </div>
  );
};

export default Maandrapport;
