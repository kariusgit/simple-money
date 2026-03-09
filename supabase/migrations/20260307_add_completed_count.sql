-- Migration: Add completed_count to profiles and sync with history
-- Run this in Supabase SQL Editor

-- 1. Add the column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS completed_count INTEGER DEFAULT 0;

-- 2. Initialize with current history
UPDATE public.profiles p
SET completed_count = (
    SELECT count(*) 
    FROM public.user_tasks ut 
    WHERE ut.user_id = p.id 
    AND ut.status = 'completed'
);

-- 3. Update the type definition and logic... (handled in code)
