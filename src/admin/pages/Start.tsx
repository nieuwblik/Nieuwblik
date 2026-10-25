import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowRight, ArrowUpRight, Play, Plus, Search, Square, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo.webp";
import PortaalAchtergrond from "@/components/PortaalAchtergrond";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import VloeiendeLink from "@/admin/components/VloeiendeLink";
import { isTeLaat } from "@/admin/constants";
import { groet } from "@/admin/format";
import { usePijplijn } from "@/admin/pijplijn";
import { useTaakTellingen } from "@/admin/stats";
import { useProjects } from "@/admin/queries";
import {
  duurMinuten,
  formatDuur,
  formatKlok,
  projectNaam,
  useLopendeTimer,
  useNu,
  useSaveUren,
  useStartTimer,
  useStopTimer,
  useUrenInPeriode,
} from "@/admin/uren";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";
import { useVloeiendNaar } from "@/admin/vloeiend";
import { useWebsiteStand } from "@/admin/websites";

/**
 * Matglas op de scène: licht getint, sterk vervaagd, met een dunne lichtrand
 * bovenin zoals bij glas.
 */
const GLAS =
  "border border-white/15 bg-[rgba(18,24,36,0.18)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] backdrop-blur-2xl backdrop-saturate-150";
/** Bij aanwijzen: iets donkerder glas en een lichtere rand, zonder te zweven; bij indrukken even kleiner. */
const GLAS_HOVER =
  "transition-[background-color,border-color,transform,color] duration-300 ease-out hover:border-white/30 hover:bg-[rgba(18,24,36,0.26)] active:scale-[0.98]";
/**
 * De kaarten onderaan: echt doorzichtig glas. Een lichte witte tint en weinig
 * vervaging, zodat je de scène (bloemen, lichtjes) erdoor blijft zien; met
 * veel vervaging en een donkere tint werd het een egale, dicht ogende vlek.
 * Een zachte tekstschaduw houdt de tekst leesbaar.
 */
const TEGEL_GLAS =
  "border border-white/20 bg-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22)] backdrop-blur-[6px] backdrop-brightness-110 backdrop-saturate-150 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]";
const TEGEL_HOVER =
  "transition-[background-color,border-color,transform] duration-300 ease-out hover:border-white/30 hover:bg-white/[0.09] active:scale-[0.99]";

/** De gloed volgt de muis: de positie gaat als --x/--y naar de kaart, de lagen lezen hem uit. */
const volgMuis = (e: PointerEvent<HTMLElement>) => {
  if (e.pointerType !== "mouse") return;
  const vak = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - vak.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - vak.top}px`);
};

/** Een masker dat alleen de rand van 1 pixel overlaat, voor de oplichtende rand. */
const ALLEEN_RAND: CSSProperties = {
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
};

/**
 * Twee lagen onder de inhoud van een kaart, alleen zichtbaar bij aanwijzen: een
 * zachte lichtvlek in het glas onder de cursor, en de rand die oplicht waar de
 * cursor in de buurt is. Op een aanraakscherm bestaat aanwijzen niet en blijven
 * ze weg.
 */
const Gloed = () => (
  <>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{ background: "radial-gradient(300px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.17), transparent 65%)" }}
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-px rounded-[21px] p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.8), transparent 70%)",
        ...ALLEEN_RAND,
      }}
    />
  </>
);
const PIL = cn(GLAS, GLAS_HOVER, "flex h-10 items-center gap-2 rounded-full px-4 text-sm text-white/90 hover:text-white disabled:opacity-60");
const TEKSTSCHADUW = { textShadow: "0 1px 24px rgba(0,0,0,0.4)" };

/** Wanneer een onderdeel opkomt, voor de animaties p-start-op(-glas) in styles.css. */
const op = (ms: number, extra?: CSSProperties) => ({ "--vertraging": `${ms}ms`, ...extra }) as CSSProperties;

const sneltoets = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘K" : "Ctrl K";

/** Eén compacte kaart onderaan: een label, één waarde, en hooguit een korte regel. */
const Tegel = ({
  to,
  label,
  waarde,
  onder,
  onderToon,
  grafiek,
  vertraging,
}: {
  to?: string;
  label: string;
  waarde: ReactNode;
  onder: string;
  onderToon?: "rood";
  /** Een klein beeld rechts naast de waarde, zoals de uren per dag. */
  grafiek?: ReactNode;
  vertraging: number;
}) => {
  const inhoud = (
    <>
      <Gloed />
      <span className="relative flex items-center justify-between gap-2 text-[13px] text-white/60">
        {label}
        {/* Bij aanwijzen schuift er een pijltje in: hier kun je verder. */}
        {to && (
          <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 translate-y-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
        )}
      </span>
      {/* Een nieuwe waarde (bijvoorbeeld als Moneybird binnenkomt) vervaagt zacht in in plaats van te verspringen. */}
      <span className="relative mt-1 flex items-end justify-between gap-3">
        <span key={String(waarde)} className="p-waarde-in truncate font-epilogue text-[26px] font-medium leading-tight tracking-tight tabular-nums">
          {waarde}
        </span>
        {grafiek}
      </span>
      <span
        key={onder}
        className={cn("p-waarde-in relative mt-0.5 truncate text-[13px]", onderToon === "rood" ? "text-[#ff9b91]" : "text-white/55")}
      >
        {onder}
      </span>
    </>
  );
  const klasse = cn(TEGEL_GLAS, "p-start-op-glas group relative flex min-w-0 flex-col rounded-[20px] px-5 py-4 text-white");
  return to ? (
    <VloeiendeLink to={to} className={cn(klasse, TEGEL_HOVER)} style={op(vertraging)} onPointerMove={volgMuis}>
      {inhoud}
    </VloeiendeLink>
  ) : (
    <div className={klasse} style={op(vertraging)} onPointerMove={volgMuis}>
      {inhoud}
    </div>
  );
};

/**
 * De week in zeven staafjes, maandag tot en met zondag: hoe lang je per dag
 * werkte. Vandaag is het felst; dagen die nog moeten komen zijn een stipje.
 */
const WeekStaafjes = ({ minuten, vandaag }: { minuten: number[]; vandaag: number }) => {
  const hoogste = Math.max(60, ...minuten);
  return (
    <span className="flex h-7 shrink-0 items-end gap-[3px] pb-1" aria-hidden="true">
      {minuten.map((m, i) => (
        <span
          key={i}
          className={cn(
            "w-[5px] rounded-full transition-[height] duration-500 ease-out",
            i === vandaag ? "bg-white/90" : i > vandaag ? "bg-white/15" : "bg-white/40",
          )}
          style={{ height: m > 0 ? `${Math.max(15, (m / hoogste) * 100)}%` : "3px" }}
        />
      ))}
    </span>
  );
};

/**
 * Het plusje voor in de timerpil: dicht tot je de pil aanwijst, dan schuift het
 * zacht open (de kolom groeit van 0fr naar 1fr) en wordt de pil breder. Het
 * opent een zoeklijst met projecten; zolang die openstaat blijft het plusje
 * zichtbaar, en met het toetsenbord komt het open zodra het focus krijgt.
 */
const ProjectPlus = ({ lopend, onKies }: { lopend: boolean; onKies: (projectId: string, naam: string) => void }) => {
  const { data: projects = [] } = useProjects();
  const [open, setOpen] = useState(false);
  const keuzes = useMemo(() => projects.filter((p) => p.status !== "geannuleerd"), [projects]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={lopend ? "Project kiezen voor de lopende timer" : "Timer starten voor een project"}
          title={lopend ? "Project kiezen" : "Starten voor een project"}
          className="grid h-full grid-cols-[0fr] opacity-0 outline-none transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/timer:grid-cols-[1fr] group-hover/timer:opacity-100 group-focus-within/timer:grid-cols-[1fr] group-focus-within/timer:opacity-100 data-[state=open]:grid-cols-[1fr] data-[state=open]:opacity-100 motion-reduce:transition-none"
        >
          <span className="flex min-w-0 items-center overflow-hidden">
            <span className="flex h-full items-center pl-3.5 pr-3 text-white/70 transition-colors duration-200 hover:text-white">
              <Plus className="h-4 w-4" />
            </span>
            <span className="h-4 w-px shrink-0 bg-white/20" />
          </span>
        </button>
      </PopoverTrigger>
      {/* Rustig lijstje: zelfde afronding als de vensters, ruimte rond elke
          regel, en geen schuifbalk maar een zachte vervaging onderaan die
          laat zien dat er meer is. */}
      <PopoverContent
        align="center"
        sideOffset={10}
        className="w-72 overflow-hidden rounded-[var(--venster-radius,1rem)] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.45)]"
      >
        <Command className="rounded-none [&_[cmdk-item]]:px-2.5 [&_[cmdk-item]]:py-2 [&_[cmdk-item]]:text-sm">
          <CommandInput placeholder="Zoek een project" className="h-11" />
          <CommandList className="max-h-[292px] pb-6 [mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)] [scrollbar-width:none]! [&::-webkit-scrollbar]:hidden">
            <CommandEmpty>Geen project gevonden</CommandEmpty>
            <CommandGroup>
              {keuzes.map((p) => {
                const naam = p.client?.name ?? p.name;
                return (
                  <CommandItem
                    key={p.id}
                    value={`${naam} ${p.name} ${p.id}`}
                    onSelect={() => {
                      setOpen(false);
                      onKies(p.id, naam);
                    }}
                  >
                    <span className="truncate">{naam}</span>
                    {/* Meestal heet het project naar de klant; alleen een afwijkende naam erbij. */}
                    {p.client && p.name !== naam && (
                      <span className="ml-auto truncate pl-3 text-xs text-muted-foreground">{p.name}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/**
 * De timer als pil: starten zonder project, of de lopende tijd met stoppen.
 * Bij aanwijzen schuift links een plusje open om de timer aan een project te
 * hangen (starten voor dat project, of de lopende timer erop zetten).
 */
const TimerPil = ({ style }: { style: CSSProperties }) => {
  const { data: lopend, isError } = useLopendeTimer();
  const start = useStartTimer();
  const stop = useStopTimer();
  const save = useSaveUren();
  const nu = useNu(Boolean(lopend));
  if (isError) return null;

  const kiesProject = (projectId: string, naam: string) => {
    if (lopend) {
      save.mutate(
        { id: lopend.id, values: { project_id: projectId, task_id: null } },
        { onSuccess: () => toast.success(`Timer staat op ${naam}`), onError: (e) => toast.error(e.message) },
      );
      return;
    }
    start.mutate(
      { project_id: projectId, task_id: null, description: null },
      { onSuccess: () => toast.success(`Timer loopt voor ${naam}`), onError: (e) => toast.error(e.message) },
    );
  };

  // De pil zelf is het glas; de knoppen erin hebben geen eigen vlak.
  const knop =
    "flex h-full items-center gap-2 px-4 transition-[color,transform] duration-150 ease-out hover:text-white active:scale-[0.97] disabled:opacity-60";

  return (
    <div
      className={cn(
        GLAS,
        "p-start-op-glas group/timer flex h-10 items-center overflow-hidden rounded-full text-sm text-white/90 transition-[background-color,border-color] duration-300 ease-out hover:border-white/30 hover:bg-[rgba(18,24,36,0.26)]",
      )}
      style={style}
    >
      <ProjectPlus lopend={Boolean(lopend)} onKies={kiesProject} />
      {lopend ? (
        <button
          type="button"
          className={knop}
          disabled={stop.isPending}
          onClick={() =>
            stop.mutate(lopend, {
              onSuccess: () => toast.success("Timer gestopt"),
              onError: (e) => toast.error(e.message),
            })
          }
          aria-label="Timer stoppen"
        >
          {/* Een zachte puls: de klok loopt. */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="tabular-nums">{formatKlok((nu - new Date(lopend.started_at).getTime()) / 1000)}</span>
          <span className="hidden max-w-40 truncate text-white/60 sm:inline">{projectNaam(lopend)}</span>
          <Square className="h-3 w-3 fill-current opacity-70" />
        </button>
      ) : (
        <button
          type="button"
          className={knop}
          disabled={start.isPending}
          onClick={() =>
            start.mutate(
              { project_id: null, task_id: null, description: null },
              {
                onSuccess: () => toast.success("Timer loopt", { description: "Een project kies je met het plusje voor de timer." }),
                onError: (e) => toast.error(e.message),
              },
            )
          }
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Timer
        </button>
      )}
    </div>
  );
};

/**
 * De startpagina: waar je binnenkomt, over het hele scherm en zonder zijbalk.
 * In het midden de begroeting, één zoekveld en de acties uit de bovenbalk van
 * het dashboard (nieuwe taak, nieuwe klant, de timer). Onderaan één rij van
 * vier rustige kaarten met de stand van vandaag; de details staan een klik
 * verder. Alles gaat met een vloeiende overgang naar de pagina erachter.
 *
 * Bij binnenkomst komen de onderdelen kort na elkaar op, van boven naar
 * beneden; bij aanwijzen komen knoppen en kaarten een fractie omhoog. Met
 * minder beweging ingesteld staat alles meteen stil op zijn plek.
 */
const Start = () => {
  const { profielNaam, user } = useAdminAuth();
  const taken = useTaakTellingen();
  const maandag = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const { data: weekUren = [] } = useUrenInPeriode(maandag, addDays(maandag, 7));
  const nuUren = useNu(weekUren.some((r) => !r.ended_at), 30_000);
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

  // Jouw uren van deze week, per dag (maandag eerst), voor de kaart Uren.
  const week = useMemo(() => {
    const perDag = Array.from({ length: 7 }, () => 0);
    for (const r of weekUren) {
      if (r.user_id !== user?.id) continue;
      const dag = (new Date(r.started_at).getDay() + 6) % 7;
      perDag[dag] = (perDag[dag] ?? 0) + duurMinuten(r, nuUren);
    }
    return { perDag, totaal: perDag.reduce((som, m) => som + m, 0), vandaag: (new Date().getDay() + 6) % 7 };
  }, [weekUren, user?.id, nuUren]);
  const eersteProbleem = websites?.problemen[0];


  // Het opkomen begint pas als het lettertype en de taken er zijn (hooguit
  // 0,45 seconde na het openen). Anders liep de animatie al terwijl de letters
  // nog wisselden en de getallen nog binnenkwamen, en oogde hij schokkerig.
  const [klaar, setKlaar] = useState(false);
  const geopend = useRef(performance.now());
  const takenLaden = taken.isLoading;
  useEffect(() => {
    if (klaar) return;
    let weg = false;
    const begin = () => {
      // Een gewone timer en geen animatieframe: die pauzeert in een tabblad op de
      // achtergrond, en dan zou de pagina onzichtbaar blijven.
      if (!weg) window.setTimeout(() => setKlaar(true), 16);
    };
    const uiterlijk = window.setTimeout(begin, Math.max(0, 450 - (performance.now() - geopend.current)));
    if (!takenLaden) void document.fonts.ready.then(begin);
    return () => {
      weg = true;
      window.clearTimeout(uiterlijk);
    };
  }, [klaar, takenLaden]);

  return (
    <div className="relative isolate min-h-[100svh] text-white" data-start={klaar ? "klaar" : "laden"}>
      <PortaalAchtergrond />

      <div className="mx-auto flex min-h-[100svh] max-w-[1240px] flex-col px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
        {/* Bovenin alleen het merk en de weg naar het dashboard. */}
        <header className="flex items-center gap-3">
          <img src={logoSrc} alt="Nieuwblik" className="p-start-op h-6 w-auto brightness-0 invert" style={op(0)} />
          {/* Een gewone portaalknop (afronding, gewicht en klikreactie van Button),
              maar wit: een donkere knop zou op de nachtscène wegvallen. */}
          <Button asChild size="sm" className="p-start-op-glas ml-auto bg-white/95 text-neutral-900 hover:bg-white">
            <VloeiendeLink to="/admin/dashboard" style={op(80)}>
              Dashboard
              <ArrowRight />
            </VloeiendeLink>
          </Button>
        </header>

        {/* In het midden: begroeting, zoeken en de acties. Een zachte, donkere
            gloed erachter houdt de tekst leesbaar boven de lichte horizon,
            zonder dat je een vlak ziet. */}
        <main className="relative flex flex-1 flex-col items-center justify-center py-12 text-center">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[min(900px,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(10,14,24,0.35),transparent)]"
            aria-hidden="true"
          />
          <h1 className="p-groet p-start-op text-[40px] leading-[1.1] sm:text-[60px]" style={op(150, TEKSTSCHADUW)}>
            {groet()}
            {voornaam ? `, ${voornaam}` : ""}
          </h1>
          <p className="p-start-op mt-2 text-[16px] text-white/75 first-letter:uppercase" style={op(260, TEKSTSCHADUW)}>
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
            className={cn(
              GLAS,
              "p-start-op-glas group mt-9 flex h-14 w-full max-w-[560px] items-center gap-3 rounded-2xl px-5 text-left text-[15px] text-white/60",
              "transition-[background-color,border-color,transform,color] duration-300 ease-out hover:border-white/30 hover:bg-[rgba(18,24,36,0.26)] hover:text-white/85 active:scale-[0.99]",
            )}
            style={op(380)}
          >
            <Search className="h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className="flex-1 truncate">Zoek een klant, taak of pagina</span>
            <kbd className="hidden shrink-0 rounded-md border border-white/20 px-1.5 py-0.5 font-sans text-xs leading-none text-white/60 transition-colors duration-300 group-hover:border-white/35 group-hover:text-white/80 sm:block">
              {sneltoets()}
            </kbd>
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className={cn(PIL, "p-start-op-glas group")}
              style={op(480)}
              onClick={() => window.dispatchEvent(new Event("portaal:nieuwe-taak"))}
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              Nieuwe taak
            </button>
            <button
              type="button"
              className={cn(PIL, "p-start-op-glas group")}
              style={op(540)}
              onClick={() => naar("/admin/klanten", { state: { nieuw: true } })}
            >
              <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Nieuwe klant
            </button>
            <TimerPil style={op(600)} />
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
            vertraging={680}
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
            vertraging={740}
          />
          <Tegel
            to="/admin/uren"
            label="Uren deze week"
            waarde={week.totaal === 0 ? "0u" : formatDuur(week.totaal)}
            onder={pijplijn.teFactureren.uren > 0 ? `${bedrag(pijplijn.teFactureren.uren, 0)} te factureren` : "Alles gefactureerd"}
            grafiek={<WeekStaafjes minuten={week.perDag} vandaag={week.vandaag} />}
            vertraging={800}
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
            vertraging={860}
          />
        </div>
      </div>
    </div>
  );
};

export default Start;
