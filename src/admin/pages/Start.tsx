import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { addDays, format, isToday, parseISO, startOfDay } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACTIVE_PROJECT_STATUSES, PRIORITY_WEIGHT, TOON, isTeLaat } from "@/admin/constants";
import SnelleKnoppen from "@/admin/dashboard/SnelleKnoppen";
import { groet, timeAgo } from "@/admin/format";
import { useAanvragen } from "@/admin/aanvragen";
import { usePijplijn } from "@/admin/pijplijn";
import { useProjects, useTasks } from "@/admin/queries";
import { useTaakTellingen } from "@/admin/stats";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";
import { useWebsiteStand } from "@/admin/websites";

const VIDEO = "https://pub-a11da7385cd64dfea9519cdfc41268e9.r2.dev/heroglide-library-backgrounds/Celestia_animated_background.mp4";

/** Een rustige kaart op de achtergrond: bijna dicht, zodat de tekst altijd leest. */
const BENTO =
  "flex min-w-0 flex-col rounded-2xl border border-white/15 bg-background/85 p-5 text-foreground backdrop-blur-xl transition-colors duration-200 dark:bg-background/75";
const KLIKBAAR = "hover:bg-background/95 dark:hover:bg-background/90";
const TITEL = "text-[13px] text-muted-foreground";
const GROOT = "mt-1 font-epilogue text-[28px] font-medium leading-tight tracking-tight tabular-nums";

const Bento = ({ to, className, children }: { to?: string; className?: string; children: ReactNode }) =>
  to ? (
    <Link to={to} className={cn(BENTO, KLIKBAAR, className)}>
      {children}
    </Link>
  ) : (
    <div className={cn(BENTO, className)}>{children}</div>
  );

/**
 * De startpagina: waar je binnenkomt. Een rustige scène als achtergrond, in
 * het bovenste kwart de begroeting, en onderin een paar kaarten met wat er
 * vandaag toe doet: je taken, het geld, nieuwe aanvragen, de week en de
 * websites. Alles klikt door naar de pagina erachter; het volledige overzicht
 * staat op het dashboard.
 *
 * De video speelt zacht in een lus. Wie in het systeem minder beweging heeft
 * ingesteld, krijgt een stilstaand beeld.
 */
const Start = () => {
  const { profielNaam } = useAdminAuth();
  const taken = useTaakTellingen();
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const { data: aanvragen = [] } = useAanvragen();
  const pijplijn = usePijplijn();
  const websites = useWebsiteStand();
  const { bedrag } = useBedragenVerborgen();

  const video = useRef<HTMLVideoElement>(null);
  const [geladen, setGeladen] = useState(false);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    void v.play().catch(() => null);
  }, []);

  const voornaam = profielNaam.split(/\s+/)[0];

  // Vandaag: wat te laat is eerst, dan de deadlines van vandaag, zwaarste prioriteit voorop.
  const vandaag = useMemo(() => {
    const gezien = new Set<string>();
    return [...taken.teLaat, ...taken.vandaag]
      .filter((t) => (gezien.has(t.id) ? false : (gezien.add(t.id), true)))
      .sort(
        (a, b) =>
          Number(isTeLaat(b)) - Number(isTeLaat(a)) || PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority],
      );
  }, [taken.teLaat, taken.vandaag]);

  // De komende zeven dagen: deadlines van taken en opleveringen van lopende projecten.
  const week = useMemo(() => {
    const morgen = startOfDay(addDays(new Date(), 1));
    const tot = addDays(morgen, 7);
    const inWeek = (d: string | null) => {
      if (!d) return false;
      const dag = parseISO(d.slice(0, 10));
      return dag >= morgen && dag < tot;
    };
    return [
      ...tasks
        .filter((t) => t.status !== "klaar" && !t.parent_task_id && inWeek(t.due_date))
        .map((t) => ({ sleutel: `t-${t.id}`, datum: t.due_date!.slice(0, 10), titel: t.title, to: `/admin/taken/${t.id}` })),
      ...projects
        .filter((p) => p.status && ACTIVE_PROJECT_STATUSES.includes(p.status) && inWeek(p.deadline))
        .map((p) => ({
          sleutel: `p-${p.id}`,
          datum: p.deadline!.slice(0, 10),
          titel: `Oplevering ${p.client?.name ?? p.name}`,
          to: `/admin/projecten/${p.id}`,
        })),
    ].sort((a, b) => a.datum.localeCompare(b.datum));
  }, [tasks, projects]);

  const nieuweAanvragen = aanvragen.filter((a) => a.status === "nieuw");
  const teLaat = vandaag.filter((t) => isTeLaat(t)).length;

  return (
    <div className="relative isolate -mx-2 overflow-hidden rounded-[20px] bg-[#1d2b3d] sm:-mx-3 lg:-mx-4 lg:h-[calc(100vh-7.625rem)]">
      <video
        ref={video}
        src={VIDEO}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedData={() => setGeladen(true)}
        className={cn(
          "absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700",
          geladen ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Onderin de bergen en bloemen: iets donkerder, zodat de kaarten rustig op de scène liggen. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-transparent to-black/35" aria-hidden="true" />

      <div className="flex h-full flex-col gap-6 p-5 sm:p-8">
        {/* Het bovenste kwart: de begroeting. */}
        <div className="flex min-h-[9rem] flex-col justify-center lg:h-1/4 lg:min-h-0">
          <h1
            className="text-[34px] font-medium leading-tight tracking-tight text-white sm:text-[44px]"
            style={{ textShadow: "0 1px 18px rgba(0,0,0,0.35)" }}
          >
            {groet()}
            {voornaam ? `, ${voornaam}` : ""}
          </h1>
          <p className="mt-1.5 text-[15px] text-white/80 first-letter:uppercase" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
            {format(new Date(), "EEEE d MMMM", { locale: nl })}
            {/* Zonder profielnaam stond hier het begin van je e-mailadres; een kleine vraag lost het op. */}
            {!profielNaam && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("portaal:naam-instellen"))}
                className="ml-3 text-white/80 underline underline-offset-4 transition-colors hover:text-white"
              >
                Stel je naam in
              </button>
            )}
          </p>
        </div>

        <SnelleKnoppen />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-auto lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          {/* Vandaag, het grootst: daar begin je mee. */}
          <Bento className="sm:col-span-2 lg:row-span-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className={TITEL}>Vandaag</span>
              <span className="text-[13px] text-muted-foreground">
                {vandaag.length === 0
                  ? "Geen deadlines"
                  : `${vandaag.length} ${vandaag.length === 1 ? "taak" : "taken"}${teLaat > 0 ? `, ${teLaat} te laat` : ""}`}
              </span>
            </div>
            {vandaag.length === 0 ? (
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Niets dat vandaag af moet. Op het dashboard staat wat er verder openstaat.
              </p>
            ) : (
              <ul className="-mx-2 mt-2 flex-1 space-y-0.5">
                {vandaag.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <Link to={`/admin/taken/${t.id}`} className="flex items-baseline gap-3 rounded-lg px-2 py-2 p-rij">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px]">{t.title}</span>
                        {t.project && <span className="block truncate text-[13px] text-muted-foreground">{t.project.name}</span>}
                      </span>
                      {isTeLaat(t) && <span className={cn("shrink-0 text-[13px] font-medium", TOON.danger.tekst)}>Te laat</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/admin/taken?status=open"
              className="group mt-3 flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {vandaag.length > 5 ? `Nog ${vandaag.length - 5}, alle taken` : "Alle taken"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Bento>

          {/* Geld: wat klanten nog moeten betalen, en wat er te factureren valt. */}
          <Bento to="/admin/financien">
            <span className={TITEL}>{pijplijn.openstaand ? "Openstaand" : "Te factureren"}</span>
            <span className={GROOT}>
              {bedrag(pijplijn.openstaand ? pijplijn.openstaand.bedrag : pijplijn.teFactureren.totaal, 0)}
            </span>
            <span className="mt-auto pt-2 text-[13px] leading-snug text-muted-foreground">
              {pijplijn.openstaand && pijplijn.openstaand.teLaat > 0 && (
                <span className={cn("block", TOON.danger.tekst)}>{bedrag(pijplijn.openstaand.teLaatBedrag, 0)} te laat</span>
              )}
              {pijplijn.openstaand && pijplijn.teFactureren.totaal > 0 && (
                <span className="block">{bedrag(pijplijn.teFactureren.totaal, 0)} te factureren</span>
              )}
            </span>
          </Bento>

          {/* Aanvragen: een nieuwe lead wil je niet laten liggen. */}
          <Bento to="/admin/aanvragen">
            <span className={TITEL}>Aanvragen</span>
            <span className={GROOT}>{nieuweAanvragen.length}</span>
            <span className="mt-auto truncate pt-2 text-[13px] text-muted-foreground">
              {nieuweAanvragen.length > 0
                ? `Nieuwste van ${nieuweAanvragen[0]!.naam}, ${timeAgo(nieuweAanvragen[0]!.created_at)}`
                : pijplijn.aanvragen.open > 0
                  ? `${pijplijn.aanvragen.open} in behandeling`
                  : "Geen nieuwe aanvragen"}
            </span>
          </Bento>

          {/* De komende zeven dagen. */}
          <Bento to="/admin/kalender">
            <span className={TITEL}>Komende week</span>
            {week.length === 0 ? (
              <span className="mt-2 text-[15px] text-muted-foreground">Geen deadlines</span>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {week.slice(0, 3).map((w) => (
                  <li key={w.sleutel} className="flex items-baseline gap-3 text-[14px]">
                    <span className="w-14 shrink-0 text-[13px] tabular-nums text-muted-foreground first-letter:uppercase">
                      {isToday(parseISO(w.datum)) ? "Vandaag" : format(parseISO(w.datum), "EEE d", { locale: nl })}
                    </span>
                    <span className="min-w-0 truncate">{w.titel}</span>
                  </li>
                ))}
              </ul>
            )}
            {week.length > 3 && <span className="mt-auto pt-2 text-[13px] text-muted-foreground">Nog {week.length - 3}</span>}
          </Bento>

          {/* Websites: één regel als alles goed is, anders wat er mis is. */}
          <Bento>
            <span className={TITEL}>Websites</span>
            {!websites || websites.sites === 0 ? (
              <span className="mt-2 text-[15px] text-muted-foreground">Nog niet gecontroleerd</span>
            ) : websites.problemen.length === 0 ? (
              <>
                <span className="mt-2 flex items-center gap-2 text-[15px]">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", TOON.success.stip)} aria-hidden="true" />
                  Alle {websites.gecontroleerd} online
                </span>
                <span className="mt-auto pt-2 text-[13px] text-muted-foreground">
                  SSL en domeinnamen in orde{websites.laatste ? `, ${timeAgo(websites.laatste)}` : ""}
                </span>
              </>
            ) : (
              <ul className="mt-2 space-y-1">
                {websites.problemen.slice(0, 3).map((p) => (
                  <li key={`${p.projectId}-${p.soort}`}>
                    <Link to={`/admin/projecten/${p.projectId}`} className="flex items-center gap-2 text-[14px] hover:underline">
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", p.soort === "offline" ? TOON.danger.stip : TOON.warning.stip)}
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {p.naam}: {p.soort === "offline" ? "offline" : p.soort === "ssl" ? "SSL verloopt" : "domein verloopt"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Bento>
        </div>
      </div>
    </div>
  );
};

export default Start;
