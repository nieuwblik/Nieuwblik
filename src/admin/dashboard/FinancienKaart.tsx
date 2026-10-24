import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { daysUntil } from "@/admin/format";
import { formatBedrag, heeftData, useFinancien } from "@/admin/financien";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";

/**
 * De stand uit Moneybird in drie regels: omzet deze maand, wat klanten nog
 * moeten betalen (en hoeveel daarvan te laat is) en het banksaldo. Zolang
 * Moneybird niet gekoppeld of de functie niet live is, verschijnt de kaart
 * niet; de pagina Financiën legt dan uit wat er nog moet gebeuren.
 */
const FinancienKaart = ({ className }: { className?: string }) => {
  const { data } = useFinancien();
  if (!data || !("bijgewerkt" in data)) return null;

  const omzet = heeftData(data.winstVerlies) ? (data.winstVerlies.data.at(-1)?.omzet ?? 0) : null;
  const facturen = heeftData(data.facturen) ? data.facturen.data : null;
  const open = facturen?.reduce((som, f) => som + f.open, 0) ?? null;
  const teLaat = facturen?.filter((f) => f.status === "late" || (daysUntil(f.vervaldatum) ?? 0) < 0) ?? [];
  const bank = heeftData(data.bank) ? data.bank.data.totaal : null;

  const regels = [
    { label: "Omzet deze maand", waarde: omzet === null ? "–" : formatBedrag(omzet, 0) },
    {
      label: "Openstaand",
      waarde: open === null ? "–" : formatBedrag(open, 0),
      extra: teLaat.length > 0 ? `${teLaat.length} te laat` : null,
    },
    { label: "Banksaldo", waarde: bank === null ? "–" : formatBedrag(bank, 0) },
  ];

  return (
    <Panel className={className} footer={<PanelFooter to="/admin/financien">Bekijk financiën</PanelFooter>}>
      <PanelHeader icon={Wallet} titel="Financiën" subtitel="Uit Moneybird" />
      <PanelBody>
        <dl className="space-y-2.5 text-sm">
          {regels.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="text-right">
                <span className="font-medium tabular-nums">{r.waarde}</span>
                {r.extra && <span className={cn("ml-2 text-[13px] font-medium", TOON.danger.tekst)}>{r.extra}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </PanelBody>
    </Panel>
  );
};

export default FinancienKaart;
