import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/admin/format";
import { getFileUrl, useDeleteTaskImage, useTaskFiles, useUploadTaskImage, type TaskFile } from "@/admin/queries";
import { isSupportedImage, toWebp } from "@/admin/webp";

interface TaskImagesProps {
  taskId: string;
  userId: string | null;
}

/**
 * Toont één foto. De bucket is privaat, dus de weergave gaat via een signed
 * URL die per foto wordt opgehaald zodra hij in beeld komt.
 */
const Thumb = ({ file, onDelete }: { file: TaskFile; onDelete: () => void }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getFileUrl(file.storage_path)
      .then((signed) => active && setUrl(signed))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [file.storage_path]);

  return (
    <figure className="group relative overflow-hidden rounded-lg border border-border bg-muted">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" title="Op ware grootte bekijken">
          <img
            src={url}
            alt={file.file_name}
            loading="lazy"
            className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </a>
      ) : (
        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
          {failed ? "Kon niet laden" : "Laden…"}
        </div>
      )}

      <button
        type="button"
        onClick={onDelete}
        aria-label={`"${file.file_name}" verwijderen`}
        className="absolute right-1.5 top-1.5 rounded-md bg-background/90 p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <figcaption className="truncate px-2 py-1.5 text-[11px] text-muted-foreground">
        {file.width && file.height ? `${file.width}×${file.height} · ` : ""}
        {formatFileSize(file.file_size)}
      </figcaption>
    </figure>
  );
};

const TaskImages = ({ taskId, userId }: TaskImagesProps) => {
  const { data: files = [], isLoading } = useTaskFiles(taskId);
  const upload = useUploadTaskImage(taskId);
  const remove = useDeleteTaskImage(taskId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    setBusy(true);

    for (const file of Array.from(list)) {
      if (!isSupportedImage(file)) {
        toast.error(`"${file.name}" is geen afbeelding`);
        continue;
      }
      try {
        // Omzetten gebeurt hier, niet op de server: het scheelt een ronde en
        // wat er geüpload wordt is meteen het formaat dat we willen bewaren.
        const image = await toWebp(file);
        await upload.mutateAsync({ image, userId });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `"${file.name}" uploaden mislukt`);
      }
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (file: TaskFile) => {
    if (!window.confirm(`"${file.file_name}" verwijderen?`)) return;
    try {
      await remove.mutateAsync(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verwijderen mislukt");
    }
  };

  return (
    <div className="space-y-3">
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {files.map((file) => (
            <Thumb key={file.id} file={file} onDelete={() => void handleDelete(file)} />
          ))}
        </div>
      )}

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
          "rounded-lg border border-dashed px-4 py-5 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        {busy ? (
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Omzetten en uploaden…
          </p>
        ) : (
          <>
            <ImagePlus className="mx-auto h-5 w-5 text-muted-foreground" />
            <p className="mt-1.5 text-sm">Sleep foto's hierheen</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Worden omgezet naar WebP, op ware grootte en zonder zware compressie
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => inputRef.current?.click()}>
              Foto's kiezen
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {isLoading && <p className="text-xs text-muted-foreground">Foto's laden…</p>}
    </div>
  );
};

export default TaskImages;
