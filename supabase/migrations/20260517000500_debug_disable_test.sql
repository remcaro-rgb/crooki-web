-- TEMP DIAGNOSTIC — show how the same insert behaves with RLS disabled vs the
-- policy expanded. Function runs as SECURITY DEFINER so it can flip RLS on its
-- own session even when called by anon.

CREATE OR REPLACE FUNCTION public.debug_insert_with_rls_off()
RETURNS TABLE (worked boolean, err text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id uuid;
BEGIN
  BEGIN
    ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
    SET LOCAL ROLE anon;
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, notes, total, status)
    VALUES ('rls-off test', 'rls-off@example.com', '300', 'X', '', 0, 'pending')
    RETURNING id INTO new_id;
    RESET ROLE;
    DELETE FROM orders WHERE id = new_id;
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    RETURN QUERY SELECT true, NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    BEGIN ALTER TABLE orders ENABLE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN NULL; END;
    RETURN QUERY SELECT false, SQLERRM;
  END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_insert_with_rls_off() TO anon, authenticated, service_role;
