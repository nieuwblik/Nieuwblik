import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * De kaart van het portaal: icoon in een afgerond vak, titel en subtitel,
 * rechtsboven ruimte voor een filter, daaronder de inhoud en onderaan een
 * doorklik. Elke kaart op het dashboard en de pagina's volgt deze opbouw,
 * zodat je overal op dezelfde plek kijkt voor dezelfde soort informatie.
 *
 * Geen schaduw: het grijze paginavlak en een dunne rand scheiden genoeg.
 * Schaduw is voor wat over de pagina heen ligt (popovers, dialogen).
 */
export const Panel = ({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) => (
  <section id={id} className={cn("flex min-w-0 flex-col rounded-[14px] border border-border bg-card", className)}>
    {children}
  </section>
);

export const PanelHeader = ({
  icon: Icon,
  titel,
  subtitel,
  actie,
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  titel: ReactNode;
  subtitel?: ReactNode;
  /** Rechtsboven: een segmented control, filter of kleine knop. */
  actie?: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-wrap items-start gap-x-3 gap-y-2 px-5 pb-3 pt-4", className)}>
    <div className="flex min-w-0 flex-1 items-start gap-3">
      {Icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      )}
      <div className="min-w-0 flex-1 pt-px">
        <h2 className="p-kaarttitel truncate">{titel}</h2>
        {subtitel && <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{subtitel}</p>}
      </div>
    </div>
    {actie && <div className="shrink-0">{actie}</div>}
  </div>
);

export const PanelBody = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("min-w-0 flex-1 px-5 pb-5", className)}>{children}</div>
);

/** Onderaan de kaart: de doorklik naar de pagina waar alles staat. */
export const PanelFooter = ({
  to,
  children = "Bekijk details",
  extra,
}: {
  to: string;
  children?: ReactNode;
  /** Links in de voet, bijvoorbeeld "3 meer". */
  extra?: ReactNode;
}) => (
  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border px-5 py-3 text-[13px]">
    <span className="text-muted-foreground">{extra}</span>
    <Link
      to={to}
      className="group inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-accent"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
    </Link>
  </div>
);
