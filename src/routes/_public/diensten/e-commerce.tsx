import { createFileRoute } from "@tanstack/react-router";

import Ecommerce from "@/pages/services/Ecommerce";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/diensten/e-commerce")({
  head: () =>
    buildHead({
      title: "E-commerce & Product Listings | Verkoop meer online - Nieuwblik",
      description:
        "Professionele Amazon & Bol.com listings, verpakkingsdesign en e-books. Verhoog je online zichtbaarheid en conversie. E-commerce specialist West-Friesland.",
      keywords:
        "e-commerce Enkhuizen, Amazon listings, Bol.com verkopen, product fotografie, verpakkingsdesign, conversie optimalisatie West-Friesland",
      canonical: "https://www.nieuwblik.com/diensten/e-commerce",
    }),
  component: Ecommerce,
});
