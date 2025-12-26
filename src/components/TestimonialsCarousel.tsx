import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { easings, fadeUp, scaleUp } from "@/lib/motion";

interface Testimonial {
  name: string;
  company?: string;
  rating: number;
  text: string;
  date?: string;
}

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?sca_esv=8d0681f1a4a4235b&rlz=1C1GCEA_enNL1027NL1027&sxsrf=AE3TifMLcYtBEKpUaNhMYnjtbFJY4DDtZQ:1762430304800&q=nieuwblik&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E41TwuCziL3w73Kt8XMVdkOUPgIOr_b4h6IupuYh4m-qki5ZJ8eFVpL-yBW3eH9arT0bBhs%3D&uds=AOm0WdH6nlfKCX7KLFCq2cu8xOlC0TOV5ueG1dqxqYrC2916mj2v379G3lTv03EdiMAnQ7XDxhytKFxL5sLr_Tibq423KhN3_WHZz9I5Psb6mNkNionJJ8Y&sa=X&ved=2ahUKEwjEhInCvN2QAxVt2QIHHan6LMMQ3PALegQINhAF&biw=2560&bih=1305&dpr=1";

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      company: "Boutique Fashion",
      rating: 5,
      text: "Nieuwblik heeft onze online aanwezigheid volledig getransformeerd. Hun aandacht voor detail en begrip van luxe branding is uitzonderlijk. Onze website vertegenwoordigt nu perfect onze high-end modewinkel.",
      date: "2 weeks ago"
    },
    {
      name: "Mark van den Berg",
      company: "Tech Innovations B.V.",
      rating: 5,
      text: "Samenwerken met Nieuwblik was een gamechanger voor onze startup. Ze leverden een geavanceerde webapplicatie die onze verwachtingen overtrof. Professioneel, creatief en ongelooflijk responsief.",
      date: "1 month ago"
    },
    {
      name: "Emma de Vries",
      company: "Wellness Studio",
      rating: 5,
      text: "De branding kit die ze voor ons hebben gemaakt is absoluut prachtig. Elk element voelt samenhangend en premium aan. Onze klanten complimenteren voortdurend onze visuele identiteit. Een echte aanrader!",
      date: "3 weeks ago"
    },
    {
      name: "Robert Jansen",
      company: "AutoDeluxe",
      rating: 5,
      text: "Van websiteontwerp tot autobelettering, Nieuwblik heeft alles met uitzonderlijk professionalisme afgehandeld. Ze begrijpen echt hoe je de visuele aanwezigheid van een merk kunt verheffen.",
      date: "2 months ago"
    },
    {
      name: "Lisa Vermeulen",
      company: "E-commerce Solutions",
      rating: 5,
      text: "Ons e-commerce platform is nu een kunstwerk. De ontwerpexpertise van Nieuwblik gecombineerd met technische excellentie resulteerde in een website die prachtig converteert. Elke euro waard!",
      date: "1 week ago"
    }
  ];

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: easings.easeOutExpo,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.3,
        ease: easings.easeInOutQuart,
      },
    }),
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <motion.div 
        className="bg-background rounded-lg p-8 md:p-12 shadow-lg min-h-[300px] flex flex-col justify-between overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: easings.easeOutExpo }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col flex-grow"
          >
            {/* Stars */}
            <motion.div 
              className="flex gap-1 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={shouldReduceMotion ? {} : { scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: shouldReduceMotion ? 0 : 0.1 + i * 0.05, 
                    duration: 0.3, 
                    ease: easings.softBounce 
                  }}
                >
                  <Star
                    className={`w-5 h-5 ${
                      i < currentTestimonial.rating
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Review Text */}
            <blockquote className="text-lg md:text-xl text-foreground mb-8 font-light leading-relaxed flex-grow">
              "{currentTestimonial.text}"
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
                {currentTestimonial.company && (
                  <p className="text-sm text-muted-foreground">{currentTestimonial.company}</p>
                )}
              </div>
              {currentTestimonial.date && (
                <p className="text-sm text-muted-foreground">{currentTestimonial.date}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div 
        className="flex items-center justify-center gap-4 mt-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.2, duration: 0.4, ease: easings.easeOutExpo }}
      >
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Vorige review"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-accent"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              animate={{ 
                width: index === currentIndex ? 32 : 8,
              }}
              transition={{ duration: 0.3, ease: easings.easeOutExpo }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.2 }}
              aria-label={`Ga naar review ${index + 1}`}
            />
          ))}
        </div>

        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Volgende review"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>

      {/* All Reviews Button */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.3, duration: 0.4, ease: easings.easeOutExpo }}
      >
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          transition={{ duration: 0.2, ease: easings.easeOutQuart }}
        >
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="group"
          >
            <a 
              href={GOOGLE_REVIEWS_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Bekijk alle recensies
              <motion.span
                className="inline-block"
                whileHover={shouldReduceMotion ? {} : { x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.span>
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TestimonialsCarousel;
