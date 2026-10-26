import { useLayoutEffect, useRef, useState, type ComponentType } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";

export interface PillTab {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  /** Een getal achter het label, zoals open taken; 0 of leeg toont niets. */
  count?: number;
  /** Het getal vraagt aandacht: oranje in plaats van grijs. */
  waarschuwing?: boolean;
}

/**
 * De tabbladen van een pagina als rustige balk, in dezelfde vorm als de
 * schakelaars elders in het portaal (Lijst/Raster, Alles/Afschrijvingen): een
 * grijze ondergrond met een wit vlakje dat naar het gekozen tabblad schuift.
 * Per tabblad een klein icoon, en het aantal als zacht getal in plaats van een
 * zwarte bol. Past hij niet, dan scrolt de balk opzij in plaats van af te breken.
 *
 * Hoort binnen <Tabs>: de toetsenbordbediening en de koppeling met de inhoud
 * komen van Radix.
 */
const PillTabs = ({ tabs, value, className }: { tabs: PillTab[]; value: string; className?: string }) => {
  const lijst = useRef<HTMLDivElement>(null);
  const [vlak, setVlak] = useState<{ x: number; breedte: number } | null>(null);

  // Het vlakje meten onder het gekozen tabblad, ook als de breedte verandert
  // (een getal dat erbij komt, het lettertype dat laadt, een ander scherm).
  useLayoutEffect(() => {
    const el = lijst.current;
    if (!el) return;
    const meet = () => {
      const actief = el.querySelector<HTMLElement>(`[data-waarde="${value}"]`);
      if (actief) setVlak({ x: actief.offsetLeft, breedte: actief.offsetWidth });
    };
    meet();
    // Past de balk niet (telefoon), dan het gekozen tabblad in beeld schuiven.
    const rol = el.parentElement;
    const actief = el.querySelector<HTMLElement>(`[data-waarde="${value}"]`);
    if (rol && actief && rol.scrollWidth > rol.clientWidth) {
      const links = actief.offsetLeft - 16;
      const rechts = actief.offsetLeft + actief.offsetWidth + 16 - rol.clientWidth;
      if (rol.scrollLeft > links) rol.scrollLeft = links;
      else if (rol.scrollLeft < rechts) rol.scrollLeft = rechts;
    }
    const waarnemer = new ResizeObserver(meet);
    waarnemer.observe(el);
    for (const knop of el.querySelectorAll("[data-waarde]")) waarnemer.observe(knop);
    return () => waarnemer.disconnect();
  }, [value, tabs]);

  return (
    <div className={cn("-mx-1 overflow-x-auto px-1 [scrollbar-width:none]! [&::-webkit-scrollbar]:hidden", className)}>
      <TabsPrimitive.List
        ref={lijst}
        className="relative inline-flex items-center gap-0.5 rounded-xl border border-border bg-muted/50 p-1"
      >
        {vlak && (
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-0 rounded-lg border border-border bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,width] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${vlak.x}px)`, width: vlak.breedte }}
          />
        )}
        {tabs.map(({ value: waarde, label, icon: Icon, count, waarschuwing }) => (
          <TabsPrimitive.Trigger
            key={waarde}
            value={waarde}
            data-waarde={waarde}
            className="group relative inline-flex h-8 shrink-0 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:text-foreground active:scale-[0.97]"
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {label}
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  "min-w-5 rounded-md px-1.5 text-center text-[11px] font-medium tabular-nums",
                  waarschuwing
                    ? TOON.warning.pil
                    : "bg-foreground/[0.06] text-muted-foreground group-data-[state=active]:bg-foreground/[0.08] group-data-[state=active]:text-foreground",
                )}
              >
                {count}
              </span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </div>
  );
};

export default PillTabs;
