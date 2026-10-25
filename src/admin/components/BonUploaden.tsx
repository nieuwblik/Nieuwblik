import { useEffect, useRef, useState } from "react";
import { Camera, FileText, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBonnenUploaden } from "@/admin/financien";

const MAX_BESTANDEN = 10;
/** Langste zijde van een foto na verkleinen; ruim genoeg om een bon te lezen. */
const MAX_ZIJDE = 2000;

/**
 * Een foto verkleinen tot hooguit 2000 pixels en als jpeg opslaan: een foto
 * van een telefoon is al gauw 5 MB, verkleind een paar honderd kB en nog
 * prima leesbaar. Lukt het niet (zoals bij HEIC in sommige browsers), dan
 * gaat het origineel mee.
 */
async function verklein(bestand: File): Promise<File> {
  if (!bestand.type.startsWith("image/") || bestand.type === "image/gif") return bestand;
  try {
    const beeld = await createImageBitmap(bestand);
    const schaal = Math.min(1, MAX_ZIJDE / Math.max(beeld.width, beeld.height));
    if (schaal === 1 && bestand.size < 1_500_000) return bestand;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(beeld.width * schaal);
    canvas.height = Math.round(beeld.height * schaal);
    canvas.getContext("2d")?.drawImage(beeld, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((klaar) => canvas.toBlob(klaar, "image/jpeg", 0.85));
    // Alleen nemen als het echt kleiner is; een vlakke png is als jpeg soms groter.
    if (!blob || blob.size >= bestand.size) return bestand;
    return new File([blob], bestand.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return bestand;
  }
}

const grootte = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} kB` : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;

/**
 * Bonnen en inkoopfacturen naar Moneybird: kies een foto of pdf, of maak op
 * je telefoon meteen een foto. Ze komen in de inbox van Moneybird, net alsof
 * je ze mailt, en daar verwerk je ze tot bon of inkoopfactuur.
 */
const BonUploaden = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const upload = useBonnenUploaden();
  const [bestanden, setBestanden] = useState<File[]>([]);
  const [omschrijving, setOmschrijving] = useState("");
  const [bezigMetVerkleinen, setBezigMetVerkleinen] = useState(false);
  const kiezen = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setBestanden([]);
    setOmschrijving("");
  }, [open]);

  const voegToe = async (lijst: FileList | null) => {
    if (!lijst || lijst.length === 0) return;
    setBezigMetVerkleinen(true);
    const nieuw = await Promise.all([...lijst].map(verklein));
    setBezigMetVerkleinen(false);
    setBestanden((huidig) => {
      const samen = [...huidig, ...nieuw];
      if (samen.length > MAX_BESTANDEN) toast.warning(`Hooguit ${MAX_BESTANDEN} bestanden tegelijk; de rest is weggelaten.`);
      return samen.slice(0, MAX_BESTANDEN);
    });
  };

  const verstuur = async () => {
    try {
      const r = await upload.mutateAsync({ bestanden, omschrijving });
      if (r.gelukt.length > 0) {
        toast.success(
          r.gelukt.length === 1 ? "De bon staat in je Moneybird-inbox" : `${r.gelukt.length} bonnen staan in je Moneybird-inbox`,
          {
            description: "Verwerk ze daar tot bon of inkoopfactuur.",
            action: { label: "Openen", onClick: () => window.open(r.gelukt[0]!.url, "_blank", "noopener") },
          },
        );
      }
      if (r.mislukt.length > 0) {
        toast.error(`${r.mislukt.length} niet gelukt`, {
          description: r.mislukt.map((m) => `${m.naam}: ${m.reden}`).join("\n"),
        });
        // Wat mislukt is blijft staan om het nog eens te proberen.
        setBestanden((huidig) => huidig.filter((b) => r.mislukt.some((m) => m.naam === b.name)));
        return;
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Uploaden mislukt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bon of inkoopfactuur uploaden</DialogTitle>
          <DialogDescription>
            Komt in je Moneybird-inbox, net alsof je hem mailt. Daar verwerk je hem tot bon of inkoopfactuur.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => camera.current?.click()}>
              <Camera className="h-4 w-4" />
              Foto maken
            </Button>
            <Button type="button" variant="outline" onClick={() => kiezen.current?.click()}>
              <Paperclip className="h-4 w-4" />
              Bestand kiezen
            </Button>
            {/* Op een telefoon opent capture meteen de camera; op een computer kiest hij een bestand. */}
            <input
              ref={camera}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                void voegToe(e.target.files);
                e.target.value = "";
              }}
            />
            <input
              ref={kiezen}
              type="file"
              accept="image/*,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                void voegToe(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {bestanden.length > 0 && (
            <ul className="divide-y divide-border rounded-lg border border-border text-sm">
              {bestanden.map((b, i) => (
                <li key={`${b.name}-${i}`} className="flex items-center gap-3 px-3 py-2">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{b.name}</span>
                  <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">{grootte(b.size)}</span>
                  <button
                    type="button"
                    aria-label={`${b.name} weghalen`}
                    onClick={() => setBestanden((huidig) => huidig.filter((_, j) => j !== i))}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {bezigMetVerkleinen && <p className="text-[13px] text-muted-foreground">Foto's verkleinen…</p>}

          <div className="space-y-1.5">
            <Label htmlFor="bon-omschrijving">Omschrijving (mag leeg)</Label>
            <Input
              id="bon-omschrijving"
              placeholder="Bijvoorbeeld de winkel of waarvoor het was"
              value={omschrijving}
              maxLength={100}
              onChange={(e) => setOmschrijving(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button disabled={bestanden.length === 0 || upload.isPending || bezigMetVerkleinen} onClick={() => void verstuur()}>
            {upload.isPending
              ? "Bezig…"
              : bestanden.length > 1
                ? `${bestanden.length} bestanden uploaden`
                : "Uploaden"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BonUploaden;
