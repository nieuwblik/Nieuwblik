import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import DatePicker from "@/admin/components/DatePicker";
import { leesBedrag } from "@/admin/billing";
import { TOON } from "@/admin/constants";
import { formatBedrag, useFactuurActie, type OpenFactuur } from "@/admin/financien";

/** Een betaling vastleggen die buiten de bankkoppeling om binnenkwam, of een deel ervan. */
const BetalingDialoog = ({ factuur, onClose }: { factuur: OpenFactuur | null; onClose: () => void }) => {
  const actie = useFactuurActie();
  const [bedrag, setBedrag] = useState("");
  const [datum, setDatum] = useState<string | null>(null);

  useEffect(() => {
    if (!factuur) return;
    setBedrag(factuur.open.toFixed(2).replace(".", ","));
    setDatum(format(new Date(), "yyyy-MM-dd"));
  }, [factuur]);

  const waarde = leesBedrag(bedrag);
  const vandaag = format(new Date(), "yyyy-MM-dd");
  const fout = !factuur
    ? null
    : waarde === null || waarde <= 0
      ? "Vul een bedrag in."
      : waarde > factuur.open + 0.005
        ? `Er staat ${formatBedrag(factuur.open)} open.`
        : !datum || datum > vandaag
          ? "Kies een datum, vandaag of eerder."
          : null;

  const registreer = async () => {
    if (!factuur || fout || waarde === null || !datum) return;
    try {
      await actie.mutateAsync({ actie: "betaling", id: factuur.id, bedrag: waarde, datum });
      toast.success(`Betaling van ${formatBedrag(waarde)} geregistreerd bij ${factuur.nummer ?? factuur.klant}`);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Registreren mislukt");
    }
  };

  return (
    <Dialog open={factuur !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Betaling registreren</DialogTitle>
          <DialogDescription>
            {factuur?.klant}, factuur {factuur?.nummer}. Gebruik dit voor een betaling die niet via de bankkoppeling
            binnenkomt; staat hij later wel op de bank, koppel hem dan in Moneybird.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void registreer();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="betaling-bedrag">Bedrag</Label>
            <Input id="betaling-bedrag" inputMode="decimal" value={bedrag} onChange={(e) => setBedrag(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Betaald op</Label>
            <DatePicker
              value={datum}
              onChange={setDatum}
              aria-label="Betaaldatum"
              className="h-10 border border-input px-3"
            />
          </div>
          {fout && bedrag !== "" && <p className={cn("text-[13px] sm:col-span-2", TOON.danger.tekst)}>{fout}</p>}
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuleren
            </Button>
            <Button type="submit" disabled={Boolean(fout) || actie.isPending}>
              {actie.isPending ? "Bezig…" : "Registreren"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BetalingDialoog;
