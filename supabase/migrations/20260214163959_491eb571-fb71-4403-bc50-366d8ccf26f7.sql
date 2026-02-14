-- Fix the broken rate limiting policy: r.email = r.email is self-referencing (always true)
-- It should compare existing rows' email to the NEW row's email
DROP POLICY IF EXISTS "Anyone can submit reviews with rate limit" ON public.reviews;

CREATE POLICY "Anyone can submit reviews with rate limit"
  ON public.reviews
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM public.reviews r
      WHERE r.email = reviews.email
      AND r.created_at > NOW() - INTERVAL '1 hour'
    )
  );
