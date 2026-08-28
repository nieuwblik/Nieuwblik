import { createFileRoute } from "@tanstack/react-router";

import WebdesignBureau from "@/pages/WebdesignBureau";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/webdesign-bureau")({
  head: () =>
    buildHead({
      title: "Webdesign bureau in Nederland | Nieuwblik",
      description:
        "Webdesign bureau uit Enkhuizen. Snel, persoonlijk en sterk in SEO. Wij bouwen websites voor MKB in heel Nederland. Vanaf 990 euro.",
      keywords: "webdesign bureau, webdesign, website bureau, webdesign nederland, mkb website",
      canonical: `${companyInfo.url}/webdesign-bureau`,
    }),
  component: WebdesignBureau,
});
