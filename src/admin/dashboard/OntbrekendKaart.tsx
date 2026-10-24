import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, CircleCheck, ClipboardList } from "lucide-react";

import EmptyState from "@/admin/components/EmptyState";
import { useClients, useProjects } from "@/admin/queries";
import { Panel, PanelBody, PanelHeader } from "@/admin/ui/Panel";

/** Fases waarin een project gebouwd wordt; daar hoort een opleverdatum bij. */
const IN_PRODUCTIE = ["in_ontwerp", "in_bouw", "review"];

/**
 * Wat er aan klantgegevens ontbreekt. Zonder e-mailadres kun je een klant
 * niet mailen, zonder deadline staat een project niet in de planning; dit
 * blok maakt die gaten zichtbaar, met een link naar precies die klanten.
 */
const OntbrekendKaart = () => {
  const { data: clients = [] } = useClients();
  const { data: projects = [] } = useProjects();

  const regels = useMemo(
    () =>
      [
        {
          filter: "zonder-email",
          label: "zonder e-mailadres",
          aantal: clients.filter((c) => !c.email?.includes("@")).length,
        },
        {
          filter: "zonder-telefoon",
          label: "zonder telefoonnummer",
          aantal: clients.filter((c) => !c.phone?.trim()).length,
        },
        {
          filter: "zonder-contact",
          label: "zonder contactpersoon",
          aantal: clients.filter((c) => !c.contact_name?.trim()).length,
        },
        {
          filter: "zonder-deadline",
          label: "in productie zonder deadline",
          aantal: projects.filter((p) => IN_PRODUCTIE.includes(p.status) && !p.deadline).length,
        },
      ].filter((r) => r.aantal > 0),
    [clients, projects],
  );

  return (
    <Panel className="md:col-span-6 xl:col-span-4">
      <PanelHeader icon={ClipboardList} titel="Ontbrekende gegevens" subtitel="Aanvullen maakt mailen en plannen mogelijk" />
      <PanelBody className="px-2 pb-2">
        {regels.length === 0 ? (
          <EmptyState compact icon={CircleCheck} title="Alles is compleet" />
        ) : (
          <ul>
            {regels.map((regel) => (
              <li key={regel.filter}>
                <Link
                  to={`/admin/klanten?filter=${regel.filter}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 hover:bg-muted/60"
                >
                  <span className="w-7 text-right font-medium tabular-nums">{regel.aantal}</span>
                  <span className="flex-1 text-muted-foreground">{regel.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PanelBody>
    </Panel>
  );
};

export default OntbrekendKaart;
