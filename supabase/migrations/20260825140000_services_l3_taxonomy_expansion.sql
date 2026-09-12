-- Migration: 20260825140000_services_l3_taxonomy_expansion.sql
-- Description: Safe forward migration expanding Services Marketplace categories taxonomy to 3 levels (L1, L2, L3)
-- Note: Replaced with SELECT 1; because original inserted string literals into UUID id column.
-- Taxonomy sync is fully handled by 20260826170000_complete_canonical_l3_taxonomy.sql
SELECT 1;
