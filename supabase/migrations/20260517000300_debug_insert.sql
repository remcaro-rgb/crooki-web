-- TEMP DIAGNOSTIC — try inserting into orders as if we were anon.

CREATE OR REPLACE FUNCTION public.debug_try_insert()
RETURNS TABLE (worked boolean, err text)
LANGUAGE plpgsql
AS $$
DECLARE
  new_id uuid;
BEGIN
  BEGIN
    SET LOCAL ROLE anon;
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, notes, total, status)
    VALUES ('inner test', 'inner@example.com', '300', 'X', '', 0, 'pending')
    RETURNING id INTO new_id;
    RESET ROLE;
    DELETE FROM orders WHERE id = new_id;
    RETURN QUERY SELECT true, NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    RETURN QUERY SELECT false, SQLERRM;
  END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_try_insert() TO anon, authenticated, service_role;
