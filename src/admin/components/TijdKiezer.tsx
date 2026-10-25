import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TijdKiezerProps {
  id?: string;
  /** "HH:mm" */
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const UREN = Array.from({ length: 24 }, (_, i) => `${i}`.padStart(2, "0"));
const MINUTEN = Array.from({ length: 12 }, (_, i) => `${i * 5}`.padStart(2, "0"));

/**
 * Tijd invullen in de stijl van het portaal. Typen blijft het snelst ("930",
 * "21.18" en "9" worden vanzelf 09:30, 21:18 en 09:00); het klokje opent een
 * keuzelijst met uren en minuten per vijf, in plaats van de grijze
 * keuzelijst van de browser.
 */
const TijdKiezer = ({ id, value, onChange, className }: TijdKiezerProps) => {
  const [tekst, setTekst] = useState(value);
  const [open, setOpen] = useState(false);
  const lijsten = useRef<HTMLDivElement>(null);

  useEffect(() => setTekst(value), [value]);

  // Bij openen het gekozen uur en de minuut in beeld schuiven.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      lijsten.current
        ?.querySelectorAll<HTMLElement>("[data-gekozen=true]")
        .forEach((el) => el.scrollIntoView({ block: "center" }));
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const [uur = "", minuut = ""] = value.split(":");

  /** Wat er getypt is netjes maken; iets onleesbaars zet de vorige waarde terug. */
  const bevestig = () => {
    const cijfers = tekst.replace(/[^\d]/g, "");
    let u: number;
    let m: number;
    if (/[:.]/.test(tekst)) {
      const [a = "", b = ""] = tekst.split(/[:.]/);
      u = Number(a);
      m = Number(b || 0);
    } else if (cijfers.length <= 2) {
      u = Number(cijfers);
      m = 0;
    } else {
      u = Number(cijfers.slice(0, cijfers.length - 2));
      m = Number(cijfers.slice(-2));
    }
    if (cijfers === "" || !Number.isInteger(u) || !Number.isInteger(m) || u > 23 || m > 59) {
      setTekst(value);
      return;
    }
    const nieuw = `${`${u}`.padStart(2, "0")}:${`${m}`.padStart(2, "0")}`;
    setTekst(nieuw);
    if (nieuw !== value) onChange(nieuw);
  };

  const knop = (waarde: string, gekozen: boolean, kies: () => void) => (
    <button
      key={waarde}
      type="button"
      data-gekozen={gekozen}
      onClick={kies}
      className={cn(
        "w-full rounded-md py-1.5 text-center text-sm tabular-nums transition-colors",
        gekozen ? "bg-foreground font-medium text-background" : "hover:bg-muted",
      )}
    >
      {waarde}
    </button>
  );

  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-[var(--veld-radius,0.375rem)] border border-input bg-background pl-3 pr-1 text-sm transition-colors focus-within:border-foreground/30",
        className,
      )}
    >
      <input
        id={id}
        value={tekst}
        inputMode="numeric"
        autoComplete="off"
        maxLength={5}
        onChange={(e) => setTekst(e.target.value)}
        onBlur={bevestig}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            bevestig();
          }
        }}
        className="w-full min-w-0 bg-transparent tabular-nums outline-none"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Tijd kiezen"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
          >
            <Clock className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-1.5">
          <div ref={lijsten} className="flex gap-1">
            <div className="h-56 w-14 space-y-0.5 overflow-y-auto pr-0.5" aria-label="Uur">
              {UREN.map((u) => knop(u, u === uur, () => onChange(`${u}:${minuut || "00"}`)))}
            </div>
            <div className="w-px bg-border" />
            <div className="h-56 w-14 space-y-0.5 overflow-y-auto pr-0.5" aria-label="Minuten">
              {MINUTEN.map((m) =>
                knop(m, m === minuut, () => {
                  onChange(`${uur || "09"}:${m}`);
                  setOpen(false);
                }),
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TijdKiezer;
