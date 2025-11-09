import { Star } from "lucide-react";

const ReviewBar = () => {
  return (
    <div className="bg-accent text-accent-foreground py-2 px-6 border-b border-accent-foreground/10">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-accent-foreground" />
          ))}
        </div>
        <span className="text-sm font-medium">
          10+ 5 sterren reviews
        </span>
      </div>
    </div>
  );
};

export default ReviewBar;
