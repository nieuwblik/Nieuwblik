import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { TOON } from "@/admin/constants";
import {
  heeftData,
  klantSleutel,
  useFinancien,
  useMoneybirdContacten,
  zoekKlantBij,
  type MoneybirdContactVolledig,
} from "@/admin/financien";
import { adminKeys, useClients, useTasks } from "@/admin/queries";

/**
 * Klanten die alleen in Moneybird staan, in één keer in het portaal zetten:
 * naam, e-mail, telefoon, plaats en contactpersoon komen mee, en het contact
 * wordt bij de klant onthouden.
 *
 * Moneybird kent ook leveranciers, dus je kiest zelf. Bovenaan staan de
 * contacten uit je openstaande facturen, offertes en betalingen: dat zijn in
 * elk geval klanten. Contacten die al bij een klant horen, staan er niet in.
 *
 * Open taken zonder klant die de naam in hun titel hebben (zoals een
 * offerte die gefactureerd moet worden) gaan meteen naar de nieuwe klant.
 */
const KlantUitMoneybird = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { user } = useAdminAuth();
  const { data, isLoading, isError, error } = useMoneybirdContacten(open);
  const { data: clients = [] } = useClients();
  const { data: tasks = [] } = useTasks();
  const { data: financien } = useFinancien({ actief: open });
  const qc = useQueryClient();
  const [zoek, setZoek] = useState("");
  const [gekozen, setGekozen] = useState<Set<string>>(new Set());
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    if (!open) return;
    setZoek("");
    setGekozen(new Set());
  }, [open]);

  /** Namen uit facturen, offertes en betalingen: die contacten zijn klant. */
  const klantNamen = useMemo(() => {
    const namen = new Set<string>();
    if (financien && "bijgewerkt" in financien) {
      if (heeftData(financien.facturen)) for (const f of financien.facturen.data) namen.add(klantSleutel(f.klant));
      if (financien.offertes && heeftData(financien.offertes)) for (const o of financien.offertes.data) namen.add(klantSleutel(o.klant));
      if (financien.betalingen && heeftData(financien.betalingen))
        for (const b of financien.betalingen.data) namen.add(klantSleutel(b.klant));
    }
    return namen;
  }, [financien]);

  const { uitFacturen, overige } = useMemo(() => {
    const gekoppeld = new Set(clients.flatMap((c) => (c.moneybird_contact_id ? [c.moneybird_contact_id] : [])));
    const term = zoek.trim().toLowerCase();
    const los = (data?.contacten ?? []).filter(
      (c) =>
        !gekoppeld.has(c.id) &&
        !zoekKlantBij(c, clients) &&
        (!term || c.naam.toLowerCase().includes(term) || (c.email ?? "").toLowerCase().includes(term)),
    );
    return {
      uitFacturen: los.filter((c) => klantNamen.has(klantSleutel(c.naam))),
      overige: los.filter((c) => !klantNamen.has(klantSleutel(c.naam))),
    };
  }, [data, clients, zoek, klantNamen]);

  const wissel = (id: string) =>
    setGekozen((huidig) => {
      const nieuw = new Set(huidig);
      if (nieuw.has(id)) nieuw.delete(id);
      else nieuw.add(id);
      return nieuw;
    });

  const voegToe = async () => {
    const contacten = (data?.contacten ?? []).filter((c) => gekozen.has(c.id));
    setBezig(true);
    let klanten = 0;
    let taken = 0;
    for (const c of contacten) {
      const { data: klant, error: fout } = await supabase
        .from("clients")
        .insert({
          name: c.naam,
          email: c.email,
          phone: c.telefoon,
          city: c.plaats,
          contact_name: c.persoon,
          moneybird_contact_id: c.id,
          created_by: user?.id ?? null,
        })
        .select("id")
        .single();
      if (fout || !klant) continue;
      klanten += 1;

      const naam = c.naam.toLowerCase();
      const losseTaken = tasks.filter(
        (t) => !t.project_id && !t.client_id && t.status !== "klaar" && t.title.toLowerCase().includes(naam),
      );
      if (losseTaken.length > 0) {
        const { error: koppelFout } = await supabase
          .from("tasks")
          .update({ client_id: klant.id })
          .in(
            "id",
            losseTaken.map((t) => t.id),
          );
        if (!koppelFout) taken += losseTaken.length;
      }
    }
    setBezig(false);
    void qc.invalidateQueries({ queryKey: adminKeys.clients });
    void qc.invalidateQueries({ queryKey: adminKeys.tasks });

    if (klanten === 0) {
      toast.error("Toevoegen mislukt");
      return;
    }
    toast.success(`${klanten} ${klanten === 1 ? "klant" : "klanten"} toegevoegd uit Moneybird`, {
      description: taken > 0 ? `${taken} ${taken === 1 ? "taak staat" : "taken staan"} nu bij de juiste klant.` : undefined,
    });
    onOpenChange(false);
  };

  const groep = (titel: string, lijst: MoneybirdContactVolledig[]) =>
    lijst.length > 0 && (
      <div>
        <h3 className="mb-1.5 text-[13px] text-muted-foreground">{titel}</h3>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {lijst.map((c) => (
            <li key={c.id}>
              <label className="flex items-start gap-3 px-3 py-2.5 text-sm">
                <Checkbox
                  checked={gekozen.has(c.id)}
                  onCheckedChange={() => wissel(c.id)}
                  className="mt-0.5"
                  aria-label={`${c.naam} toevoegen`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{c.naam}</span>
                  <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
                    {[c.email, c.telefoon, c.plaats].filter(Boolean).join(" · ") || "Geen contactgegevens"}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Klanten toevoegen uit Moneybird</DialogTitle>
          <DialogDescription>
            Contacten die nog geen klant zijn in het portaal. Naam, e-mail, telefoon, plaats en contactpersoon komen mee.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Zoek op naam of e-mail" value={zoek} onChange={(e) => setZoek(e.target.value)} />
        </div>

        <div className="-mx-1 min-h-0 flex-1 space-y-4 overflow-y-auto px-1">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
            </div>
          ) : isError ? (
            <p className={cn("text-sm", TOON.danger.tekst)}>{error instanceof Error ? error.message : "Ophalen mislukt"}</p>
          ) : uitFacturen.length + overige.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {zoek.trim() ? "Geen contact gevonden." : "Elk contact in Moneybird is al klant in het portaal."}
            </p>
          ) : (
            <>
              {groep("Uit je facturen, offertes en betalingen", uitFacturen)}
              {groep(uitFacturen.length > 0 ? "Overige contacten" : "Contacten", overige)}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button disabled={gekozen.size === 0 || bezig} onClick={() => void voegToe()}>
            {bezig ? "Bezig…" : `${gekozen.size} ${gekozen.size === 1 ? "klant" : "klanten"} toevoegen`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KlantUitMoneybird;
