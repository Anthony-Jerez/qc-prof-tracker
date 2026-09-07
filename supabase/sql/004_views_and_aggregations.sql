/*
Views & Aggregations
*/

-- term_sort_key(term) — "Fall 2025" -> a sortable integer.
CREATE OR REPLACE FUNCTION public.term_sort_key(term TEXT)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (SPLIT_PART(term, ' ', 2))::INT * 10
    + CASE SPLIT_PART(term, ' ', 1)
        WHEN 'Winter' THEN 0
        WHEN 'Spring' THEN 1
        WHEN 'Summer' THEN 2
        WHEN 'Fall' THEN 3
        ELSE 0
      END
$$;

GRANT EXECUTE ON FUNCTION public.term_sort_key(TEXT) TO anon, authenticated;
ALTER FUNCTION public.term_sort_key(TEXT) SET search_path = public;

-- Materialized Views: Course & Term Stats
-- Manual Refresh Required After Inserting New Grade Data: REFRESH MATERIALIZED VIEW public.[view_name];

-- Used for Course Dashboard Page
DROP MATERIALIZED VIEW IF EXISTS public.course_term_stats;
CREATE MATERIALIZED VIEW public.course_term_stats AS
SELECT
  gd.prof_name,
  gd.course_subject,
  gd.course_number,
  gd.term,
  public.term_sort_key(gd.term) AS term_sort,
  SUM(gd.total_enrollment)::INT AS total_enrollment,
  SUM(gd.a_plus)::INT AS a_plus,
  SUM(gd.a)::INT AS a,
  SUM(gd.a_minus)::INT AS a_minus,
  SUM(gd.b_plus)::INT AS b_plus,
  SUM(gd.b)::INT AS b,
  SUM(gd.b_minus)::INT AS b_minus,
  SUM(gd.c_plus)::INT AS c_plus,
  SUM(gd.c)::INT AS c,
  SUM(gd.c_minus)::INT AS c_minus,
  SUM(gd.d_plus)::INT AS d_plus,
  SUM(gd.d)::INT AS d,
  SUM(gd.f)::INT AS f,
  SUM(gd.w)::INT AS w,
  SUM(gd.inc)::INT AS inc,
  CASE 
    WHEN SUM(gd.total_enrollment) FILTER (WHERE gd.avg_gpa IS NOT NULL) > 0 
    THEN SUM(gd.avg_gpa * gd.total_enrollment) / SUM(gd.total_enrollment) FILTER (WHERE gd.avg_gpa IS NOT NULL) 
    ELSE NULL 
  END AS avg_gpa,
  CASE 
    WHEN SUM(gd.total_enrollment) > 0 
    THEN SUM(gd.w)::NUMERIC / SUM(gd.total_enrollment) 
    ELSE NULL 
  END AS withdrawal_rate
FROM public.grade_distributions gd
GROUP BY gd.prof_name, gd.course_subject, gd.course_number, gd.term;

GRANT SELECT ON public.course_term_stats TO anon, authenticated;

-- Used for Courses Grid in Professor Profile Page
DROP MATERIALIZED VIEW IF EXISTS public.course_overview;
CREATE MATERIALIZED VIEW public.course_overview AS
WITH agg AS (
  SELECT
    prof_name,
    course_subject,
    course_number,
    SUM(total_enrollment)::INT AS total_enrollment,
    CASE 
      WHEN SUM(total_enrollment) FILTER (WHERE avg_gpa IS NOT NULL) > 0 
      THEN SUM(avg_gpa * total_enrollment) / SUM(total_enrollment) FILTER (WHERE avg_gpa IS NOT NULL) 
      ELSE NULL 
    END AS avg_gpa,
    CASE 
      WHEN SUM(total_enrollment) > 0 
      THEN SUM(w)::NUMERIC / SUM(total_enrollment) 
      ELSE NULL 
    END AS withdrawal_rate
  FROM public.grade_distributions
  GROUP BY prof_name, course_subject, course_number
),
latest AS (
  SELECT DISTINCT ON (prof_name, course_subject, course_number)
    prof_name, course_subject, course_number, course_name, term AS last_term
  FROM public.grade_distributions
  ORDER BY prof_name, course_subject, course_number, public.term_sort_key(term) DESC
)
SELECT
  agg.prof_name,
  agg.course_subject,
  agg.course_number,
  latest.course_name,
  latest.last_term,
  agg.total_enrollment,
  agg.avg_gpa,
  agg.withdrawal_rate
FROM agg
JOIN latest USING (prof_name, course_subject, course_number);

GRANT SELECT ON public.course_overview TO anon, authenticated;

-- Used for Global Stats Section in Professor Profile Page
DROP MATERIALIZED VIEW IF EXISTS public.professor_overview;
CREATE MATERIALIZED VIEW public.professor_overview AS
SELECT
  prof_name,
  SUM(total_enrollment)::INT AS total_enrollment,
  CASE 
    WHEN SUM(total_enrollment) FILTER (WHERE avg_gpa IS NOT NULL) > 0 
    THEN SUM(avg_gpa * total_enrollment) / SUM(total_enrollment) FILTER (WHERE avg_gpa IS NOT NULL) 
    ELSE NULL 
  END AS avg_gpa,
  CASE 
    WHEN SUM(total_enrollment) > 0 
    THEN SUM(w)::NUMERIC / SUM(total_enrollment) 
    ELSE NULL 
  END AS withdrawal_rate
FROM public.grade_distributions
GROUP BY prof_name;

GRANT SELECT ON public.professor_overview TO anon, authenticated;

-- Standard Views: Professor Ratings
-- Provides real-time professor rating averages from the reviews table (global and course level). Recomputes on every query.

CREATE OR REPLACE VIEW public.professor_rating AS
SELECT
  prof_name,
  AVG(rating)::NUMERIC AS avg_rating,
  COUNT(*)::INT AS rating_count
FROM public.reviews
GROUP BY prof_name;

GRANT SELECT ON public.professor_rating TO anon, authenticated;
ALTER VIEW public.professor_rating SET (security_invoker = TRUE);

CREATE OR REPLACE VIEW public.course_rating AS
SELECT
  prof_name,
  course_subject,
  course_number,
  AVG(rating)::NUMERIC AS avg_rating,
  COUNT(*)::INT AS rating_count
FROM public.reviews
GROUP BY prof_name, course_subject, course_number;

GRANT SELECT ON public.course_rating TO anon, authenticated;
ALTER VIEW public.course_rating SET (security_invoker = TRUE);