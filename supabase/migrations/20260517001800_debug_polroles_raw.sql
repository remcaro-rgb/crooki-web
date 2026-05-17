-- TEMP — dump pg_policy.polroles as raw oid array text.

CREATE OR REPLACE FUNCTION public.debug_polroles_raw()
RETURNS TABLE (
  tablename name,
  policyname name,
  polroles_text text,
  polroles_oids text,
  current_user_oid_in boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT
    c.relname,
    p.polname,
    p.polroles::text,
    (SELECT string_agg(o::text, ',') FROM unnest(p.polroles) o),
    'anon'::regrole::oid = ANY(p.polroles) OR 0 = ANY(p.polroles)
  FROM pg_policy p
  JOIN pg_class c ON c.oid = p.polrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname IN ('orders', 'order_items', 'rls_test_sentinel');
$$;

GRANT EXECUTE ON FUNCTION public.debug_polroles_raw() TO anon, authenticated, service_role;
