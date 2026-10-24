import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  opties: { waarde: T; label: string }[];
  waarde: T;
  onChange: (waarde: T) => void;
  /** Voor schermlezers: waar de keuze over gaat. */
  label: string;
}

/** Een kleine keuze uit twee tot vier standen, zoals "7d" en "1m". */
const SegmentedControl = <T extends string>({ opties, waarde, onChange, label }: SegmentedControlProps<T>) => (
  <div role="group" aria-label={label} className="inline-flex rounded-lg border border-border p-0.5">
    {opties.map((optie) => (
      <button
        key={optie.waarde}
        type="button"
        aria-pressed={optie.waarde === waarde}
        onClick={() => onChange(optie.waarde)}
        className={cn(
          "rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150",
          optie.waarde === waarde
            ? "bg-accent/10 text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {optie.label}
      </button>
    ))}
  </div>
);

export default SegmentedControl;
