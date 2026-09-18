-- Migration: 20260917040000_add_type_to_conversations.sql
-- Description: Add type column to public.conversations to distinguish job applications from standard chat messages.

ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'chat';

-- Index for fast filtering by conversation type
CREATE INDEX IF NOT EXISTS idx_conversations_type ON public.conversations(type);
