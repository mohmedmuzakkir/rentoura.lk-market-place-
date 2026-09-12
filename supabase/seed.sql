-- Supabase DB Seed
-- Populates the local database with initial mock users and data.

-- 1. Create Admin User
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'admin@gmail.com',
  crypt('password123', gen_salt('bf')),
  current_timestamp,
  current_timestamp,
  current_timestamp,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Admin"}',
  current_timestamp,
  current_timestamp,
  '',
  '',
  '',
  ''
);

INSERT INTO auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  format('{"sub":"%s","email":"%s"}', 'a0000000-0000-0000-0000-000000000001', 'admin@gmail.com')::jsonb,
  'email',
  current_timestamp,
  current_timestamp,
  current_timestamp
);


-- 2. Create Super Admin User
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000002',
  'authenticated',
  'authenticated',
  'superadmin@gmail.com',
  crypt('password123', gen_salt('bf')),
  current_timestamp,
  current_timestamp,
  current_timestamp,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Superadmin"}',
  current_timestamp,
  current_timestamp,
  '',
  '',
  '',
  ''
);

INSERT INTO auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  format('{"sub":"%s","email":"%s"}', 'a0000000-0000-0000-0000-000000000002', 'superadmin@gmail.com')::jsonb,
  'email',
  current_timestamp,
  current_timestamp,
  current_timestamp
);


-- 3. Elevate Permissions in public.profiles
-- The database trigger handle_new_user automatically creates the profile row 
-- with a default role of 'user'. We update it here to the correct staff roles.

-- Disable triggers temporarily to bypass the prevent_profile_role_tampering silent rollback
ALTER TABLE public.profiles DISABLE TRIGGER protect_profile_sensitive_fields;
ALTER TABLE public.profiles DISABLE TRIGGER protect_profile_authorization_fields;

UPDATE public.profiles
SET 
  role = 'admin',
  account_status = 'active'
WHERE id = 'a0000000-0000-0000-0000-000000000001';

UPDATE public.profiles
SET 
  role = 'super_admin',
  account_status = 'active'
WHERE id = 'a0000000-0000-0000-0000-000000000002';

ALTER TABLE public.profiles ENABLE TRIGGER protect_profile_sensitive_fields;
ALTER TABLE public.profiles ENABLE TRIGGER protect_profile_authorization_fields;
