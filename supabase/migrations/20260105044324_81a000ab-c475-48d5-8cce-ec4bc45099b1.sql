-- Fix SECURITY DEFINER view issue by setting security_invoker = true
-- This ensures the view respects RLS of the querying user, not the view owner

-- Drop and recreate with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.reviews_public;

CREATE VIEW public.reviews_public 
WITH (security_invoker = true)
AS
SELECT 
    id,
    name,
    company,
    rating,
    review_text,
    created_at
FROM public.reviews
WHERE is_approved = true;

-- Re-grant access
GRANT SELECT ON public.reviews_public TO anon, authenticated;