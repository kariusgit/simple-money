-- Fix missing Insert policy for transactions
-- Run this in your Supabase SQL Editor

-- 1. Transactions: allow users to insert their own transactions (for task commissions)
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
