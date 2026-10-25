-- Klanten verbergen: weg uit de klantenlijst en het dashboard, zonder ze te
-- verwijderen. Los van de status "inactief", die Mailen gebruikt voor
-- oud-klanten die nog post mogen krijgen.

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS verborgen_op timestamptz;
