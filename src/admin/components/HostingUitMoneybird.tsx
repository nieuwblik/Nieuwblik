import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatEuro } from "@/admin/billing";
import { TOON } from "@/admin/constants";
import { MONEYBIRD_NOTITIE, useHostingUitMoneybird, type HostingVoorstel } from "@/admin/financien";
import { adminKeys, useClients } from "@/admin/queries";

/** Kan dit voorstel als contract in het portaal? */
const bruikbaar = (v: HostingVoorstel) => Boolean(v.clientId && v.cyclus && v.start);

/**
 * Hostingcontracten inlezen uit de terugkerende facturen in Moneybird. Per
 * terugkerende factuur zie je klant, bedrag, cyclus en wat erop staat; je
 * vinkt aan welke als contract in het portaal moeten. Die worden gemarkeerd
 * als "via Moneybird": Moneybird verstuurt ze al, dus het portaal zet er geen
 * "nog te factureren" bij en maakt er nooit een tweede factuur voor.
 */
const HostingUitMoneybird = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { data, isLoading, isError, error } = useHostingUitMoneybird(open);
  const { data: clients = [] } = useClients();
  const qc = useQueryClient();
  const [gekozen, setGekozen] = useState<Set<string>>(new Set());
  const [koppelingen, setKoppelingen] = useState<Map<string, string>>(new Map());
  const [bezig, setBezig] = useState(false);

  // Standaard aangevinkt: bij een klant gevonden en nog geen contract.
  useEffect(() => {
    if (data) setGekozen(new Set(data.voorstellen.filter((v) => bruikbaar(v) && !v.alIngesteld).map((v) => v.id)));
    setKoppelingen(new Map());
  }, [data]);

  /** De voorstellen met de klanten die je zelf hebt gekoppeld. */
  const voorstellen = useMemo<HostingVoorstel[]>(
    () =>
      (data?.voorstellen ?? []).map((v) => {
        const eigen = koppelingen.get(v.id);
        const klant = eigen ? clients.find((c) => c.id === eigen) : undefined;
        return klant
          ? { ...v, clientId: klant.id, klantNaam: klant.name, alIngesteld: Boolean(klant.billing_cycle && klant.billing_start) }
          : v;
      }),
    [data, koppelingen, clients],
  );

  const koppel = (voorstel: HostingVoorstel, clientId: string) => {
    setKoppelingen((huidig) => new Map(huidig).set(voorstel.id, clientId));
    if (voorstel.cyclus && voorstel.start) setGekozen((huidig) => new Set(huidig).add(voorstel.id));
  };

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
    for (const v of voorstellen.filter((v) => gekozen.has(v.id) && bruikbaar(v))) {
      const { error: fout } = await supabase
        .from("clients")
        .update({
          billing_cycle: v.cyclus!,
          billing_amount_cents: v.bedragCenten,
          billing_start: v.start!,
          billing_note: `${MONEYBIRD_NOTITIE} ${v.id}`,
          moneybird_contact_id: v.contact.id,
        })
        .eq("id", v.clientId!);
      if (!fout) gelukt += 1;
    }
    setBezig(false);
    void qc.invalidateQueries({ queryKey: adminKeys.clients });
    toast.success(`${gelukt} ${gelukt === 1 ? "contract" : "contracten"} ingelezen uit Moneybird`);
    onOpenChange(false);
  };

  const reden = (v: HostingVoorstel) =>
    !v.clientId
      ? "Geen klant in het portaal gevonden"
      : !v.cyclus
        ? `Frequentie (${v.frequentie}) kent het portaal niet`
        : v.alIngesteld
          ? "Heeft al een contract in het portaal"
          : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hostingcontracten uit Moneybird</DialogTitle>
          <DialogDescription>
            Je terugkerende facturen in Moneybird. Wat je aanvinkt, komt als contract in het portaal. Moneybird blijft ze
            versturen; het portaal markeert ze als "via Moneybird" en maakt er geen tweede factuur voor.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
          </div>
        ) : isError || !data ? (
          <p className={cn("text-sm", TOON.danger.tekst)}>{error instanceof Error ? error.message : "Ophalen mislukt"}</p>
        ) : voorstellen.length === 0 ? (
          <p className="text-sm text-muted-foreground">Er staan geen actieve terugkerende facturen in Moneybird.</p>
        ) : (
          <ul className="max-h-[55vh] divide-y divide-border overflow-y-auto rounded-xl border border-border">
            {voorstellen.map((v) => {
              const waarom = reden(v);
              return (
                <li key={v.id}>
                  <label className={cn("flex items-start gap-3 px-3 py-2.5 text-sm", !bruikbaar(v) && "opacity-60")}>
                    <Checkbox
                      checked={gekozen.has(v.id)}
                      disabled={!bruikbaar(v)}
                      onCheckedChange={() => wissel(v.id)}
                      className="mt-0.5"
                      aria-label={`${v.contact.naam} inlezen`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate font-medium">
                          {v.klantNaam ?? v.contact.naam}
                          {v.klantNaam && v.klantNaam !== v.contact.naam && (
                            <span className="font-normal text-muted-foreground"> · {v.contact.naam}</span>
                          )}
                        </span>
                        <span className="shrink-0 tabular-nums">
                          {formatEuro(v.bedragCenten)}{" "}
                          <span className="text-muted-foreground">{v.cyclus === "jaarlijks" ? "per jaar" : v.cyclus === "maandelijks" ? "per maand" : v.frequentie}</span>
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
                        {v.omschrijving ?? "Geen omschrijving"}
                        {v.volgende && ` · volgende ${format(parseISO(v.volgende), "d MMM yyyy", { locale: nl })}`}
                      </span>
                      {!v.clientId ? (
                        <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px]">
                          <span className={TOON.warning.tekst}>Geen klant gevonden. Koppel aan:</span>
                          <Select onValueChange={(waarde) => koppel(v, waarde)}>
                            <SelectTrigger className="h-8 w-52" aria-label={`Klant voor ${v.contact.naam}`}>
                              <SelectValue placeholder="Kies een klant" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                              {clients.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </span>
                      ) : (
                        waarom && <span className={cn("mt-0.5 block text-[13px]", TOON.warning.tekst)}>{waarom}</span>
                      )}
                    </span>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label="Openen in Moneybird"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button disabled={!data || gekozen.size === 0 || bezig} onClick={() => void neemOver()}>
            {bezig ? "Bezig…" : `${gekozen.size} ${gekozen.size === 1 ? "contract" : "contracten"} inlezen`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HostingUitMoneybird;
