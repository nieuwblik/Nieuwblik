-- Uren direct bij een klant, zonder project: een mail beantwoorden, een
-- belletje, een kleine wijziging. Tot nu toe liep de klant van een
-- urenregel alleen via het project, en uren zonder project konden daardoor
-- niet gefactureerd worden.

ALTER TABLE public.time_entries
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS time_entries_client_id_idx ON public.time_entries (client_id) WHERE client_id IS NOT NULL;

-- Bestaande uren met een project krijgen de klant van dat project.
UPDATE public.time_entries t
SET client_id = p.client_id
FROM public.projects p
WHERE t.project_id = p.id
  AND p.client_id IS NOT NULL
  AND t.client_id IS NULL;

-- Heeft een regel een project, dan is de klant die van het project. Zo kan
-- de klant van een regel nooit afwijken van zijn project, en hoeft het
-- portaal hem bij projecturen niet zelf mee te sturen.
CREATE OR REPLACE FUNCTION public.uren_klant_van_project()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.project_id IS NOT NULL THEN
    SELECT COALESCE(p.client_id, NEW.client_id) INTO NEW.client_id
    FROM public.projects p
    WHERE p.id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS time_entries_klant_van_project ON public.time_entries;
CREATE TRIGGER time_entries_klant_van_project
  BEFORE INSERT OR UPDATE OF project_id, client_id ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.uren_klant_van_project();

-- Gaat een project naar een andere klant, dan gaan zijn uren mee.
CREATE OR REPLACE FUNCTION public.uren_volgen_projectklant()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.time_entries SET client_id = NEW.client_id WHERE project_id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_uren_volgen_klant ON public.projects;
CREATE TRIGGER projects_uren_volgen_klant
  AFTER UPDATE OF client_id ON public.projects
  FOR EACH ROW
  WHEN (NEW.client_id IS NOT NULL AND NEW.client_id IS DISTINCT FROM OLD.client_id)
  EXECUTE FUNCTION public.uren_volgen_projectklant();
