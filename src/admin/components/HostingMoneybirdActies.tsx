import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { nl } from "date-fns/locale";
import { Copy, ExternalLink, Landmark, MoreHorizontal, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContactKiezer from "@/admin/components/ContactKiezer";
import { BILLING_CYCLE, formatEuro } from "@/admin/billing";
import { factureertMoneybird, useMachtigingLink, useTerugkerendMaken, type MoneybirdContact } from "@/admin/financien";
import type { Client } from "@/admin/queries";

/**
 * Het menu achter een hostingcontract: het contract als terugkerende factuur
 * in Moneybird zetten, en een link om de klant een incassomachtiging te laten
 * afgeven (Moneybird Payments).
 */
const HostingMoneybirdActies = ({ client, volgende }: { client: Client; volgende: Date | null }) => {
  const [terugkerend, setTerugkerend] = useState(false);
  const [machtiging, setMachtiging] = useState<string | null>(null);
  const [kandidaten, setKandidaten] = useState<MoneybirdContact[] | null>(null);
  const link = useMachtigingLink();

  const vraagLink = async (contactId?: string) => {
    try {
      const r = await link.mutateAsync({ clientId: client.id, ...(contactId ? { contactId } : {}) });
      if (!r.ok) {
        setKandidaten(r.kiesContact);
        return;
      }
      setKandidaten(null);
      setMachtiging(r.url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Link opvragen mislukt");
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Moneybird-acties voor ${client.name}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {!factureertMoneybird(client) && (
            <DropdownMenuItem onSelect={() => setTerugkerend(true)}>
              <RefreshCw className="h-4 w-4" />
              Terugkerend maken in Moneybird
            </DropdownMenuItem>
          )}
          <DropdownMenuItem disabled={link.isPending} onSelect={() => void vraagLink()}>
            <Landmark className="h-4 w-4" />
            Link voor incassomachtiging
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TerugkerendMaken open={terugkerend} onOpenChange={setTerugkerend} client={client} volgende={volgende} />

      <ContactKiezer
        kandidaten={kandidaten}
        klantNaam={client.name}
        bezig={link.isPending}
        onKies={(id) => void vraagLink(id)}
        onClose={() => setKandidaten(null)}
      />

      <Dialog open={machtiging !== null} onOpenChange={(o) => !o && setMachtiging(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Link voor incassomachtiging</DialogTitle>
            <DialogDescription>
              Stuur deze link naar {client.name}. De klant betaalt 15 cent om de machtiging te bevestigen; Moneybird bewaart
              hem daarna bij het contact. De link is 14 dagen geldig.
            </DialogDescription>
          </DialogHeader>
          <Input readOnly value={machtiging ?? ""} onFocus={(e) => e.target.select()} />
          <DialogFooter>
            <Button variant="outline" asChild>
              <a href={machtiging ?? "#"} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Openen
              </a>
            </Button>
            <Button
              onClick={() => {
                void navigator.clipboard.writeText(machtiging ?? "").then(
                  () => toast.success("Link gekopieerd"),
                  () => toast.error("Kopiëren lukte niet; selecteer de link en kopieer hem zelf."),
                );
              }}
            >
              <Copy className="h-4 w-4" />
              Kopiëren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/**
 * Een hostingcontract als terugkerende factuur in Moneybird: vanaf de gekozen
 * datum maakt Moneybird elke maand of elk jaar zelf de factuur. Daarna staat
 * het contract in het portaal als "via Moneybird" en biedt het geen termijnen
 * meer aan om te factureren.
 */
const TerugkerendMaken = ({
  open,
  onOpenChange,
  client,
  volgende,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  volgende: Date | null;
}) => {
  const maak = useTerugkerendMaken();
  const morgen = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const [datum, setDatum] = useState(morgen);
  const [versturen, setVersturen] = useState(false);
  const [kandidaten, setKandidaten] = useState<MoneybirdContact[] | null>(null);

  useEffect(() => {
    if (!open) return;
    const voorstel = volgende ? format(volgende, "yyyy-MM-dd") : morgen;
    setDatum(voorstel > morgen ? voorstel : morgen);
    setVersturen(false);
    setKandidaten(null);
  }, [open, volgende, morgen]);

  const cyclus = client.billing_cycle ? BILLING_CYCLE[client.billing_cycle].label.toLowerCase() : "";

  const verstuur = async (contactId?: string) => {
    try {
      const r = await maak.mutateAsync({
        clientId: client.id,
        eersteFactuur: datum,
        automatischVersturen: versturen,
        ...(contactId ? { contactId } : {}),
      });
      if (!r.ok) {
        setKandidaten(r.kiesContact);
        return;
      }
      setKandidaten(null);
      toast.success(`${client.name} loopt nu via Moneybird`, {
        action: { label: "Openen", onClick: () => window.open(r.url, "_blank", "noopener") },
      });
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Aanmaken mislukt");
    }
  };

  return (
    <>
      <Dialog open={open && kandidaten === null} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Terugkerende factuur in Moneybird</DialogTitle>
            <DialogDescription>
              {client.name}: {formatEuro(client.billing_amount_cents) ?? "geen bedrag"} excl. btw, {cyclus}. Moneybird maakt
              vanaf de eerste factuurdatum zelf de facturen; in het portaal staat het contract daarna als "via Moneybird".
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="eerste-factuur">Eerste factuurdatum</Label>
              <Input id="eerste-factuur" type="date" min={morgen} value={datum} onChange={(e) => setDatum(e.target.value)} />
              {datum && (
                <p className="text-[13px] text-muted-foreground">
                  {format(new Date(`${datum}T12:00:00`), "EEEE d MMMM yyyy", { locale: nl })}
                </p>
              )}
            </div>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox checked={versturen} onCheckedChange={(v) => setVersturen(v === true)} className="mt-0.5" />
              <span>
                Facturen automatisch naar de klant versturen
                <span className="block text-[13px] text-muted-foreground">
                  Uit: Moneybird maakt de factuur en jij verstuurt hem zelf.
                </span>
              </span>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button disabled={!datum || datum < morgen || maak.isPending || !client.billing_amount_cents} onClick={() => void verstuur()}>
              {maak.isPending ? "Bezig…" : "Terugkerende factuur maken"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ContactKiezer
        kandidaten={kandidaten}
        klantNaam={client.name}
        bezig={maak.isPending}
        onKies={(id) => void verstuur(id)}
        onClose={() => setKandidaten(null)}
      />
    </>
  );
};

export default HostingMoneybirdActies;
