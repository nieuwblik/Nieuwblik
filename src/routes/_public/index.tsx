import { createFileRoute } from "@tanstack/react-router";

import Index from "@/pages/Index";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/")({
  head: () =>
    buildHead({
      title: "Webdesign Bureau Enkhuizen | Websites & Webshops - Nieuwblik",
      description: companyInfo.description,
      // Met slash: dat is de URL die de homepage echt serveert en die in de sitemap staat.
      canonical: `${companyInfo.url}/`,
      // De social-afbeelding die deelplatforms al kenden uit de oude index.html.
      ogImage:
        "https://storage.googleapis.com/gpt-engineer-file-uploads/3EEbbwIN3rTrzVglyQtstmL7FqT2/social-images/social-1769766174004-meta%20image%20nieuwblik.jpg",
      // Gemeten; stond eerder op het standaard 1200×630, wat voor dit beeld niet klopte.
      ogImageWidth: 1024,
      ogImageHeight: 630,
    }),
  component: Index,
});
