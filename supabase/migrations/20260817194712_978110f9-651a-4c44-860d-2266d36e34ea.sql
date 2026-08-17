-- ===========================================
-- BIJLAGEN BIJ TAKEN
--
-- Foto's die bij een taak horen: een screenshot van wat er mis is, een foto
-- van hoe het moet worden. Hangt aan de taak en niet aan het project, zodat
-- het bij het werk blijft staan waar het over gaat.
--
-- Gebruikt dezelfde private bucket 'project-files' als de projectbestanden,
-- onder het pad taken/<task_id>/. De storage-policies daarop gelden per
-- bucket, dus er zijn geen nieuwe nodig.
-- ===========================================

CREATE TABLE IF NOT EXISTS public.task_files (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id       UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL UNIQUE,
  file_name     TEXT NOT NULL,
  file_size     BIGINT,
  mime_type     TEXT,
  width         INTEGER,
  height        INTEGER,
  uploaded_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT task_files_name_length CHECK (char_length(file_name) BETWEEN 1 AND 300)
);

CREATE INDEX IF NOT EXISTS task_files_task_idx ON public.task_files (task_id, created_at);

ALTER TABLE public.task_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage task_files" ON public.task_files;
CREATE POLICY "Admins manage task_files"
ON public.task_files FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.task_files FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_files TO authenticated;
GRANT ALL ON public.task_files TO service_role;