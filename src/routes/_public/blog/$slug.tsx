import { createFileRoute, notFound } from "@tanstack/react-router";

import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";
import { buildHead } from "@/lib/seo";
import { blogTitel } from "@/lib/blogTitel";
import { companyInfo } from "@/config/company";
import { laatstGewijzigd } from "@/lib/lastmod";

// Verwijderde artikelen 301'en via src/config/redirects.ts (server-side).
export const Route = createFileRoute("/_public/blog/$slug")({
  // Onbekende slug moet een echte HTTP 404 geven in plaats van 200.
  // De artikelen worden hier pas opgehaald, zodat ze niet in de hoofdbundel zitten.
  loader: async ({ params }) => {
    const { blogPosts } = await import("@/data/blogPosts");
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return {
      title: blogTitel(post),
      description: post.excerpt.nl,
      keywords: post.seoKeywords,
      canonical: `${companyInfo.url}/blog/${post.slug}`,
      // Zonder dit kreeg elk artikel bij delen het algemene og-image in plaats
      // van de eigen omslagfoto.
      ogImage: post.image
        ? post.image.startsWith("http")
          ? post.image
          : `${companyInfo.url}${post.image}`
        : undefined,
      ogImageWidth: post.imageWidth,
      ogImageHeight: post.imageHeight,
      ogType: "article" as const,
      articlePublishedTime: post.date,
      articleModifiedTime: laatstGewijzigd(`/blog/${post.slug}`, post.date),
      articleAuthor: "Justin Slok",
    };
  },
  head: ({ loaderData }) =>
    buildHead(
      loaderData ?? {
        title: "Artikel niet gevonden | Nieuwblik",
        description: "Dit artikel bestaat niet (meer).",
        noIndex: true,
      },
    ),
  notFoundComponent: NotFound,
  component: BlogPost,
});
