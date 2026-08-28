import { createFileRoute } from "@tanstack/react-router";

import WebsiteLatenMaken from "@/pages/WebsiteLatenMaken";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/website-laten-maken")({
  head: () =>
    buildHead({
      title: "Website laten maken vanaf 990 euro | Nieuwblik",
      description:
        "Website laten maken door een lokaal Nederlands bureau. Snel, betaalbaar, sterk in SEO. Vanaf 990 euro. Bekijk kosten, proces en voorbeelden.",
      keywords:
        "website laten maken, website bouwen, webdesign, website op maat, professionele website",
      canonical: `${companyInfo.url}/website-laten-maken`,
    }),
  component: WebsiteLatenMaken,
});
