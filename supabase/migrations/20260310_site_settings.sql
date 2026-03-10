-- Create site_settings table for admin-controlled configurations
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Select policy: everyone can read
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT USING (true);

-- Update policy: only admins can update
CREATE POLICY "Admins can update site settings" ON site_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert policy: only admins can insert
CREATE POLICY "Admins can insert site settings" ON site_settings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seed initial configuration
INSERT INTO site_settings (key, value, description) VALUES
  ('currency', '{"default": "USDT", "symbol": "$", "conversion_rate": 1.0, "is_locked": false}', 'System-wide currency settings'),
  ('languages', '["English", "Spanish", "French", "German", "Chinese", "Japanese"]', 'List of supported languages'),
  ('theme_colors', '{
    "primary": "#9d50bb", 
    "primary_light": "#c471ed",
    "primary_dark": "#6e48aa",
    "accent": "#00f2ff", 
    "accent_light": "#70f1ff",
    "success": "#00ff88", 
    "warning": "#ffb800", 
    "danger": "#ff4b2b",
    "surface": "#0a050f"
  }', 'Customizable color palette for the platform');
