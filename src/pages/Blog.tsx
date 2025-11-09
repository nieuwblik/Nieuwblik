import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import snelleWebsites from "@/assets/blog/snelle-websites.jpg";
import conversieOptimalisatie from "@/assets/blog/conversie-optimalisatie.jpg";
import seoFundamentals from "@/assets/blog/seo-fundamentals.jpg";

const Blog = () => {
  const heroAnimation = useScrollAnimation(0.1);

  const blogImages: Record<string, string> = {
    "waarom-snelle-websites-meer-verkopen": snelleWebsites,
    "van-bezoeker-naar-klant-conversie-optimalisatie": conversieOptimalisatie,
    "seo-fundamentals-gevonden-worden": seoFundamentals,
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group"
              >
                <article
                  className="bg-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 h-full flex flex-col border border-border/50 hover:border-accent/50"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    opacity: heroAnimation.isVisible ? 1 : 0,
                    transform: heroAnimation.isVisible ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  {/* Blog Image */}
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <img 
                      src={blogImages[post.slug]} 
                      alt={post.title.nl}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <time dateTime={post.date} className="font-medium">
                        {new Date(post.date).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTime} min leestijd
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                      {post.title.nl}
                    </h2>
                    
                    <p className="text-muted-foreground font-light text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                      {post.excerpt.nl}
                    </p>
                    
                    <div className="flex items-center text-accent font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                      Lees het volledige artikel
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
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
