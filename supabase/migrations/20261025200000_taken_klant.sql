-- Een taak kan bij een klant horen zonder dat die klant een project heeft.
-- Tot nu toe liep de koppeling alleen via het project, waardoor taken voor
-- klanten zonder project (zoals nabellen over een factuur of een offerte
-- factureren) onder "Intern, zonder klant" vielen.

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS tasks_client_id_idx ON public.tasks (client_id) WHERE client_id IS NOT NULL;

-- Bestaande taken die het portaal zelf aanmaakte (te herkennen aan
-- taak_signalen) en geen project hebben: de klant zoeken op naam in de
-- titel. Bij meerdere treffers wint de langste naam, de meest specifieke.
UPDATE public.tasks t
SET client_id = (
  SELECT c.id
  FROM public.clients c
  WHERE t.title ILIKE '%' || c.name || '%'
  ORDER BY char_length(c.name) DESC
  LIMIT 1
)
WHERE t.project_id IS NULL
  AND t.client_id IS NULL
  AND EXISTS (SELECT 1 FROM public.taak_signalen s WHERE s.task_id = t.id);
