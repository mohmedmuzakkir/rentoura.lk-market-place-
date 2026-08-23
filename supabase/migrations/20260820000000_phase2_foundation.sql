-- RENTOURA.LK — SUPABASE PHASE 2: DATABASE FOUNDATION & SECURITY BASE

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('user', 'moderator', 'admin', 'super_admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
    CREATE TYPE account_status AS ENUM ('active', 'restricted', 'suspended', 'banned');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_module') THEN
    CREATE TYPE listing_module AS ENUM ('rental', 'job', 'service');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
    CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'changes_required', 'active', 'rejected', 'paused', 'expired', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
    CREATE TYPE report_status AS ENUM ('submitted', 'under_review', 'resolved', 'dismissed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE review_status AS ENUM ('published', 'removed', 'pending_moderation');
  END IF;
END $$;

-- 3. HELPER FUNCTION: UPDATE TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  display_name text,
  email text NOT NULL,
  phone_normalized text,
  profile_photo_url text,
  preferred_language text DEFAULT 'English',
  role app_role NOT NULL DEFAULT 'user',
  account_status account_status NOT NULL DEFAULT 'active',
  bio text,
  province_id text,
  district_id text,
  city_id text,
  area_id text,
  agreement_version text,
  agreement_accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. ADMIN CHECK HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role IN ('admin', 'super_admin', 'moderator')
      AND account_status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, check_role app_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role = check_role
      AND account_status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. TRIGGER FUNCTION: HANDLE NEW USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    display_name,
    role,
    account_status
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', ''),
    'user'::app_role, -- ALWAYS force 'user' at DB level
    'active'::account_status
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. TRIGGER FUNCTION: PREVENT PROFILE ROLE/STATUS TAMPERING BY REGULAR USERS
CREATE OR REPLACE FUNCTION public.prevent_profile_role_tampering()
RETURNS TRIGGER AS $$
BEGIN
  -- If not admin/super_admin, user cannot alter role or account_status
  IF NOT public.is_admin(auth.uid()) THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      NEW.role := OLD.role;
    END IF;
    IF NEW.account_status IS DISTINCT FROM OLD.account_status THEN
      NEW.account_status := OLD.account_status;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS protect_profile_sensitive_fields ON public.profiles;
CREATE TRIGGER protect_profile_sensitive_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_tampering();

-- 8. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module listing_module NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  parent_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  level integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  sort_order integer NOT NULL DEFAULT 0,
  icon_key text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Drop legacy constraint if created in prior attempts
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_module_slug_parent_unique;

-- Create clean, standard PostgreSQL partial unique indexes for main & sub categories
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_module_slug_main
  ON public.categories (module, slug)
  WHERE parent_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_module_slug_sub
  ON public.categories (module, slug, parent_id)
  WHERE parent_id IS NOT NULL;

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('country', 'province', 'district', 'city', 'area')),
  parent_id uuid REFERENCES public.locations(id) ON DELETE RESTRICT,
  province_id uuid REFERENCES public.locations(id) ON DELETE RESTRICT,
  district_id uuid REFERENCES public.locations(id) ON DELETE RESTRICT,
  city_id uuid REFERENCES public.locations(id) ON DELETE RESTRICT,
  latitude numeric CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric CHECK (longitude BETWEEN -180 AND 180),
  postal_code text,
  name_si text,
  name_ta text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_locations_updated_at ON public.locations;
CREATE TRIGGER set_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. LISTINGS CORE TABLE
CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  module listing_module NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  subcategory_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text NOT NULL,
  status listing_status NOT NULL DEFAULT 'pending',
  province_id uuid REFERENCES public.locations(id) ON DELETE RESTRICT,
  district_id uuid REFERENCES public.locations(id) ON DELETE RESTRICT,
  city_id uuid REFERENCES public.locations(id) ON DELETE RESTRICT,
  area_id uuid REFERENCES public.locations(id) ON DELETE RESTRICT,
  exact_address text,
  latitude numeric CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric CHECK (longitude BETWEEN -180 AND 180),
  contact_phone text,
  contact_whatsapp text,
  contact_email text,
  hide_phone boolean DEFAULT false,
  negotiable boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejected_at timestamptz,
  rejected_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejection_reason text
);

DROP TRIGGER IF EXISTS set_listings_updated_at ON public.listings;
CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 11. TRIGGER FUNCTION: PREVENT CLIENT SELF-APPROVAL & MODERATION OVERWRITE
CREATE OR REPLACE FUNCTION public.prevent_listing_self_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    -- Regular user cannot set status to active directly if previously pending or draft
    IF NEW.status = 'active'::listing_status AND OLD.status != 'active'::listing_status THEN
      NEW.status := 'pending'::listing_status;
    END IF;
    -- Non-admins cannot alter moderation/featured fields
    NEW.approved_at := OLD.approved_at;
    NEW.approved_by := OLD.approved_by;
    NEW.rejected_at := OLD.rejected_at;
    NEW.rejected_by := OLD.rejected_by;
    NEW.rejection_reason := OLD.rejection_reason;
    NEW.featured := OLD.featured;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS protect_listing_moderation_fields ON public.listings;
CREATE TRIGGER protect_listing_moderation_fields
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_listing_self_approval();

-- 12. MODULE DETAIL TABLES
CREATE TABLE IF NOT EXISTS public.rental_details (
  listing_id uuid PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
  rates jsonb NOT NULL DEFAULT '{}'::jsonb,
  security_deposit numeric,
  available_from date,
  delivery_available boolean DEFAULT false,
  pickup_available boolean DEFAULT true,
  terms text,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  features text[] DEFAULT '{}'::text[]
);

CREATE TABLE IF NOT EXISTS public.job_details (
  listing_id uuid PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  employment_type text,
  work_mode text,
  vacancies integer DEFAULT 1,
  salary_min numeric,
  salary_max numeric,
  salary_type text,
  experience_required text,
  education_level text,
  working_hours text,
  working_days text,
  benefits text[] DEFAULT '{}'::text[],
  application_deadline date,
  apply_phone text,
  apply_whatsapp text,
  apply_email text
);

CREATE TABLE IF NOT EXISTS public.service_details (
  listing_id uuid PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
  provider_type text,
  experience_years integer,
  availability_days text[] DEFAULT '{}'::text[],
  availability_time text,
  emergency_service boolean DEFAULT false,
  advance_booking boolean DEFAULT false,
  pricing_type text,
  starting_price numeric,
  service_area text,
  portfolio_urls text[] DEFAULT '{}'::text[]
);

-- 13. LISTING MEDIA
CREATE TABLE IF NOT EXISTS public.listing_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'document')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 14. SAVED LISTINGS
CREATE TABLE IF NOT EXISTS public.saved_listings (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

-- 15. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('listing', 'user')),
  target_id uuid NOT NULL,
  module listing_module,
  overall_rating integer NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  title text,
  body text NOT NULL,
  status review_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 16. REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('listing', 'user', 'review', 'message')),
  target_id uuid NOT NULL,
  target_module listing_module,
  reason_code text NOT NULL,
  description text,
  status report_status NOT NULL DEFAULT 'submitted',
  source text DEFAULT 'web',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 17. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  related_type text,
  related_id uuid,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 18. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 19. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role app_role,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 20. INDEXES
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_module ON public.listings(module);
CREATE INDEX IF NOT EXISTS idx_listings_owner ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_province ON public.listings(province_id);
CREATE INDEX IF NOT EXISTS idx_listings_district ON public.listings(district_id);
CREATE INDEX IF NOT EXISTS idx_listings_created ON public.listings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_categories_module ON public.categories(module);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_status ON public.categories(status);

CREATE INDEX IF NOT EXISTS idx_locations_type ON public.locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_parent ON public.locations(parent_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at ASC);

-- 21. ROW LEVEL SECURITY (RLS) ACTIVATION
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 22. RLS POLICIES

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are readable by everyone or authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by everyone or authenticated users"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- CATEGORIES POLICIES
DROP POLICY IF EXISTS "Categories readable by all" ON public.categories;
CREATE POLICY "Categories readable by all"
  ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categories managed by admins" ON public.categories;
CREATE POLICY "Categories managed by admins"
  ON public.categories FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- LOCATIONS POLICIES
DROP POLICY IF EXISTS "Locations readable by all" ON public.locations;
CREATE POLICY "Locations readable by all"
  ON public.locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Locations managed by admins" ON public.locations;
CREATE POLICY "Locations managed by admins"
  ON public.locations FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- LISTINGS POLICIES
DROP POLICY IF EXISTS "Active listings readable by public" ON public.listings;
CREATE POLICY "Active listings readable by public"
  ON public.listings FOR SELECT
  USING (status = 'active' OR owner_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create listing" ON public.listings;
CREATE POLICY "Authenticated users can create listing"
  ON public.listings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners or admins can update listing" ON public.listings;
CREATE POLICY "Owners or admins can update listing"
  ON public.listings FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Owners or admins can delete listing" ON public.listings;
CREATE POLICY "Owners or admins can delete listing"
  ON public.listings FOR DELETE
  USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));

-- RENTAL / JOB / SERVICE DETAILS POLICIES
DROP POLICY IF EXISTS "Rental details readable with listing" ON public.rental_details;
CREATE POLICY "Rental details readable with listing"
  ON public.rental_details FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (status = 'active' OR owner_id = auth.uid() OR public.is_admin(auth.uid()))));

DROP POLICY IF EXISTS "Rental details writable by owner or admin" ON public.rental_details;
CREATE POLICY "Rental details writable by owner or admin"
  ON public.rental_details FOR ALL
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (owner_id = auth.uid() OR public.is_admin(auth.uid()))));

DROP POLICY IF EXISTS "Job details readable with listing" ON public.job_details;
CREATE POLICY "Job details readable with listing"
  ON public.job_details FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (status = 'active' OR owner_id = auth.uid() OR public.is_admin(auth.uid()))));

DROP POLICY IF EXISTS "Job details writable by owner or admin" ON public.job_details;
CREATE POLICY "Job details writable by owner or admin"
  ON public.job_details FOR ALL
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (owner_id = auth.uid() OR public.is_admin(auth.uid()))));

DROP POLICY IF EXISTS "Service details readable with listing" ON public.service_details;
CREATE POLICY "Service details readable with listing"
  ON public.service_details FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (status = 'active' OR owner_id = auth.uid() OR public.is_admin(auth.uid()))));

DROP POLICY IF EXISTS "Service details writable by owner or admin" ON public.service_details;
CREATE POLICY "Service details writable by owner or admin"
  ON public.service_details FOR ALL
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (owner_id = auth.uid() OR public.is_admin(auth.uid()))));

-- LISTING MEDIA POLICIES
DROP POLICY IF EXISTS "Listing media readable with listing" ON public.listing_media;
CREATE POLICY "Listing media readable with listing"
  ON public.listing_media FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (status = 'active' OR owner_id = auth.uid() OR public.is_admin(auth.uid()))));

DROP POLICY IF EXISTS "Listing media writable by owner or admin" ON public.listing_media;
CREATE POLICY "Listing media writable by owner or admin"
  ON public.listing_media FOR ALL
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (owner_id = auth.uid() OR public.is_admin(auth.uid()))));

-- SAVED LISTINGS POLICIES
DROP POLICY IF EXISTS "Users can view own saved listings" ON public.saved_listings;
CREATE POLICY "Users can view own saved listings"
  ON public.saved_listings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save listing" ON public.saved_listings;
CREATE POLICY "Users can save listing"
  ON public.saved_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave listing" ON public.saved_listings;
CREATE POLICY "Users can unsave listing"
  ON public.saved_listings FOR DELETE
  USING (auth.uid() = user_id);

-- REVIEWS POLICIES
DROP POLICY IF EXISTS "Published reviews readable by all" ON public.reviews;
CREATE POLICY "Published reviews readable by all"
  ON public.reviews FOR SELECT
  USING (status = 'published' OR author_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can write review" ON public.reviews;
CREATE POLICY "Authenticated users can write review"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors or admins can update review" ON public.reviews;
CREATE POLICY "Authors or admins can update review"
  ON public.reviews FOR UPDATE
  USING (author_id = auth.uid() OR public.is_admin(auth.uid()));

-- REPORTS POLICIES
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (reporter_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can submit report" ON public.reports;
CREATE POLICY "Authenticated users can submit report"
  ON public.reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Admins can update report" ON public.reports;
CREATE POLICY "Admins can update report"
  ON public.reports FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- CONVERSATIONS & MESSAGES POLICIES
DROP POLICY IF EXISTS "Participants or admins view conversation" ON public.conversations;
CREATE POLICY "Participants or admins view conversation"
  ON public.conversations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid()) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Participants view conversation_participants" ON public.conversation_participants;
CREATE POLICY "Participants view conversation_participants"
  ON public.conversation_participants FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Participants can send message" ON public.messages;
CREATE POLICY "Participants can send message"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));

-- AUDIT LOGS POLICIES
DROP POLICY IF EXISTS "Admins can read audit logs" ON public.audit_logs;
CREATE POLICY "Admins can read audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

-- 23. SEED CANONICAL PROVINCES & DISTRICTS (IDEMPOTENT)
INSERT INTO public.locations (code, name, type, sort_order) VALUES
  ('western', 'Western Province', 'province', 1),
  ('central', 'Central Province', 'province', 2),
  ('southern', 'Southern Province', 'province', 3),
  ('northern', 'Northern Province', 'province', 4),
  ('eastern', 'Eastern Province', 'province', 5),
  ('north_western', 'North Western Province', 'province', 6),
  ('north_central', 'North Central Province', 'province', 7),
  ('uva', 'Uva Province', 'province', 8),
  ('sabaragamuwa', 'Sabaragamuwa Province', 'province', 9)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- Seed 25 Districts referencing parent province code
DO $$
DECLARE
  p_western uuid; p_central uuid; p_southern uuid; p_northern uuid;
  p_eastern uuid; p_north_western uuid; p_north_central uuid; p_uva uuid; p_sabaragamuwa uuid;
BEGIN
  SELECT id INTO p_western FROM public.locations WHERE code = 'western';
  SELECT id INTO p_central FROM public.locations WHERE code = 'central';
  SELECT id INTO p_southern FROM public.locations WHERE code = 'southern';
  SELECT id INTO p_northern FROM public.locations WHERE code = 'northern';
  SELECT id INTO p_eastern FROM public.locations WHERE code = 'eastern';
  SELECT id INTO p_north_western FROM public.locations WHERE code = 'north_western';
  SELECT id INTO p_north_central FROM public.locations WHERE code = 'north_central';
  SELECT id INTO p_uva FROM public.locations WHERE code = 'uva';
  SELECT id INTO p_sabaragamuwa FROM public.locations WHERE code = 'sabaragamuwa';

  -- Western
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('colombo', 'Colombo', 'district', p_western, p_western, 1),
    ('gampaha', 'Gampaha', 'district', p_western, p_western, 2),
    ('kalutara', 'Kalutara', 'district', p_western, p_western, 3)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;

  -- Central
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('kandy', 'Kandy', 'district', p_central, p_central, 4),
    ('matale', 'Matale', 'district', p_central, p_central, 5),
    ('nuwara_eliya', 'Nuwara Eliya', 'district', p_central, p_central, 6)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;

  -- Southern
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('galle', 'Galle', 'district', p_southern, p_southern, 7),
    ('matara', 'Matara', 'district', p_southern, p_southern, 8),
    ('hambantota', 'Hambantota', 'district', p_southern, p_southern, 9)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;

  -- Northern
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('jaffna', 'Jaffna', 'district', p_northern, p_northern, 10),
    ('kilinochchi', 'Kilinochchi', 'district', p_northern, p_northern, 11),
    ('mannar', 'Mannar', 'district', p_northern, p_northern, 12),
    ('mullaitivu', 'Mullaitivu', 'district', p_northern, p_northern, 13),
    ('vavuniya', 'Vavuniya', 'district', p_northern, p_northern, 14)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;

  -- Eastern
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('trincomalee', 'Trincomalee', 'district', p_eastern, p_eastern, 15),
    ('batticaloa', 'Batticaloa', 'district', p_eastern, p_eastern, 16),
    ('ampara', 'Ampara', 'district', p_eastern, p_eastern, 17)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;

  -- North Western
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('kurunegala', 'Kurunegala', 'district', p_north_western, p_north_western, 18),
    ('puttalam', 'Puttalam', 'district', p_north_western, p_north_western, 19)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;

  -- North Central
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('anuradhapura', 'Anuradhapura', 'district', p_north_central, p_north_central, 20),
    ('polonnaruwa', 'Polonnaruwa', 'district', p_north_central, p_north_central, 21)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;

  -- Uva
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('badulla', 'Badulla', 'district', p_uva, p_uva, 22),
    ('monaragala', 'Monaragala', 'district', p_uva, p_uva, 23)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;

  -- Sabaragamuwa
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order) VALUES
    ('ratnapura', 'Ratnapura', 'district', p_sabaragamuwa, p_sabaragamuwa, 24),
    ('kegalle', 'Kegalle', 'district', p_sabaragamuwa, p_sabaragamuwa, 25)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id;
END $$;

-- 24. SEED CANONICAL MAIN CATEGORIES (IDEMPOTENT)
INSERT INTO public.categories (module, slug, name, icon_key, description, level, sort_order) VALUES
  ('rental', 'property-rentals', 'Property Rentals', '🏠', 'Houses, apartments, commercial properties and land for rent', 1, 1),
  ('rental', 'vehicle-rentals', 'Vehicle Rentals', '🚗', 'Cars, vans, SUVs, bikes, buses and commercial vehicles for rent', 1, 2),
  ('rental', 'electronics-appliances', 'Electronics & Appliances', '📺', 'Cameras, AV equipment, tools, party systems, and home electronics', 1, 3),
  ('rental', 'event-party-rentals', 'Event & Party Rentals', '🎉', 'Marquees, sound systems, catering gear, costumes, and event spaces', 1, 4),
  ('rental', 'heavy-machinery-equipment', 'Heavy Machinery & Equipment', '🚜', 'Excavators, generators, construction tools, and industrial equipment', 1, 5),
  ('job', 'technology-it', 'Technology & IT', '💻', 'Software engineering, design, DevOps, IT support, and tech roles', 1, 1),
  ('job', 'finance-banking', 'Finance, Banking & Accounting', '🏦', 'Banking, auditing, tax, financial accounting, and investment roles', 1, 2),
  ('job', 'sales-marketing', 'Sales & Marketing', '📈', 'Digital marketing, sales, business development, and brand strategy', 1, 3),
  ('job', 'customer-service-support', 'Customer Service & Support', '🎧', 'Call centers, customer experience, technical support, and helpdesk', 1, 4),
  ('service', 'home-services-maintenance', 'Home Services & Repairs', '🛠️', 'Plumbing, electrical, AC repair, carpentry, painting, and cleaning', 1, 1),
  ('service', 'event-wedding-services', 'Event & Wedding Services', '💍', 'Photography, catering, DJ, event planning, and makeup artistry', 1, 2),
  ('service', 'professional-business-services', 'Professional & Business Services', '💼', 'Legal, accounting, graphic design, translation, and consulting', 1, 3)
ON CONFLICT (module, slug) WHERE parent_id IS NULL DO UPDATE SET name = EXCLUDED.name, icon_key = EXCLUDED.icon_key, description = EXCLUDED.description;
