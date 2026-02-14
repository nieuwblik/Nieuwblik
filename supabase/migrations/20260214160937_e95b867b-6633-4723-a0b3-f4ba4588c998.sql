-- Add rate limiting: max 1 review per email per hour
-- First drop the existing permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;

-- Create a new INSERT policy with rate limiting
CREATE POLICY "Anyone can submit reviews with rate limit"
  ON public.reviews
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM public.reviews r
      WHERE r.email = email
      AND r.created_at > NOW() - INTERVAL '1 hour'
    )
  );