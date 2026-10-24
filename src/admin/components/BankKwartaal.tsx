import { useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronRight, Landmark } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TOON, type Toon } from "@/admin/constants";
import {
  useBankKwartaal,
  type BankGroep,
  type BankSoort,
} from "@/admin/financien";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

const SOORT: Record<BankSoort, { label: string; toon: Toon; uitleg: string }> =
  {
    "met-bon": {
      label: "Met bon",
      toon: "success",
      uitleg: "Gekoppeld aan een bon of factuur",
    },
    "zonder-bon": {
      label: "Zonder bon",
      toon: "warning",
      uitleg: "Wel geboekt, maar zonder bon erbij",
    },
    "niet-verwerkt": {
      label: "Niet verwerkt",
      toon: "danger",
      uitleg: "Nog helemaal niet geboekt",
    },
    "geen-kosten": {
      label: "Geen kosten",
      toon: "neutral",
      uitleg: "Privé, belasting of overboeking",
    },
  };

const VOLGORDE: BankSoort[] = [
  "met-bon",
  "zonder-bon",
  "niet-verwerkt",
  "geen-kosten",
];

const dag = (d: string) =>
  format(parseISO(d), "d MMM", { locale: nl }).replace(".", "");

/** Eén tegenpartij, open te klappen naar de losse afschrijvingen. */
const Groep = ({ groep }: { groep: BankGroep }) => {
  const [open, setOpen] = useState(false);
  const { bedrag } = useBedragenVerborgen();
  // De zwaarste soort bepaalt het label: niet verwerkt gaat voor zonder bon.
  const soort =
    VOLGORDE.slice()
      .reverse()
      .find((s) => s !== "geen-kosten" && groep.soorten.includes(s)) ??
    groep.soorten[0]!;

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="p-rij flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-90",
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{groep.naam}</span>
          <span className="block text-[13px] text-muted-foreground">
            {groep.aantal}{" "}
            {groep.aantal === 1 ? "afschrijving" : "afschrijvingen"}
          </span>
        </span>
        <StatusPill toon={SOORT[soort].toon}>{SOORT[soort].label}</StatusPill>
        <span className="w-24 shrink-0 text-right font-medium tabular-nums">
          {bedrag(groep.bedrag)}
        </span>
      </button>
      {open && (
        <ul className="p-vervaag mb-2 ml-9 mr-2 divide-y divide-border rounded-lg border border-border text-[13px]">
          {groep.transacties.map((t) => (
            <li key={t.id} className="flex items-baseline gap-3 px-3 py-2">
              <span className="w-12 shrink-0 tabular-nums text-muted-foreground">
                {dag(t.datum)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate">
                  {t.omschrijving ?? "Geen omschrijving"}
                </span>
                <span className="block text-muted-foreground">
                  {SOORT[t.soort].label}
                  {t.categorie && ` · ${t.categorie}`}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{bedrag(t.bedrag)}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Wat er in een kwartaal van de bankrekening is afgeschreven, en of daar een
 * bon bij zit. Zonder bon telt de btw niet mee als voorbelasting; de lijst
 * eronder is dus de lijst van bonnen die je nog moet opzoeken.
 */
const BankKwartaal = ({
  jaar,
  kwartaal,
  moneybirdUrl,
}: {
  jaar: number;
  kwartaal: number;
  moneybirdUrl: string;
}) => {
  const { data, isLoading, isError, error } = useBankKwartaal(jaar, kwartaal);
  const { bedrag, verborgen } = useBedragenVerborgen();
  const [geenKostenOpen, setGeenKostenOpen] = useState(false);
  const label = `Q${kwartaal} ${jaar}`;

  return (
    <Panel>
      <PanelHeader
        icon={Landmark}
        titel={`Bank in ${label}`}
        subtitel="Afschrijvingen, en of er een bon bij zit"
      />
      <PanelBody className="space-y-5">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : isError || !data ? (
          <p className={cn("text-sm", TOON.danger.tekst)}>
            {error instanceof Error ? error.message : "Laden mislukt"}
          </p>
        ) : data.afgeschreven.aantal === 0 ? (
          <p className="text-sm text-muted-foreground">
            Geen afschrijvingen in dit kwartaal.
          </p>
        ) : (
          <>
            <div
              className="flex h-2.5 overflow-hidden rounded-full bg-muted"
              aria-hidden="true"
            >
              {!verborgen &&
                VOLGORDE.map((s) => {
                  const deel = {
                    "met-bon": data.metBon,
                    "zonder-bon": data.zonderBon,
                    "niet-verwerkt": data.nietVerwerkt,
                    "geen-kosten": data.geenKosten,
                  }[s];
                  return deel.bedrag > 0 ? (
                    <span
                      key={s}
                      className={cn(
                        "h-full border-r-2 border-card last:border-r-0",
                        TOON[SOORT[s].toon].stip,
                      )}
                      style={{
                        width: `${(deel.bedrag / data.afgeschreven.bedrag) * 100}%`,
                      }}
                    />
                  ) : null;
                })}
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              {VOLGORDE.map((s) => {
                const deel = {
                  "met-bon": data.metBon,
                  "zonder-bon": data.zonderBon,
                  "niet-verwerkt": data.nietVerwerkt,
                  "geen-kosten": data.geenKosten,
                }[s];
                return (
                  <div key={s}>
                    <dt className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          TOON[SOORT[s].toon].stip,
                        )}
                        aria-hidden="true"
                      />
                      {SOORT[s].label}
                    </dt>
                    <dd className="mt-0.5 font-medium tabular-nums">
                      {bedrag(deel.bedrag, 0)}
                    </dd>
                    <dd className="text-[12px] text-muted-foreground">
                      {deel.aantal}{" "}
                      {deel.aantal === 1 ? "afschrijving" : "afschrijvingen"}
                    </dd>
                  </div>
                );
              })}
            </dl>

            {data.teControleren.length === 0 ? (
              <p className={cn("text-sm", TOON.success.tekst)}>
                Bij alle kosten in dit kwartaal zit een bon.
              </p>
            ) : (
              <div>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="p-kaarttitel">Bonnen die ontbreken</h3>
                  <a
                    href={moneybirdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-muted-foreground underline hover:text-foreground"
                  >
                    Open Moneybird
                  </a>
                </div>
                <p className="mb-2 text-[13px] text-muted-foreground">
                  Voor{" "}
                  {bedrag(data.zonderBon.bedrag + data.nietVerwerkt.bedrag)} aan
                  afschrijvingen staat geen bon in Moneybird, dus de btw daarop
                  telt niet mee. Zoek de bon op en koppel hem aan de
                  afschrijving.
                </p>
                <ul className="-mx-2">
                  {data.teControleren.map((g) => (
                    <Groep key={g.naam} groep={g} />
                  ))}
                </ul>
              </div>
            )}

            {data.geenKostenLijst.length > 0 && (
              <div className="border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setGeenKostenOpen((o) => !o)}
                  aria-expanded={geenKostenOpen}
                  className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      geenKostenOpen && "rotate-90",
                    )}
                  />
                  Geen kosten: {data.geenKosten.aantal}{" "}
                  {data.geenKosten.aantal === 1
                    ? "afschrijving"
                    : "afschrijvingen"}{" "}
                  (privé, belasting, overboekingen)
                </button>
                {geenKostenOpen && (
                  <ul className="-mx-2 mt-2">
                    {data.geenKostenLijst.map((g) => (
                      <Groep key={g.naam} groep={g} />
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </PanelBody>
    </Panel>
  );
};

export default BankKwartaal;
