import { SITE_URL } from "@/config/site";
import { createFileRoute, notFound } from "@tanstack/react-router";

import PortfolioDetail from "@/pages/PortfolioDetail";
import NotFound from "@/pages/NotFound";
import { projects } from "@/data/projects";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/portfolio/$slug")({
  // Onbekende slug moet een echte HTTP 404 geven in plaats van 200.
  loader: ({ params }) => {
    if (!projects.find((p) => p.slug === params.slug)) {
      throw notFound();
    }
    return null;
  },
  head: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) {
      return buildHead({
        title: "Project niet gevonden | Nieuwblik",
        description: "Dit portfolioproject bestaat niet (meer).",
        noIndex: true,
      });
    }
    return buildHead({
      title: `${project.title} | Portfolio - Nieuwblik`,
      // Alleen de eerste alinea: is die korter dan 155 tekens, dan kwam er
      // anders een witregel plus het begin van de volgende alinea mee.
      description: project.detail?.details
        ? (project.detail.details.split("\n\n")[0] ?? "").substring(0, 155).trim()
        : project.description,
      keywords: project.tags.join(", "),
      canonical: `${SITE_URL}/portfolio/${project.slug}`,
    });
  },
  notFoundComponent: NotFound,
  component: PortfolioDetail,
});
