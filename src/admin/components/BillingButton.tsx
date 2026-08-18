import { useEffect, useState } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Receipt } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "@/admin/components/DatePicker";
import { BILLING_CYCLE, BILLING_CYCLE_ORDER, formatEuro, volgendeTermijn, type BillingCycle } from "@/admin/billing";
import { useSaveClient, type Client } from "@/admin/queries";

/** Radix Select verdraagt geen lege waarde als item. */
const GEEN = "__geen__";

/**
 * De facturatie van één klant, met het invulmenu eraan vast.
 *
 * Bewust geen omweg via het grote bewerkscherm: dit zijn drie velden die je
 * bij een hostingklant af en toe bijstelt, en daarvoor hoef je niet langs
 * contactgegevens en projectfases.
 */
const BillingButton = ({ client }: { client: Client }) => {
  const save = useSaveClient();
  const [open, setOpen] = useState(false);

  const [cyclus, setCyclus] = useState<BillingCycle | "">("");
  const [start, setStart] = useState("");
  const [bedrag, setBedrag] = useState("");

  // Bij openen de opgeslagen waarden inlezen, zodat annuleren vanzelf klopt:
  // wat je niet opslaat, is de volgende keer weer weg.
  useEffect(() => {
    if (!open) return;
    setCyclus(client.billing_cycle ?? "");
    setStart(client.billing_start ?? "");
    setBedrag(client.billing_amount_cents == null ? "" : String(client.billing_amount_cents / 100));
  }, [open, client]);

  const volgende = volgendeTermijn(client.billing_start, client.billing_cycle);

  const opslaan = async () => {
    if (cyclus && !start) {
      toast.error("Vul in wanneer de facturatie is ingegaan");
      return;
    }

    const schoon = bedrag.trim().replace(",", ".");
    if (schoon && !Number.isFinite(Number(schoon))) {
      toast.error("Bedrag moet een getal zijn");
      return;
    }

    try {
      await save.mutateAsync({
        id: client.id,
        values: {
          name: client.name,
          // Zonder cyclus gaan datum en bedrag mee: ze horen bij het contract.
          billing_cycle: cyclus || null,
          billing_start: cyclus ? start || null : null,
          billing_amount_cents: cyclus && schoon ? Math.round(Number(schoon) * 100) : null,
        },
      });
      toast.success(cyclus ? "Facturatie bijgewerkt" : "Facturatie verwijderd");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Facturatie instellen"
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors duration-150 hover:bg-muted"
        >
          <Receipt className="h-4 w-4 shrink-0 text-muted-foreground" />
          {client.billing_cycle ? (
            <>
              <span>{BILLING_CYCLE[client.billing_cycle].label}</span>
              {formatEuro(client.billing_amount_cents) && (
                <span className="tabular-nums">{formatEuro(client.billing_amount_cents)}</span>
              )}
              {volgende && (
                <span className="text-muted-foreground">
                  · {format(volgende, "d MMM", { locale: nl })}
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">Geen facturatie</span>
          )}
        </button>
      </PopoverTrigger>

      {/* Kop, romp en voet met eigen randen: zonder die scheiding lopen de
          labels, velden en de knop als één blok in elkaar over. */}
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium leading-none">Facturatie</p>
          <p className="mt-1 text-xs text-muted-foreground">Wat er periodiek in rekening gaat.</p>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="fb-cyclus" className="text-xs font-normal text-muted-foreground">
              Cyclus
            </Label>
            <Select value={cyclus || GEEN} onValueChange={(v) => setCyclus(v === GEEN ? "" : (v as BillingCycle))}>
              <SelectTrigger id="fb-cyclus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GEEN}>Geen</SelectItem>
                {BILLING_CYCLE_ORDER.map((c) => (
                  <SelectItem key={c} value={c}>
                    {BILLING_CYCLE[c].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Datum en bedrag horen bij een lopend contract; zonder cyclus is er
              niets om ze aan op te hangen. */}
          {cyclus && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-normal text-muted-foreground">Ingegaan op</Label>
                <DatePicker
                  value={start || null}
                  onChange={(waarde) => setStart(waarde ?? "")}
                  aria-label="Ingangsdatum facturatie"
                  className="h-10 w-full border border-input"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fb-bedrag" className="text-xs font-normal text-muted-foreground">
                  Bedrag per {BILLING_CYCLE[cyclus].periode}
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    €
                  </span>
                  <Input
                    id="fb-bedrag"
                    className="pl-7 tabular-nums"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={bedrag}
                    onChange={(e) => setBedrag(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Annuleren
          </Button>
          <Button size="sm" onClick={() => void opslaan()} disabled={save.isPending}>
            Opslaan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BillingButton;
