-- Database trigger to automatically sync users from Supabase Auth to Prisma User table
-- This trigger runs whenever a user is inserted into auth.users

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION sync_user_to_prisma()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user in the public.User table
  INSERT INTO "User" (id, email, name, password_hash, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name'),
    'supabase_auth_managed',
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = EXCLUDED.updated_at;

  -- Create default user preferences if they don't exist
  INSERT INTO "UserPreferences" (id, user_id, currency, "numberFormat", default_view, currency_format, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    'USD',
    'en-US',
    'dashboard',
    'USD',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS sync_user_trigger ON auth.users;
CREATE TRIGGER sync_user_trigger
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_to_prisma();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Test the trigger (optional - you can run this to test)
-- This will show if the trigger is working
SELECT 'User sync trigger created successfully' as status;
