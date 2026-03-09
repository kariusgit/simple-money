-- Migration: Set correct tasks_per_set and sets_per_day for all levels
-- Total catalog: 1300 products
-- Run this in your Supabase SQL Editor

-- Level 1: 40 tasks × 3 sets = 120
UPDATE levels SET tasks_per_set = 40, sets_per_day = 3 WHERE id = 1;

-- Level 2: 45 tasks × 4 sets = 180
UPDATE levels SET tasks_per_set = 45, sets_per_day = 4 WHERE id = 2;

-- Level 3: 50 tasks × 5 sets = 250
UPDATE levels SET tasks_per_set = 50, sets_per_day = 5 WHERE id = 3;

-- Level 4: 55 tasks × 6 sets = 330
UPDATE levels SET tasks_per_set = 55, sets_per_day = 6 WHERE id = 4;

-- Level 5: 60 tasks × 7 sets = 420
UPDATE levels SET tasks_per_set = 60, sets_per_day = 7 WHERE id = 5;

-- Verify result
SELECT id, name, tasks_per_set, sets_per_day, (tasks_per_set * sets_per_day) AS total_products
FROM levels
ORDER BY id;
