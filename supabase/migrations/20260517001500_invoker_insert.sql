-- TEMP — SECURITY INVOKER function (runs as caller = anon) tries the insert.

CREATE OR REPLACE FUNCTION public.debug_invoker_insert()
RETURNS TABLE (worked boolean, err text, role_at_time text)
LANGUAGE plpgsql
AS $$
DECLARE
  new_id uuid;
BEGIN
  BEGIN
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, notes, total, status)
    VALUES ('invoker test', 'invoker@example.com', '300', 'X', '', 0, 'pending')
    RETURNING id INTO new_id;
    DELETE FROM orders WHERE id = new_id;
    RETURN QUERY SELECT true, NULL::text, current_user::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT false, SQLERRM, current_user::text;
  END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_invoker_insert() TO anon, authenticated, service_role;
