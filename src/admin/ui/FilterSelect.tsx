import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSelectProps<T extends string> {
  waarde: T;
  onChange: (waarde: T) => void;
  opties: { waarde: T; label: string }[];
  /** Voor schermlezers: waar de keuze over gaat. */
  label: string;
}

/** Een klein filter rechtsboven in een kaart: "Laatste 8 weken", "Iedereen". */
const FilterSelect = <T extends string>({ waarde, onChange, opties, label }: FilterSelectProps<T>) => (
  <Select value={waarde} onValueChange={(v) => onChange(v as T)}>
    <SelectTrigger aria-label={label} className="h-8 w-auto gap-1.5 rounded-lg bg-background px-2.5 text-[13px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent align="end">
      {opties.map((optie) => (
        <SelectItem key={optie.waarde} value={optie.waarde} className="text-[13px]">
          {optie.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default FilterSelect;
