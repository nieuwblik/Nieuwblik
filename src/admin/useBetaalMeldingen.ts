import { useEffect } from "react";
import { toast } from "sonner";

import { heeftData, useFinancien } from "@/admin/financien";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

const SLEUTEL = "nieuwblik:portaal:betalingen-gezien";

function leesGezien(): Set<string> | null {
  try {
    const waarde = window.localStorage.getItem(SLEUTEL);
    return waarde ? new Set(JSON.parse(waarde) as string[]) : null;
  } catch {
    return null;
  }
}

function bewaarGezien(ids: Set<string>) {
  try {
    // De laatste honderd is genoeg: de serverfunctie kijkt maar twee weken terug.
    window.localStorage.setItem(SLEUTEL, JSON.stringify([...ids].slice(-100)));
  } catch {
    // Opslag geblokkeerd: dan komt een melding misschien nog een keer.
  }
}

/**
 * Een melding zodra een klant betaalt. Het portaal vraagt Moneybird elke vijf
 * minuten om de stand; elke betaling die nog niet gezien was, verschijnt dan
 * één keer als melding. De allereerste keer worden bestaande betalingen
 * stil als gezien gemarkeerd, zodat je niet met een stapel meldingen begint.
 */
export function useBetaalMeldingen(actief: boolean) {
  const { data } = useFinancien({ verversen: true, actief });
  const { bedrag } = useBedragenVerborgen();

  useEffect(() => {
    if (!data || !("bijgewerkt" in data) || !data.betalingen || !heeftData(data.betalingen)) return;
    const betalingen = data.betalingen.data;
    const gezien = leesGezien();
    if (gezien === null) {
      bewaarGezien(new Set(betalingen.map((b) => b.id)));
      return;
    }
    const nieuw = betalingen.filter((b) => !gezien.has(b.id));
    if (nieuw.length === 0) return;
    if (nieuw.length <= 3) {
      for (const b of nieuw) {
        toast.success(`${b.klant} heeft ${bedrag(b.bedrag)} betaald`, {
          description: b.nummer ? `Factuur ${b.nummer}` : undefined,
          action: { label: "Bekijken", onClick: () => window.open(b.url, "_blank", "noopener") },
        });
      }
    } else {
      toast.success(`${nieuw.length} nieuwe betalingen`, {
        description: nieuw
          .slice(0, 3)
          .map((b) => b.klant)
          .join(", "),
      });
    }
    for (const b of nieuw) gezien.add(b.id);
    bewaarGezien(gezien);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
}
