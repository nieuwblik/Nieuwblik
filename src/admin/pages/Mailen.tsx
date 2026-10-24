import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { History, Mail, PenLine, RotateCw, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/admin/components/EmptyState";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { useConfirm } from "@/admin/useConfirm";
import { supabase } from "@/integrations/supabase/client";
import { adminKeys, useClients, useMailings } from "@/admin/queries";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import StatusPill from "@/admin/ui/StatusPill";

type Status = "actief" | "prospect" | "inactief";

const GROEPEN: { status: Status; label: string }[] = [
  { status: "actief", label: "Actieve klanten" },
  { status: "prospect", label: "Prospects" },
  { status: "inactief", label: "Oud-klanten" },
];

const datum = (iso: string) =>
  new Date(iso).toLocaleString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * Alle klanten (of een groep) in één keer mailen, bijvoorbeeld over nieuwe
 * functies. Elke klant krijgt een eigen mail met zijn naam en een afmeldlink;
 * het versturen gebeurt in de edge function send-mailing.
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
  const { vraagBevestiging, dialoog } = useConfirm();
  const [groepen, setGroepen] = useState<Status[]>(["actief"]);
  const [onderwerp, setOnderwerp] = useState("");
  const [tekst, setTekst] = useState("Hoi {naam},\n\n");
  const [bezig, setBezig] = useState<"test" | "echt" | null>(null);

  const { data: mailings = [], isError: mailingsFout, refetch: mailingsOpnieuw, isFetching: mailingsLaden } = useMailings(20);

  // Wie krijgt de mail: gekozen groepen, met e-mailadres, niet afgemeld, elk adres één keer.
  const telling = useMemo(() => {
    const inGroep = klanten.filter((k) => groepen.includes(k.status as Status));
    const zonderEmail = inGroep.filter((k) => !k.email?.includes("@")).length;
    const afgemeld = inGroep.filter((k) => k.email?.includes("@") && k.mail_afgemeld_op).length;
    const adressen = new Set(
      inGroep.filter((k) => k.email?.includes("@") && !k.mail_afgemeld_op).map((k) => k.email?.trim().toLowerCase()),
    );
    const eerste = inGroep.find((k) => k.email?.includes("@") && !k.mail_afgemeld_op);
    return {
      ontvangers: adressen.size,
      zonderEmail,
      afgemeld,
      voorbeeldNaam: eerste ? eerste.contact_name?.trim() || eerste.name : "Sanne",
    };
  }, [klanten, groepen]);

  const zetGroep = (status: Status, aan: boolean) =>
    setGroepen((huidig) => (aan ? [...new Set([...huidig, status])] : huidig.filter((s) => s !== status)));

  const klaar = onderwerp.trim().length > 0 && tekst.trim().length > 0;

  const verstuur = async (test: boolean) => {
    if (!klaar) return;
    if (!test) {
      const ja = await vraagBevestiging({
        titel: `Mail versturen naar ${telling.ontvangers} ${telling.ontvangers === 1 ? "klant" : "klanten"}?`,
        beschrijving: "Elke klant krijgt een eigen mail. Dit kun je niet terugdraaien.",
        bevestigLabel: "Versturen",
      });
      if (!ja) return;
    }
    setBezig(test ? "test" : "echt");
    try {
      const { data, error } = await supabase.functions.invoke("send-mailing", {
        body: { onderwerp, tekst, statussen: groepen, test },
      });
      if (error) {
        // De functie geeft bij een fout een JSON-bericht terug; haal dat op als het kan.
        const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
        throw new Error(bericht?.error ?? error.message);
      }
      if (test) {
        toast.success("Testmail verstuurd naar je eigen adres");
      } else {
        toast.success(`Verstuurd naar ${data.verstuurd} ${data.verstuurd === 1 ? "klant" : "klanten"}`);
        if (data.mislukt) toast.error(`${data.mislukt} mails konden niet worden verstuurd`);
        setOnderwerp("");
        setTekst("Hoi {naam},\n\n");
        void queryClient.invalidateQueries({ queryKey: adminKeys.mailings });
      }
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Versturen mislukt");
    } finally {
      setBezig(null);
    }
  };

  const voorbeeld = (s: string) => s.replace(/\{naam\}/g, telling.voorbeeldNaam);

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
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Klanten laden…"
                ) : (
                  <>
                    <span className="font-medium text-foreground">
                      {telling.ontvangers} {telling.ontvangers === 1 ? "ontvanger" : "ontvangers"}
                    </span>
                    {telling.zonderEmail > 0 && (
                      <>
                        {" · "}
                        <Link to="/admin/klanten?filter=zonder-email" className="underline underline-offset-2 hover:text-foreground">
                          {telling.zonderEmail} zonder e-mailadres
                        </Link>
                      </>
                    )}
                    {telling.afgemeld > 0 && ` · ${telling.afgemeld} afgemeld`}
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
              <Button disabled={!klaar || telling.ontvangers === 0 || bezig !== null} onClick={() => verstuur(false)}>
                <Send className="h-4 w-4" />
                {bezig === "echt"
                  ? "Versturen…"
                  : `Verstuur naar ${telling.ontvangers} ${telling.ontvangers === 1 ? "klant" : "klanten"}`}
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
