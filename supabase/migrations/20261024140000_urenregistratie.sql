-- Urenregistratie in het portaal (pagina "Uren", timer in de bovenbalk).
--
-- Eén regel per blok gewerkte tijd: wie, wanneer, waaraan. Een lopende timer
-- is een regel zonder eindtijd; per persoon kan er maar één tegelijk lopen.
-- De duur wordt niet opgeslagen maar uit begin en eind gerekend, zodat die
-- twee nooit uit elkaar kunnen lopen.

CREATE TABLE IF NOT EXISTS public.time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects (id) ON DELETE SET NULL,
  task_id uuid REFERENCES public.tasks (id) ON DELETE SET NULL,
  description text,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  billable boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT time_entries_einde_na_begin CHECK (ended_at IS NULL OR ended_at > started_at),
  CONSTRAINT time_entries_description_length CHECK (description IS NULL OR char_length(description) <= 500)
);

CREATE INDEX IF NOT EXISTS time_entries_started_idx ON public.time_entries (started_at DESC);
CREATE INDEX IF NOT EXISTS time_entries_project_idx ON public.time_entries (project_id);
CREATE INDEX IF NOT EXISTS time_entries_task_idx ON public.time_entries (task_id);

-- Hooguit één lopende timer per persoon.
CREATE UNIQUE INDEX IF NOT EXISTS time_entries_een_lopende_timer
  ON public.time_entries (user_id) WHERE ended_at IS NULL;

DROP TRIGGER IF EXISTS time_entries_set_updated_at ON public.time_entries;
CREATE TRIGGER time_entries_set_updated_at
BEFORE UPDATE ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Zelfde rechten als de andere portaaltabellen: alleen admins, via RLS.
REVOKE ALL ON public.time_entries FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_entries TO authenticated;
GRANT ALL ON public.time_entries TO service_role;

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage time_entries" ON public.time_entries;
CREATE POLICY "Admins manage time_entries"
ON public.time_entries FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
