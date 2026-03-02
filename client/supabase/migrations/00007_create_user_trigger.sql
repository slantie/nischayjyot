-- Migration 00007: Auto-create profile on sign-up via trigger
-- The trigger runs as SECURITY DEFINER (postgres superuser), bypassing RLS.
-- This is the standard Supabase pattern for profile creation.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'citizen'
  )
  ON CONFLICT (id) DO NOTHING; -- idempotent: safe to re-run
  RETURN NEW;
END;
$$;

-- Drop if already exists, then recreate cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
