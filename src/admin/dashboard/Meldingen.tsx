import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON, type Toon } from "@/admin/constants";
import { useClients, useProjects } from "@/admin/queries";
import { heeftData, OFFERTE_WACHTTIJD, offerteWachtDagen, useFinancien } from "@/admin/financien";
import { useTeFactureren } from "@/admin/stats";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

/** Fases waarin een project gebouwd wordt; daar hoort een opleverdatum bij. */
const IN_PRODUCTIE = ["in_ontwerp", "in_bouw", "review"];

interface Melding {
  key: string;
  toon: Toon;
  tekst: string;
  actie: string;
  to: string;
}

/**
 * Smalle meldingen onder de begroeting: wat er in de gegevens ontbreekt of
 * blijft liggen. Zolang hosting en mailen nog niet gevuld zijn, staat dat
 * hier op één regel in plaats van in halflege kaarten. Is alles op orde, dan
 * verdwijnt de strook.
 */
const Meldingen = () => {
  const { data: clients = [] } = useClients();
  const { data: projects = [] } = useProjects();
  const facturen = useTeFactureren();
  const { data: financien } = useFinancien();
  const { bedrag } = useBedragenVerborgen();

  const meldingen = useMemo<Melding[]>(() => {
    const lijst: Melding[] = [];
    // Betalingen van de laatste drie dagen: goed nieuws mag ook in beeld.
    if (financien && "bijgewerkt" in financien && financien.betalingen && heeftData(financien.betalingen)) {
      const grens = Date.now() - 3 * 86400000;
      const recent = financien.betalingen.data.filter((b) => b.betaaldOp && new Date(b.betaaldOp).getTime() >= grens);
      if (recent.length === 1) {
        lijst.push({
          key: "betaald",
          toon: "success",
          tekst: `${recent[0]!.klant} heeft ${bedrag(recent[0]!.bedrag)} betaald`,
          actie: "Financiën",
          to: "/admin/financien",
        });
      } else if (recent.length > 1) {
        lijst.push({
          key: "betaald",
          toon: "success",
          tekst: `${recent.length} betalingen binnen, samen ${bedrag(recent.reduce((som, b) => som + b.bedrag, 0))}`,
          actie: "Financiën",
          to: "/admin/financien",
        });
      }
    }
    if (financien && "bijgewerkt" in financien && financien.offertes && heeftData(financien.offertes)) {
      const wachten = financien.offertes.data.filter((o) => offerteWachtDagen(o) >= OFFERTE_WACHTTIJD).length;
      if (wachten > 0) {
        lijst.push({
          key: "offertes",
          toon: "warning",
          tekst: `${wachten} ${wachten === 1 ? "offerte wacht" : "offertes wachten"} al ${OFFERTE_WACHTTIJD} dagen of langer op antwoord`,
          actie: "Bekijken",
          to: "/admin/financien",
        });
      }
    }
    if (facturen.achterstallig.length > 0) {
      const n = facturen.achterstallig.length;
      lijst.push({
        key: "achterstallig",
        toon: "danger",
        tekst: `${n} ${n === 1 ? "factuur" : "facturen"} achterstallig`,
        actie: "Naar hosting",
        to: "/admin/hosting",
      });
    }
    if (!facturen.isLoading && facturen.contracten === 0) {
      lijst.push({
        key: "hosting",
        toon: "neutral",
        tekst: "Nog geen hostingcontracten",
        actie: "Facturatie instellen",
        to: "/admin/klanten",
      });
    }
    const zonderEmail = clients.filter((c) => !c.email?.includes("@")).length;
    if (zonderEmail > 0) {
      lijst.push({
        key: "email",
        toon: "warning",
        tekst: `${zonderEmail} ${zonderEmail === 1 ? "klant" : "klanten"} zonder e-mailadres`,
        actie: "Aanvullen",
        to: "/admin/mailen?ontvangers=zonder-email",
      });
    }
    const zonderDeadline = projects.filter((p) => IN_PRODUCTIE.includes(p.status) && !p.deadline).length;
    if (zonderDeadline > 0) {
      lijst.push({
        key: "deadline",
        toon: "warning",
        tekst: `${zonderDeadline} ${zonderDeadline === 1 ? "project" : "projecten"} in productie zonder deadline`,
        actie: "Bekijken",
        to: "/admin/klanten?filter=zonder-deadline",
      });
    }
    return lijst;
  }, [clients, projects, facturen, financien, bedrag]);

  if (meldingen.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {meldingen.map((m) => (
        <li key={m.key}>
          <Link
            to={m.to}
            className="group inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-[13px] transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.98]"
          >
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", TOON[m.toon].stip)} aria-hidden="true" />
            <span>{m.tekst}</span>
            <span className="text-muted-foreground group-hover:text-foreground">{m.actie}</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Meldingen;
