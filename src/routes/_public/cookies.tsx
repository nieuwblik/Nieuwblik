import { createFileRoute } from "@tanstack/react-router";

import Cookies from "@/pages/Cookies";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/cookies")({
  head: () =>
    buildHead({
      title: "Cookieverklaring | Nieuwblik Webdesign Enkhuizen",
      description:
        "Informatie over het cookiegebruik op de website van Nieuwblik. Welke cookies we gebruiken en waarvoor. Webdesign bureau Enkhuizen.",
      keywords: "cookieverklaring, cookies, privacy, Nieuwblik Enkhuizen, website cookies",
      canonical: `${companyInfo.url}/cookies`,
    }),
  component: Cookies,
});
