import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const FeaturedBlogPosts = () => {
  // Get the 3 most recent blog posts
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-accent mb-4">ONZE BLOG</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Laatste inzichten & inspiratie
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Ontdek waardevolle tips, trends en strategieën die jouw digitale aanwezigheid naar een hoger niveau tillen
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
                    {new Date(post.date).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} min
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {post.title.nl}
                </h3>
                
                <p className="text-muted-foreground font-light mb-4 line-clamp-3">
                  {post.excerpt.nl}
                </p>
                
                <span className="text-accent font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Lees verder
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
            Alle artikelen bekijken
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
