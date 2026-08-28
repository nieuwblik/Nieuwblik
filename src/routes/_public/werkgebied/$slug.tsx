import { createFileRoute } from "@tanstack/react-router";

import WerkgebiedDetail from "@/pages/WerkgebiedDetail";
import { getRegionBySlug } from "@/data/regions";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/werkgebied/$slug")({
  head: ({ params }) => {
    const region = getRegionBySlug(params.slug);
    if (!region) {
      return buildHead({
        title: "Regio niet gevonden | Nieuwblik",
        description: "Deze regio bestaat niet (meer).",
        noIndex: true,
      });
    }
    const isLocal = region.type === "local";
    return buildHead({
      title: `Webdesign ${region.name} | Website Laten Maken ${region.name} - Nieuwblik`,
      description: `Professioneel webdesign bureau voor ${region.name}. Website, webshop of SEO nodig? ${
        isLocal ? "Lokaal gevestigd in de regio" : "Ook landelijk actief"
      }. Neem contact op!`,
      keywords: region.keywords?.join(", "),
      canonical: `${companyInfo.url}/werkgebied/${region.slug}`,
    });
  },
  component: WerkgebiedDetail,
});
