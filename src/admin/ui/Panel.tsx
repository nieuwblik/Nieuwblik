import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * De kaart van het portaal: icoon in een afgerond vak, titel en subtitel,
 * rechtsboven ruimte voor een filter, onder een scheidingslijn de inhoud.
 *
 * Met een voetregel krijgt de kaart een grijze lijst om zich heen en staat de
 * doorklik daarin, onder de witte kaart. Dat is de opbouw van de
 * dashboardkaarten; volle pagina's (een takenlijst) hebben geen voet en
 * blijven één wit vlak met een rand.
 *
 * Geen schaduw op de kaart zelf: rand en lijst scheiden genoeg. Schaduw is
 * voor wat over de pagina heen ligt (popovers, dialogen).
 */
export const Panel = ({
  className,
  children,
  footer,
  id,
}: {
  className?: string | undefined;
  children: ReactNode;
  /** Een PanelFooter; zet de grijze lijst om de kaart. */
  footer?: ReactNode;
  id?: string;
}) =>
  footer ? (
    <section id={id} className={cn("flex min-w-0 flex-col rounded-[16px] bg-muted/50 p-1", className)}>
      <div className="flex min-w-0 flex-1 flex-col rounded-[12px] border border-border bg-card">
        {children}
      </div>
      {footer}
    </section>
  ) : (
    <section id={id} className={cn("flex min-w-0 flex-col rounded-[16px] border border-border bg-card", className)}>
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
  /** Rechtsboven: een filter, segmented control of kleine knop. */
  actie?: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-3", className)}>
    {/* Op een telefoon een vaste basisbreedte, zodat een brede actie naar de
        volgende regel gaat in plaats van de titel tot niets af te kappen. */}
    <div className="flex min-w-0 flex-1 items-center gap-3 max-sm:basis-48">
      {Icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="p-kaarttitel truncate">{titel}</h2>
        {/* Op een telefoon mag de subtitel naar een tweede regel; afkappen
            naast een filterknop liet daar maar een halve zin over. */}
        {subtitel && <p className="text-[13px] leading-snug text-muted-foreground sm:truncate">{subtitel}</p>}
      </div>
    </div>
    {actie && <div className="flex shrink-0 items-center gap-2">{actie}</div>}
  </div>
);

export const PanelBody = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("min-w-0 flex-1 p-4", className)}>{children}</div>
);

/** In de grijze lijst onder de kaart: de doorklik naar de pagina waar alles staat. */
export const PanelFooter = ({
  to,
  children = "Bekijk details",
  extra,
}: {
  to: string;
  children?: ReactNode;
  /** Achter de linktekst, bijvoorbeeld "nog 3". */
  extra?: ReactNode;
}) => (
  <Link
    to={to}
    className="group flex items-center gap-2 rounded-b-[12px] px-4 pb-1.5 pt-2 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
  >
    <span>{children}</span>
    {extra && <span className="text-muted-foreground/70">· {extra}</span>}
    <ArrowRight className="ml-auto h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 group-active:translate-x-1.5" />
  </Link>
);
