-- Fix admin role for existing admin accounts
-- Run this in Supabase SQL Editor

-- Set the primary admin email to admin role
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'amoafop08@gmail.com'
);

-- If you have other admin emails, add them here:
-- UPDATE public.profiles SET role = 'admin'
-- WHERE id IN (SELECT id FROM auth.users WHERE email = 'your-admin@email.com');

-- Verify which profiles are now admin:
SELECT p.id, p.username, p.role, u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';
