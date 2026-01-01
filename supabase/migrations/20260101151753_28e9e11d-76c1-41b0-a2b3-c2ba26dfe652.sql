-- Fix: Remove public SELECT policy on reviews table to prevent email exposure
-- Public users should use the reviews_public view instead (which already excludes email)

DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;

-- Grant SELECT on the reviews_public view to all users
GRANT SELECT ON public.reviews_public TO anon, authenticated;