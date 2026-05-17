-- Try the policy with TO PUBLIC and WITH CHECK that uses auth.role() directly,
-- and a fallback using current_user. If WITH CHECK evaluates to true for the
-- runtime context, insert should succeed.

DROP POLICY IF EXISTS "Orders insert" ON orders;
CREATE POLICY "Orders insert" ON orders
  FOR INSERT
  TO PUBLIC
  WITH CHECK (
    auth.role() IN ('anon', 'authenticated', 'service_role')
    OR current_user IN ('anon', 'authenticated', 'service_role', 'postgres', 'supabase_admin')
  );

DROP POLICY IF EXISTS "Order items insert" ON order_items;
CREATE POLICY "Order items insert" ON order_items
  FOR INSERT
  TO PUBLIC
  WITH CHECK (
    auth.role() IN ('anon', 'authenticated', 'service_role')
    OR current_user IN ('anon', 'authenticated', 'service_role', 'postgres', 'supabase_admin')
  );

-- Also clean up the sentinel policy so we can test that pattern there.
DROP POLICY IF EXISTS "sentinel anon insert" ON rls_test_sentinel;
CREATE POLICY "sentinel anon insert" ON rls_test_sentinel
  FOR INSERT
  TO PUBLIC
  WITH CHECK (auth.role() IN ('anon', 'authenticated', 'service_role'));
