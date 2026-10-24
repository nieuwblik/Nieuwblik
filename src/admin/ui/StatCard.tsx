import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { TOON, type Toon } from "@/admin/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  /** Het getal zelf, al opgemaakt ("4", "€ 120"). */
  waarde: ReactNode;
  /** Klein achter het getal: "taken", "projecten". */
  eenheid?: string;
  /**
   * Eén regel context onder het getal, zoals "3 te laat" of "+2 t.o.v. vorige
   * week". Alleen tonen als die data echt bestaat; een verzonnen vergelijking
   * is erger dan geen.
   */
  context?: ReactNode;
  contextToon?: Toon;
  to: string;
  laden?: boolean;
}

/**
 * Een groot cijfer met wat het betekent. De hele kaart is de link naar de
 * gefilterde lijst achter het getal: een getal waar je niet op kunt klikken
 * roept alleen de vraag op welke taken het dan zijn.
 */
const StatCard = ({ icon: Icon, label, waarde, eenheid, context, contextToon, to, laden }: StatCardProps) => (
  <Link
    to={to}
    className="group flex min-w-0 flex-col rounded-[14px] border border-border bg-card px-5 py-4 transition-colors duration-150 hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border">
        <Icon className="h-4 w-4" />
      </span>
      <span className="truncate">{label}</span>
      <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
    </div>

    {laden ? (
      <Skeleton className="mt-4 h-8 w-16" />
    ) : (
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="font-epilogue text-[28px] font-medium leading-none tabular-nums tracking-tight sm:text-[32px]">
          {waarde}
        </span>
        {eenheid && <span className="text-sm text-muted-foreground">{eenheid}</span>}
      </p>
    )}

    <p className={cn("mt-2 min-h-[18px] truncate text-[13px] text-muted-foreground", contextToon && TOON[contextToon].tekst)}>
      {laden ? "" : context}
    </p>
  </Link>
);

export default StatCard;
