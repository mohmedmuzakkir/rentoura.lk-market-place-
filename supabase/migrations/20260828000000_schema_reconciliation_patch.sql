-- Schema Reconciliation Patch
-- This migration aligns the physical database schema with the expectations of the Phase 4 and Phase 5 moderation and administration functions.

ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS actor_name text,
  ADD COLUMN IF NOT EXISTS target_title text,
  ADD COLUMN IF NOT EXISTS details text;
