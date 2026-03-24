-- 20260225_initial_schema.sql
-- Initial schema: create core tables and columns to satisfy later migrations

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    full_name text,
    phone text,
    wallet_address text,
    security_pin text,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    balance numeric DEFAULT 0,
    vip_level int DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES public.profiles(id),
    role text,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    level int DEFAULT 1,
    points int DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. Bundles table
CREATE TABLE IF NOT EXISTS public.bundles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id),
    status text DEFAULT 'pending',
    total_amount numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 6. Deposits table
CREATE TABLE IF NOT EXISTS public.deposits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id),
    amount numeric NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now()
);

-- 7. Withdrawals table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id),
    amount numeric NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now()
);

-- 8. Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id uuid REFERENCES public.users(id),
    referred_id uuid REFERENCES public.users(id),
    bonus numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 9. Settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value text,
    created_at timestamp with time zone DEFAULT now()
);

-- 10. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id),
    message text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 11. Levels table
CREATE TABLE IF NOT EXISTS public.levels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    difficulty int DEFAULT 1,
    reward numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 12. Add common indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_bundles_user_id ON public.bundles(user_id);
