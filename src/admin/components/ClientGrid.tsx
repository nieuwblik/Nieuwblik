import { useMemo } from "react";

import { PRIORITY_WEIGHT } from "@/admin/constants";
import ClientCard from "@/admin/components/ClientCard";
import type { ClientRow } from "@/admin/rows";

/**
 * Het klantenraster, met het werk bovenaan.
 *
 * Klanten waar nog een taak ligt komen in een eigen rij erboven en blijven
 * daar tot die taak is afgerond. Daaronder de rest, op activiteit. Zonder die
 * scheiding zakt een klant met openstaand werk vanzelf naar beneden zodra er
 * ergens anders iets gebeurt, en dan moet je ernaar zoeken.
 */
const ClientGrid = ({ rows }: { rows: ClientRow[] }) => {
  const { metWerk, rest } = useMemo(() => {
    const metWerk = rows
      .filter((row) => row.openTasks > 0)
      // Binnen de bovenste rij weegt urgentie zwaarder dan activiteit: dat is
      // dezelfde volgorde als de kleur van de voet, dus het leest als één ding.
      .sort((a, b) => PRIORITY_WEIGHT[a.urgentie ?? "laag"] - PRIORITY_WEIGHT[b.urgentie ?? "laag"]);

    return { metWerk, rest: rows.filter((row) => row.openTasks === 0) };
  }, [rows]);

  const raster = "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4";
  const kopje = "text-xs uppercase tracking-wide text-muted-foreground";

  // Zonder werk is er niets te scheiden: dan gewoon één raster, zonder kopjes
  // die alleen maar ruimte kosten.
  if (metWerk.length === 0) {
    return (
      <ul className={raster}>
        {rows.map((row) => (
          <ClientCard key={row.key} row={row} />
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className={kopje}>
          Open taak · {metWerk.length} {metWerk.length === 1 ? "klant" : "klanten"}
        </p>
        <ul className={raster}>
          {metWerk.map((row) => (
            <ClientCard key={row.key} row={row} />
          ))}
        </ul>
      </div>

      {rest.length > 0 && (
        <div className="space-y-2">
          <p className={kopje}>Niets openstaand</p>
          <ul className={raster}>
            {rest.map((row) => (
              <ClientCard key={row.key} row={row} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientGrid;
