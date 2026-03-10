-- Migration: Add Total Profit tracking and Auto-Reset Logic
-- 1. Add columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_profit DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reset_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Update existing profiles if they exist (initialize last_reset_at)
UPDATE public.profiles SET last_reset_at = NOW() WHERE last_reset_at IS NULL;
UPDATE public.profiles SET total_profit = profit WHERE total_profit IS NULL OR total_profit = 0;

-- 3. Update the handle_new_user trigger to initialize these
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
  
  -- Generage referral code
  IF NEW.email = 'amoafop08@gmail.com' THEN
     new_referral_code := '1234';
  ELSE
     new_referral_code := upper(substr(md5(random()::text), 1, 4));
     
     IF user_referred_by_code IS NOT NULL AND user_referred_by_code != '' AND user_referred_by_code != 'VIP1' THEN
       SELECT owner_id INTO referrer_uuid FROM public.referral_codes WHERE code = user_referred_by_code LIMIT 1;
     END IF;
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (
    id, username, phone, email, role, referral_code, referred_by, 
    wallet_balance, profit, total_profit, frozen_amount, last_reset_at
  )
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
    0,
    0,
    NOW()
  );

  -- Create referral code entry
  INSERT INTO public.referral_codes (code, owner_id, is_active)
  VALUES (new_referral_code, NEW.id, true);

  -- Give welcome bonus transaction
  INSERT INTO public.transactions (user_id, type, amount, description, status)
  VALUES (NEW.id, 'deposit', welcome_bonus, 'Welcome bonus - New member ($45)', 'approved');

  IF referrer_uuid IS NOT NULL THEN
    UPDATE public.referral_codes
    SET uses_count = uses_count + 1
    WHERE code = user_referred_by_code;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FINAL ROBUST complete_user_task with 24h RESET and TOTAL PROFIT
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
    v_referrer_id_str TEXT;
    v_referrer_id UUID;
    v_ref_bonus DECIMAL(10,2);
    v_task_title TEXT;
    v_levels_record RECORD;
    v_new_wallet_balance DECIMAL(12,2);
    v_is_first_set_complete BOOLEAN := false;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    -- Fetch current profile data
    SELECT 
        COALESCE(p.level_id, 1), COALESCE(p.completed_count, 0), COALESCE(p.current_set, 1), 
        COALESCE(p.wallet_balance, 0.00), COALESCE(p.profit, 0.00), COALESCE(p.total_profit, 0.00),
        p.referred_by, COALESCE(p.last_reset_at, NOW())
    INTO 
        v_level_id, v_completed_count, v_current_set, 
        v_wallet_balance, v_profit, v_total_profit,
        v_referrer_id_str, v_last_reset_at
    FROM public.profiles p
    WHERE p.id = v_user_id;

    -- 24 HOUR RESET LOGIC
    IF NOW() - v_last_reset_at >= INTERVAL '24 hours' THEN
        -- It's a new day! Reset counters
        v_profit := 0;
        v_current_set := 1;
        v_last_reset_at := NOW();
        
        -- Update the profile record immediately to reflect the reset
        UPDATE public.profiles 
        SET 
            profit = 0,
            current_set = 1,
            last_reset_at = v_last_reset_at
        WHERE id = v_user_id;
    END IF;

    -- Get level limits
    SELECT tasks_per_set, sets_per_day, commission_rate
    INTO v_tasks_per_set, v_sets_per_day, v_commission_rate
    FROM public.levels WHERE id = v_level_id;

    IF v_tasks_per_set IS NULL THEN
        v_tasks_per_set := 40; v_sets_per_day := 3; v_commission_rate := 0.0045;
    END IF;

    -- Calculate current progress
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

    -- Calculate earnings
    v_random_price := CASE WHEN v_wallet_balance < 100 THEN 100 ELSE v_wallet_balance END * (0.50 + random() * 0.45);
    v_earned_amount := ROUND((v_random_price * v_commission_rate), 2);

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

    -- Log everything
    INSERT INTO public.user_tasks (user_id, task_item_id, status, earned_amount, completed_at)
    VALUES (v_user_id, p_task_item_id, 'completed', v_earned_amount, NOW());

    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (v_user_id, 'commission', v_earned_amount, 'Optimization Reward: ' || COALESCE(v_task_title, 'Standard Task'), 'approved');

    -- Referral check
    IF v_current_set = 1 AND (v_tasks_in_current_set + 1) >= v_tasks_per_set THEN
        v_is_first_set_complete := true;
        IF v_referrer_id_str IS NOT NULL AND v_referrer_id_str <> '' THEN
             BEGIN
                v_referrer_id := v_referrer_id_str::UUID;
                IF v_referrer_id IS NOT NULL THEN
                    v_ref_bonus := ROUND((v_new_wallet_balance * 0.20), 2);
                    IF v_ref_bonus > 0 THEN
                        UPDATE public.profiles SET wallet_balance = wallet_balance + v_ref_bonus WHERE id = v_referrer_id;
                        INSERT INTO public.transactions (user_id, type, amount, description, status)
                        VALUES (v_referrer_id, 'commission', v_ref_bonus, 'Referral Bonus: 20% of invitee first set completion', 'approved');
                    END IF;
                END IF;
             EXCEPTION WHEN OTHERS THEN END;
        END IF;
    END IF;

    RETURN json_build_object(
        'success', true,
        'earned_amount', v_earned_amount,
        'new_balance', v_new_wallet_balance,
        'profit', (v_profit + v_earned_amount),
        'total_profit', (v_total_profit + v_earned_amount)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
