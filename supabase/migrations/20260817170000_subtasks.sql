-- ===========================================
-- SUBTAKEN
--
-- Een taak kan uit meerdere stappen bestaan ("homepage herzien" = koptekst,
-- foto's, formulier). Die stappen hangen als taak onder een taak, zodat ze
-- hun eigen status, deadline en foto's kunnen hebben.
--
-- Eén niveau diep is genoeg: de lijsten tonen een taak met zijn stappen
-- eronder, en een boom van willekeurige diepte zou dat onleesbaar maken.
-- Dat wordt hieronder ook afgedwongen.
-- ===========================================

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS tasks_parent_idx ON public.tasks (parent_task_id) WHERE parent_task_id IS NOT NULL;

/*
 * Bewaakt twee dingen die anders stilletjes misgaan:
 *  - een taak die zichzelf als ouder krijgt;
 *  - een subtaak onder een subtaak, waardoor de lijst niet meer klopt.
 */
CREATE OR REPLACE FUNCTION public.check_task_parent()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.parent_task_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.parent_task_id = NEW.id THEN
    RAISE EXCEPTION 'Een taak kan niet zijn eigen subtaak zijn';
  END IF;

  IF EXISTS (SELECT 1 FROM public.tasks WHERE id = NEW.parent_task_id AND parent_task_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Subtaken kunnen niet dieper dan één niveau genest worden';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tasks_check_parent ON public.tasks;
CREATE TRIGGER tasks_check_parent
BEFORE INSERT OR UPDATE OF parent_task_id ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.check_task_parent();
