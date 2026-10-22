import { createFileRoute } from "@tanstack/react-router";

import Afmelden from "@/pages/Afmelden";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/afmelden")({
  head: () =>
    buildHead({
      title: "Afmelden | Nieuwblik",
      description: "Afmelden voor mails van Nieuwblik.",
      noIndex: true,
    }),
  component: Afmelden,
});
