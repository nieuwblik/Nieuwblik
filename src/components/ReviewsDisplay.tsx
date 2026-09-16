import { REVIEWS } from "@/config/business";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

interface Review {
  id: string;
  name: string;
  company: string | null;
  rating: number;
  review_text: string;
  created_at: string;
}

const ReviewsDisplay = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Supabase pas in de browser laden: de client is een CommonJS-bundel en
      // mag niet in de servergraaf terechtkomen (SSR-fout "exports is not defined").
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from('reviews_public')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setReviews((data ?? []) as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-secondary p-6 rounded-lg animate-pulse">
            <div className="h-6 bg-muted rounded mb-4"></div>
            <div className="h-20 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id}
            className="bg-secondary p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            
            <p className="text-foreground mb-4 font-light leading-relaxed">
              "{review.review_text}"
            </p>
            
            <div className="border-t border-border pt-4">
              <p className="font-semibold">{review.name}</p>
              {review.company && (
                <p className="text-sm text-muted-foreground">{review.company}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {formatDate(review.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nog geen reviews beschikbaar. Wees de eerste om een review achter te laten!
        </p>
      )}

      <div className="text-center">
        <AnimatedButton
          href={REVIEWS.profielUrl}
          size="lg"
          variant="outline"
        >
          Bekijk alle reviews op Google
        </AnimatedButton>
      </div>
    </div>
  );
};

export default ReviewsDisplay;
