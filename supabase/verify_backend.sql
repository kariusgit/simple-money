-- Verification SQL script for backend changes
-- Run these one by one in Supabase SQL Editor to verify logic

-- 1. Check if the RPC function exists
SELECT has_function_privilege('public.complete_user_task(int)', 'execute');

-- 2. Check the trigger function for the correct welcome bonus
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
AND routine_schema = 'public';
-- Verify that 'welcome_bonus NUMERIC := 45.00' is present.

-- 3. Verify RLS policies are active on transactions
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'transactions';

-- 4. Test RPC (Manual check - requires auth.uid() which is hard in SQL Editor)
-- Instead, check if the function body correctly handles referral bonuses (20%)
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'complete_user_task' 
AND routine_schema = 'public';
-- Look for 'v_ref_bonus := ROUND((v_earned_amount * 0.20), 2);'
