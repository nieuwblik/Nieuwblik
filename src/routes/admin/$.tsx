import { createFileRoute } from "@tanstack/react-router";

import AdminBridge from "@/components/AdminBridge";

// Alle diepere portaalpaden (inclusief /admin/login) — client-only.
export const Route = createFileRoute("/admin/$")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Portaal | Nieuwblik" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminBridge,
});
