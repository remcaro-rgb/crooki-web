-- Try the policy bound to PUBLIC (= every role) instead of explicit anon list.

DROP POLICY IF EXISTS "Orders insert" ON orders;
CREATE POLICY "Orders insert" ON orders
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

DROP POLICY IF EXISTS "Order items insert" ON order_items;
CREATE POLICY "Order items insert" ON order_items
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);
