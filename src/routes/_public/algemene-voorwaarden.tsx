import { createFileRoute } from "@tanstack/react-router";

import Terms from "@/pages/Terms";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/algemene-voorwaarden")({
  head: () =>
    buildHead({
      title: "Algemene Voorwaarden | Nieuwblik Webdesign Enkhuizen",
      description:
        "Lees de algemene voorwaarden van Nieuwblik webdesign bureau in Enkhuizen. Duidelijke afspraken voor website en webshop projecten.",
      keywords: "algemene voorwaarden, webdesign voorwaarden, Nieuwblik Enkhuizen, website afspraken",
      canonical: `${companyInfo.url}/algemene-voorwaarden`,
    }),
  component: Terms,
});
