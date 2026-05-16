import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

export default async function MyProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: photos }, { data: interests }, { data: prompts }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('photos').select('*').eq('user_id', user.id).order('display_order'),
    supabase.from('interests').select('*').eq('user_id', user.id),
    supabase.from('voice_prompts').select('*').eq('user_id', user.id).order('display_order'),
  ])

  if (!profile) redirect('/signup')

  return <ProfileClient profile={profile} photos={photos || []} interests={interests || []} prompts={prompts || []} />
}
