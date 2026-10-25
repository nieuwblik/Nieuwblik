import { useMemo, type ReactNode } from "react";
import { addDays, format, isToday, parseISO, startOfDay } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo.webp";
import PortaalAchtergrond from "@/components/PortaalAchtergrond";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import VloeiendeLink from "@/admin/components/VloeiendeLink";
import { ACTIVE_PROJECT_STATUSES, PRIORITY_WEIGHT, isTeLaat } from "@/admin/constants";
import SnelleKnoppen from "@/admin/dashboard/SnelleKnoppen";
import { groet, timeAgo } from "@/admin/format";
import { useAanvragen } from "@/admin/aanvragen";
import { usePijplijn } from "@/admin/pijplijn";
import { useProjects, useTasks } from "@/admin/queries";
import { useTaakTellingen } from "@/admin/stats";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";
import { useWebsiteStand } from "@/admin/websites";

/**
 * Matglas op de scène: donker getint, sterk vervaagd, met een dunne lichtrand
 * bovenin zoals bij glas. Wit op een getinte ruit leest overal, ook boven de
 * lichte wolken.
 */
const GLAS =
  "border border-white/15 bg-[rgba(18,24,36,0.38)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] backdrop-blur-2xl backdrop-saturate-150";
const BENTO = cn(GLAS, "flex min-w-0 flex-col rounded-[22px] p-5 text-white transition-colors duration-300");
const KLIKBAAR = "hover:bg-[rgba(18,24,36,0.5)]";
const TITEL = "text-[13px] text-white/60";
const GROOT = "mt-1 font-epilogue text-[30px] font-medium leading-tight tracking-tight tabular-nums";
const RIJ = "rounded-lg px-2 transition-colors duration-150 hover:bg-white/10";
const ROOD = "text-[#ff9b91]";
const TEKSTSCHADUW = { textShadow: "0 1px 18px rgba(0,0,0,0.35)" };

const Bento = ({ to, className, children }: { to?: string; className?: string; children: ReactNode }) =>
  to ? (
    <VloeiendeLink to={to} className={cn(BENTO, KLIKBAAR, className)}>
      {children}
    </VloeiendeLink>
  ) : (
    <div className={cn(BENTO, className)}>{children}</div>
  );

/**
 * De startpagina: waar je binnenkomt, over het hele scherm en zonder zijbalk.
 * De nachtscène als achtergrond, in het bovenste kwart de begroeting, en
 * onderin een paar kaarten van matglas met wat er vandaag toe doet: je taken,
 * het geld, nieuwe aanvragen, de week en de websites. Alles klikt met een
 * vloeiende overgang door naar de pagina erachter; het volledige overzicht
 * staat op het dashboard.
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
        .map((t) => ({ sleutel: `t-${t.id}`, datum: t.due_date!.slice(0, 10), titel: t.title })),
      ...projects
        .filter((p) => p.status && ACTIVE_PROJECT_STATUSES.includes(p.status) && inWeek(p.deadline))
        .map((p) => ({ sleutel: `p-${p.id}`, datum: p.deadline!.slice(0, 10), titel: `Oplevering ${p.client?.name ?? p.name}` })),
    ].sort((a, b) => a.datum.localeCompare(b.datum));
  }, [tasks, projects]);

  const nieuweAanvragen = aanvragen.filter((a) => a.status === "nieuw");
  const teLaat = vandaag.filter((t) => isTeLaat(t)).length;

  return (
    <div className="relative isolate min-h-[100svh] text-white">
      <PortaalAchtergrond />

      <div className="mx-auto flex min-h-[100svh] max-w-[1240px] flex-col px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
        {/* Bovenin: het merk, zoeken en de weg naar het dashboard. */}
        <header className="flex items-center gap-3">
          <img src={logoSrc} alt="Nieuwblik" className="h-6 w-auto brightness-0 invert" />
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("portaal:zoeken"))}
              aria-label="Zoeken"
              className={cn(GLAS, "flex h-10 items-center gap-2 rounded-full px-3.5 text-sm text-white/85 transition-colors hover:bg-[rgba(18,24,36,0.5)] hover:text-white")}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Zoeken</span>
            </button>
            <VloeiendeLink
              to="/admin/dashboard"
              className="group flex h-10 items-center gap-2 rounded-full bg-white/95 px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-white"
            >
              Dashboard
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </VloeiendeLink>
          </div>
        </header>

        {/* Het bovenste kwart: de begroeting. */}
        <div className="flex min-h-[10rem] flex-col justify-center lg:h-[22svh]">
          <h1 className="text-[36px] font-medium leading-tight tracking-tight sm:text-[48px]" style={TEKSTSCHADUW}>
            {groet()}
            {voornaam ? `, ${voornaam}` : ""}
          </h1>
          <p className="mt-1.5 text-[15px] text-white/80 first-letter:uppercase" style={TEKSTSCHADUW}>
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

        <SnelleKnoppen glas className="mb-3" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-auto lg:grid-cols-4">
          {/* Vandaag, het grootst: daar begin je mee. */}
          <Bento className="sm:col-span-2 lg:row-span-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className={TITEL}>Vandaag</span>
              <span className="text-[13px] text-white/60">
                {vandaag.length === 0
                  ? "Geen deadlines"
                  : `${vandaag.length} ${vandaag.length === 1 ? "taak" : "taken"}${teLaat > 0 ? `, ${teLaat} te laat` : ""}`}
              </span>
            </div>
            {vandaag.length === 0 ? (
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">Niets dat vandaag af moet.</p>
            ) : (
              <ul className="-mx-2 mt-2 flex-1 space-y-0.5">
                {vandaag.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <VloeiendeLink to={`/admin/taken/${t.id}`} className={cn(RIJ, "flex items-baseline gap-3 py-2")}>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px]">{t.title}</span>
                        {t.project && <span className="block truncate text-[13px] text-white/55">{t.project.name}</span>}
                      </span>
                      {isTeLaat(t) && <span className={cn("shrink-0 text-[13px] font-medium", ROOD)}>Te laat</span>}
                    </VloeiendeLink>
                  </li>
                ))}
              </ul>
            )}
            <VloeiendeLink
              to="/admin/taken?status=open"
              className="group mt-3 flex w-fit items-center gap-1.5 text-[13px] text-white/60 transition-colors hover:text-white"
            >
              {vandaag.length > 5 ? `Nog ${vandaag.length - 5}, alle taken` : "Alle taken"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </VloeiendeLink>
          </Bento>

          {/* Geld: wat klanten nog moeten betalen, en wat er te factureren valt. */}
          <Bento to="/admin/financien">
            <span className={TITEL}>{pijplijn.openstaand ? "Openstaand" : "Te factureren"}</span>
            <span className={GROOT}>
              {bedrag(pijplijn.openstaand ? pijplijn.openstaand.bedrag : pijplijn.teFactureren.totaal, 0)}
            </span>
            <span className="mt-auto pt-2 text-[13px] leading-snug text-white/60">
              {pijplijn.openstaand && pijplijn.openstaand.teLaat > 0 && (
                <span className={cn("block", ROOD)}>{bedrag(pijplijn.openstaand.teLaatBedrag, 0)} te laat</span>
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
            <span className="mt-auto truncate pt-2 text-[13px] text-white/60">
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
              <span className="mt-2 text-[15px] text-white/70">Geen deadlines</span>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {week.slice(0, 3).map((w) => (
                  <li key={w.sleutel} className="flex items-baseline gap-3 text-[14px]">
                    <span className="w-14 shrink-0 text-[13px] tabular-nums text-white/55 first-letter:uppercase">
                      {isToday(parseISO(w.datum)) ? "Vandaag" : format(parseISO(w.datum), "EEE d", { locale: nl })}
                    </span>
                    <span className="min-w-0 truncate">{w.titel}</span>
                  </li>
                ))}
              </ul>
            )}
            {week.length > 3 && <span className="mt-auto pt-2 text-[13px] text-white/55">Nog {week.length - 3}</span>}
          </Bento>

          {/* Websites: één regel als alles goed is, anders wat er mis is. */}
          <Bento>
            <span className={TITEL}>Websites</span>
            {!websites || websites.sites === 0 ? (
              <span className="mt-2 text-[15px] text-white/70">Nog niet gecontroleerd</span>
            ) : websites.problemen.length === 0 ? (
              <>
                <span className="mt-2 flex items-center gap-2 text-[15px]">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                  Alle {websites.gecontroleerd} online
                </span>
                <span className="mt-auto pt-2 text-[13px] text-white/55">
                  SSL en domeinnamen in orde{websites.laatste ? `, ${timeAgo(websites.laatste)}` : ""}
                </span>
              </>
            ) : (
              <ul className="-mx-2 mt-1 space-y-0.5">
                {websites.problemen.slice(0, 3).map((p) => (
                  <li key={`${p.projectId}-${p.soort}`}>
                    <VloeiendeLink to={`/admin/projecten/${p.projectId}`} className={cn(RIJ, "flex items-center gap-2 py-1 text-[14px]")}>
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", p.soort === "offline" ? "bg-red-400" : "bg-amber-300")}
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {p.naam}: {p.soort === "offline" ? "offline" : p.soort === "ssl" ? "SSL verloopt" : "domein verloopt"}
                      </span>
                    </VloeiendeLink>
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
