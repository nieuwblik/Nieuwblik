import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { TOON } from "@/admin/constants";
import {
  useKlantenAanvullen,
  useMoneybirdContacten,
  type KlantVoorstel,
  type MoneybirdContactVolledig,
} from "@/admin/financien";
import { koppelLosseTaken, waarschijnlijkContact } from "@/admin/klantMatch";
import { adminKeys, useClients, useTasks, type Client } from "@/admin/queries";
import { useCombinedRows } from "@/admin/rows";

const VELD: Record<string, string> = {
  email: "E-mail",
  phone: "Telefoon",
  city: "Plaats",
  contact_name: "Contactpersoon",
};

const leeg = (v: string | null | undefined) => !v || !v.trim();

/** Wat een gekozen contact kan vullen bij deze klant: alleen lege velden. */
function veldenUit(klant: Client, c: MoneybirdContactVolledig): KlantVoorstel["velden"] {
  const velden: KlantVoorstel["velden"] = {};
  if (leeg(klant.email) && c.email) velden.email = c.email;
  if (leeg(klant.phone) && c.telefoon) velden.phone = c.telefoon;
  if (leeg(klant.city) && c.plaats) velden.city = c.plaats;
  if (leeg(klant.contact_name) && c.persoon) velden.contact_name = c.persoon;
  return velden;
}

/**
 * Ontbrekende klantgegevens aanvullen uit Moneybird. Per klant zie je wat er
 * ingevuld kan worden; je vinkt aan wat je overneemt. Klanten die het
 * portaal niet zelf kon vinden (andere naam in Moneybird), koppel je
 * hieronder met de hand aan het juiste contact. Alleen lege velden worden
 * gevuld, nooit iets overschreven, en het contact wordt bij de klant
 * onthouden.
 */
const KlantgegevensAanvullen = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { data, isLoading, isError, error } = useKlantenAanvullen(open);
  const { data: clients = [] } = useClients();
  const { data: tasks = [] } = useTasks();
  // Verborgen klanten (zelf verborgen of alles geannuleerd) hoeven niet aangevuld.
  const { rows } = useCombinedRows();
  const verborgen = useMemo(() => new Set(rows.flatMap((r) => (r.verborgen && r.client.id ? [r.client.id] : []))), [rows]);
  const losse = useMemo(
    () => [...(data?.zonderContact ?? []), ...(data?.twijfel ?? [])].filter((l) => !verborgen.has(l.clientId)),
    [data, verborgen],
  );
  const { data: contactData } = useMoneybirdContacten(open && losse.length > 0);
  const contacten = useMemo(() => contactData?.contacten ?? [], [contactData]);
  const qc = useQueryClient();
  const [gekozen, setGekozen] = useState<Set<string>>(new Set());
  const [handmatig, setHandmatig] = useState<Map<string, MoneybirdContactVolledig>>(new Map());
  const [bezig, setBezig] = useState(false);

  // Standaard alles aangevinkt: het zijn alleen lege velden.
  useEffect(() => {
    if (data) setGekozen(new Set(data.voorstellen.map((v) => v.clientId)));
    setHandmatig(new Map());
  }, [data]);

  /** Automatische voorstellen plus wat je zelf hebt gekoppeld. */
  const voorstellen = useMemo<KlantVoorstel[]>(() => {
    const zelf = [...handmatig.entries()].flatMap(([clientId, c]) => {
      const klant = clients.find((k) => k.id === clientId);
      if (!klant) return [];
      return [{ clientId, klant: klant.name, contact: c, velden: veldenUit(klant, c) }];
    });
    return [...(data?.voorstellen ?? []).filter((v) => !verborgen.has(v.clientId)), ...zelf];
  }, [data, handmatig, clients, verborgen]);

  // Alleen wat in de lijst staat telt; een verborgen klant kan nog in de keuze zitten.
  const aantalGekozen = voorstellen.filter((v) => gekozen.has(v.clientId)).length;

  const wissel = (id: string) =>
    setGekozen((huidig) => {
      const nieuw = new Set(huidig);
      if (nieuw.has(id)) nieuw.delete(id);
      else nieuw.add(id);
      return nieuw;
    });

  /** Per losse klant het meest waarschijnlijke contact, uit de contacten die nog vrij zijn. */
  const voorstelVoor = useMemo(() => {
    const bezet = new Set(clients.flatMap((k) => (k.moneybird_contact_id ? [k.moneybird_contact_id] : [])));
    const vrij = contacten.filter((c) => !bezet.has(c.id));
    const kaart = new Map<string, { contact: MoneybirdContactVolledig; reden: string }>();
    for (const l of losse) {
      const klant = clients.find((k) => k.id === l.clientId);
      const v = klant ? waarschijnlijkContact(klant, vrij) : null;
      if (v) kaart.set(l.clientId, v);
    }
    return kaart;
  }, [clients, contacten, losse]);

  const koppel = (clientId: string, contactId: string) => {
    const c = contacten.find((x) => x.id === contactId);
    if (!c) return;
    setHandmatig((huidig) => new Map(huidig).set(clientId, c));
    setGekozen((huidig) => new Set(huidig).add(clientId));
  };

  const neemOver = async () => {
    setBezig(true);
    let gelukt = 0;
    let taken = 0;
    for (const v of voorstellen.filter((v) => gekozen.has(v.clientId))) {
      const { error: fout } = await supabase
        .from("clients")
        .update({ ...v.velden, moneybird_contact_id: v.contact.id })
        .eq("id", v.clientId);
      if (fout) continue;
      gelukt += 1;
      // Taken die onder de Moneybird-naam op Intern stonden, gaan nu naar de klant.
      taken += await koppelLosseTaken(v.contact.naam, v.clientId, tasks);
    }
    setBezig(false);
    void qc.invalidateQueries({ queryKey: adminKeys.clients });
    void qc.invalidateQueries({ queryKey: adminKeys.tasks });
    toast.success(`${gelukt} ${gelukt === 1 ? "klant" : "klanten"} aangevuld uit Moneybird`, {
      description: taken > 0 ? `${taken} ${taken === 1 ? "taak staat" : "taken staan"} nu bij de juiste klant.` : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
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
          <div className="space-y-5">
            {voorstellen.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nog niets om aan te vullen.</p>
            ) : (
              <ul className="divide-y divide-border rounded-xl border border-border">
                {voorstellen.map((v) => (
                  <li key={v.clientId}>
                    <label className="flex items-start gap-3 px-3 py-2.5 text-sm">
                      <Checkbox
                        checked={gekozen.has(v.clientId)}
                        onCheckedChange={() => wissel(v.clientId)}
                        className="mt-0.5"
                        aria-label={`${v.klant} aanvullen`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">
                          {v.klant}
                          {v.contact.naam !== v.klant && (
                            <span className="font-normal text-muted-foreground"> · {v.contact.naam}</span>
                          )}
                        </span>
                        <span className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[13px] text-muted-foreground">
                          {Object.keys(v.velden).length === 0
                            ? "Niets nieuws in dit contact; alleen de koppeling wordt onthouden."
                            : Object.entries(v.velden).map(([veld, waarde]) => (
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

            {losse.filter((l) => !handmatig.has(l.clientId)).length > 0 && (
              <div>
                <h3 className="p-kaarttitel mb-1">Zelf koppelen</h3>
                <p className="mb-2 text-[13px] text-muted-foreground">
                  Deze klanten heten in Moneybird anders, of er zijn meerdere mogelijke contacten. Kies het juiste contact.
                </p>
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {losse
                    .filter((l) => !handmatig.has(l.clientId))
                    .map((l) => (
                      <li key={l.clientId} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2 text-sm">
                        <span className="min-w-0 flex-1 basis-40">
                          <span className="block truncate font-medium">{l.naam}</span>
                          {voorstelVoor.get(l.clientId) && (
                            <button
                              type="button"
                              onClick={() => koppel(l.clientId, voorstelVoor.get(l.clientId)!.contact.id)}
                              title={voorstelVoor.get(l.clientId)!.reden}
                              className="mt-0.5 block max-w-full truncate text-left text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                              Waarschijnlijk {voorstelVoor.get(l.clientId)!.contact.naam}: koppelen
                            </button>
                          )}
                        </span>
                        <Select onValueChange={(waarde) => koppel(l.clientId, waarde)}>
                          <SelectTrigger className="h-9 w-56" aria-label={`Moneybird-contact voor ${l.naam}`}>
                            <SelectValue placeholder={contactData ? "Kies een contact" : "Contacten laden…"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-72">
                            {contacten.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.naam}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button disabled={!data || aantalGekozen === 0 || bezig} onClick={() => void neemOver()}>
            {bezig ? "Bezig…" : `${aantalGekozen} ${aantalGekozen === 1 ? "klant" : "klanten"} aanvullen`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KlantgegevensAanvullen;
