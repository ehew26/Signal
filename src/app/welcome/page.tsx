import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WelcomeClient from './WelcomeClient'

export const dynamic = 'force-dynamic'

export default async function WelcomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email, onboarding_complete')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/signup')

  const { count: memberCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('onboarding_complete', true)

  return (
    <WelcomeClient
      name={profile?.name ?? ''}
      email={profile?.email ?? ''}
      memberCount={memberCount ?? 0}
      launchTarget={150}
    />
  )
}
