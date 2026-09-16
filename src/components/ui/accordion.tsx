import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCollapse } from "@/lib/collapse";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * Accordion met dezelfde API als de Radix-versie die hier stond, maar de inhoud
 * van een dicht item blijft in de DOM (met `hidden`). Radix rendert de
 * children alleen als het item open is, ook met forceMount; daardoor stonden
 * FAQ-antwoorden niet in de server-HTML.
 *
 * Toegankelijkheid zoals het WAI-ARIA accordion-patroon: knop in een kop, met
 * aria-expanded en aria-controls; het paneel is een region met
 * aria-labelledby. Pijltjestoetsen, Home en End wisselen tussen de knoppen.
 */

const DUUR_MS = 200;

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

const useAccordion = () => {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion-onderdelen moeten binnen <Accordion> staan");
  return ctx;
};

type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: "single" | "multiple";
  /** Bij type single: mag het open item weer dicht. */
  collapsible?: boolean;
  defaultValue?: string | string[];
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = "single", collapsible = false, defaultValue, className, children, ...props }, ref) => {
    const [open, setOpen] = React.useState<string[]>(
      defaultValue === undefined ? [] : Array.isArray(defaultValue) ? defaultValue : [defaultValue],
    );
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    const toggle = React.useCallback(
      (value: string) =>
        setOpen((huidig) => {
          const isOpen = huidig.includes(value);
          if (type === "multiple") return isOpen ? huidig.filter((v) => v !== value) : [...huidig, value];
          if (isOpen) return collapsible ? [] : huidig;
          return [value];
        }),
      [type, collapsible],
    );

    const ctx = React.useMemo<AccordionContextValue>(
      () => ({ isOpen: (value) => open.includes(value), toggle, rootRef }),
      [open, toggle],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div
          ref={(node) => {
            rootRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={className}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

interface ItemContextValue {
  value: string;
  open: boolean;
  triggerId: string;
  contentId: string;
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

const useItem = () => {
  const ctx = React.useContext(ItemContext);
  if (!ctx) throw new Error("AccordionTrigger en AccordionContent moeten binnen <AccordionItem> staan");
  return ctx;
};

type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & { value: string };

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({ value, className, ...props }, ref) => {
  const { isOpen } = useAccordion();
  const id = React.useId();
  const open = isOpen(value);
  const item = React.useMemo(
    () => ({ value, open, triggerId: `${id}-trigger`, contentId: `${id}-content` }),
    [value, open, id],
  );
  return (
    <ItemContext.Provider value={item}>
      <div ref={ref} data-state={open ? "open" : "closed"} className={cn("border-b", className)} {...props} />
    </ItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, onClick, onKeyDown, ...props }, ref) => {
    const { toggle, rootRef } = useAccordion();
    const { value, open, triggerId, contentId } = useItem();

    const naarKnop = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const knoppen = Array.from(
        rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]") ?? [],
      );
      const i = knoppen.indexOf(event.currentTarget);
      const doel =
        event.key === "ArrowDown" ? knoppen[(i + 1) % knoppen.length]
        : event.key === "ArrowUp" ? knoppen[(i - 1 + knoppen.length) % knoppen.length]
        : event.key === "Home" ? knoppen[0]
        : event.key === "End" ? knoppen[knoppen.length - 1]
        : undefined;
      if (doel) {
        event.preventDefault();
        doel.focus();
      }
    };

    return (
      <h3 className="flex">
        <button
          ref={ref}
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={contentId}
          data-state={open ? "open" : "closed"}
          data-accordion-trigger=""
          className={cn(
            "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
            className,
          )}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) toggle(value);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented) naarKnop(event);
          }}
          {...props}
        >
          {children}
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </button>
      </h3>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, triggerId, contentId } = useItem();
    const reduced = useReducedMotion();
    const { hidden, expanded } = useCollapse(open, reduced ? 0 : DUUR_MS);

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={hidden}
        data-state={open ? "open" : "closed"}
        className={cn(
          "grid text-sm transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        {...props}
      >
        <div className="min-h-0 overflow-clip">
          <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </div>
      </div>
    );
  },
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
