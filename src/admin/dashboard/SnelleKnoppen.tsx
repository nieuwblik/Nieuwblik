import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Clock, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import BonUploaden from "@/admin/components/BonUploaden";
import { useCreateTask } from "@/admin/useCreateTask";

const KNOP =
  "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 text-[13px] font-medium transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.97]";

/**
 * Op een telefoon, onder de begroeting: wat je onderweg doet. Een bon
 * fotograferen, een taak noteren, uren invullen. De timer staat al in de
 * bovenbalk. Op een groter scherm verdwijnt deze rij; daar staan dezelfde
 * acties in de zijbalk en op de pagina's zelf.
 */
const SnelleKnoppen = ({ className }: { className?: string }) => {
  const [bon, setBon] = useState(false);
  const { createTask, isPending } = useCreateTask();

  return (
    <div className={cn("grid grid-cols-3 gap-2 sm:hidden", className)}>
      <button type="button" className={KNOP} onClick={() => setBon(true)}>
        <Camera className="h-5 w-5 text-muted-foreground" />
        Bon
      </button>
      <button type="button" className={KNOP} disabled={isPending} onClick={() => void createTask(null)}>
        <Plus className="h-5 w-5 text-muted-foreground" />
        Taak
      </button>
      <Link to="/admin/uren?nieuw=1" className={KNOP}>
        <Clock className="h-5 w-5 text-muted-foreground" />
        Uren
      </Link>
      <BonUploaden open={bon} onOpenChange={setBon} />
    </div>
  );
};

export default SnelleKnoppen;
