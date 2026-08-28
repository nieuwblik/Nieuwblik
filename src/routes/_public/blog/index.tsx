import { createFileRoute } from "@tanstack/react-router";

import Blog from "@/pages/Blog";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/blog/")({
  head: () =>
    buildHead({
      title: "Blog | SEO & Webdesign Tips - Nieuwblik Enkhuizen",
      description:
        "Lees onze blog over SEO, webdesign and online zichtbaarheid. Praktische tips van ons webdesign bureau in West-Friesland. Verbeter je website vandaag.",
      keywords:
        "webdesign blog, SEO tips Enkhuizen, conversie optimalisatie, online zichtbaarheid, webdesign West-Friesland, website tips",
      canonical: "https://www.nieuwblik.com/blog",
    }),
  component: Blog,
});
