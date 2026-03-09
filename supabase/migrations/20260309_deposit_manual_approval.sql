-- Migration: Manual Deposit Approval Setup
-- Adds proof_url to transactions and creates the deposit_proofs storage bucket.

-- 1. Add proof_url to transactions
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS proof_url TEXT DEFAULT NULL;

-- 2. Create deposit_proofs storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('deposit_proofs', 'deposit_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS Policies for deposit_proofs bucket
-- Note: These policies assume standard Supabase storage schema.

-- Users can upload their own proofs
DROP POLICY IF EXISTS "Authenticated users can upload deposit proofs" ON storage.objects;
CREATE POLICY "Authenticated users can upload deposit proofs" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'deposit_proofs' AND 
  auth.role() = 'authenticated'
);

-- Everyone can view (or specifically admins, but making it easy for now)
DROP POLICY IF EXISTS "Public can view deposit proofs" ON storage.objects;
CREATE POLICY "Public can view deposit proofs" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'deposit_proofs');

-- Admins can manage all proofs
DROP POLICY IF EXISTS "Admins can manage deposit proofs" ON storage.objects;
CREATE POLICY "Admins can manage deposit proofs" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'deposit_proofs' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
