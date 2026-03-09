-- Migration: Add min_withdrawal to levels table
-- Based on the Simple Music Salary Structure Table

-- Add min_withdrawal column
ALTER TABLE public.levels ADD COLUMN IF NOT EXISTS min_withdrawal DECIMAL(12,2) DEFAULT 100;

-- Update existing levels based on the salary structure table
-- Level 1 Collector: min $100
-- Level 2 Collector: min $200  
-- Level 3 Collector: min $300
-- Level 4 Collector: min $400
-- If levels use name-based identification:
UPDATE public.levels SET min_withdrawal = 100 WHERE name ILIKE '%1%' OR name ILIKE '%lv1%' OR name ILIKE '%level 1%';
UPDATE public.levels SET min_withdrawal = 200 WHERE name ILIKE '%2%' OR name ILIKE '%lv2%' OR name ILIKE '%level 2%';
UPDATE public.levels SET min_withdrawal = 300 WHERE name ILIKE '%3%' OR name ILIKE '%lv3%' OR name ILIKE '%level 3%';
UPDATE public.levels SET min_withdrawal = 400 WHERE name ILIKE '%4%' OR name ILIKE '%lv4%' OR name ILIKE '%level 4%';
UPDATE public.levels SET min_withdrawal = 500 WHERE name ILIKE '%5%' OR name ILIKE '%lv5%' OR name ILIKE '%level 5%';

-- Verify:
SELECT id, name, price, min_withdrawal FROM public.levels ORDER BY price;
