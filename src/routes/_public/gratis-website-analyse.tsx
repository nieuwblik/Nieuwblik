import { SITE_URL } from "@/config/site";
import { createFileRoute } from "@tanstack/react-router";

import GratisWebsiteAnalyse from "@/pages/GratisWebsiteAnalyse";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/gratis-website-analyse")({
  head: () =>
    buildHead({
      title: "Gratis website-analyse binnen 1 werkdag | Nieuwblik",
      description:
        "Laat je website gratis nakijken. Binnen 1 werkdag krijg je een PDF met verbeterpunten voor vindbaarheid, mobiel, design en teksten. Vrijblijvend.",
      keywords: "gratis website analyse, website check, SEO scan, website laten checken",
      canonical: `${SITE_URL}/gratis-website-analyse`,
    }),
  component: GratisWebsiteAnalyse,
});
