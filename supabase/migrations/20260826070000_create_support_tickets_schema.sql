-- Migration: 20260826070000_create_support_tickets_schema.sql
-- Description: Create support_tickets table and RLS policies for Help Center support inquiries

CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    source TEXT DEFAULT 'help_center',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public/authenticated to submit support tickets
CREATE POLICY "Allow public insert to support_tickets"
    ON public.support_tickets
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy: Allow authenticated users to view their own tickets
CREATE POLICY "Allow users to view own support_tickets"
    ON public.support_tickets
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Policy: Allow service role full access
CREATE POLICY "Allow service_role full access to support_tickets"
    ON public.support_tickets
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
