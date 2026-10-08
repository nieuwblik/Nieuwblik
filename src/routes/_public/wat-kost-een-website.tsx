import { PRIJZEN } from "@/config/business";
import { createFileRoute } from "@tanstack/react-router";

import WatKostEenWebsite from "@/pages/WatKostEenWebsite";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/wat-kost-een-website")({
  head: () =>
    buildHead({
      title: `Wat kost een website in 2026? Vanaf ${PRIJZEN.starter} euro | Nieuwblik`,
      description: `Wat kost een website laten maken in 2026? Complete kosten gids met vaste prijzen vanaf ${PRIJZEN.starter} euro, verborgen kosten en uitleg over uurtarief versus vaste prijs.`,
      keywords:
        "wat kost een website, website kosten 2026, prijs website laten maken, kosten webshop laten maken, website prijzen nederland",
      canonical: `${companyInfo.url}/wat-kost-een-website`,
    }),
  component: WatKostEenWebsite,
});
