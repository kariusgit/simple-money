-- Add a pending_bundle column to profiles so admin can manually queue a bundle for a user
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS pending_bundle JSONB DEFAULT NULL;

-- Example structure stored in pending_bundle:
-- {
--   "name": "Special Package",
--   "description": "...",
--   "shortageAmount": 150.00,
--   "totalAmount": 380.00,
--   "bonusAmount": 25.00,
--   "expiresIn": 86400,
--   "assignedBy": "admin",
--   "assignedAt": "2026-03-07T00:00:00Z"
-- }
