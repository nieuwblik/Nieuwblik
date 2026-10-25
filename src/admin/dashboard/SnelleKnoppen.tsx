import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Clock, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import BonUploaden from "@/admin/components/BonUploaden";
import { useCreateTask } from "@/admin/useCreateTask";

const KNOP =
  "flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-[13px] font-medium transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]";
const GEWOON = "border-border bg-card hover:bg-muted";
/** Op de startpagina: matglas op de achtergrondscène. */
const GLAS = "border-white/15 bg-[rgba(18,24,36,0.38)] text-white backdrop-blur-2xl backdrop-saturate-150 hover:bg-[rgba(18,24,36,0.5)]";

/**
 * Op een telefoon, onder de begroeting: wat je onderweg doet. Een bon
 * fotograferen, een taak noteren, uren invullen. De timer staat al in de
 * bovenbalk. Op een groter scherm verdwijnt deze rij; daar staan dezelfde
 * acties in de zijbalk en op de pagina's zelf.
 */
const SnelleKnoppen = ({ className, glas = false }: { className?: string; glas?: boolean }) => {
  const knop = cn(KNOP, glas ? GLAS : GEWOON);
  const icoon = cn("h-5 w-5", glas ? "text-white/70" : "text-muted-foreground");
  const [bon, setBon] = useState(false);
  const { createTask, isPending } = useCreateTask();

  return (
    <div className={cn("grid grid-cols-3 gap-2 sm:hidden", className)}>
      <button type="button" className={knop} onClick={() => setBon(true)}>
        <Camera className={icoon} />
        Bon
      </button>
      <button type="button" className={knop} disabled={isPending} onClick={() => void createTask(null)}>
        <Plus className={icoon} />
        Taak
      </button>
      <Link to="/admin/uren?nieuw=1" className={knop}>
        <Clock className={icoon} />
        Uren
      </Link>
      <BonUploaden open={bon} onOpenChange={setBon} />
    </div>
  );
};

export default SnelleKnoppen;
