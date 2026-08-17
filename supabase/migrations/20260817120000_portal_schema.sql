-- ===========================================
-- NIEUWBLIK INTERN PORTAAL
-- Klanten, projecten, taken, updates en bestanden.
--
-- Toegangsmodel: intern-only. Elke tabel is alleen leesbaar en
-- schrijfbaar voor ingelogde gebruikers met de rol 'admin'. De anon-rol
-- krijgt nergens rechten, ook niet als een RLS-policy ooit zou wegvallen.
-- ===========================================

-- -------------------------------------------
-- 1. Enums
-- -------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.client_status AS ENUM ('prospect', 'actief', 'inactief');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.project_status AS ENUM (
    'lead', 'offerte', 'in_ontwerp', 'in_bouw', 'review',
    'live', 'onderhoud', 'gepauzeerd', 'geannuleerd'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.task_status AS ENUM ('todo', 'bezig', 'wacht', 'klaar');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.priority_level AS ENUM ('laag', 'normaal', 'hoog', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.update_kind AS ENUM ('update', 'notitie', 'mijlpaal');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -------------------------------------------
-- 2. Gedeelde helpers
-- -------------------------------------------

-- Eén generieke updated_at-trigger voor alle portaaltabellen.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Weergavenaam zodat "toegewezen aan" een naam toont in plaats van een UUID.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Admins mogen elkaars profiel zien; anders blijft een collega naamloos.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins mogen hun eigen weergavenaam aanpassen (de bestaande policy uit de
-- eerste migratie dekt dit al voor de eigenaar van het profiel).

-- Er bestond nog geen automatisme dat een profielrij aanmaakt, waardoor
-- profiles leeg bleef en een collega niet te kiezen was bij "toegewezen aan".
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bestaande accounts alsnog een profiel geven.
INSERT INTO public.profiles (user_id, email)
SELECT id, email FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

/*
 * De collega's om werk aan toe te wijzen.
 *
 * user_roles laat een gebruiker alleen zijn eigen rollen zien, dus wie de
 * admins zijn is van de client af niet op te vragen. Deze functie doet dat
 * onder verhoogde rechten en filtert zelf op de aanroeper: zonder adminrol
 * levert hij niets op. Die WHERE is essentieel — SECURITY DEFINER zet RLS
 * opzij, dus zonder die regel zou elke ingelogde gebruiker de ledenlijst
 * kunnen opvragen.
 */
CREATE OR REPLACE FUNCTION public.admin_team()
RETURNS TABLE (user_id UUID, name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id,
         COALESCE(NULLIF(btrim(p.display_name), ''), p.email) AS name
  FROM public.profiles p
  JOIN public.user_roles r
    ON r.user_id = p.user_id AND r.role = 'admin'
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY 2;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_team() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_team() TO authenticated;

-- -------------------------------------------
-- 3. Klanten
-- -------------------------------------------

CREATE TABLE IF NOT EXISTS public.clients (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  contact_name  TEXT,
  email         TEXT,
  phone         TEXT,
  website       TEXT,
  city          TEXT,
  status        public.client_status NOT NULL DEFAULT 'actief',
  notes         TEXT,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT clients_name_length  CHECK (char_length(name) BETWEEN 1 AND 200),
  CONSTRAINT clients_email_length CHECK (email IS NULL OR char_length(email) <= 255),
  CONSTRAINT clients_notes_length CHECK (notes IS NULL OR char_length(notes) <= 10000)
);

CREATE INDEX IF NOT EXISTS clients_status_idx ON public.clients (status, name);

DROP TRIGGER IF EXISTS clients_set_updated_at ON public.clients;
CREATE TRIGGER clients_set_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------
-- 4. Projecten
-- -------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id       UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  status          public.project_status NOT NULL DEFAULT 'lead',
  priority        public.priority_level NOT NULL DEFAULT 'normaal',
  start_date      DATE,
  deadline        DATE,
  launched_on     DATE,
  live_url        TEXT,
  -- Koppeling naar de publieke portfoliopagina (src/data/projects.ts).
  portfolio_slug  TEXT UNIQUE,
  budget_cents    INTEGER CHECK (budget_cents IS NULL OR budget_cents >= 0),
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT projects_name_length        CHECK (char_length(name) BETWEEN 1 AND 200),
  CONSTRAINT projects_description_length CHECK (description IS NULL OR char_length(description) <= 10000)
);

CREATE INDEX IF NOT EXISTS projects_client_idx   ON public.projects (client_id);
CREATE INDEX IF NOT EXISTS projects_status_idx   ON public.projects (status, deadline NULLS LAST);
CREATE INDEX IF NOT EXISTS projects_deadline_idx ON public.projects (deadline) WHERE deadline IS NOT NULL;

DROP TRIGGER IF EXISTS projects_set_updated_at ON public.projects;
CREATE TRIGGER projects_set_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------
-- 5. Taken
-- -------------------------------------------

CREATE TABLE IF NOT EXISTS public.tasks (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Losse taken (zonder project) zijn toegestaan: project_id mag NULL zijn.
  project_id    UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  status        public.task_status NOT NULL DEFAULT 'todo',
  priority      public.priority_level NOT NULL DEFAULT 'normaal',
  due_date      DATE,
  assigned_to   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_at  TIMESTAMPTZ,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tasks_title_length       CHECK (char_length(title) BETWEEN 1 AND 300),
  CONSTRAINT tasks_description_length CHECK (description IS NULL OR char_length(description) <= 10000)
);

CREATE INDEX IF NOT EXISTS tasks_project_idx  ON public.tasks (project_id);
CREATE INDEX IF NOT EXISTS tasks_assignee_idx ON public.tasks (assigned_to, status);
CREATE INDEX IF NOT EXISTS tasks_open_idx     ON public.tasks (due_date NULLS LAST) WHERE status <> 'klaar';

-- completed_at volgt automatisch de status, zodat "afgerond op" nooit
-- uit de pas loopt met een handmatig gezette waarde.
CREATE OR REPLACE FUNCTION public.sync_task_completed_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'klaar' AND (TG_OP = 'INSERT' OR OLD.status <> 'klaar') THEN
    NEW.completed_at = now();
  ELSIF NEW.status <> 'klaar' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tasks_sync_completed_at ON public.tasks;
CREATE TRIGGER tasks_sync_completed_at
BEFORE INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.sync_task_completed_at();

DROP TRIGGER IF EXISTS tasks_set_updated_at ON public.tasks;
CREATE TRIGGER tasks_set_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------
-- 6. Updates en notities
-- -------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_updates (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  kind        public.update_kind NOT NULL DEFAULT 'update',
  body        TEXT NOT NULL,
  author_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT project_updates_body_length CHECK (char_length(body) BETWEEN 1 AND 10000)
);

CREATE INDEX IF NOT EXISTS project_updates_project_idx ON public.project_updates (project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS project_updates_recent_idx  ON public.project_updates (created_at DESC);

DROP TRIGGER IF EXISTS project_updates_set_updated_at ON public.project_updates;
CREATE TRIGGER project_updates_set_updated_at
BEFORE UPDATE ON public.project_updates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Statuswijzigingen belanden automatisch als mijlpaal in de tijdlijn, zodat
-- je collega de voortgang ziet zonder dat iemand het handmatig moet noteren.
CREATE OR REPLACE FUNCTION public.log_project_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.project_updates (project_id, kind, body, author_id)
    VALUES (
      NEW.id,
      'mijlpaal',
      'Status gewijzigd van ' || OLD.status::text || ' naar ' || NEW.status::text,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_log_status_change ON public.projects;
CREATE TRIGGER projects_log_status_change
AFTER UPDATE OF status ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.log_project_status_change();

-- -------------------------------------------
-- 7. Bestanden (metadata; de bytes staan in Storage)
-- -------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_files (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id    UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL UNIQUE,
  file_name     TEXT NOT NULL,
  file_size     BIGINT,
  mime_type     TEXT,
  uploaded_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT project_files_name_length CHECK (char_length(file_name) BETWEEN 1 AND 300)
);

CREATE INDEX IF NOT EXISTS project_files_project_idx ON public.project_files (project_id, created_at DESC);

-- -------------------------------------------
-- 8. Row Level Security
-- -------------------------------------------

ALTER TABLE public.clients         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files   ENABLE ROW LEVEL SECURITY;

-- Eén policy per tabel die alle vier de operaties dekt: alleen admins,
-- alleen authenticated. De anon-rol matcht nergens.

DROP POLICY IF EXISTS "Admins manage clients" ON public.clients;
CREATE POLICY "Admins manage clients"
ON public.clients FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;
CREATE POLICY "Admins manage projects"
ON public.projects FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage tasks" ON public.tasks;
CREATE POLICY "Admins manage tasks"
ON public.tasks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage project_updates" ON public.project_updates;
CREATE POLICY "Admins manage project_updates"
ON public.project_updates FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage project_files" ON public.project_files;
CREATE POLICY "Admins manage project_files"
ON public.project_files FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Grants: alleen authenticated. anon krijgt niets, ook niet via Supabase'
-- standaard default-privileges op het public schema.

REVOKE ALL ON public.clients, public.projects, public.tasks,
              public.project_updates, public.project_files
  FROM anon, PUBLIC;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.clients, public.projects, public.tasks,
     public.project_updates, public.project_files
  TO authenticated;

GRANT ALL ON public.clients, public.projects, public.tasks,
             public.project_updates, public.project_files
  TO service_role;

-- -------------------------------------------
-- 9. Storage: private bucket voor projectbestanden
-- -------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('project-files', 'project-files', false, 52428800)  -- 50 MB
ON CONFLICT (id) DO UPDATE
  SET public = false,
      file_size_limit = EXCLUDED.file_size_limit;

DROP POLICY IF EXISTS "Admins read project files"   ON storage.objects;
DROP POLICY IF EXISTS "Admins upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Admins update project files" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete project files" ON storage.objects;

CREATE POLICY "Admins read project files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'project-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins upload project files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update project files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'project-files' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'project-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete project files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project-files' AND public.has_role(auth.uid(), 'admin'));
