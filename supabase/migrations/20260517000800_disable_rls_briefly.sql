-- TEMP — disable RLS on orders + order_items so we can confirm anon insert
-- works without RLS. Will be re-enabled by a follow-up migration.

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
