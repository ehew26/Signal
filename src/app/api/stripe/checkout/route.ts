export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, SUBSCRIPTION_PRICE_ID } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!SUBSCRIPTION_PRICE_ID) {
      return NextResponse.json(
        { error: 'STRIPE_PRICE_ID is not configured in Vercel environment variables.' },
        { status: 500 }
      )
    }

    const { coupon } = await req.json()

    // Derive the app URL from the request so it works in any environment
    // without depending on NEXT_PUBLIC_APP_URL being set correctly.
    const origin =
      req.headers.get('origin') ??
      (req.headers.get('host') ? `https://${req.headers.get('host')}` : null) ??
      process.env.NEXT_PUBLIC_APP_URL ??
      'http://localhost:3000'

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, name')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email!,
        name: profile?.name || '',
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const sessionParams: any = {
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: SUBSCRIPTION_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/home?subscription=success`,
      cancel_url: `${origin}/signup`,
      metadata: { supabase_user_id: user.id },
      subscription_data: {
        metadata: { supabase_user_id: user.id },
        trial_period_days: coupon === 'FOUNDING' ? 60 : undefined,
      },
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error?.message ?? 'Internal error' }, { status: 500 })
  }
}
