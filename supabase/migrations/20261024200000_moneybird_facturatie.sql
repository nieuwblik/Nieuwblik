-- Uren factureren via Moneybird.
--
-- Per klant het uurtarief en het Moneybird-contact, zodat je die niet elke
-- keer opnieuw hoeft te kiezen. Per urenregel wanneer hij is gefactureerd en
-- op welke Moneybird-factuur, zodat dezelfde uren niet twee keer op een
-- factuur komen. De serverfunctie moneybird-financien vult deze kolommen.

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS moneybird_contact_id text,
  ADD COLUMN IF NOT EXISTS uurtarief_cents integer;

ALTER TABLE public.clients
  DROP CONSTRAINT IF EXISTS clients_uurtarief_positief;
ALTER TABLE public.clients
  ADD CONSTRAINT clients_uurtarief_positief CHECK (uurtarief_cents IS NULL OR uurtarief_cents >= 0);

ALTER TABLE public.time_entries
  ADD COLUMN IF NOT EXISTS gefactureerd_op timestamptz,
  ADD COLUMN IF NOT EXISTS moneybird_factuur_id text;

CREATE INDEX IF NOT EXISTS time_entries_nog_te_factureren_idx
  ON public.time_entries (project_id) WHERE billable AND gefactureerd_op IS NULL;
