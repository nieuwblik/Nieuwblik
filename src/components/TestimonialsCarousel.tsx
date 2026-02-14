import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";

interface GoogleReview {
  name: string;
  role: string;
  rating: number;
  text: string;
}

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=Nieuwblik+Reviews";

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const reviews: GoogleReview[] = [
    {
      name: "Trijntje Laan",
      role: "Collega via Collega",
      rating: 5,
      text: "Via mijn collega kwam ik bij Nieuwblik terecht. Vanaf het moment dat ik met Justin in contact kwam, voelde het meteen goed. Justin is enthousiast, denkt goed mee en levert kwalitatief hoogstaand werk.",
    },
    {
      name: "Tijs Nieuwboer",
      role: "Klant bij Nieuwblik",
      rating: 5,
      text: "Vanaf het eerste moment dat ik met Nieuwblik in contact kwam, was ik onder de indruk van hun professionele aanpak en creatieve inzicht. Ik had een complete website nodig en zij hebben perfect geleverd.",
    },
    {
      name: "Jesse Huisman",
      role: "Eigenaar Nieuwblik",
      rating: 5,
      text: "Nieuwblik is top! Ik heb altijd goed contact gehad met de jongens daar, en hun leveringen zijn snel en betrouwbaar. Ik heb meerdere designs laten maken, van logo's tot complete websites.",
    },
    {
      name: "Huub Rood",
      role: "Merk Eigenaar",
      rating: 5,
      text: "Ik kwam bij Nieuwblik omdat ik ze via LinkedIn voorbij zag komen. Had een logo nodig voor mijn merk dus klopte ik bij ze aan. Ze hadden goede suggesties en het resultaat is geweldig.",
    },
    {
      name: "Thijs Peerdeman",
      role: "Tevreden Klant",
      rating: 5,
      text: "Super tevreden met de diensten van Nieuwblik. De jongens van Nieuwblik denken echt met je mee en zijn pas klaar wanneer jij tevreden bent. Ik raadt ze aan iedereen aan!",
    },
    {
      name: "Maarten Gesink",
      role: "Klant sinds dag 1",
      rating: 5,
      text: "Sinds dag 1 klant bij Nieuwblik, enorm fijn in contact. Komen professioneel en deskundig over en staan klaar met hun expertise en ideeën. Kortom erg tevreden!",
    },
    {
      name: "Niels van Esveld",
      role: "Website Eigenaar",
      rating: 5,
      text: "Nieuwblik heeft voor ons bedrijf de website onderhanden genomen. Heel fijn en direct contact, handelt snel en luistert niet alleen naar je wens maar neemt ook initiatief.",
    }
  ];

  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPossibleIndices = reviews.length - cardsToShow;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= totalPossibleIndices ? 0 : prev + 1));
  }, [totalPossibleIndices]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? totalPossibleIndices : prev - 1));
  }, [totalPossibleIndices]);

  // AUTO-SLIDE logic: Automatically move through the reviews
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // 4 seconds for a slightly faster, more dynamic feel

    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  useEffect(() => {
    if (currentIndex > totalPossibleIndices) {
      setCurrentIndex(Math.max(0, totalPossibleIndices));
    }
  }, [cardsToShow, totalPossibleIndices, currentIndex]);

  const gap = cardsToShow === 1 ? 24 : (cardsToShow === 2 ? 32 : 40);

  return (
    <div
      className="w-full relative overflow-visible"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={containerRef}
    >
      {/* Slide Container - Changed to overflow-visible to prevent card cutting */}
      <div className="mask-fade-x py-8 md:py-10 px-2 md:px-0 overflow-visible">
        <div className="relative overflow-visible">
          <motion.div
            className="flex"
            style={{ gap: `${gap}px` }}
            animate={{ x: `calc(-${currentIndex} * (100% / ${cardsToShow} + ${gap / cardsToShow}px))` }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="flex-none px-1 md:px-0"
                style={{ width: `calc((100% - ${gap * (cardsToShow - 1)}px) / ${cardsToShow})` }}
              >
                <div className="h-full bg-white/[0.05] backdrop-blur-2xl rounded-2xl border border-white/10 p-6 md:p-10 flex flex-col items-center text-center shadow-xl min-h-[360px] md:min-h-[400px]">
                  <div className="flex gap-1.5 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-white text-white opacity-100" />
                    ))}
                  </div>
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {review.name}
                    </h3>
                  </div>
                  <p className="text-lg md:text-xl text-white/80 font-normal leading-relaxed italic line-clamp-5">
                    "{review.text}"
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Navigation & Pagination - Arrows + Dots consolidated below */}
      <div className="flex flex-col items-center gap-8 mt-4 md:mt-12">
        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={prevSlide}
            className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg hover:bg-white hover:text-black transition-all duration-500"
            aria-label="Vorige review"
          >
            <ChevronLeft className="w-6 h-6 md:w-10 h-10" />
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            {Array.from({ length: totalPossibleIndices + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 md:w-12 bg-white' : 'w-2 md:w-4 bg-white/10 hover:bg-white/30'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg hover:bg-white hover:text-black transition-all duration-500"
            aria-label="Volgende review"
          >
            <ChevronRight className="w-6 h-6 md:w-10 h-10" />
          </button>
        </div>

        <div className="mt-2 md:mt-4">
          <AnimatedButton
            href={GOOGLE_REVIEWS_URL}
            size="lg"
            showArrow={false}
            className="animated-btn-white min-w-[280px] md:min-w-[320px]"
          >
            Bekijk alle Google reviews
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
