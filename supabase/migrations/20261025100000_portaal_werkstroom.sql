-- Het portaal als dagelijkse startplek: aanvragen van de website, taken die
-- het portaal zelf aanmaakt, herhalende taken en websitebewaking.

-- ---------------------------------------------------------------------------
-- Aanvragen: elk bericht via het contactformulier van de site. De edge
-- function send-contact-email schrijft ze weg (service role); in het portaal
-- volg je ze op van nieuw tot gewonnen of verloren.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.aanvragen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naam text NOT NULL,
  bedrijf text,
  email text NOT NULL,
  telefoon text,
  onderwerp text,
  bericht text,
  status text NOT NULL DEFAULT 'nieuw',
  notitie text,
  client_id uuid REFERENCES public.clients (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT aanvragen_status_geldig CHECK (status IN ('nieuw', 'contact', 'offerte', 'gewonnen', 'verloren')),
  CONSTRAINT aanvragen_notitie_lengte CHECK (notitie IS NULL OR char_length(notitie) <= 4000)
);

CREATE INDEX IF NOT EXISTS aanvragen_created_idx ON public.aanvragen (created_at DESC);

DROP TRIGGER IF EXISTS aanvragen_set_updated_at ON public.aanvragen;
CREATE TRIGGER aanvragen_set_updated_at
BEFORE UPDATE ON public.aanvragen
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Automatische taken: welke signalen (btw-deadline, geaccepteerde offerte,
-- factuur die lang openstaat) al een taak hebben gekregen. Zo komt dezelfde
-- taak nooit twee keer, ook niet als je hem hebt verwijderd.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taak_signalen (
  sleutel text PRIMARY KEY,
  task_id uuid REFERENCES public.tasks (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Herhalende taken: bij afronden komt de volgende vanzelf.
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS herhaling text;

ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS tasks_herhaling_geldig;
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_herhaling_geldig CHECK (herhaling IS NULL OR herhaling IN ('wekelijks', 'maandelijks', 'kwartaal', 'jaarlijks'));

-- ---------------------------------------------------------------------------
-- Websitebewaking: per controle of de live site bereikbaar was, hoe snel,
-- en tot wanneer het SSL-certificaat en de domeinnaam geldig zijn.
-- De edge function website-controle schrijft (service role).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_controles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  url text NOT NULL,
  online boolean NOT NULL,
  status_code integer,
  laadtijd_ms integer,
  ssl_geldig_tot timestamptz,
  domein_geldig_tot timestamptz,
  fout text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS website_controles_project_idx
  ON public.website_controles (project_id, created_at DESC);

-- Rechten: admins lezen en schrijven via het portaal; de edge functions
-- schrijven als service_role.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aanvragen, public.taak_signalen TO authenticated;
GRANT SELECT ON public.website_controles TO authenticated;
GRANT ALL ON public.aanvragen, public.taak_signalen, public.website_controles TO service_role;

ALTER TABLE public.aanvragen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taak_signalen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_controles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins beheren aanvragen" ON public.aanvragen;
CREATE POLICY "Admins beheren aanvragen"
  ON public.aanvragen FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins beheren taaksignalen" ON public.taak_signalen;
CREATE POLICY "Admins beheren taaksignalen"
  ON public.taak_signalen FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins lezen websitecontroles" ON public.website_controles;
CREATE POLICY "Admins lezen websitecontroles"
  ON public.website_controles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
