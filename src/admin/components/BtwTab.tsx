import { useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Info, Percent, Receipt } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import BankKwartaal from "@/admin/components/BankKwartaal";
import { cn } from "@/lib/utils";
import { TOON, type Toon } from "@/admin/constants";
import { daysUntil } from "@/admin/format";
import { useBtwOverzicht, type BtwKwartaalDetail } from "@/admin/financien";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

/** De rubrieken zoals ze op de btw-aangifte van de Belastingdienst heten. */
const RUBRIEK: Record<string, string> = {
  "1a": "Leveringen en diensten belast met hoog tarief",
  "1b": "Leveringen en diensten belast met laag tarief",
  "1c": "Leveringen en diensten belast met overige tarieven",
  "1d": "Privégebruik",
  "1e": "Leveringen en diensten belast met 0% of niet bij u belast",
  "2a": "Verleggingsregelingen binnenland",
  "3a": "Leveringen naar landen buiten de EU",
  "3b": "Leveringen naar of diensten in landen binnen de EU",
  "3c": "Installatie en afstandsverkopen binnen de EU",
  "4a": "Leveringen en diensten uit landen buiten de EU",
  "4b": "Leveringen en diensten uit landen binnen de EU",
  "5b": "Voorbelasting",
};

const datum = (d: string, jaar = false) =>
  format(parseISO(d), jaar ? "d MMMM yyyy" : "d MMMM", { locale: nl });

/** Waar een kwartaal staat: loopt nog, aangifte doen, of de termijn is voorbij. */
function stand(q: BtwKwartaalDetail): {
  label: string;
  toon: Toon;
  uitleg: string;
} {
  if (q.lopend)
    return {
      label: "Loopt nog",
      toon: "info",
      uitleg: `Aangifte uiterlijk ${datum(q.deadline, true)}`,
    };
  const dagen = daysUntil(q.deadline) ?? 0;
  if (dagen >= 0) {
    return {
      label:
        dagen === 0
          ? "Vandaag aangeven"
          : `Nog ${dagen} ${dagen === 1 ? "dag" : "dagen"}`,
      toon: dagen <= 14 ? "warning" : "neutral",
      uitleg: `Aangeven en betalen uiterlijk ${datum(q.deadline, true)}`,
    };
  }
  return {
    label: "Termijn voorbij",
    toon: "neutral",
    uitleg: `Uiterste datum was ${datum(q.deadline, true)}`,
  };
}

/**
 * Btw per kwartaal: wat je verschuldigd bent, wat je als voorbelasting
 * terugkrijgt en wat er per saldo af moet, met de rubrieken zoals op de
 * aangifte. Of een aangifte al gedaan is weet het portaal niet; dat zie je in
 * Moneybird.
 */
const BtwTab = ({
  nogTeVerwerken,
  moneybirdUrl,
}: {
  nogTeVerwerken: number;
  moneybirdUrl: string;
}) => {
  const { data, isLoading, isError, error } = useBtwOverzicht(true);
  const { bedrag } = useBedragenVerborgen();
  const [gekozen, setGekozen] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Skeleton className="h-80 rounded-[16px]" />
        <Skeleton className="h-80 rounded-[16px]" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <p className={cn("text-sm", TOON.danger.tekst)}>
        {error instanceof Error ? error.message : "Laden mislukt"}
      </p>
    );
  }

  // Kwartalen zonder enige boeking (van voor de administratie) weglaten, behalve het lopende.
  const kwartalen = data.kwartalen.filter(
    (k) =>
      k.lopend || k.rubrieken.length > 0 || (k.nietVerwerkt?.aantal ?? 0) > 0,
  );
  // Standaard het kwartaal waarvan de aangifte nu openstaat, anders het lopende.
  const standaard =
    kwartalen.find((q) => !q.lopend && (daysUntil(q.deadline) ?? -1) >= 0) ??
    kwartalen[0];
  const q = kwartalen.find((k) => k.label === gekozen) ?? standaard;
  if (!q)
    return (
      <p className="text-sm text-muted-foreground">
        Nog geen btw-gegevens in Moneybird.
      </p>
    );
  const s = stand(q);
  const verschuldigd = q.rubrieken.filter((r) => !r.voorbelasting);
  const voorbelasting = q.rubrieken.filter((r) => r.voorbelasting);

  const rij = (r: (typeof q.rubrieken)[number]) => {
    // Verlegde btw staat in twee rubrieken tegelijk ("NL/4b, NL/5b"): verschuldigd én terug te vragen.
    const codes = r.rubriek
      .replace(/NL\//gi, "")
      .split(/\s*,\s*/)
      .filter(Boolean);
    return (
      <tr key={`${r.rubriek}|${r.naam}`}>
        <td className="w-16 whitespace-nowrap px-4 py-2.5 align-top font-medium tabular-nums">
          {codes.join(" en ")}
        </td>
        <td className="px-4 py-2.5 align-top">
          <span className="block">
            {RUBRIEK[codes[0]?.toLowerCase() ?? ""] ?? r.naam}
          </span>
          {r.naam && (
            <span className="block text-[13px] text-muted-foreground">
              {r.naam}
            </span>
          )}
        </td>
        <td className="px-4 py-2.5 text-right align-top tabular-nums text-muted-foreground">
          {bedrag(r.grondslag)}
        </td>
        <td className="px-4 py-2.5 text-right align-top font-medium tabular-nums">
          {bedrag(r.btw)}
        </td>
      </tr>
    );
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Panel>
        <PanelHeader
          icon={Percent}
          titel="Kwartalen"
          subtitel="Dit jaar en vorig jaar"
        />
        <PanelBody className="px-2 pb-2 pt-2">
          <ul role="listbox" aria-label="Kwartaal">
            {kwartalen.map((k) => {
              const ks = stand(k);
              const actief = k.label === q.label;
              return (
                <li key={k.label}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={actief}
                    onClick={() => setGekozen(k.label)}
                    className={cn(
                      "p-rij flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm",
                      actief && "bg-muted",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{k.label}</span>
                      <span
                        className={cn(
                          "block text-[13px] text-muted-foreground",
                          ks.toon === "warning" && TOON.warning.tekst,
                        )}
                      >
                        {ks.label}
                        {(k.nietVerwerkt?.aantal ?? 0) > 0 &&
                          ` · ${k.nietVerwerkt!.aantal} niet verwerkt`}
                      </span>
                    </span>
                    <span className="text-right font-medium tabular-nums">
                      {bedrag(Math.abs(k.afdragen))}
                      {k.afdragen < 0 && (
                        <span className="block text-[12px] font-normal text-muted-foreground">
                          terug
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </PanelBody>
      </Panel>

      <div className="space-y-4">
        <Panel>
          <PanelHeader
            icon={Receipt}
            titel={q.label}
            subtitel={s.uitleg}
            actie={<StatusPill toon={s.toon}>{s.label}</StatusPill>}
          />
          <PanelBody className="space-y-5">
            <dl className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Verschuldigd",
                  uitleg: "Btw op je eigen facturen",
                  waarde: bedrag(q.verschuldigd),
                },
                {
                  label: "Voorbelasting",
                  uitleg: "Btw die jij betaalde op je kosten",
                  waarde: bedrag(q.voorbelasting),
                },
                {
                  label: q.afdragen < 0 ? "Terug te krijgen" : "Af te dragen",
                  uitleg: "Verschuldigd min voorbelasting",
                  waarde: bedrag(Math.abs(q.afdragen)),
                  nadruk: true,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className={cn(
                    "rounded-xl border border-border px-3 py-3",
                    c.nadruk && "bg-muted/50",
                  )}
                >
                  <dt className="text-[13px] text-muted-foreground">
                    {c.label}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1 tabular-nums",
                      c.nadruk
                        ? "font-epilogue text-xl font-medium"
                        : "text-base font-medium",
                    )}
                  >
                    {c.waarde}
                  </dd>
                  <dd className="mt-1 text-[12px] leading-snug text-muted-foreground">
                    {c.uitleg}
                  </dd>
                </div>
              ))}
            </dl>

            {q.rubrieken.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Geen btw geboekt in dit kwartaal.
              </p>
            ) : (
              <div className="-mx-4 overflow-x-auto border-t border-border">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="text-left text-[13px] text-muted-foreground">
                    <tr className="border-b border-border">
                      <th scope="col" className="px-4 py-2.5 font-normal">
                        Rubriek
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-normal">
                        Omschrijving
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2.5 text-right font-normal"
                      >
                        Grondslag
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2.5 text-right font-normal"
                      >
                        Btw
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {verschuldigd.map(rij)}
                    {voorbelasting.length > 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="bg-muted/40 px-4 py-1.5 text-[13px] text-muted-foreground"
                        >
                          Wat je terugkrijgt
                        </td>
                      </tr>
                    )}
                    {voorbelasting.map(rij)}
                  </tbody>
                </table>
              </div>
            )}
          </PanelBody>
        </Panel>

        {q.nietVerwerkt
          ? q.nietVerwerkt.aantal > 0 && (
              <div
                className={cn(
                  "flex gap-2 rounded-lg border px-3 py-2.5 text-[13px]",
                  TOON.warning.cel,
                )}
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p>
                    <span className="font-medium">
                      {q.nietVerwerkt.aantal}{" "}
                      {q.nietVerwerkt.aantal === 1 ? "document" : "documenten"}{" "}
                      uit {q.label} nog niet verwerkt.
                    </span>{" "}
                    {q.nietVerwerkt.btw > 0 && (
                      <>
                        Daarop staat ongeveer {bedrag(q.nietVerwerkt.btw)}{" "}
                        Nederlandse btw die nog niet als voorbelasting meetelt.{" "}
                        {q.afdragen - q.nietVerwerkt.btw >= 0
                          ? `Verwerk je ze, dan valt het af te dragen bedrag rond ${bedrag(q.afdragen - q.nietVerwerkt.btw)} uit. `
                          : `Verwerk je ze, dan krijg je over dit kwartaal rond ${bedrag(q.nietVerwerkt.btw - q.afdragen)} terug. `}
                      </>
                    )}
                    {(q.nietVerwerkt.buitenland ?? 0) > 0 &&
                      `${q.nietVerwerkt.buitenland} ${q.nietVerwerkt.buitenland === 1 ? "is een buitenlandse bon" : "zijn buitenlandse bonnen"}; die buitenlandse btw vraag je niet terug via deze aangifte en telt hier niet mee. `}
                    {q.nietVerwerkt.zonderBedrag > 0 &&
                      `${q.nietVerwerkt.zonderBedrag} ${q.nietVerwerkt.zonderBedrag === 1 ? "is" : "zijn"} nog niet uitgelezen, dus daar staat nog geen bedrag bij. `}
                    <a
                      href={`${moneybirdUrl}/documents`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline"
                    >
                      Verwerken in Moneybird
                    </a>
                  </p>
                  {(q.nietVerwerkt.documenten?.length ?? 0) > 0 && (
                    <details className="group mt-2">
                      <summary className="cursor-pointer select-none font-medium">
                        Welke documenten
                      </summary>
                      <ul className="mt-2 divide-y divide-current/10">
                        {q.nietVerwerkt.documenten!.map((d) => (
                          <li key={d.id}>
                            <a
                              href={d.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-baseline gap-3 py-1.5 hover:underline"
                            >
                              <span className="w-14 shrink-0 tabular-nums opacity-80">
                                {format(parseISO(d.datum), "d MMM", {
                                  locale: nl,
                                }).replace(".", "")}
                              </span>
                              <span className="min-w-0 flex-1 truncate">
                                {d.leverancier}
                              </span>
                              <span className="shrink-0 tabular-nums">
                                {d.valuta
                                  ? `${d.valuta} ${d.bedrag.toLocaleString("nl-NL", { maximumFractionDigits: 2 })}`
                                  : bedrag(d.bedrag)}
                              </span>
                              <span className="w-24 shrink-0 text-right tabular-nums opacity-80">
                                {d.valuta
                                  ? "buitenland"
                                  : d.btw > 0
                                    ? `btw ${bedrag(d.btw)}`
                                    : "geen btw"}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            )
          : nogTeVerwerken > 0 && (
              <p
                className={cn(
                  "flex gap-2 rounded-lg border px-3 py-2.5 text-[13px]",
                  TOON.warning.cel,
                )}
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Er{" "}
                  {nogTeVerwerken === 1
                    ? "wacht 1 document"
                    : `wachten ${nogTeVerwerken} documenten`}{" "}
                  in Moneybird op verwerking. De btw daarop telt nog niet mee
                  als voorbelasting, dus het bedrag dat je moet afdragen valt
                  waarschijnlijk lager uit zodra ze verwerkt zijn.
                </span>
              </p>
            )}

        <BankKwartaal
          jaar={q.jaar}
          kwartaal={q.kwartaal}
          moneybirdUrl={moneybirdUrl}
        />

        <p className="text-[13px] text-muted-foreground">
          Bedragen volgens wat er in Moneybird is geboekt. De aangifte zelf doe
          je in Moneybird; of die al gedaan is, ziet het portaal niet.
        </p>
      </div>
    </div>
  );
};

export default BtwTab;
