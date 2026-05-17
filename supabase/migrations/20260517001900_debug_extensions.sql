-- TEMP — list installed extensions.

CREATE OR REPLACE FUNCTION public.debug_extensions()
RETURNS TABLE (extname name, extversion text, schemaname name)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT e.extname, e.extversion, n.nspname
  FROM pg_extension e
  JOIN pg_namespace n ON n.oid = e.extnamespace
  ORDER BY e.extname;
$$;

GRANT EXECUTE ON FUNCTION public.debug_extensions() TO anon, authenticated, service_role;
