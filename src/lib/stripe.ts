import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any,
  typescript: true,
})

export const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_PRICE_ID!
export const SUBSCRIPTION_AMOUNT = 3499 // $34.99 in cents
export const FOUNDING_COUPON = 'FOUNDING'
