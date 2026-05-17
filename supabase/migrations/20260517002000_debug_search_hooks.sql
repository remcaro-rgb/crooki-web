-- TEMP — search for functions that look like request hooks.

CREATE OR REPLACE FUNCTION public.debug_search_hooks()
RETURNS TABLE (schema_name name, proname name, prosrc text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT n.nspname, p.proname, left(p.prosrc, 200)
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE p.proname ~* '(pre_request|hook|guard|enforce|gateway|interceptor|policy_check|rls)'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema')
  ORDER BY n.nspname, p.proname;
$$;

GRANT EXECUTE ON FUNCTION public.debug_search_hooks() TO anon, authenticated, service_role;
