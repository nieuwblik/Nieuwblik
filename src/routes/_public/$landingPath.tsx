import { createFileRoute, notFound } from "@tanstack/react-router";

import LandingRouter from "@/pages/LandingRouter";
import NotFound from "@/pages/NotFound";
import { getCityBySlug } from "@/data/cities";
import { getIndustryBySlug } from "@/data/industries";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

const PREFIX = "website-laten-maken-";

function isKnownLanding(landingPath: string): boolean {
  if (!landingPath.startsWith(PREFIX)) return false;
  const slug = landingPath.slice(PREFIX.length);
  return Boolean(getCityBySlug(slug) ?? getIndustryBySlug(slug));
}

export const Route = createFileRoute("/_public/$landingPath")({
  // Onbekende paden van één segment moeten een echte HTTP 404 geven, niet 200.
  loader: ({ params }) => {
    if (!isKnownLanding(params.landingPath)) {
      throw notFound();
    }
    return null;
  },
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
      title: "Pagina Niet Gevonden | Nieuwblik Webdesign Enkhuizen",
      description:
        "Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage van Nieuwblik webdesign bureau in Enkhuizen.",
      keywords: "404, pagina niet gevonden, Nieuwblik Enkhuizen",
      noIndex: true,
    });
  },
  notFoundComponent: NotFound,
  component: LandingRouter,
});
