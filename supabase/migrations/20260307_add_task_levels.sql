-- Migration: Support Dynamic Task Products per VIP Level
-- Adds a `level_id` column to `task_items` to restrict which VIP level can see which products.

-- Add the level_id column, nullable initially to support existing items gracefully
ALTER TABLE public.task_items ADD COLUMN IF NOT EXISTS level_id INTEGER REFERENCES public.levels(id);

-- Optional: Create an index since we will be querying by level_id frequently in the spin logic
CREATE INDEX IF NOT EXISTS idx_task_items_level_id ON public.task_items(level_id);

-- Backwards compatibility: Existing products get assigned to Level 1 by default if they don't have one
UPDATE public.task_items SET level_id = 1 WHERE level_id IS NULL;
