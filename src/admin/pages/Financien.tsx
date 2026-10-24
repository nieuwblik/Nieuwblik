import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowDown, ArrowUp, ExternalLink, FileText, Landmark, Percent, RotateCw, TrendingUp, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import { TOON } from "@/admin/constants";
import { daysUntil } from "@/admin/format";
import { formatBedrag, heeftData, isTeLaatFactuur, useFinancien, type MaandCijfers } from "@/admin/financien";
import { useOpenFacturen } from "@/admin/useOpenFacturen";
import OogKnop from "@/admin/ui/OogKnop";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import { useSaldoVerborgen, VERBORGEN } from "@/admin/useSaldoVerborgen";

const maandLabel = (maand: string, lang = false) =>
  format(parseISO(`${maand}-01`), lang ? "LLLL yyyy" : "LLL", { locale: nl }).replace(".", "");

/** Een rond getal voor de bovenkant van de as. */
function asMaximum(hoogste: number): number {
  if (hoogste <= 0) return 1000;
  const macht = 10 ** Math.floor(Math.log10(hoogste));
  const stap = [1, 2, 2.5, 5, 10].find((s) => s * macht >= hoogste) ?? 10;
  return stap * macht;
}

/** Een kerncijfer bovenaan de pagina, met eventueel het verschil met vorige maand. */
const Cijfer = ({
  label,
  waarde,
  verschil,
  laden,
  knop,
}: {
  label: string;
  waarde: string;
  verschil?: number | null;
  laden?: boolean;
  /** Rechts naast het label, zoals het oogje bij het banksaldo. */
  knop?: React.ReactNode;
}) => (
  <div className="rounded-[14px] border border-border bg-card px-4 py-3.5">
    <dt className="-my-1 flex min-h-7 items-center justify-between gap-2 text-[13px] text-muted-foreground">
      {label}
      {knop}
    </dt>
    <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
      {laden ? (
        <Skeleton className="h-7 w-24" />
      ) : (
        <span className="font-epilogue text-2xl font-medium tabular-nums tracking-tight">{waarde}</span>
      )}
      {!laden && verschil != null && Number.isFinite(verschil) && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[13px] font-medium",
            verschil > 0 ? TOON.success.tekst : verschil < 0 ? TOON.danger.tekst : "text-muted-foreground",
          )}
        >
          {verschil > 0 ? <ArrowUp className="h-3.5 w-3.5" /> : verschil < 0 ? <ArrowDown className="h-3.5 w-3.5" /> : null}
          {Math.abs(Math.round(verschil))}%
        </span>
      )}
    </dd>
  </div>
);

/** Omzet en kosten per maand naast elkaar; de gekozen maand toont ook de winst. */
const MaandGrafiek = ({ maanden }: { maanden: MaandCijfers[] }) => {
  const [aangewezen, setAangewezen] = useState<number | null>(null);
  const max = asMaximum(Math.max(...maanden.flatMap((m) => [m.omzet, m.kosten])));
  const gekozen = aangewezen ?? maanden.length - 1;
  const maand = maanden[gekozen];

  return (
    <div>
      <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2">
        <div className="relative h-52 text-right text-xs tabular-nums text-muted-foreground" aria-hidden="true">
          {[max, max / 2, 0].map((waarde, i) => (
            <span key={i} className="absolute right-0 -translate-y-1/2" style={{ top: `${i * 50}%` }}>
              {formatBedrag(waarde, 0)}
            </span>
          ))}
        </div>
        <div className="relative h-52" onMouseLeave={() => setAangewezen(null)}>
          {[0, 50, 100].map((top) => (
            <span key={top} className="absolute inset-x-0 border-t border-dashed border-border" style={{ top: `${top}%` }} aria-hidden="true" />
          ))}
          <ol className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2">
            {maanden.map((m, i) => (
              <li key={m.maand} className="flex h-full flex-1 items-end justify-center">
                <button
                  type="button"
                  onMouseEnter={() => setAangewezen(i)}
                  onFocus={() => setAangewezen(i)}
                  onClick={() => setAangewezen(i)}
                  aria-label={`${maandLabel(m.maand, true)}: omzet ${formatBedrag(m.omzet)}, kosten ${formatBedrag(m.kosten)}`}
                  className="flex h-full w-full max-w-12 items-end justify-center gap-0.5"
                >
                  {[
                    { waarde: m.omzet, kleur: "bg-accent" },
                    { waarde: m.kosten, kleur: "bg-neutral/45" },
                  ].map((staaf, j) => (
                    <span
                      key={j}
                      className={cn(
                        "p-groei-y w-1/2 rounded-t-[4px] transition-opacity duration-150",
                        staaf.kleur,
                        i !== gekozen && "opacity-45",
                      )}
                      style={{ animationDelay: `${i * 30}ms`, height: `${(Math.max(0, staaf.waarde) / max) * 100}%`, minHeight: staaf.waarde > 0 ? 3 : 0 }}
                    />
                  ))}
                </button>
              </li>
            ))}
          </ol>
          {maand && (
            <div
              key={gekozen}
              className="p-vervaag pointer-events-none absolute top-1 z-10 w-max rounded-lg bg-foreground px-3 py-2 text-[13px] text-background shadow-md"
              style={
                gekozen >= maanden.length / 2
                  ? { right: `${((maanden.length - gekozen) / maanden.length) * 100}%` }
                  : { left: `${((gekozen + 1) / maanden.length) * 100}%` }
              }
            >
              <p className="text-xs opacity-70 first-letter:uppercase">{maandLabel(maand.maand, true)}</p>
              <p className="mt-1 tabular-nums">Omzet {formatBedrag(maand.omzet)}</p>
              <p className="tabular-nums opacity-80">Kosten {formatBedrag(maand.kosten)}</p>
              <p className="mt-1 font-medium tabular-nums">Winst {formatBedrag(maand.winst)}</p>
            </div>
          )}
        </div>
        <span />
        <ol className="mt-2 flex justify-between gap-1 text-center text-xs text-muted-foreground sm:gap-2" aria-hidden="true">
          {maanden.map((m, i) => (
            <li key={m.maand} className={cn("flex-1 truncate", i === gekozen && "font-medium text-foreground")}>
              {maandLabel(m.maand)}
            </li>
          ))}
        </ol>
      </div>
      <ul className="mt-4 flex gap-4 text-[13px] text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
          Omzet
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-neutral/45" />
          Kosten
        </li>
      </ul>
    </div>
  );
};

/**
 * Moneybird geeft bij sommige rekeningen een lege naam terug. Dan het soort
 * rekening, zodat er niet alleen een los bedrag staat.
 */
const rekeningNaam = (r: { naam: string; soort: string }) => {
  if (r.naam.trim()) return r.naam;
  if (/bank/i.test(r.soort)) return "Bankrekening";
  if (/cash|kas/i.test(r.soort)) return "Kas";
  if (/credit/i.test(r.soort)) return "Creditcard";
  return "Rekening";
};


/**
 * Financiën: de stand uit Moneybird in één scherm. Omzet, kosten en winst
 * per maand, wat klanten nog moeten betalen, wat jullie zelf nog moeten
 * betalen, en het banksaldo. Alleen lezen; boeken, de bankkoppeling en de
 * btw-aangifte blijven in Moneybird.
 */
const Financien = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useFinancien();
  const { verborgen: saldoVerborgen } = useSaldoVerborgen();

  const cijfers = useMemo(() => {
    if (!data || !("bijgewerkt" in data) || !heeftData(data.winstVerlies)) return null;
    const maanden = data.winstVerlies.data;
    const deze = maanden[maanden.length - 1];
    const vorige = maanden[maanden.length - 2];
    const jaar = String(new Date().getFullYear());
    const ditJaar = maanden.filter((m) => m.maand.startsWith(jaar));
    return {
      maanden,
      omzet: deze?.omzet ?? 0,
      omzetVerschil: vorige && vorige.omzet > 0 ? (((deze?.omzet ?? 0) - vorige.omzet) / vorige.omzet) * 100 : null,
      kosten: deze?.kosten ?? 0,
      winstJaar: ditJaar.reduce((som, m) => som + m.winst, 0),
    };
  }, [data]);

  const facturen = useMemo(
    () =>
      data && "bijgewerkt" in data && heeftData(data.facturen)
        ? [...data.facturen.data].sort((a, b) => (a.vervaldatum ?? "").localeCompare(b.vervaldatum ?? ""))
        : [],
    [data],
  );
  const factuurLijst = useOpenFacturen(facturen);

  const kop = (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl tracking-tight">Financiën</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Uit Moneybird
          {data && "bijgewerkt" in data && ` · bijgewerkt om ${format(new Date(data.bijgewerkt), "HH:mm")}`}
        </p>
      </div>
      {data && "bijgewerkt" in data && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9" disabled={isFetching} onClick={() => void refetch()}>
            <RotateCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            Vernieuwen
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9">
            <a href={data.moneybirdUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open Moneybird
            </a>
          </Button>
        </div>
      )}
    </div>
  );

  // Standen waarin er (nog) niets te tonen is.
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        {kop}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[84px] rounded-[14px]" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-[16px]" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        {kop}
        <EmptyState
          icon={RotateCw}
          title="De financiële gegevens konden niet geladen worden"
          description={error instanceof Error ? error.message : undefined}
          action={
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Opnieuw
            </Button>
          }
        />
      </div>
    );
  }
  if ("nietLive" in data) {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        {kop}
        <EmptyState
          icon={Wallet}
          title="De koppeling met Moneybird staat nog niet live"
          description="De serverfunctie moneybird-financien is niet bereikbaar: hij moet nog door Lovable worden uitgerold (of je bent offline). Daarna verschijnen hier je cijfers."
        />
      </div>
    );
  }
  if (!data.ingesteld) {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        {kop}
        <EmptyState
          icon={Wallet}
          title="Moneybird is nog niet gekoppeld"
          description="Voeg de secrets MONEYBIRD_API_TOKEN en MONEYBIRD_ADMINISTRATIE_ID toe in Lovable (Cloud, Secrets). Daarna verschijnen hier je cijfers."
        />
      </div>
    );
  }

  const openTotaal = facturen.reduce((som, f) => som + f.open, 0);
  const teLaat = facturen.filter(isTeLaatFactuur);

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      {kop}

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Cijfer label="Omzet deze maand" waarde={cijfers ? formatBedrag(cijfers.omzet, 0) : "–"} verschil={cijfers?.omzetVerschil ?? null} />
        <Cijfer label="Kosten deze maand" waarde={cijfers ? formatBedrag(cijfers.kosten, 0) : "–"} />
        <Cijfer label={`Winst ${new Date().getFullYear()}`} waarde={cijfers ? formatBedrag(cijfers.winstJaar, 0) : "–"} />
        <Cijfer
          label="Banksaldo"
          waarde={!heeftData(data.bank) ? "–" : saldoVerborgen ? VERBORGEN : formatBedrag(data.bank.data.totaal, 0)}
          knop={<OogKnop className="-mr-1.5" />}
        />
      </dl>

      <Panel>
        <PanelHeader icon={TrendingUp} titel="Omzet en kosten" subtitel="Per maand, de laatste twaalf maanden" />
        <PanelBody>
          {heeftData(data.winstVerlies) ? (
            data.winstVerlies.data.length > 0 ? (
              <MaandGrafiek maanden={data.winstVerlies.data} />
            ) : (
              <p className="text-sm text-muted-foreground">Nog geen boekingen in deze periode.</p>
            )
          ) : (
            <p className={cn("text-sm", TOON.danger.tekst)}>{data.winstVerlies.fout}</p>
          )}
        </PanelBody>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel>
          <PanelHeader
            icon={FileText}
            titel="Openstaande facturen"
            subtitel={
              heeftData(data.facturen)
                ? `${formatBedrag(openTotaal)} open${teLaat.length > 0 ? `, ${teLaat.length} te laat` : ""}`
                : "Wat klanten nog moeten betalen"
            }
            actie={factuurLijst.herinnerAlles}
          />
          <PanelBody className="px-2 pb-2 pt-2">
            {!heeftData(data.facturen) ? (
              <p className={cn("px-2 py-2 text-sm", TOON.danger.tekst)}>{data.facturen.fout}</p>
            ) : facturen.length === 0 ? (
              <EmptyState compact icon={FileText} title="Alles is betaald" description="Er staan geen facturen open." />
            ) : (
              factuurLijst.lijst
            )}
          </PanelBody>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader icon={Landmark} titel="Bank" subtitel="Saldo per rekening" actie={<OogKnop />} />
            <PanelBody>
              {!heeftData(data.bank) ? (
                <p className={cn("text-sm", TOON.danger.tekst)}>{data.bank.fout}</p>
              ) : data.bank.data.rekeningen.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen rekeningen gevonden.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.bank.data.rekeningen.map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-3">
                      <span className="truncate">{rekeningNaam(r)}</span>
                      <span className="font-medium tabular-nums">{saldoVerborgen ? VERBORGEN : formatBedrag(r.saldo)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>

          {data.btw && (
            <Panel>
              <PanelHeader icon={Percent} titel="Btw" subtitel="Af te dragen volgens Moneybird" />
              <PanelBody>
                {!heeftData(data.btw) ? (
                  <p className={cn("text-sm", TOON.danger.tekst)}>{data.btw.fout}</p>
                ) : (
                  <ul className="space-y-3 text-sm">
                    {data.btw.data.map((q) => {
                      const dagen = daysUntil(q.deadline);
                      const dringend = !q.lopend && dagen !== null && dagen >= 0 && dagen <= 14;
                      return (
                        <li key={q.label} className="flex items-baseline justify-between gap-3">
                          <span className="min-w-0">
                            <span className="block font-medium">
                              {q.label}
                              {q.lopend && <span className="font-normal text-muted-foreground"> tot nu toe</span>}
                            </span>
                            <span className={cn("block text-[13px] text-muted-foreground", dringend && TOON.warning.tekst)}>
                              {q.lopend
                                ? `Aangifte uiterlijk ${format(parseISO(q.deadline), "d MMMM", { locale: nl })}`
                                : `Aangeven en betalen uiterlijk ${format(parseISO(q.deadline), "d MMMM", { locale: nl })}`}
                            </span>
                          </span>
                          <span className="text-right font-medium tabular-nums">
                            {formatBedrag(Math.abs(q.afdragen))}
                            {q.afdragen < 0 && <span className="block text-[13px] font-normal text-muted-foreground">terug</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </PanelBody>
            </Panel>
          )}

          <Panel>
            <PanelHeader icon={Wallet} titel="Nog te betalen" subtitel="Openstaand bij leveranciers" />
            <PanelBody>
              {!heeftData(data.crediteuren) ? (
                <p className={cn("text-sm", TOON.danger.tekst)}>{data.crediteuren.fout}</p>
              ) : (
                <p className="font-epilogue text-2xl font-medium tabular-nums">{formatBedrag(data.crediteuren.data.totaal)}</p>
              )}
            </PanelBody>
          </Panel>
        </div>
      </div>

      <p className="text-[13px] text-muted-foreground">
        Boeken, de bankkoppeling en de btw-aangifte doe je in Moneybird; hier zie je de stand en handel je openstaande
        facturen af.
      </p>
      {factuurLijst.dialogen}
    </div>
  );
};

export default Financien;
