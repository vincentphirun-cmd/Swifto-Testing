-- Average lister rating from student reviews on completed jobs.

CREATE OR REPLACE FUNCTION update_lister_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE profiles
  SET rating = (
    SELECT COALESCE(AVG(rating_from_student), 0)
    FROM job_completions
    WHERE lister_id = NEW.lister_id AND rating_from_student IS NOT NULL
  )
  WHERE id = NEW.lister_id AND role = 'lister';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_lister_rating ON job_completions;

CREATE TRIGGER trigger_update_lister_rating
  AFTER INSERT OR UPDATE OF rating_from_student ON job_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_lister_rating();
