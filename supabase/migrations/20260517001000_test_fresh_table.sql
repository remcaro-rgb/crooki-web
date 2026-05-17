-- TEMP — fresh sentinel table to test if anon insert with permissive RLS
-- works elsewhere in this project.

CREATE TABLE IF NOT EXISTS rls_test_sentinel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rls_test_sentinel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sentinel anon insert" ON rls_test_sentinel;
CREATE POLICY "sentinel anon insert" ON rls_test_sentinel
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
