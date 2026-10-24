import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { formatBedrag, heeftData, isTeLaatFactuur, useFinancien } from "@/admin/financien";
import OogKnop from "@/admin/ui/OogKnop";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import { useSaldoVerborgen, VERBORGEN } from "@/admin/useSaldoVerborgen";

/**
 * De stand uit Moneybird in drie regels: omzet deze maand, wat klanten nog
 * moeten betalen (en hoeveel daarvan te laat is) en het banksaldo. Zolang
 * Moneybird niet gekoppeld of de functie niet live is, verschijnt de kaart
 * niet; de pagina Financiën legt dan uit wat er nog moet gebeuren.
 */
const FinancienKaart = ({ className }: { className?: string }) => {
  const { data } = useFinancien();
  const { verborgen: saldoVerborgen } = useSaldoVerborgen();
  if (!data || !("bijgewerkt" in data)) return null;

  const omzet = heeftData(data.winstVerlies) ? (data.winstVerlies.data.at(-1)?.omzet ?? 0) : null;
  const facturen = heeftData(data.facturen) ? data.facturen.data : null;
  const open = facturen?.reduce((som, f) => som + f.open, 0) ?? null;
  const teLaat = facturen?.filter(isTeLaatFactuur) ?? [];
  const bank = heeftData(data.bank) ? data.bank.data.totaal : null;
  // Alleen in de maand dat de aangifte van het vorige kwartaal loopt.
  const aangifte = heeftData(data.btw) ? data.btw.data.find((q) => !q.lopend && q.afdragen > 0) : undefined;

  const regels = [
    { label: "Omzet deze maand", waarde: omzet === null ? "–" : formatBedrag(omzet, 0) },
    {
      label: "Openstaand",
      waarde: open === null ? "–" : formatBedrag(open, 0),
      extra: teLaat.length > 0 ? `${teLaat.length} te laat` : null,
    },
    { label: "Banksaldo", waarde: bank === null ? "–" : saldoVerborgen ? VERBORGEN : formatBedrag(bank, 0), oog: true },
    ...(aangifte
      ? [
          {
            label: `Btw ${aangifte.label.split(" ")[0]}`,
            waarde: formatBedrag(aangifte.afdragen, 0),
            extra: `uiterlijk ${format(parseISO(aangifte.deadline), "d MMM", { locale: nl }).replace(".", "")}`,
            toon: "warning" as const,
          },
        ]
      : []),
  ];

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/financien">Bekijk financiën</PanelFooter>}>
      <PanelHeader icon={Wallet} titel="Financiën" subtitel="Uit Moneybird" />
      <PanelBody>
        <dl className="space-y-2.5 text-sm">
          {regels.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-3">
              <dt className="flex items-center gap-1 text-muted-foreground">
                {r.label}
                {"oog" in r && <OogKnop className="-my-1 h-6 w-6" />}
              </dt>
              <dd className="text-right">
                <span className="font-medium tabular-nums">{r.waarde}</span>
                {r.extra && (
                  <span className={cn("ml-2 text-[13px] font-medium", TOON["toon" in r ? r.toon : "danger"].tekst)}>{r.extra}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </PanelBody>
    </Panel>
  );
};

export default FinancienKaart;
