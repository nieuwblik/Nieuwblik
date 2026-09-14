import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";
import { blogPosts } from "@/data/blogPosts";
import { buildHead } from "@/lib/seo";
import { companyInfo } from "@/config/company";

/**
 * Verwijderde artikelen die al in Google stonden. Een 301 naar de pagina die
 * er inhoudelijk het dichtst bij ligt geeft de opgebouwde waarde door, waar
 * een 404 die weggooit.
 */
const VERWIJDERD: Record<string, string> = {
  "wordpress-vs-maatwerk-website": "/diensten/website-op-maat",
  "wat-kost-website-laten-maken-2026": "/website-laten-maken",
};

export const Route = createFileRoute("/_public/blog/$slug")({
  // Onbekende slug moet een echte HTTP 404 geven in plaats van 200.
  loader: ({ params }) => {
    const doel = VERWIJDERD[params.slug];
    if (doel) {
      throw redirect({ href: doel, statusCode: 301 });
    }
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
      // Zonder dit kreeg elk artikel bij delen het algemene og-image in plaats
      // van de eigen omslagfoto.
      ogImage: post.image
        ? post.image.startsWith("http")
          ? post.image
          : `${companyInfo.url}${post.image}`
        : undefined,
      ogImageWidth: post.imageWidth,
      ogImageHeight: post.imageHeight,
      ogType: "article",
      articlePublishedTime: post.date,
      articleAuthor: "Justin Slok",
    });
  },
  notFoundComponent: NotFound,
  component: BlogPost,
});
