import { LEVERTIJD, PRIJZEN, euroTeken } from "@/config/business";
import { SITE_URL } from "@/config/site";
import { createFileRoute } from "@tanstack/react-router";

import WebsiteOpMaat from "@/pages/services/WebsiteOpMaat";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/diensten/website-op-maat")({
  head: () =>
    buildHead({
      title: "Website op maat laten maken | Snel en vindbaar - Nieuwblik",
      description:
        `Een website op maat, ontworpen en gebouwd door Justin en Job. Snel, vindbaar in Google en binnen ${LEVERTIJD.standaard} live. Vanaf ${euroTeken(PRIJZEN.starter)}.`,
      keywords:
        "website op maat, website op maat laten maken, maatwerk website, SEO website, snelle website",
      canonical: `${SITE_URL}/diensten/website-op-maat`,
    }),
  component: WebsiteOpMaat,
});
