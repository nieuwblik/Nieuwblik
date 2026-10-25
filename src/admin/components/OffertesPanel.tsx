import { useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Archive, Check, ExternalLink, FileDown, FileSignature, MoreHorizontal, Plus, Receipt, Send, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import DocumentOpstellen from "@/admin/components/DocumentOpstellen";
import { TOON, type Toon } from "@/admin/constants";
import {
  heeftData,
  OFFERTE_WACHTTIJD,
  offerteWachtDagen,
  useOfferteActie,
  type Offerte,
  type OfferteWat,
  type Onderdeel,
} from "@/admin/financien";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";
import { useConfirm } from "@/admin/useConfirm";

const OFFERTESTATUS: Record<string, { label: string; toon: Toon }> = {
  draft: { label: "Concept", toon: "neutral" },
  open: { label: "Uitstaand", toon: "info" },
  late: { label: "Verlopen", toon: "danger" },
  accepted: { label: "Geaccepteerd", toon: "success" },
};

const datumKort = (d: string | null) => (d ? format(parseISO(d), "d MMM", { locale: nl }).replace(".", "") : "–");

/**
 * Offertes: concepten, uitstaande, verlopen en geaccepteerde (nog te
 * factureren). Per offerte versturen, de pdf, accepteren of afwijzen,
 * omzetten naar een factuur en archiveren. Wat iets verstuurt of omzet,
 * vraagt eerst om bevestiging. Wie al twee weken niets van zich liet horen,
 * krijgt een duidelijk teken: tijd om na te bellen.
 */
const OffertesPanel = ({ offertes }: { offertes: Onderdeel<Offerte[]> }) => {
  const { bedrag } = useBedragenVerborgen();
  const actie = useOfferteActie();
  const { vraagBevestiging, dialoog } = useConfirm();
  const [nieuw, setNieuw] = useState(false);
  const lijst = heeftData(offertes) ? offertes.data : [];
  const uitstaand = lijst.filter((o) => o.status === "open" || o.status === "late");
  const zonderRecht = !heeftData(offertes) && /403|recht/i.test(offertes.fout);

  const doe = async (o: Offerte, wat: OfferteWat) => {
    const naam = `offerte ${o.nummer ?? ""} van ${o.klant}`.replace(/\s+/g, " ");
    if (wat === "versturen") {
      const ja = await vraagBevestiging({
        titel: "Offerte versturen?",
        beschrijving: `Moneybird mailt de ${naam} meteen naar de klant (${bedrag(o.bedrag)} excl. btw).`,
        bevestigLabel: "Versturen",
        gevaarlijk: false,
      });
      if (!ja) return;
    }
    if (wat === "factureren") {
      const ja = await vraagBevestiging({
        titel: "Omzetten naar factuur?",
        beschrijving: `Moneybird maakt van de ${naam} een conceptfactuur met dezelfde regels. Er gaat nog niets naar de klant; je verstuurt de factuur daarna zelf.`,
        bevestigLabel: "Omzetten",
        gevaarlijk: false,
      });
      if (!ja) return;
    }
    if (wat === "archiveren" || wat === "afwijzen") {
      const ja = await vraagBevestiging({
        titel: wat === "afwijzen" ? "Offerte als afgewezen zetten?" : "Offerte archiveren?",
        beschrijving: `De ${naam} verdwijnt daarmee uit deze lijst. In Moneybird blijft hij bewaard.`,
        bevestigLabel: wat === "afwijzen" ? "Afgewezen" : "Archiveren",
        gevaarlijk: false,
      });
      if (!ja) return;
    }

    // De pdf: venster meteen openen, binnen de klik, anders blokkeert de browser hem.
    const venster = wat === "pdf" ? window.open("", "_blank") : null;
    try {
      const r = await actie.mutateAsync({ id: o.id, wat });
      if (wat === "pdf" && r.url) {
        if (venster) {
          venster.opener = null;
          venster.location.href = r.url;
        } else window.location.href = r.url;
        return;
      }
      const melding: Record<OfferteWat, string> = {
        versturen: "Offerte verstuurd",
        accepteren: "Offerte staat op geaccepteerd",
        afwijzen: "Offerte staat op afgewezen",
        archiveren: "Offerte gearchiveerd",
        factureren: "Conceptfactuur staat klaar in Moneybird",
        pdf: "",
      };
      toast.success(melding[wat], r.url ? { action: { label: "Openen", onClick: () => window.open(r.url, "_blank", "noopener") } } : undefined);
    } catch (e) {
      venster?.close();
      toast.error(e instanceof Error ? e.message : "Dat lukte niet");
    }
  };

  return (
    <Panel>
      <PanelHeader
        icon={FileSignature}
        titel="Offertes"
        subtitel={
          heeftData(offertes)
            ? `${uitstaand.length} uitstaand, ${bedrag(uitstaand.reduce((som, o) => som + o.bedrag, 0), 0)} excl. btw`
            : "Uitstaand en geaccepteerd"
        }
        actie={
          heeftData(offertes) ? (
            <Button variant="outline" size="sm" className="h-8 px-2.5 text-[13px]" onClick={() => setNieuw(true)}>
              <Plus className="h-3.5 w-3.5" />
              Nieuwe offerte
            </Button>
          ) : undefined
        }
      />
      <PanelBody className="px-2 pb-2 pt-2">
        {!heeftData(offertes) ? (
          <p className={cn("px-2 py-2 text-sm", zonderRecht ? "text-muted-foreground" : TOON.danger.tekst)}>
            {zonderRecht
              ? "De Moneybird-sleutel mag nog geen offertes lezen. Maak in Moneybird een nieuwe sleutel met ook het recht Offertes (estimates) en zet die in Lovable als MONEYBIRD_API_TOKEN."
              : offertes.fout}
          </p>
        ) : lijst.length === 0 ? (
          <p className="px-2 py-2 text-sm text-muted-foreground">Geen offertes die uitstaan.</p>
        ) : (
          <ul>
            {lijst.map((o) => {
              const status = OFFERTESTATUS[o.status] ?? OFFERTESTATUS["open"]!;
              const wacht = offerteWachtDagen(o);
              const kanVersturen = o.status === "draft" || o.status === "open" || o.status === "late";
              const kanBeslissen = o.status === "open" || o.status === "late";
              return (
                <li key={o.id} className="p-rij flex items-center gap-3 rounded-lg px-2 py-2 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{o.klant}</span>
                    <span
                      className={cn(
                        "block text-[13px] text-muted-foreground",
                        wacht >= OFFERTE_WACHTTIJD && TOON.warning.tekst,
                      )}
                    >
                      {o.nummer ?? "Concept"} ·{" "}
                      {o.status === "draft"
                        ? "nog niet verstuurd"
                        : o.status === "accepted"
                          ? `geaccepteerd ${datumKort((o.geaccepteerd ?? "").slice(0, 10) || null)}, nog factureren`
                          : wacht >= OFFERTE_WACHTTIJD
                            ? `${wacht} dagen geen reactie, tijd om na te vragen`
                            : `verstuurd ${datumKort((o.verstuurd ?? o.datum ?? "").slice(0, 10) || null)}`}
                    </span>
                  </span>
                  <StatusPill toon={status.toon}>{status.label}</StatusPill>
                  <span className="w-20 text-right font-medium tabular-nums">{bedrag(o.bedrag, 0)}</span>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Acties voor offerte ${o.nummer ?? o.klant}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60">
                      {o.status === "accepted" && (
                        <DropdownMenuItem onSelect={() => void doe(o, "factureren")}>
                          <Receipt />
                          Omzetten naar factuur
                        </DropdownMenuItem>
                      )}
                      {kanVersturen && (
                        <DropdownMenuItem onSelect={() => void doe(o, "versturen")}>
                          <Send />
                          {o.status === "draft" ? "Versturen" : "Opnieuw versturen"}
                        </DropdownMenuItem>
                      )}
                      {kanBeslissen && (
                        <>
                          <DropdownMenuItem onSelect={() => void doe(o, "accepteren")}>
                            <Check />
                            Geaccepteerd
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => void doe(o, "afwijzen")}>
                            <X />
                            Afgewezen
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => void doe(o, "pdf")}>
                        <FileDown />
                        Pdf openen
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={o.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink />
                          Openen in Moneybird
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => void doe(o, "archiveren")}>
                        <Archive />
                        Archiveren
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              );
            })}
          </ul>
        )}
      </PanelBody>
      <DocumentOpstellen open={nieuw} onOpenChange={setNieuw} soort="offerte" />
      {dialoog}
    </Panel>
  );
};

export default OffertesPanel;
