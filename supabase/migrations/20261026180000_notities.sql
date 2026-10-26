-- Notities: korte aantekeningen in het portaal, los of bij een klant. Gedeeld
-- tussen admins, net als taken. Van een notitie (of een stuk ervan) kan een
-- taak gemaakt worden; die taak wordt bij de notitie bewaard.

CREATE TABLE IF NOT EXISTS public.notities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titel text NOT NULL DEFAULT '',
  inhoud text NOT NULL DEFAULT '',
  client_id uuid REFERENCES public.clients (id) ON DELETE SET NULL,
  vastgezet boolean NOT NULL DEFAULT false,
  -- De laatste taak die van deze notitie is gemaakt.
  task_id uuid REFERENCES public.tasks (id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notities_titel_lengte CHECK (char_length(titel) <= 200),
  CONSTRAINT notities_inhoud_lengte CHECK (char_length(inhoud) <= 50000)
);

CREATE INDEX IF NOT EXISTS notities_updated_idx ON public.notities (updated_at DESC);
CREATE INDEX IF NOT EXISTS notities_client_idx ON public.notities (client_id) WHERE client_id IS NOT NULL;

-- Bij elke wijziging de tijd bijwerken, zodat de lijst op "laatst bewerkt" sorteert.
CREATE OR REPLACE FUNCTION public.notities_bijgewerkt()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notities_bijgewerkt ON public.notities;
CREATE TRIGGER notities_bijgewerkt
  BEFORE UPDATE ON public.notities
  FOR EACH ROW EXECUTE FUNCTION public.notities_bijgewerkt();

ALTER TABLE public.notities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins beheren notities" ON public.notities;
CREATE POLICY "Admins beheren notities"
  ON public.notities
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.notities FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notities TO authenticated;
