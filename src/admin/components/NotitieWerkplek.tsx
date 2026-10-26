import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { format, isThisYear, isToday, isYesterday, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft, ArrowUpRight, ListTodo, NotebookPen, Pin, PinOff, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import {
  useBewaarNotitie,
  useNieuweNotitie,
  useNotitieNaarTaak,
  useNotities,
  useVerwijderNotitie,
  type Notitie,
} from "@/admin/notities";
import { useClients, useTasks, type Client } from "@/admin/queries";
import { useConfirm } from "@/admin/useConfirm";

const GEEN = "__geen__";
const ALLE = "__alle__";
/** Zo lang na de laatste toetsaanslag wordt er opgeslagen. */
const BEWAAR_NA_MS = 500;

/** "14:32", "Gisteren", "di 21 okt" of "21 okt 2025": kort, voor in de lijst. */
function wanneer(datum: string): string {
  const d = parseISO(datum);
  if (isToday(d)) return format(d, "HH:mm");
  if (isYesterday(d)) return "Gisteren";
  return format(d, isThisYear(d) ? "EEE d MMM" : "d MMM yyyy", { locale: nl });
}

/** De eerste regel met inhoud: de titel, of anders het begin van de tekst. */
const kopVan = (n: Pick<Notitie, "titel" | "inhoud">) =>
  n.titel.trim() || n.inhoud.trim().split("\n")[0]?.trim() || "";

/** Een regel tekst onder de kop in de lijst. */
function voorproefje(n: Pick<Notitie, "titel" | "inhoud">): string {
  const regels = n.inhoud
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
  return (n.titel.trim() ? regels[0] : regels[1]) ?? "";
}

/**
 * De editor van één notitie. Slaat vanzelf op, een halve seconde na de laatste
 * toetsaanslag en ook bij het wisselen van notitie. "Maak taak" maakt van de
 * hele notitie een taak, of van wat je geselecteerd hebt.
 */
const Editor = ({
  notitie,
  klanten,
  onTerug,
}: {
  notitie: Notitie;
  klanten: Client[];
  onTerug: () => void;
}) => {
  const navigate = useNavigate();
  const bewaar = useBewaarNotitie();
  const naarTaak = useNotitieNaarTaak();
  const verwijder = useVerwijderNotitie();
  const { data: tasks = [] } = useTasks();
  const { vraagBevestiging, dialoog } = useConfirm();

  const [titel, setTitel] = useState(notitie.titel);
  const [inhoud, setInhoud] = useState(notitie.inhoud);
  const [selectie, setSelectie] = useState("");
  const [stand, setStand] = useState<"opgeslagen" | "bezig" | "fout">("opgeslagen");
  const tekstvak = useRef<HTMLTextAreaElement>(null);

  // Wat nog niet is opgeslagen; bij wisselen of sluiten alsnog weg.
  const wachtend = useRef<Partial<Notitie> | null>(null);
  const klok = useRef<number | null>(null);
  const bewaarNu = () => {
    if (klok.current) window.clearTimeout(klok.current);
    klok.current = null;
    const waarden = wachtend.current;
    wachtend.current = null;
    if (!waarden) return;
    bewaar.mutate(
      { id: notitie.id, waarden },
      { onSuccess: () => setStand("opgeslagen"), onError: () => setStand("fout") },
    );
  };
  const bewaarStraks = (waarden: Partial<Notitie>) => {
    wachtend.current = { ...wachtend.current, ...waarden };
    setStand("bezig");
    if (klok.current) window.clearTimeout(klok.current);
    klok.current = window.setTimeout(bewaarNu, BEWAAR_NA_MS);
  };
  // Bij het verlaten van deze notitie: wat nog wacht, meteen opslaan.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => bewaarNu(), []);

  // Een nieuwe, lege notitie: meteen typen in de titel.
  const titelVeld = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!notitie.titel && !notitie.inhoud) titelVeld.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taak = notitie.task_id ? tasks.find((t) => t.id === notitie.task_id) : null;

  const maakTaak = () => {
    bewaarNu();
    const tekst = selectie.trim() || [titel.trim(), inhoud.trim()].filter(Boolean).join("\n");
    if (!tekst) {
      toast.error("Schrijf eerst iets in de notitie.");
      return;
    }
    naarTaak.mutate(
      { notitie: { ...notitie, titel, inhoud }, tekst },
      {
        onSuccess: (t) =>
          toast.success("Taak gemaakt", {
            description: t.title,
            action: { label: "Openen", onClick: () => navigate(`/admin/taken/${t.id}`) },
          }),
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const weg = async () => {
    const ja = await vraagBevestiging({
      titel: "Notitie verwijderen?",
      beschrijving: kopVan({ titel, inhoud }) ? `"${kopVan({ titel, inhoud })}" gaat weg. Dit kun je niet terugdraaien.` : "Dit kun je niet terugdraaien.",
    });
    if (!ja) return;
    wachtend.current = null;
    verwijder.mutate(notitie.id, { onSuccess: onTerug, onError: (e) => toast.error(e.message) });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* De balk bovenin: terug (telefoon), klant, en wat je met de notitie kunt. */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2.5 sm:px-5">
        <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={onTerug} aria-label="Terug naar de lijst">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Select
          value={notitie.client_id ?? GEEN}
          onValueChange={(v) => bewaar.mutate({ id: notitie.id, waarden: { client_id: v === GEEN ? null : v } })}
        >
          <SelectTrigger className="h-8 w-auto max-w-[14rem] gap-2 border-transparent bg-transparent px-2 text-[13px] hover:bg-muted" aria-label="Klant">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={GEEN}>Zonder klant</SelectItem>
            {klanten.map((k) => (
              <SelectItem key={k.id} value={k.id}>
                {k.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-[12px] text-muted-foreground" aria-live="polite">
          {stand === "bezig" ? "Opslaan…" : stand === "fout" ? "Niet opgeslagen" : "Opgeslagen"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => bewaar.mutate({ id: notitie.id, waarden: { vastgezet: !notitie.vastgezet } })}
          title={notitie.vastgezet ? "Losmaken" : "Vastzetten bovenaan"}
          aria-label={notitie.vastgezet ? "Losmaken" : "Vastzetten bovenaan"}
          aria-pressed={notitie.vastgezet}
        >
          {notitie.vastgezet ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => void weg()}
          title="Verwijderen"
          aria-label="Notitie verwijderen"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={maakTaak} disabled={naarTaak.isPending}>
          <ListTodo className="h-4 w-4" />
          {selectie.trim() ? "Taak van selectie" : "Maak taak"}
        </Button>
      </div>

      {/* Taken die van deze notitie zijn gemaakt: de laatste, met een doorklik. */}
      {notitie.task_id && (
        <div className="border-b border-border px-5 py-2 text-[13px]">
          <Link
            to={`/admin/taken/${notitie.task_id}`}
            className="inline-flex max-w-full items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ListTodo className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Taak: {taak?.title ?? "openen"}
              {taak?.status === "klaar" && " (klaar)"}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-5 sm:px-8">
        <input
          ref={titelVeld}
          value={titel}
          onChange={(e) => {
            setTitel(e.target.value);
            bewaarStraks({ titel: e.target.value.slice(0, 200) });
          }}
          onKeyDown={(e) => {
            // Enter in de titel: door naar de tekst, zoals in een notitie-app.
            if (e.key === "Enter") {
              e.preventDefault();
              tekstvak.current?.focus();
            }
          }}
          placeholder="Titel"
          maxLength={200}
          aria-label="Titel"
          className="w-full border-0 bg-transparent p-0 text-[22px] font-semibold tracking-tight outline-none placeholder:text-muted-foreground/50"
        />
        <textarea
          ref={tekstvak}
          value={inhoud}
          onChange={(e) => {
            setInhoud(e.target.value);
            bewaarStraks({ inhoud: e.target.value.slice(0, 50000) });
          }}
          onSelect={(e) => {
            const v = e.currentTarget;
            setSelectie(v.value.slice(v.selectionStart, v.selectionEnd));
          }}
          onBlur={() => setTimeout(() => setSelectie(""), 200)}
          placeholder="Begin met typen…"
          maxLength={50000}
          aria-label="Notitie"
          className="mt-3 min-h-[50vh] w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-7 outline-none [field-sizing:content] placeholder:text-muted-foreground/50"
        />
      </div>
      {dialoog}
    </div>
  );
};

/**
 * Het notitiescherm: links de lijst met zoeken (vastgezette bovenaan, dan
 * laatst bewerkt), rechts de notitie zelf. Van een notitie, of een selectie
 * eruit, maak je met één klik een taak.
 *
 * Op de pagina Notities met alle notities en een filter per klant; op de
 * pagina van een klant (klantId) alleen die van die klant, en nieuwe
 * notities horen meteen bij die klant.
 *
 * De gekozen notitie staat in de link (?notitie=), zodat terug en vernieuwen
 * werken. Op een telefoon zie je de lijst of de notitie, niet allebei.
 */
const NotitieWerkplek = ({
  klantId,
  kop,
  hoogte = "lg:h-[calc(100svh-11rem)]",
}: {
  /** Alleen de notities van deze klant. */
  klantId?: string;
  /** De kop links boven, naast de knop Nieuwe notitie. */
  kop: ReactNode;
  /** De hoogte van het scherm vanaf desktop; de lijst en de notitie scrollen daarbinnen. */
  hoogte?: string;
}) => {
  const { data: notities = [], isLoading, error } = useNotities();
  const { data: clients = [] } = useClients();
  const nieuw = useNieuweNotitie();
  const [searchParams, setSearchParams] = useSearchParams();
  const gekozenId = searchParams.get("notitie");
  const klantFilter = klantId ?? searchParams.get("klant");
  const [zoek, setZoek] = useState("");

  const klanten = useMemo(
    () => clients.filter((c) => !c.verborgen_op).sort((a, b) => a.name.localeCompare(b.name, "nl")),
    [clients],
  );
  const klantNaam = (id: string | null) => (id ? (clients.find((c) => c.id === id)?.name ?? null) : null);
  // In het filter alleen klanten die ook notities hebben.
  const klantenMetNotities = useMemo(() => {
    const ids = new Set(notities.map((n) => n.client_id).filter(Boolean));
    return clients.filter((c) => ids.has(c.id)).sort((a, b) => a.name.localeCompare(b.name, "nl"));
  }, [notities, clients]);

  const zichtbaar = useMemo(() => {
    const term = zoek.trim().toLowerCase();
    return notities.filter(
      (n) =>
        (!klantFilter || n.client_id === klantFilter) &&
        (!term || `${n.titel}\n${n.inhoud}`.toLowerCase().includes(term)),
    );
  }, [notities, zoek, klantFilter]);
  const vastgezet = zichtbaar.filter((n) => n.vastgezet);
  const overig = zichtbaar.filter((n) => !n.vastgezet);
  const gekozen = notities.find((n) => n.id === gekozenId) ?? null;

  const kies = (id: string | null) => {
    const volgende = new URLSearchParams(searchParams);
    if (id) volgende.set("notitie", id);
    else volgende.delete("notitie");
    setSearchParams(volgende, { replace: !!id && !!gekozenId });
  };
  const zetKlantFilter = (waarde: string) => {
    const volgende = new URLSearchParams(searchParams);
    if (waarde === ALLE) volgende.delete("klant");
    else volgende.set("klant", waarde);
    setSearchParams(volgende, { replace: true });
  };

  const maakNieuw = () =>
    nieuw.mutate(klantFilter ? { client_id: klantFilter } : {}, {
      onSuccess: (n) => kies(n.id),
      onError: (e) => toast.error(e.message),
    });

  // Een gewone functie en geen component: een component die binnen de render
  // wordt gemaakt, is elke render een nieuw type en bouwt de lijst opnieuw op.
  const regel = (n: Notitie) => {
    const kop = kopVan(n);
    const onder = voorproefje(n);
    // Bij één klant hoeft de naam niet onder elke notitie.
    const klant = klantId ? null : klantNaam(n.client_id);
    return (
      <li key={n.id}>
        <button
          type="button"
          onClick={() => kies(n.id)}
          aria-current={n.id === gekozenId ? "true" : undefined}
          className={cn(
            "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
            n.id === gekozenId ? "bg-muted" : "hover:bg-muted/60",
          )}
        >
          <span className="flex items-center gap-1.5">
            <span className={cn("min-w-0 flex-1 truncate text-sm font-medium", !kop && "text-muted-foreground")}>
              {kop || "Nieuwe notitie"}
            </span>
            {n.task_id && <ListTodo className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label="Er is een taak van gemaakt" />}
          </span>
          <span className="mt-0.5 flex gap-1.5 text-[13px] text-muted-foreground">
            <span className="shrink-0 tabular-nums">{wanneer(n.updated_at)}</span>
            <span className="truncate">{onder || (klant ? "" : "Geen tekst")}</span>
          </span>
          {klant && <span className="mt-0.5 block truncate text-[12px] text-muted-foreground/80">{klant}</span>}
        </button>
      </li>
    );
  };

  return (
    <div className="space-y-4">
      <div className={cn("flex flex-wrap items-center justify-between gap-3", gekozen && "max-lg:hidden")}>
        {kop}
        <Button size="sm" variant={klantId ? "outline" : "default"} onClick={maakNieuw} disabled={nieuw.isPending}>
          <Plus className="h-4 w-4" />
          Nieuwe notitie
        </Button>
      </div>

      {error ? (
        <EmptyState icon={NotebookPen} title="Notities zijn nog niet beschikbaar" description={error.message} />
      ) : (
        <div
          className={cn(
            "grid overflow-hidden rounded-[16px] border border-border bg-card lg:min-h-[480px] lg:grid-cols-[300px_minmax(0,1fr)]",
            hoogte,
          )}
        >
          {/* De lijst. Op een telefoon verborgen zodra er een notitie open is. */}
          <aside className={cn("flex min-h-0 flex-col border-border lg:border-r", gekozen && "max-lg:hidden")}>
            <div className="space-y-2 border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={zoek}
                  onChange={(e) => setZoek(e.target.value)}
                  placeholder="Zoeken"
                  aria-label="Zoek in notities"
                  className="h-9 pl-8"
                />
              </div>
              {!klantId && klantenMetNotities.length > 0 && (
                <Select value={klantFilter ?? ALLE} onValueChange={zetKlantFilter}>
                  <SelectTrigger className="h-9" aria-label="Klant">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALLE}>Alle notities</SelectItem>
                    {klantenMetNotities.map((k) => (
                      <SelectItem key={k.id} value={k.id}>
                        {k.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="space-y-2 p-1">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              ) : zichtbaar.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {zoek.trim() ? "Niets gevonden." : klantId ? "Nog geen notities voor deze klant." : "Nog geen notities."}
                </p>
              ) : (
                <>
                  {vastgezet.length > 0 && (
                    <>
                      <h2 className="flex items-center gap-1.5 px-3 pb-1 pt-1 text-[12px] text-muted-foreground">
                        <Pin className="h-3 w-3" />
                        Vastgezet
                      </h2>
                      <ul>
                        {vastgezet.map(regel)}
                      </ul>
                      {overig.length > 0 && <div className="mx-3 my-2 h-px bg-border" />}
                    </>
                  )}
                  <ul>
                    {overig.map(regel)}
                  </ul>
                </>
              )}
            </div>
          </aside>

          {/* De notitie zelf. */}
          <section className={cn("min-h-[70svh] min-w-0 lg:min-h-0", !gekozen && "max-lg:hidden")}>
            {gekozen ? (
              <Editor key={gekozen.id} notitie={gekozen} klanten={klanten} onTerug={() => kies(null)} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <NotebookPen className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">Kies een notitie, of begin een nieuwe.</p>
                <Button size="sm" variant="outline" onClick={maakNieuw} disabled={nieuw.isPending}>
                  <Plus className="h-4 w-4" />
                  Nieuwe notitie
                </Button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default NotitieWerkplek;
