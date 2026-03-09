-- Remove VIP Levels 6 and 7
DELETE FROM levels WHERE id IN (6, 7);

-- Optional: Reset users assigned to these levels back to Level 5 (though they likely don't exist yet)
UPDATE profiles SET level_id = 5 WHERE level_id > 5;
