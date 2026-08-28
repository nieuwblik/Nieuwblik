import { createFileRoute } from "@tanstack/react-router";

import Portfolio from "@/pages/Portfolio";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/portfolio/")({
  head: () =>
    buildHead({
      title: "Portfolio | Website & Webshop Projecten Enkhuizen - Nieuwblik",
      description:
        "Bekijk onze portfolio: websites en webshops uit West-Friesland. Van MKB tot e-commerce, ontdek wat ons webdesign bureau in Enkhuizen voor jou kan betekenen.",
      keywords:
        "webdesign portfolio Enkhuizen, website voorbeelden West-Friesland, webshop projecten, e-commerce cases, website laten maken",
      canonical: "https://www.nieuwblik.com/portfolio",
    }),
  component: Portfolio,
});
