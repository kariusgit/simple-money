-- Task Operations Functions
-- This handles task completion securely on the server side

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
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. Get profile and level data
    SELECT 
        p.level_id, p.completed_count, p.current_set, p.wallet_balance, p.profit, p.referred_by,
        l.tasks_per_set, l.sets_per_day, l.commission_rate
    INTO 
        v_level_id, v_completed_count, v_current_set, v_wallet_balance, v_profit, v_referrer_id,
        v_tasks_per_set, v_sets_per_day, v_commission_rate
    FROM public.profiles p
    JOIN public.levels l ON p.level_id = l.id
    WHERE p.id = v_user_id;

    -- 3. Calculate offset for current level
    FOR v_levels_record IN SELECT id, tasks_per_set, sets_per_day FROM public.levels ORDER BY price ASC LOOP
        IF v_levels_record.id = v_level_id THEN
            EXIT;
        END IF;
        v_task_base_offset := v_task_base_offset + (COALESCE(v_levels_record.sets_per_day, 3) * v_levels_record.tasks_per_set);
    END LOOP;

    -- 4. Check limits
    v_tasks_in_current_set := v_completed_count - v_task_base_offset - ((v_current_set - 1) * v_tasks_per_set);
    
    IF v_tasks_in_current_set >= v_tasks_per_set THEN
        RAISE EXCEPTION 'Set limit reached';
    END IF;

    IF v_wallet_balance < 0 THEN
        RAISE EXCEPTION 'Negative balance detected';
    END IF;

    -- 5. Calculate earned amount (Price simulation + Commission)
    -- Random price between 50% and 95% of balance (min 100)
    v_random_price := CASE WHEN v_wallet_balance < 100 THEN 100 ELSE v_wallet_balance END * (0.50 + random() * 0.45);
    v_earned_amount := ROUND((v_random_price * v_commission_rate), 2);

    -- 6. Get task title for records
    SELECT title INTO v_task_title FROM public.task_items WHERE id = p_task_item_id;

    -- 7. Update Profile: add earned amount to wallet and profit, and completed count
    UPDATE public.profiles 
    SET 
        wallet_balance = wallet_balance + v_earned_amount,
        profit = profit + v_earned_amount,
        completed_count = completed_count + 1
    WHERE id = v_user_id
    RETURNING wallet_balance INTO v_new_wallet_balance;

    -- 8. Insert User Task record
    INSERT INTO public.user_tasks (user_id, task_item_id, status, earned_amount, completed_at)
    VALUES (v_user_id, p_task_item_id, 'completed', v_earned_amount, NOW());

    -- 9. Insert Transaction record
    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (v_user_id, 'commission', v_earned_amount, 'Commission from task: ' || COALESCE(v_task_title, 'Optimization'), 'approved');

    -- 10. Check if this is the LAST task of the FIRST set ever (current_set = 1, now tasks_in_current_set + 1 = tasks_per_set)
    --     This is the trigger for the referral bonus.
    IF v_current_set = 1 AND (v_tasks_in_current_set + 1) >= v_tasks_per_set THEN
        v_is_first_set_complete := true;
    END IF;

    -- 11. Referral Bonus: 20% of the invitee's TOTAL wallet balance
    --     Triggered ONLY when invitee completes their first full daily set
    IF v_is_first_set_complete AND v_referrer_id IS NOT NULL THEN
        -- v_new_wallet_balance now includes the profit just earned in step 7
        v_ref_bonus := ROUND((v_new_wallet_balance * 0.20), 2);

        IF v_ref_bonus > 0 THEN
            -- Credit referrer's wallet
            UPDATE public.profiles 
            SET wallet_balance = wallet_balance + v_ref_bonus
            WHERE id = v_referrer_id;

            -- Record the referral commission transaction
            INSERT INTO public.transactions (user_id, type, amount, description, status)
            VALUES (
                v_referrer_id,
                'commission', 
                v_ref_bonus, 
                'Referral Reward: 20% of invitee total balance after first set completion',
                'approved'
            );

            -- Notify the referrer
            INSERT INTO public.notifications (user_id, title, message, type)
            VALUES (
                v_referrer_id,
                'Referral Bonus Received! 🎉',
                'Your invitee completed their first daily task set. You have received a referral reward of $' || v_ref_bonus::TEXT,
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
