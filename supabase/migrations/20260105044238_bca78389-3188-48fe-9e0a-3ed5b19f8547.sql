-- ===========================================
-- SECURITY HARDENING MIGRATION
-- ===========================================

-- 1. FIX CRITICAL: Recreate reviews_public view WITHOUT SECURITY DEFINER
-- This ensures RLS is respected
DROP VIEW IF EXISTS public.reviews_public;

CREATE VIEW public.reviews_public AS
SELECT 
    id,
    name,
    company,
    rating,
    review_text,
    created_at
FROM public.reviews
WHERE is_approved = true;

-- Grant access to view for anon and authenticated users
GRANT SELECT ON public.reviews_public TO anon, authenticated;

-- 2. FIX CRITICAL: Add restrictive policies to user_roles table
-- Only admins can modify roles (prevents privilege escalation)

-- Policy: Only admins can insert new roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can update roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can delete roles
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. FIX HIGH: Add UPDATE and DELETE policies to profiles table
-- Users can only update/delete their own profile

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Add index for better query performance on user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 5. Add check constraint on reviews rating to prevent invalid values
ALTER TABLE public.reviews 
ADD CONSTRAINT check_rating_range CHECK (rating >= 1 AND rating <= 5);

-- 6. Add text length constraints to prevent abuse
ALTER TABLE public.reviews
ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100),
ADD CONSTRAINT check_email_length CHECK (char_length(email) <= 255),
ADD CONSTRAINT check_company_length CHECK (char_length(company) <= 100),
ADD CONSTRAINT check_review_text_length CHECK (char_length(review_text) <= 1000);