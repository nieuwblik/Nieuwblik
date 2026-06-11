
-- Lock down has_role: only authenticated may execute; revoke from public/anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Persistent rate-limit log for contact form
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_rate_limits_ip_created_idx
  ON public.contact_rate_limits (ip_address, created_at DESC);

GRANT ALL ON public.contact_rate_limits TO service_role;

ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (which bypasses RLS) can access.
