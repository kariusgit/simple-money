
-- Add sets_per_day to levels
ALTER TABLE levels ADD COLUMN IF NOT EXISTS sets_per_day INTEGER NOT NULL DEFAULT 3;

-- Add language and currency to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Update levels as per user request
UPDATE levels SET tasks_per_set = 40, sets_per_day = 3, commission_rate = 0.0045 WHERE id = 1;
UPDATE levels SET tasks_per_set = 45, sets_per_day = 4, commission_rate = 0.006 WHERE id = 2;
UPDATE levels SET tasks_per_set = 50, sets_per_day = 5, commission_rate = 0.008 WHERE id = 3;
UPDATE levels SET tasks_per_set = 55, sets_per_day = 6, commission_rate = 0.01 WHERE id = 4;
UPDATE levels SET tasks_per_set = 60, sets_per_day = 7, commission_rate = 0.015 WHERE id = 5;

-- Ensure constraints match app logic
ALTER TABLE user_tasks DROP CONSTRAINT IF EXISTS user_tasks_status_check;
ALTER TABLE user_tasks ADD CONSTRAINT user_tasks_status_check CHECK (status IN ('pending', 'completed', 'cancelled'));
