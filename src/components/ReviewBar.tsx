import { Star } from "lucide-react";
import { useState, useEffect } from "react";

interface ReviewBarProps {
  isScrolled?: boolean;
}

const ReviewBar = ({ isScrolled = false }: ReviewBarProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const messages = [
    "10+ 5 sterren reviews",
    "Website deze week live!",
    "Vrijblijvend kennismaken!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isScrolled) return null;

  return (
    <div className="bg-accent text-accent-foreground py-2 px-4 border-b border-accent-foreground/10 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-center gap-2">
        {currentIndex === 0 && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text" style={{
                fill: 'url(#gold-gradient)'
              }} />
            ))}
            <svg width="0" height="0">
              <defs>
                <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: '#fbbf24', stopOpacity: 1}} />
                  <stop offset="50%" style={{stopColor: '#eab308', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#ca8a04', stopOpacity: 1}} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
        <span className="text-xs md:text-sm font-medium transition-all duration-500">
          {messages[currentIndex]}
        </span>
      </div>
    </div>
  );
};

export default ReviewBar;
