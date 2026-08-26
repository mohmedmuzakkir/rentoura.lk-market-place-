-- Migration: Create reviews schema for RENTOURA.LK
-- File: supabase/migrations/20260826060000_create_reviews_schema.sql

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending_moderation', 'removed')),
  subratings JSONB DEFAULT '{}'::jsonb,
  owner_reply TEXT,
  owner_reply_at TIMESTAMPTZ,
  helpful_count INTEGER DEFAULT 0,
  helpful_user_ids TEXT[] DEFAULT '{}'::text[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_listing_author UNIQUE(listing_id, author_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_author_id ON public.reviews(author_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (status = 'published' OR (auth.uid() IS NOT NULL AND auth.uid() = author_id));

DROP POLICY IF EXISTS "Users can insert own review" ON public.reviews;
CREATE POLICY "Users can insert own review" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own review" ON public.reviews;
CREATE POLICY "Users can update own review" ON public.reviews
  FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own review" ON public.reviews;
CREATE POLICY "Users can delete own review" ON public.reviews
  FOR DELETE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Listing owners can update reply on reviews" ON public.reviews;
CREATE POLICY "Listing owners can update reply on reviews" ON public.reviews
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = reviews.listing_id AND l.user_id = auth.uid()));

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO anon, authenticated, service_role;
