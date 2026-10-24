import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { History, Mail, PenLine, RotateCw, Send, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/admin/components/EmptyState";
import MailOntvangers, { type OntvangersTab } from "@/admin/components/MailOntvangers";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACTIVE_PROJECT_STATUSES } from "@/admin/constants";
import { useConfirm } from "@/admin/useConfirm";
import { supabase } from "@/integrations/supabase/client";
import { adminKeys, useClients, useMailings, type Client } from "@/admin/queries";
import { useCombinedRows } from "@/admin/rows";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";

type Status = "actief" | "prospect" | "inactief";

const GROEPEN: { status: Status; label: string }[] = [
  { status: "actief", label: "Actieve klanten" },
  { status: "prospect", label: "Prospects" },
  { status: "inactief", label: "Oud-klanten" },
];

const TABS: OntvangersTab[] = ["ontvangers", "zonder-email", "afgemeld"];

const datum = (iso: string) =>
  new Date(iso).toLocaleString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const heeftEmail = (k: Client) => Boolean(k.email?.includes("@"));

/**
 * Alle klanten (of een selectie) in één keer mailen, bijvoorbeeld over nieuwe
 * functies. Elke klant krijgt een eigen mail met zijn naam en een afmeldlink;
 * het versturen gebeurt in de edge function send-mailing.
 *
 * Je ziet vooraf precies wie de mail krijgt en kunt mensen uitvinken; wie
 * geen e-mailadres heeft, vul je op dezelfde pagina aan.
 */
const Mailen = () => {
  const queryClient = useQueryClient();
  const { user, displayName } = useAdminAuth();
  // Zelfde afzender als in de edge function: de admin zelf bij een @nieuwblik.com-adres.
  const eigenAdres = (user?.email ?? "").toLowerCase();
  const persoonlijk = eigenAdres.endsWith("@nieuwblik.com");
  const volledigeNaam = displayName && displayName !== user?.email ? displayName.trim() : "";
  const afzender = persoonlijk
    ? `${volledigeNaam ? `${volledigeNaam.split(/\s+/)[0]} van Nieuwblik` : "Nieuwblik"} <${eigenAdres}>`
    : "Nieuwblik <contact@nieuwblik.com>";
  const { data: klanten = [], isLoading } = useClients();
  const { rows } = useCombinedRows();
  const { vraagBevestiging, dialoog } = useConfirm();
  const [groepen, setGroepen] = useState<Status[]>(["actief"]);
  const [alleenLopend, setAlleenLopend] = useState(false);
  const [alleenHosting, setAlleenHosting] = useState(false);
  const [uitgesloten, setUitgesloten] = useState<Set<string>>(() => new Set());
  const [onderwerp, setOnderwerp] = useState("");
  const [tekst, setTekst] = useState("Hoi {naam},\n\n");
  const [bezig, setBezig] = useState<"test" | "echt" | null>(null);
  // Het tabblad staat in de URL, zodat "22 klanten zonder e-mailadres" op het
  // dashboard meteen op de lijst opent waar je ze aanvult.
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("ontvangers") as OntvangersTab | null;
  const tab: OntvangersTab = tabParam && TABS.includes(tabParam) ? tabParam : "ontvangers";
  const zetTab = (nieuw: OntvangersTab) =>
    setSearchParams(nieuw === "ontvangers" ? {} : { ontvangers: nieuw }, { replace: true });

  /** Opent een tabblad van het ontvangerspaneel en scrolt ernaartoe. */
  const naarOntvangers = (nieuw: OntvangersTab) => {
    zetTab(nieuw);
    document.getElementById("ontvangers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { data: mailings = [], isError: mailingsFout, refetch: mailingsOpnieuw, isFetching: mailingsLaden } = useMailings(20);

  // De selectie: gekozen groepen, eventueel versmald tot lopend werk of een
  // hostingcontract. Daaruit drie lijsten: wie de mail kan krijgen, wie geen
  // adres heeft en wie zich heeft afgemeld. Elk adres krijgt één mail.
  const selectie = useMemo(() => {
    const lopend = new Set(
      rows.filter((r) => r.status && ACTIVE_PROJECT_STATUSES.includes(r.status)).map((r) => r.client.id),
    );
    const inSelectie = klanten.filter(
      (k) =>
        groepen.includes(k.status as Status) &&
        (!alleenLopend || lopend.has(k.id)) &&
        (!alleenHosting || Boolean(k.billing_cycle && k.billing_start)),
    );
    const gezien = new Set<string>();
    const ontvangers = inSelectie.filter((k) => {
      if (!heeftEmail(k) || k.mail_afgemeld_op) return false;
      const adres = k.email!.trim().toLowerCase();
      if (gezien.has(adres)) return false;
      gezien.add(adres);
      return true;
    });
    return {
      ontvangers,
      zonderEmail: inSelectie.filter((k) => !heeftEmail(k)),
      afgemeld: inSelectie.filter((k) => heeftEmail(k) && k.mail_afgemeld_op),
    };
  }, [klanten, rows, groepen, alleenLopend, alleenHosting]);

  const gekozen = selectie.ontvangers.filter((k) => !uitgesloten.has(k.id));
  const aangepast = alleenLopend || alleenHosting || gekozen.length !== selectie.ontvangers.length;
  const eerste = gekozen[0];
  const voorbeeldNaam = eerste ? eerste.contact_name?.trim() || eerste.name : "Sanne";
  const gebruiktNaam = /\{naam\}/.test(`${onderwerp} ${tekst}`);

  const zetGroep = (status: Status, aan: boolean) =>
    setGroepen((huidig) => (aan ? [...new Set([...huidig, status])] : huidig.filter((s) => s !== status)));

  const zetUitgesloten = (id: string, uit: boolean) =>
    setUitgesloten((huidig) => {
      const nieuw = new Set(huidig);
      if (uit) nieuw.add(id);
      else nieuw.delete(id);
      return nieuw;
    });

  const klaar = onderwerp.trim().length > 0 && tekst.trim().length > 0;

  /** Haalt de foutmelding uit de functie, als die er een teruggaf. */
  const foutVan = async (error: unknown) => {
    const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
    return new Error(bericht?.error ?? (error instanceof Error ? error.message : "Versturen mislukt"));
  };

  const verstuur = async (test: boolean) => {
    if (!klaar) return;
    if (!test) {
      const ja = await vraagBevestiging({
        titel: `Mail versturen naar ${gekozen.length} ${gekozen.length === 1 ? "klant" : "klanten"}?`,
        beschrijving: (
          <>
            Elke klant krijgt een eigen mail. Dit kun je niet terugdraaien.
            <span className="mt-2 block">
              {gekozen
                .slice(0, 5)
                .map((k) => k.name)
                .join(", ")}
              {gekozen.length > 5 && ` en ${gekozen.length - 5} anderen`}
            </span>
          </>
        ),
        bevestigLabel: "Versturen",
      });
      if (!ja) return;
    }
    setBezig(test ? "test" : "echt");
    try {
      let klantIds: string[] | undefined;
      if (!test) {
        // Alleen een eigen ontvangerslijst meesturen als de functie die kent.
        // Een oudere versie negeert hem en mailt de hele groep, ook wie je
        // hebt uitgevinkt.
        const { data: versie } = await supabase.functions.invoke("send-mailing", { body: { controle: true } });
        if (versie?.versie >= 2) klantIds = gekozen.map((k) => k.id);
        else if (aangepast) {
          throw new Error(
            "De verzendfunctie is nog niet bijgewerkt en kan alleen hele groepen mailen. Vink niemand uit en zet de extra filters uit, of probeer het later.",
          );
        }
      }
      const { data, error } = await supabase.functions.invoke("send-mailing", {
        body: { onderwerp, tekst, statussen: groepen, test, ...(klantIds ? { klantIds } : {}) },
      });
      if (error) throw await foutVan(error);
      if (test) {
        toast.success("Testmail verstuurd naar je eigen adres");
      } else {
        toast.success(`Verstuurd naar ${data.verstuurd} ${data.verstuurd === 1 ? "klant" : "klanten"}`);
        if (data.mislukt) toast.error(`${data.mislukt} mails konden niet worden verstuurd`);
        setOnderwerp("");
        setTekst("Hoi {naam},\n\n");
        setUitgesloten(new Set());
        void queryClient.invalidateQueries({ queryKey: adminKeys.mailings });
      }
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Versturen mislukt");
    } finally {
      setBezig(null);
    }
  };

  const voorbeeld = (s: string) => s.replace(/\{naam\}/g, voorbeeldNaam);

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl tracking-tight">Mailen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stuur je klanten in één keer een mail, bijvoorbeeld over nieuwe functies. Elke klant krijgt een
          eigen mail, met een afmeldlink onderaan.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader icon={PenLine} titel="Nieuwe mailing" subtitel="Kies de ontvangers en schrijf je bericht" />
          <PanelBody className="space-y-6">
            <div className="space-y-3">
              <Label>Naar wie</Label>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {GROEPEN.map((g) => (
                  <label key={g.status} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox checked={groepen.includes(g.status)} onCheckedChange={(v) => zetGroep(g.status, v === true)} />
                    {g.label}
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox checked={alleenLopend} onCheckedChange={(v) => setAlleenLopend(v === true)} />
                  Alleen met lopend project
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox checked={alleenHosting} onCheckedChange={(v) => setAlleenHosting(v === true)} />
                  Alleen met hostingcontract
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Klanten laden…"
                ) : (
                  <>
                    <button type="button" onClick={() => naarOntvangers("ontvangers")} className="font-medium text-foreground underline-offset-2 hover:underline">
                      {gekozen.length} {gekozen.length === 1 ? "ontvanger" : "ontvangers"}
                    </button>
                    {selectie.zonderEmail.length > 0 && (
                      <>
                        {" · "}
                        <button
                          type="button"
                          onClick={() => naarOntvangers("zonder-email")}
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          {selectie.zonderEmail.length} zonder e-mailadres
                        </button>
                      </>
                    )}
                    {selectie.afgemeld.length > 0 && ` · ${selectie.afgemeld.length} afgemeld`}
                  </>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mail-onderwerp">Onderwerp</Label>
              <Input
                id="mail-onderwerp"
                value={onderwerp}
                onChange={(e) => setOnderwerp(e.target.value)}
                placeholder="Nieuw in je website: …"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mail-tekst">Tekst</Label>
              <Textarea
                id="mail-tekst"
                value={tekst}
                onChange={(e) => setTekst(e.target.value)}
                rows={14}
                className="font-[inherit] leading-relaxed"
              />
              <p className="text-xs text-muted-foreground">
                {"{naam}"} wordt de naam van de contactpersoon. Een lege regel begint een nieuwe alinea, links
                worden vanzelf klikbaar.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" disabled={!klaar || bezig !== null} onClick={() => verstuur(true)}>
                <Mail className="h-4 w-4" />
                {bezig === "test" ? "Bezig…" : "Testmail naar mij"}
              </Button>
              <Button disabled={!klaar || gekozen.length === 0 || bezig !== null} onClick={() => verstuur(false)}>
                <Send className="h-4 w-4" />
                {bezig === "echt"
                  ? "Versturen…"
                  : `Verstuur naar ${gekozen.length} ${gekozen.length === 1 ? "klant" : "klanten"}`}
              </Button>
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader icon={Mail} titel="Voorbeeld" subtitel="Zo ziet de eerste ontvanger de mail" />
          <PanelBody>
            <div className="rounded-lg border bg-muted/40 p-4 sm:p-6">
              <p className="text-xs text-muted-foreground">Van: {afzender}</p>
              <p className="mt-1 font-medium">{voorbeeld(onderwerp) || "Onderwerp"}</p>
              {/* Gewone mail, geen sjabloon: tekst, handtekening met logo, kleine afmeldregel. */}
              <div className="mt-5 rounded-lg bg-white p-6 font-[Arial,Helvetica,sans-serif] text-[#1a1a1a]">
                <div className="space-y-4 whitespace-pre-line text-sm leading-relaxed">
                  {voorbeeld(tekst)
                    .split(/\n{2,}/)
                    .filter((a) => a.trim())
                    .map((alinea, i) => (
                      <p key={i}>{alinea}</p>
                    ))}
                </div>
                <p className="mt-6 text-sm font-bold">{volledigeNaam || "Nieuwblik"}</p>
                <p className="text-[13px] leading-relaxed text-[#555]">
                  Nieuwblik, webdesign uit Enkhuizen
                  <br />
                  +31 6 46253607 · <span className="text-[#0f4c3a] underline">nieuwblik.com</span>
                </p>
                <img src="/mail/nieuwblik-logo.png" alt="Nieuwblik" width={120} height={34} className="mt-3 h-auto w-[120px]" />
                <p className="mt-6 text-xs text-[#8a8f8c]">
                  Je ontvangt deze mail omdat je klant bent van Nieuwblik. <span className="underline">Afmelden</span>
                </p>
              </div>
            </div>
          </PanelBody>
        </Panel>
      </div>

      <Panel id="ontvangers">
        <PanelHeader
          icon={Users}
          titel="Ontvangers"
          subtitel="Wie de mail krijgt, wie niet, en waarom. Vink iemand uit om hem over te slaan."
        />
        <PanelBody>
          <MailOntvangers
            tab={tab}
            onTab={zetTab}
            ontvangers={selectie.ontvangers}
            zonderEmail={selectie.zonderEmail}
            afgemeld={selectie.afgemeld}
            uitgesloten={uitgesloten}
            onUitsluiten={zetUitgesloten}
            gebruiktNaam={gebruiktNaam}
          />
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader icon={History} titel="Eerder verstuurd" subtitel="De laatste twintig mailingen" />
        <PanelBody>
          {/* Een laadfout is geen lege lijst: eerder stond hier dan "Nog
              niets verstuurd", terwijl er misschien wel mailingen waren. */}
          {mailingsFout ? (
            <EmptyState
              compact
              icon={RotateCw}
              title="De mailingen konden niet geladen worden"
              action={
                <Button variant="outline" size="sm" disabled={mailingsLaden} onClick={() => void mailingsOpnieuw()}>
                  <RotateCw className="h-4 w-4" />
                  Opnieuw
                </Button>
              }
            />
          ) : mailings.length === 0 ? (
            <EmptyState compact icon={Mail} title="Nog niets verstuurd" description="Je verzonden mailingen verschijnen hier." />
          ) : (
            <ul className="divide-y rounded-lg border">
              {mailings.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span className="font-medium">{m.onderwerp}</span>
                  <span className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    {datum(m.created_at)}
                    <StatusPill toon="success">{m.aantal_ontvangers} verstuurd</StatusPill>
                    {m.aantal_mislukt > 0 && <StatusPill toon="danger">{m.aantal_mislukt} mislukt</StatusPill>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PanelBody>
      </Panel>

      {dialoog}
    </div>
  );
};

export default Mailen;
