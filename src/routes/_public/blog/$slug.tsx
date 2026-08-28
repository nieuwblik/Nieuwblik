import { createFileRoute } from "@tanstack/react-router";

import BlogPost from "@/pages/BlogPost";
import { blogPosts } from "@/data/blogPosts";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

export const Route = createFileRoute("/_public/blog/$slug")({
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
  component: BlogPost,
});
