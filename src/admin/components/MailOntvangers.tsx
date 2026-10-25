import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import { TOON } from "@/admin/constants";
import { formatDate } from "@/admin/format";
import { useSaveClient, type Client } from "@/admin/queries";

export type OntvangersTab = "ontvangers" | "zonder-email" | "afgemeld";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Eén klant met de velden die mailen nodig heeft: contactpersoon en
 * e-mailadres, ter plekke in te vullen. Zo hoef je voor 22 ontbrekende
 * adressen niet 22 keer een klantpagina te openen.
 */
const SnelInvullen = ({
  klant,
  velden,
  onKlaar,
}: {
  klant: Client;
  velden: ("contact" | "email")[];
  onKlaar?: () => void;
}) => {
  const save = useSaveClient();
  const [contact, setContact] = useState(klant.contact_name ?? "");
  const [email, setEmail] = useState(klant.email ?? "");

  const opslaan = async (event: React.FormEvent) => {
    event.preventDefault();
    const schoonEmail = email.trim();
    if (velden.includes("email") && !EMAIL.test(schoonEmail)) {
      toast.error("Vul een geldig e-mailadres in");
      return;
    }
    try {
      await save.mutateAsync({
        id: klant.id,
        values: {
          name: klant.name,
          ...(velden.includes("contact") ? { contact_name: contact.trim() || null } : {}),
          ...(velden.includes("email") ? { email: schoonEmail } : {}),
        },
      });
      toast.success(`${klant.name} bijgewerkt`);
      onKlaar?.();
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Opslaan mislukt");
    }
  };

  return (
    <form onSubmit={opslaan} className="flex flex-wrap items-center gap-2">
      {velden.includes("contact") && (
        <Input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Contactpersoon"
          aria-label={`Contactpersoon van ${klant.name}`}
          className="h-8 w-40 text-sm"
          maxLength={200}
        />
      )}
      {velden.includes("email") && (
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="naam@bedrijf.nl"
          aria-label={`E-mailadres van ${klant.name}`}
          className="h-8 w-56 text-sm"
          maxLength={255}
        />
      )}
      <Button type="submit" size="sm" variant="outline" className="h-8" disabled={save.isPending}>
        <Check className="h-3.5 w-3.5" />
        Opslaan
      </Button>
    </form>
  );
};

interface MailOntvangersProps {
  tab: OntvangersTab;
  onTab: (tab: OntvangersTab) => void;
  ontvangers: Client[];
  zonderEmail: Client[];
  afgemeld: Client[];
  uitgesloten: Set<string>;
  onUitsluiten: (id: string, uit: boolean) => void;
  /** Gebruikt de tekst {naam}? Dan telt een ontbrekende contactpersoon. */
  gebruiktNaam: boolean;
}

/**
 * Wie de mail krijgt, wie niet en waarom. Drie lijsten in één paneel:
 * de ontvangers (uit te vinken), de klanten zonder bruikbaar e-mailadres
 * (direct aan te vullen; ook adressen die eerder onbestelbaar bleken) en wie
 * zich heeft afgemeld.
 */
const MailOntvangers = ({
  tab,
  onTab,
  ontvangers,
  zonderEmail,
  afgemeld,
  uitgesloten,
  onUitsluiten,
  gebruiktNaam,
}: MailOntvangersProps) => {
  const [naamOpen, setNaamOpen] = useState<string | null>(null);
  const zonderNaam = ontvangers.filter((k) => !k.contact_name?.trim() && !uitgesloten.has(k.id));

  const tabs: { waarde: OntvangersTab; label: string; aantal: number }[] = [
    { waarde: "ontvangers", label: "Ontvangers", aantal: ontvangers.filter((k) => !uitgesloten.has(k.id)).length },
    { waarde: "zonder-email", label: "Zonder e-mailadres", aantal: zonderEmail.length },
    { waarde: "afgemeld", label: "Afgemeld", aantal: afgemeld.length },
  ];

  return (
    <div className="space-y-3">
      <div role="tablist" aria-label="Ontvangers" className="flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.waarde}
            type="button"
            role="tab"
            aria-selected={tab === t.waarde}
            onClick={() => onTab(t.waarde)}
            className={cn(
              "-mb-px flex items-center gap-1.5 border-b-2 px-2 pb-2 pt-1 text-sm transition-colors duration-150",
              tab === t.waarde
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-md px-1.5 text-xs tabular-nums leading-5",
                t.waarde === "zonder-email" && t.aantal > 0 ? TOON.warning.pil : "bg-muted text-muted-foreground",
              )}
            >
              {t.aantal}
            </span>
          </button>
        ))}
      </div>

      {tab === "ontvangers" && (
        <>
          {/* "Hoi Bedrijfsnaam" leest als een massamail; vooraf zien bij wie
              dat gebeurt, met de naam direct in te vullen. */}
          {gebruiktNaam && zonderNaam.length > 0 && (
            <p className={cn("flex items-start gap-2 rounded-lg border px-3 py-2 text-[13px]", TOON.warning.cel)}>
              <AlertTriangle className={cn("mt-0.5 h-4 w-4 shrink-0", TOON.warning.tekst)} />
              <span>
                {zonderNaam.length} {zonderNaam.length === 1 ? "ontvanger heeft" : "ontvangers hebben"} geen
                contactpersoon. Daar wordt {"{naam}"} de bedrijfsnaam, zoals "Hoi {zonderNaam[0]!.name}". Vul de naam
                hieronder in of vink ze uit.
              </span>
            </p>
          )}

          {ontvangers.length === 0 ? (
            <EmptyState
              compact
              icon={Users}
              title="Niemand in deze selectie heeft een e-mailadres"
              description="Vul adressen aan onder Zonder e-mailadres, of kies een andere groep."
              action={
                zonderEmail.length > 0 ? (
                  <Button variant="outline" size="sm" onClick={() => onTab("zonder-email")}>
                    Adressen aanvullen
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <ul className="max-h-96 divide-y divide-border overflow-y-auto rounded-lg border border-border">
              {ontvangers.map((k) => {
                const mee = !uitgesloten.has(k.id);
                const geenNaam = !k.contact_name?.trim();
                return (
                  <li key={k.id} className={cn("px-3 py-2.5 text-sm transition-opacity", !mee && "opacity-50")}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Checkbox
                        checked={mee}
                        onCheckedChange={(v) => onUitsluiten(k.id, v !== true)}
                        aria-label={`${k.name} ${mee ? "uitvinken" : "aanvinken"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <Link to={`/admin/klanten/${k.id}`} className="font-medium hover:underline">
                          {k.name}
                        </Link>
                        <span className="block truncate text-[13px] text-muted-foreground">
                          {k.contact_name?.trim() ? `${k.contact_name} · ${k.email}` : k.email}
                        </span>
                      </span>
                      {gebruiktNaam && geenNaam && mee && naamOpen !== k.id && (
                        <button
                          type="button"
                          onClick={() => setNaamOpen(k.id)}
                          className={cn("rounded-md border px-2 py-0.5 text-xs font-medium", TOON.warning.pil)}
                        >
                          Naam invullen
                        </button>
                      )}
                    </div>
                    {naamOpen === k.id && (
                      <div className="mt-2 pl-7">
                        <SnelInvullen klant={k} velden={["contact"]} onKlaar={() => setNaamOpen(null)} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {tab === "zonder-email" &&
        (zonderEmail.length === 0 ? (
          <EmptyState compact icon={Check} title="Iedereen in deze selectie heeft een e-mailadres" />
        ) : (
          <>
            <p className="text-[13px] text-muted-foreground">
              Deze klanten krijgen de mail niet. Vul een (nieuw) adres in en ze schuiven vanzelf naar Ontvangers.
            </p>
            <ul className="max-h-96 divide-y divide-border overflow-y-auto rounded-lg border border-border">
              {zonderEmail.map((k) => (
                <li key={k.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5 text-sm">
                  <span className="min-w-0">
                    <Link to={`/admin/klanten/${k.id}`} className="font-medium hover:underline">
                      {k.name}
                    </Link>
                    {/* Resend meldde dit adres als onbestelbaar; een ander adres invullen heft dat op. */}
                    {k.email_onbestelbaar_op && (
                      <span className={cn("block text-[13px]", TOON.danger.tekst)}>
                        {k.email} is onbestelbaar sinds {formatDate(k.email_onbestelbaar_op)}
                      </span>
                    )}
                  </span>
                  <SnelInvullen klant={k} velden={["contact", "email"]} />
                </li>
              ))}
            </ul>
          </>
        ))}

      {tab === "afgemeld" &&
        (afgemeld.length === 0 ? (
          <EmptyState compact icon={Check} title="Niemand heeft zich afgemeld" />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {afgemeld.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm">
                <span>
                  <span className="font-medium">{k.name}</span>
                  <span className="block text-[13px] text-muted-foreground">{k.email}</span>
                </span>
                <span className="text-[13px] text-muted-foreground">Afgemeld op {formatDate(k.mail_afgemeld_op)}</span>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
};

export default MailOntvangers;
