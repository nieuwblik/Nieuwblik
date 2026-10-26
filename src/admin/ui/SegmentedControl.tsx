import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  opties: { waarde: T; label: string }[];
  waarde: T;
  onChange: (waarde: T) => void;
  /** Voor schermlezers: waar de keuze over gaat. */
  label: string;
}

/**
 * Een kleine keuze uit twee tot vier standen, zoals "7d" en "1m".
 *
 * Het witte vlakje schuift naar de gekozen stand in plaats van te
 * verspringen: zo zie je waar je keuze heen gaat, en voelt de klik als een
 * schakelaar in plaats van een knop die ineens een andere kleur heeft.
 */
const SegmentedControl = <T extends string>({ opties, waarde, onChange, label }: SegmentedControlProps<T>) => {
  const knoppen = useRef<Record<string, HTMLButtonElement | null>>({});
  const [vlak, setVlak] = useState<{ x: number; breedte: number } | null>(null);

  useLayoutEffect(() => {
    const knop = knoppen.current[waarde];
    if (knop) setVlak({ x: knop.offsetLeft, breedte: knop.offsetWidth });
  }, [waarde, opties.length]);

  return (
    <div role="group" aria-label={label} className="relative inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
      {vlak && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0.5 left-0 rounded-md border border-border bg-background transition-[transform,width] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(${vlak.x}px)`, width: vlak.breedte }}
        />
      )}
      {opties.map((optie) => (
        <button
          key={optie.waarde}
          ref={(el) => {
            knoppen.current[optie.waarde] = el;
          }}
          type="button"
          aria-pressed={optie.waarde === waarde}
          onClick={() => onChange(optie.waarde)}
          className={cn(
            "relative rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 active:scale-95",
            optie.waarde === waarde ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {optie.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
