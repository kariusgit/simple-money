-- Simple Money Platform - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0045,
  tasks_per_set INTEGER NOT NULL DEFAULT 40,
  description TEXT DEFAULT '',
  badge_color TEXT DEFAULT '#06b6d4',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  level_id INTEGER REFERENCES levels(id) DEFAULT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT DEFAULT NULL,
  wallet_balance DECIMAL(12,2) DEFAULT 0,
  profit DECIMAL(12,2) DEFAULT 0,
  frozen_amount DECIMAL(12,2) DEFAULT 0,
  avatar_url TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task items (grid items on Start page)
CREATE TABLE IF NOT EXISTS task_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User tasks (assigned tasks)
CREATE TABLE IF NOT EXISTS user_tasks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  task_item_id INTEGER REFERENCES task_items(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  earned_amount DECIMAL(10,2) DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral codes
CREATE TABLE IF NOT EXISTS referral_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'commission', 'freeze', 'unfreeze')),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Levels: everyone can read
CREATE POLICY "Anyone can view levels" ON levels FOR SELECT USING (true);
CREATE POLICY "Admins can manage levels" ON levels FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Task items: everyone can read active items
CREATE POLICY "Anyone can view active tasks" ON task_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage task items" ON task_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User tasks: users can manage own tasks
CREATE POLICY "Users can view own tasks" ON user_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON user_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all user tasks" ON user_tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Referral codes: everyone can read for validation
CREATE POLICY "Anyone can view active referral codes" ON referral_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own referral codes" ON referral_codes FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all referral codes" ON referral_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Transactions: users can view own
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all transactions" ON transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert seed data for levels
INSERT INTO levels (name, price, commission_rate, tasks_per_set, description, badge_color) VALUES
  ('Level 1 Collector', 100, 0.0045, 40, 'Earn a 0.45% commission on each submitted task, with 40 tasks per set. AI-powered collaboration streamlines processing for faster, more efficient results.', '#06b6d4'),
  ('Level 2 Collector', 500, 0.0060, 50, 'Earn a 0.60% commission on each submitted task, with 50 tasks per set. Enhanced AI tools for premium efficiency.', '#8b5cf6'),
  ('Level 3 Collector', 1000, 0.0080, 60, 'Earn a 0.80% commission on each submitted task, with 60 tasks per set. Top-tier AI collaboration for maximum returns.', '#f59e0b'),
  ('Level 4 Collector', 5000, 0.0120, 80, 'Earn a 1.20% commission on each submitted task, with 80 tasks per set. Elite status with priority processing.', '#ef4444'),
  ('Level 5 Collector', 10000, 0.0150, 100, 'Earn a 1.50% commission on each submitted task, with 100 tasks per set. Diamond tier with exclusive benefits.', '#ec4899');
