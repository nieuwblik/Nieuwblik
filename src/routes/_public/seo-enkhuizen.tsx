import { createFileRoute } from "@tanstack/react-router";

import SeoEnkhuizen from "@/pages/SeoEnkhuizen";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/seo-enkhuizen")({
  head: () =>
    buildHead({
      title: "SEO Enkhuizen | Lokale SEO specialist - Nieuwblik",
      description:
        "SEO Enkhuizen door lokale specialist. Meer klanten uit Enkhuizen en West-Friesland via Google. Lokale aanpak vanaf 750 euro, opzegbaar per maand.",
      keywords:
        "seo enkhuizen, lokale seo enkhuizen, seo specialist enkhuizen, google enkhuizen, vindbaarheid enkhuizen",
      canonical: `${companyInfo.url}/seo-enkhuizen`,
    }),
  component: SeoEnkhuizen,
});
