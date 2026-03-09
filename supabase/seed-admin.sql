-- Fix Admin Username
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/thmjvsetimkvwdwvbgtb/sql/new

UPDATE profiles 
SET username = 'Admin Test' 
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'admin@test.com'
);

-- Verify the fix
SELECT au.email, p.username, p.role
FROM auth.users au
JOIN profiles p ON p.id = au.id
WHERE au.email = 'admin@test.com';
