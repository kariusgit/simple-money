-- Admin Dashboard Overhaul Migration
-- Run this in Supabase SQL Editor

-- 1. Add status to transactions (pending/approved/rejected)
ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS network TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS wallet_address TEXT DEFAULT NULL;

-- Update existing deposits/withdrawals to be 'approved' by default
UPDATE public.transactions SET status = 'approved' WHERE status IS NULL;

-- 2. Create bundle_packages table
CREATE TABLE IF NOT EXISTS public.bundle_packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  required_top_up DECIMAL(12,2) NOT NULL DEFAULT 100,
  bonus_amount DECIMAL(12,2) NOT NULL DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some default bundles if empty
INSERT INTO public.bundle_packages (name, description, required_top_up, bonus_amount)
SELECT 'Starter Pack', 'Entry level bundle with 20% bonus', 100, 20
WHERE NOT EXISTS (SELECT 1 FROM public.bundle_packages LIMIT 1);

INSERT INTO public.bundle_packages (name, description, required_top_up, bonus_amount)
SELECT 'Growth Pack', 'Mid-tier bundle with 25% bonus', 500, 125
WHERE NOT EXISTS (SELECT 1 FROM public.bundle_packages WHERE name = 'Growth Pack');

INSERT INTO public.bundle_packages (name, description, required_top_up, bonus_amount)
SELECT 'Elite Pack', 'Premium bundle with 30% bonus', 2000, 600
WHERE NOT EXISTS (SELECT 1 FROM public.bundle_packages WHERE name = 'Elite Pack');

-- 3. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'danger')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.bundle_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can read bundle_packages (they need to see them in start page)
DROP POLICY IF EXISTS "bundles_public_read" ON public.bundle_packages;
CREATE POLICY "bundles_public_read" ON public.bundle_packages FOR SELECT USING (true);

-- Admin writes bundles
DROP POLICY IF EXISTS "bundles_admin_write" ON public.bundle_packages;
CREATE POLICY "bundles_admin_write" ON public.bundle_packages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS: Users can read their own notifications, admins can write all
DROP POLICY IF EXISTS "notifications_own_read" ON public.notifications;
CREATE POLICY "notifications_own_read" ON public.notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_admin_all" ON public.notifications;
CREATE POLICY "notifications_admin_all" ON public.notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
