import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Bell, Banknote, ExternalLink, FileDown, MoreHorizontal, Scissors, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TOON, type Toon } from "@/admin/constants";
import { daysUntil } from "@/admin/format";
import {
  isKleineRest,
  formatBedrag,
  isCredit,
  isTeLaatFactuur,
  kanHerinneren,
  useFactuurActie,
  type OpenFactuur,
} from "@/admin/financien";
import { useClients, type Client } from "@/admin/queries";
import BetalingDialoog from "@/admin/components/BetalingDialoog";
import StatusPill from "@/admin/ui/StatusPill";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";
import { useConfirm } from "@/admin/useConfirm";

const FACTUURSTATUS: Record<string, { label: string; toon: Toon }> = {
  late: { label: "Te laat", toon: "danger" },
  reminded: { label: "Herinnerd", toon: "warning" },
  pending_payment: { label: "Betaling onderweg", toon: "info" },
  open: { label: "Open", toon: "neutral" },
};

/** Hoe lang een factuur nog heeft, of hoe lang hij al over de datum is. */
const vervalLabel = (f: OpenFactuur) => {
  if (isCredit(f)) return "Tegoed voor de klant";
  const dagen = daysUntil(f.vervaldatum);
  if (dagen === null) return "Geen vervaldatum";
  if (dagen < 0) return `${Math.abs(dagen)} ${Math.abs(dagen) === 1 ? "dag" : "dagen"} te laat`;
  if (dagen === 0) return "Vervalt vandaag";
  return `Nog ${dagen} ${dagen === 1 ? "dag" : "dagen"}`;
};

/** "Toptas Consultancy B.V." en "toptas consultancy" zijn dezelfde klant. */
const sleutel = (naam: string) =>
  naam
    .toLowerCase()
    .replace(/\b(b\.?v\.?|v\.?o\.?f\.?|n\.?v\.?|holding)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

/** De klant in het portaal bij een Moneybird-contact: op e-mailadres, anders op naam. */
function zoekKlant(f: OpenFactuur, clients: Client[]): Client | null {
  const email = f.email?.toLowerCase();
  if (email) {
    const opMail = clients.find((c) => c.email?.toLowerCase() === email);
    if (opMail) return opMail;
  }
  const naam = sleutel(f.klant);
  return naam ? (clients.find((c) => sleutel(c.name) === naam) ?? null) : null;
}

const ontvanger = (f: OpenFactuur) => f.email ?? "het adres dat in Moneybird staat";

/**
 * De openstaande facturen met wat je ermee kunt doen: een herinnering
 * sturen (los of alle te late tegelijk), een betaling registreren, een
 * kleine rest afboeken, de pdf openen of naar de klant in het portaal.
 * Alles wat iets in Moneybird verandert of een mail verstuurt, vraagt eerst
 * om bevestiging.
 */
export function useOpenFacturen(facturen: OpenFactuur[]) {
  const { data: clients = [] } = useClients();
  const actie = useFactuurActie();
  const { bedrag } = useBedragenVerborgen();
  const { vraagBevestiging, dialoog } = useConfirm();
  const [betaling, setBetaling] = useState<OpenFactuur | null>(null);

  const klanten = useMemo(() => new Map(facturen.map((f) => [f.id, zoekKlant(f, clients)])), [facturen, clients]);
  // Een rest van een paar cent hoort niet in een rondje herinneringen; die boek je af.
  const teHerinneren = facturen.filter((f) => kanHerinneren(f) && !isKleineRest(f));

  const herinner = async (lijst: OpenFactuur[]) => {
    const enkel = lijst.length === 1 ? lijst[0]! : null;
    const ja = await vraagBevestiging({
      titel: enkel ? "Herinnering versturen?" : `${lijst.length} herinneringen versturen?`,
      beschrijving: enkel
        ? `Moneybird mailt ${enkel.klant} meteen een herinnering voor factuur ${enkel.nummer} (${formatBedrag(enkel.open)}), naar ${ontvanger(enkel)}.`
        : "Moneybird mailt deze klanten meteen een herinnering. Meerdere facturen van dezelfde klant gaan samen in één mail.",
      inhoud: enkel ? undefined : (
        <ul className="max-h-60 divide-y divide-border overflow-y-auto rounded-lg border border-border text-sm">
          {lijst.map((f) => (
            <li key={f.id} className="flex items-baseline justify-between gap-3 px-3 py-2">
              <span className="min-w-0">
                <span className="block truncate font-medium">{f.klant}</span>
                <span className="block truncate text-[13px] text-muted-foreground">
                  {f.nummer} · {ontvanger(f)}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{formatBedrag(f.open)}</span>
            </li>
          ))}
        </ul>
      ),
      bevestigLabel: enkel ? "Herinnering versturen" : `${lijst.length} versturen`,
      gevaarlijk: false,
    });
    if (!ja) return;
    try {
      await actie.mutateAsync({ actie: "herinnering", ids: lijst.map((f) => f.id) });
      toast.success(enkel ? `Herinnering verstuurd naar ${enkel.klant}` : `${lijst.length} herinneringen verstuurd`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Versturen mislukt");
    }
  };

  const boekAf = async (f: OpenFactuur) => {
    const ja = await vraagBevestiging({
      titel: `Rest van ${formatBedrag(f.open)} afboeken?`,
      beschrijving: `Factuur ${f.nummer} van ${f.klant} staat daarna op betaald. Moneybird boekt het verschil als betalingsverschil; de klant krijgt hier geen bericht over.`,
      bevestigLabel: "Afboeken",
      gevaarlijk: false,
    });
    if (!ja) return;
    try {
      await actie.mutateAsync({ actie: "afboeken", id: f.id });
      toast.success(`Rest afgeboekt, ${f.nummer} staat op betaald`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Afboeken mislukt");
    }
  };

  const openPdf = async (f: OpenFactuur) => {
    // Het venster meteen openen, binnen de klik: een venster dat pas na het
    // wachten op de server opengaat, houdt de browser tegen als pop-up.
    const venster = window.open("", "_blank");
    try {
      const { url } = await actie.mutateAsync({ actie: "pdf", id: f.id });
      if (!url) throw new Error("Geen pdf ontvangen");
      if (venster) {
        venster.opener = null;
        venster.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (e) {
      venster?.close();
      toast.error(e instanceof Error ? e.message : "De pdf kon niet worden geopend");
    }
  };

  const herinnerAlles =
    teHerinneren.length > 0 ? (
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-2.5 text-[13px]"
        disabled={actie.isPending}
        onClick={() => void herinner(teHerinneren)}
      >
        <Bell className="h-3.5 w-3.5" />
        Herinner alle te late
      </Button>
    ) : null;

  const lijst = (
    <ul className="p-vervaag">
      {facturen.map((f) => {
        const credit = isCredit(f);
        const laat = isTeLaatFactuur(f);
        const status = credit
          ? { label: "Creditfactuur", toon: "neutral" as Toon }
          : laat && f.status === "open"
            ? FACTUURSTATUS["late"]!
            : (FACTUURSTATUS[f.status] ?? FACTUURSTATUS["open"]!);
        const klant = klanten.get(f.id);
        const kleineRest = isKleineRest(f);
        const kanBetalen = !credit && f.status !== "pending_payment";
        return (
          <li key={f.id} className="p-rij flex items-center gap-3 rounded-lg px-2 py-2 text-sm">
            <span className="min-w-0 flex-1">
              {klant ? (
                <Link to={`/admin/klanten/${klant.id}`} className="block truncate font-medium hover:underline">
                  {f.klant}
                </Link>
              ) : (
                <span className="block truncate font-medium">{f.klant}</span>
              )}
              <span className={cn("block text-[13px] text-muted-foreground", laat && TOON.danger.tekst)}>
                {f.nummer ?? "Concept"} · {vervalLabel(f)}
                {kleineRest && <span className="text-muted-foreground"> · restbedrag</span>}
              </span>
            </span>
            <StatusPill toon={status.toon}>{status.label}</StatusPill>
            <span className="w-24 text-right font-medium tabular-nums">{bedrag(f.open)}</span>
            {/* Niet modaal: de menu-items openen zelf een dialoog, en twee modale lagen na elkaar laten de pagina soms onklikbaar achter. */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Acties voor factuur ${f.nummer ?? f.klant}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-90 data-[state=open]:bg-muted data-[state=open]:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                {kanHerinneren(f) && (
                  <DropdownMenuItem onSelect={() => void herinner([f])}>
                    <Bell className="h-4 w-4" />
                    Herinnering sturen
                  </DropdownMenuItem>
                )}
                {kanBetalen && (
                  <DropdownMenuItem onSelect={() => setBetaling(f)}>
                    <Banknote className="h-4 w-4" />
                    Betaling registreren
                  </DropdownMenuItem>
                )}
                {kleineRest && (
                  <DropdownMenuItem onSelect={() => void boekAf(f)}>
                    <Scissors className="h-4 w-4" />
                    Rest van {formatBedrag(f.open)} afboeken
                  </DropdownMenuItem>
                )}
                {(kanHerinneren(f) || kanBetalen || kleineRest) && <DropdownMenuSeparator />}
                <DropdownMenuItem onSelect={() => void openPdf(f)}>
                  <FileDown className="h-4 w-4" />
                  Pdf openen
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={f.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Openen in Moneybird
                  </a>
                </DropdownMenuItem>
                {klant && (
                  <DropdownMenuItem asChild>
                    <Link to={`/admin/klanten/${klant.id}`}>
                      <UserRound className="h-4 w-4" />
                      Naar {klant.name}
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        );
      })}
    </ul>
  );

  return {
    lijst,
    herinnerAlles,
    dialogen: (
      <>
        {dialoog}
        <BetalingDialoog factuur={betaling} onClose={() => setBetaling(null)} />
      </>
    ),
  };
}
