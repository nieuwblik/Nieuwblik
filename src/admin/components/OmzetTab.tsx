import { useState } from "react";
import { ArrowDown, ArrowUp, BarChart3, CalendarRange } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { useOmzetHistorie, type OmzetJaar } from "@/admin/financien";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

type Maat = "omzet" | "winst" | "kosten";

const MATEN: { waarde: Maat; label: string }[] = [
  { waarde: "omzet", label: "Omzet" },
  { waarde: "winst", label: "Winst" },
  { waarde: "kosten", label: "Kosten" },
];

/** Procentueel verschil, of null als er niets te vergelijken valt. */
const groei = (nu: number, toen: number | undefined) =>
  toen === undefined || toen === 0 ? null : ((nu - toen) / Math.abs(toen)) * 100;

const Verschil = ({ procent }: { procent: number | null }) => {
  const { verborgen } = useBedragenVerborgen();
  if (procent === null || verborgen || !Number.isFinite(procent)) return null;
  const rond = Math.round(procent);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[12px] font-medium tabular-nums",
        rond > 0 ? TOON.success.tekst : rond < 0 ? TOON.danger.tekst : "text-muted-foreground",
      )}
    >
      {rond > 0 ? <ArrowUp className="h-3 w-3" /> : rond < 0 ? <ArrowDown className="h-3 w-3" /> : null}
      {Math.abs(rond)}%
    </span>
  );
};

/**
 * Omzet over de jaren: per jaar en per kwartaal, met het verschil tegenover
 * hetzelfde kwartaal een jaar eerder. Het lopende jaar en kwartaal zijn nog
 * niet compleet; dat staat erbij, zodat een lager getal niet schrikt.
 */
const OmzetTab = () => {
  const { data, isLoading, isError, error } = useOmzetHistorie(true);
  const { bedrag, verborgen } = useBedragenVerborgen();
  const [maat, setMaat] = useState<Maat>("omzet");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-[16px]" />
        <Skeleton className="h-64 rounded-[16px]" />
      </div>
    );
  }
  if (isError || !data) {
    return <p className={cn("text-sm", TOON.danger.tekst)}>{error instanceof Error ? error.message : "Laden mislukt"}</p>;
  }

  const jaren = data.jaren;
  const vorig = (j: OmzetJaar) => jaren.find((x) => x.jaar === j.jaar - 1);
  const max = Math.max(...jaren.map((j) => Math.abs(j[maat])), 1);
  const huidigKwartaal = Math.floor(new Date().getMonth() / 3) + 1;

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader
          icon={BarChart3}
          titel="Per jaar"
          subtitel="Excl. btw, zoals geboekt in Moneybird"
          actie={<SegmentedControl label="Welk cijfer" opties={MATEN} waarde={maat} onChange={setMaat} />}
        />
        <PanelBody>
          <ul className="space-y-4">
            {jaren.map((j, i) => (
              <li key={j.jaar}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">
                    {j.jaar}
                    {j.lopend && <span className="font-normal text-muted-foreground"> tot nu toe</span>}
                  </span>
                  <span className="flex items-baseline gap-2">
                    {!j.lopend && <Verschil procent={groei(j[maat], vorig(j)?.[maat])} />}
                    <span className="font-epilogue text-lg font-medium tabular-nums">{bedrag(j[maat], 0)}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("p-groei-x h-full rounded-full", j.lopend ? "bg-accent" : "bg-accent/55")}
                    style={{
                      width: verborgen ? "0%" : `${Math.max(1, (Math.max(0, j[maat]) / max) * 100)}%`,
                      animationDelay: `${i * 40}ms`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader icon={CalendarRange} titel="Per kwartaal" subtitel="Met het verschil tegenover hetzelfde kwartaal een jaar eerder" />
        <PanelBody className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-[13px] text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-normal">
                  Jaar
                </th>
                {[1, 2, 3, 4].map((q) => (
                  <th key={q} scope="col" className="px-4 py-2.5 text-right font-normal">
                    Q{q}
                  </th>
                ))}
                <th scope="col" className="px-4 py-2.5 text-right font-normal">
                  Totaal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jaren.map((j) => (
                <tr key={j.jaar}>
                  <th scope="row" className="px-4 py-3 text-left font-medium">
                    {j.jaar}
                  </th>
                  {[1, 2, 3, 4].map((q) => {
                    const k = j.kwartalen.find((x) => x.kwartaal === q);
                    const eerder = vorig(j)?.kwartalen.find((x) => x.kwartaal === q);
                    const loopt = j.lopend && q === huidigKwartaal;
                    return (
                      <td key={q} className="px-4 py-3 text-right align-top">
                        {k ? (
                          <>
                            <span className="block tabular-nums">{bedrag(k[maat], 0)}</span>
                            <span className="block h-4">
                              {loopt ? (
                                <span className="text-[12px] text-muted-foreground">loopt nog</span>
                              ) : (
                                <Verschil procent={groei(k[maat], eerder?.[maat])} />
                              )}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">–</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right align-top font-medium tabular-nums">{bedrag(j[maat], 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PanelBody>
      </Panel>
    </div>
  );
};

export default OmzetTab;
