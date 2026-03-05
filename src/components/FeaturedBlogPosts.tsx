import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { easings } from "@/lib/motion";

const FeaturedBlogPosts = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  
  // Featured = first post (BeNoted), secondary = next 3
  const featuredPost = blogPosts[0];
  const secondaryPosts = blogPosts.slice(1, 4);

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-secondary"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.7, ease: easings.easeOutExpo }}
        >
          <p className="text-accent mb-4 font-semibold tracking-wider">LAATSTE INSIGHTS</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ontdek onze nieuwste artikelen
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
            Waardevolle tips, strategieën en inzichten om jouw digitale aanwezigheid naar een hoger niveau te tillen.
          </p>
        </motion.div>

        {/* Featured Blog Card (Large) */}
        <motion.div 
          className="max-w-5xl mx-auto mb-12"
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 80, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easings.easeOutExpo }}
        >
          <Link 
            to={`/blog/${featuredPost.slug}`}
            className="group block"
          >
            <motion.div 
              className="bg-background rounded-lg overflow-hidden shadow-lg"
              whileHover={shouldReduceMotion ? {} : { 
                y: -8, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
              }}
              transition={{ duration: 0.3, ease: easings.easeOutExpo }}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {featuredPost.image && (
                  <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
                    <motion.img 
                      src={featuredPost.image} 
                      alt={featuredPost.title.nl}
                      className="w-full h-full object-contain bg-secondary p-8"
                      loading="lazy"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                      transition={{ duration: 0.5, ease: easings.easeOutExpo }}
                    />
                  </div>
                )}
                
                <div className="p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <time dateTime={featuredPost.date}>
                        {new Date(featuredPost.date).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readingTime} min leestijd
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                      {featuredPost.title.nl}
                    </h3>
                    
                    <p className="text-muted-foreground font-light leading-relaxed mb-6">
                      {featuredPost.excerpt.nl}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    Lees artikel
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Secondary Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {secondaryPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: easings.easeOutExpo }}
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <motion.div
                  className="bg-background rounded-lg overflow-hidden shadow-md h-full flex flex-col"
                  whileHover={shouldReduceMotion ? {} : {
                    y: -6,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.12)"
                  }}
                  transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                >
                  {post.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title.nl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title.nl}
                    </h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt.nl}
                    </p>
                    <div className="flex items-center gap-1 text-accent font-semibold text-sm mt-4">
                      Lees meer
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA to Blog Page */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 0.6, duration: 0.6, ease: easings.easeOutExpo }}
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: easings.easeOutQuart }}
          >
            <Button asChild size="lg" variant="outline">
              <Link to="/blog" className="flex items-center gap-2">
                Bekijk alle artikelen
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
