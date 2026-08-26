-- Bijhouden welke sites op TanStack draaien.
--
-- Bij onderhoud en bij een verhuizing moet je weten waar een site op gebouwd
-- is, en dat zat nergens vast. Een vinkje per project is genoeg: het is React
-- tenzij het TanStack is.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS built_with_tanstack BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.projects.built_with_tanstack IS
  'Aangevinkt wanneer de site op TanStack is gebouwd; zonder vinkje op React.';

-- PostgREST houdt het schema in een cache. Zonder deze melding blijft hij
-- "Could not find the built_with_tanstack column" geven tot hij zichzelf
-- ververst.
NOTIFY pgrst, 'reload schema';
