import { SITE_URL } from "@/config/site";
import { createFileRoute } from "@tanstack/react-router";

import Prijzen from "@/pages/Prijzen";
import { PRIJZEN_OMSCHRIJVING, PRIJZEN_TITEL } from "@/data/prijzenMeta";
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
