import { createFileRoute } from "@tanstack/react-router";
import Projectbriefing from "@/pages/Projectbriefing";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/projectbriefing")({
  head: () =>
    buildHead({
      title: "Gratis projectbriefing voor je website | Nieuwblik",
      description: "Beschrijf je project en doelen en krijg direct een heldere briefing met passende diensten, prijsindicatie en planning. Gratis en vrijblijvend.",
      keywords: "projectbriefing website, website briefing maken, website laten maken offerte",
      canonical: `${companyInfo.url}/projectbriefing`,
    }),
  component: Projectbriefing,
});
