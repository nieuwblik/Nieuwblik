import { useMemo } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, startOfHour, subHours } from "date-fns";
import { nl } from "date-fns/locale";
import { Bell, BellOff, ExternalLink, Globe, RotateCw, Send, Smartphone, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { daysUntil, timeAgo } from "@/admin/format";
import { usePushApparaten, usePushOpDitApparaat, useTestPush, useVerwijderPushApparaat } from "@/admin/push";
import { useProjects, type ProjectWithClient } from "@/admin/queries";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import {
  DOMEIN_WAARSCHUWING,
  SSL_WAARSCHUWING,
  useControleerWebsites,
  useWebsiteControles,
  useWebsiteGeschiedenis,
  type Meting,
} from "@/admin/websites";
import type { WebsiteControle } from "@/admin/werkstroom";

const UREN = 24;

const seconden = (ms: number | null | undefined) =>
  ms == null ? "–" : `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0).replace(".", ",")} s`;
const procent = (p: number | null) =>
  p === null ? "–" : `${p >= 99.95 || p === 0 ? p.toFixed(0) : p.toFixed(1).replace(".", ",")}%`;

interface Site {
  project: ProjectWithClient;
  naam: string;
  url: string;
  laatste: WebsiteControle | undefined;
  /** De laatste 24 uur, per uur: online, offline of niet gecontroleerd. */
  uren: ("online" | "offline" | "geen")[];
  uptime: number | null;
  ssl: number | null;
  domein: number | null;
  /** Hoe dringend: offline eerst, dan wat binnenkort verloopt. */
  gewicht: number;
}

interface Storing {
  projectId: string;
  naam: string;
  van: string;
  /** Het eerste moment dat hij weer online was; null als hij nog offline is. */
  tot: string | null;
  fout: string | null;
}

/** Aaneengesloten reeksen offline-controles per site, nieuwste eerst. */
function storingenUit(metingen: Meting[], naamVan: (id: string) => string): Storing[] {
  const open = new Map<string, Storing>();
  const lijst: Storing[] = [];
  for (const m of metingen) {
    const lopend = open.get(m.project_id);
    if (!m.online && !lopend) {
      open.set(m.project_id, { projectId: m.project_id, naam: naamVan(m.project_id), van: m.created_at, tot: null, fout: m.fout });
    } else if (m.online && lopend) {
      lijst.push({ ...lopend, tot: m.created_at });
      open.delete(m.project_id);
    }
  }
  lijst.push(...open.values());
  return lijst.sort((a, b) => b.van.localeCompare(a.van));
}

function duur(van: string, tot: string | null): string {
  const minuten = Math.max(1, Math.round(((tot ? parseISO(tot) : new Date()).getTime() - parseISO(van).getTime()) / 60000));
  if (minuten < 60) return `${minuten} min`;
  const uren = Math.floor(minuten / 60);
  if (uren < 48) return `${uren} uur${minuten % 60 ? ` ${minuten % 60} min` : ""}`;
  return `${Math.floor(uren / 24)} dagen`;
}

/** Verloopdatum als "nog 74 d", oranje binnen de waarschuwingstermijn, rood als hij verlopen is. */
const Verloop = ({ dagen, grens }: { dagen: number | null; grens: number }) => (
  <span
    className={cn(
      "tabular-nums",
      dagen === null ? "text-muted-foreground" : dagen < 0 ? TOON.danger.tekst : dagen <= grens ? TOON.warning.tekst : "",
    )}
  >
    {dagen === null ? "–" : dagen < 0 ? "verlopen" : `${dagen} d`}
  </span>
);

/** De urenbalk: 24 streepjes, links 24 uur geleden, rechts het afgelopen uur. */
const Urenbalk = ({ uren }: { uren: Site["uren"] }) => (
  <span className="flex h-5 items-end gap-[2px]" aria-hidden="true">
    {uren.map((u, i) => (
      <span
        key={i}
        className={cn(
          "w-[5px] rounded-[2px]",
          u === "online" ? "h-full bg-success/70" : u === "offline" ? "h-full bg-danger" : "h-2 bg-muted-foreground/25",
        )}
      />
    ))}
  </span>
);

/** Pushmeldingen op dit apparaat, en de lijst van je apparaten. */
const Meldingen = () => {
  const push = usePushOpDitApparaat();
  const { data: apparaten = [], isError } = usePushApparaten();
  const verwijder = useVerwijderPushApparaat();
  const test = useTestPush();

  const aan = async () => {
    try {
      await push.zetAan();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Aanzetten mislukt");
    }
  };
  const uit = async () => {
    try {
      await push.zetUit();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Uitzetten mislukt");
    }
  };
  const stuurTest = () =>
    test.mutate(undefined, {
      onSuccess: (r) =>
        r.verstuurd > 0
          ? toast.success("Testmelding verstuurd", { description: "Hij komt binnen een paar seconden binnen." })
          : toast.error("Er staan geen apparaten aan om naartoe te sturen."),
      onError: (e) => toast.error(e.message),
    });

  return (
    <Panel>
      <PanelHeader icon={Bell} titel="Pushmeldingen" subtitel="Een melding als een site offline gaat en als hij weer online is" />
      <PanelBody className="space-y-4">
        {push.stand === "laden" ? (
          <Skeleton className="h-9" />
        ) : push.stand === "niet-ondersteund" ? (
          <p className="text-sm text-muted-foreground">Deze browser ondersteunt geen pushmeldingen.</p>
        ) : push.stand === "ios-beginscherm" ? (
          <p className="text-sm text-muted-foreground">
            Op een iPhone of iPad werkt dit alleen vanuit de app. Tik in Safari op Delen en kies Zet op beginscherm, open het
            portaal vanaf je beginscherm en zet de meldingen daar aan.
          </p>
        ) : push.stand === "geweigerd" ? (
          <p className="text-sm text-muted-foreground">
            Meldingen zijn voor deze site geblokkeerd. Sta ze toe in de site-instellingen van je browser en kom hier terug.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {push.stand === "aan" ? (
              <>
                <span className={cn("mr-1 flex items-center gap-1.5 text-sm font-medium", TOON.success.tekst)}>
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Aan op dit apparaat
                </span>
                <Button size="sm" variant="outline" onClick={stuurTest} disabled={test.isPending}>
                  <Send className="h-4 w-4" />
                  Testmelding
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void uit()} disabled={push.bezig}>
                  <BellOff className="h-4 w-4" />
                  Uitzetten
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => void aan()} disabled={push.bezig}>
                <Bell className="h-4 w-4" />
                Meldingen aanzetten op dit apparaat
              </Button>
            )}
          </div>
        )}

        {!isError && apparaten.length > 0 && (
          <div>
            <h3 className="mb-1.5 text-[13px] text-muted-foreground">Je apparaten</h3>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {apparaten.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <Smartphone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">
                      {a.apparaat ?? "Onbekend apparaat"}
                      {a.endpoint === push.endpoint && <span className="text-muted-foreground"> · dit apparaat</span>}
                    </span>
                    <span className="block text-[13px] text-muted-foreground">Sinds {timeAgo(a.created_at)}</span>
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0 text-muted-foreground"
                    title="Geen meldingen meer naar dit apparaat"
                    aria-label={`${a.apparaat ?? "Apparaat"} verwijderen`}
                    disabled={verwijder.isPending}
                    onClick={() =>
                      a.endpoint === push.endpoint
                        ? void uit()
                        : verwijder.mutate(a.id, { onError: (e) => toast.error(e.message) })
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PanelBody>
    </Panel>
  );
};

/**
 * Websites: de stand van alle live-sites van klanten. Elk uur wordt elke site
 * gecontroleerd (bereikbaar, laadtijd); certificaat en domeinnaam één keer per
 * dag. Per site de laatste 24 uur als balk, de uptime van de afgelopen week en
 * hoe lang certificaat en domein nog lopen. Daarnaast de storingen van de
 * week en de pushmeldingen voor dit apparaat.
 */
const Websites = () => {
  const { data: projects = [], isLoading: projectsLaden } = useProjects();
  const { data: laatste } = useWebsiteControles();
  const { data: metingen = [], isLoading: metingenLaden, isError } = useWebsiteGeschiedenis(7);
  const controleer = useControleerWebsites();

  const { sites, storingen, samenvatting } = useMemo(() => {
    const metSite = projects.filter((p) => p.live_url?.trim());
    const naamVan = (id: string) => {
      const p = metSite.find((x) => x.id === id);
      return p?.client?.name ?? p?.name ?? "Site";
    };
    const perProject = new Map<string, Meting[]>();
    for (const m of metingen) perProject.set(m.project_id, [...(perProject.get(m.project_id) ?? []), m]);

    // De uurvakken: van 23 uur geleden tot en met het lopende uur.
    const ditUur = startOfHour(new Date());
    const vakken = Array.from({ length: UREN }, (_, i) => subHours(ditUur, UREN - 1 - i).getTime());

    const sites: Site[] = metSite.map((project) => {
      const eigen = perProject.get(project.id) ?? [];
      const uren = vakken.map((begin) => {
        const inVak = eigen.filter((m) => {
          const t = parseISO(m.created_at).getTime();
          return t >= begin && t < begin + 3600000;
        });
        if (inVak.length === 0) return "geen" as const;
        return inVak.some((m) => !m.online) ? ("offline" as const) : ("online" as const);
      });
      const c = laatste?.get(project.id);
      const ssl = c?.ssl_geldig_tot ? daysUntil(c.ssl_geldig_tot.slice(0, 10)) : null;
      const domein = c?.domein_geldig_tot ? daysUntil(c.domein_geldig_tot.slice(0, 10)) : null;
      const gewicht =
        (c && !c.online ? 100 : 0) +
        (ssl !== null && ssl <= SSL_WAARSCHUWING ? 10 : 0) +
        (domein !== null && domein <= DOMEIN_WAARSCHUWING ? 10 : 0);
      return {
        project,
        naam: project.client?.name ?? project.name,
        url: project.live_url!.startsWith("http") ? project.live_url! : `https://${project.live_url}`,
        laatste: c,
        uren,
        uptime: eigen.length ? (eigen.filter((m) => m.online).length / eigen.length) * 100 : null,
        ssl,
        domein,
        gewicht,
      };
    });
    sites.sort((a, b) => b.gewicht - a.gewicht || a.naam.localeCompare(b.naam, "nl"));

    const gemeten = sites.filter((s) => s.laatste);
    const laadtijden = gemeten.map((s) => s.laatste!.laadtijd_ms).filter((ms): ms is number => ms != null);
    const samenvatting = {
      totaal: sites.length,
      online: gemeten.filter((s) => s.laatste!.online).length,
      gemeten: gemeten.length,
      uptime: metingen.length ? (metingen.filter((m) => m.online).length / metingen.length) * 100 : null,
      laadtijd: laadtijden.length ? laadtijden.reduce((a, b) => a + b, 0) / laadtijden.length : null,
      aandacht: sites.filter((s) => s.gewicht > 0).length,
      laatsteControle: gemeten.reduce<string | null>(
        (n, s) => (!n || s.laatste!.created_at > n ? s.laatste!.created_at : n),
        null,
      ),
    };
    return { sites, storingen: storingenUit(metingen, naamVan), samenvatting };
  }, [projects, metingen, laatste]);

  const nu = async () => {
    try {
      const r = await controleer.mutateAsync(undefined);
      toast.success(`${r.gecontroleerd} ${r.gecontroleerd === 1 ? "site" : "sites"} gecontroleerd`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Controleren mislukt");
    }
  };

  const laden = projectsLaden || metingenLaden;

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 lg:space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl tracking-tight">Websites</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Elk uur gecontroleerd
            {samenvatting.laatsteControle && `, laatst ${timeAgo(samenvatting.laatsteControle)}`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void nu()} disabled={controleer.isPending}>
          <RotateCw className={cn("h-4 w-4", controleer.isPending && "animate-spin")} />
          {controleer.isPending ? "Bezig met controleren" : "Nu controleren"}
        </Button>
      </div>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Online",
            waarde: samenvatting.gemeten ? `${samenvatting.online} van ${samenvatting.gemeten}` : "–",
            rood: samenvatting.online < samenvatting.gemeten,
          },
          { label: "Uptime, 7 dagen", waarde: procent(samenvatting.uptime), rood: false },
          { label: "Gemiddelde laadtijd", waarde: seconden(samenvatting.laadtijd), rood: false },
          { label: "Vraagt aandacht", waarde: `${samenvatting.aandacht}`, rood: samenvatting.aandacht > 0 },
        ].map((c) => (
          <div key={c.label} className="rounded-[16px] border border-border bg-card px-4 py-3">
            <dt className="text-[13px] text-muted-foreground">{c.label}</dt>
            <dd className={cn("mt-1 text-[22px] font-medium tabular-nums tracking-tight", c.rood && TOON.danger.tekst)}>
              {laden ? <Skeleton className="h-7 w-16" /> : c.waarde}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <Panel>
          <PanelHeader icon={Globe} titel="Sites" subtitel={`${samenvatting.totaal} met een live-adres · balk: de laatste 24 uur`} />
          {laden ? (
            <PanelBody className="space-y-2">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </PanelBody>
          ) : isError ? (
            <PanelBody>
              <p className="text-sm text-muted-foreground">De websitebewaking staat nog niet live.</p>
            </PanelBody>
          ) : sites.length === 0 ? (
            <PanelBody>
              <p className="text-sm text-muted-foreground">Nog geen projecten met een live-adres.</p>
            </PanelBody>
          ) : (
            <ul className="divide-y divide-border">
              {/* Kolomkoppen alleen waar de kolommen naast elkaar staan. */}
              <li className="hidden grid-cols-[minmax(0,1fr)_150px_70px_70px_60px_60px] gap-4 px-4 py-2 text-[12px] text-muted-foreground lg:grid">
                <span>Site</span>
                <span>Laatste 24 uur</span>
                <span className="text-right">Uptime</span>
                <span className="text-right">Laadtijd</span>
                <span className="text-right">SSL</span>
                <span className="text-right">Domein</span>
              </li>
              {sites.map((s) => {
                const status = !s.laatste ? "geen" : s.laatste.online ? "online" : "offline";
                return (
                  <li
                    key={s.project.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3 text-sm lg:grid-cols-[minmax(0,1fr)_150px_70px_70px_60px_60px]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 shrink-0 rounded-full",
                          status === "online" ? "bg-success" : status === "offline" ? "bg-danger" : "bg-muted-foreground/40",
                        )}
                        title={status === "online" ? "Online" : status === "offline" ? "Offline" : "Nog niet gecontroleerd"}
                      />
                      <span className="min-w-0">
                        <Link to={`/admin/projecten/${s.project.id}`} className="block truncate font-medium hover:underline">
                          {s.naam}
                        </Link>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 truncate text-[13px] text-muted-foreground hover:text-foreground"
                        >
                          <span className="truncate">{s.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                        {status === "offline" && s.laatste?.fout && (
                          <span className={cn("block truncate text-[13px]", TOON.danger.tekst)}>{s.laatste.fout}</span>
                        )}
                      </span>
                    </span>
                    <span className="justify-self-end lg:justify-self-start">
                      <Urenbalk uren={s.uren} />
                    </span>
                    {/* Op een telefoon de cijfers op een eigen regel onder de naam. */}
                    <span className="col-span-2 flex flex-wrap gap-x-4 gap-y-1 pl-[22px] text-[13px] text-muted-foreground lg:contents lg:text-sm lg:text-foreground">
                      <span className="tabular-nums lg:text-right">
                        <span className="lg:hidden">Uptime </span>
                        {procent(s.uptime)}
                      </span>
                      <span className="tabular-nums lg:text-right">
                        <span className="lg:hidden">Laadtijd </span>
                        {s.laatste?.online ? seconden(s.laatste.laadtijd_ms) : "–"}
                      </span>
                      <span className="lg:text-right">
                        <span className="lg:hidden">SSL </span>
                        <Verloop dagen={s.ssl} grens={SSL_WAARSCHUWING} />
                      </span>
                      <span className="lg:text-right">
                        <span className="lg:hidden">Domein </span>
                        <Verloop dagen={s.domein} grens={DOMEIN_WAARSCHUWING} />
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Op een telefoon bovenaan: daar zet je de meldingen juist aan. */}
        <div className="order-first space-y-4 xl:order-none xl:sticky xl:top-20">
          <Meldingen />

          <Panel>
            <PanelHeader titel="Storingen" subtitel="De afgelopen 7 dagen" />
            <PanelBody>
              {laden ? (
                <Skeleton className="h-16" />
              ) : storingen.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen storingen.</p>
              ) : (
                <ul className="space-y-3">
                  {storingen.slice(0, 10).map((s) => (
                    <li key={`${s.projectId}-${s.van}`} className="text-sm">
                      <span className="flex items-baseline justify-between gap-3">
                        <Link to={`/admin/projecten/${s.projectId}`} className="truncate font-medium hover:underline">
                          {s.naam}
                        </Link>
                        <span className={cn("shrink-0 text-[13px] tabular-nums", s.tot ? "text-muted-foreground" : TOON.danger.tekst)}>
                          {s.tot ? duur(s.van, s.tot) : `nog offline, ${duur(s.van, null)}`}
                        </span>
                      </span>
                      <span className="block truncate text-[13px] text-muted-foreground">
                        {format(parseISO(s.van), "EEE d MMM HH:mm", { locale: nl })}
                        {s.fout && ` · ${s.fout}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default Websites;
