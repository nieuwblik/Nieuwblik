import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format, parseISO, startOfMonth, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { ExternalLink, FileDown, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import DatePicker from "@/admin/components/DatePicker";
import { TOON, type Toon } from "@/admin/constants";
import {
  useDocumenten,
  useFactuurActie,
  useOfferteActie,
  type DocumentSoort,
  type TransactiePeriode,
  type VerstuurdDocument,
} from "@/admin/financien";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";
import StatusPill from "@/admin/ui/StatusPill";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

const SOORTEN: { waarde: DocumentSoort; label: string }[] = [
  { waarde: "facturen", label: "Facturen" },
  { waarde: "offertes", label: "Offertes" },
];

const STATUSSEN: Record<DocumentSoort, Record<string, { label: string; toon: Toon }>> = {
  facturen: {
    open: { label: "Openstaand", toon: "info" },
    scheduled: { label: "Ingepland", toon: "neutral" },
    pending_payment: { label: "Betaling onderweg", toon: "info" },
    late: { label: "Te laat", toon: "danger" },
    reminded: { label: "Herinnerd", toon: "warning" },
    paid: { label: "Betaald", toon: "success" },
    uncollectible: { label: "Oninbaar", toon: "neutral" },
  },
  offertes: {
    open: { label: "Uitstaand", toon: "info" },
    late: { label: "Verlopen", toon: "danger" },
    accepted: { label: "Geaccepteerd", toon: "success" },
    billed: { label: "Gefactureerd", toon: "success" },
    rejected: { label: "Afgewezen", toon: "neutral" },
    archived: { label: "Gearchiveerd", toon: "neutral" },
  },
};

type PeriodeKeuze = "jaar" | "12" | "vorig-jaar" | "alles" | "eigen";

const PERIODES: { waarde: PeriodeKeuze; label: string }[] = [
  { waarde: "jaar", label: "Dit jaar" },
  { waarde: "12", label: "Laatste 12 maanden" },
  { waarde: "vorig-jaar", label: "Vorig jaar" },
  { waarde: "alles", label: "Alles" },
  { waarde: "eigen", label: "Eigen periode" },
];

/** Zoveel documenten staan er meteen; de rest komt met "Toon meer". */
const PER_KEER = 150;

const dag = (d: Date) => format(d, "yyyy-MM-dd");

function periodeVoor(keuze: PeriodeKeuze, van: string | null, tot: string | null): TransactiePeriode {
  const nu = new Date();
  const jaar = nu.getFullYear();
  switch (keuze) {
    case "12":
      return { van: dag(subDays(nu, 364)), tot: dag(nu) };
    case "vorig-jaar":
      return { van: `${jaar - 1}-01-01`, tot: `${jaar - 1}-12-31` };
    case "alles":
      return { alles: true };
    case "eigen":
      return { van, tot };
    default:
      return { van: `${jaar}-01-01`, tot: dag(nu) };
  }
}

const datum = (d: string | null | undefined) => (d ? format(parseISO(d.slice(0, 10)), "d MMM yyyy", { locale: nl }).replace(".", "") : null);

/** "November 2026" als kop boven de documenten van die maand. */
const maandKop = (maand: string) => {
  const tekst = format(parseISO(`${maand}-01`), "LLLL yyyy", { locale: nl });
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
};

/** De regel onder de klantnaam: nummer, datum en wat er daarna gebeurde. */
function onderregel(d: VerstuurdDocument, soort: DocumentSoort): string {
  const delen = [d.nummer ?? "Zonder nummer", datum(d.datum)];
  if (soort === "facturen") {
    if (d.status === "paid" && d.betaaldOp) delen.push(`betaald ${datum(d.betaaldOp)}`);
    else if (d.status !== "paid" && d.status !== "uncollectible" && d.vervaldatum) delen.push(`vervalt ${datum(d.vervaldatum)}`);
  } else {
    if (d.status === "accepted" && d.geaccepteerd) delen.push(`geaccepteerd ${datum(d.geaccepteerd)}`);
    else if (d.status === "rejected" && d.afgewezen) delen.push(`afgewezen ${datum(d.afgewezen)}`);
    else if ((d.status === "open" || d.status === "late") && d.vervaldatum) delen.push(`geldig tot ${datum(d.vervaldatum)}`);
  }
  if (d.kenmerk) delen.push(d.kenmerk);
  return delen.filter(Boolean).join(" · ");
}

const DocumentRegel = ({
  d,
  soort,
  onPdf,
}: {
  d: VerstuurdDocument;
  soort: DocumentSoort;
  onPdf: (d: VerstuurdDocument) => void;
}) => {
  const { bedrag } = useBedragenVerborgen();
  const status = STATUSSEN[soort][d.status] ?? { label: d.status, toon: "neutral" as Toon };
  // Facturen incl. btw (wat de klant betaalt), offertes excl. btw, net als in het overzicht.
  const hoofdbedrag = soort === "facturen" ? d.incl : d.excl;
  const nogOpen = soort === "facturen" && d.status !== "paid" && (d.open ?? 0) > 0 && (d.open ?? 0) < d.incl;
  const naam = `${soort === "facturen" ? "factuur" : "offerte"} ${d.nummer ?? ""} van ${d.klant}`.replace(/\s+/g, " ");
  return (
    <li className="flex items-center gap-3 px-4 py-2.5 text-sm">
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium">{d.klant}</span>
          {d.credit && (
            <span className={cn("shrink-0 rounded-md border px-1.5 py-px text-[11px]", TOON.info.cel, TOON.info.tekst)}>Credit</span>
          )}
        </span>
        <span className="block truncate text-[13px] text-muted-foreground">{onderregel(d, soort)}</span>
      </span>
      <StatusPill toon={status.toon}>{status.label}</StatusPill>
      <span className="w-24 shrink-0 text-right tabular-nums">
        <span className="block font-medium">{bedrag(hoofdbedrag)}</span>
        {nogOpen && <span className={cn("block text-[12px]", TOON.warning.tekst)}>{bedrag(d.open ?? 0)} open</span>}
      </span>
      <span className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => onPdf(d)}
          aria-label={`Pdf van ${naam} openen`}
          title="Pdf openen"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <FileDown className="h-4 w-4" />
        </button>
        <a
          href={d.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${naam} openen in Moneybird`}
          title="Openen in Moneybird"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </span>
    </li>
  );
};

/**
 * Het tabblad Documenten: alle verstuurde facturen of offertes uit Moneybird,
 * per maand (nieuwste eerst), om terug te kijken. Zoeken op klant, nummer of
 * kenmerk, filteren op status en periode, en per document de pdf of Moneybird
 * openen. Alleen inzien: versturen, herinneren en betalingen blijven in het
 * overzicht.
 *
 * De keuzes staan in de link (?tab=documenten&soort=offertes&periode=…), zodat
 * terug en vernieuwen op dezelfde weergave uitkomen.
 */
const DocumentenTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const soort: DocumentSoort = searchParams.get("soort") === "offertes" ? "offertes" : "facturen";
  const keuze: PeriodeKeuze = PERIODES.some((p) => p.waarde === searchParams.get("periode"))
    ? (searchParams.get("periode") as PeriodeKeuze)
    : "jaar";
  const statusKeuze = searchParams.get("status") ?? "alle";
  const periode = periodeVoor(keuze, searchParams.get("van"), searchParams.get("tot"));
  const eigenFout = keuze === "eigen" && "van" in periode && periode.van && periode.tot && periode.van > periode.tot;
  const [zoek, setZoek] = useState("");
  const [zichtbaar, setZichtbaar] = useState(PER_KEER);
  const { bedrag } = useBedragenVerborgen();
  const { data, isLoading, error } = useDocumenten(soort, periode);
  const factuurActie = useFactuurActie();
  const offerteActie = useOfferteActie();

  const zet = (waarden: Record<string, string | null>) => {
    const volgende = new URLSearchParams(searchParams);
    for (const [sleutel, waarde] of Object.entries(waarden)) {
      if (waarde === null) volgende.delete(sleutel);
      else volgende.set(sleutel, waarde);
    }
    setSearchParams(volgende, { replace: true });
    setZichtbaar(PER_KEER);
  };

  const kiesPeriode = (nieuw: PeriodeKeuze) => {
    if (nieuw === "eigen") {
      const nu = new Date();
      zet({ periode: "eigen", van: searchParams.get("van") ?? dag(startOfMonth(nu)), tot: searchParams.get("tot") ?? dag(nu) });
    } else {
      zet({ periode: nieuw === "jaar" ? null : nieuw, van: null, tot: null });
    }
  };

  const openPdf = async (d: VerstuurdDocument) => {
    // Venster meteen openen, binnen de klik, anders blokkeert de browser hem.
    const venster = window.open("", "_blank");
    try {
      const r =
        soort === "facturen"
          ? await factuurActie.mutateAsync({ actie: "pdf", id: d.id })
          : await offerteActie.mutateAsync({ id: d.id, wat: "pdf" });
      if (!r.url) throw new Error("Moneybird gaf geen pdf-link.");
      if (venster) {
        venster.opener = null;
        venster.location.href = r.url;
      } else window.location.href = r.url;
    } catch (e) {
      venster?.close();
      toast.error(e instanceof Error ? e.message : "De pdf openen lukte niet");
    }
  };

  const statussen = STATUSSEN[soort];
  const gefilterd = useMemo(() => {
    const term = zoek.trim().toLowerCase();
    const lijst = (data?.soort === soort ? data.documenten : []).filter(
      (d) =>
        (statusKeuze === "alle" || d.status === statusKeuze) &&
        (!term || [d.klant, d.nummer, d.kenmerk].some((v) => v?.toLowerCase().includes(term))),
    );
    const groepen = new Map<string, VerstuurdDocument[]>();
    for (const d of lijst.slice(0, zichtbaar)) {
      const maand = (d.datum ?? "").slice(0, 7) || "onbekend";
      groepen.set(maand, [...(groepen.get(maand) ?? []), d]);
    }
    return {
      aantal: lijst.length,
      excl: lijst.reduce((s, d) => s + d.excl, 0),
      open: lijst.filter((d) => d.status !== "paid").reduce((s, d) => s + Math.max(0, d.open ?? 0), 0),
      groepen: [...groepen.entries()],
    };
  }, [data, soort, statusKeuze, zoek, zichtbaar]);

  const periodeLabel = PERIODES.find((p) => p.waarde === keuze)?.label ?? "";
  const meervoud = soort === "facturen" ? (gefilterd.aantal === 1 ? "factuur" : "facturen") : gefilterd.aantal === 1 ? "offerte" : "offertes";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          label="Welke documenten"
          opties={SOORTEN}
          waarde={soort}
          onChange={(w) => zet({ soort: w === "facturen" ? null : w, status: null })}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={keuze} onValueChange={(w) => kiesPeriode(w as PeriodeKeuze)}>
            <SelectTrigger className="h-9 w-auto min-w-[10.5rem]" aria-label="Periode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODES.map((p) => (
                <SelectItem key={p.waarde} value={p.waarde}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {keuze === "eigen" && "van" in periode && (
            <>
              <DatePicker
                value={periode.van}
                onChange={(w) => zet({ van: w })}
                placeholder="Van"
                aria-label="Van"
                className="h-9 w-[12.75rem] border border-input"
              />
              <span className="text-sm text-muted-foreground">tot</span>
              <DatePicker
                value={periode.tot}
                onChange={(w) => zet({ tot: w })}
                placeholder="Tot"
                aria-label="Tot en met"
                className="h-9 w-[12.75rem] border border-input"
              />
            </>
          )}
          <Select value={statusKeuze} onValueChange={(w) => zet({ status: w === "alle" ? null : w })}>
            <SelectTrigger className="h-9 w-auto min-w-[10rem]" aria-label="Status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle statussen</SelectItem>
              {Object.entries(statussen).map(([waarde, s]) => (
                <SelectItem key={waarde} value={waarde}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Panel>
        <PanelHeader
          titel={soort === "facturen" ? "Verstuurde facturen" : "Verstuurde offertes"}
          subtitel={
            data && data.soort === soort && !eigenFout
              ? `${periodeLabel}: ${gefilterd.aantal} ${meervoud}, ${bedrag(gefilterd.excl, 0)} excl. btw` +
                (soort === "facturen" && gefilterd.open > 0 ? `, ${bedrag(gefilterd.open, 0)} nog open` : "")
              : periodeLabel
          }
          actie={
            <div className="relative w-56 max-sm:w-full">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={zoek}
                onChange={(e) => {
                  setZoek(e.target.value);
                  setZichtbaar(PER_KEER);
                }}
                placeholder="Zoeken"
                aria-label="Zoek op klant, nummer of kenmerk"
                className="h-9 pl-8"
              />
            </div>
          }
        />
        {eigenFout ? (
          <PanelBody>
            <p className={cn("text-sm", TOON.danger.tekst)}>De begindatum ligt na de einddatum.</p>
          </PanelBody>
        ) : isLoading ? (
          <PanelBody className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-11" />
            ))}
          </PanelBody>
        ) : error ? (
          <PanelBody>
            <p className={cn("text-sm", TOON.danger.tekst)}>
              {error instanceof Error
                ? /403|recht/i.test(error.message) && soort === "offertes"
                  ? "De Moneybird-sleutel mag nog geen offertes lezen. Maak in Moneybird een nieuwe sleutel met ook het recht Offertes (estimates) en zet die in Lovable als MONEYBIRD_API_TOKEN."
                  : error.message
                : "Ophalen mislukt"}
            </p>
          </PanelBody>
        ) : gefilterd.aantal === 0 ? (
          <PanelBody>
            <p className="text-sm text-muted-foreground">
              {zoek.trim() || statusKeuze !== "alle"
                ? "Niets gevonden."
                : soort === "facturen"
                  ? "Geen verstuurde facturen in deze periode."
                  : "Geen verstuurde offertes in deze periode."}
            </p>
          </PanelBody>
        ) : (
          <div className="pb-1">
            {gefilterd.groepen.map(([maand, lijst]) => (
              <section key={maand}>
                <h3 className="sticky top-0 z-[1] border-b border-border bg-card/95 px-4 pb-1.5 pt-3 text-[13px] text-muted-foreground backdrop-blur">
                  {maand === "onbekend" ? "Zonder datum" : maandKop(maand)}
                </h3>
                <ul className="divide-y divide-border">
                  {lijst.map((d) => (
                    <DocumentRegel key={d.id} d={d} soort={soort} onPdf={(doc) => void openPdf(doc)} />
                  ))}
                </ul>
              </section>
            ))}
            {gefilterd.aantal > zichtbaar && (
              <div className="border-t border-border px-4 py-3">
                <Button variant="outline" size="sm" onClick={() => setZichtbaar((n) => n + PER_KEER)}>
                  Toon meer ({gefilterd.aantal - zichtbaar} over)
                </Button>
              </div>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
};

export default DocumentenTab;
