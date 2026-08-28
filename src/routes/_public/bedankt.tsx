import { createFileRoute } from "@tanstack/react-router";

import ThankYou from "@/pages/ThankYou";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/bedankt")({
  head: () =>
    buildHead({
      title: "Bedankt voor je Aanvraag | Nieuwblik Enkhuizen",
      description:
        "Bedankt voor je projectaanvraag! We nemen binnen 48 uur contact met je op. Nieuwblik webdesign bureau Enkhuizen.",
      keywords: "bedankt, aanvraag verstuurd, Nieuwblik Enkhuizen, website project",
      noIndex: true,
    }),
  component: ThankYou,
});
