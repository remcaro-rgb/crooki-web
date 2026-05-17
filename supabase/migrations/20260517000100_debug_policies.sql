-- TEMP DIAGNOSTIC — will be removed after RLS investigation.
-- Exposes the current state of policies on orders/order_items via a
-- SECURITY DEFINER function so we can inspect them through PostgREST.

CREATE OR REPLACE FUNCTION public.debug_order_policies()
RETURNS TABLE (
  tablename name,
  policyname name,
  permissive text,
  roles name[],
  cmd text,
  qual text,
  with_check text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('orders', 'order_items')
  ORDER BY tablename, cmd, policyname;
$$;

GRANT EXECUTE ON FUNCTION public.debug_order_policies() TO anon, authenticated, service_role;
