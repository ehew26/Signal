-- Creator dashboard tables

CREATE TABLE IF NOT EXISTS public.creator_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  onlyfans_url TEXT,
  onlyfans_username TEXT,
  chaturbate_url TEXT,
  chaturbate_username TEXT,
  monthly_goal DECIMAL(10, 2) DEFAULT 1000.00,
  report_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.creator_earnings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('onlyfans', 'chaturbate', 'other')),
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.creator_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('onlyfans', 'chaturbate', 'other')),
  content_type TEXT NOT NULL CHECK (content_type IN ('photo', 'video', 'livestream', 'message', 'post', 'other')),
  title TEXT NOT NULL,
  posted_date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  tips DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS (admin client accesses these directly via service role)
ALTER TABLE public.creator_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_content DISABLE ROW LEVEL SECURITY;
