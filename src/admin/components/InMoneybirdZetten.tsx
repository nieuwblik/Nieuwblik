import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { useContactAanmaken, type MoneybirdContact } from "@/admin/financien";
import { meldMoneybird } from "@/admin/moneybirdMelding";

const NIEUW = "nieuw";

/**
 * Een klant in Moneybird zetten. Bij openen zoekt het portaal meteen: één
 * duidelijke treffer wordt gekoppeld, niets gevonden wordt een nieuw contact.
 * Lijken er contacten op, dan kies je hier: een van die, of toch nieuw.
 */
const InMoneybirdZetten = ({
  open,
  onOpenChange,
  client,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: { id: string; name: string };
}) => {
  const zet = useContactAanmaken();
  const [kandidaten, setKandidaten] = useState<MoneybirdContact[] | null>(null);
  const [keuze, setKeuze] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const gestart = useRef(false);

  const voerUit = async (body: { contactId?: string; nieuw?: boolean } = {}) => {
    setFout(null);
    try {
      const r = await zet.mutateAsync({ clientId: client.id, ...body });
      if (!r.ok) {
        setKandidaten(r.kiesContact);
        return;
      }
      meldMoneybird(r, client.name);
      onOpenChange(false);
    } catch (e) {
      setFout(e instanceof Error ? e.message : "Het lukte niet");
    }
  };

  useEffect(() => {
    if (!open) {
      gestart.current = false;
      return;
    }
    if (gestart.current) return;
    gestart.current = true;
    setKandidaten(null);
    setKeuze(null);
    void voerUit();
    // Eén keer per openen; voerUit hoort niet in de afhankelijkheden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{client.name} in Moneybird</DialogTitle>
          <DialogDescription>
            {kandidaten
              ? "Deze contacten in Moneybird lijken erop. Koppel aan het juiste, of maak een nieuw contact."
              : "Het portaal zoekt eerst of de klant al in Moneybird staat, zodat er geen dubbel contact ontstaat."}
          </DialogDescription>
        </DialogHeader>

        {fout ? (
          <p className={cn("text-sm", TOON.danger.tekst)}>{fout}</p>
        ) : !kandidaten ? (
          <p className="text-sm text-muted-foreground">Zoeken in Moneybird…</p>
        ) : (
          <fieldset className="space-y-2">
            <legend className="sr-only">Contact in Moneybird</legend>
            {[...kandidaten, { id: NIEUW, naam: "Nieuw contact aanmaken", email: null, url: "" }].map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50",
                  keuze === c.id && "border-foreground",
                )}
              >
                <input
                  type="radio"
                  name="moneybird-contact"
                  checked={keuze === c.id}
                  onChange={() => setKeuze(c.id)}
                  className="accent-foreground"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{c.naam}</span>
                  <span className="block truncate text-[13px] text-muted-foreground">
                    {c.id === NIEUW ? `Met de gegevens van ${client.name} uit het portaal` : (c.email ?? "Geen e-mailadres")}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {kandidaten || fout ? "Annuleren" : "Sluiten"}
          </Button>
          {kandidaten && (
            <Button
              disabled={!keuze || zet.isPending}
              onClick={() => void voerUit(keuze === NIEUW ? { nieuw: true } : { contactId: keuze! })}
            >
              {zet.isPending ? "Bezig…" : keuze === NIEUW ? "Nieuw contact aanmaken" : "Koppelen"}
            </Button>
          )}
          {fout && <Button onClick={() => void voerUit()}>Opnieuw</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InMoneybirdZetten;
