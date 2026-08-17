import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/admin/components/EmptyState";
import StatusBadge from "@/admin/components/StatusBadge";
import { formatDateTime } from "@/admin/format";
import { useAddUpdate, useDeleteUpdate, useProjectUpdates, type TeamMember } from "@/admin/queries";
import type { UpdateKind } from "@/admin/constants";

interface UpdatesTimelineProps {
  projectId: string;
  userId: string | null;
  team: TeamMember[];
}

const UpdatesTimeline = ({ projectId, userId, team }: UpdatesTimelineProps) => {
  const { data: updates = [], isLoading } = useProjectUpdates(projectId);
  const add = useAddUpdate();
  const remove = useDeleteUpdate(projectId);
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<UpdateKind>("update");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = body.trim();
    if (!text) return;

    try {
      await add.mutateAsync({ project_id: projectId, body: text, kind, author_id: userId });
      setBody("");
      toast.success("Geplaatst");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Plaatsen mislukt");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Dit bericht verwijderen?")) return;
    try {
      await remove.mutateAsync(id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verwijderen mislukt");
    }
  };

  const authorName = (id: string | null) => (id ? (team.find((m) => m.user_id === id)?.name ?? "Onbekend") : "Systeem");

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          rows={3}
          placeholder="Wat is er gebeurd? Je collega leest het hier terug."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={10000}
        />
        <div className="flex items-center justify-between gap-3">
          <Select value={kind} onValueChange={(v) => setKind(v as UpdateKind)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="notitie">Notitie</SelectItem>
              <SelectItem value="mijlpaal">Mijlpaal</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={add.isPending || !body.trim()}>
            {add.isPending ? "Plaatsen…" : "Plaatsen"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Tijdlijn laden…</p>
      ) : updates.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nog geen updates"
          description="Statuswijzigingen komen hier automatisch te staan."
        />
      ) : (
        <ol className="space-y-4 border-l border-border pl-5">
          {updates.map((update) => (
            <li key={update.id} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-border" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge kind="update" value={update.kind} />
                    <span className="text-xs text-muted-foreground">
                      {authorName(update.author_id)} · {formatDateTime(update.created_at)}
                    </span>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm">{update.body}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => void handleDelete(update.id)}
                  aria-label="Verwijderen"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default UpdatesTimeline;
