-- Add Wallet Address and Security PIN to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS security_pin TEXT DEFAULT NULL;

-- Log the migration
COMMENT ON COLUMN public.profiles.wallet_address IS 'USDT TRC20 Wallet Address bound by the user';
COMMENT ON COLUMN public.profiles.security_pin IS '6-digit PIN used for withdrawals and security center authentication';
