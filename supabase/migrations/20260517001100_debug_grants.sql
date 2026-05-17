-- TEMP DIAGNOSTIC — check anon's actual privileges on sentinel and orders,
-- and dump pg_class.relacl so we can see what's granted vs revoked.

CREATE OR REPLACE FUNCTION public.debug_grants()
RETURNS TABLE (
  rel text,
  anon_insert boolean,
  anon_select boolean,
  authenticator_insert boolean,
  authenticated_insert boolean,
  acl text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT
    c.relname::text,
    has_table_privilege('anon', c.oid, 'INSERT'),
    has_table_privilege('anon', c.oid, 'SELECT'),
    has_table_privilege('authenticator', c.oid, 'INSERT'),
    has_table_privilege('authenticated', c.oid, 'INSERT'),
    array_to_string(c.relacl::text[], ' | ')
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname IN ('orders', 'order_items', 'rls_test_sentinel', 'products');
$$;

GRANT EXECUTE ON FUNCTION public.debug_grants() TO anon, authenticated, service_role;
