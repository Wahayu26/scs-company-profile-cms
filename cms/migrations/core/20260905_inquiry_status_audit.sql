BEGIN;

CREATE TABLE IF NOT EXISTS inquiry_status_history (
  id BIGSERIAL PRIMARY KEY,
  inquiry_public_reference TEXT NOT NULL,
  from_status VARCHAR(32),
  to_status VARCHAR(32) NOT NULL CHECK (to_status IN ('RECEIVED', 'IN_PROGRESS', 'CONTACTED', 'CLOSED')),
  changed_by_user_id TEXT,
  changed_by_name TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiry_status_history_reference_changed_at_idx
  ON inquiry_status_history (inquiry_public_reference, changed_at DESC);

INSERT INTO inquiry_status_history (
  inquiry_public_reference,
  from_status,
  to_status,
  changed_by_user_id,
  changed_by_name,
  changed_at
)
SELECT
  i.public_reference,
  NULL,
  i.status,
  NULL,
  'System migration',
  i.created_at
FROM inquiries i
WHERE NOT EXISTS (
  SELECT 1
  FROM inquiry_status_history h
  WHERE h.inquiry_public_reference = i.public_reference
);

COMMIT;
