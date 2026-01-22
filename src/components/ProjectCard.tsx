import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { easings, modalVariants, overlayVariants, staggerContainer, staggerItem } from "@/lib/motion";
interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  url: string;
  tags?: string[];
  slug?: string;
}
const ProjectCard = ({
  title,
  category,
  description,
  image,
  url,
  tags,
  slug
}: ProjectCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  return <>
    <motion.div className="group cursor-pointer block relative" initial="rest" whileHover="hover" animate="rest">
      <motion.div transition={{
        duration: 0.3,
        ease: easings.easeOutExpo
      }} className="aspect-[4/3] bg-secondary rounded-lg mb-6 overflow-hidden relative shadow-none">
        <motion.img src={image} alt={title} loading="lazy" decoding="async" width="800" height="600" className="w-full h-full object-cover object-top" variants={{
          rest: {
            scale: 1
          },
          hover: shouldReduceMotion ? {
            scale: 1
          } : {
            scale: 1.08
          }
        }} transition={{
          duration: 0.5,
          ease: easings.easeOutExpo
        }} />

        {/* Overlay */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/80" variants={{
          rest: {
            opacity: 0
          },
          hover: {
            opacity: 1
          }
        }} transition={{
          duration: 0.25,
          ease: easings.easeOutQuart
        }} />

        {/* Buttons */}
        <motion.div className="absolute inset-0 flex items-center justify-center gap-4" variants={{
          rest: {
            opacity: 0,
            y: 10
          },
          hover: {
            opacity: 1,
            y: 0
          }
        }} transition={{
          duration: 0.25,
          ease: easings.easeOutQuart
        }}>
          <motion.a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium bg-background px-6 py-3 rounded-full flex items-center gap-2 shadow-lg border border-border/20" onClick={e => e.stopPropagation()} whileHover={shouldReduceMotion ? {} : {
            scale: 1.05,
            y: -2
          }} whileTap={shouldReduceMotion ? {} : {
            scale: 0.98
          }} transition={{
            duration: 0.2,
            ease: easings.easeOutQuart
          }}>
            Bekijk website
            <ExternalLink className="w-4 h-4" />
          </motion.a>
          {slug ? <motion.div whileHover={shouldReduceMotion ? {} : {
            scale: 1.05,
            y: -2
          }} whileTap={shouldReduceMotion ? {} : {
            scale: 0.98
          }} transition={{
            duration: 0.2,
            ease: easings.easeOutQuart
          }}>
            <Link to={`/portfolio/${slug}`} className="text-sm font-medium bg-primary text-primary-foreground px-6 py-3 rounded-full flex items-center gap-2 shadow-lg" onClick={e => e.stopPropagation()}>
              Bekijk de case
            </Link>
          </motion.div> : <motion.button onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setShowDetails(true);
          }} className="text-sm font-medium bg-primary text-primary-foreground px-6 py-3 rounded-full flex items-center gap-2 shadow-lg" whileHover={shouldReduceMotion ? {} : {
            scale: 1.05,
            y: -2
          }} whileTap={shouldReduceMotion ? {} : {
            scale: 0.98
          }} transition={{
            duration: 0.2,
            ease: easings.easeOutQuart
          }}>
            Details
          </motion.button>}
        </motion.div>
      </motion.div>

      <div>
        <motion.p className="text-sm text-accent font-light mb-2" variants={{
          rest: {
            x: 0
          },
          hover: shouldReduceMotion ? {
            x: 0
          } : {
            x: 4
          }
        }} transition={{
          duration: 0.2,
          ease: easings.easeOutQuart
        }}>
          {category}
        </motion.p>
        <motion.h3 className="text-2xl font-semibold mb-2 transition-colors group-hover:text-accent" variants={{
          rest: {
            x: 0
          },
          hover: shouldReduceMotion ? {
            x: 0
          } : {
            x: 4
          }
        }} transition={{
          duration: 0.2,
          ease: easings.easeOutQuart,
          delay: 0.02
        }}>
          {title}
        </motion.h3>
        <p className="text-muted-foreground mb-4 font-light">{description}</p>
        {tags && tags.length > 0 && <motion.div className="flex flex-wrap gap-2" variants={staggerContainer} initial="hidden" animate="visible">
          {tags.map((tag, idx) => <motion.span key={idx} className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground" variants={staggerItem} whileHover={shouldReduceMotion ? {} : {
            scale: 1.05,
            backgroundColor: "hsl(var(--accent) / 0.1)"
          }} transition={{
            duration: 0.2
          }}>
            {tag}
          </motion.span>)}
        </motion.div>}
      </div>
    </motion.div>

    {/* Details Dialog */}
    <AnimatePresence>
      {showDetails && <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-xl w-[90vw] max-h-[85vh] overflow-y-auto p-0 border-0">
          <motion.div className="space-y-4 p-6" variants={modalVariants} initial="hidden" animate="visible" exit="exit">
            {/* Header */}
            <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.1,
              duration: 0.3,
              ease: easings.easeOutExpo
            }}>
              <h2 className="text-2xl font-bold mb-1">{title}</h2>
              <p className="text-accent font-light text-sm">{category}</p>
            </motion.div>

            {/* Image */}
            <motion.div className="aspect-[16/10] bg-secondary rounded-lg overflow-hidden" initial={{
              opacity: 0,
              scale: 0.98
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: 0.15,
              duration: 0.4,
              ease: easings.easeOutExpo
            }}>
              <img src={image} alt={title} className="w-full h-full object-cover object-top" />
            </motion.div>

            {/* Description */}
            <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2,
              duration: 0.3,
              ease: easings.easeOutExpo
            }}>
              <h3 className="text-lg font-semibold mb-2">Over dit project</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                {description}
              </p>
            </motion.div>

            {/* Tags */}
            {tags && tags.length > 0 && <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.25,
              duration: 0.3,
              ease: easings.easeOutExpo
            }}>
              <h3 className="text-lg font-semibold mb-2">Diensten</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => <motion.span key={idx} className="text-xs px-3 py-1.5 bg-secondary rounded-full text-muted-foreground font-medium" initial={{
                  opacity: 0,
                  scale: 0.9
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  delay: 0.3 + idx * 0.05,
                  duration: 0.2
                }}>
                  {tag}
                </motion.span>)}
              </div>
            </motion.div>}

            {/* CTA Button */}
            <motion.div className="pt-3 border-t border-border" initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.35,
              duration: 0.3,
              ease: easings.easeOutExpo
            }}>
              <motion.div whileHover={shouldReduceMotion ? {} : {
                scale: 1.02
              }} whileTap={shouldReduceMotion ? {} : {
                scale: 0.98
              }} transition={{
                duration: 0.2
              }} className="flex flex-col gap-3">
                {slug && (
                  <Button asChild className="w-full bg-accent hover:bg-accent/90" size="lg">
                    <Link to={`/portfolio/${slug}`}>Bekijk de case</Link>
                  </Button>
                )}
                <Button asChild className="w-full" size="lg" variant={slug ? "outline" : "default"}>
                  <Link to="/contact">Offerte aanvragen</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>}
    </AnimatePresence>
  </>;
};
export default ProjectCard;