import { addMonths, format, isSameMonth, startOfMonth, subMonths } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Vorige, deze en volgende maand. De kalender en hosting gebruiken dezelfde
 * bediening, zodat bladeren door maanden overal hetzelfde werkt.
 */
const MonthNav = ({
  maand,
  onChange,
  onVandaag,
}: {
  maand: Date;
  onChange: (maand: Date) => void;
  /** Extra werk bij "Deze maand", zoals de gekozen dag terugzetten. */
  onVandaag?: () => void;
}) => (
  <div className="flex items-center gap-1">
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange(subMonths(maand, 1))} aria-label="Vorige maand">
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <span className="min-w-[8.5rem] text-center text-sm font-medium first-letter:uppercase">
      {format(maand, "LLLL yyyy", { locale: nl })}
    </span>
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange(addMonths(maand, 1))} aria-label="Volgende maand">
      <ChevronRight className="h-4 w-4" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="ml-1 h-8"
      disabled={isSameMonth(maand, new Date()) && !onVandaag}
      onClick={() => {
        onChange(startOfMonth(new Date()));
        onVandaag?.();
      }}
    >
      Vandaag
    </Button>
  </div>
);

export default MonthNav;
