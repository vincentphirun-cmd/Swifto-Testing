-- Prevent changing identity fields on profiles after they are set at signup.

CREATE OR REPLACE FUNCTION prevent_profile_identity_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.first_name IS NOT NULL AND btrim(OLD.first_name) <> '' AND NEW.first_name IS DISTINCT FROM OLD.first_name THEN
    RAISE EXCEPTION 'first_name cannot be changed after signup';
  END IF;

  IF OLD.last_name IS NOT NULL AND btrim(OLD.last_name) <> '' AND NEW.last_name IS DISTINCT FROM OLD.last_name THEN
    RAISE EXCEPTION 'last_name cannot be changed after signup';
  END IF;

  IF OLD.university IS NOT NULL AND btrim(OLD.university) <> '' AND NEW.university IS DISTINCT FROM OLD.university THEN
    RAISE EXCEPTION 'university cannot be changed after signup';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_prevent_profile_identity_changes ON profiles;

CREATE TRIGGER trigger_prevent_profile_identity_changes
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_profile_identity_changes();
