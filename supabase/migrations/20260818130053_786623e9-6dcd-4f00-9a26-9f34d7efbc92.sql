-- ===========================================
-- HOSTINGFACTURATIE
--
-- Twee dingen: wat er per klant is afgesproken, en wat je daarvan al
-- gefactureerd hebt.
--
-- De factuurdata zelf worden niet opgeslagen — die volgen uit de
-- ingangsdatum en de cyclus, en zouden als rijen alleen maar kunnen
-- gaan afwijken van de afspraak. Alleen wat je afvinkt wordt bewaard.
-- ===========================================

DO $$ BEGIN
  CREATE TYPE public.billing_cycle AS ENUM ('maandelijks', 'jaarlijks');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -------------------------------------------
-- 1. De afspraak, bij de klant
-- -------------------------------------------

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS billing_cycle public.billing_cycle,
  ADD COLUMN IF NOT EXISTS billing_start DATE,
  ADD COLUMN IF NOT EXISTS billing_note  TEXT;

-- Beide of geen: een cyclus zonder ingangsdatum levert geen enkele
-- factuurdatum op, en een ingangsdatum zonder cyclus evenmin.
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_billing_complete;
ALTER TABLE public.clients
  ADD CONSTRAINT clients_billing_complete CHECK (
    (billing_cycle IS NULL AND billing_start IS NULL)
    OR (billing_cycle IS NOT NULL AND billing_start IS NOT NULL)
  );

ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_billing_note_length;
ALTER TABLE public.clients
  ADD CONSTRAINT clients_billing_note_length CHECK (
    billing_note IS NULL OR char_length(billing_note) <= 2000
  );

CREATE INDEX IF NOT EXISTS clients_billing_idx
  ON public.clients (billing_cycle, billing_start)
  WHERE billing_cycle IS NOT NULL;

-- -------------------------------------------
-- 2. Wat er gefactureerd is
-- -------------------------------------------

CREATE TABLE IF NOT EXISTS public.invoiced_periods (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id    UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  -- De eerste dag van de periode waar de factuur bij hoort. Precies de datum
  -- die de kalender uitrekent, zodat afvinken en schema elkaar vinden.
  period_date  DATE NOT NULL,
  invoiced_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  invoiced_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note         TEXT,
  CONSTRAINT invoiced_periods_unique UNIQUE (client_id, period_date),
  CONSTRAINT invoiced_periods_note_length CHECK (note IS NULL OR char_length(note) <= 2000)
);

CREATE INDEX IF NOT EXISTS invoiced_periods_date_idx
  ON public.invoiced_periods (period_date DESC);

ALTER TABLE public.invoiced_periods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage invoiced periods" ON public.invoiced_periods;
CREATE POLICY "Admins manage invoiced periods"
ON public.invoiced_periods
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.invoiced_periods FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoiced_periods TO authenticated;
GRANT ALL ON public.invoiced_periods TO service_role;