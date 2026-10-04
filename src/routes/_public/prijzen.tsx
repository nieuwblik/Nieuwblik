import { SITE_URL } from "@/config/site";
import { createFileRoute } from "@tanstack/react-router";

import Prijzen, { PRIJZEN_OMSCHRIJVING, PRIJZEN_TITEL } from "@/pages/Prijzen";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/prijzen")({
  head: () =>
    buildHead({
      title: PRIJZEN_TITEL,
      description: PRIJZEN_OMSCHRIJVING,
      keywords:
        "website laten maken prijs, wat kost een website, website prijzen, webdesign tarieven, Nieuwblik pakketten",
      canonical: `${SITE_URL}/prijzen`,
    }),
  component: Prijzen,
});
