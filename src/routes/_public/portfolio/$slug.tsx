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
      description: project.detail?.details
        ? project.detail.details.substring(0, 155)
        : project.description,
      keywords: project.tags.join(", "),
      canonical: `https://www.nieuwblik.com/portfolio/${project.slug}`,
    });
  },
  notFoundComponent: NotFound,
  component: PortfolioDetail,
});
