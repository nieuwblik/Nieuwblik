import { Star } from "lucide-react";
import { useState, useEffect } from "react";

interface ReviewBarProps {
  isScrolled?: boolean;
}

const ReviewBar = ({ isScrolled = false }: ReviewBarProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const messages = [
    "10+ 5 sterren reviews",
    "Boek vrijblijvend een call in!",
    "Uw website deze week nog live!",
    "De beste service en kwaliteit!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isScrolled) return null;

  return (
    <div className="bg-accent text-accent-foreground py-2 px-6 border-b border-accent-foreground/10 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-accent-foreground" />
          ))}
        </div>
        <span className="text-sm font-medium transition-all duration-500">
          {messages[currentIndex]}
        </span>
      </div>
    </div>
  );
};

export default ReviewBar;
