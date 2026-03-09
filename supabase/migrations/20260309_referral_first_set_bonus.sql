-- Migration: Referral Bonus on First Set Completion
-- Run this in your Supabase SQL Editor to update the complete_user_task function.
-- This replaces the old per-task 20% referral logic with:
-- → 20% of invitee's TOTAL wallet balance credited to referrer 
-- → Triggered ONLY when invitee completes their FIRST full daily task set

-- Ensure notifications table has the required columns
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can read own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- =============================================
-- UPDATED complete_user_task FUNCTION
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

    -- 3. Calculate offset for current level (total tasks completed in all previous levels)
    FOR v_levels_record IN SELECT id, tasks_per_set, sets_per_day FROM public.levels ORDER BY price ASC LOOP
        IF v_levels_record.id = v_level_id THEN EXIT; END IF;
        v_task_base_offset := v_task_base_offset + (COALESCE(v_levels_record.sets_per_day, 3) * v_levels_record.tasks_per_set);
    END LOOP;

    -- 4. Check set limits
    v_tasks_in_current_set := v_completed_count - v_task_base_offset - ((v_current_set - 1) * v_tasks_per_set);
    
    IF v_tasks_in_current_set >= v_tasks_per_set THEN
        RAISE EXCEPTION 'Set limit reached';
    END IF;

    IF v_wallet_balance < 0 THEN
        RAISE EXCEPTION 'Negative balance detected';
    END IF;

    -- 5. Calculate earned commission amount
    v_random_price := CASE WHEN v_wallet_balance < 100 THEN 100 ELSE v_wallet_balance END * (0.50 + random() * 0.45);
    v_earned_amount := ROUND((v_random_price * v_commission_rate), 2);

    -- 6. Get task title
    SELECT title INTO v_task_title FROM public.task_items WHERE id = p_task_item_id;

    -- 7. Update user profile: add earnings, increment counter
    UPDATE public.profiles 
    SET 
        wallet_balance = wallet_balance + v_earned_amount,
        profit = profit + v_earned_amount,
        completed_count = completed_count + 1
    WHERE id = v_user_id
    RETURNING wallet_balance INTO v_new_wallet_balance;

    -- 8. Insert user_tasks record
    INSERT INTO public.user_tasks (user_id, task_item_id, status, earned_amount, completed_at)
    VALUES (v_user_id, p_task_item_id, 'completed', v_earned_amount, NOW());

    -- 9. Insert commission transaction
    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (v_user_id, 'commission', v_earned_amount, 'Commission from task: ' || COALESCE(v_task_title, 'Optimization'), 'approved');

    -- 10. Detect if this task just completed the FIRST EVER daily set (set 1)
    --     Condition: was on set 1, and tasks_in_current_set + 1 = tasks_per_set
    IF v_current_set = 1 AND (v_tasks_in_current_set + 1) >= v_tasks_per_set THEN
        v_is_first_set_complete := true;
    END IF;

    -- 11. REFERRAL BONUS: 20% of invitee's total wallet balance
    --     Only fires ONCE — when invitee completes their first full set
    IF v_is_first_set_complete AND v_referrer_id IS NOT NULL THEN
        -- v_new_wallet_balance now includes the just-earned profit + any welcome bonus
        v_ref_bonus := ROUND((v_new_wallet_balance * 0.20), 2);

        IF v_ref_bonus > 0 THEN
            -- Credit referrer's wallet (not profit, as this is a team reward)
            UPDATE public.profiles 
            SET wallet_balance = wallet_balance + v_ref_bonus
            WHERE id = v_referrer_id;

            -- Log the referral bonus transaction
            INSERT INTO public.transactions (user_id, type, amount, description, status)
            VALUES (
                v_referrer_id,
                'commission',
                v_ref_bonus,
                'Referral Reward: 20% of invitee total wallet balance on first set completion',
                'approved'
            );

            -- Notify the referrer
            INSERT INTO public.notifications (user_id, title, message, type)
            VALUES (
                v_referrer_id,
                'Referral Bonus Received! 🎉',
                'Your invitee completed their first daily task set. You received $' || v_ref_bonus::TEXT || ' (20% of their $' || v_new_wallet_balance::TEXT || ' wallet balance).',
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.complete_user_task(INT) TO authenticated;
