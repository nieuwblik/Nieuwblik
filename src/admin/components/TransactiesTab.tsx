import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format, isThisYear, isToday, isYesterday, parseISO, startOfMonth, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import DatePicker from "@/admin/components/DatePicker";
import { UitgavenPanel } from "@/admin/components/FinancienPanelen";
import { TOON } from "@/admin/constants";
import {
  useTransacties,
  type Onderdeel,
  type Transactie,
  type TransactiePeriode,
  type Uitgaven,
} from "@/admin/financien";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

type Soort = "alles" | "af" | "bij" | "uitgaven";

const SOORTEN: { waarde: Soort; label: string }[] = [
  { waarde: "alles", label: "Alles" },
  { waarde: "af", label: "Afschrijvingen" },
  { waarde: "bij", label: "Bijschrijvingen" },
  { waarde: "uitgaven", label: "Uitgaven" },
];

type PeriodeKeuze = "30" | "90" | "jaar" | "vorig-jaar" | "alles" | "eigen";

const PERIODES: { waarde: PeriodeKeuze; label: string }[] = [
  { waarde: "30", label: "Laatste 30 dagen" },
  { waarde: "90", label: "Laatste 90 dagen" },
  { waarde: "jaar", label: "Dit jaar" },
  { waarde: "vorig-jaar", label: "Vorig jaar" },
  { waarde: "alles", label: "Alles" },
  { waarde: "eigen", label: "Eigen periode" },
];

/** Zoveel transacties staan er meteen; de rest komt met "Toon meer". */
const PER_KEER = 300;

const dag = (d: Date) => format(d, "yyyy-MM-dd");

/** De periode die bij een keuze hoort; bij "eigen" de datums uit de link. */
function periodeVoor(keuze: PeriodeKeuze, van: string | null, tot: string | null): TransactiePeriode {
  const nu = new Date();
  const jaar = nu.getFullYear();
  switch (keuze) {
    case "90":
      return { van: dag(subDays(nu, 89)), tot: dag(nu) };
    case "jaar":
      return { van: `${jaar}-01-01`, tot: dag(nu) };
    case "vorig-jaar":
      return { van: `${jaar - 1}-01-01`, tot: `${jaar - 1}-12-31` };
    case "alles":
      return { alles: true };
    case "eigen":
      return { van, tot };
    default:
      return { van: dag(subDays(nu, 29)), tot: dag(nu) };
  }
}

/** "1 jan – 26 okt 2026", "vanaf 3 mrt 2025" of "alles", voor de ondertitel. */
function periodeTekst(keuze: PeriodeKeuze, periode: TransactiePeriode): string {
  if ("alles" in periode) return "Alles";
  const kort = (d: string) => format(parseISO(d), "d MMM yyyy", { locale: nl });
  if (keuze !== "eigen") return PERIODES.find((p) => p.waarde === keuze)?.label ?? "";
  if (periode.van && periode.tot) return `${kort(periode.van)} – ${kort(periode.tot)}`;
  if (periode.van) return `Vanaf ${kort(periode.van)}`;
  if (periode.tot) return `Tot en met ${kort(periode.tot)}`;
  return "Alles";
}

/** "Vandaag", "Gisteren" of "Dinsdag 21 oktober" (met jaartal als het niet dit jaar is). */
function dagKop(datum: string): string {
  const d = parseISO(datum);
  if (isToday(d)) return "Vandaag";
  if (isYesterday(d)) return "Gisteren";
  const tekst = format(d, isThisYear(d) ? "EEEE d MMMM" : "EEEE d MMMM yyyy", { locale: nl });
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

/** Eén bank­transactie: richting, tegenpartij met omschrijving, en het bedrag. */
const TransactieRegel = ({ t, metRekening }: { t: Transactie; metRekening: boolean }) => {
  const { bedrag } = useBedragenVerborgen();
  const bij = t.bedrag > 0;
  const Pijl = bij ? ArrowDownLeft : ArrowUpRight;
  // De eigen rekening alleen als er meer zijn; anders staat overal hetzelfde nummer.
  const onder = [t.omschrijving, t.categorie, metRekening && t.rekening].filter(Boolean).join(" · ");
  return (
    <li className="flex items-center gap-3 px-4 py-2.5 text-sm">
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          bij ? "bg-success/10 text-success-ink" : "bg-muted text-muted-foreground",
        )}
        aria-hidden="true"
      >
        <Pijl className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium">{t.tegenpartij}</span>
          {!t.verwerkt && (
            <span className={cn("shrink-0 rounded-md border px-1.5 py-px text-[11px]", TOON.warning.cel, TOON.warning.tekst)}>
              Niet verwerkt
            </span>
          )}
        </span>
        {onder && <span className="block truncate text-[13px] text-muted-foreground">{onder}</span>}
      </span>
      <span className={cn("shrink-0 tabular-nums", bij ? cn("font-medium", TOON.success.tekst) : "font-medium")}>
        {bij ? "+" : "−"}
        {bedrag(Math.abs(t.bedrag))}
      </span>
    </li>
  );
};

/**
 * Het tabblad Transacties: de bank in beeld, met alle af- en bijschrijvingen
 * van een periode (per dag, nieuwste eerst), of alleen één van de twee. De
 * periode is een vaste keuze (30 of 90 dagen, dit of vorig jaar, alles) of
 * een eigen van en tot. "Uitgaven" toont de bonnen en inkoopfacturen zoals
 * Moneybird ze kent.
 *
 * De keuzes staan in de link (?soort=af&periode=eigen&van=…&tot=…), zodat
 * terug en vernieuwen op dezelfde weergave uitkomen. Bij een lange periode
 * staan eerst 300 transacties, de rest komt met "Toon meer".
 */
const TransactiesTab = ({ uitgaven, moneybirdUrl }: { uitgaven?: Onderdeel<Uitgaven>; moneybirdUrl: string }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const soort: Soort = SOORTEN.some((s) => s.waarde === searchParams.get("soort"))
    ? (searchParams.get("soort") as Soort)
    : "alles";
  const keuze: PeriodeKeuze = PERIODES.some((p) => p.waarde === searchParams.get("periode"))
    ? (searchParams.get("periode") as PeriodeKeuze)
    : "30";
  const periode = periodeVoor(keuze, searchParams.get("van"), searchParams.get("tot"));
  const label = periodeTekst(keuze, periode);
  const eigenFout = keuze === "eigen" && "van" in periode && periode.van && periode.tot && periode.van > periode.tot;
  const [zoek, setZoek] = useState("");
  const [zichtbaar, setZichtbaar] = useState(PER_KEER);
  const { bedrag } = useBedragenVerborgen();
  const { data, isLoading, error } = useTransacties(periode);
  // Een oudere serverfunctie kent alleen de laatste 30 dagen en stuurt die
  // terug, wat je ook vraagt. Dan geen cijfers tonen die niet bij de periode horen.
  const oudeFunctie = Boolean(data) && !("van" in (data as object)) && keuze !== "30";

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
      // Begin met de lopende maand; daarna pas je van en tot aan.
      const nu = new Date();
      zet({ periode: "eigen", van: searchParams.get("van") ?? dag(startOfMonth(nu)), tot: searchParams.get("tot") ?? dag(nu) });
    } else {
      zet({ periode: nieuw === "30" ? null : nieuw, van: null, tot: null });
    }
  };

  // Gefilterd op soort en zoekterm, daarna per dag gegroepeerd.
  const meerRekeningen = new Set((data?.transacties ?? []).map((t) => t.rekening).filter(Boolean)).size > 1;

  const perDag = useMemo(() => {
    const term = zoek.trim().toLowerCase();
    const lijst = (data?.transacties ?? []).filter(
      (t) =>
        (soort === "alles" || (soort === "af" ? t.bedrag < 0 : t.bedrag > 0)) &&
        (!term || [t.tegenpartij, t.omschrijving, t.categorie, t.rekeningnummer].some((v) => v?.toLowerCase().includes(term))),
    );
    const groepen = new Map<string, Transactie[]>();
    for (const t of lijst.slice(0, zichtbaar)) groepen.set(t.datum, [...(groepen.get(t.datum) ?? []), t]);
    return { aantal: lijst.length, som: lijst.reduce((s, t) => s + t.bedrag, 0), groepen: [...groepen.entries()] };
  }, [data, soort, zoek, zichtbaar]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          label="Welke transacties"
          opties={SOORTEN}
          waarde={soort}
          onChange={(w) => zet({ soort: w === "alles" ? null : w })}
        />
        {soort !== "uitgaven" && (
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
            {/* Eigen periode: van en tot, elk mag leeg (dan open aan die kant). */}
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
          </div>
        )}
      </div>

      {soort === "uitgaven" ? (
        uitgaven ? (
          <UitgavenPanel uitgaven={uitgaven} moneybirdUrl={moneybirdUrl} />
        ) : (
          <p className="text-sm text-muted-foreground">Uitgaven zijn nog niet geladen.</p>
        )
      ) : (
        <Panel>
          <PanelHeader
            titel={soort === "af" ? "Afschrijvingen" : soort === "bij" ? "Bijschrijvingen" : "Banktransacties"}
            subtitel={
              data && !oudeFunctie
                ? soort === "alles"
                  ? `${label}: ${bedrag(data.bij, 0)} bij, ${bedrag(data.af, 0)} af`
                  : `${label}: ${perDag.aantal} ${perDag.aantal === 1 ? "transactie" : "transacties"}, ${bedrag(Math.abs(perDag.som), 0)}`
                : label
            }
            actie={
              <div className="relative w-56 max-sm:w-full">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={zoek}
                  onChange={(e) => setZoek(e.target.value)}
                  placeholder="Zoeken"
                  aria-label="Zoek op tegenpartij, omschrijving of categorie"
                  className="h-9 pl-8"
                />
              </div>
            }
          />
          {eigenFout ? (
            <PanelBody>
              <p className={cn("text-sm", TOON.danger.tekst)}>De begindatum ligt na de einddatum.</p>
            </PanelBody>
          ) : oudeFunctie ? (
            <PanelBody>
              <p className="text-sm text-muted-foreground">
                Andere periodes dan de laatste 30 dagen werken zodra de nieuwste versie van de serverfunctie live staat.
              </p>
            </PanelBody>
          ) : isLoading ? (
            <PanelBody className="space-y-2">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-11" />
              ))}
            </PanelBody>
          ) : error ? (
            <PanelBody>
              <p className={cn("text-sm", TOON.danger.tekst)}>{error instanceof Error ? error.message : "Ophalen mislukt"}</p>
            </PanelBody>
          ) : perDag.aantal === 0 ? (
            <PanelBody>
              <p className="text-sm text-muted-foreground">
                {zoek.trim() ? "Niets gevonden." : "Geen transacties in deze periode."}
              </p>
            </PanelBody>
          ) : (
            <div className="pb-1">
              {perDag.groepen.map(([datum, lijst]) => (
                <section key={datum}>
                  <h3 className="sticky top-0 z-[1] border-b border-border bg-card/95 px-4 pb-1.5 pt-3 text-[13px] text-muted-foreground backdrop-blur">
                    {dagKop(datum)}
                  </h3>
                  <ul className="divide-y divide-border">
                    {lijst.map((t) => (
                      <TransactieRegel key={t.id} t={t} metRekening={meerRekeningen} />
                    ))}
                  </ul>
                </section>
              ))}
              {perDag.aantal > zichtbaar && (
                <div className="border-t border-border px-4 py-3">
                  <Button variant="outline" size="sm" onClick={() => setZichtbaar((n) => n + PER_KEER)}>
                    Toon meer ({perDag.aantal - zichtbaar} over)
                  </Button>
                </div>
              )}
            </div>
          )}
        </Panel>
      )}
    </div>
  );
};

export default TransactiesTab;
