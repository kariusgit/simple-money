-- 20260225_initial_schema.sql
-- Initial schema: create core tables needed for later migrations

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    full_name text,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Admin table (if needed)
CREATE TABLE IF NOT EXISTS public.admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES public.profiles(id),
    role text,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Tasks table (basic structure)
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. Bundles table
CREATE TABLE IF NOT EXISTS public.bundles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id),
    created_at timestamp with time zone DEFAULT now()
);

-- Add other core tables referenced by your later migrations here
