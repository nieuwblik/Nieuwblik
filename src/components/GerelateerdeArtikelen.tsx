import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import { blogPosts, type BlogPost } from "@/data/blogPosts";
import Reveal from "@/components/Reveal";

/*
 * Drie verwante artikelen onder een blogpost. Zonder dit blok waren de meeste
 * artikelen alleen via /blog bereikbaar: weinig interne links, dus minder
 * gewicht in Google. Keuze op overlap in zoekwoorden en titel; bij gelijke
 * score het artikel met de dichtstbijzijnde datum.
 */

const INK = "hsl(var(--sw-ink))";
const INK45 = "hsl(var(--sw-ink) / 0.45)";
const RULE = "hsl(var(--sw-rule) / 0.14)";

const STOPWOORDEN = new Set([
  "de",
  "het",
  "een",
  "en",
  "van",
  "voor",
  "met",
  "je",
  "jouw",
  "in",
  "op",
  "te",
  "is",
  "wat",
  "hoe",
  "naar",
  "bij",
  "die",
  "dat",
  "nieuwblik",
  "website",
  "websites",
]);

const woorden = (p: BlogPost) =>
  new Set(
    `${p.seoKeywords ?? ""} ${p.title.nl}`
      .toLowerCase()
      .split(/[^a-z0-9à-ÿ]+/)
      .filter((w) => w.length > 2 && !STOPWOORDEN.has(w)),
  );

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function kiesGerelateerd(slug: string, aantal = 3): BlogPost[] {
  const huidig = blogPosts.find((p) => p.slug === slug);
  if (!huidig) return [];
  const eigen = woorden(huidig);
  const tijd = new Date(huidig.date).getTime();
  return blogPosts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let overlap = 0;
      woorden(p).forEach((w) => eigen.has(w) && overlap++);
      return {
        p,
        overlap,
        afstand: Math.abs(new Date(p.date).getTime() - tijd),
      };
    })
    .sort((a, b) => b.overlap - a.overlap || a.afstand - b.afstand)
    .slice(0, aantal)
    .map((x) => x.p);
}

export default function GerelateerdeArtikelen({ slug }: { slug: string }) {
  const posts = kiesGerelateerd(slug);
  if (!posts.length) return null;
  return (
    <section className="pb-20 md:pb-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal afstand={20}>
            <h2
              className="mb-6 text-3xl font-bold tracking-tight sw-ink md:mb-8 md:text-4xl"
              style={{ lineHeight: 1.05 }}
            >
              Meer artikelen
            </h2>
          </Reveal>
          <div className="border-t" style={{ borderColor: RULE }}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="sw-row group grid grid-cols-[1fr_auto] items-center gap-4 border-b py-6 transition-colors md:grid-cols-[1fr_14rem_auto] md:gap-8 md:py-7"
                style={{ borderColor: RULE }}
              >
                <h3
                  className="text-lg font-semibold tracking-tight md:text-xl lg:text-2xl"
                  style={{ color: INK, lineHeight: 1.15 }}
                >
                  {post.title.nl}
                </h3>
                <span
                  className="sw-mono hidden md:block"
                  style={{ color: INK45 }}
                >
                  {fmtDate(post.date)} · {post.readingTime} min
                </span>
                <ArrowRight
                  className="h-5 w-5 justify-self-end transition-transform group-hover:translate-x-1"
                  style={{ color: INK45 }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
