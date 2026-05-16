export interface Profile {
  id: string
  name: string
  email: string
  date_of_birth: string
  age: number
  bio: string | null
  city: string
  state: string
  latitude: number | null
  longitude: number | null
  gender: string
  seeking: string[]
  age_min: number
  age_max: number
  distance_radius: number
  verified: boolean
  subscription_status: string
  strikes: number
  suspended_until: string | null
  is_admin: boolean
  onboarding_step: number
  onboarding_complete: boolean
  created_at: string
}

export interface Photo {
  id: string
  user_id: string
  url: string
  storage_path: string | null
  display_order: number
}

export interface VoicePrompt {
  id: string
  user_id: string
  prompt_question: string
  audio_url: string | null
  duration_seconds: number | null
  display_order: number
}

export interface Interest {
  id: string
  user_id: string
  tag: string
}

export interface WeeklyMatch {
  id: string
  user_id: string
  matched_user_id: string
  week_date: string
  status: 'pending' | 'signaled' | 'passed' | 'expired'
  matched_profile?: Profile
  matched_photos?: Photo[]
  matched_interests?: Interest[]
  matched_voice_prompts?: VoicePrompt[]
}

export interface Match {
  id: string
  user_id_1: string
  user_id_2: string
  last_message_at: string | null
  created_at: string
  other_profile?: Profile
  other_photos?: Photo[]
  last_message?: Message
  unread_count?: number
}

export interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

export interface Signal {
  id: string
  from_user_id: string
  to_user_id: string
  created_at: string
}

export interface WaitlistEntry {
  id: string
  name: string
  email: string
  city: string | null
  seeking: string | null
  created_at: string
}

export const VOICE_PROMPT_QUESTIONS = [
  "Two truths and a lie about me...",
  "My love language in action looks like...",
  "The most spontaneous thing I've ever done...",
  "A green flag I'll never ignore again...",
  "The kind of Sunday morning I want more of...",
  "Something I've completely changed my mind about...",
  "What my best friend would say about me...",
  "I'm looking for someone who...",
]

export const INTEREST_TAGS = [
  "Beach days", "Farmers markets", "Live music", "Fine dining", "Coffee shops",
  "Hiking", "Yoga", "Travel", "Art galleries", "Wine", "Cooking",
  "Boats & water", "Dogs", "Fitness", "Reading", "Film & cinema",
  "Entrepreneurs", "Outdoors", "Concerts", "Museums", "Cycling",
  "Foodie", "Sunset chasing", "Photography", "Local events",
]
