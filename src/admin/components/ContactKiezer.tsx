import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { MoneybirdContact } from "@/admin/financien";

interface ContactKiezerProps {
  /** null: dicht. Een lege lijst: er is niets gevonden. */
  kandidaten: MoneybirdContact[] | null;
  klantNaam: string;
  bezig?: boolean;
  onKies: (contactId: string) => void;
  onClose: () => void;
}

/**
 * Welk Moneybird-contact hoort bij deze klant? Verschijnt als het portaal er
 * niet zelf één kon vinden op e-mailadres of naam. De keuze wordt daarna bij
 * de klant onthouden.
 */
const ContactKiezer = ({ kandidaten, klantNaam, bezig = false, onKies, onClose }: ContactKiezerProps) => {
  const [gekozen, setGekozen] = useState<string | null>(null);
  useEffect(() => setGekozen(null), [kandidaten]);

  return (
    <Dialog open={kandidaten !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welk contact in Moneybird?</DialogTitle>
          <DialogDescription>
            {kandidaten?.length === 0
              ? `Er staat geen contact voor ${klantNaam} in Moneybird. Maak het daar eerst aan en probeer het dan opnieuw.`
              : `Het portaal vond meerdere mogelijke contacten voor ${klantNaam}. Kies het juiste; dat wordt bij de klant onthouden.`}
          </DialogDescription>
        </DialogHeader>
        {kandidaten && kandidaten.length > 0 && (
          <fieldset className="space-y-2">
            <legend className="sr-only">Contacten</legend>
            {kandidaten.map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50",
                  gekozen === c.id && "border-foreground",
                )}
              >
                <input
                  type="radio"
                  name="moneybird-contact"
                  checked={gekozen === c.id}
                  onChange={() => setGekozen(c.id)}
                  className="accent-foreground"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{c.naam}</span>
                  {c.email && <span className="block truncate text-[13px] text-muted-foreground">{c.email}</span>}
                </span>
              </label>
            ))}
          </fieldset>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {kandidaten?.length === 0 ? "Sluiten" : "Annuleren"}
          </Button>
          {kandidaten && kandidaten.length > 0 && (
            <Button type="button" disabled={!gekozen || bezig} onClick={() => gekozen && onKies(gekozen)}>
              {bezig ? "Bezig…" : "Doorgaan"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactKiezer;
