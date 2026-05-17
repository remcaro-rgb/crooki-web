-- TEMP DIAGNOSTIC — insert as the function owner (bypasses RLS for the owner
-- since polforcerowsecurity = false) to prove triggers/constraints are OK.

CREATE OR REPLACE FUNCTION public.debug_definer_insert()
RETURNS TABLE (worked boolean, err text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id uuid;
BEGIN
  BEGIN
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, notes, total, status)
    VALUES ('definer test', 'definer@example.com', '300', 'X', '', 0, 'pending')
    RETURNING id INTO new_id;
    DELETE FROM orders WHERE id = new_id;
    RETURN QUERY SELECT true, NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT false, SQLERRM;
  END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_definer_insert() TO anon, authenticated, service_role;
