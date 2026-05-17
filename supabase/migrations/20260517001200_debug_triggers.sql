-- TEMP DIAGNOSTIC — look for event triggers and table triggers on orders.

CREATE OR REPLACE FUNCTION public.debug_triggers_and_events()
RETURNS TABLE (
  kind text,
  name text,
  detail text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT 'event_trigger'::text, evtname::text, evtevent::text || ' / fn=' || (SELECT proname::text FROM pg_proc WHERE oid = evtfoid)
  FROM pg_event_trigger
  UNION ALL
  SELECT 'table_trigger'::text, t.tgname::text, c.relname::text || ' / fn=' || p.proname::text
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_proc  p ON p.oid = t.tgfoid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname IN ('orders','order_items','rls_test_sentinel')
    AND NOT t.tgisinternal;
$$;

GRANT EXECUTE ON FUNCTION public.debug_triggers_and_events() TO anon, authenticated, service_role;
