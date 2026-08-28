import { createFileRoute } from "@tanstack/react-router";

import PortfolioDetail from "@/pages/PortfolioDetail";
import { projects } from "@/data/projects";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/portfolio/$slug")({
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
  component: PortfolioDetail,
});
