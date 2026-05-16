export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendWelcomeEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getAdminClient()
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const userId = session.metadata?.supabase_user_id
        if (!userId) break

        await supabase.from('profiles').update({
          subscription_status: 'active',
          stripe_subscription_id: session.subscription,
          onboarding_complete: true,
          onboarding_step: 7,
        }).eq('id', userId)

        // Send welcome email
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', userId)
          .single()

        if (profile) {
          await sendWelcomeEmail(profile.email, profile.name).catch(console.error)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const userId = subscription.metadata?.supabase_user_id
        if (!userId) break

        const statusMap: Record<string, string> = {
          active: 'active',
          past_due: 'paused',
          canceled: 'cancelled',
          unpaid: 'paused',
          trialing: 'active',
        }

        await supabase.from('profiles').update({
          subscription_status: statusMap[subscription.status] || 'inactive',
        }).eq('id', userId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const userId = subscription.metadata?.supabase_user_id
        if (!userId) break

        await supabase.from('profiles').update({
          subscription_status: 'cancelled',
        }).eq('id', userId)
        break
      }

      case 'identity.verification_session.verified': {
        const session = event.data.object as any
        const userId = session.metadata?.supabase_user_id
        if (!userId) break

        await supabase.from('profiles').update({
          verified: true,
          onboarding_step: 6,
        }).eq('id', userId)
        break
      }

      case 'identity.verification_session.requires_input': {
        const session = event.data.object as any
        const userId = session.metadata?.supabase_user_id
        if (!userId) break

        // Verification failed — don't update verified status
        console.log('Verification failed for user:', userId)
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
  }

  return NextResponse.json({ received: true })
}
