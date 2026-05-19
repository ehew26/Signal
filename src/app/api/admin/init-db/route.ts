import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  age INTEGER GENERATED ALWAYS AS (
    EXTRACT(YEAR FROM AGE(date_of_birth))::INTEGER
  ) STORED,
  bio TEXT,
  city TEXT DEFAULT 'Sarasota',
  state TEXT DEFAULT 'FL',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  gender TEXT CHECK (gender IN ('man', 'woman', 'nonbinary', 'other')),
  seeking TEXT[] DEFAULT '{}',
  age_min INTEGER DEFAULT 21,
  age_max INTEGER DEFAULT 45,
  distance_radius INTEGER DEFAULT 25,
  verified BOOLEAN DEFAULT FALSE,
  verification_session_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'paused', 'cancelled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  strikes INTEGER DEFAULT 0,
  suspensions INTEGER DEFAULT 0,
  suspended_until TIMESTAMPTZ,
  is_admin BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 1,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.voice_prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  prompt_question TEXT NOT NULL,
  audio_url TEXT,
  storage_path TEXT,
  duration_seconds INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tag)
);

CREATE TABLE IF NOT EXISTS public.weekly_matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signaled', 'passed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, matched_user_id, week_date)
);

CREATE TABLE IF NOT EXISTS public.signals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  city TEXT,
  seeking TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ghost_warnings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  warning_sent_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghost_warnings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can view their own profile') THEN
    CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can view matched profiles') THEN
    CREATE POLICY "Users can view matched profiles" ON public.profiles FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.matches WHERE (user_id_1=auth.uid() AND user_id_2=id) OR (user_id_2=auth.uid() AND user_id_1=id))
      OR EXISTS (SELECT 1 FROM public.weekly_matches WHERE user_id=auth.uid() AND matched_user_id=id)
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can insert their own profile') THEN
    CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='photos' AND policyname='Anyone can view photos') THEN
    CREATE POLICY "Anyone can view photos" ON public.photos FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='photos' AND policyname='Users manage own photos') THEN
    CREATE POLICY "Users manage own photos" ON public.photos FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='voice_prompts' AND policyname='Anyone can view voice prompts') THEN
    CREATE POLICY "Anyone can view voice prompts" ON public.voice_prompts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='voice_prompts' AND policyname='Users manage own voice prompts') THEN
    CREATE POLICY "Users manage own voice prompts" ON public.voice_prompts FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='interests' AND policyname='Anyone can view interests') THEN
    CREATE POLICY "Anyone can view interests" ON public.interests FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='interests' AND policyname='Users manage own interests') THEN
    CREATE POLICY "Users manage own interests" ON public.interests FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='weekly_matches' AND policyname='Users view own weekly matches') THEN
    CREATE POLICY "Users view own weekly matches" ON public.weekly_matches FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='weekly_matches' AND policyname='Users update own weekly matches') THEN
    CREATE POLICY "Users update own weekly matches" ON public.weekly_matches FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='signals' AND policyname='Users manage own signals') THEN
    CREATE POLICY "Users manage own signals" ON public.signals FOR ALL USING (auth.uid() = from_user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='signals' AND policyname='Users view signals to them') THEN
    CREATE POLICY "Users view signals to them" ON public.signals FOR SELECT USING (auth.uid() = to_user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='matches' AND policyname='Users view own matches') THEN
    CREATE POLICY "Users view own matches" ON public.matches FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='Match participants view messages') THEN
    CREATE POLICY "Match participants view messages" ON public.messages FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.matches WHERE id=match_id AND (user_id_1=auth.uid() OR user_id_2=auth.uid()))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='Match participants send messages') THEN
    CREATE POLICY "Match participants send messages" ON public.messages FOR INSERT WITH CHECK (
      auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.matches WHERE id=match_id AND (user_id_1=auth.uid() OR user_id_2=auth.uid()))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='waitlist' AND policyname='Anyone can join waitlist') THEN
    CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_weekly_matches_user ON public.weekly_matches(user_id, week_date);
CREATE INDEX IF NOT EXISTS idx_messages_match ON public.messages(match_id, created_at);
CREATE INDEX IF NOT EXISTS idx_matches_users ON public.matches(user_id_1, user_id_2);
CREATE INDEX IF NOT EXISTS idx_signals_from ON public.signals(from_user_id);
CREATE INDEX IF NOT EXISTS idx_signals_to ON public.signals(to_user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
`

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    return NextResponse.json({
      error: 'DATABASE_URL not set. Add it in Vercel: Settings → Environment Variables.',
      hint: 'Get it from Supabase → Settings → Database → Connection string → URI (use the "Session mode" URI on port 5432)',
    }, { status: 500 })
  }

  const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })
  try {
    await pool.query(SCHEMA_SQL)
    return NextResponse.json({ success: true, message: 'Database schema applied successfully.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  } finally {
    await pool.end()
  }
}
