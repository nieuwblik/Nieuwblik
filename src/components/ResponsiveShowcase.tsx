import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { easings } from "@/lib/motion";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import showcaseImage from "@/assets/projects/casperpt-mobiele-optimalisatie-2.webp";

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 80 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.8,
        delay: shouldReduceMotion ? 0 : delay,
        ease: easings.easeOutExpo,
      }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedText = ({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "h2" | "span";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[Component];

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.7,
        delay: shouldReduceMotion ? 0 : delay,
        ease: easings.easeOutExpo,
      }}
    >
      {children}
    </MotionComponent>
  );
};

export const ResponsiveShowcase = () => {
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      icon: Monitor,
      title: "Desktop",
      description: "Prachtige layouts op grote schermen",
    },
    {
      icon: Tablet,
      title: "Tablet",
      description: "Naadloos aangepast voor tablets",
    },
    {
      icon: Smartphone,
      title: "Mobiel",
      description: "Perfecte ervaring op elke telefoon",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-secondary overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <AnimatedText as="p" className="text-accent mb-4 tracking-[0.2em] text-sm font-medium">
              RESPONSIVE DESIGN
            </AnimatedText>
            <AnimatedText as="h2" className="text-4xl md:text-5xl font-bold mb-6" delay={0.1}>
              Website voor elk scherm
            </AnimatedText>
            <AnimatedText as="p" className="text-lg text-muted-foreground max-w-xl font-light leading-relaxed mb-10" delay={0.2}>
              Elke website die wij bouwen werkt foutloos op desktop, tablet én mobiel. Jouw klanten krijgen altijd de beste ervaring, ongeacht het apparaat.
            </AnimatedText>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <AnimatedSection key={index} delay={0.3 + index * 0.1}>
                  <motion.div
                    className="flex items-start gap-4 group"
                    whileHover={shouldReduceMotion ? {} : { x: 8 }}
                    transition={{ duration: 0.3, ease: easings.easeOutExpo }}
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 shrink-0 transition-colors duration-300 group-hover:bg-accent/20">
                      <feature.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground font-light">{feature.description}</p>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Right: Phone mockup with image */}
          <AnimatedSection delay={0.6} className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src={showcaseImage}
                alt="Website geoptimaliseerd voor mobiel - voorbeeld van responsive design"
                className="w-full max-w-[380px] md:max-w-[480px] lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] h-auto drop-shadow-2xl"
                loading="lazy"
                decoding="async"
                width="800"
                height="1200"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
