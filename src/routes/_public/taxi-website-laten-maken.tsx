import { createFileRoute } from "@tanstack/react-router";

import TaxiWebsite from "@/pages/TaxiWebsite";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/taxi-website-laten-maken")({
  head: () =>
    buildHead({
      title: "Taxi website laten maken | Case Drechterland - Nieuwblik",
      description:
        "Taxi website laten maken die ritten oplevert. Bekijk de case van Taxi Drechterland: razendsnel, WhatsApp-boekingen, luchthaven-SEO en lokaal sterk.",
      canonical: `${companyInfo.url}/taxi-website-laten-maken`,
      ogType: "article",
    }),
  component: TaxiWebsite,
});
