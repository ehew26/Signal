-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
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

-- Photos table
CREATE TABLE public.photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice prompts table
CREATE TABLE public.voice_prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  prompt_question TEXT NOT NULL,
  audio_url TEXT,
  storage_path TEXT,
  duration_seconds INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interests table
CREATE TABLE public.interests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tag)
);

-- Weekly matches table
CREATE TABLE public.weekly_matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signaled', 'passed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, matched_user_id, week_date)
);

-- Signals table (like/interest)
CREATE TABLE public.signals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- Matches table (mutual signals)
CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist table
CREATE TABLE public.waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  city TEXT,
  seeking TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ghost warnings table
CREATE TABLE public.ghost_warnings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  warning_sent_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

-- RLS Policies
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

-- Profile policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view matched profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE (user_id_1 = auth.uid() AND user_id_2 = id)
      OR (user_id_2 = auth.uid() AND user_id_1 = id)
    )
    OR
    EXISTS (
      SELECT 1 FROM public.weekly_matches
      WHERE user_id = auth.uid() AND matched_user_id = id
    )
  );
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Photos policies
CREATE POLICY "Anyone can view photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Users manage own photos" ON public.photos
  FOR ALL USING (auth.uid() = user_id);

-- Voice prompts policies
CREATE POLICY "Anyone can view voice prompts" ON public.voice_prompts FOR SELECT USING (true);
CREATE POLICY "Users manage own voice prompts" ON public.voice_prompts
  FOR ALL USING (auth.uid() = user_id);

-- Interests policies
CREATE POLICY "Anyone can view interests" ON public.interests FOR SELECT USING (true);
CREATE POLICY "Users manage own interests" ON public.interests
  FOR ALL USING (auth.uid() = user_id);

-- Weekly matches policies
CREATE POLICY "Users view own weekly matches" ON public.weekly_matches
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own weekly matches" ON public.weekly_matches
  FOR UPDATE USING (auth.uid() = user_id);

-- Signals policies
CREATE POLICY "Users manage own signals" ON public.signals
  FOR ALL USING (auth.uid() = from_user_id);
CREATE POLICY "Users view signals to them" ON public.signals
  FOR SELECT USING (auth.uid() = to_user_id);

-- Matches policies
CREATE POLICY "Users view own matches" ON public.matches
  FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Messages policies
CREATE POLICY "Match participants view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );
CREATE POLICY "Match participants send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );
CREATE POLICY "Users mark own messages read" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );

-- Waitlist policies
CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view waitlist" ON public.waitlist FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Indexes
CREATE INDEX idx_weekly_matches_user ON public.weekly_matches(user_id, week_date);
CREATE INDEX idx_messages_match ON public.messages(match_id, created_at);
CREATE INDEX idx_matches_users ON public.matches(user_id_1, user_id_2);
CREATE INDEX idx_signals_from ON public.signals(from_user_id);
CREATE INDEX idx_signals_to ON public.signals(to_user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
