import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Route } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { isOpenAanvraag, useAanvragen } from "@/admin/aanvragen";
import { heeftData, isCredit, isTeLaatFactuur, useFinancien } from "@/admin/financien";
import { useClients, useProjects } from "@/admin/queries";
import { useTeFactureren } from "@/admin/stats";
import { duurMinuten, useTeFacturerenUren, uurtariefVoor } from "@/admin/uren";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

interface Stap {
  sleutel: string;
  titel: string;
  /** Het grote getal: een bedrag, of een aantal bij aanvragen. */
  waarde: string;
  onder: string;
  to: string;
  toon?: "danger";
}

/**
 * Het geld dat eraan komt, van links naar rechts in de volgorde waarin het
 * binnenkomt: aanvragen, offertes die uitstaan, wat gefactureerd kan worden
 * (geaccepteerde offertes, open uren, hostingtermijnen) en wat er openstaat.
 * Elke stap linkt naar de lijst erachter.
 *
 * Offertes, uren en hosting zijn exclusief btw; openstaande facturen zijn
 * wat de klant nog moet betalen, dus inclusief btw. Zonder Moneybird blijven
 * alleen de stappen over die het portaal zelf kent.
 */
const PijplijnKaart = ({ className }: { className?: string }) => {
  const { data: aanvragen = [] } = useAanvragen();
  const { data: financien } = useFinancien();
  const { data: uren = [] } = useTeFacturerenUren();
  const { data: projects = [] } = useProjects();
  const { data: clients = [] } = useClients();
  const hosting = useTeFactureren();
  const { bedrag } = useBedragenVerborgen();

  const stappen = useMemo<Stap[]>(() => {
    const lijst: Stap[] = [];
    const stand = financien && "bijgewerkt" in financien ? financien : null;

    const open = aanvragen.filter(isOpenAanvraag);
    const nieuw = open.filter((a) => a.status === "nieuw").length;
    lijst.push({
      sleutel: "aanvragen",
      titel: "Aanvragen",
      waarde: String(open.length),
      onder: open.length === 0 ? "Geen open aanvragen" : nieuw > 0 ? `${nieuw} nog niet opgepakt` : "Allemaal opgepakt",
      to: "/admin/aanvragen",
    });

    const offertes = stand?.offertes && heeftData(stand.offertes) ? stand.offertes.data : null;
    if (offertes) {
      const uit = offertes.filter((o) => o.status !== "accepted");
      lijst.push({
        sleutel: "offertes",
        titel: "Offertes uit",
        waarde: bedrag(uit.reduce((som, o) => som + o.bedrag, 0), 0),
        onder: `${uit.length} ${uit.length === 1 ? "offerte" : "offertes"} · excl. btw`,
        to: "/admin/financien",
      });
    }

    // Te factureren: geaccepteerde offertes, open uren tegen het klanttarief en hostingtermijnen.
    const geaccepteerd = offertes ? offertes.filter((o) => o.status === "accepted").reduce((som, o) => som + o.bedrag, 0) : 0;
    const urenBedrag = uren.reduce((som, r) => {
      const project = projects.find((p) => p.id === r.project_id);
      const client = project?.client_id ? clients.find((c) => c.id === project.client_id) : null;
      return som + (duurMinuten(r) / 60) * uurtariefVoor(client);
    }, 0);
    const hostingBedrag = hosting.achterstallig.reduce((som, t) => som + (t.client.billing_amount_cents ?? 0), 0) / 100;
    const delen = [
      geaccepteerd > 0 && `offertes ${bedrag(geaccepteerd, 0)}`,
      urenBedrag > 0 && `uren ${bedrag(urenBedrag, 0)}`,
      hostingBedrag > 0 && `hosting ${bedrag(hostingBedrag, 0)}`,
    ].filter(Boolean);
    lijst.push({
      sleutel: "factureren",
      titel: "Te factureren",
      waarde: bedrag(geaccepteerd + urenBedrag + hostingBedrag, 0),
      onder: delen.length > 0 ? delen.join(" · ") : "Niets dat wacht",
      to: urenBedrag > 0 ? "/admin/uren" : hostingBedrag > 0 ? "/admin/hosting" : "/admin/financien",
    });

    if (stand && heeftData(stand.facturen)) {
      const facturen = stand.facturen.data.filter((f) => !isCredit(f) && f.open > 0);
      const teLaat = facturen.filter(isTeLaatFactuur);
      lijst.push({
        sleutel: "openstaand",
        titel: "Openstaand",
        waarde: bedrag(facturen.reduce((som, f) => som + f.open, 0), 0),
        onder:
          teLaat.length > 0
            ? `${bedrag(teLaat.reduce((som, f) => som + f.open, 0), 0)} te laat · incl. btw`
            : `${facturen.length} ${facturen.length === 1 ? "factuur" : "facturen"} · incl. btw`,
        to: "/admin/financien",
        ...(teLaat.length > 0 ? { toon: "danger" as const } : {}),
      });
    }
    return lijst;
  }, [aanvragen, financien, uren, projects, clients, hosting.achterstallig, bedrag]);

  return (
    <Panel className={className}>
      <PanelHeader icon={Route} titel="Pijplijn" subtitel="Van aanvraag tot betaald" />
      <PanelBody className="p-2">
        <ol className="grid grid-cols-2 gap-1 md:flex md:gap-0">
          {stappen.map((s, i) => (
            <li key={s.sleutel} className="flex min-w-0 items-center md:flex-1">
              <Link to={s.to} className="min-w-0 flex-1 rounded-lg px-3 py-2.5 p-rij">
                <span className="block text-[13px] text-muted-foreground">{s.titel}</span>
                <span className="mt-0.5 block font-epilogue text-xl font-medium tabular-nums tracking-tight">{s.waarde}</span>
                <span className={cn("mt-0.5 block text-[12px] leading-snug text-muted-foreground", s.toon && TOON[s.toon].tekst)}>
                  {s.onder}
                </span>
              </Link>
              {/* Pijltjes alleen naast elkaar; in twee kolommen zou de volgorde niet kloppen. */}
              {i < stappen.length - 1 && (
                <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted-foreground/60 md:block" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </PanelBody>
    </Panel>
  );
};

export default PijplijnKaart;
