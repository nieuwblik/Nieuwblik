-- Websites elk uur controleren, pushmeldingen voor de portaal-app, en de
-- controles niet eindeloos bewaren.
--
-- Vervangt de planning van twee keer per dag (20261026140000) door elk uur,
-- vijf minuten over. Zelfde aanroep: de publieke anon-sleutel (die staat ook
-- openbaar in de site), de JWT-controle van de functie blijft aan. Het
-- certificaat en de domeinnaam vraagt de functie maar één keer per dag op.

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'websitecontrole';

SELECT cron.schedule(
  'websitecontrole',
  '5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://rkpfgiaxumwdidpfkqpp.supabase.co/functions/v1/website-controle',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcGZnaWF4dW13ZGlkcGZrcXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjIzNzIsImV4cCI6MjA3ODEzODM3Mn0.KY3KR3rWJ6YwM9bMFkfd_AyT0bJYTN9Fg7ATeIrArDI',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcGZnaWF4dW13ZGlkcGZrcXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjIzNzIsImV4cCI6MjA3ODEzODM3Mn0.KY3KR3rWJ6YwM9bMFkfd_AyT0bJYTN9Fg7ATeIrArDI'
    ),
    body := '{"gepland": true}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);

-- Elk uur een regel per site loopt op; na 90 dagen gaat hij weg.
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'websitecontrole-opruimen';

SELECT cron.schedule(
  'websitecontrole-opruimen',
  '30 3 * * *',
  $$ DELETE FROM public.website_controles WHERE created_at < now() - interval '90 days'; $$
);

-- ---------------------------------------------------------------------------
-- Pushmeldingen: per apparaat waarop een admin ze heeft aangezet het
-- abonnement van de browser (endpoint en sleutels). De functie
-- website-controle stuurt er een melding naartoe als een site offline gaat
-- of weer online komt; verlopen abonnementen ruimt die zelf op.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_abonnementen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  apparaat text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT push_abonnementen_endpoint_lengte CHECK (char_length(endpoint) <= 1000),
  CONSTRAINT push_abonnementen_apparaat_lengte CHECK (apparaat IS NULL OR char_length(apparaat) <= 100)
);

CREATE INDEX IF NOT EXISTS push_abonnementen_user_idx ON public.push_abonnementen (user_id);

ALTER TABLE public.push_abonnementen ENABLE ROW LEVEL SECURITY;

-- Een admin ziet en beheert alleen de eigen apparaten.
DROP POLICY IF EXISTS "Admins beheren hun eigen pushabonnementen" ON public.push_abonnementen;
CREATE POLICY "Admins beheren hun eigen pushabonnementen"
  ON public.push_abonnementen
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.push_abonnementen FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_abonnementen TO authenticated;
