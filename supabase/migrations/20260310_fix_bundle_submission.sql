-- Migration: Ensure Profile Integrity and RLS
-- This migration ensures all users have the required columns and correct permissions

-- 1. Ensure columns exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_profit') THEN
    ALTER TABLE public.profiles ADD COLUMN total_profit DECIMAL(12,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_reset_at') THEN
    ALTER TABLE public.profiles ADD COLUMN last_reset_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- 2. Backfill if null
UPDATE public.profiles SET total_profit = profit WHERE total_profit IS NULL;
UPDATE public.profiles SET last_reset_at = NOW() WHERE last_reset_at IS NULL;

-- 3. Ensure RLS is active and correct
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 4. FINAL ROBUST complete_user_task with 24h RESET, $65 MIN BALANCE, and DAILY REFERRAL COMMISSIONS
CREATE OR REPLACE FUNCTION public.complete_user_task(p_task_item_id INT)
RETURNS json AS $$
DECLARE
    v_user_id UUID;
    v_level_id INT;
    v_completed_count INT;
    v_current_set INT;
    v_tasks_per_set INT;
    v_sets_per_day INT;
    v_commission_rate DECIMAL(5,4);
    v_wallet_balance DECIMAL(12,2);
    v_profit DECIMAL(12,2);
    v_total_profit DECIMAL(12,2);
    v_last_reset_at TIMESTAMPTZ;
    v_task_base_offset INT := 0;
    v_tasks_in_current_set INT;
    v_earned_amount DECIMAL(10,2);
    v_random_price DECIMAL(10,2);
    v_referrer_id UUID;
    v_ref_bonus DECIMAL(10,2);
    v_task_title TEXT;
    v_levels_record RECORD;
    v_new_wallet_balance DECIMAL(12,2);
    v_is_first_set_complete BOOLEAN := false;
    v_pending_bundle JSONB;
    v_bundle_target_index INT;
    v_is_bundle_task BOOLEAN := false;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    -- Fetch profile data
    SELECT 
        COALESCE(p.level_id, 1), COALESCE(p.completed_count, 0), COALESCE(p.current_set, 1), 
        COALESCE(p.wallet_balance, 0.00), COALESCE(p.profit, 0.00), COALESCE(p.total_profit, 0.00),
        p.referred_by, COALESCE(p.last_reset_at, NOW()), p.pending_bundle
    INTO 
        v_level_id, v_completed_count, v_current_set, 
        v_wallet_balance, v_profit, v_total_profit,
        v_referrer_id, v_last_reset_at, v_pending_bundle
    FROM public.profiles p
    WHERE p.id = v_user_id;

    -- 24 HOUR RESET LOGIC
    IF NOW() - v_last_reset_at >= INTERVAL '24 hours' THEN
        v_profit := 0;
        v_current_set := 1;
        v_last_reset_at := NOW();
        
        UPDATE public.profiles SET profit = 0, current_set = 1, last_reset_at = v_last_reset_at WHERE id = v_user_id;
    END IF;

    -- MINIMUM BALANCE CHECK ($65)
    IF v_wallet_balance < 65 THEN
        RAISE EXCEPTION 'Minimum amount required to start task is $65';
    END IF;

    -- Get level limits
    SELECT tasks_per_set, sets_per_day, commission_rate
    INTO v_tasks_per_set, v_sets_per_day, v_commission_rate
    FROM public.levels WHERE id = v_level_id;

    IF v_tasks_per_set IS NULL THEN
        v_tasks_per_set := 40; v_sets_per_day := 3; v_commission_rate := 0.0045;
    END IF;

    -- Calculate offset
    FOR v_levels_record IN SELECT id, tasks_per_set, sets_per_day FROM public.levels ORDER BY price ASC LOOP
        IF v_levels_record.id = v_level_id THEN EXIT; END IF;
        v_task_base_offset := v_task_base_offset + (COALESCE(v_levels_record.sets_per_day, 3) * COALESCE(v_levels_record.tasks_per_set, 40));
    END LOOP;

    v_tasks_in_current_set := v_completed_count - v_task_base_offset - ((v_current_set - 1) * v_tasks_per_set);
    
    IF v_tasks_in_current_set >= v_tasks_per_set THEN
        RAISE EXCEPTION 'Daily set sequence completed. Contact support to unlock next set.';
    END IF;

    IF v_wallet_balance < 0 THEN
        RAISE EXCEPTION 'Account restricted due to deficit. Please settle balance to continue.';
    END IF;

    -- BUNDLE LOGIC: If user has a pending bundle for this specific task index
    IF v_pending_bundle IS NOT NULL THEN
        -- If a pending bundle exists, this submission MUST fulfill it.
        v_random_price := (v_pending_bundle->>'totalAmount')::DECIMAL;
        v_earned_amount := (v_pending_bundle->>'bonusAmount')::DECIMAL;
        v_is_bundle_task := true;
    END IF;

    -- If NOT a bundle, use regular random simulation
    IF NOT v_is_bundle_task THEN
        -- Calculate earnings (Simulated Product Value should be LESS than wallet balance)
        -- We'll use 40% to 85% of the balance to simulate a purchasable product price
        v_random_price := (v_wallet_balance * (0.40 + random() * 0.45));
        
        -- Ensure price doesn't feel 'empty' if balance is high but random is low
        IF v_random_price < 50 AND v_wallet_balance >= 65 THEN
            v_random_price := v_wallet_balance * 0.8;
        END IF;

        v_earned_amount := ROUND((v_random_price * v_commission_rate), 2);
    END IF;

    SELECT title INTO v_task_title FROM public.task_items WHERE id = p_task_item_id;

    -- UPDATE PROFILE: Increment Profit and TOTAL PROFIT
    UPDATE public.profiles 
    SET 
        wallet_balance = wallet_balance + v_earned_amount,
        profit = profit + v_earned_amount,
        total_profit = total_profit + v_earned_amount,
        completed_count = completed_count + 1
    WHERE id = v_user_id
    RETURNING wallet_balance INTO v_new_wallet_balance;

    -- Log records
    -- 1. If bundle, remove the pending record and the profile field
    IF v_is_bundle_task THEN
        UPDATE public.profiles SET pending_bundle = NULL WHERE id = v_user_id;
        DELETE FROM public.user_tasks WHERE user_id = v_user_id AND status = 'pending';
    END IF;
 
    INSERT INTO public.user_tasks (user_id, task_item_id, status, earned_amount, completed_at)
    VALUES (v_user_id, p_task_item_id, 'completed', v_earned_amount, NOW());

    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (v_user_id, 'commission', v_earned_amount, 'Optimization Reward: ' || COALESCE(v_task_title, 'Standard Task'), 'approved');

    -- DAILY REFERRAL BONUS (20% of TOTAL DAILY PROFIT)
    -- This is ONLY activated when ALL sets for the day are completed
    IF v_referrer_id IS NOT NULL AND (v_tasks_in_current_set + 1) >= v_tasks_per_set AND v_current_set >= v_sets_per_day THEN
        -- Calculate 20% of the profit earned TODAY (v_profit + current task commission)
        v_ref_bonus := ROUND(((v_profit + v_earned_amount) * 0.20), 2);
        
        IF v_ref_bonus > 0 THEN
            UPDATE public.profiles SET wallet_balance = wallet_balance + v_ref_bonus WHERE id = v_referrer_id;
            INSERT INTO public.transactions (user_id, type, amount, description, status)
            VALUES (v_referrer_id, 'commission', v_ref_bonus, 'Full Daily Cycle Referral Commission (20%)', 'approved');
        END IF;
    END IF;

    -- Detect set completion for return JSON
    IF (v_tasks_in_current_set + 1) >= v_tasks_per_set THEN
        v_is_first_set_complete := true;
    END IF;

    RETURN json_build_object(
        'success', true,
        'earned_amount', v_earned_amount,
        'new_balance', v_new_wallet_balance,
        'set_complete', v_is_first_set_complete,
        'profit', (v_profit + v_earned_amount),
        'total_profit', (v_total_profit + v_earned_amount),
        'is_bundle', v_is_bundle_task
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ROBUST handle_new_user with USERNAME COLLISION PROTECTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_referral_code TEXT;
  user_username TEXT;
  user_phone TEXT;
  user_referred_by_code TEXT;
  referrer_uuid UUID := NULL;
  welcome_bonus NUMERIC := 45.00;
  v_retry_count INT := 0;
  v_unique_username TEXT;
BEGIN
  -- 1. Gather Basic Metadata
  user_username := COALESCE(NEW.raw_user_meta_data->>'username', 'User_' || substr(NEW.id::text, 1, 8));
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_referred_by_code := NEW.raw_user_meta_data->>'referred_by';
  v_unique_username := user_username;
  
  -- 2. Generate Referral Code
  IF NEW.email = 'amoafop08@gmail.com' THEN
     new_referral_code := '1234';
  ELSE
     new_referral_code := upper(substr(md5(random()::text), 1, 4));
     
     IF user_referred_by_code IS NOT NULL AND user_referred_by_code != '' AND user_referred_by_code != 'VIP1' THEN
       SELECT owner_id INTO referrer_uuid FROM public.referral_codes WHERE code = user_referred_by_code LIMIT 1;
     END IF;
  END IF;

  -- 3. Insert Profile with COLLISION RETRY
  WHILE v_retry_count < 5 LOOP
    BEGIN
      INSERT INTO public.profiles (
        id, username, phone, email, role, referral_code, referred_by, 
        wallet_balance, profit, total_profit, frozen_amount, last_reset_at
      )
      VALUES (
        NEW.id,
        v_unique_username,
        user_phone,
        NEW.email,
        CASE WHEN NEW.email = 'amoafop08@gmail.com' THEN 'admin' ELSE 'user' END,
        new_referral_code,
        referrer_uuid,
        welcome_bonus,
        0,
        0,
        0,
        NOW()
      );
      
      -- If insert succeeds, exit loop
      EXIT;
      
    EXCEPTION WHEN unique_violation THEN
      -- If username is taken, append random tag and retry
      IF sqlerrm LIKE '%profiles_username_key%' THEN
        v_unique_username := user_username || '_' || substr(md5(random()::text), 1, 3);
        v_retry_count := v_retry_count + 1;
      ELSE
        -- If it's a different unique constraint (like ID), just fail
        RAISE EXCEPTION 'Profile creation failed: %', sqlerrm;
      END IF;
    END;
  END LOOP;

  -- 4. Create internal referral record
  INSERT INTO public.referral_codes (code, owner_id, is_active)
  VALUES (new_referral_code, NEW.id, true);

  -- 5. Log initial transaction
  INSERT INTO public.transactions (user_id, type, amount, description, status)
  VALUES (NEW.id, 'recharge', welcome_bonus, 'Neural Node Activation Bonus ($45)', 'approved');

  IF referrer_uuid IS NOT NULL THEN
    UPDATE public.referral_codes
    SET uses_count = uses_count + 1
    WHERE code = user_referred_by_code;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
