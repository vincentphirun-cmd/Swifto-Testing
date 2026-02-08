-- Optional: track when completion emails were sent so we only send once
ALTER TABLE job_completions ADD COLUMN IF NOT EXISTS completion_emails_sent_at TIMESTAMPTZ;
