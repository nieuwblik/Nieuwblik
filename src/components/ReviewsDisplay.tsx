import { useState, useEffect } from "react";
import { Star, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setReviews(data || []);
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
        <Button
          asChild
          variant="outline"
          size="lg"
        >
          <a
            href="https://www.google.com/search?sca_esv=71fe9f6971011125&rlz=1C1GCEA_enNL1027NL1027&sxsrf=AE3TifM-B4FMIkk5DYGEYEdxl3EtQ4Nmqw:1762678364543&q=nieuwblik&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E41TwuCziL3w73Kt8XMVdkOUPgIOr_b4h6IupuYh4m-qki5ZJ8eFVpL-yBW3eH9arT0bBhs%3D&uds=AOm0WdH6nlfKCX7KLFCq2cu8xOlC0TOV5ueG1dqxqYrC2916mj2v379G3lTv03EdiMAnQ7XDxhytKFxL5sLr_Tibq423KhN3_WHZz9I5Psb6mNkNionJJ8Y&sa=X&ved=2ahUKEwiFj5bO2OSQAxVJ_rsIHWUEBDwQ3PALegQIKhAF&biw=2560&bih=1305&dpr=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            Bekijk alle reviews op Google
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ReviewsDisplay;
