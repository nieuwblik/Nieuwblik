import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TOON } from "@/admin/constants";
import { useMeldingen } from "@/admin/useMeldingen";

/**
 * De bel in de bovenbalk: alles wat nu aandacht vraagt, in één lijst. Te
 * late taken, nieuwe aanvragen, de btw-aangifte, facturen en offertes,
 * betalingen van de laatste dagen en hosting die gefactureerd moet worden.
 * Een melding verdwijnt vanzelf als de oorzaak is opgelost. Het stipje staat
 * aan zolang er iets is dat om actie vraagt (betalingen tellen niet mee).
 */
const MeldingenCentrum = () => {
  const meldingen = useMeldingen();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const actie = meldingen.filter((m) => m.toon !== "success" && m.toon !== "neutral").length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={actie > 0 ? `${actie} ${actie === 1 ? "melding" : "meldingen"}` : "Meldingen"}
          aria-label={actie > 0 ? `${actie} ${actie === 1 ? "melding" : "meldingen"}` : "Meldingen"}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-90 data-[state=open]:bg-muted data-[state=open]:text-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
          {actie > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-background" />}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-1.5">
        <p className="px-2.5 pb-1.5 pt-1 text-[13px] font-medium text-muted-foreground">Meldingen</p>
        {meldingen.length === 0 ? (
          <p className="px-2.5 pb-3 pt-1 text-sm text-muted-foreground">Alles is bij. Niets dat nu aandacht vraagt.</p>
        ) : (
          <ul className="max-h-[70vh] overflow-y-auto">
            {meldingen.map((m) => (
              <li key={m.sleutel}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate(m.to);
                  }}
                  className="group flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-foreground/[0.06]"
                >
                  <span className={cn("mt-[7px] h-2 w-2 shrink-0 rounded-full", TOON[m.toon].stip)} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] leading-snug">{m.tekst}</span>
                    {m.uitleg && <span className="block truncate text-[13px] text-muted-foreground">{m.uitleg}</span>}
                  </span>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default MeldingenCentrum;
