import { createFileRoute } from "@tanstack/react-router";

import NotFound from "@/pages/NotFound";
import { buildHead } from "@/lib/seo";

// Vangnet voor alle niet-bestaande paden met meerdere segmenten — rendert de
// 404-pagina binnen de publieke schil, zoals het oude <Route path="*">.
export const Route = createFileRoute("/_public/$")({
  head: () =>
    buildHead({
      title: "Pagina Niet Gevonden | Nieuwblik Webdesign Enkhuizen",
      description:
        "Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage van Nieuwblik webdesign bureau in Enkhuizen.",
      keywords: "404, pagina niet gevonden, Nieuwblik Enkhuizen",
      noIndex: true,
    }),
  component: NotFound,
});
