-- Migration: 20260825180000_service_inquiries_foundation.sql
-- Description: Create service_inquiries table with RLS policies and indexes.

CREATE TABLE IF NOT EXISTS public.service_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT,
    sender_phone TEXT,
    sender_email TEXT,
    preferred_date DATE,
    inquiry_details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'closed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_inquiries_service_id ON public.service_inquiries(service_listing_id);
CREATE INDEX IF NOT EXISTS idx_service_inquiries_sender_id ON public.service_inquiries(sender_id);

-- Enable RLS
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Sender can read own inquiries
CREATE POLICY "Senders can read own service inquiries"
    ON public.service_inquiries
    FOR SELECT
    USING (auth.uid() = sender_id);

-- Policy 2: Service owner can read inquiries for their services
CREATE POLICY "Service owners can read service inquiries"
    ON public.service_inquiries
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT owner_id FROM public.listings WHERE id = service_inquiries.service_listing_id
        )
    );

-- Policy 3: Sender can insert inquiry if authenticated and not the service owner
CREATE POLICY "Senders can insert service inquiries"
    ON public.service_inquiries
    FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND auth.uid() <> (
            SELECT owner_id FROM public.listings WHERE id = service_inquiries.service_listing_id
        )
    );

-- Policy 4: Service owner can update inquiry status
CREATE POLICY "Service owners can update inquiry status"
    ON public.service_inquiries
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT owner_id FROM public.listings WHERE id = service_inquiries.service_listing_id
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.service_inquiries TO authenticated;
