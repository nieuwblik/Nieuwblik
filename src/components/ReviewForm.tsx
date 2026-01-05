import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { reviewSchema, type ReviewFormData } from "@/lib/validationSchemas";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    review_text: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Validate form data
      const validationData: ReviewFormData = {
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        rating,
        review_text: formData.review_text,
      };

      const validationResult = reviewSchema.safeParse(validationData);
      
      if (!validationResult.success) {
        const firstError = Object.values(validationResult.error.flatten().fieldErrors)[0]?.[0];
        toast.error(firstError || "Controleer je invoer");
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          name: validationResult.data.name,
          email: validationResult.data.email,
          company: validationResult.data.company || null,
          rating: validationResult.data.rating,
          review_text: validationResult.data.review_text
        });

      if (error) throw error;

      toast.success("Bedankt voor je review! Deze wordt binnenkort gepubliceerd na goedkeuring.");
      
      // Reset form
      setFormData({ name: "", email: "", company: "", review_text: "" });
      setRating(0);
    } catch {
      toast.error("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">Deel je ervaring</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="rating" className="mb-2 block">
            Jouw beoordeling *
          </Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="name">Naam *</Label>
          <Input
            id="name"
            required
            maxLength={100}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jouw naam"
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            maxLength={255}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jouw@email.nl"
          />
        </div>

        <div>
          <Label htmlFor="company">Bedrijf (optioneel)</Label>
          <Input
            id="company"
            maxLength={100}
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Jouw bedrijfsnaam"
          />
        </div>

        <div>
          <Label htmlFor="review_text">Jouw review *</Label>
          <Textarea
            id="review_text"
            required
            minLength={10}
            maxLength={1000}
            value={formData.review_text}
            onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
            placeholder="Vertel over je ervaring met Nieuwblik..."
            rows={5}
          />
          <p className="text-sm text-muted-foreground mt-1">
            {formData.review_text.length}/1000 karakters
          </p>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isSubmitting ? "Verzenden..." : "Verstuur review"}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
