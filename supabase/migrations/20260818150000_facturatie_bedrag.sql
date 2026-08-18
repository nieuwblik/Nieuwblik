-- ===========================================
-- BEDRAG BIJ DE FACTURATIE
--
-- In centen, net als projects.budget_cents: een geheel getal kent geen
-- afrondingsverrassingen, en de frontend deelt door honderd.
-- ===========================================

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS billing_amount_cents INTEGER;

ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_billing_amount_positive;
ALTER TABLE public.clients
  ADD CONSTRAINT clients_billing_amount_positive CHECK (
    billing_amount_cents IS NULL OR billing_amount_cents >= 0
  );
