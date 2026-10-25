import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  FileSignature,
  FileText,
  Landmark,
  Percent,
  Plus,
  Receipt,
  RotateCw,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import BtwTab from "@/admin/components/BtwTab";
import EmptyState from "@/admin/components/EmptyState";
import OmzetTab from "@/admin/components/OmzetTab";
import { TOON } from "@/admin/constants";
import { daysUntil } from "@/admin/format";
import {
  heeftData,
  isTeLaatFactuur,
  useFinancien,
  type MaandCijfers,
} from "@/admin/financien";
import { useOpenFacturen } from "@/admin/useOpenFacturen";
import {
  BetalingenPanel,
  OuderdomPanel,
  UitgavenPanel,
} from "@/admin/components/FinancienPanelen";
import OffertesPanel from "@/admin/components/OffertesPanel";
import DocumentOpstellen from "@/admin/components/DocumentOpstellen";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import OogKnop from "@/admin/ui/OogKnop";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

const TABBLADEN = [
  { waarde: "overzicht", label: "Overzicht" },
  { waarde: "omzet", label: "Omzet" },
  { waarde: "btw", label: "Btw" },
];

const maandLabel = (maand: string, lang = false) =>
  format(parseISO(`${maand}-01`), lang ? "LLLL yyyy" : "LLL", {
    locale: nl,
  }).replace(".", "");

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
        <span className="font-epilogue text-2xl font-medium tabular-nums tracking-tight">
          {waarde}
        </span>
      )}
      {!laden && verschil != null && Number.isFinite(verschil) && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[13px] font-medium",
            verschil > 0
              ? TOON.success.tekst
              : verschil < 0
                ? TOON.danger.tekst
                : "text-muted-foreground",
          )}
        >
          {verschil > 0 ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : verschil < 0 ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : null}
          {Math.abs(Math.round(verschil))}%
        </span>
      )}
    </dd>
  </div>
);

/** Omzet en kosten per maand naast elkaar; de gekozen maand toont ook de winst. */
const MaandGrafiek = ({ maanden }: { maanden: MaandCijfers[] }) => {
  const { bedrag, verborgen } = useBedragenVerborgen();
  const [aangewezen, setAangewezen] = useState<number | null>(null);
  const max = asMaximum(
    Math.max(...maanden.flatMap((m) => [m.omzet, m.kosten])),
  );
  const gekozen = aangewezen ?? maanden.length - 1;
  const maand = maanden[gekozen];

  return (
    <div>
      <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2">
        <div
          className="relative h-52 text-right text-xs tabular-nums text-muted-foreground"
          aria-hidden="true"
        >
          {[max, max / 2, 0].map((waarde, i) => (
            <span
              key={i}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${i * 50}%` }}
            >
              {verborgen ? "" : bedrag(waarde, 0)}
            </span>
          ))}
        </div>
        <div className="relative h-52" onMouseLeave={() => setAangewezen(null)}>
          {[0, 50, 100].map((top) => (
            <span
              key={top}
              className="absolute inset-x-0 border-t border-dashed border-border"
              style={{ top: `${top}%` }}
              aria-hidden="true"
            />
          ))}
          <ol className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2">
            {maanden.map((m, i) => (
              <li
                key={m.maand}
                className="flex h-full flex-1 items-end justify-center"
              >
                <button
                  type="button"
                  onMouseEnter={() => setAangewezen(i)}
                  onFocus={() => setAangewezen(i)}
                  onClick={() => setAangewezen(i)}
                  aria-label={`${maandLabel(m.maand, true)}: omzet ${bedrag(m.omzet)}, kosten ${bedrag(m.kosten)}`}
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
                      style={{
                        animationDelay: `${i * 30}ms`,
                        height: `${(Math.max(0, staaf.waarde) / max) * 100}%`,
                        minHeight: staaf.waarde > 0 ? 3 : 0,
                      }}
                    />
                  ))}
                </button>
              </li>
            ))}
          </ol>
          {maand && (
            <div
              key={gekozen}
              className="p-vervaag pointer-events-none absolute top-1 z-10 w-max rounded-lg bg-foreground px-3 py-2 text-[13px] text-background"
              style={
                gekozen >= maanden.length / 2
                  ? {
                      right: `${((maanden.length - gekozen) / maanden.length) * 100}%`,
                    }
                  : { left: `${((gekozen + 1) / maanden.length) * 100}%` }
              }
            >
              <p className="text-xs opacity-70 first-letter:uppercase">
                {maandLabel(maand.maand, true)}
              </p>
              <p className="mt-1 tabular-nums">Omzet {bedrag(maand.omzet)}</p>
              <p className="tabular-nums opacity-80">
                Kosten {bedrag(maand.kosten)}
              </p>
              <p className="mt-1 font-medium tabular-nums">
                Winst {bedrag(maand.winst)}
              </p>
            </div>
          )}
        </div>
        <span />
        <ol
          className="mt-2 flex justify-between gap-1 text-center text-xs text-muted-foreground sm:gap-2"
          aria-hidden="true"
        >
          {maanden.map((m, i) => (
            <li
              key={m.maand}
              className={cn(
                "flex-1 truncate",
                i === gekozen && "font-medium text-foreground",
              )}
            >
              {/* Op een smal scherm alleen de eerste letter, anders worden de namen afgekapt. */}
              <span className="sm:hidden">{maandLabel(m.maand).charAt(0)}</span>
              <span className="max-sm:hidden">{maandLabel(m.maand)}</span>
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
  const { data, isLoading, isError, error, refetch } = useFinancien();
  const qc = useQueryClient();
  const bezigMetVernieuwen =
    useIsFetching({ queryKey: ["admin", "financien"] }) > 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const [nieuwDocument, setNieuwDocument] = useState<"offerte" | "factuur" | null>(null);
  const tab = TABBLADEN.some((t) => t.waarde === searchParams.get("tab"))
    ? searchParams.get("tab")!
    : "overzicht";
  const { bedrag, verborgen } = useBedragenVerborgen();

  const cijfers = useMemo(() => {
    if (!data || !("bijgewerkt" in data) || !heeftData(data.winstVerlies))
      return null;
    const maanden = data.winstVerlies.data;
    const deze = maanden[maanden.length - 1];
    const vorige = maanden[maanden.length - 2];
    const jaar = String(new Date().getFullYear());
    const ditJaar = maanden.filter((m) => m.maand.startsWith(jaar));
    return {
      maanden,
      omzet: deze?.omzet ?? 0,
      omzetVerschil:
        vorige && vorige.omzet > 0
          ? (((deze?.omzet ?? 0) - vorige.omzet) / vorige.omzet) * 100
          : null,
      kosten: deze?.kosten ?? 0,
      winstJaar: ditJaar.reduce((som, m) => som + m.winst, 0),
    };
  }, [data]);

  const facturen = useMemo(
    () =>
      data && "bijgewerkt" in data && heeftData(data.facturen)
        ? [...data.facturen.data].sort((a, b) =>
            (a.vervaldatum ?? "").localeCompare(b.vervaldatum ?? ""),
          )
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
          {data &&
            "bijgewerkt" in data &&
            ` · bijgewerkt om ${format(new Date(data.bijgewerkt), "HH:mm")}`}
        </p>
      </div>
      {data && "bijgewerkt" in data && (
        <div className="flex flex-wrap gap-2">
          <OogKnop className="h-9 w-9 border border-border bg-background" />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-9">
                <Plus className="h-4 w-4" />
                Nieuw
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => setNieuwDocument("offerte")}>
                <FileSignature />
                Offerte
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setNieuwDocument("factuur")}>
                <Receipt />
                Factuur
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DocumentOpstellen
            open={nieuwDocument !== null}
            onOpenChange={(o) => !o && setNieuwDocument(null)}
            soort={nieuwDocument ?? "offerte"}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-9 max-sm:w-9 max-sm:px-0"
            aria-label="Vernieuwen"
            disabled={bezigMetVernieuwen}
            // Alles uit Moneybird opnieuw: het overzicht én de tabbladen Omzet
            // en Btw met de bank, die anders nog even hun bewaarde stand tonen.
            onClick={() =>
              void qc.invalidateQueries({ queryKey: ["admin", "financien"] })
            }
          >
            <RotateCw
              className={cn("h-4 w-4", bezigMetVernieuwen && "animate-spin")}
            />
            <span className="max-sm:hidden">Vernieuwen</span>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 max-sm:w-9 max-sm:px-0"
          >
            <a
              href={data.moneybirdUrl}
              aria-label="Open Moneybird"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="max-sm:hidden">Open Moneybird</span>
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

      <Tabs
        value={tab}
        onValueChange={(waarde) =>
          setSearchParams(waarde === "overzicht" ? {} : { tab: waarde }, {
            replace: true,
          })
        }
      >
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
          {TABBLADEN.map((t) => (
            <TabsTrigger
              key={t.waarde}
              value={t.waarde}
              className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-0 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="omzet" className="mt-5">
          <OmzetTab />
        </TabsContent>

        <TabsContent value="btw" className="mt-5">
          <BtwTab
            moneybirdUrl={data.moneybirdUrl}
            nogTeVerwerken={
              data.uitgaven && heeftData(data.uitgaven)
                ? data.uitgaven.data.nogTeVerwerken
                : 0
            }
          />
        </TabsContent>

        <TabsContent value="overzicht" className="mt-5 space-y-5">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Cijfer
              label="Omzet deze maand"
              waarde={cijfers ? bedrag(cijfers.omzet, 0) : "–"}
              verschil={verborgen ? null : (cijfers?.omzetVerschil ?? null)}
            />
            <Cijfer
              label="Kosten deze maand"
              waarde={cijfers ? bedrag(cijfers.kosten, 0) : "–"}
            />
            <Cijfer
              label={`Winst ${new Date().getFullYear()}`}
              waarde={cijfers ? bedrag(cijfers.winstJaar, 0) : "–"}
            />
            <Cijfer
              label="Banksaldo"
              waarde={
                heeftData(data.bank) ? bedrag(data.bank.data.totaal, 0) : "–"
              }
            />
          </dl>

          <Panel>
            <PanelHeader
              icon={TrendingUp}
              titel="Omzet en kosten"
              subtitel="Per maand, de laatste twaalf maanden"
            />
            <PanelBody>
              {heeftData(data.winstVerlies) ? (
                data.winstVerlies.data.length > 0 ? (
                  <MaandGrafiek maanden={data.winstVerlies.data} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nog geen boekingen in deze periode.
                  </p>
                )
              ) : (
                <p className={cn("text-sm", TOON.danger.tekst)}>
                  {data.winstVerlies.fout}
                </p>
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
                    ? `${bedrag(openTotaal)} open${teLaat.length > 0 ? `, ${teLaat.length} te laat` : ""}`
                    : "Wat klanten nog moeten betalen"
                }
                actie={factuurLijst.herinnerAlles}
              />
              <PanelBody className="px-2 pb-2 pt-2">
                {!heeftData(data.facturen) ? (
                  <p className={cn("px-2 py-2 text-sm", TOON.danger.tekst)}>
                    {data.facturen.fout}
                  </p>
                ) : facturen.length === 0 ? (
                  <EmptyState
                    compact
                    icon={FileText}
                    title="Alles is betaald"
                    description="Er staan geen facturen open."
                  />
                ) : (
                  factuurLijst.lijst
                )}
              </PanelBody>
            </Panel>

            <div className="space-y-4">
              <Panel>
                <PanelHeader
                  icon={Landmark}
                  titel="Bank"
                  subtitel="Saldo per rekening"
                />
                <PanelBody>
                  {!heeftData(data.bank) ? (
                    <p className={cn("text-sm", TOON.danger.tekst)}>
                      {data.bank.fout}
                    </p>
                  ) : data.bank.data.rekeningen.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Geen rekeningen gevonden.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {data.bank.data.rekeningen.map((r, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="truncate">{rekeningNaam(r)}</span>
                          <span className="font-medium tabular-nums">
                            {bedrag(r.saldo)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </PanelBody>
              </Panel>

              {data.btw && (
                <Panel>
                  <PanelHeader
                    icon={Percent}
                    titel="Btw"
                    subtitel="Af te dragen volgens Moneybird"
                    actie={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-[13px]"
                        onClick={() =>
                          setSearchParams({ tab: "btw" }, { replace: true })
                        }
                      >
                        Details
                      </Button>
                    }
                  />
                  <PanelBody>
                    {!heeftData(data.btw) ? (
                      <p className={cn("text-sm", TOON.danger.tekst)}>
                        {data.btw.fout}
                      </p>
                    ) : (
                      <ul className="space-y-3 text-sm">
                        {data.btw.data.map((q) => {
                          const dagen = daysUntil(q.deadline);
                          const dringend =
                            !q.lopend &&
                            dagen !== null &&
                            dagen >= 0 &&
                            dagen <= 14;
                          return (
                            <li
                              key={q.label}
                              className="flex items-baseline justify-between gap-3"
                            >
                              <span className="min-w-0">
                                <span className="block font-medium">
                                  {q.label}
                                  {q.lopend && (
                                    <span className="font-normal text-muted-foreground">
                                      {" "}
                                      tot nu toe
                                    </span>
                                  )}
                                </span>
                                <span
                                  className={cn(
                                    "block text-[13px] text-muted-foreground",
                                    dringend && TOON.warning.tekst,
                                  )}
                                >
                                  {q.lopend
                                    ? `Aangifte uiterlijk ${format(parseISO(q.deadline), "d MMMM", { locale: nl })}`
                                    : `Aangeven en betalen uiterlijk ${format(parseISO(q.deadline), "d MMMM", { locale: nl })}`}
                                </span>
                              </span>
                              <span className="text-right font-medium tabular-nums">
                                {bedrag(Math.abs(q.afdragen))}
                                {q.afdragen < 0 && (
                                  <span className="block text-[13px] font-normal text-muted-foreground">
                                    terug
                                  </span>
                                )}
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
                <PanelHeader
                  icon={Wallet}
                  titel="Nog te betalen"
                  subtitel="Openstaand bij leveranciers"
                />
                <PanelBody>
                  {!heeftData(data.crediteuren) ? (
                    <p className={cn("text-sm", TOON.danger.tekst)}>
                      {data.crediteuren.fout}
                    </p>
                  ) : (
                    <p className="font-epilogue text-2xl font-medium tabular-nums">
                      {bedrag(data.crediteuren.data.totaal)}
                    </p>
                  )}
                </PanelBody>
              </Panel>
            </div>
          </div>

          {heeftData(data.facturen) && (
            <div className="grid gap-4 lg:grid-cols-2">
              <OuderdomPanel facturen={facturen} />
              {data.betalingen && (
                <BetalingenPanel betalingen={data.betalingen} />
              )}
            </div>
          )}

          {data.uitgaven && (
            <UitgavenPanel
              uitgaven={data.uitgaven}
              moneybirdUrl={data.moneybirdUrl}
            />
          )}

          {data.offertes && <OffertesPanel offertes={data.offertes} />}

          <p className="text-[13px] text-muted-foreground">
            Boeken, de bankkoppeling en de btw-aangifte doe je in Moneybird;
            hier zie je de stand en handel je openstaande facturen af.
          </p>
        </TabsContent>
      </Tabs>
      {factuurLijst.dialogen}
    </div>
  );
};

export default Financien;
