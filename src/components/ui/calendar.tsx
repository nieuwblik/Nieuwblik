import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Kalender op react-day-picker, volledig opgemaakt met de tokens van het
 * portaal. De native datumkiezer van de browser is niet te stylen en ziet er
 * per besturingssysteem anders uit; dit ziet er overal hetzelfde uit en volgt
 * de licht- en donkerstand mee.
 *
 * De klassennamen zijn die van react-day-picker 9 (month_caption, weekdays,
 * day_button, ...). De oude namen uit versie 8 (caption, head_row, cell)
 * worden genegeerd, en dan valt de kalender uit elkaar: alle dagnamen op één
 * regel en de pijltjes los naast de maand.
 */
function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "space-y-3",
        month_caption: "flex h-7 items-center justify-center",
        caption_label: "text-sm font-medium first-letter:uppercase",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "z-10 h-7 w-7 bg-transparent p-0 text-muted-foreground hover:text-foreground",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "z-10 h-7 w-7 bg-transparent p-0 text-muted-foreground hover:text-foreground",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-[0.8rem] font-normal text-muted-foreground",
        weeks: "space-y-1",
        week: "mt-1 flex w-full",
        day: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal"),
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        today: "[&>button]:bg-muted [&>button]:font-semibold [&>button]:text-foreground",
        outside: "text-muted-foreground/40",
        disabled: "text-muted-foreground/40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
