-- Create mods table
CREATE TABLE IF NOT EXISTS public.mods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'free', -- 'free' or 'vip'
  download_url TEXT, -- direct link for free mods
  discord_url TEXT, -- discord link for vip mods
  images TEXT[] DEFAULT '{}', -- array of image URLs
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.mods ENABLE ROW LEVEL SECURITY;

-- Anyone can read mods
CREATE POLICY "mods_select_all" ON public.mods
  FOR SELECT USING (true);

-- Only authenticated admin can insert
CREATE POLICY "mods_insert_admin" ON public.mods
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Only authenticated admin can update
CREATE POLICY "mods_update_admin" ON public.mods
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Only authenticated admin can delete
CREATE POLICY "mods_delete_admin" ON public.mods
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Trigger to update updated_at on row update
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS mods_updated_at ON public.mods;
CREATE TRIGGER mods_updated_at
  BEFORE UPDATE ON public.mods
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
