-- TEMP — read role-level configuration for anon.

CREATE OR REPLACE FUNCTION public.debug_role_config()
RETURNS TABLE (rolname name, rolconfig text[])
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT r.rolname, r.rolconfig
  FROM pg_roles r
  WHERE r.rolname IN ('anon', 'authenticated', 'authenticator', 'service_role');
$$;

GRANT EXECUTE ON FUNCTION public.debug_role_config() TO anon, authenticated, service_role;
