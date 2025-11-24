import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const FeaturedBlogPosts = () => {
  // Toon de nieuwste blog post
  const latestPost = blogPosts[0];

  return (
    <section className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-accent mb-4 font-semibold tracking-wider">LAATSTE INSIGHTS</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ontdek onze nieuwste artikelen
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
            Waardevolle tips, strategieën en inzichten om jouw digitale aanwezigheid naar een hoger niveau te tillen.
          </p>
        </div>

        {/* Featured Blog Card */}
        <div className="max-w-5xl mx-auto">
          <Link 
            to={`/blog/${latestPost.slug}`}
            className="group block bg-background rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              {latestPost.image && (
                <div className="relative h-64 md:h-full overflow-hidden">
                  <img 
                    src={latestPost.image} 
                    alt={latestPost.title.nl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              
              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <time dateTime={latestPost.date}>
                      {new Date(latestPost.date).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {latestPost.readingTime} min leestijd
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                    {latestPost.title.nl}
                  </h3>
                  
                  <p className="text-muted-foreground font-light leading-relaxed mb-6">
                    {latestPost.excerpt.nl}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-accent font-semibold group-hover:gap-4 transition-all">
                  Lees artikel
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* CTA to Blog Page */}
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/blog">
              Bekijk alle artikelen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
