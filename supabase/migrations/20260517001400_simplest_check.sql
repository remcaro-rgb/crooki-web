-- Last resort — completely literal WITH CHECK expression.

DROP POLICY IF EXISTS "Orders insert" ON orders;
CREATE POLICY "Orders insert" ON orders
  FOR INSERT
  TO PUBLIC
  WITH CHECK (1 = 1);

DROP POLICY IF EXISTS "Order items insert" ON order_items;
CREATE POLICY "Order items insert" ON order_items
  FOR INSERT
  TO PUBLIC
  WITH CHECK (1 = 1);
