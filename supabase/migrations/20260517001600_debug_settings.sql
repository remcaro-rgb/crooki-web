-- TEMP — dump session settings for the calling context.

CREATE OR REPLACE FUNCTION public.debug_session_settings()
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_build_object(
    'current_user', current_user,
    'session_user', session_user,
    'role_setting', current_setting('role', true),
    'auth_role', auth.role(),
    'auth_uid', auth.uid(),
    'auth_jwt', current_setting('request.jwt.claims', true),
    'transaction_read_only', current_setting('transaction_read_only', true),
    'row_security', current_setting('row_security', true),
    'search_path', current_setting('search_path', true)
  );
$$;

GRANT EXECUTE ON FUNCTION public.debug_session_settings() TO anon, authenticated, service_role;
