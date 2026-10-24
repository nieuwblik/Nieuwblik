import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSaldoVerborgen } from "@/admin/useSaldoVerborgen";

/** Het oogje naast het banksaldo: tonen of verbergen, overal tegelijk. */
const OogKnop = ({ className }: { className?: string }) => {
  const { verborgen, wissel } = useSaldoVerborgen();
  const Icoon = verborgen ? EyeOff : Eye;
  return (
    <button
      type="button"
      onClick={wissel}
      aria-pressed={verborgen}
      aria-label={verborgen ? "Banksaldo tonen" : "Banksaldo verbergen"}
      title={verborgen ? "Banksaldo tonen" : "Banksaldo verbergen"}
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
