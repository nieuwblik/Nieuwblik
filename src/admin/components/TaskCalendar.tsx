import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import MonthGrid, { groepeerPerDag } from "@/admin/components/MonthGrid";
import QuickCapture from "@/admin/components/QuickCapture";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { ACCENT } from "@/admin/constants";
import { useSaveTask, useTasks } from "@/admin/queries";

/**
 * Compacte kalender voor het dashboard: stippen in plaats van titels, en de
 * gekozen dag eronder. De volledige weergave staat op /admin/kalender.
 */
const TaskCalendar = () => {
  const { user } = useAdminAuth();
  const { data: tasks = [] } = useTasks();
  const save = useSaveTask();

  const [maand, setMaand] = useState(() => startOfMonth(new Date()));
  const [gekozenDag, setGekozenDag] = useState<Date>(() => new Date());
  const [titel, setTitel] = useState("");
  const [nieuwOpDag, setNieuwOpDag] = useState<string | null>(null);

  const perDag = useMemo(() => groepeerPerDag(tasks), [tasks]);
  const dagSleutel = format(gekozenDag, "yyyy-MM-dd");
  const takenVandaag = perDag.get(dagSleutel) ?? [];

  const voegToe = async () => {
    const schoon = titel.trim();
    if (!schoon || save.isPending) return;
    try {
      await save.mutateAsync({
        values: {
          title: schoon.slice(0, 300),
          due_date: dagSleutel,
          assigned_to: user?.id ?? null,
          created_by: user?.id ?? null,
        },
      });
      setTitel("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toevoegen mislukt");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMaand(subMonths(maand, 1))} aria-label="Vorige maand">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[8rem] text-sm font-medium">{format(maand, "LLLL yyyy", { locale: nl })}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMaand(addMonths(maand, 1))} aria-label="Volgende maand">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Link
          to="/admin/kalender"
          className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Hele kalender
        </Link>
      </div>

      <MonthGrid
        maand={maand}
        gekozenDag={gekozenDag}
        perDag={perDag}
        onSelectDay={setGekozenDag}
        onAddOnDay={(dag) => {
          setGekozenDag(dag);
          setNieuwOpDag(format(dag, "yyyy-MM-dd"));
        }}
        compact
        dagPopup
      />

      <div>
        <p className="text-sm font-medium">{format(gekozenDag, "EEEE d MMMM", { locale: nl })}</p>

        {takenVandaag.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {takenVandaag.map((taak) => (
              <li key={taak.id} className="flex items-center gap-2 text-sm">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", ACCENT[taak.priority].stip)} />
                <Link to={`/admin/taken/${taak.id}`} className="min-w-0 flex-1 truncate hover:underline">
                  {taak.title}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2 flex gap-2">
          <Input
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              void voegToe();
            }}
            placeholder={`Taak op ${format(gekozenDag, "d MMMM", { locale: nl })}…`}
            maxLength={300}
            aria-label="Taak op deze dag"
          />
          <Button variant="outline" onClick={() => void voegToe()} disabled={!titel.trim() || save.isPending}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <QuickCapture
        open={nieuwOpDag !== null}
        onOpenChange={(waarde) => !waarde && setNieuwOpDag(null)}
        defaultDueDate={nieuwOpDag}
      />
    </div>
  );
};

export default TaskCalendar;
