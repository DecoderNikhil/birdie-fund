import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/client'
import { constructWebhookEvent } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const event = constructWebhookEvent(body, signature)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.user_id
        const plan = session.metadata?.plan
        const customerId = session.customer

        if (userId) {
          await sql`
            INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_start, current_period_end)
            VALUES (${userId}, ${customerId}, ${session.subscription}, ${plan}, 'active', NOW(), NOW() + INTERVAL '1 month')
            ON CONFLICT (user_id) DO UPDATE SET
              stripe_customer_id = ${customerId},
              stripe_subscription_id = ${session.subscription},
              plan = ${plan},
              status = 'active',
              updated_at = NOW()
          `
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer

        await sql`
          UPDATE subscriptions
          SET status = ${subscription.status === 'active' ? 'active' : 'inactive'},
            current_period_start = ${subscription.current_period_start},
            current_period_end = ${subscription.current_period_end},
            cancel_at_period_end = ${subscription.cancel_at_period_end},
            updated_at = NOW()
          WHERE stripe_customer_id = ${customerId}
        `
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer

        await sql`
          UPDATE subscriptions
          SET status = 'cancelled',
            updated_at = NOW()
          WHERE stripe_customer_id = ${customerId}
        `
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer

        await sql`
          UPDATE subscriptions
          SET status = 'lapsed',
            updated_at = NOW()
          WHERE stripe_customer_id = ${customerId}
        `
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}