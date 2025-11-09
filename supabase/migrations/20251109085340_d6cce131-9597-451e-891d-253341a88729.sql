-- Create reviews table for customer testimonials
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews" 
ON public.reviews 
FOR SELECT 
USING (is_approved = true);

-- Policy: Anyone can insert their own review (pending approval)
CREATE POLICY "Anyone can submit reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved, created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_reviews_updated_at();