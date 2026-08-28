import { createFileRoute } from "@tanstack/react-router";

import Services from "@/pages/Services";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/diensten/")({
  head: () =>
    buildHead({
      title: "Diensten | Webdesign, Webshops & SEO Enkhuizen - Nieuwblik",
      description:
        "Ontdek onze diensten: website op maat, webshops, branding en SEO. Webdesign bureau Enkhuizen voor MKB in West-Friesland. Vraag een offerte aan.",
      keywords:
        "webdesign Enkhuizen, webshop laten maken, SEO West-Friesland, branding, e-commerce, website ontwikkeling, online zichtbaarheid",
      canonical: "https://www.nieuwblik.com/diensten",
    }),
  component: Services,
});
