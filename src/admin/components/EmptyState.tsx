import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  /** De knop waarmee je de lege plek vult; een lege staat zonder uitweg is een doodlopend pad. */
  action?: ReactNode;
  /** Zonder kader en met minder lucht, voor binnen een kaart. */
  compact?: boolean;
}

const EmptyState = ({ icon: Icon, title, description, action, compact }: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 text-center",
      compact ? "px-4 py-6" : "rounded-[14px] border border-dashed border-border px-6 py-12",
    )}
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground">
      <Icon className="h-5 w-5" />
    </span>
    <div>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
