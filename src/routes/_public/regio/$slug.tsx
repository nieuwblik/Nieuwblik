import { createFileRoute } from "@tanstack/react-router";

import RegionalHub, { HUBS } from "@/pages/RegionalHub";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/regio/$slug")({
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
  component: RegionalHub,
});
