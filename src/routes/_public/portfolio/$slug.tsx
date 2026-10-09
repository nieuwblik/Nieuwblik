import { SITE_URL } from "@/config/site";
import { createFileRoute, notFound } from "@tanstack/react-router";

import PortfolioDetail from "@/pages/PortfolioDetail";
import NotFound from "@/pages/NotFound";
import { projects } from "@/data/projects";
import { buildHead } from "@/lib/seo";
import { caseAfbeelding, caseBeschrijving } from "@/lib/caseMeta";

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
      // Hele zinnen uit de eerste alinea (max. 160 tekens), nooit midden in een woord afgebroken.
      description: caseBeschrijving(project),
      ogImage: caseAfbeelding(project),
      keywords: project.tags.join(", "),
      canonical: `${SITE_URL}/portfolio/${project.slug}`,
    });
  },
  notFoundComponent: NotFound,
  component: PortfolioDetail,
});
