import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
})

export const PLANS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
  yearly: process.env.STRIPE_YEARLY_PRICE_ID,
} as const

export async function createCheckoutSession(
  customerId: string,
  plan: 'monthly' | 'yearly',
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  const priceId = PLANS[plan]
  
  if (!priceId) {
    throw new Error(`Invalid plan: ${plan}`)
  }

  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { user_id: userId, plan },
  })
}

export async function createCustomer(email: string, userId: string) {
  return stripe.customers.create({
    email,
    metadata: { user_id: userId },
  })
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
  }
  
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}