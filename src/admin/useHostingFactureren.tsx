import { useState } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { FilePlus2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ContactKiezer from "@/admin/components/ContactKiezer";
import { formatEuro } from "@/admin/billing";
import { useFinancien, useHostingFactureren as useHostingActie, type HostingResultaat, type MoneybirdContact } from "@/admin/financien";
import type { Client } from "@/admin/queries";
import { useConfirm } from "@/admin/useConfirm";

export interface HostingTermijn {
  client: Client;
  /** De periodedatum, YYYY-MM-DD. */
  sleutel: string;
  datum: Date;
}

/**
 * Hostingtermijnen als conceptfactuur in Moneybird, los of allemaal tegelijk.
 * Er gaat niets naar de klant: de concepten staan klaar in Moneybird en jij
 * verstuurt ze daar. De termijn wordt in het portaal meteen afgevinkt.
 *
 * Geeft een knop per termijn, een knop voor een hele lijst, en de dialogen
 * die daarbij horen. Zonder live Moneybird-koppeling blijven de knoppen weg.
 */
export function useHostingFactureren() {
  const { data: financien } = useFinancien();
  const actie = useHostingActie();
  const { vraagBevestiging, dialoog } = useConfirm();
  const [kiezen, setKiezen] = useState<{ termijn: HostingTermijn; kandidaten: MoneybirdContact[] } | null>(null);
  const live = Boolean(financien && "bijgewerkt" in financien);

  const meld = (resultaat: Extract<HostingResultaat, { ok: true }>) => {
    const { gemaakt, overgeslagen } = resultaat;
    if (gemaakt.length === 1) {
      toast.success(`Concept voor ${gemaakt[0]!.naam} staat klaar in Moneybird`, {
        action: { label: "Openen", onClick: () => window.open(gemaakt[0]!.url, "_blank", "noopener") },
      });
    } else if (gemaakt.length > 1) {
      toast.success(`${gemaakt.length} concepten staan klaar in Moneybird`);
    }
    if (overgeslagen.length > 0) {
      toast.warning(`${overgeslagen.length} overgeslagen`, {
        description: overgeslagen.map((o) => `${o.naam}: ${o.reden}`).join("; "),
        duration: 10000,
      });
    }
  };

  const maak = async (termijnen: HostingTermijn[], contactId?: string) => {
    try {
      const resultaat = await actie.mutateAsync({
        items: termijnen.map((t) => ({ clientId: t.client.id, periodDate: t.sleutel })),
        ...(contactId ? { contactId } : {}),
      });
      if (!resultaat.ok) {
        setKiezen({ termijn: termijnen[0]!, kandidaten: resultaat.kiesContact });
        return;
      }
      setKiezen(null);
      meld(resultaat);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Factureren mislukt");
    }
  };

  const alles = async (termijnen: HostingTermijn[]) => {
    const metBedrag = termijnen.filter((t) => t.client.billing_amount_cents);
    const ja = await vraagBevestiging({
      titel: `${metBedrag.length} ${metBedrag.length === 1 ? "concept" : "concepten"} maken in Moneybird?`,
      beschrijving:
        "Per termijn een conceptfactuur, exclusief btw. Er gaat niets naar de klant; je verstuurt ze zelf vanuit Moneybird. De termijnen worden hier afgevinkt.",
      inhoud: (
        <ul className="max-h-60 divide-y divide-border overflow-y-auto rounded-lg border border-border text-sm">
          {metBedrag.map((t) => (
            <li key={`${t.client.id}|${t.sleutel}`} className="flex items-baseline justify-between gap-3 px-3 py-2">
              <span className="min-w-0">
                <span className="block truncate font-medium">{t.client.name}</span>
                <span className="block text-[13px] text-muted-foreground">{format(t.datum, "d MMMM yyyy", { locale: nl })}</span>
              </span>
              <span className="shrink-0 tabular-nums">{formatEuro(t.client.billing_amount_cents)}</span>
            </li>
          ))}
        </ul>
      ),
      bevestigLabel: "Concepten maken",
      gevaarlijk: false,
    });
    if (ja) await maak(metBedrag);
  };

  const knop = (termijn: HostingTermijn) =>
    live && termijn.client.billing_amount_cents ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={actie.isPending}
        onClick={() => void maak([termijn])}
        title="Conceptfactuur maken in Moneybird"
        className="h-8 shrink-0 px-2 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <FilePlus2 className="h-4 w-4" />
        <span className="hidden md:inline">Concept</span>
      </Button>
    ) : null;

  const allesKnop = (termijnen: HostingTermijn[]) =>
    live && termijnen.some((t) => t.client.billing_amount_cents) ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 px-2.5 text-[13px]"
        disabled={actie.isPending}
        onClick={() => void alles(termijnen)}
      >
        <FilePlus2 className="h-3.5 w-3.5" />
        Alles als concept
      </Button>
    ) : null;

  return {
    live,
    knop,
    allesKnop,
    dialogen: (
      <>
        {dialoog}
        <ContactKiezer
          kandidaten={kiezen?.kandidaten ?? null}
          klantNaam={kiezen?.termijn.client.name ?? ""}
          bezig={actie.isPending}
          onKies={(contactId) => kiezen && void maak([kiezen.termijn], contactId)}
          onClose={() => setKiezen(null)}
        />
      </>
    ),
  };
}
