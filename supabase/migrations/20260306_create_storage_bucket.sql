-- Migration: Create Storage Bucket for Task Images
-- Run this in Supabase SQL Editor

-- Insert the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('task_images', 'task_images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage
-- Anyone can view
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'task_images');

-- Admins can upload
CREATE POLICY "Admins can upload task images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'task_images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admins can update their uploads
CREATE POLICY "Admins can update task images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'task_images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admins can delete
CREATE POLICY "Admins can delete task images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'task_images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
