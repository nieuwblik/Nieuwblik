import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ContactKiezer from "@/admin/components/ContactKiezer";
import { leesBedrag } from "@/admin/billing";
import { TOON } from "@/admin/constants";
import {
  formatBedrag,
  useDocumentGegevens,
  useDocumentMaken,
  useMoneybirdContacten,
  type DocumentOntvanger,
  type MoneybirdContact,
} from "@/admin/financien";
import SegmentedControl from "@/admin/ui/SegmentedControl";
import { useConfirm } from "@/admin/useConfirm";

type Soort = "offerte" | "factuur";

interface Regel {
  sleutel: number;
  omschrijving: string;
  aantal: string;
  prijs: string;
  btwId: string | null;
  productId: string | null;
}

export interface DocumentVoor {
  ontvanger: DocumentOntvanger;
  /** Zoals hij in het venster en in de bevestiging staat. */
  naam: string;
  email?: string | null | undefined;
}

interface DocumentOpstellenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  soort?: Soort | undefined;
  /** Weglaten: dan kies je het contact in het venster. */
  voor?: DocumentVoor | undefined;
  /** Een eerste regel, bijvoorbeeld de vraag uit een aanvraag. */
  eersteRegel?: string | undefined;
  /** Na het aanmaken, bijvoorbeeld om een aanvraag op "offerte" te zetten. */
  onGemaakt?: ((soort: Soort) => void) | undefined;
}

let volgendeSleutel = 1;
const legeRegel = (btwId: string | null, omschrijving = ""): Regel => ({
  sleutel: volgendeSleutel++,
  omschrijving,
  aantal: "1",
  prijs: "",
  btwId,
  productId: null,
});

const GEEN_PRODUCT = "__geen__";

/**
 * Een offerte of factuur opstellen in Moneybird, zonder het portaal uit te
 * gaan. Regels met omschrijving, aantal, prijs (excl. btw) en btw-tarief;
 * een vast product uit Moneybird vult ze in. Opslaan maakt een concept in
 * Moneybird; versturen mailt hem meteen naar de klant, na een bevestiging.
 */
const DocumentOpstellen = ({
  open,
  onOpenChange,
  soort: beginSoort = "offerte",
  voor,
  eersteRegel,
  onGemaakt,
}: DocumentOpstellenProps) => {
  const { data: gegevens } = useDocumentGegevens(open);
  const { data: contactData } = useMoneybirdContacten(open && !voor);
  const maken = useDocumentMaken();
  const { vraagBevestiging, dialoog } = useConfirm();
  const [soort, setSoort] = useState<Soort>(beginSoort);
  const [contactId, setContactId] = useState<string | null>(null);
  const [ontvanger, setOntvanger] = useState<DocumentVoor | null>(voor ?? null);
  const [regels, setRegels] = useState<Regel[]>([]);
  const [referentie, setReferentie] = useState("");
  const [toelichting, setToelichting] = useState("");
  const [kandidaten, setKandidaten] = useState<MoneybirdContact[] | null>(null);

  const producten = useMemo(() => gegevens?.producten ?? [], [gegevens]);
  const tarieven = useMemo(() => gegevens?.btwTarieven ?? [], [gegevens]);
  const standaardBtw = (tarieven.find((t) => t.percentage === 21) ?? tarieven[0])?.id ?? null;

  useEffect(() => {
    if (!open) return;
    setSoort(beginSoort);
    setContactId(null);
    setOntvanger(voor ?? null);
    setRegels([legeRegel(standaardBtw, eersteRegel ?? "")]);
    setReferentie("");
    setToelichting("");
    setKandidaten(null);
    // Alleen bij openen opnieuw beginnen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Btw-tarief invullen zodra de tarieven binnen zijn.
  useEffect(() => {
    if (standaardBtw) setRegels((lijst) => lijst.map((r) => (r.btwId ? r : { ...r, btwId: standaardBtw })));
  }, [standaardBtw]);

  const zet = (sleutel: number, wijziging: Partial<Regel>) =>
    setRegels((lijst) => lijst.map((r) => (r.sleutel === sleutel ? { ...r, ...wijziging } : r)));

  const kiesProduct = (r: Regel, productId: string) => {
    if (productId === GEEN_PRODUCT) return zet(r.sleutel, { productId: null });
    const p = producten.find((x) => x.id === productId);
    if (!p) return;
    zet(r.sleutel, {
      productId: p.id,
      omschrijving: p.omschrijving || p.naam,
      prijs: p.prijs.toFixed(2).replace(".", ","),
      btwId: p.btwId ?? r.btwId,
    });
  };

  const totalen = useMemo(() => {
    let excl = 0;
    let btw = 0;
    for (const r of regels) {
      const bedrag = (Number.parseFloat(r.aantal.replace(",", ".")) || 0) * (leesBedrag(r.prijs) ?? 0);
      excl += bedrag;
      btw += (bedrag * (tarieven.find((t) => t.id === r.btwId)?.percentage ?? 0)) / 100;
    }
    return { excl, btw, incl: excl + btw };
  }, [regels, tarieven]);

  const gekozenContact = contactData?.contacten.find((c) => c.id === contactId);
  const huidigeOntvanger: DocumentVoor | null =
    ontvanger ??
    (gekozenContact
      ? { ontvanger: { soort: "contact", contactId: gekozenContact.id }, naam: gekozenContact.naam, email: gekozenContact.email }
      : null);

  const fout = !huidigeOntvanger
    ? "Kies voor wie het is."
    : regels.some((r) => !r.omschrijving.trim())
      ? "Elke regel heeft een omschrijving nodig."
      : regels.some((r) => leesBedrag(r.prijs) === null)
        ? "Elke regel heeft een prijs nodig."
        : regels.some((r) => !(Number.parseFloat(r.aantal.replace(",", ".")) > 0))
          ? "Elke regel heeft een aantal nodig."
          : null;

  const opslaan = async (versturen: boolean, overschrijf?: DocumentOntvanger) => {
    if (fout || !huidigeOntvanger) return;
    const naamDoc = soort === "offerte" ? "offerte" : "factuur";
    if (versturen) {
      const ja = await vraagBevestiging({
        titel: `${soort === "offerte" ? "Offerte" : "Factuur"} versturen?`,
        beschrijving: `Moneybird mailt de ${naamDoc} meteen naar ${huidigeOntvanger.naam}${huidigeOntvanger.email ? ` (${huidigeOntvanger.email})` : ""}, voor ${formatBedrag(totalen.incl)} incl. btw. Dit kun je niet terugdraaien.`,
        bevestigLabel: `${soort === "offerte" ? "Offerte" : "Factuur"} versturen`,
        gevaarlijk: false,
      });
      if (!ja) return;
    }
    try {
      const resultaat = await maken.mutateAsync({
        soort,
        ontvanger: overschrijf ?? huidigeOntvanger.ontvanger,
        referentie,
        toelichting: soort === "offerte" ? toelichting : "",
        versturen,
        regels: regels.map((r) => ({
          omschrijving: r.omschrijving.trim(),
          aantal: Number.parseFloat(r.aantal.replace(",", ".")),
          prijs: leesBedrag(r.prijs) ?? 0,
          btwId: r.btwId,
          productId: r.productId,
        })),
      });
      if (!resultaat.ok) {
        setKandidaten(resultaat.kiesContact);
        return;
      }
      toast.success(
        resultaat.verstuurd
          ? `${soort === "offerte" ? "Offerte" : "Factuur"} verstuurd naar ${huidigeOntvanger.naam}`
          : `${soort === "offerte" ? "Offerte" : "Factuur"} staat als concept in Moneybird`,
        { action: { label: "Openen", onClick: () => window.open(resultaat.url, "_blank", "noopener") } },
      );
      onGemaakt?.(soort);
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Opslaan mislukt");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{soort === "offerte" ? "Offerte opstellen" : "Factuur opstellen"}</DialogTitle>
            <DialogDescription>
              Bedragen zijn exclusief btw. Opslaan zet hem als concept in Moneybird; versturen mailt hem meteen naar de
              klant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex flex-wrap items-end gap-4">
              <SegmentedControl
                label="Soort"
                opties={[
                  { waarde: "offerte", label: "Offerte" },
                  { waarde: "factuur", label: "Factuur" },
                ]}
                waarde={soort}
                onChange={setSoort}
              />
              <div className="min-w-[14rem] flex-1 space-y-1.5">
                <Label>Voor</Label>
                {ontvanger ? (
                  <div className="flex h-10 items-center rounded-md border border-input px-3 text-sm">
                    <span className="truncate">{ontvanger.naam}</span>
                    {ontvanger.email && <span className="ml-2 truncate text-muted-foreground">{ontvanger.email}</span>}
                  </div>
                ) : (
                  <Select value={contactId ?? ""} onValueChange={setContactId}>
                    <SelectTrigger>
                      <SelectValue placeholder={contactData ? "Kies een contact uit Moneybird" : "Contacten laden…"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {(contactData?.contacten ?? []).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.naam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="min-w-[12rem] flex-1 space-y-1.5">
                <Label htmlFor="document-referentie">Referentie</Label>
                <Input
                  id="document-referentie"
                  value={referentie}
                  onChange={(e) => setReferentie(e.target.value)}
                  placeholder="Bijvoorbeeld: nieuwe website"
                  maxLength={100}
                />
              </div>
            </div>

            {soort === "offerte" && (
              <div className="space-y-1.5">
                <Label htmlFor="document-toelichting">Toelichting boven de regels</Label>
                <Textarea
                  id="document-toelichting"
                  value={toelichting}
                  onChange={(e) => setToelichting(e.target.value)}
                  rows={2}
                  className="min-h-[3.5rem] resize-y [field-sizing:content]"
                  placeholder="Optioneel"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="hidden grid-cols-[minmax(0,1fr)_4.5rem_6.5rem_8rem_2rem] gap-2 px-1 text-[13px] text-muted-foreground sm:grid">
                <span>Omschrijving</span>
                <span>Aantal</span>
                <span>Prijs</span>
                <span>Btw</span>
                <span />
              </div>
              {regels.map((r) => (
                <div key={r.sleutel} className="rounded-xl border border-border p-2 sm:border-0 sm:p-0">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_4.5rem_6.5rem_8rem_2rem]">
                    <div className="col-span-2 space-y-1.5 sm:col-span-1">
                      {producten.length > 0 && (
                        <Select value={r.productId ?? GEEN_PRODUCT} onValueChange={(v) => kiesProduct(r, v)}>
                          <SelectTrigger className="h-8 text-[13px] text-muted-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-72">
                            <SelectItem value={GEEN_PRODUCT}>Geen vast product</SelectItem>
                            {producten.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.naam} · {formatBedrag(p.prijs)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <Textarea
                        value={r.omschrijving}
                        onChange={(e) => zet(r.sleutel, { omschrijving: e.target.value })}
                        rows={1}
                        placeholder="Omschrijving"
                        aria-label="Omschrijving"
                        className="min-h-10 resize-y [field-sizing:content]"
                      />
                    </div>
                    <Input
                      value={r.aantal}
                      onChange={(e) => zet(r.sleutel, { aantal: e.target.value })}
                      inputMode="decimal"
                      aria-label="Aantal"
                      className="self-end"
                    />
                    <Input
                      value={r.prijs}
                      onChange={(e) => zet(r.sleutel, { prijs: e.target.value })}
                      inputMode="decimal"
                      placeholder="0,00"
                      aria-label="Prijs excl. btw"
                      className="self-end"
                    />
                    <Select value={r.btwId ?? ""} onValueChange={(v) => zet(r.sleutel, { btwId: v })}>
                      <SelectTrigger className="self-end" aria-label="Btw-tarief">
                        <SelectValue placeholder="Btw" />
                      </SelectTrigger>
                      <SelectContent>
                        {tarieven.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.naam}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      onClick={() => setRegels((lijst) => (lijst.length > 1 ? lijst.filter((x) => x.sleutel !== r.sleutel) : lijst))}
                      disabled={regels.length === 1}
                      aria-label="Regel verwijderen"
                      className="flex h-10 w-8 items-center justify-center self-end rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setRegels((lijst) => [...lijst, legeRegel(standaardBtw)])}>
                <Plus className="h-4 w-4" />
                Regel toevoegen
              </Button>
            </div>

            <dl className="ml-auto w-full max-w-xs space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotaal</dt>
                <dd className="tabular-nums">{formatBedrag(totalen.excl)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Btw</dt>
                <dd className="tabular-nums">{formatBedrag(totalen.btw)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-1 font-medium">
                <dt>Totaal</dt>
                <dd className="tabular-nums">{formatBedrag(totalen.incl)}</dd>
              </div>
            </dl>

            {fout && regels.some((r) => r.omschrijving || r.prijs) && (
              <p className={cn("text-[13px]", TOON.warning.tekst)}>{fout}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button variant="outline" disabled={Boolean(fout) || maken.isPending} onClick={() => void opslaan(false)}>
              Als concept opslaan
            </Button>
            <Button disabled={Boolean(fout) || maken.isPending} onClick={() => void opslaan(true)}>
              {maken.isPending ? "Bezig…" : "Opslaan en versturen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ContactKiezer
        kandidaten={kandidaten}
        klantNaam={huidigeOntvanger?.naam ?? ""}
        bezig={maken.isPending}
        onKies={(id) => {
          setKandidaten(null);
          setOntvanger((o) => (o ? { ...o, ontvanger: { soort: "contact", contactId: id } } : o));
          void opslaan(false, { soort: "contact", contactId: id });
        }}
        onClose={() => setKandidaten(null)}
      />
      {dialoog}
    </>
  );
};

export default DocumentOpstellen;
