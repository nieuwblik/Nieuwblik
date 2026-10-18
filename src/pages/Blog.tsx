import { SITE_URL } from "@/config/site";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Link } from "@/lib/router-compat";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { blogCategories, type BlogCategory } from "@/data/blogCategories";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, scaleUp, easings } from "@/lib/motion";

const Blog = () => {
  const shouldReduceMotion = useReducedMotion();
  const [category, setCategory] = useState<BlogCategory | "Alle artikelen">("Alle artikelen");
  const visiblePosts = category === "Alle artikelen" ? blogPosts : blogPosts.filter((post) => post.category === category);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nieuwblik Blog",
    description: "Waardevolle artikelen over webdesign, SEO, conversie optimalisatie en digitale marketing.",
    url: `${SITE_URL}/blog`,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog | SEO & Webdesign Tips - Nieuwblik Enkhuizen"
        description="Lees onze blog over SEO, webdesign en online zichtbaarheid. Praktische tips van ons webdesign bureau in West-Friesland. Verbeter je website vandaag."
        keywords="webdesign blog, SEO tips Enkhuizen, conversie optimalisatie, online zichtbaarheid, webdesign West-Friesland, website tips"
        canonicalUrl={`${SITE_URL}/blog`}
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` }
        ]}
      />

      {/* Breadcrumb */}
      <section className="pt-32 pb-8 md:pb-12">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Blog", path: "/blog" }]} />
        </div>
      </section>

      {/* Header */}
      <motion.section
        className="pb-16 md:pb-20"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-6">
          <motion.h1
            className="text-display mb-6"
            variants={fadeUp}
          >
            Inzichten voor digitale groei
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
            variants={fadeUp}
          >
            Waardevolle tips, strategieën en inzichten om jouw digitale aanwezigheid naar een hoger niveau te tillen.
          </motion.p>
        </div>
      </motion.section>

      {/* Blog Posts Grid */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="mb-10 flex flex-wrap gap-2 border-b border-border pb-5" role="group" aria-label="Blogcategorieën">
            {(["Alle artikelen", ...blogCategories] as const).map((label) => (
              <Button
                key={label}
                variant="ghost"
                aria-pressed={category === label}
                onClick={() => setCategory(label)}
                className={category === label ? "bg-accent text-accent-foreground hover:bg-accent/90" : "text-muted-foreground"}
              >
                {label}
                <span className="text-xs tabular-nums opacity-75">
                  {label === "Alle artikelen" ? blogPosts.length : blogPosts.filter((post) => post.category === label).length}
                </span>
              </Button>
            ))}
          </div>
          <p className="sr-only" role="status" aria-live="polite">{visiblePosts.length} artikelen in {category.toLowerCase()}</p>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {visiblePosts.map((post, index) => (
              <div
                key={post.slug}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block h-full"
                >
                  <motion.div
                    className="rounded-lg border border-border bg-background overflow-hidden h-full flex flex-col transition-colors"
                    whileHover={shouldReduceMotion ? {} : {
                      y: -4
                    }}
                    transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                  >
                    {/* Image */}
                    {post.image && (
                      <div className="relative h-48 overflow-hidden bg-background">
                        <motion.img
                          src={post.image}
                          alt={post.imageAlt ?? post.title.nl}
                          width={post.imageWidth}
                          height={post.imageHeight}
                          className="w-full h-full object-cover"
                          loading={index < 3 ? "eager" : "lazy"}
                          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                          transition={{ duration: 0.5, ease: easings.easeOutExpo }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="mb-3 text-xs font-semibold text-accent">{post.category}</span>
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readingTime} min
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="text-xl mb-3 line-clamp-2 transition-colors group-hover:text-[hsl(var(--sw-green))]"
                        style={{ color: "hsl(var(--sw-ink))" }}
                      >
                        {post.title.nl}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground font-light line-clamp-3 mb-5 flex-grow">
                        {post.excerpt.nl}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: "hsl(var(--sw-green))" }}>
                        Lees meer
                        <motion.span
                          className="inline-block"
                          whileHover={shouldReduceMotion ? {} : { x: 8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="mt-20 p-12 rounded-2xl text-center text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(160 84% 14%) 0%, hsl(160 84% 10%) 50%, hsl(160 70% 8%) 100%)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleUp}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/20 pointer-events-none" />
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, duration: 0.5, ease: easings.easeOutExpo }}
            >
              Klaar om je digitale aanwezigheid te transformeren?
            </motion.h2>
            <motion.p
              className="text-lg mb-8 text-white/80 max-w-2xl mx-auto font-light relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.15, duration: 0.5, ease: easings.easeOutExpo }}
            >
              Ontdek hoe we jouw website kunnen optimaliseren voor meer conversies, betere rankings en meetbare groei.
            </motion.p>
            <motion.div
              className="relative z-10 inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 0.5, ease: easings.easeOutExpo }}
            >
              <AnimatedButton to="/contact" size="lg" variant="white">
                Start je project vandaag
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
