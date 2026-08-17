ALTER TABLE jobs
DROP CONSTRAINT IF EXISTS jobs_platform_external_job_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS
idx_jobs_platform_external_job_id_unique
ON jobs (
  LOWER(platform),
  external_job_id
)
WHERE external_job_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS
idx_jobs_company_title_platform_url_unique
ON jobs (
  company_id,
  LOWER(title),
  LOWER(platform),
  url
)
WHERE external_job_id IS NULL;