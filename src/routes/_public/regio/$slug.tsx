import { createFileRoute, notFound } from "@tanstack/react-router";

import RegionalHub from "@/pages/RegionalHub";
import NotFound from "@/pages/NotFound";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/regio/$slug")({
  // Onbekende slug moet een echte HTTP 404 geven in plaats van 200.
  // De regiodata wordt hier pas opgehaald, zodat die niet in de hoofdbundel zit.
  loader: async ({ params }) => {
    const { HUBS } = await import("@/pages/RegionalHub");
    const hub = HUBS.find((h) => h.slug === params.slug);
    if (!hub) throw notFound();
    return {
      title: hub.title,
      description: hub.description,
      canonical: `${companyInfo.url}/regio/${hub.slug}`,
    };
  },
  head: ({ loaderData }) =>
    buildHead(
      loaderData ?? {
        title: "Regio niet gevonden | Nieuwblik",
        description: "Deze regiopagina bestaat niet (meer).",
        noIndex: true,
      },
    ),
  notFoundComponent: NotFound,
  component: RegionalHub,
});
