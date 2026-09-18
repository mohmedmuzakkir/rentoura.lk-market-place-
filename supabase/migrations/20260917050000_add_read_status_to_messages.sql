-- Migration: 20260917050000_add_read_status_to_messages.sql
-- Description: Add is_read and read_at columns to public.messages for real-time per-message read receipts.

ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- Index for fast unread message lookups
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(conversation_id, sender_id, is_read) WHERE is_read = false;
