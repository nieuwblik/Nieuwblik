import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
  name: string;
  company?: string;
  rating: number;
  text: string;
  textNl: string;
  date?: string;
}

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();

  // Add your actual Google reviews here
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      company: "Boutique Fashion",
      rating: 5,
      text: "Nieuwblik transformed our online presence completely. Their attention to detail and understanding of luxury branding is exceptional. Our website now perfectly represents our high-end fashion boutique.",
      textNl: "Nieuwblik heeft onze online aanwezigheid volledig getransformeerd. Hun aandacht voor detail en begrip van luxe branding is uitzonderlijk. Onze website vertegenwoordigt nu perfect onze high-end modewinkel.",
      date: "2 weeks ago"
    },
    {
      name: "Mark van den Berg",
      company: "Tech Innovations B.V.",
      rating: 5,
      text: "Working with Nieuwblik was a game-changer for our startup. They delivered a sophisticated web application that exceeded our expectations. Professional, creative, and incredibly responsive.",
      textNl: "Samenwerken met Nieuwblik was een gamechanger voor onze startup. Ze leverden een geavanceerde webapplicatie die onze verwachtingen overtrof. Professioneel, creatief en ongelooflijk responsief.",
      date: "1 month ago"
    },
    {
      name: "Emma de Vries",
      company: "Wellness Studio",
      rating: 5,
      text: "The branding kit they created for us is absolutely stunning. Every element feels cohesive and premium. Our clients constantly compliment our visual identity. Highly recommend!",
      textNl: "De branding kit die ze voor ons hebben gemaakt is absoluut prachtig. Elk element voelt samenhangend en premium aan. Onze klanten complimenteren voortdurend onze visuele identiteit. Een echte aanrader!",
      date: "3 weeks ago"
    },
    {
      name: "Robert Jansen",
      company: "AutoDeluxe",
      rating: 5,
      text: "From website design to vehicle wrapping graphics, Nieuwblik handled everything with exceptional professionalism. They truly understand how to elevate a brand's visual presence.",
      textNl: "Van websiteontwerp tot autobelettering, Nieuwblik heeft alles met uitzonderlijk professionalisme afgehandeld. Ze begrijpen echt hoe je de visuele aanwezigheid van een merk kunt verheffen.",
      date: "2 months ago"
    },
    {
      name: "Lisa Vermeulen",
      company: "E-commerce Solutions",
      rating: 5,
      text: "Our e-commerce platform is now a work of art. Nieuwblik's design expertise combined with technical excellence resulted in a website that converts beautifully. Worth every euro!",
      textNl: "Ons e-commerce platform is nu een kunstwerk. De ontwerpexpertise van Nieuwblik gecombineerd met technische excellentie resulteerde in een website die prachtig converteert. Elke euro waard!",
      date: "1 week ago"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-background rounded-lg p-8 md:p-12 shadow-lg min-h-[300px] flex flex-col justify-between">
        {/* Stars */}
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < currentTestimonial.rating
                  ? "fill-accent text-accent"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>

        {/* Review Text */}
        <blockquote className="text-lg md:text-xl text-foreground mb-8 font-light leading-relaxed flex-grow">
          "{language === "en" ? currentTestimonial.text : currentTestimonial.textNl}"
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
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-accent w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;