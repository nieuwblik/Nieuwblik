import { createFileRoute } from "@tanstack/react-router";

import About from "@/pages/About";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/over-ons")({
  head: () =>
    buildHead({
      title: "Over Ons | Webdesign Bureau Enkhuizen - Nieuwblik",
      description:
        "Maak kennis met Nieuwblik, jouw webdesign bureau uit Enkhuizen. Passie voor websites, webshops en SEO in West-Friesland. Persoonlijke aanpak, meetbaar resultaat.",
      keywords:
        "over ons, webdesign bureau Enkhuizen, digitale agency West-Friesland, nieuwblik team, website laten maken Enkhuizen",
      canonical: "https://www.nieuwblik.com/over-ons",
    }),
  component: About,
});
