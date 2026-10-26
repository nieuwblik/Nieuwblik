-- De websitecontrole twee keer per dag vanzelf, ook als niemand het portaal
-- opent. Tot nu toe draaide hij alleen bij het openen van het portaal (als de
-- laatste controle ouder was dan twintig uur), waardoor een site die 's nachts
-- of in het weekend plat ging pas laat opviel.
--
-- pg_cron plant, pg_net doet de aanroep, met de publieke anon-sleutel (die
-- staat ook openbaar in de site). De functie website-controle ziet een token
-- zonder gebruiker als geplande controle: hij controleert alles, geeft niets
-- terug en doet niets als de laatste controle minder dan 30 minuten oud is.
-- De JWT-controle van de functie blijft gewoon aan. Geheime sleutels staan
-- hier dus niet in.
--
-- Tijden in UTC: 7:00 en 15:00 is 8:00 en 16:00 in de wintertijd, 9:00 en
-- 17:00 in de zomertijd.

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Opnieuw uitvoeren mag: een bestaande planning met dezelfde naam gaat eerst weg.
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'websitecontrole';

SELECT cron.schedule(
  'websitecontrole',
  '0 7,15 * * *',
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
