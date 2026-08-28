import { createFileRoute } from "@tanstack/react-router";

import NotFound from "@/pages/NotFound";
import { buildHead } from "@/lib/seo";

// Vangnet voor alle niet-bestaande paden met meerdere segmenten — rendert de
// 404-pagina binnen de publieke schil, zoals het oude <Route path="*">.
export const Route = createFileRoute("/_public/$")({
  head: () =>
    buildHead({
      title: "404 - Pagina niet gevonden | Nieuwblik",
      description: "Deze pagina bestaat niet (meer). Bekijk onze diensten of ga naar de homepage.",
      noIndex: true,
    }),
  component: NotFound,
});
