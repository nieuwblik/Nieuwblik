import { createFileRoute } from "@tanstack/react-router";

import LandingRouter from "@/pages/LandingRouter";
import { getCityBySlug } from "@/data/cities";
import { getIndustryBySlug } from "@/data/industries";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

const PREFIX = "website-laten-maken-";

export const Route = createFileRoute("/_public/$landingPath")({
  head: ({ params }) => {
    if (params.landingPath.startsWith(PREFIX)) {
      const slug = params.landingPath.slice(PREFIX.length);
      const city = getCityBySlug(slug);
      if (city) {
        return buildHead({
          title: city.title,
          description: city.metaDescription,
          canonical: `${companyInfo.url}/${PREFIX}${slug}`,
        });
      }
      const industry = getIndustryBySlug(slug);
      if (industry) {
        return buildHead({
          title: industry.title,
          description: industry.metaDescription,
          canonical: `${companyInfo.url}/${PREFIX}${slug}`,
        });
      }
    }
    return buildHead({
      title: "404 - Pagina niet gevonden | Nieuwblik",
      description: "Deze pagina bestaat niet (meer). Bekijk onze diensten of ga naar de homepage.",
      noIndex: true,
    });
  },
  component: LandingRouter,
});
