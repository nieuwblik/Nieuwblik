import { useMemo, type ReactNode } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowRight, Play, Plus, Search, Square, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo.webp";
import PortaalAchtergrond from "@/components/PortaalAchtergrond";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import VloeiendeLink from "@/admin/components/VloeiendeLink";
import { isTeLaat } from "@/admin/constants";
import { groet } from "@/admin/format";
import { useAanvragen } from "@/admin/aanvragen";
import { usePijplijn } from "@/admin/pijplijn";
import { useTaakTellingen } from "@/admin/stats";
import { formatKlok, projectNaam, useLopendeTimer, useNu, useStartTimer, useStopTimer } from "@/admin/uren";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";
import { useVloeiendNaar } from "@/admin/vloeiend";
import { useWebsiteStand } from "@/admin/websites";

/**
 * Matglas op de scène: licht getint, sterk vervaagd, met een dunne lichtrand
 * bovenin zoals bij glas.
 */
const GLAS =
  "border border-white/15 bg-[rgba(18,24,36,0.18)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] backdrop-blur-2xl backdrop-saturate-150";
const GLAS_HOVER = "transition-colors duration-200 hover:bg-[rgba(18,24,36,0.26)]";
const PIL = cn(GLAS, GLAS_HOVER, "flex h-10 items-center gap-2 rounded-full px-4 text-sm text-white/90 hover:text-white disabled:opacity-60");
const TEKSTSCHADUW = { textShadow: "0 1px 24px rgba(0,0,0,0.4)" };

const sneltoets = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘K" : "Ctrl K";

/** Eén compacte kaart onderaan: een label, één waarde, en hooguit een korte regel. */
const Tegel = ({
  to,
  label,
  waarde,
  onder,
  onderToon,
}: {
  to?: string;
  label: string;
  waarde: ReactNode;
  onder: string;
  onderToon?: "rood";
}) => {
  const inhoud = (
    <>
      <span className="text-[13px] text-white/60">{label}</span>
      <span className="mt-1 font-epilogue text-[26px] font-medium leading-tight tracking-tight tabular-nums">{waarde}</span>
      <span className={cn("mt-0.5 truncate text-[13px]", onderToon === "rood" ? "text-[#ff9b91]" : "text-white/55")}>{onder}</span>
    </>
  );
  const klasse = cn(GLAS, "flex min-w-0 flex-col rounded-[20px] px-5 py-4 text-white");
  return to ? (
    <VloeiendeLink to={to} className={cn(klasse, GLAS_HOVER)}>
      {inhoud}
    </VloeiendeLink>
  ) : (
    <div className={klasse}>{inhoud}</div>
  );
};

/** De timer als pil: starten zonder project (kiezen kan in de bovenbalk), of de lopende tijd met stoppen. */
const TimerPil = () => {
  const { data: lopend, isError } = useLopendeTimer();
  const start = useStartTimer();
  const stop = useStopTimer();
  const nu = useNu(Boolean(lopend));
  if (isError) return null;

  if (lopend) {
    return (
      <button
        type="button"
        className={PIL}
        disabled={stop.isPending}
        onClick={() =>
          stop.mutate(lopend, {
            onSuccess: () => toast.success("Timer gestopt"),
            onError: (e) => toast.error(e.message),
          })
        }
        aria-label="Timer stoppen"
      >
        <Square className="h-3.5 w-3.5 fill-current" />
        <span className="tabular-nums">{formatKlok((nu - new Date(lopend.started_at).getTime()) / 1000)}</span>
        <span className="hidden max-w-40 truncate text-white/60 sm:inline">{projectNaam(lopend)}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      className={PIL}
      disabled={start.isPending}
      onClick={() =>
        start.mutate(
          { project_id: null, task_id: null, description: null },
          {
            onSuccess: () => toast.success("Timer loopt", { description: "Waaraan je werkt, kies je in de bovenbalk van het dashboard." }),
            onError: (e) => toast.error(e.message),
          },
        )
      }
    >
      <Play className="h-3.5 w-3.5 fill-current" />
      Timer
    </button>
  );
};

/**
 * De startpagina: waar je binnenkomt, over het hele scherm en zonder zijbalk.
 * In het midden de begroeting, één zoekveld en de acties uit de bovenbalk van
 * het dashboard (nieuwe taak, nieuwe klant, de timer). Onderaan één rij van
 * vier rustige kaarten met de stand van vandaag; de details staan een klik
 * verder. Alles gaat met een vloeiende overgang naar de pagina erachter.
 */
const Start = () => {
  const { profielNaam } = useAdminAuth();
  const taken = useTaakTellingen();
  const { data: aanvragen = [] } = useAanvragen();
  const pijplijn = usePijplijn();
  const websites = useWebsiteStand();
  const { bedrag } = useBedragenVerborgen();
  const naar = useVloeiendNaar();

  const voornaam = profielNaam.split(/\s+/)[0];

  // Vandaag: wat te laat is en wat vandaag af moet, elk één keer.
  const vandaag = useMemo(() => {
    const ids = new Set([...taken.teLaat, ...taken.vandaag].map((t) => t.id));
    return { aantal: ids.size, teLaat: taken.teLaat.filter((t) => isTeLaat(t)).length };
  }, [taken.teLaat, taken.vandaag]);

  const nieuw = aanvragen.filter((a) => a.status === "nieuw").length;
  const eersteProbleem = websites?.problemen[0];

  return (
    <div className="relative isolate min-h-[100svh] text-white">
      <PortaalAchtergrond />

      <div className="mx-auto flex min-h-[100svh] max-w-[1240px] flex-col px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
        {/* Bovenin alleen het merk en de weg naar het dashboard. */}
        <header className="flex items-center gap-3">
          <img src={logoSrc} alt="Nieuwblik" className="h-6 w-auto brightness-0 invert" />
          <VloeiendeLink
            to="/admin/dashboard"
            className="group ml-auto flex h-10 items-center gap-2 rounded-full bg-white/95 px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-white"
          >
            Dashboard
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </VloeiendeLink>
        </header>

        {/* In het midden: begroeting, zoeken en de acties. Een zachte, donkere
            gloed erachter houdt de tekst leesbaar boven de lichte horizon,
            zonder dat je een vlak ziet. */}
        <main className="relative flex flex-1 flex-col items-center justify-center py-12 text-center">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[min(900px,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(10,14,24,0.35),transparent)]"
            aria-hidden="true"
          />
          <h1 className="p-groet text-[40px] leading-[1.1] sm:text-[60px]" style={TEKSTSCHADUW}>
            {groet()}
            {voornaam ? `, ${voornaam}` : ""}
          </h1>
          <p className="mt-2 text-[16px] text-white/75 first-letter:uppercase" style={TEKSTSCHADUW}>
            {format(new Date(), "EEEE d MMMM", { locale: nl })}
            {/* Zonder profielnaam stond hier het begin van je e-mailadres; een kleine vraag lost het op. */}
            {!profielNaam && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("portaal:naam-instellen"))}
                className="ml-3 underline underline-offset-4 transition-colors hover:text-white"
              >
                Stel je naam in
              </button>
            )}
          </p>

          {/* Eén zoekveld voor alles, zoals Spotlight: klanten, taken en pagina's. */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("portaal:zoeken"))}
            className={cn(GLAS, GLAS_HOVER, "mt-9 flex h-14 w-full max-w-[560px] items-center gap-3 rounded-2xl px-5 text-left text-[15px] text-white/60 hover:text-white/80")}
          >
            <Search className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1 truncate">Zoek een klant, taak of pagina</span>
            <kbd className="hidden shrink-0 rounded-md border border-white/20 px-1.5 py-0.5 font-sans text-xs leading-none text-white/60 sm:block">
              {sneltoets()}
            </kbd>
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button type="button" className={PIL} onClick={() => window.dispatchEvent(new Event("portaal:nieuwe-taak"))}>
              <Plus className="h-4 w-4" />
              Nieuwe taak
            </button>
            <button type="button" className={PIL} onClick={() => naar("/admin/klanten", { state: { nieuw: true } })}>
              <UserPlus className="h-4 w-4" />
              Nieuwe klant
            </button>
            <TimerPil />
          </div>
        </main>

        {/* Onderaan: de stand van vandaag, vier keer één waarde. */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tegel
            to="/admin/taken?status=open"
            label="Vandaag"
            waarde={vandaag.aantal === 0 ? "Vrij" : `${vandaag.aantal} ${vandaag.aantal === 1 ? "taak" : "taken"}`}
            onder={vandaag.teLaat > 0 ? `${vandaag.teLaat} te laat` : vandaag.aantal === 0 ? "Geen deadlines" : "Niets te laat"}
            {...(vandaag.teLaat > 0 ? { onderToon: "rood" as const } : {})}
          />
          <Tegel
            to="/admin/financien"
            label={pijplijn.openstaand ? "Openstaand" : "Te factureren"}
            waarde={bedrag(pijplijn.openstaand ? pijplijn.openstaand.bedrag : pijplijn.teFactureren.totaal, 0)}
            onder={
              pijplijn.openstaand && pijplijn.openstaand.teLaat > 0
                ? `${bedrag(pijplijn.openstaand.teLaatBedrag, 0)} te laat`
                : pijplijn.openstaand
                  ? "Niets te laat"
                  : "Excl. btw"
            }
            {...(pijplijn.openstaand && pijplijn.openstaand.teLaat > 0 ? { onderToon: "rood" as const } : {})}
          />
          <Tegel
            to="/admin/aanvragen"
            label="Aanvragen"
            waarde={nieuw}
            onder={nieuw > 0 ? "Nog niet opgepakt" : pijplijn.aanvragen.open > 0 ? `${pijplijn.aanvragen.open} in behandeling` : "Geen nieuwe"}
          />
          <Tegel
            {...(eersteProbleem ? { to: `/admin/projecten/${eersteProbleem.projectId}` } : {})}
            label="Websites"
            waarde={
              !websites || websites.sites === 0
                ? "–"
                : websites.problemen.length === 0
                  ? `${websites.gecontroleerd} online`
                  : `${websites.problemen.length} ${websites.problemen.length === 1 ? "probleem" : "problemen"}`
            }
            onder={
              !websites || websites.sites === 0
                ? "Nog niet gecontroleerd"
                : eersteProbleem
                  ? `${eersteProbleem.naam}: ${eersteProbleem.soort === "offline" ? "offline" : eersteProbleem.soort === "ssl" ? "SSL verloopt" : "domein verloopt"}`
                  : "SSL en domeinen in orde"
            }
            {...(eersteProbleem ? { onderToon: "rood" as const } : {})}
          />
        </div>
      </div>
    </div>
  );
};

export default Start;
