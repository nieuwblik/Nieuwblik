import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { UitgavenPanel } from "@/admin/components/FinancienPanelen";
import { TOON } from "@/admin/constants";
import { useTransacties, type Onderdeel, type Transactie, type Uitgaven } from "@/admin/financien";
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

const PERIODES: { waarde: "30" | "90"; label: string }[] = [
  { waarde: "30", label: "30 dagen" },
  { waarde: "90", label: "90 dagen" },
];

/** "Vandaag", "Gisteren" of "Dinsdag 21 oktober", als kopje boven de transacties van die dag. */
function dagKop(datum: string): string {
  const d = parseISO(datum);
  if (isToday(d)) return "Vandaag";
  if (isYesterday(d)) return "Gisteren";
  const tekst = format(d, "EEEE d MMMM", { locale: nl });
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

/** Eén bank­transactie: richting, tegenpartij met omschrijving, en het bedrag. */
const TransactieRegel = ({ t }: { t: Transactie }) => {
  const { bedrag } = useBedragenVerborgen();
  const bij = t.bedrag > 0;
  const Pijl = bij ? ArrowDownLeft : ArrowUpRight;
  const onder = [t.omschrijving, t.categorie, t.rekening].filter(Boolean).join(" · ");
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
 * van de laatste 30 of 90 dagen (per dag, nieuwste eerst), of alleen één van
 * de twee. "Uitgaven" toont de bonnen en inkoopfacturen zoals Moneybird ze kent.
 *
 * De keuzes staan in de link (?soort=af&dagen=90), zodat terug en vernieuwen
 * op dezelfde weergave uitkomen.
 */
const TransactiesTab = ({ uitgaven, moneybirdUrl }: { uitgaven?: Onderdeel<Uitgaven>; moneybirdUrl: string }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const soort: Soort = SOORTEN.some((s) => s.waarde === searchParams.get("soort"))
    ? (searchParams.get("soort") as Soort)
    : "alles";
  const dagen = searchParams.get("dagen") === "90" ? 90 : 30;
  const [zoek, setZoek] = useState("");
  const { bedrag } = useBedragenVerborgen();
  const { data, isLoading, error } = useTransacties(dagen);

  const zet = (sleutel: string, waarde: string | null) => {
    const volgende = new URLSearchParams(searchParams);
    if (waarde === null) volgende.delete(sleutel);
    else volgende.set(sleutel, waarde);
    setSearchParams(volgende, { replace: true });
  };

  // Gefilterd op soort en zoekterm, daarna per dag gegroepeerd.
  const perDag = useMemo(() => {
    const term = zoek.trim().toLowerCase();
    const lijst = (data?.transacties ?? []).filter(
      (t) =>
        (soort === "alles" || (soort === "af" ? t.bedrag < 0 : t.bedrag > 0)) &&
        (!term || [t.tegenpartij, t.omschrijving, t.categorie, t.rekeningnummer].some((v) => v?.toLowerCase().includes(term))),
    );
    const groepen = new Map<string, Transactie[]>();
    for (const t of lijst) groepen.set(t.datum, [...(groepen.get(t.datum) ?? []), t]);
    return { aantal: lijst.length, som: lijst.reduce((s, t) => s + t.bedrag, 0), groepen: [...groepen.entries()] };
  }, [data, soort, zoek]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          label="Welke transacties"
          opties={SOORTEN}
          waarde={soort}
          onChange={(w) => zet("soort", w === "alles" ? null : w)}
        />
        {soort !== "uitgaven" && (
          <SegmentedControl
            label="Periode"
            opties={PERIODES}
            waarde={dagen === 90 ? "90" : "30"}
            onChange={(w) => zet("dagen", w === "30" ? null : w)}
          />
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
              data
                ? soort === "alles"
                  ? `Laatste ${dagen} dagen: ${bedrag(data.bij, 0)} bij, ${bedrag(data.af, 0)} af`
                  : `Laatste ${dagen} dagen: ${perDag.aantal} ${perDag.aantal === 1 ? "transactie" : "transacties"}, ${bedrag(Math.abs(perDag.som), 0)}`
                : `Laatste ${dagen} dagen`
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
          {isLoading ? (
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
                {zoek.trim() ? "Niets gevonden." : `Geen transacties in de laatste ${dagen} dagen.`}
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
                      <TransactieRegel key={t.id} t={t} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </Panel>
      )}
    </div>
  );
};

export default TransactiesTab;
