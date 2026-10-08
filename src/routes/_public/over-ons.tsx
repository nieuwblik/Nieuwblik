import { SITE_URL } from "@/config/site";
import { createFileRoute } from "@tanstack/react-router";

import About from "@/pages/About";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/over-ons")({
  head: () =>
    buildHead({
      title: "Over Nieuwblik | Webdesign uit Enkhuizen",
      description:
        "Maak kennis met Nieuwblik, jouw webdesign bureau uit Enkhuizen. Passie voor websites, webshops en SEO in West-Friesland. Persoonlijke aanpak, meetbaar resultaat.",
      keywords:
        "over ons, webdesign bureau Enkhuizen, digitale agency West-Friesland, nieuwblik team, website laten maken Enkhuizen",
      canonical: `${SITE_URL}/over-ons`,
    }),
  component: About,
});
