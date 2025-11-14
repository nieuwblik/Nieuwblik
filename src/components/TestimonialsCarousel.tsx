import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Add your actual Google reviews here
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

      {/* All Reviews Button */}
      <div className="text-center mt-8">
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
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;