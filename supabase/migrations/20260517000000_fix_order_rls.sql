-- Restore public checkout: ensure anonymous customers can insert orders
-- and order_items. The original policies in 20260331000000_initial.sql were
-- created with `WITH CHECK (true)` but no `TO role` clause; in production
-- (Supabase, current Postgres defaults) anon insert started failing with
-- 42501 ("new row violates row-level security policy for table "orders"").
-- Drop and recreate the insert policies with explicit role bindings.

DROP POLICY IF EXISTS "Orders insert" ON orders;
CREATE POLICY "Orders insert" ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Order items insert" ON order_items;
CREATE POLICY "Order items insert" ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
