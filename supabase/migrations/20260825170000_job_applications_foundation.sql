-- Migration: 20260825170000_job_applications_foundation.sql
-- Description: Create job_applications table with RLS policies and performance indexes.

CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    applicant_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    cover_note TEXT,
    resume_url TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'viewed', 'shortlisted', 'rejected', 'withdrawn')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT job_applications_job_applicant_unique UNIQUE (job_listing_id, applicant_id)
);

-- Indexes for lookup performance
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_listing_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications(applicant_id);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Applicant can read their own applications
CREATE POLICY "Applicants can read own applications"
    ON public.job_applications
    FOR SELECT
    USING (auth.uid() = applicant_id);

-- Policy 2: Job listing owner can read applications for their jobs
CREATE POLICY "Job owners can read job applications"
    ON public.job_applications
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT owner_id FROM public.listings WHERE id = job_applications.job_listing_id
        )
    );

-- Policy 3: Applicant can insert application if authenticated and not the job owner
CREATE POLICY "Applicants can insert job applications"
    ON public.job_applications
    FOR INSERT
    WITH CHECK (
        auth.uid() = applicant_id
        AND auth.uid() <> (
            SELECT owner_id FROM public.listings WHERE id = job_applications.job_listing_id
        )
    );

-- Policy 4: Applicant can withdraw own application
CREATE POLICY "Applicants can withdraw own application"
    ON public.job_applications
    FOR UPDATE
    USING (auth.uid() = applicant_id)
    WITH CHECK (auth.uid() = applicant_id AND status = 'withdrawn');

-- Policy 5: Job owner can update application status (e.g. viewed, shortlisted, rejected)
CREATE POLICY "Job owners can update application status"
    ON public.job_applications
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT owner_id FROM public.listings WHERE id = job_applications.job_listing_id
        )
    );

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON public.job_applications TO authenticated;
