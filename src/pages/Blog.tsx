import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nieuwblik Blog",
    description: "Waardevolle artikelen over webdesign, SEO, conversie optimalisatie en digitale marketing.",
    url: "https://www.nieuwblik.com/blog",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog | Digitale Marketing & Webdesign Artikelen - Nieuwblik"
        description="Ontdek waardevolle inzichten over webdesign, SEO, conversie optimalisatie en digitale marketing. Praktische tips die direct toepasbaar zijn."
        keywords="webdesign blog, SEO tips, conversie optimalisatie, digitale marketing, webdesign tips"
        canonicalUrl="https://www.nieuwblik.com/blog"
        structuredData={structuredData}
      />
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Blog", path: "/blog" }]} />
        </div>
      </section>

      {/* Header */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Digitale groei insights
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Waardevolle tips, strategieën en inzichten om jouw digitale aanwezigheid naar een hoger niveau te tillen.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block bg-card rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image */}
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title.nl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
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
                  <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title.nl}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-muted-foreground font-light line-clamp-3 mb-4">
                    {post.excerpt.nl}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-4 transition-all">
                    Lees meer
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-accent text-accent-foreground p-12 rounded-lg text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Klaar om je digitale aanwezigheid te transformeren?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto font-light">
              Ontdek hoe we jouw website kunnen optimaliseren voor meer conversies, betere rankings en meetbare groei.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-background text-foreground hover:bg-background/90 font-semibold"
            >
              <Link to="/contact">Start je project vandaag</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
