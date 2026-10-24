import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { useBedragenVerborgen } from "@/admin/useBedragenVerborgen";

/** Het oogje bij de financiële cijfers: bedragen tonen of verbergen, overal tegelijk. */
const OogKnop = ({ className }: { className?: string }) => {
  const { verborgen, wissel } = useBedragenVerborgen();
  const Icoon = verborgen ? EyeOff : Eye;
  return (
    <button
      type="button"
      onClick={wissel}
      aria-pressed={verborgen}
      aria-label={verborgen ? "Bedragen tonen" : "Bedragen verbergen"}
      title={verborgen ? "Bedragen tonen" : "Bedragen verbergen"}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-90",
        className,
      )}
    >
      <Icoon className="h-4 w-4" />
    </button>
  );
};

export default OogKnop;
