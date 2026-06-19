-- Only staff signups receive a user_roles row (account_type = 'staff' in auth metadata)
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(NEW.raw_user_meta_data->>'account_type', '') = 'staff' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'employee'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Remove employee roles that were auto-assigned to shop customers
DELETE FROM public.user_roles ur
USING auth.users u
WHERE ur.user_id = u.id
  AND ur.role = 'employee'::app_role
  AND COALESCE(u.raw_user_meta_data->>'account_type', '') <> 'staff';
