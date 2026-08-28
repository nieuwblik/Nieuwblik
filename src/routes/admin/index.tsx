import { createFileRoute } from "@tanstack/react-router";

import AdminBridge from "@/components/AdminBridge";

// Het portaal is client-only (ssr: false): geen server-rendering, geen
// wijziging aan de Supabase-auth. Alles onder /admin draait op de brug.
export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Portaal | Nieuwblik" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminBridge,
});
