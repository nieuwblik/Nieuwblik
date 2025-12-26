import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { LazyYouTube } from "@/utils/lazyYouTube";
import { easings } from "@/lib/motion";

const SocialContentSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const videos = [
    { id: "Xdi3lZXIAQ0", title: "Social Content 1" },
    { id: "JlfYFuFOl1A", title: "Social Content 2" },
    { id: "padxRrPjKsA", title: "Social Content 3" },
    { id: "Hb4caf_NB1k", title: "Social Content 4" },
    { id: "0FSEJxlDNpk", title: "Social Content 5" },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.7, ease: easings.easeOutExpo }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Visuele content die converteert
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Wij nemen professionele social media content op voor jouw advertisements, 
            website en funnel. Zo maak je visueel direct duidelijk aan je klanten wie je bent, 
            wat je doet en waarom je de betere keuze bent dan de concurrent.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {videos.map((video, index) => (
            <motion.div 
              key={video.id} 
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 0.2 + index * 0.1, 
                duration: 0.6, 
                ease: easings.easeOutExpo 
              }}
              whileHover={shouldReduceMotion ? {} : { 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              <LazyYouTube 
                videoId={video.id}
                title={video.title}
                className="absolute inset-0 w-full h-full"
              />
              
              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.7, duration: 0.5, ease: easings.easeOutExpo }}
        >
          <p className="text-sm text-muted-foreground">
            Bekijk onze content en zie hoe wij jouw merk tot leven brengen
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialContentSection;
