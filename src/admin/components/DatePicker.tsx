import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  /** Datum zoals de database hem bewaart: YYYY-MM-DD, of null. */
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * Datumkiezer in de stijl van het portaal.
 *
 * De waarde blijft een kale YYYY-MM-DD-tekst, precies zoals de kolom in de
 * database. Omzetten gebeurt in lokale tijd en niet via UTC: bij een datum
 * zonder tijd zou dat in Nederland een dag kunnen verspringen.
 */
const DatePicker = ({ value, onChange, placeholder = "Geen datum", className, ...rest }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const parsed = value ? parseISO(value) : null;
  const selected = parsed && isValid(parsed) ? parsed : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={rest["aria-label"]}
          className={cn(
            "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors hover:bg-muted",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0 opacity-60" />
          <span className="truncate">{selected ? format(selected, "d MMMM yyyy", { locale: nl }) : placeholder}</span>

          {selected && (
            // Wissen zit in de knop zelf: een aparte knop ernaast zou een
            // extra element zijn voor iets wat je zelden doet.
            <span
              role="button"
              tabIndex={0}
              aria-label="Datum wissen"
              className="ml-auto rounded p-0.5 text-muted-foreground hover:text-foreground"
              onClick={(event) => {
                event.stopPropagation();
                onChange(null);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                onChange(null);
              }}
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <Calendar
          mode="single"
          locale={nl}
          weekStartsOn={1}
          {...(selected ? { defaultMonth: selected, selected } : {})}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : null);
            setOpen(false);
          }}
        />
        <div className="flex items-center justify-between border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Wissen
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(format(new Date(), "yyyy-MM-dd"));
              setOpen(false);
            }}
          >
            Vandaag
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
