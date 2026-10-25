import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { leesBedrag } from "@/admin/billing";
import { TOON } from "@/admin/constants";
import { formatBedrag, useUrenFactureren, type MoneybirdContact } from "@/admin/financien";
import type { Client } from "@/admin/queries";
import { duurMinuten, factuurRegels, formatDuur, nogTeFactureren, uurtariefVoor, type UrenRegel } from "@/admin/uren";

const ALLES = "alles";

interface UrenFacturerenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  client: Client | null;
  /** Alle uren van het project; het venster kiest zelf wat nog te factureren is. */
  regels: UrenRegel[];
}

/**
 * Uren van een project als conceptfactuur in Moneybird. Er gaat niets naar de
 * klant: de factuur komt als concept klaar te staan en je verstuurt hem daar.
 * De uren worden daarna als gefactureerd gemarkeerd, zodat ze niet nog eens
 * op een factuur komen.
 *
 * Het tarief staat klaar: dat van de klant, anders het standaardtarief. Pas
 * je het aan, dan onthoudt de serverfunctie het bij de klant.
 */
const UrenFactureren = ({ open, onOpenChange, projectId, client, regels }: UrenFacturerenProps) => {
  const factureer = useUrenFactureren();
  const [maand, setMaand] = useState(ALLES);
  const [tarief, setTarief] = useState("");
  const [kandidaten, setKandidaten] = useState<MoneybirdContact[] | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  const vrij = useMemo(() => regels.filter(nogTeFactureren), [regels]);
  const maanden = useMemo(() => {
    const lijst = new Map<string, number>();
    for (const r of vrij) {
      const sleutel = format(new Date(r.started_at), "yyyy-MM");
      lijst.set(sleutel, (lijst.get(sleutel) ?? 0) + duurMinuten(r));
    }
    return [...lijst.entries()].sort(([a], [b]) => b.localeCompare(a));
  }, [vrij]);

  const beginTarief = uurtariefVoor(client);
  useEffect(() => {
    if (!open) return;
    setMaand(ALLES);
    setTarief(beginTarief.toFixed(2).replace(".", ","));
    setKandidaten(null);
    setContactId(null);
  }, [open, beginTarief]);

  const gekozen = maand === ALLES ? vrij : vrij.filter((r) => format(new Date(r.started_at), "yyyy-MM") === maand);
  const regelsOpFactuur = factuurRegels(gekozen);
  const uurtarief = leesBedrag(tarief);
  const totaal = uurtarief ? regelsOpFactuur.reduce((som, g) => som + g.uren * uurtarief, 0) : null;
  const kanMaken = gekozen.length > 0 && uurtarief !== null && uurtarief > 0 && (kandidaten === null || contactId !== null);

  const maak = async () => {
    if (!kanMaken || uurtarief === null) return;
    try {
      const resultaat = await factureer.mutateAsync({
        projectId,
        urenIds: gekozen.map((r) => r.id),
        uurtarief,
        ...(contactId ? { contactId } : {}),
      });
      if (!resultaat.ok) {
        setKandidaten(resultaat.kiesContact);
        return;
      }
      if (resultaat.waarschuwing) toast.warning(resultaat.waarschuwing);
      toast.success("Conceptfactuur staat klaar in Moneybird", {
        action: { label: "Openen", onClick: () => window.open(resultaat.factuurUrl, "_blank", "noopener") },
      });
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Factureren mislukt");
    }
  };

  const maandLabel = (sleutel: string) => format(new Date(`${sleutel}-01T12:00:00`), "LLLL yyyy", { locale: nl });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Uren factureren</DialogTitle>
          <DialogDescription>
            De uren komen als conceptfactuur in Moneybird{client ? ` voor ${client.name}` : ""}. Er gaat niets naar de klant:
            je bekijkt en verstuurt de factuur daar zelf.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void maak();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
            <div className="space-y-1.5">
              <Label>Welke uren</Label>
              <Select value={maand} onValueChange={setMaand}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALLES}>
                    Alles wat nog openstaat ({formatDuur(vrij.reduce((t, r) => t + duurMinuten(r), 0))})
                  </SelectItem>
                  {maanden.map(([sleutel, minuten]) => (
                    <SelectItem key={sleutel} value={sleutel}>
                      <span className="first-letter:uppercase">{maandLabel(sleutel)}</span> ({formatDuur(minuten)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uurtarief">Uurtarief excl. btw</Label>
              <Input
                id="uurtarief"
                inputMode="decimal"
                placeholder="0,00"
                value={tarief}
                onChange={(e) => setTarief(e.target.value)}
              />
            </div>
          </div>

          {regelsOpFactuur.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border text-sm">
              <ul className="max-h-56 divide-y divide-border overflow-y-auto">
                {regelsOpFactuur.map((g) => (
                  <li key={g.omschrijving} className="flex items-baseline gap-3 px-3 py-2">
                    <span className="min-w-0 flex-1 truncate">{g.omschrijving}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {g.uren.toLocaleString("nl-NL", { maximumFractionDigits: 2 })} uur
                    </span>
                    <span className="w-20 shrink-0 text-right tabular-nums">
                      {uurtarief ? formatBedrag(g.uren * uurtarief) : "–"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-between gap-3 border-t border-border bg-muted/40 px-3 py-2 font-medium">
                <span>Totaal excl. btw</span>
                <span className="tabular-nums">{totaal === null ? "–" : formatBedrag(totaal)}</span>
              </div>
            </div>
          )}

          {kandidaten !== null &&
            (kandidaten.length === 0 ? (
              <p className={cn("text-[13px]", TOON.danger.tekst)}>
                Er staat geen contact voor {client?.name ?? "deze klant"} in Moneybird. Maak het contact daar eerst aan en
                probeer het dan opnieuw.
              </p>
            ) : (
              <fieldset className="space-y-2">
                <legend className="mb-2 text-sm">Welk Moneybird-contact hoort bij {client?.name ?? "deze klant"}?</legend>
                {kandidaten.map((c) => (
                  <label
                    key={c.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50",
                      contactId === c.id && "border-foreground",
                    )}
                  >
                    <input
                      type="radio"
                      name="contact"
                      value={c.id}
                      checked={contactId === c.id}
                      onChange={() => setContactId(c.id)}
                      className="accent-foreground"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{c.naam}</span>
                      {c.email && <span className="block truncate text-[13px] text-muted-foreground">{c.email}</span>}
                    </span>
                  </label>
                ))}
              </fieldset>
            ))}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={!kanMaken || factureer.isPending}>
              {factureer.isPending ? "Bezig…" : "Conceptfactuur maken"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UrenFactureren;
