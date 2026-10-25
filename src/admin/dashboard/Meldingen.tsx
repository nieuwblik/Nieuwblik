import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON, type Toon } from "@/admin/constants";
import { useProjects } from "@/admin/queries";
import { useCombinedRows } from "@/admin/rows";
import { useTeFactureren } from "@/admin/stats";

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
 * Smalle meldingen onder de begroeting: wat er in de gegevens ontbreekt
 * (geen hostingcontracten, klanten zonder e-mail, projecten zonder deadline),
 * elk met een knop om het aan te vullen. Wat om actie vraagt staat in het
 * meldingencentrum achter de bel. Is alles op orde, dan verdwijnt de strook.
 */
const Meldingen = () => {
  const { rows } = useCombinedRows();
  const { data: projects = [] } = useProjects();
  const facturen = useTeFactureren();

  const meldingen = useMemo<Melding[]>(() => {
    const lijst: Melding[] = [];
    // Alleen wat er in de gegevens ontbreekt. Wat om actie vraagt (te late
    // facturen, offertes, betalingen, hosting) staat in het meldingencentrum
    // achter de bel.
    if (!facturen.isLoading && facturen.contracten === 0) {
      lijst.push({
        key: "hosting",
        toon: "neutral",
        tekst: "Nog geen hostingcontracten",
        actie: "Uit Moneybird inlezen",
        to: "/admin/hosting?inlezen=1",
      });
    }
    // Verborgen klanten tellen niet mee: die wil je niet meer aanvullen.
    const zonderEmail = rows.filter((r) => r.client.id && !r.verborgen && !r.client.email?.includes("@")).length;
    if (zonderEmail > 0) {
      lijst.push({
        key: "email",
        toon: "warning",
        tekst: `${zonderEmail} ${zonderEmail === 1 ? "klant" : "klanten"} zonder e-mailadres`,
        actie: "Aanvullen uit Moneybird",
        to: "/admin/klanten?aanvullen=1",
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
  }, [rows, projects, facturen]);

  if (meldingen.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {meldingen.map((m) => (
        <li key={m.key} className="max-sm:w-full">
          <Link
            to={m.to}
            className="group inline-flex items-center gap-2 max-sm:flex max-sm:w-full rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-[13px] transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.98]"
          >
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", TOON[m.toon].stip)} aria-hidden="true" />
            <span className="max-sm:min-w-0 max-sm:flex-1">{m.tekst}</span>
            {/* Op een telefoon is de hele regel de knop; de actietekst brak daar de melding in stukken. */}
            <span className="text-muted-foreground group-hover:text-foreground max-sm:hidden">{m.actie}</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Meldingen;
