import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { TOON } from "@/admin/constants";
import { useKlantenAanvullen } from "@/admin/financien";
import { adminKeys } from "@/admin/queries";

const VELD: Record<string, string> = {
  email: "E-mail",
  phone: "Telefoon",
  city: "Plaats",
  contact_name: "Contactpersoon",
};

/**
 * Ontbrekende klantgegevens aanvullen uit Moneybird. Per klant zie je wat er
 * ingevuld kan worden; je vinkt aan wat je overneemt. Alleen lege velden
 * worden gevuld, nooit iets overschreven, en het Moneybird-contact wordt bij
 * de klant onthouden.
 */
const KlantgegevensAanvullen = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { data, isLoading, isError, error } = useKlantenAanvullen(open);
  const qc = useQueryClient();
  const [gekozen, setGekozen] = useState<Set<string>>(new Set());
  const [bezig, setBezig] = useState(false);

  // Standaard alles aangevinkt: het zijn alleen lege velden.
  useEffect(() => {
    if (data) setGekozen(new Set(data.voorstellen.map((v) => v.clientId)));
  }, [data]);

  const wissel = (id: string) =>
    setGekozen((huidig) => {
      const nieuw = new Set(huidig);
      if (nieuw.has(id)) nieuw.delete(id);
      else nieuw.add(id);
      return nieuw;
    });

  const neemOver = async () => {
    if (!data) return;
    setBezig(true);
    let gelukt = 0;
    for (const v of data.voorstellen.filter((v) => gekozen.has(v.clientId))) {
      const { error: fout } = await supabase
        .from("clients")
        .update({ ...v.velden, moneybird_contact_id: v.contact.id })
        .eq("id", v.clientId);
      if (!fout) gelukt += 1;
    }
    setBezig(false);
    void qc.invalidateQueries({ queryKey: adminKeys.clients });
    toast.success(`${gelukt} ${gelukt === 1 ? "klant" : "klanten"} aangevuld uit Moneybird`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Klantgegevens aanvullen uit Moneybird</DialogTitle>
          <DialogDescription>
            Alleen lege velden worden gevuld; wat er al staat blijft staan. Vink uit wat je niet wilt overnemen.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
            <p className="text-[13px] text-muted-foreground">Klanten opzoeken in Moneybird…</p>
          </div>
        ) : isError || !data ? (
          <p className={cn("text-sm", TOON.danger.tekst)}>{error instanceof Error ? error.message : "Ophalen mislukt"}</p>
        ) : (
          <div className="space-y-4">
            {data.voorstellen.length === 0 ? (
              <p className="text-sm text-muted-foreground">Er valt niets aan te vullen: Moneybird heeft geen gegevens die hier ontbreken.</p>
            ) : (
              <ul className="max-h-[50vh] divide-y divide-border overflow-y-auto rounded-xl border border-border">
                {data.voorstellen.map((v) => (
                  <li key={v.clientId}>
                    <label className="flex items-start gap-3 px-3 py-2.5 text-sm">
                      <Checkbox
                        checked={gekozen.has(v.clientId)}
                        onCheckedChange={() => wissel(v.clientId)}
                        className="mt-0.5"
                        aria-label={`${v.klant} aanvullen`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{v.klant}</span>
                        <span className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[13px] text-muted-foreground">
                          {Object.entries(v.velden).map(([veld, waarde]) => (
                            <span key={veld}>
                              {VELD[veld]}: <span className="text-foreground">{waarde}</span>
                            </span>
                          ))}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {(data.zonderContact.length > 0 || data.twijfel.length > 0) && (
              <p className="text-[13px] text-muted-foreground">
                {data.zonderContact.length > 0 &&
                  `Niet gevonden in Moneybird: ${data.zonderContact.join(", ")}. `}
                {data.twijfel.length > 0 &&
                  `Meerdere mogelijke contacten, dus overgeslagen: ${data.twijfel.join(", ")}.`}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button disabled={!data || gekozen.size === 0 || bezig} onClick={() => void neemOver()}>
            {bezig ? "Bezig…" : `${gekozen.size} ${gekozen.size === 1 ? "klant" : "klanten"} aanvullen`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KlantgegevensAanvullen;
