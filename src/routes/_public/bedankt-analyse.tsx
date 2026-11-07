import { createFileRoute } from "@tanstack/react-router";

import BedanktAnalyse from "@/pages/BedanktAnalyse";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/bedankt-analyse")({
  head: () =>
    buildHead({
      title: "Bedankt voor je aanvraag | Nieuwblik",
      description: "We hebben je aanvraag voor de gratis website-analyse ontvangen.",
      noIndex: true,
    }),
  component: BedanktAnalyse,
});
