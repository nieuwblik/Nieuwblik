import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTeam } from "@/admin/queries";
import { haalUrenOp } from "@/admin/uren";
import { downloadBestand, exportPeriodes, slug, urenNaarCsv } from "@/admin/urenExport";

interface UrenExportProps {
  /** Alleen de uren van dit project; weglaten voor alles. */
  projectId?: string | null;
  /** Naam voor in het menu en de bestandsnaam, bijvoorbeeld de klant. */
  naam?: string;
  variant?: "knop" | "klein";
}

/**
 * Uren exporteren als CSV, per periode. Op de klantpagina alleen dat
 * project, op de urenpagina alles (of het project dat daar gekozen is).
 */
const UrenExport = ({ projectId = null, naam, variant = "knop" }: UrenExportProps) => {
  const { data: team = [] } = useTeam();
  const [bezig, setBezig] = useState(false);

  const exporteer = async (periode: ReturnType<typeof exportPeriodes>[number]) => {
    setBezig(true);
    try {
      const regels = await haalUrenOp({ van: periode.van, tot: periode.tot, projectId });
      if (regels.length === 0) {
        toast(`Geen uren${naam ? ` voor ${naam}` : ""} in ${periode.label.toLowerCase()}`);
        return;
      }
      const naamVan = (id: string) => team.find((lid) => lid.user_id === id)?.name ?? "Onbekend";
      const bestand = `uren-${naam ? slug(naam) : "alle-projecten"}-${periode.sleutel}.csv`;
      downloadBestand(urenNaarCsv(regels, naamVan), bestand);
      toast.success(`${regels.length} ${regels.length === 1 ? "regel" : "regels"} geëxporteerd`);
    } catch (fout) {
      toast.error(fout instanceof Error ? fout.message : "Exporteren mislukt");
    } finally {
      setBezig(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={variant === "klein" ? "h-8 px-2.5 text-[13px]" : "h-10"}
          disabled={bezig}
        >
          <Download className="h-4 w-4" />
          {bezig ? "Bezig…" : "Exporteren"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal text-muted-foreground">
          {naam ? `Uren van ${naam}` : "Uren van alle projecten"} als CSV
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {exportPeriodes().map((periode) => (
          <DropdownMenuItem key={periode.sleutel} onSelect={() => void exporteer(periode)}>
            {periode.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UrenExport;
