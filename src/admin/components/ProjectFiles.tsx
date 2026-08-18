import { useRef, useState } from "react";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EmptyState from "@/admin/components/EmptyState";
import { formatDateTime, formatFileSize } from "@/admin/format";
import { useConfirm } from "@/admin/useConfirm";
import {
  getFileUrl,
  useDeleteFile,
  useProjectFiles,
  useUploadFile,
  type ProjectFile,
  type TeamMember,
} from "@/admin/queries";

interface ProjectFilesProps {
  projectId: string;
  userId: string | null;
  team: TeamMember[];
}

/** Gelijk aan de file_size_limit op de bucket; hier alvast afvangen scheelt een mislukte upload. */
const MAX_BYTES = 50 * 1024 * 1024;

const ProjectFiles = ({ projectId, userId, team }: ProjectFilesProps) => {
  const { data: files = [], isLoading } = useProjectFiles(projectId);
  const upload = useUploadFile(projectId);
  const remove = useDeleteFile(projectId);
  const { vraagBevestiging, dialoog } = useConfirm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (list: FileList | null) => {
    if (!list?.length) return;

    for (const file of Array.from(list)) {
      if (file.size > MAX_BYTES) {
        toast.error(`"${file.name}" is groter dan 50 MB`);
        continue;
      }
      try {
        await upload.mutateAsync({ file, userId });
        toast.success(`"${file.name}" geüpload`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Uploaden van "${file.name}" mislukt`);
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDownload = async (file: ProjectFile) => {
    try {
      // De bucket is privaat: elke download krijgt een verse link die na een
      // minuut verloopt, zodat een doorgestuurde URL niets blijvends opent.
      const url = await getFileUrl(file.storage_path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kon het bestand niet openen");
    }
  };

  const handleDelete = async (file: ProjectFile) => {
    if (!(await vraagBevestiging({ titel: `"${file.file_name}" definitief verwijderen?` }))) return;
    try {
      await remove.mutateAsync(file);
      toast.success("Bestand verwijderd");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verwijderen mislukt");
    }
  };

  const uploaderName = (id: string | null) =>
    id ? (team.find((m) => m.user_id === id)?.name ?? "Onbekend") : "Onbekend";

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-lg border border-dashed px-6 py-8 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm">Sleep bestanden hierheen</p>
        <p className="mt-1 text-xs text-muted-foreground">Maximaal 50 MB per bestand</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={upload.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? "Uploaden…" : "Bestanden kiezen"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Bestanden laden…</p>
      ) : files.length === 0 ? (
        <EmptyState icon={FileText} title="Nog geen bestanden" description="Upload ontwerpen, teksten of aanleveringen." />
      ) : (
        <ul className="divide-y divide-border">
          {files.map((file) => (
            <li key={file.id} className="flex items-center gap-3 py-3">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.file_size)} · {uploaderName(file.uploaded_by)} ·{" "}
                  {formatDateTime(file.created_at)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => void handleDownload(file)}
                aria-label="Downloaden"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => void handleDelete(file)}
                aria-label="Verwijderen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {dialoog}
    </div>
  );
};

export default ProjectFiles;
