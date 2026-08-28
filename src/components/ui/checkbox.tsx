import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

/**
 * Het vinkje tekent zichzelf in plaats van te verschijnen, en het vakje krimpt
 * even onder de muis. Dat zijn de twee momenten waarop je terugkoppeling wilt:
 * dat je raakt wat je aanwijst, en dat je klik is aangekomen.
 *
 * Geen lucide-Check hier: die heeft een vaste vorm en geen padlengte om mee te
 * animeren. Met pathLength="1" loopt de streep van 1 naar 0, ongeacht de
 * werkelijke lengte van het pad.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer relative h-4 w-4 shrink-0 rounded-[4px] border border-primary/50 ring-offset-background",
      // Onzichtbaar raakgebied rondom: met een vinger mik je niet op 16 pixels.
      "after:absolute after:-inset-2.5 after:content-['']",
      "transition-[background-color,border-color,transform] duration-150 ease-out",
      "hover:border-primary active:scale-90",
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" pathLength={1} className="animate-check-draw [stroke-dasharray:1]" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
