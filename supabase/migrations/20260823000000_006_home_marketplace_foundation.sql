-- RENTOURA.LK — MIGRATION 006: HOME MARKETPLACE FOUNDATION
-- Repeat-safe migration for public.listings, public.listing_media, public.saved_listings, public.home_slides, public.location_search_events

-- 1. EXTENSIONS & HELPER FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Generic updated_at function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function: is_staff
CREATE OR REPLACE FUNCTION public.is_staff(user_id uuid)
RETURNS boolean AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role IN ('admin', 'super_admin', 'moderator')
      AND account_status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper function: is_admin (if not defined)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role IN ('admin', 'super_admin', 'moderator')
      AND account_status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 2. CREATE TABLE public.listings
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL CHECK (module IN ('rental', 'job', 'service')),
  category_id UUID NULL REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID NULL REFERENCES public.categories(id) ON DELETE SET NULL,
  third_level_category_id UUID NULL REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  short_summary TEXT NULL,
  description TEXT NULL,
  province_id UUID NULL REFERENCES public.locations(id) ON DELETE SET NULL,
  district_id UUID NULL REFERENCES public.locations(id) ON DELETE SET NULL,
  city_id UUID NULL REFERENCES public.locations(id) ON DELETE SET NULL,
  area_id UUID NULL REFERENCES public.locations(id) ON DELETE SET NULL,
  exact_address TEXT NULL,
  latitude NUMERIC NULL CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
  longitude NUMERIC NULL CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
  price NUMERIC NULL,
  minimum_price NUMERIC NULL,
  maximum_price NUMERIC NULL,
  pricing_period TEXT NULL,
  currency TEXT NOT NULL DEFAULT 'LKR',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'changes_requested', 'active', 'rejected', 'paused', 'expired')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  module_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ NULL,
  submitted_at TIMESTAMPTZ NULL,
  approved_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Listing updated_at trigger
DROP TRIGGER IF EXISTS set_listings_updated_at ON public.listings;
CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Prevent regular user self-approval & unauthorized featuring
CREATE OR REPLACE FUNCTION public.prevent_listing_self_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    -- Non-staff cannot set status to 'active' directly
    IF NEW.status = 'active' AND OLD.status != 'active' THEN
      NEW.status := 'pending';
    END IF;
    -- Non-staff cannot feature listings
    NEW.is_featured := OLD.is_featured;
    NEW.approved_at := OLD.approved_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS protect_listing_moderation_fields ON public.listings;
CREATE TRIGGER protect_listing_moderation_fields
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_listing_self_approval();

-- Indexes for public.listings
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_module ON public.listings(module);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_published_at ON public.listings(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_province_id ON public.listings(province_id);
CREATE INDEX IF NOT EXISTS idx_listings_district_id ON public.listings(district_id);
CREATE INDEX IF NOT EXISTS idx_listings_city_id ON public.listings(city_id);

CREATE INDEX IF NOT EXISTS idx_listings_status_published ON public.listings(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_module_status_published ON public.listings(module, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_status_created ON public.listings(status, created_at DESC);

-- RLS for public.listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active listings" ON public.listings;
CREATE POLICY "Public can view active listings"
  ON public.listings FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Owners can view own listings" ON public.listings;
CREATE POLICY "Owners can view own listings"
  ON public.listings FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Staff can view all listings" ON public.listings;
CREATE POLICY "Staff can view all listings"
  ON public.listings FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Users can insert own listings" ON public.listings;
CREATE POLICY "Users can insert own listings"
  ON public.listings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = owner_id
    AND status IN ('draft', 'pending')
    AND is_featured = false
  );

DROP POLICY IF EXISTS "Owners can update own listings" ON public.listings;
CREATE POLICY "Owners can update own listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Staff can update any listing" ON public.listings;
CREATE POLICY "Staff can update any listing"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Owners can delete own listings" ON public.listings;
CREATE POLICY "Owners can delete own listings"
  ON public.listings FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Staff can delete any listing" ON public.listings;
CREATE POLICY "Staff can delete any listing"
  ON public.listings FOR DELETE
  TO authenticated
  USING (public.is_staff(auth.uid()));


-- 3. CREATE TABLE public.listing_media
CREATE TABLE IF NOT EXISTS public.listing_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  position INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  width INTEGER NULL,
  height INTEGER NULL,
  file_size INTEGER NULL,
  mime_type TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_media_listing_id ON public.listing_media(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_media_listing_pos ON public.listing_media(listing_id, position);

ALTER TABLE public.listing_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view media for active listings" ON public.listing_media;
CREATE POLICY "Public can view media for active listings"
  ON public.listing_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Owners can view media for own listings" ON public.listing_media;
CREATE POLICY "Owners can view media for own listings"
  ON public.listing_media FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Staff can view all listing media" ON public.listing_media;
CREATE POLICY "Staff can view all listing media"
  ON public.listing_media FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Owners can insert media for own listings" ON public.listing_media;
CREATE POLICY "Owners can insert media for own listings"
  ON public.listing_media FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can update media for own listings" ON public.listing_media;
CREATE POLICY "Owners can update media for own listings"
  ON public.listing_media FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can delete media for own listings" ON public.listing_media;
CREATE POLICY "Owners can delete media for own listings"
  ON public.listing_media FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.owner_id = auth.uid()
    )
  );


-- 4. CREATE TABLE public.saved_listings
CREATE TABLE IF NOT EXISTS public.saved_listings (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_listings_user ON public.saved_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_listings_listing ON public.saved_listings(listing_id);

ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own saved listings" ON public.saved_listings;
CREATE POLICY "Users can read own saved listings"
  ON public.saved_listings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save listings for themselves" ON public.saved_listings;
CREATE POLICY "Users can save listings for themselves"
  ON public.saved_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own saved listings" ON public.saved_listings;
CREATE POLICY "Users can remove own saved listings"
  ON public.saved_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- 5. CREATE TABLE public.home_slides
CREATE TABLE IF NOT EXISTS public.home_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NULL,
  description TEXT NULL,
  image_url TEXT NULL,
  mobile_image_url TEXT NULL,
  module TEXT NULL,
  cta_text TEXT NULL,
  cta_route TEXT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER NULL CHECK (duration_ms IS NULL OR duration_ms >= 2000),
  overlay_strength NUMERIC NULL CHECK (overlay_strength IS NULL OR (overlay_strength BETWEEN 0 AND 1)),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_home_slides_updated_at ON public.home_slides;
CREATE TRIGGER set_home_slides_updated_at
  BEFORE UPDATE ON public.home_slides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.home_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active home slides" ON public.home_slides;
CREATE POLICY "Public can view active home slides"
  ON public.home_slides FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Staff can view all home slides" ON public.home_slides;
CREATE POLICY "Staff can view all home slides"
  ON public.home_slides FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can insert home slides" ON public.home_slides;
CREATE POLICY "Staff can insert home slides"
  ON public.home_slides FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can update home slides" ON public.home_slides;
CREATE POLICY "Staff can update home slides"
  ON public.home_slides FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can delete home slides" ON public.home_slides;
CREATE POLICY "Staff can delete home slides"
  ON public.home_slides FOR DELETE
  TO authenticated
  USING (public.is_staff(auth.uid()));


-- 6. CREATE TABLE public.location_search_events
CREATE TABLE IF NOT EXISTS public.location_search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL DEFAULT 'search' CHECK (event_type IN ('search', 'filter_select')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_location_events_loc ON public.location_search_events(location_id);
CREATE INDEX IF NOT EXISTS idx_location_events_created ON public.location_search_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_events_loc_created ON public.location_search_events(location_id, created_at DESC);

ALTER TABLE public.location_search_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can insert own search events" ON public.location_search_events;
CREATE POLICY "Authenticated users can insert own search events"
  ON public.location_search_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Staff can read search events" ON public.location_search_events;
CREATE POLICY "Staff can read search events"
  ON public.location_search_events FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));


-- 7. STORAGE BUCKET: listing-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for listing-images
DROP POLICY IF EXISTS "Public listing-images read" ON storage.objects;
CREATE POLICY "Public listing-images read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

DROP POLICY IF EXISTS "User upload listing-images" ON storage.objects;
CREATE POLICY "User upload listing-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "User update listing-images" ON storage.objects;
CREATE POLICY "User update listing-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "User delete listing-images" ON storage.objects;
CREATE POLICY "User delete listing-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
