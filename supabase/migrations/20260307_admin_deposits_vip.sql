-- Add status to transactions table to support the admin approval flow
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

-- Clean up any existing rows that might have invalid or NULL statuses
UPDATE public.transactions 
SET status = 'approved' 
WHERE status IS NULL OR status NOT IN ('pending', 'approved', 'rejected');

-- Ensure only valid statuses are allowed moving forward
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_transaction_status'
    ) THEN
        ALTER TABLE public.transactions
        ADD CONSTRAINT check_transaction_status 
        CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;
