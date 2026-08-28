import { createFileRoute } from "@tanstack/react-router";

import Privacy from "@/pages/Privacy";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/privacy")({
  head: () =>
    buildHead({
      title: "Privacyverklaring | Nieuwblik Webdesign Enkhuizen",
      description:
        "Lees onze privacyverklaring. Hoe Nieuwblik uit Enkhuizen omgaat met persoonsgegevens conform de AVG. Uw privacy is belangrijk voor ons.",
      keywords: "privacyverklaring, AVG, persoonsgegevens, privacy Nieuwblik, webdesign Enkhuizen",
      canonical: `${companyInfo.url}/privacy`,
    }),
  component: Privacy,
});
