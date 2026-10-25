import { useMemo, useState } from "react";
import { Archive, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { useContactArchiveren, useMoneybirdContacten, type MoneybirdContactVolledig } from "@/admin/financien";
import { dubbeleContacten } from "@/admin/klantMatch";
import { useClients } from "@/admin/queries";
import { useConfirm } from "@/admin/useConfirm";

/**
 * Contacten die in Moneybird dubbel staan, per groep. Het overbodige contact
 * archiveer je hier; een contact dat aan een klant in het portaal hangt, kan
 * dat niet, want daar lopen de facturen van die klant via.
 */
const DubbeleContacten = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { data, isLoading, isError, error } = useMoneybirdContacten(open);
  const { data: clients = [] } = useClients();
  const archiveer = useContactArchiveren();
  const { vraagBevestiging, dialoog } = useConfirm();
  // Direct uit beeld na archiveren, ook als de lijst van Moneybird nog even de oude is.
  const [weg, setWeg] = useState<Set<string>>(new Set());

  const groepen = useMemo(
    () =>
      dubbeleContacten((data?.contacten ?? []).filter((c) => !weg.has(c.id))).sort((a, b) =>
        a[0]!.naam.localeCompare(b[0]!.naam, "nl"),
      ),
    [data, weg],
  );
  const klantBij = (contactId: string) => clients.find((k) => k.moneybird_contact_id === contactId);

  const archiveren = async (c: MoneybirdContactVolledig) => {
    const ja = await vraagBevestiging({
      titel: `${c.naam} archiveren in Moneybird?`,
      beschrijving:
        "Het contact verdwijnt uit de lijsten in Moneybird. Facturen en offertes van dit contact blijven staan, en je kunt het in Moneybird terugzetten.",
      bevestigLabel: "Archiveren",
      gevaarlijk: false,
    });
    if (!ja) return;
    try {
      await archiveer.mutateAsync(c.id);
      setWeg((huidig) => new Set(huidig).add(c.id));
      toast.success(`${c.naam} gearchiveerd in Moneybird`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Archiveren mislukt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Dubbele contacten in Moneybird</DialogTitle>
          <DialogDescription>
            Contacten die waarschijnlijk hetzelfde bedrijf zijn. Archiveer het contact dat je niet meer gebruikt.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-1 min-h-0 flex-1 space-y-3 overflow-y-auto px-1">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          ) : isError ? (
            <p className={cn("text-sm", TOON.danger.tekst)}>{error instanceof Error ? error.message : "Ophalen mislukt"}</p>
          ) : groepen.length === 0 ? (
            <p className="text-sm text-muted-foreground">Geen dubbele contacten gevonden.</p>
          ) : (
            groepen.map((groep) => (
              <ul key={groep.map((c) => c.id).join("-")} className="divide-y divide-border rounded-xl border border-border">
                {groep.map((c) => {
                  const klant = klantBij(c.id);
                  return (
                    <li key={c.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5 text-sm">
                      <span className="min-w-0 flex-1 basis-48">
                        <span className="block truncate font-medium">{c.naam}</span>
                        <span className="block truncate text-[13px] text-muted-foreground">
                          {klant
                            ? `Gekoppeld aan ${klant.name}`
                            : [c.email, c.plaats].filter(Boolean).join(" · ") || "Geen contactgegevens"}
                        </span>
                      </span>
                      <span className="flex shrink-0 gap-1.5">
                        <Button size="sm" variant="ghost" asChild>
                          <a href={c.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Openen
                          </a>
                        </Button>
                        {!klant && (
                          <Button size="sm" variant="outline" disabled={archiveer.isPending} onClick={() => void archiveren(c)}>
                            <Archive className="h-4 w-4" />
                            Archiveren
                          </Button>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ))
          )}
        </div>
        {dialoog}
      </DialogContent>
    </Dialog>
  );
};

export default DubbeleContacten;
