-- TEMP DIAGNOSTIC — read raw pg_policy/pg_class rows so we can spot anything
-- pg_policies view might hide.

CREATE OR REPLACE FUNCTION public.debug_raw_policies()
RETURNS TABLE (
  relname name,
  relrowsecurity boolean,
  relforcerowsecurity boolean,
  policyname name,
  polpermissive boolean,
  polroles text,
  polcmd char,
  polqual text,
  polwithcheck text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT
    c.relname,
    c.relrowsecurity,
    c.relforcerowsecurity,
    p.polname AS policyname,
    p.polpermissive,
    (
      SELECT string_agg(r.rolname::text, ',' ORDER BY r.rolname)
      FROM unnest(p.polroles) AS pr(roleid)
      LEFT JOIN pg_roles r ON r.oid = pr.roleid
    ) AS polroles,
    p.polcmd,
    pg_get_expr(p.polqual, p.polrelid) AS polqual,
    pg_get_expr(p.polwithcheck, p.polrelid) AS polwithcheck
  FROM pg_class c
  LEFT JOIN pg_policy p ON p.polrelid = c.oid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname IN ('orders', 'order_items')
  ORDER BY c.relname, p.polcmd, p.polname;
$$;

GRANT EXECUTE ON FUNCTION public.debug_raw_policies() TO anon, authenticated, service_role;
