import { createFileRoute } from "@tanstack/react-router";

import Reviews from "@/pages/Reviews";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/reviews")({
  head: () =>
    buildHead({
      title: "Reviews | Klantervaringen Webdesign Bureau - Nieuwblik Enkhuizen",
      description:
        "Lees ervaringen van onze klanten over websites en webshops. Webdesign bureau Enkhuizen met tevreden klanten in heel West-Friesland. Bekijk onze reviews.",
      keywords:
        "reviews webdesign, klantervaringen website, webdesign bureau Enkhuizen, tevreden klanten West-Friesland",
      canonical: "https://www.nieuwblik.com/reviews",
    }),
  component: Reviews,
});
