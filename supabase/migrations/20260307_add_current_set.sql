-- Migration to add current_set to profiles for gated progression
ALTER TABLE profiles ADD COLUMN current_set INTEGER DEFAULT 1;

-- Initialize current_set based on current progress
-- Users with 0-39 tasks -> Set 1
-- Users with 40-79 tasks -> Set 2
-- Users with 80+ tasks -> Set 3
UPDATE profiles SET current_set = CASE 
    WHEN completed_count < 40 THEN 1
    WHEN completed_count < 80 THEN 2
    ELSE 3
END;
