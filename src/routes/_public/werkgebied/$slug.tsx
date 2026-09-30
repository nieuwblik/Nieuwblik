import { createFileRoute, notFound } from "@tanstack/react-router";

import WerkgebiedDetail from "@/pages/WerkgebiedDetail";
import NotFound from "@/pages/NotFound";
import { getWerkgebiedRegionBySlug } from "@/data/regions";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";
import { LEVERTIJD, PRIJZEN } from "@/config/business";

export const Route = createFileRoute("/_public/werkgebied/$slug")({
  // Onbekende slug moet een echte HTTP 404 geven in plaats van 200.
  loader: ({ params }) => {
    if (!getWerkgebiedRegionBySlug(params.slug)) {
      throw notFound();
    }
    return null;
  },
  head: ({ params }) => {
    const region = getWerkgebiedRegionBySlug(params.slug);
    if (!region) {
      return buildHead({
        title: "Regio niet gevonden | Nieuwblik",
        description: "Deze regio bestaat niet (meer).",
        noIndex: true,
      });
    }
    return buildHead({
      title: `Website laten maken ${region.name} vanaf €${PRIJZEN.starter} | Nieuwblik`,
      description:
        region.slug === "hoorn"
          ? `Website laten maken in Hoorn? Vanaf €${PRIJZEN.starter}, binnen ${LEVERTIJD.standaard} live en persoonlijk contact vanuit Enkhuizen. Vraag vrijblijvend een offerte aan.`
          : `Website laten maken in ${region.name} vanaf €${PRIJZEN.starter}. Persoonlijk, vindbaar en binnen ${LEVERTIJD.standaard} live. Vraag vrijblijvend een offerte aan.`,
      keywords: region.keywords?.join(", "),
      canonical: `${companyInfo.url}/werkgebied/${region.slug}`,
    });
  },
  notFoundComponent: NotFound,
  component: WerkgebiedDetail,
});
