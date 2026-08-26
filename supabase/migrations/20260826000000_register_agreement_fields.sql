-- RENTOURA.LK — REGISTRATION & USER AGREEMENT SCHEMA FOUNDATION
-- Ensure public.profiles table contains agreement tracking and normalized phone fields.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS agreement_version text DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS agreement_accepted_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS phone_normalized text;
