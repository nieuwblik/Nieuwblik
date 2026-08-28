import { createFileRoute, notFound } from "@tanstack/react-router";

import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";
import { blogPosts } from "@/data/blogPosts";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/blog/$slug")({
  // Onbekende slug moet een echte HTTP 404 geven in plaats van 200.
  loader: ({ params }) => {
    if (!blogPosts.find((p) => p.slug === params.slug)) {
      throw notFound();
    }
    return null;
  },
  head: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) {
      return buildHead({
        title: "Artikel niet gevonden | Nieuwblik",
        description: "Dit artikel bestaat niet (meer).",
        noIndex: true,
      });
    }
    const kop =
      post.seoTitle ??
      (post.title.nl.length > 45 ? `${post.title.nl.substring(0, 45).trim()}…` : post.title.nl);
    return buildHead({
      title: `${kop} | Nieuwblik`,
      description: post.excerpt.nl,
      keywords: post.seoKeywords,
      canonical: `${companyInfo.url}/blog/${post.slug}`,
      ogType: "article",
    });
  },
  notFoundComponent: NotFound,
  component: BlogPost,
});
