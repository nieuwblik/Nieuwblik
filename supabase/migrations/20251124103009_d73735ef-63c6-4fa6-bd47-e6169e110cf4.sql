-- Fix: Admin dashboard cannot view pending reviews
-- Add SELECT policy for admins to view all reviews (both approved and pending)

CREATE POLICY "Admins can view all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));