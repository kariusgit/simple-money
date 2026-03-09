-- Simple Money - Database Trigger for Auto Profile Creation
-- Run this AFTER schema.sql in Supabase SQL Editor
-- This creates a profile automatically when a user signs up

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_referral_code TEXT;
  user_username TEXT;
  user_phone TEXT;
  user_referred_by_code TEXT;
  referrer_uuid UUID := NULL;
  welcome_bonus NUMERIC := 45.00;
BEGIN
  -- Get metadata from signup
  user_username := COALESCE(NEW.raw_user_meta_data->>'username', 'User_' || substr(NEW.id::text, 1, 8));
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_referred_by_code := NEW.raw_user_meta_data->>'referred_by';
  
  -- Check if this is the first admin user
  IF NEW.email = 'amoafop08@gmail.com' THEN
     new_referral_code := '1234'; -- The master first code
  ELSE
     -- Generate a standard 4 character code 
     new_referral_code := upper(substr(md5(random()::text), 1, 4));
     
     -- If referred by someone, look up their UUID
     IF user_referred_by_code IS NOT NULL AND user_referred_by_code != '' AND user_referred_by_code != 'VIP1' THEN
       SELECT owner_id INTO referrer_uuid FROM public.referral_codes WHERE code = user_referred_by_code LIMIT 1;
     END IF;
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (id, username, phone, email, role, referral_code, referred_by, wallet_balance, profit, frozen_amount)
  VALUES (
    NEW.id,
    user_username,
    user_phone,
    NEW.email,
    CASE WHEN NEW.email = 'amoafop08@gmail.com' THEN 'admin' ELSE 'user' END,
    new_referral_code,
    referrer_uuid,
    welcome_bonus,
    0,
    0
  );

  -- Create referral code entry
  INSERT INTO public.referral_codes (code, owner_id, is_active)
  VALUES (new_referral_code, NEW.id, true);

  -- Record the welcome bonus transaction
  INSERT INTO public.transactions (user_id, type, amount, description, status)
  VALUES (NEW.id, 'deposit', welcome_bonus, 'you got a 45$ welcome bonus as a new user', 'approved');

  -- If referred by someone, increment their referral count
  IF referrer_uuid IS NOT NULL THEN
    UPDATE public.referral_codes
    SET uses_count = uses_count + 1
    WHERE code = user_referred_by_code;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
