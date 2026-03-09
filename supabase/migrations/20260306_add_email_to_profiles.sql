-- Migration: Add email column to profiles table
-- This allows username and phone-based login by looking up the email

-- Step 1: Add email column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';

-- Step 2: Backfill email from auth.users for existing profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- Step 3: Add an index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Step 4: Update the handle_new_user trigger to also store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_referral_code TEXT;
  user_username TEXT;
  user_phone TEXT;
  user_referred_by TEXT;
  welcome_bonus NUMERIC := 0;
BEGIN
  -- Get metadata from signup
  user_username := COALESCE(NEW.raw_user_meta_data->>'username', 'User_' || substr(NEW.id::text, 1, 8));
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_referred_by := NEW.raw_user_meta_data->>'referred_by';
  
  -- Check if this is the first admin user
  IF NEW.email = 'amoafop08@gmail.com' THEN
     new_referral_code := '1234';
     welcome_bonus := 25.00;
  ELSE
     new_referral_code := upper(substr(md5(random()::text), 1, 4));
     IF user_referred_by IS NOT NULL AND user_referred_by != '' AND user_referred_by != 'VIP1' THEN
       welcome_bonus := 25.00;
     END IF;
  END IF;

  -- Insert profile WITH email now
  INSERT INTO public.profiles (id, username, phone, email, role, referral_code, referred_by, wallet_balance, profit, frozen_amount)
  VALUES (
    NEW.id,
    user_username,
    user_phone,
    NEW.email,
    CASE WHEN NEW.email = 'amoafop08@gmail.com' THEN 'admin' ELSE 'user' END,
    new_referral_code,
    user_referred_by,
    welcome_bonus,
    0,
    0
  );

  -- Create referral code entry
  INSERT INTO public.referral_codes (code, owner_id, is_active)
  VALUES (new_referral_code, NEW.id, true);

  -- If referred by someone, increment their referral count
  IF user_referred_by IS NOT NULL AND user_referred_by != '' AND user_referred_by != 'VIP1' THEN
    UPDATE public.referral_codes
    SET uses_count = uses_count + 1
    WHERE code = user_referred_by;

    INSERT INTO public.transactions (user_id, type, amount, description)
    VALUES (NEW.id, 'deposit', welcome_bonus, 'Welcome bonus - Referral signup ($25)');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
