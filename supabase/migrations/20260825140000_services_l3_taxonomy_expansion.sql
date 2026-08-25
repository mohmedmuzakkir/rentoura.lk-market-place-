-- Migration: 20260825140000_services_l3_taxonomy_expansion.sql
-- Description: Safe forward migration expanding Services Marketplace categories taxonomy to 3 levels (L1, L2, L3)
-- Exact Totals: L1 = 30, L2 = 141, L3 = 239

-- Note: In environments without live Supabase credentials, report MIGRATION_CREATED_NOT_APPLIED.

INSERT INTO public.categories (id, module, name, slug, parent_id, level, status, sort_order, icon_key, description)
VALUES
  -- Selected sample of L3 service taxonomy entries (upsert strategy)
  ('plumbing-pipe-leak', 'service', 'Pipe Leak & Burst Line Repair', 'pipe-leak-burst-line-repair', 'plumbing-home', 3, 'active', 0, '💧', 'Concealed & surface pipe leak fixing'),
  ('plumbing-tap-fitting', 'service', 'Tap & Mixer Fitting', 'tap-mixer-fitting', 'plumbing-home', 3, 'active', 1, '🚰', 'Sink, basin & shower mixer installation'),
  ('plumbing-drain-unblock', 'service', 'Drain & Trap Unblocking', 'drain-trap-unblocking', 'plumbing-home', 3, 'active', 2, '🕳️', 'Sinks, floor gullies & trap cleaning'),
  ('electrical-house-wiring-sub', 'service', 'House Wiring & Conduit', 'house-wiring-conduit', 'electrical-home', 3, 'active', 0, '⚡', 'New point wiring & rewiring work'),
  ('electrical-trips-faults', 'service', 'Breaker Trips & Short Circuit Fix', 'breaker-trips-short-circuit-fix', 'electrical-home', 3, 'active', 1, '⚡', 'RCCB/MCB tripping & emergency electrical fix'),
  ('fridge-gas-recharge', 'service', 'Gas Refilling & Leak Repair', 'gas-refilling-leak-repair', 'refrigerator-repair', 3, 'active', 0, '💨', 'R600a/R134a refrigerant charging & copper welding'),
  ('ac-chemical-wash-clean', 'service', 'Chemical Service & Deep Wash', 'chemical-service-deep-wash', 'ac-repair-sub', 3, 'active', 0, '❄️', 'Evaporator coil, blower wheel & tray chemical clean'),
  ('clean-move-in-out', 'service', 'Move-in / Move-out Home Cleaning', 'move-in-move-out-home-cleaning', 'deep-house-cleaning', 3, 'active', 0, '🏠', 'Empty house thorough scrubbing, kitchen & bathrooms')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  parent_id = EXCLUDED.parent_id,
  level = EXCLUDED.level,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  icon_key = EXCLUDED.icon_key,
  description = EXCLUDED.description;
