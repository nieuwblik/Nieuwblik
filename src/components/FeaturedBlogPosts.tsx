import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturedBlogPosts = () => {
  const { t, language } = useLanguage();
  
  // Get the 3 most recent blog posts
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-accent mb-4">{t("blog.label")}</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'nl' ? 'Laatste inzichten' : 'Latest insights'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            {language === 'nl' 
              ? 'Ontdek onze nieuwste artikelen over design, branding en digitale strategie.' 
              : 'Discover our latest articles about design, branding and digital strategy.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {latestPosts.map((post, index) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-background rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} {t("blog.readingTime")}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {post.title[language]}
                </h3>
                
                <p className="text-muted-foreground font-light mb-4 line-clamp-3">
                  {post.excerpt[language]}
                </p>
                
                <span className="text-accent font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t("blog.readMore")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            {language === 'nl' ? 'Bekijk alle artikelen' : 'View all articles'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
