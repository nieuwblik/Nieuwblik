import { useMemo } from "react";

import { PRIORITY_WEIGHT } from "@/admin/constants";
import ClientCard from "@/admin/components/ClientCard";
import type { ClientRow } from "@/admin/rows";

/**
 * Welk deel van de klanten dit raster toont.
 *
 * Op het beginscherm staan de twee groepen los van elkaar: wie aandacht
 * vraagt bovenaan de pagina, de rest onderaan. Op de klantenpagina staan ze
 * onder elkaar in één blok.
 */
export type Groep = "alles" | "werk" | "rest";

interface ClientGridProps {
  rows: ClientRow[];
  groep?: Groep;
}

const RASTER = "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4";
const KOPJE = "text-xs uppercase tracking-wide text-muted-foreground";

/**
 * Het klantenraster, met het werk bovenaan.
 *
 * Klanten waar nog een taak ligt komen in een eigen rij en blijven daar tot
 * die taak is afgerond. Zonder die scheiding zakt een klant met openstaand
 * werk vanzelf naar beneden zodra er ergens anders iets gebeurt, en dan moet
 * je ernaar zoeken.
 */
const ClientGrid = ({ rows, groep = "alles" }: ClientGridProps) => {
  const { metWerk, rest } = useMemo(() => {
    const metWerk = rows
      .filter((row) => row.openTasks > 0)
      // Binnen de bovenste rij weegt urgentie zwaarder dan activiteit: dat is
      // dezelfde volgorde als de kleur van de voet, dus het leest als één ding.
      .sort((a, b) => PRIORITY_WEIGHT[a.urgentie ?? "laag"] - PRIORITY_WEIGHT[b.urgentie ?? "laag"]);

    return { metWerk, rest: rows.filter((row) => row.openTasks === 0) };
  }, [rows]);

  const raster = (lijst: ClientRow[]) => (
    <ul className={RASTER}>
      {lijst.map((row) => (
        <ClientCard key={row.key} row={row} />
      ))}
    </ul>
  );

  // Losse groepen: de aanroeper zet zelf een kop erboven.
  if (groep === "werk") return metWerk.length > 0 ? raster(metWerk) : null;
  if (groep === "rest") return rest.length > 0 ? raster(rest) : null;

  // Zonder werk is er niets te scheiden: dan één raster, zonder kopjes die
  // alleen maar ruimte kosten.
  if (metWerk.length === 0) return raster(rows);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className={KOPJE}>
          Open taak · {metWerk.length} {metWerk.length === 1 ? "klant" : "klanten"}
        </p>
        {raster(metWerk)}
      </div>

      {rest.length > 0 && (
        <div className="space-y-2">
          <p className={KOPJE}>Niets openstaand</p>
          {raster(rest)}
        </div>
      )}
    </div>
  );
};

export default ClientGrid;
