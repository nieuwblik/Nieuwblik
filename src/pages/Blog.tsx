import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Blog = () => {
  const heroAnimation = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <div
            ref={heroAnimation.ref}
            className={`max-w-4xl transition-all duration-1000 ${
              heroAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-accent mb-6">ONZE BLOG</p>
            <h1 className="text-display mb-6">
              Inzichten die je verder brengen
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Ontdek waardevolle tips, trends en strategieën die jouw digitale aanwezigheid naar een hoger niveau tillen. Van design tot marketing - we delen onze kennis graag met je.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group"
              >
                <article
                  className={`bg-secondary rounded-lg overflow-hidden transition-all duration-700 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    opacity: heroAnimation.isVisible ? 1 : 0,
                    transform: heroAnimation.isVisible ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readingTime} min
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">
                      {post.title.nl}
                    </h2>
                    
                    <p className="text-muted-foreground font-light mb-6 flex-1">
                      {post.excerpt.nl}
                    </p>
                    
                    <span className="text-accent font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      Lees verder
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
