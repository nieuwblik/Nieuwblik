-- Mailingen naar klanten vanuit het dashboard (pagina "Mailen").
--
-- Elke klant krijgt een eigen afmeldtoken. Wie zich afmeldt via de link in de
-- mail, krijgt een datum in mail_afgemeld_op en wordt daarna overgeslagen.

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS mail_afmeld_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS mail_afgemeld_op timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS clients_mail_afmeld_token_idx
  ON public.clients (mail_afmeld_token);

-- Eén regel per verzending, met per ontvanger een eigen regel, zodat je later
-- kunt terugzien wie welke mail heeft gehad.
CREATE TABLE IF NOT EXISTS public.mailings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onderwerp text NOT NULL,
  tekst text NOT NULL,
  statussen text[] NOT NULL DEFAULT '{}',
  aantal_ontvangers integer NOT NULL DEFAULT 0,
  aantal_mislukt integer NOT NULL DEFAULT 0,
  verstuurd_door uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mailing_ontvangers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mailing_id uuid NOT NULL REFERENCES public.mailings (id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients (id) ON DELETE SET NULL,
  email text NOT NULL,
  naam text,
  status text NOT NULL DEFAULT 'verstuurd',
  fout text,
  resend_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mailing_ontvangers_mailing_idx
  ON public.mailing_ontvangers (mailing_id);

-- Expliciete tabelrechten. Ingelogde gebruikers mogen lezen (de RLS-policies
-- hieronder beperken dat tot admins); de edge function schrijft als service_role.
GRANT SELECT ON public.mailings, public.mailing_ontvangers TO authenticated;
GRANT ALL ON public.mailings, public.mailing_ontvangers TO service_role;

ALTER TABLE public.mailings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailing_ontvangers ENABLE ROW LEVEL SECURITY;

-- Alleen admins mogen lezen. Schrijven gebeurt uitsluitend door de
-- edge function send-mailing (service role), dus daar is geen policy voor.
CREATE POLICY "Admins lezen mailingen"
  ON public.mailings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins lezen mailingontvangers"
  ON public.mailing_ontvangers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Afmelden via de link in de mail: de bezoeker heeft geen account, alleen het
-- token. Deze functie zet uitsluitend de afmelddatum voor dat ene token.
CREATE OR REPLACE FUNCTION public.mail_afmelden(_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n integer;
BEGIN
  UPDATE public.clients
     SET mail_afgemeld_op = COALESCE(mail_afgemeld_op, now())
   WHERE mail_afmeld_token = _token;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.mail_afmelden(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mail_afmelden(uuid) TO anon, authenticated;
