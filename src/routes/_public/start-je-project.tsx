import { createFileRoute } from "@tanstack/react-router";

import Contact from "@/pages/Contact";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/start-je-project")({
  head: () =>
    buildHead({
      title: "Contact | Webdesign Bureau Enkhuizen - Nieuwblik",
      description:
        "Neem contact op met Nieuwblik in Enkhuizen. Website of webshop laten maken? Bel, WhatsApp of vul het formulier in. Reactie binnen 24 uur gegarandeerd.",
      keywords:
        "contact webdesign Enkhuizen, offerte website, website laten maken West-Friesland, webdesign bureau contact",
      // Zelfde canonical als /contact — precies zoals SEOHead dit al deed.
      canonical: "https://www.nieuwblik.com/contact",
    }),
  component: Contact,
});
