-- Migration: Update all VIP levels to the new 4/45 scale
-- Following the user request for 4 sets of 45 at start, we scale the others accordingly

UPDATE levels SET tasks_per_set = 45, sets_per_day = 4 WHERE id = 1;
UPDATE levels SET tasks_per_set = 50, sets_per_day = 5 WHERE id = 2;
UPDATE levels SET tasks_per_set = 55, sets_per_day = 6 WHERE id = 3;
UPDATE levels SET tasks_per_set = 60, sets_per_day = 7 WHERE id = 4;
UPDATE levels SET tasks_per_set = 65, sets_per_day = 8 WHERE id = 5;

-- Update additional levels if they exist
UPDATE levels SET tasks_per_set = 70, sets_per_day = 9 WHERE id = 6;
UPDATE levels SET tasks_per_set = 75, sets_per_day = 10 WHERE id = 7;
UPDATE levels SET tasks_per_set = 80, sets_per_day = 11 WHERE id = 8;

-- Final verification
SELECT id, name, tasks_per_set, sets_per_day, (tasks_per_set * sets_per_day) as total_products
FROM levels
ORDER BY id;
