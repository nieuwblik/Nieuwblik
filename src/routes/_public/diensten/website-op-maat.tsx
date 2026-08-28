import { createFileRoute } from "@tanstack/react-router";

import WebsiteOpMaat from "@/pages/services/WebsiteOpMaat";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/diensten/website-op-maat")({
  head: () =>
    buildHead({
      title: "Website op Maat Enkhuizen | Webdesign West-Friesland - Nieuwblik",
      description:
        "Website laten maken in Enkhuizen? Wij bouwen snelle, SEO-geoptimaliseerde websites op maat. Webdesign bureau West-Friesland. Binnen 1 week live!",
      keywords:
        "website op maat Enkhuizen, webdesign West-Friesland, website laten maken, SEO website, snelle website, webdesign bureau Enkhuizen",
      canonical: "https://www.nieuwblik.com/diensten/website-op-maat",
    }),
  component: WebsiteOpMaat,
});
