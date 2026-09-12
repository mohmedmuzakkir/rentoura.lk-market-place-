BEGIN;
-- Set up auth context for user eaaad6c6-88da-4a62-b9a2-d38bd386853f
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub": "eaaad6c6-88da-4a62-b9a2-d38bd386853f"}';

-- Get the last conversation created
DO $$
DECLARE
  v_conv_id uuid;
  v_listing_owner uuid := 'ce3c02d1-2182-411a-8f5b-09ecfec42a0a'; -- Some UUID for testing
BEGIN
  -- Insert conversation
  INSERT INTO public.conversations (listing_id, created_by)
  VALUES ('fbd57558-eb6c-4c1b-9978-2478b5d677a3', 'eaaad6c6-88da-4a62-b9a2-d38bd386853f')
  RETURNING id INTO v_conv_id;

  RAISE NOTICE 'Inserted conversation %', v_conv_id;

  -- Insert participants
  INSERT INTO public.conversation_participants (conversation_id, user_id, role)
  VALUES 
    (v_conv_id, 'eaaad6c6-88da-4a62-b9a2-d38bd386853f', 'inquirer'),
    (v_conv_id, v_listing_owner, 'owner');

  RAISE NOTICE 'Inserted participants successfully';
END $$;
ROLLBACK;
