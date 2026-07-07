import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { easings } from "@/lib/motion";
import { useReveal } from "@/lib/reveal";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });

const FeaturedBlogPosts = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  useReveal(sectionRef);

  const featuredPost = blogPosts[0];
  const secondaryPosts = blogPosts.slice(1, 4);

  const INK = "hsl(var(--sw-ink))";
  const INK45 = "hsl(var(--sw-ink) / 0.45)";
  const INK65 = "hsl(var(--sw-ink) / 0.65)";
  const GREEN = "hsl(var(--sw-green))";
  const RULE = "hsl(var(--sw-rule) / 0.16)";

  return (
    <section ref={sectionRef} className="py-20 md:py-32" style={{ background: "hsl(0 0% 100%)" }}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Swiss header */}
        <div className="mb-14 md:mb-16">
          <div className="h-px w-full mb-5" style={{ background: RULE }} />
          <div className="mb-6">
            <span className="sw-reveal sw-mono inline-block" style={{ color: GREEN }}>Insights</span>
          </div>
          <h2 className="sw-reveal text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl" style={{ color: INK, lineHeight: 1.02 }}>
            Ontdek onze nieuwste artikelen
          </h2>
          <p className="sw-reveal mt-6 text-lg md:text-xl font-light leading-relaxed max-w-2xl" style={{ color: INK65 }}>
            Waardevolle tips, strategieën en inzichten om jouw digitale aanwezigheid naar een hoger niveau te tillen.
          </p>
        </div>

        {/* Featured article — asymmetric editorial spread */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.15, ease: easings.easeOutExpo }}
        >
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="sw-feat group grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch border-t border-b py-10 md:py-12"
            style={{ borderColor: RULE }}
          >
            {/* Text */}
            <div className="lg:col-span-7 flex flex-col">
              <span className="sw-mono" style={{ color: GREEN }}>Uitgelicht</span>
              <h3
                className="mt-6 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight transition-colors"
                style={{ color: INK, lineHeight: 1.05 }}
              >
                {featuredPost.title.nl}
              </h3>
              <p className="mt-5 text-base md:text-lg font-light leading-relaxed max-w-xl" style={{ color: INK65 }}>
                {featuredPost.excerpt.nl}
              </p>
              <div className="mt-auto pt-8 flex items-center justify-between gap-4">
                <span className="sw-mono" style={{ color: INK45 }}>
                  {fmtDate(featuredPost.date)} · {featuredPost.readingTime} min
                </span>
                <span
                  className="sw-mono inline-flex items-center gap-2 border-b-2 pb-1 transition-transform group-hover:translate-x-1"
                  style={{ color: INK, borderColor: GREEN }}
                >
                  Lees artikel <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Figure */}
            {featuredPost.image && (
              <figure className="lg:col-span-5 m-0">
                <div className="overflow-hidden rounded-2xl" style={{ background: "hsl(var(--sw-paper))" }}>
                  <motion.img
                    src={featuredPost.image}
                    alt={featuredPost.title.nl}
                    loading="lazy"
                    className="w-full h-full object-contain aspect-[5/4] p-8"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                    transition={{ duration: 0.5, ease: easings.easeOutExpo }}
                  />
                </div>
              </figure>
            )}
          </Link>
        </motion.div>

        {/* Secondary articles — ruled editorial index */}
        <div className="mt-0">
          {secondaryPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.08, ease: easings.easeOutExpo }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="sw-row group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_14rem_auto] gap-4 md:gap-8 items-center py-6 md:py-7 border-b transition-colors"
                style={{ borderColor: RULE }}
              >
                <h4 className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight transition-colors" style={{ color: INK, lineHeight: 1.15 }}>
                  {post.title.nl}
                </h4>
                <span className="sw-mono hidden md:block" style={{ color: INK45 }}>
                  {fmtDate(post.date)} · {post.readingTime} min
                </span>
                <ArrowRight className="w-5 h-5 justify-self-end transition-transform group-hover:translate-x-1" style={{ color: INK45 }} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.6, ease: easings.easeOutExpo }}
        >
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 sw-mono border-b-2 pb-1 transition-transform hover:translate-x-1"
            style={{ color: INK, borderColor: "hsl(var(--sw-ink) / 0.25)" }}
          >
            Bekijk alle artikelen <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Hover accents: title turns green on row/feature hover */}
      <style>{`
        .sw-feat:hover h3 { color: hsl(var(--sw-green)) !important; }
        .sw-row:hover h4 { color: hsl(var(--sw-green)) !important; }
        .sw-row:hover { background: hsl(var(--sw-paper)); }
        .sw-row:hover svg { color: hsl(var(--sw-green)) !important; }
      `}</style>
    </section>
  );
};

export default FeaturedBlogPosts;
