-- UPDATED complete_user_task FUNCTION with robustness
-- This version handles missing levels and ensures no NULL propagation.
-- =============================================
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
    -- 1. Get current user ID
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required. Please log in again.';
    END IF;

    -- 2. Get profile and level data with FALLBACKS for NULLs
    -- Use a subquery or join with COALESCE for level_id
    SELECT 
        COALESCE(p.level_id, 1), 
        COALESCE(p.completed_count, 0), 
        COALESCE(p.current_set, 1), 
        COALESCE(p.wallet_balance, 0.00), 
        COALESCE(p.profit, 0.00), 
        p.referred_by
    INTO 
        v_level_id, v_completed_count, v_current_set, v_wallet_balance, v_profit, v_referrer_id_str
    FROM public.profiles p
    WHERE p.id = v_user_id;

    IF v_level_id IS NULL THEN
        RAISE EXCEPTION 'Account initialization error: Level not assigned.';
    END IF;

    -- 3. Get specific level data
    SELECT 
        COALESCE(tasks_per_set, 40), 
        COALESCE(sets_per_day, 3), 
        COALESCE(commission_rate, 0.0045)
    INTO 
        v_tasks_per_set, v_sets_per_day, v_commission_rate
    FROM public.levels 
    WHERE id = v_level_id;

    IF v_tasks_per_set IS NULL THEN
        -- Fallback if specific level record is missing
        v_tasks_per_set := 40;
        v_sets_per_day := 3;
        v_commission_rate := 0.0045;
    END IF;

    -- 4. Safe cast for referrer UUID if it exists
    IF v_referrer_id_str IS NOT NULL AND v_referrer_id_str <> '' THEN
        BEGIN
            v_referrer_id := v_referrer_id_str::UUID;
        EXCEPTION WHEN OTHERS THEN
            v_referrer_id := NULL;
        END;
    END IF;

    -- 5. Calculate offset for current level (total tasks completed in all previous levels)
    FOR v_levels_record IN SELECT id, tasks_per_set, sets_per_day FROM public.levels ORDER BY price ASC LOOP
        IF v_levels_record.id = v_level_id THEN EXIT; END IF;
        v_task_base_offset := v_task_base_offset + (COALESCE(v_levels_record.sets_per_day, 3) * COALESCE(v_levels_record.tasks_per_set, 40));
    END LOOP;

    -- 6. Check set limits
    v_tasks_in_current_set := v_completed_count - v_task_base_offset - ((v_current_set - 1) * v_tasks_per_set);
    
    IF v_tasks_in_current_set >= v_tasks_per_set THEN
        RAISE EXCEPTION 'Daily limit reached for this set. Please contact support to unlock.';
    END IF;

    IF v_wallet_balance < 0 THEN
        RAISE EXCEPTION 'Negative balance detected. Optimization suspended until settlement.';
    END IF;

    -- 7. Calculate earned commission amount
    v_random_price := CASE WHEN v_wallet_balance < 100 THEN 100 ELSE v_wallet_balance END * (0.50 + random() * 0.45);
    v_earned_amount := ROUND((v_random_price * v_commission_rate), 2);

    -- 8. Get task title
    SELECT title INTO v_task_title FROM public.task_items WHERE id = p_task_item_id;

    -- 9. Update user profile: add earnings, increment counter
    UPDATE public.profiles 
    SET 
        wallet_balance = wallet_balance + v_earned_amount,
        profit = profit + v_earned_amount,
        completed_count = completed_count + 1
    WHERE id = v_user_id
    RETURNING wallet_balance INTO v_new_wallet_balance;

    -- 10. Insert user_tasks record
    INSERT INTO public.user_tasks (user_id, task_item_id, status, earned_amount, completed_at)
    VALUES (v_user_id, p_task_item_id, 'completed', v_earned_amount, NOW());

    -- 11. Insert commission transaction
    -- Ensure status column exists (already checked and handled in separate migrations, but status := 'approved' is safe if it exists)
    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (v_user_id, 'commission', v_earned_amount, 'Optimization Reward: ' || COALESCE(v_task_title, 'Standard Task'), 'approved');

    -- 12. Detect if this task just completed the FIRST EVER daily set (set 1)
    IF v_current_set = 1 AND (v_tasks_in_current_set + 1) >= v_tasks_per_set THEN
        v_is_first_set_complete := true;
    END IF;

    -- 13. REFERRAL BONUS: 20% of invitee's total wallet balance
    IF v_is_first_set_complete AND v_referrer_id IS NOT NULL THEN
        v_ref_bonus := ROUND((v_new_wallet_balance * 0.20), 2);

        IF v_ref_bonus > 0 THEN
            UPDATE public.profiles 
            SET wallet_balance = wallet_balance + v_ref_bonus
            WHERE id = v_referrer_id;

            INSERT INTO public.transactions (user_id, type, amount, description, status)
            VALUES (
                v_referrer_id,
                'commission',
                v_ref_bonus,
                'Referral Bonus: 20% of invitee first set completion',
                'approved'
            );

            INSERT INTO public.notifications (user_id, title, message, type)
            VALUES (
                v_referrer_id,
                'Commission Reward! 🎉',
                'Your referral completed their first set. You received $' || v_ref_bonus::TEXT || '.',
                'success'
            );
        END IF;
    END IF;

    RETURN json_build_object(
        'success', true,
        'earned_amount', v_earned_amount,
        'new_balance', v_new_wallet_balance,
        'first_set_complete', v_is_first_set_complete
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
