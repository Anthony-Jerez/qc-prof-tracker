/* 
Frontend RPCs
*/

-- Safely drop old functions to allow parameter renaming
DROP FUNCTION IF EXISTS public.get_professor_overview(TEXT);
DROP FUNCTION IF EXISTS public.get_professor_courses(TEXT);
DROP FUNCTION IF EXISTS public.get_course_dashboard(TEXT, TEXT, TEXT);

-- Bundles view data (grades + ratings) into single JSONB objects to 
-- prevent multiple network round trips from the React client.
CREATE OR REPLACE FUNCTION public.get_professor_overview(p_prof_name TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT JSONB_BUILD_OBJECT(
    'prof_name', po.prof_name,
    'avg_gpa', po.avg_gpa,
    'withdrawal_rate', po.withdrawal_rate,
    'total_enrollment', po.total_enrollment,
    'rating', pr.avg_rating,
    'rating_count', COALESCE(pr.rating_count, 0)
  )
  FROM public.professor_overview po
  LEFT JOIN public.professor_rating pr ON pr.prof_name = po.prof_name
  WHERE po.prof_name = p_prof_name;
$$;

GRANT EXECUTE ON FUNCTION public.get_professor_overview(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_professor_courses(p_prof_name TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'course_subject', co.course_subject,
      'course_number', co.course_number,
      'course_name', co.course_name,
      'avg_gpa', co.avg_gpa,
      'withdrawal_rate', co.withdrawal_rate,
      'total_enrollment', co.total_enrollment,
      'last_term', co.last_term,
      'rating', cr.avg_rating,
      'rating_count', COALESCE(cr.rating_count, 0)
    )
    ORDER BY co.course_subject, co.course_number
  ), '[]'::JSONB)
  FROM public.course_overview co
  LEFT JOIN public.course_rating cr
    ON cr.prof_name = co.prof_name AND cr.course_subject = co.course_subject AND cr.course_number = co.course_number
  WHERE co.prof_name = p_prof_name;
$$;

GRANT EXECUTE ON FUNCTION public.get_professor_courses(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_course_dashboard(p_prof_name TEXT, p_course_subject TEXT, p_course_number TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT JSONB_BUILD_OBJECT(
    'course_name', co.course_name,
    'avg_gpa', co.avg_gpa,
    'withdrawal_rate', co.withdrawal_rate,
    'total_enrollment', co.total_enrollment,
    'last_term', co.last_term,
    'rating', cr.avg_rating,
    'rating_count', COALESCE(cr.rating_count, 0),
    'terms', (
      SELECT COALESCE(JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'term', cts.term,
          'term_sort', cts.term_sort,
          'total_enrollment', cts.total_enrollment,
          'avg_gpa', cts.avg_gpa,
          'withdrawal_rate', cts.withdrawal_rate,
          'a_plus', cts.a_plus, 'a', cts.a, 'a_minus', cts.a_minus,
          'b_plus', cts.b_plus, 'b', cts.b, 'b_minus', cts.b_minus,
          'c_plus', cts.c_plus, 'c', cts.c, 'c_minus', cts.c_minus,
          'd_plus', cts.d_plus, 'd', cts.d,
          'f', cts.f, 'w', cts.w, 'inc', cts.inc
        )
        ORDER BY cts.term_sort
      ), '[]'::JSONB)
      FROM public.course_term_stats cts
      WHERE cts.prof_name = p_prof_name AND cts.course_subject = p_course_subject AND cts.course_number = p_course_number
    )
  )
  FROM public.course_overview co
  LEFT JOIN public.course_rating cr
    ON cr.prof_name = co.prof_name AND cr.course_subject = co.course_subject AND cr.course_number = co.course_number
  WHERE co.prof_name = p_prof_name AND co.course_subject = p_course_subject AND co.course_number = p_course_number;
$$;

GRANT EXECUTE ON FUNCTION public.get_course_dashboard(TEXT, TEXT, TEXT) TO anon, authenticated;

-- User Mutation: Allows logged-in users to delete their accounts.
CREATE OR REPLACE FUNCTION delete_user()
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM auth.users WHERE id = auth.uid();
$$;

-- Explicitly grant access ONLY to logged-in users
REVOKE EXECUTE ON FUNCTION delete_user FROM public;
GRANT EXECUTE ON FUNCTION delete_user TO authenticated;