import { createFileRoute, notFound } from "@tanstack/react-router";

import NotFound from "@/pages/NotFound";
import { buildHead } from "@/lib/seo";

// Vangnet voor alle niet-bestaande paden — rendert de 404-pagina binnen de
// publieke schil (zoals het oude <Route path="*">), maar via notFound() zodat
// de server ook echt HTTP 404 teruggeeft in plaats van 200.
export const Route = createFileRoute("/_public/$")({
  loader: () => {
    throw notFound();
  },
  head: () =>
    buildHead({
      title: "Pagina Niet Gevonden | Nieuwblik Webdesign Enkhuizen",
      description:
        "Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage van Nieuwblik webdesign bureau in Enkhuizen.",
      keywords: "404, pagina niet gevonden, Nieuwblik Enkhuizen",
      noIndex: true,
    }),
  notFoundComponent: NotFound,
  errorComponent: NotFound,
  component: NotFound,
});
