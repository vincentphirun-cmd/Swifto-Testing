-- Backfill profiles.rating from job_completions (run after rating triggers exist).
-- UI reads live averages from job_completions; this keeps profiles.rating in sync for reporting.

UPDATE profiles p
SET rating = sub.avg_rating
FROM (
  SELECT student_id AS id, ROUND(AVG(rating_from_lister)::numeric, 2) AS avg_rating
  FROM job_completions
  WHERE rating_from_lister IS NOT NULL
  GROUP BY student_id
) sub
WHERE p.id = sub.id AND p.role = 'student';

UPDATE profiles p
SET rating = sub.avg_rating
FROM (
  SELECT lister_id AS id, ROUND(AVG(rating_from_student)::numeric, 2) AS avg_rating
  FROM job_completions
  WHERE rating_from_student IS NOT NULL
  GROUP BY lister_id
) sub
WHERE p.id = sub.id AND p.role = 'lister';

-- Students/listers with no reviews stay at 0
