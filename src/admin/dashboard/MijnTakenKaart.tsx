import { useMemo, useState } from "react";
import { CheckSquare, ListTodo, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import EmptyState from "@/admin/components/EmptyState";
import TaskList, { sortTasks } from "@/admin/components/TaskList";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { hoofdtaken } from "@/admin/constants";
import { useTasks, useTeam } from "@/admin/queries";
import { useCreateTask } from "@/admin/useCreateTask";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "@/admin/ui/Panel";
import SegmentedControl from "@/admin/ui/SegmentedControl";

const MAX = 8;

type Wie = "ik" | "iedereen";

/**
 * Het werk dat bij jou ligt, met één klik ook dat van je collega. Met z'n
 * tweeën werk je door dezelfde stapel; standaard zie je je eigen deel,
 * zodat de kaart niet volloopt met wat een ander oppakt.
 */
const MijnTakenKaart = ({ className }: { className?: string }) => {
  const { user } = useAdminAuth();
  const { data: tasks = [] } = useTasks();
  const { data: team = [] } = useTeam();
  const { createTask, isPending } = useCreateTask();
  const [wie, setWie] = useState<Wie>("ik");

  const open = useMemo(
    () =>
      sortTasks(
        hoofdtaken(tasks).filter((t) => t.status !== "klaar" && (wie === "iedereen" || t.assigned_to === user?.id)),
      ),
    [tasks, wie, user?.id],
  );

  const zichtbaar = open.slice(0, MAX);
  const rest = open.length - zichtbaar.length;

  return (
    <Panel
      className={className}
      footer={
        <PanelFooter
          to={wie === "ik" ? "/admin/taken?wie=ik&status=open" : "/admin/taken?status=open"}
          extra={rest > 0 ? `Nog ${rest} open` : undefined}
        >
          Bekijk alle taken
        </PanelFooter>
      }
    >
      <PanelHeader
        icon={ListTodo}
        titel={wie === "ik" ? "Mijn taken" : "Alle open taken"}
        subtitel={`${open.length} open, urgent en vroegste deadline eerst`}
        actie={
          <SegmentedControl
            label="Wiens taken"
            waarde={wie}
            onChange={setWie}
            opties={[
              { waarde: "ik", label: "Mijn" },
              { waarde: "iedereen", label: "Iedereen" },
            ]}
          />
        }
      />
      <PanelBody>
        <TaskList
          tasks={zichtbaar}
          team={team}
          empty={
            <EmptyState
              compact
              icon={CheckSquare}
              title={wie === "ik" ? "Niets op jouw naam" : "Niets openstaand"}
              description={wie === "ik" ? "Er ligt geen open taak bij jou." : "Er staat geen werk meer open."}
              action={
                <Button variant="outline" size="sm" disabled={isPending} onClick={() => void createTask(null)}>
                  <Plus className="h-4 w-4" />
                  Nieuwe taak
                </Button>
              }
            />
          }
        />
      </PanelBody>
    </Panel>
  );
};

export default MijnTakenKaart;
