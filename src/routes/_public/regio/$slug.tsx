import { createFileRoute, notFound } from "@tanstack/react-router";

import RegionalHub, { HUBS } from "@/pages/RegionalHub";
import NotFound from "@/pages/NotFound";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/regio/$slug")({
  // Onbekende slug moet een echte HTTP 404 geven in plaats van 200.
  loader: ({ params }) => {
    if (!HUBS.find((h) => h.slug === params.slug)) {
      throw notFound();
    }
    return null;
  },
  head: ({ params }) => {
    const hub = HUBS.find((h) => h.slug === params.slug);
    if (!hub) {
      return buildHead({
        title: "Regio niet gevonden | Nieuwblik",
        description: "Deze regiopagina bestaat niet (meer).",
        noIndex: true,
      });
    }
    return buildHead({
      title: hub.title,
      description: hub.description,
      canonical: `${companyInfo.url}/regio/${hub.slug}`,
    });
  },
  notFoundComponent: NotFound,
  component: RegionalHub,
});
