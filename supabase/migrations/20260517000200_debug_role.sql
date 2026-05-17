-- TEMP DIAGNOSTIC — returns the active role context for the calling request.

CREATE OR REPLACE FUNCTION public.debug_whoami()
RETURNS TABLE (
  current_user_name name,
  session_user_name name,
  current_role_setting text,
  auth_role text,
  has_orders_insert boolean
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    current_user,
    session_user,
    current_setting('role', true),
    auth.role(),
    has_table_privilege('public.orders', 'INSERT');
$$;

GRANT EXECUTE ON FUNCTION public.debug_whoami() TO anon, authenticated, service_role;
