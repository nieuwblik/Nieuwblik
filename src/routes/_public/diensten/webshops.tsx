import { PRIJZEN, euroTeken } from "@/config/business";
import { SITE_URL } from "@/config/site";
import { createFileRoute } from "@tanstack/react-router";

import Webshops from "@/pages/services/Webshops";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/diensten/webshops")({
  head: () =>
    buildHead({
      title: "Webshop Laten Maken Enkhuizen | E-commerce West-Friesland",
      description:
        `Webshop laten maken in Enkhuizen? Professionele webshops met iDEAL, Klarna en voorraadbeheer. Webshop bureau West-Friesland. Vanaf ${euroTeken(PRIJZEN.webshopVanaf)}.`,
      keywords:
        "webshop laten maken Enkhuizen, e-commerce West-Friesland, online winkel, webshop bouwen, WooCommerce, Shopify, webshop Enkhuizen",
      canonical: `${SITE_URL}/diensten/webshops`,
    }),
  component: Webshops,
});
