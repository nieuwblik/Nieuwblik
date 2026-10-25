-- Mailingen uitbreiden: concepten, inplannen, gespreid versturen, opmaak,
-- en de afleverstatus die Resend terugmeldt (afgeleverd, onbestelbaar,
-- spamklacht).

-- Per mailing: de stand en hoe hij verstuurd wordt.
ALTER TABLE public.mailings
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'verstuurd',
  ADD COLUMN IF NOT EXISTS ingepland_op timestamptz,
  ADD COLUMN IF NOT EXISTS spreiding_minuten integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS persoonlijk boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS afmeldkop boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS klant_ids uuid[],
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.mailings DROP CONSTRAINT IF EXISTS mailings_status_check;
ALTER TABLE public.mailings
  ADD CONSTRAINT mailings_status_check CHECK (status IN ('concept', 'ingepland', 'verstuurd', 'geannuleerd'));

ALTER TABLE public.mailings DROP CONSTRAINT IF EXISTS mailings_spreiding_check;
ALTER TABLE public.mailings
  ADD CONSTRAINT mailings_spreiding_check CHECK (spreiding_minuten BETWEEN 0 AND 1440);

-- Per ontvanger: wanneer de mail gepland staat en wanneer Resend iets meldde.
ALTER TABLE public.mailing_ontvangers
  ADD COLUMN IF NOT EXISTS gepland_op timestamptz,
  ADD COLUMN IF NOT EXISTS bijgewerkt_op timestamptz;

CREATE INDEX IF NOT EXISTS mailing_ontvangers_resend_idx
  ON public.mailing_ontvangers (resend_id);

-- Een adres dat Resend als onbestelbaar terugmeldt, krijgt geen mailingen
-- meer tot het is aangepast.
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS email_onbestelbaar_op timestamptz;

-- Wordt het e-mailadres aangepast, dan vervalt de markering vanzelf.
CREATE OR REPLACE FUNCTION public.clients_email_onbestelbaar_wissen()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    NEW.email_onbestelbaar_op := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS clients_email_onbestelbaar_wissen ON public.clients;
CREATE TRIGGER clients_email_onbestelbaar_wissen
BEFORE UPDATE OF email ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.clients_email_onbestelbaar_wissen();

-- Concepten bewaart het portaal zelf; versturen en inplannen blijft het werk
-- van de edge function send-mailing (service role). Admins mogen daarom
-- alleen mailingen met de status concept aanmaken, wijzigen en weggooien.
GRANT INSERT, UPDATE, DELETE ON public.mailings TO authenticated;

DROP POLICY IF EXISTS "Admins beheren conceptmailingen" ON public.mailings;
CREATE POLICY "Admins beheren conceptmailingen"
  ON public.mailings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND status = 'concept')
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND status = 'concept');
