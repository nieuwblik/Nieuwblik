import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { addMinutes, format } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronDown, FileText, History, Mail, PenLine, RotateCw, Save, Send, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import MailOntvangers, { type OntvangersTab } from "@/admin/components/MailOntvangers";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACTIVE_PROJECT_STATUSES, type Toon } from "@/admin/constants";
import {
  kanMailen,
  mailVelden,
  useConceptOpslaan,
  useConceptWeggooien,
  useMailingAnnuleren,
  useMailingOntvangers,
  vulMailIn,
  type MailingOntvanger,
  type OntvangerStatus,
} from "@/admin/mailing";
import { useConfirm } from "@/admin/useConfirm";
import { supabase } from "@/integrations/supabase/client";
import { adminKeys, useClients, useMailings, type Client, type Mailing } from "@/admin/queries";
import { useCombinedRows } from "@/admin/rows";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";
import StatusPill from "@/admin/ui/StatusPill";

type Status = "actief" | "prospect" | "inactief";

const GROEPEN: { status: Status; label: string }[] = [
  { status: "actief", label: "Actieve klanten" },
  { status: "prospect", label: "Prospects" },
  { status: "inactief", label: "Oud-klanten" },
];

const TABS: OntvangersTab[] = ["ontvangers", "zonder-email", "afgemeld"];

/** Over hoeveel minuten de mails verspreid de deur uit gaan. */
const SPREIDING: { minuten: number; label: string }[] = [
  { minuten: 0, label: "Niet spreiden, alles tegelijk" },
  { minuten: 30, label: "Over een half uur" },
  { minuten: 60, label: "Over een uur (aanbevolen)" },
  { minuten: 120, label: "Over twee uur" },
  { minuten: 240, label: "Over vier uur" },
];

const LEGE_TEKST = "Hoi {voornaam},\n\n";

const ONTVANGER_STATUS: Record<OntvangerStatus, { label: string; toon: Toon }> = {
  ingepland: { label: "Ingepland", toon: "neutral" },
  verstuurd: { label: "Verstuurd", toon: "neutral" },
  vertraagd: { label: "Vertraagd", toon: "warning" },
  afgeleverd: { label: "Afgeleverd", toon: "success" },
  gebounced: { label: "Onbestelbaar", toon: "danger" },
  klacht: { label: "Spamklacht", toon: "danger" },
  mislukt: { label: "Mislukt", toon: "danger" },
  geannuleerd: { label: "Geannuleerd", toon: "neutral" },
};

const datum = (iso: string) =>
  new Date(iso).toLocaleString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const tijd = (iso: string | Date) => format(new Date(iso), "HH:mm");

/** "2026-10-27T09:00" (datetime-local) voor nu plus een uur, afgerond op een kwartier. */
function standaardMoment() {
  const d = addMinutes(new Date(), 60);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Alle klanten (of een selectie) mailen, bijvoorbeeld over nieuwe functies.
 * Elke klant krijgt een eigen mail met zijn naam en een afmeldlink; het
 * versturen gebeurt in de edge function send-mailing.
 *
 * Je ziet vooraf precies wie de mail krijgt en kunt mensen uitvinken; wie
 * geen (bestelbaar) e-mailadres heeft, vul je op dezelfde pagina aan. Een
 * mailing kan als concept blijven staan, op een moment worden ingepland en
 * verspreid de deur uit gaan, zodat hij minder als bulkpost oogt. Wat Resend
 * terugmeldt (afgeleverd, onbestelbaar, spamklacht) staat per mailing.
 */
const Mailen = () => {
  const queryClient = useQueryClient();
  const { user, displayName } = useAdminAuth();
  // Zelfde afzender als in de edge function: de admin zelf bij een @nieuwblik.com-adres.
  const eigenAdres = (user?.email ?? "").toLowerCase();
  const eigenAfzender = eigenAdres.endsWith("@nieuwblik.com");
  const volledigeNaam = displayName && displayName !== user?.email ? displayName.trim() : "";
  const afzender = eigenAfzender
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
  const [tekst, setTekst] = useState(LEGE_TEKST);
  const [wanneer, setWanneer] = useState<"nu" | "later">("nu");
  const [moment, setMoment] = useState(standaardMoment);
  const [spreiding, setSpreiding] = useState(60);
  const [persoonlijk, setPersoonlijk] = useState(true);
  const [afmeldkop, setAfmeldkop] = useState(true);
  const [conceptId, setConceptId] = useState<string | null>(null);
  // Bij het openen van een concept: wie er toen in stond, om de uitgevinkten terug te zetten.
  const [conceptKlanten, setConceptKlanten] = useState<string[] | null>(null);
  const [bezig, setBezig] = useState<"test" | "echt" | null>(null);
  const [openMailing, setOpenMailing] = useState<string | null>(null);
  const opslaan = useConceptOpslaan();
  const weggooien = useConceptWeggooien();
  const annuleren = useMailingAnnuleren();
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

  const { data: alleMailings = [], isError: mailingsFout, refetch: mailingsOpnieuw, isFetching: mailingsLaden } = useMailings(30);
  const concepten = alleMailings.filter((m) => m.status === "concept");
  const mailings = alleMailings.filter((m) => m.status !== "concept").slice(0, 20);
  const { data: ontvangerRegels = [] } = useMailingOntvangers(mailings.map((m) => m.id));
  const perMailing = useMemo(() => {
    const map = new Map<string, MailingOntvanger[]>();
    for (const r of ontvangerRegels) map.set(r.mailing_id, [...(map.get(r.mailing_id) ?? []), r]);
    return map;
  }, [ontvangerRegels]);

  // De selectie: gekozen groepen, eventueel versmald tot lopend werk of een
  // hostingcontract. Daaruit drie lijsten: wie de mail kan krijgen, wie geen
  // (bestelbaar) adres heeft en wie zich heeft afgemeld. Elk adres één mail.
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
      if (!kanMailen(k) || k.mail_afgemeld_op) return false;
      const adres = k.email!.trim().toLowerCase();
      if (gezien.has(adres)) return false;
      gezien.add(adres);
      return true;
    });
    return {
      ontvangers,
      zonderEmail: inSelectie.filter((k) => !kanMailen(k) && !k.mail_afgemeld_op),
      afgemeld: inSelectie.filter((k) => k.email?.includes("@") && k.mail_afgemeld_op),
    };
  }, [klanten, rows, groepen, alleenLopend, alleenHosting]);

  // Een geopend concept: wie er toen niet in stond, weer uitvinken.
  useEffect(() => {
    if (!conceptKlanten || isLoading) return;
    const mee = new Set(conceptKlanten);
    setUitgesloten(new Set(selectie.ontvangers.filter((k) => !mee.has(k.id)).map((k) => k.id)));
    setConceptKlanten(null);
  }, [conceptKlanten, isLoading, selectie.ontvangers]);

  const gekozen = selectie.ontvangers.filter((k) => !uitgesloten.has(k.id));
  const eerste = gekozen[0];
  const voorbeeldVelden = eerste ? mailVelden(eerste) : { naam: "Sanne", voornaam: "Sanne", bedrijf: "Bakkerij De Korf", website: "bakkerijdekorf.nl" };
  const gebruiktNaam = /\{(naam|voornaam)\}/.test(`${onderwerp} ${tekst}`);

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
  const startOp = wanneer === "later" && moment ? new Date(moment) : null;
  const momentOngeldig = wanneer === "later" && (!startOp || startOp.getTime() < Date.now() + 60_000);
  const spreidingLabel = SPREIDING.find((s) => s.minuten === spreiding)?.label.replace(" (aanbevolen)", "").toLowerCase() ?? "";

  const leegMaken = () => {
    setOnderwerp("");
    setTekst(LEGE_TEKST);
    setUitgesloten(new Set());
    setConceptId(null);
    setWanneer("nu");
    setMoment(standaardMoment());
  };

  /** Haalt de foutmelding uit de functie, als die er een teruggaf. */
  const foutVan = async (error: unknown) => {
    const bericht = await (error as { context?: Response }).context?.json?.().catch(() => null);
    return new Error(bericht?.error ?? (error instanceof Error ? error.message : "Versturen mislukt"));
  };

  const bewaarConcept = async () => {
    try {
      const id = await opslaan.mutateAsync({
        id: conceptId,
        userId: user?.id ?? null,
        gegevens: {
          onderwerp: onderwerp.trim() || "(zonder onderwerp)",
          tekst,
          statussen: groepen,
          klant_ids: gekozen.map((k) => k.id),
          ingepland_op: startOp ? startOp.toISOString() : null,
          spreiding_minuten: spreiding,
          persoonlijk,
          afmeldkop,
        },
      });
      setConceptId(id);
      toast.success("Concept opgeslagen");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Opslaan mislukt");
    }
  };

  const openConcept = (m: Mailing) => {
    setConceptId(m.id);
    setOnderwerp(m.onderwerp === "(zonder onderwerp)" ? "" : m.onderwerp);
    setTekst(m.tekst);
    setGroepen((m.statussen as Status[]).length > 0 ? (m.statussen as Status[]) : ["actief"]);
    setAlleenLopend(false);
    setAlleenHosting(false);
    setSpreiding(m.spreiding_minuten ?? 60);
    setPersoonlijk(m.persoonlijk ?? true);
    setAfmeldkop(m.afmeldkop ?? true);
    if (m.ingepland_op && new Date(m.ingepland_op).getTime() > Date.now()) {
      setWanneer("later");
      setMoment(format(new Date(m.ingepland_op), "yyyy-MM-dd'T'HH:mm"));
    } else {
      setWanneer("nu");
    }
    setConceptKlanten(m.klant_ids ?? null);
    if (!m.klant_ids) setUitgesloten(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gooiWeg = async (m: Mailing) => {
    const ja = await vraagBevestiging({ titel: `Concept "${m.onderwerp}" weggooien?`, bevestigLabel: "Weggooien" });
    if (!ja) return;
    try {
      await weggooien.mutateAsync(m.id);
      if (conceptId === m.id) leegMaken();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Weggooien mislukt");
    }
  };

  const annuleer = async (m: Mailing) => {
    const ja = await vraagBevestiging({
      titel: `"${m.onderwerp}" annuleren?`,
      beschrijving: "De mails die nog niet weg zijn, worden niet meer verstuurd. Wat al verstuurd is, blijft verstuurd.",
      bevestigLabel: "Annuleren",
    });
    if (!ja) return;
    try {
      const r = await annuleren.mutateAsync(m.id);
      toast.success(
        r.alWeg > 0 ? `${r.geannuleerd} geannuleerd, ${r.alWeg} waren al verstuurd` : `${r.geannuleerd} mails geannuleerd`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Annuleren mislukt");
    }
  };

  const verstuur = async (test: boolean) => {
    if (!klaar || momentOngeldig) return;
    if (!test) {
      const hoe =
        wanneer === "later"
          ? `De eerste mail gaat ${format(startOp!, "EEEE d MMMM 'om' HH:mm", { locale: nl })}${spreiding > 0 ? `, de rest verspreid ${spreidingLabel}` : ""}.`
          : spreiding > 0
            ? `De mails gaan verspreid ${spreidingLabel} de deur uit, vanaf nu.`
            : "Elke klant krijgt meteen een eigen mail.";
      const ja = await vraagBevestiging({
        titel: `Mail ${wanneer === "later" ? "inplannen" : "versturen"} naar ${gekozen.length} ${gekozen.length === 1 ? "klant" : "klanten"}?`,
        beschrijving: (
          <>
            {hoe} {wanneer === "later" || spreiding > 0 ? "Tot ze weg zijn kun je annuleren." : "Dit kun je niet terugdraaien."}
            <span className="mt-2 block">
              {gekozen
                .slice(0, 5)
                .map((k) => k.name)
                .join(", ")}
              {gekozen.length > 5 && ` en ${gekozen.length - 5} anderen`}
            </span>
          </>
        ),
        bevestigLabel: wanneer === "later" ? "Inplannen" : "Versturen",
        gevaarlijk: false,
      });
      if (!ja) return;
    }
    setBezig(test ? "test" : "echt");
    try {
      // Een oudere verzendfunctie negeert inplannen, spreiden en de opmaak
      // stilletjes en zou alles meteen versturen. Dan liever niet.
      const { data: versie } = await supabase.functions.invoke("send-mailing", { body: { controle: true } });
      if (!(versie?.versie >= 3)) {
        throw new Error("De verzendfunctie is nog niet bijgewerkt. Publiceer send-mailing in Lovable en probeer het dan opnieuw.");
      }
      const { data, error } = await supabase.functions.invoke("send-mailing", {
        body: {
          onderwerp,
          tekst,
          statussen: groepen,
          test,
          persoonlijk,
          afmeldkop,
          ...(test
            ? eerste
              ? { voorbeeldKlantId: eerste.id }
              : {}
            : {
                klantIds: gekozen.map((k) => k.id),
                spreidingMinuten: spreiding,
                ...(startOp ? { startOp: startOp.toISOString() } : {}),
                ...(conceptId ? { mailingId: conceptId } : {}),
              }),
        },
      });
      if (error) throw await foutVan(error);
      if (test) {
        toast.success("Testmail verstuurd naar je eigen adres", {
          description: eerste ? `Ingevuld met de gegevens van ${eerste.name}.` : undefined,
        });
      } else {
        if (data.ingepland) {
          toast.success(`Ingepland: ${data.verstuurd} ${data.verstuurd === 1 ? "mail" : "mails"}`, {
            description:
              data.eerste && data.laatste && data.eerste !== data.laatste
                ? `Van ${format(new Date(data.eerste), "d MMM HH:mm", { locale: nl })} tot ${format(new Date(data.laatste), "HH:mm")}.`
                : data.eerste
                  ? `Om ${format(new Date(data.eerste), "d MMM HH:mm", { locale: nl })}.`
                  : undefined,
          });
        } else {
          toast.success(`Verstuurd naar ${data.verstuurd} ${data.verstuurd === 1 ? "klant" : "klanten"}`);
        }
        if (data.mislukt) toast.error(`${data.mislukt} mails konden niet worden verstuurd`);
        leegMaken();
        void queryClient.invalidateQueries({ queryKey: adminKeys.mailings });
      }
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Versturen mislukt");
    } finally {
      setBezig(null);
    }
  };

  const voorbeeld = (s: string) => vulMailIn(s, voorbeeldVelden);

  /** De stand van een verstuurde of ingeplande mailing, in woorden. */
  const standVan = (m: Mailing) => {
    if (m.status === "geannuleerd") return { label: "Geannuleerd", toon: "neutral" as Toon, loopt: false };
    if (m.status === "ingepland" && m.ingepland_op) {
      const begin = new Date(m.ingepland_op);
      const eind = addMinutes(begin, m.spreiding_minuten ?? 0);
      if (begin.getTime() > Date.now()) return { label: `Ingepland ${datum(m.ingepland_op)}`, toon: "warning" as Toon, loopt: true };
      if (eind.getTime() > Date.now()) return { label: `Bezig tot ${tijd(eind)}`, toon: "warning" as Toon, loopt: true };
    }
    return null;
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl tracking-tight">Mailen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stuur je klanten een mail, bijvoorbeeld over nieuwe functies. Elke klant krijgt een eigen mail, met een
          afmeldlink onderaan.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            icon={PenLine}
            titel={conceptId ? "Concept" : "Nieuwe mailing"}
            subtitel={conceptId ? "Opgeslagen; versturen of inplannen kan wanneer je wilt" : "Kies de ontvangers en schrijf je bericht"}
            actie={
              conceptId ? (
                <Button variant="ghost" size="sm" onClick={leegMaken}>
                  Nieuwe mailing
                </Button>
              ) : undefined
            }
          />
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
                          {selectie.zonderEmail.length} zonder bruikbaar e-mailadres
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
              <p className="text-xs leading-relaxed text-muted-foreground">
                Per klant ingevuld: {"{voornaam}"}, {"{naam}"} (de hele naam van de contactpersoon), {"{bedrijf}"} en{" "}
                {"{website}"}. Hoe meer per klant verschilt, hoe minder de mail op bulkpost lijkt. Een lege regel begint een
                nieuwe alinea, links worden vanzelf klikbaar.
              </p>
            </div>

            <div className="space-y-4 border-t border-border pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label>Versturen</Label>
                <SegmentedControl
                  label="Wanneer"
                  waarde={wanneer}
                  onChange={setWanneer}
                  opties={[
                    { waarde: "nu", label: "Nu" },
                    { waarde: "later", label: "Op een moment" },
                  ]}
                />
              </div>
              {wanneer === "later" && (
                <div className="space-y-1.5">
                  <Input
                    type="datetime-local"
                    aria-label="Moment van de eerste mail"
                    value={moment}
                    min={format(addMinutes(new Date(), 2), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setMoment(e.target.value)}
                  />
                  {momentOngeldig && <p className="text-[13px] text-muted-foreground">Kies een moment in de toekomst.</p>}
                </div>
              )}
              <div className="space-y-1.5">
                <Select value={String(spreiding)} onValueChange={(v) => setSpreiding(Number(v))}>
                  <SelectTrigger aria-label="Spreiding">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPREIDING.map((s) => (
                      <SelectItem key={s.minuten} value={String(s.minuten)}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[13px] leading-snug text-muted-foreground">
                  Allemaal in dezelfde seconde is voor Gmail het duidelijkste teken van bulkpost. Verspreid gaan ze een voor
                  een, als gewone mails.
                </p>
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox checked={persoonlijk} onCheckedChange={(v) => setPersoonlijk(v === true)} className="mt-0.5" />
                <span>
                  Persoonlijke opmaak
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                    Handtekening zonder logo en zonder opgemaakte links, zoals onder een gewone mail.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox checked={afmeldkop} onCheckedChange={(v) => setAfmeldkop(v === true)} className="mt-0.5" />
                <span>
                  Afmeldknop bovenin de mail
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                    Gmail toont dan "Afmelden" naast de afzender. Netjes, en het voorkomt spamklachten, maar het is ook een
                    teken van bulkpost. Bij een kleine groep vaste klanten kun je hem uitzetten; de afmeldlink onderaan
                    blijft altijd staan.
                  </span>
                </span>
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" disabled={opslaan.isPending || bezig !== null} onClick={() => void bewaarConcept()}>
                <Save className="h-4 w-4" />
                {opslaan.isPending ? "Opslaan…" : "Opslaan als concept"}
              </Button>
              <Button variant="outline" disabled={!klaar || bezig !== null} onClick={() => verstuur(true)}>
                <Mail className="h-4 w-4" />
                {bezig === "test" ? "Bezig…" : "Testmail naar mij"}
              </Button>
              <Button disabled={!klaar || gekozen.length === 0 || bezig !== null || momentOngeldig} onClick={() => verstuur(false)}>
                <Send className="h-4 w-4" />
                {bezig === "echt"
                  ? "Bezig…"
                  : `${wanneer === "later" ? "Inplannen voor" : "Verstuur naar"} ${gekozen.length} ${gekozen.length === 1 ? "klant" : "klanten"}`}
              </Button>
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader icon={Mail} titel="Voorbeeld" subtitel={eerste ? `Zo ziet ${eerste.name} de mail` : "Zo ziet een ontvanger de mail"} />
          <PanelBody>
            <div className="rounded-lg border bg-muted/40 p-4 sm:p-6">
              <p className="text-xs text-muted-foreground">Van: {afzender}</p>
              <p className="mt-1 font-medium">{voorbeeld(onderwerp) || "Onderwerp"}</p>
              {/* Gewone mail, geen sjabloon: tekst, handtekening, kleine afmeldregel. */}
              <div className="mt-5 rounded-lg bg-white p-6 font-[Arial,Helvetica,sans-serif] text-[#1a1a1a]">
                <div className="space-y-4 whitespace-pre-line text-sm leading-relaxed">
                  {voorbeeld(tekst)
                    .split(/\n{2,}/)
                    .filter((a) => a.trim())
                    .map((alinea, i) => (
                      <p key={i}>{alinea}</p>
                    ))}
                </div>
                {persoonlijk ? (
                  <p className="mt-6 text-sm leading-relaxed">
                    {volledigeNaam || "Nieuwblik"}
                    <br />
                    Nieuwblik, webdesign uit Enkhuizen
                    <br />
                    +31 6 46253607
                  </p>
                ) : (
                  <>
                    <p className="mt-6 text-sm font-bold">{volledigeNaam || "Nieuwblik"}</p>
                    <p className="text-[13px] leading-relaxed text-[#555]">
                      Nieuwblik, webdesign uit Enkhuizen
                      <br />
                      +31 6 46253607 · <span className="text-[#0f4c3a] underline">nieuwblik.com</span>
                    </p>
                    <img src="/mail/nieuwblik-logo.png" alt="Nieuwblik" width={120} height={34} className="mt-3 h-auto w-[120px]" />
                  </>
                )}
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

      {concepten.length > 0 && (
        <Panel>
          <PanelHeader icon={FileText} titel="Concepten" subtitel="Opgeslagen en nog niet verstuurd" />
          <PanelBody>
            <ul className="divide-y rounded-lg border">
              {concepten.map((m) => (
                <li key={m.id} className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 text-sm", conceptId === m.id && "bg-muted/50")}>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{m.onderwerp}</span>
                    <span className="text-[13px] text-muted-foreground">
                      Bewaard {datum(m.updated_at ?? m.created_at)}
                      {m.klant_ids ? ` · ${m.klant_ids.length} ${m.klant_ids.length === 1 ? "ontvanger" : "ontvangers"}` : ""}
                    </span>
                  </span>
                  <span className="flex shrink-0 gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => void gooiWeg(m)} aria-label={`Concept ${m.onderwerp} weggooien`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openConcept(m)}>
                      Openen
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>
      )}

      <Panel>
        <PanelHeader icon={History} titel="Verstuurd en ingepland" subtitel="De laatste twintig mailingen, met wat Resend terugmeldde" />
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
              {mailings.map((m) => {
                const regels = perMailing.get(m.id) ?? [];
                const tel = (s: OntvangerStatus[]) => regels.filter((r) => s.includes(r.status)).length;
                const stand = standVan(m);
                const open = openMailing === m.id;
                const tellingen: { aantal: number; label: string; toon: Toon }[] =
                  regels.length === 0
                    ? [{ aantal: m.aantal_ontvangers, label: "verstuurd", toon: "success" }]
                    : [
                        { aantal: tel(["afgeleverd"]), label: "afgeleverd", toon: "success" },
                        { aantal: tel(["verstuurd", "vertraagd"]), label: "onderweg", toon: "neutral" },
                        { aantal: tel(["ingepland"]), label: "ingepland", toon: "neutral" },
                        { aantal: tel(["gebounced"]), label: "onbestelbaar", toon: "danger" },
                        { aantal: tel(["klacht"]), label: "spamklacht", toon: "danger" },
                        { aantal: tel(["mislukt"]), label: "mislukt", toon: "danger" },
                      ];
                return (
                  <li key={m.id} className="text-sm">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setOpenMailing(open ? null : m.id)}
                        aria-expanded={open}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{m.onderwerp}</span>
                          <span className="text-[13px] text-muted-foreground">{datum(m.ingepland_op ?? m.created_at)}</span>
                        </span>
                      </button>
                      <span className="flex flex-wrap items-center gap-1.5">
                        {stand && <StatusPill toon={stand.toon}>{stand.label}</StatusPill>}
                        {tellingen
                          .filter((t) => t.aantal > 0)
                          .map((t) => (
                            <StatusPill key={t.label} toon={t.toon}>
                              {t.aantal} {t.label}
                            </StatusPill>
                          ))}
                        {m.aantal_mislukt > 0 && regels.length === 0 && <StatusPill toon="danger">{m.aantal_mislukt} mislukt</StatusPill>}
                        {stand?.loopt && (
                          <Button size="sm" variant="outline" disabled={annuleren.isPending} onClick={() => void annuleer(m)}>
                            Annuleren
                          </Button>
                        )}
                      </span>
                    </div>
                    {open && (
                      <ul className="max-h-80 divide-y divide-border overflow-y-auto border-t border-border bg-muted/30">
                        {regels.length === 0 ? (
                          <li className="px-4 py-2.5 text-[13px] text-muted-foreground">Geen gegevens per ontvanger.</li>
                        ) : (
                          regels.map((r) => (
                            <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-[13px]">
                              <span className="min-w-0 flex-1">
                                <span className="font-medium">{r.naam ?? r.email}</span>{" "}
                                <span className="text-muted-foreground">{r.email}</span>
                                {r.fout && <span className="block text-muted-foreground">{r.fout}</span>}
                              </span>
                              {r.status === "ingepland" && r.gepland_op && (
                                <span className="text-muted-foreground">{tijd(r.gepland_op)}</span>
                              )}
                              <StatusPill toon={ONTVANGER_STATUS[r.status]?.toon ?? "neutral"}>
                                {ONTVANGER_STATUS[r.status]?.label ?? r.status}
                              </StatusPill>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </PanelBody>
      </Panel>

      {dialoog}
    </div>
  );
};

export default Mailen;
