/*
Auth Trigger Setup
*/

-- Ensures QC Domain Enforcement
CREATE OR REPLACE FUNCTION public.enforce_qc_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Matches firstname.lastname##@[the three allowed domains]
  IF NEW.email !~* '^([a-z\-]+)\.([a-z\-]+)(\d+)@(qmail\.cuny\.edu|login\.cuny\.edu|stu-mail\.qc\.cuny\.edu)$' THEN
    RAISE EXCEPTION 'Only valid Queens College student email addresses can register.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_qc_email_domain ON auth.users;
CREATE TRIGGER enforce_qc_email_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_qc_email_domain();