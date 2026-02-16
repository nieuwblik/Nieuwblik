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
  
  // Toon de nieuwste blog post
  const latestPost = blogPosts[0];

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

        {/* Featured Blog Card */}
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 80, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easings.easeOutExpo }}
        >
          <Link 
            to={`/blog/${latestPost.slug}`}
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
                {/* Image */}
                {latestPost.image && (
                  <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
                    <motion.img 
                      src={latestPost.image} 
                      alt={latestPost.title.nl}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                      transition={{ duration: 0.5, ease: easings.easeOutExpo }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <motion.div 
                      className="flex items-center gap-3 text-sm text-muted-foreground mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.4, duration: 0.5, ease: easings.easeOutExpo }}
                    >
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
                    </motion.div>
                    
                    <motion.h3 
                      className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-accent transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.45, duration: 0.5, ease: easings.easeOutExpo }}
                    >
                      {latestPost.title.nl}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-muted-foreground font-light leading-relaxed mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.5, duration: 0.5, ease: easings.easeOutExpo }}
                    >
                      {latestPost.excerpt.nl}
                    </motion.p>
                  </div>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-accent font-semibold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.55, duration: 0.5, ease: easings.easeOutExpo }}
                  >
                    Lees artikel
                    <motion.span
                      className="inline-block"
                      whileHover={shouldReduceMotion ? {} : { x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

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
