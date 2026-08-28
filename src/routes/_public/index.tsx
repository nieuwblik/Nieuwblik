import { createFileRoute } from "@tanstack/react-router";

import Index from "@/pages/Index";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/")({
  head: () =>
    buildHead({
      title: "Webdesign Bureau Enkhuizen | Websites & Webshops - Nieuwblik",
      description: companyInfo.description,
      canonical: `${companyInfo.url}/`,
      // De social-afbeelding die deelplatforms al kenden uit de oude index.html.
      ogImage:
        "https://storage.googleapis.com/gpt-engineer-file-uploads/3EEbbwIN3rTrzVglyQtstmL7FqT2/social-images/social-1769766174004-meta%20image%20nieuwblik.jpg",
    }),
  component: Index,
});
